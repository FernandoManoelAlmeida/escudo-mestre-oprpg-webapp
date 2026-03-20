export type PresencaPerturbadora = {
  dt: number;
  dano: string;
  nexImune: number;
};

export type Ataque = {
  nome: string;
  teste: string;
  dano: string;
  obs?: string;
};

export type Acao = {
  tipo: string;
  nome: string;
  ataques?: Ataque[];
  descricao?: string;
};

export type Habilidade = {
  nome: string;
  descricao: string;
};

export type Ameaca = {
  id: string;
  nome: string;
  vd: number;
  caracteristicas: string[];
  presencaPerturbadora?: PresencaPerturbadora;
  pericias?: Record<string, string>;
  defesa: number;
  pv: number;
  machucado?: number;
  resistencias?: string;
  imunidades?: string;
  vulnerabilidades?: string;
  atributos: Record<string, number>;
  deslocamento: string;
  habilidades: Habilidade[];
  acoes: Acao[];
  enigmaMedo?: string;
  dadosMedios?: Record<string, string | number>;
};

export type AmeacasData = {
  ameacas: Ameaca[];
  /** Lista única e normalizada de características (preenchida pelo script de migração). */
  caracteristicasUnicas?: string[];
};

export type OrdenarAmeacasPor = "nome" | "vd";
export type OrdenarSentido = "asc" | "desc";

export type FiltrosAmeacas = {
  texto?: string;
  ordenarPor?: OrdenarAmeacasPor;
  ordenarSentido?: OrdenarSentido;
  /** Múltiplas características: ameaça é exibida se tiver pelo menos uma delas. */
  caracteristicas?: string[];
};

const AMEACAS_URL =
  (process.env.NEXT_PUBLIC_BASE_PATH || "") + "/data/ameacas.json";

let cached: AmeacasData | null = null;

export async function getAmeacas(): Promise<AmeacasData> {
  if (cached) return cached;
  const res = await fetch(AMEACAS_URL);
  if (!res.ok) throw new Error("Falha ao carregar ameaças");
  cached = (await res.json()) as AmeacasData;
  return cached;
}

export function getAmeacaById(data: AmeacasData, id: string): Ameaca | undefined {
  return data.ameacas.find((a) => a.id === id);
}

/** Elementos que definem o tema da ficha (ordem: primeira característica que aparecer). */
export const ELEMENTOS_FICHA = [
  "ENERGIA",
  "SANGUE",
  "CONHECIMENTO",
  "MORTE",
  "MEDO",
] as const;

export type ElementoFicha = (typeof ELEMENTOS_FICHA)[number];

function normalizarParaElemento(s: string): string {
  return s.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Retorna o elemento que define a ficha: a primeira característica que for um dos 5 elementos. */
export function getElementoFromAmeaca(ameaca: Ameaca): ElementoFicha | null {
  for (const c of ameaca.caracteristicas ?? []) {
    const n = normalizarParaElemento(c);
    if ((ELEMENTOS_FICHA as readonly string[]).includes(n)) {
      return n as ElementoFicha;
    }
  }
  return null;
}

/** Monta um texto único com todo o conteúdo da ficha para busca. */
function textoParaBusca(a: Ameaca): string {
  const partes: string[] = [
    a.id,
    a.nome,
    String(a.vd),
    ...(a.caracteristicas ?? []),
    String(a.defesa),
    String(a.pv),
    a.deslocamento,
  ];
  if (a.machucado != null) partes.push(String(a.machucado));
  if (a.resistencias) partes.push(a.resistencias);
  if (a.imunidades) partes.push(a.imunidades);
  if (a.vulnerabilidades) partes.push(a.vulnerabilidades);
  if (a.presencaPerturbadora) {
    partes.push(String(a.presencaPerturbadora.dt), a.presencaPerturbadora.dano, String(a.presencaPerturbadora.nexImune));
  }
  if (a.atributos) {
    Object.entries(a.atributos).forEach(([k, v]) => partes.push(k, String(v)));
  }
  if (a.pericias) {
    Object.entries(a.pericias).forEach(([k, v]) => partes.push(k, v));
  }
  (a.habilidades ?? []).forEach((h) => {
    partes.push(h.nome, h.descricao);
  });
  (a.acoes ?? []).forEach((ac) => {
    partes.push(ac.tipo, ac.nome, ac.descricao ?? "");
    (ac.ataques ?? []).forEach((at) => {
      partes.push(at.nome, at.teste, at.dano, at.obs ?? "");
    });
  });
  if (a.enigmaMedo) partes.push(a.enigmaMedo);
  if (a.dadosMedios) {
    Object.entries(a.dadosMedios).forEach(([k, v]) => partes.push(k, String(v)));
  }
  return partes.filter(Boolean).join(" ").toLowerCase();
}

function normalizarCaracteristica(c: string): string {
  return c.trim().toUpperCase().replace(/\s+/g, " ");
}

/** Lista de características únicas para o dropdown (do JSON ou derivada das ameaças). */
export function getCaracteristicasParaFiltro(data: AmeacasData): string[] {
  if (data.caracteristicasUnicas?.length) return data.caracteristicasUnicas;
  const set = new Set<string>();
  for (const a of data.ameacas) {
    for (const c of a.caracteristicas ?? []) {
      const n = normalizarCaracteristica(c);
      if (n) set.add(n);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export function filterAmeacas(
  data: AmeacasData,
  filters: FiltrosAmeacas
): Ameaca[] {
  let list = [...data.ameacas];

  const q = filters.texto?.trim();
  if (q) {
    const busca = q.toLowerCase();
    list = list.filter((a) => textoParaBusca(a).includes(busca));
  }

  const cars = filters.caracteristicas?.filter((c) => c?.trim());
  if (cars?.length) {
    const normSet = new Set(cars.map((c) => normalizarCaracteristica(c)));
    list = list.filter((a) =>
      (a.caracteristicas ?? []).some((c) => normSet.has(normalizarCaracteristica(c)))
    );
  }

  const ordenarPor = filters.ordenarPor ?? "nome";
  const ordenarSentido = filters.ordenarSentido ?? "asc";

  /** Quando há características selecionadas, ordenar primeiro por "prefixo": fichas cujas
   * características começam exatamente na ordem selecionada vêm primeiro (ex.: seleção
   * [ENERGIA, CONHECIMENTO] → ENERGIA 1ª e CONHECIMENTO 2ª primeiro). */
  const selecaoNorm = cars?.map((c) => normalizarCaracteristica(c)) ?? [];
  function prefixMatchCount(a: Ameaca): number {
    /* v8 ignore next -- o ramo ?? não é exercitado após o filtro por característica */
    const arr = (a.caracteristicas ?? []).map((c) => normalizarCaracteristica(c));
    let i = 0;
    while (i < selecaoNorm.length && i < arr.length && arr[i] === selecaoNorm[i]) i++;
    return i;
  }

  list.sort((a, b) => {
    if (selecaoNorm.length > 0) {
      const scoreA = prefixMatchCount(a);
      const scoreB = prefixMatchCount(b);
      if (scoreB !== scoreA) return scoreB - scoreA;
    }
    if (ordenarPor === "nome") {
      const cmp = a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" });
      return ordenarSentido === "asc" ? cmp : -cmp;
    }
    const cmp = a.vd - b.vd;
    return ordenarSentido === "asc" ? cmp : -cmp;
  });

  return list;
}

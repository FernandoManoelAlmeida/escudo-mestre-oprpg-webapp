import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAmeacaById, filterAmeacas, getAmeacas, getCaracteristicasParaFiltro } from "./ameacas";
import type { AmeacasData, Ameaca } from "./ameacas";

const predador: Ameaca = {
  id: "predador",
  nome: "Predador",
  vd: 140,
  caracteristicas: ["MEDO", "SANGUE", "CRIATURA", "GRANDE"],
  presencaPerturbadora: { dt: 25, dano: "4d8 mental", nexImune: 50 },
  defesa: 28,
  pv: 240,
  machucado: 120,
  atributos: { AGI: 4, FOR: 3, INT: 1, PRE: 2, VIG: 3 },
  deslocamento: "12m",
  habilidades: [],
  acoes: [],
};

const zumbi: Ameaca = {
  id: "zumbi-de-sangue",
  nome: "Zumbi de Sangue",
  vd: 20,
  caracteristicas: ["SANGUE", "CRIATURA", "MÉDIO"],
  defesa: 17,
  pv: 45,
  machucado: 22,
  atributos: { AGI: 2, FOR: 2, INT: 0, PRE: 1, VIG: 2 },
  deslocamento: "9m",
  habilidades: [],
  acoes: [],
};

const pessoa: Ameaca = {
  id: "dissociado",
  nome: "Dissociado",
  vd: 10,
  caracteristicas: ["PESSOA", "MÉDIO"],
  defesa: 15,
  pv: 10,
  atributos: { AGI: 2, FOR: 2, INT: 1, PRE: 1, VIG: 1 },
  deslocamento: "9m",
  habilidades: [],
  acoes: [],
};

const fixture: AmeacasData = {
  ameacas: [predador, zumbi, pessoa],
};

describe("getAmeacaById", () => {
  it("retorna a ameaça quando o id existe", () => {
    const a = getAmeacaById(fixture, "predador");
    expect(a).toBeDefined();
    expect(a!.nome).toBe("Predador");
    expect(a!.vd).toBe(140);
  });

  it("retorna undefined quando o id não existe", () => {
    expect(getAmeacaById(fixture, "nao-existe")).toBeUndefined();
  });
});

describe("filterAmeacas", () => {
  it("sem filtros retorna todas", () => {
    const list = filterAmeacas(fixture, {});
    expect(list).toHaveLength(3);
  });

  it("texto vazio ou só espaços não filtra", () => {
    expect(filterAmeacas(fixture, { texto: "" })).toHaveLength(3);
    expect(filterAmeacas(fixture, { texto: "   " })).toHaveLength(3);
  });

  it("busca por nome (case insensitive)", () => {
    const list = filterAmeacas(fixture, { texto: "Predador" });
    expect(list).toHaveLength(1);
    expect(list[0]!.id).toBe("predador");
    expect(filterAmeacas(fixture, { texto: "predador" })).toHaveLength(1);
  });

  it("busca por VD encontra ameaças com esse VD", () => {
    const list = filterAmeacas(fixture, { texto: "140" });
    expect(list).toHaveLength(1);
    expect(list[0]!.id).toBe("predador");
  });

  it("busca por característica encontra todas que têm o texto", () => {
    const list = filterAmeacas(fixture, { texto: "SANGUE" });
    expect(list).toHaveLength(2);
    expect(list.map((a) => a.id).sort()).toEqual(["predador", "zumbi-de-sangue"]);
  });

  it("busca PESSOA retorna só Dissociado", () => {
    const list = filterAmeacas(fixture, { texto: "PESSOA" });
    expect(list).toHaveLength(1);
    expect(list[0]!.id).toBe("dissociado");
  });

  it("busca por id encontra a ameaça", () => {
    const list = filterAmeacas(fixture, { texto: "zumbi-de-sangue" });
    expect(list).toHaveLength(1);
    expect(list[0]!.id).toBe("zumbi-de-sangue");
  });

  it("busca por nome de atributo encontra a ameaça (atributos na busca)", () => {
    const list = filterAmeacas(fixture, { texto: "AGI" });
    expect(list.length).toBeGreaterThanOrEqual(1);
    expect(list.some((a) => a.id === "predador")).toBe(true);
  });

  it("busca por texto da presença perturbadora (dano) encontra a ameaça", () => {
    const list = filterAmeacas(fixture, { texto: "mental" });
    expect(list).toHaveLength(1);
    expect(list[0]!.id).toBe("predador");
  });

  it("filtro por uma característica retorna só ameaças com essa característica", () => {
    const list = filterAmeacas(fixture, { caracteristicas: ["SANGUE"] });
    expect(list).toHaveLength(2);
    expect(list.map((a) => a.id).sort()).toEqual(["predador", "zumbi-de-sangue"]);
    expect(filterAmeacas(fixture, { caracteristicas: ["MEDO"] })).toHaveLength(1);
    expect(filterAmeacas(fixture, { caracteristicas: ["PESSOA"] })).toHaveLength(1);
  });

  it("filtro por múltiplas características retorna ameaças que têm pelo menos uma", () => {
    const list = filterAmeacas(fixture, { caracteristicas: ["SANGUE", "PESSOA"] });
    expect(list).toHaveLength(3);
    expect(list.map((a) => a.id).sort()).toEqual(["dissociado", "predador", "zumbi-de-sangue"]);
  });

  it("ordenar por nome A-Z", () => {
    const list = filterAmeacas(fixture, { ordenarPor: "nome", ordenarSentido: "asc" });
    expect(list.map((a) => a.nome)).toEqual(["Dissociado", "Predador", "Zumbi de Sangue"]);
  });

  it("ordenar por nome Z-A", () => {
    const list = filterAmeacas(fixture, { ordenarPor: "nome", ordenarSentido: "desc" });
    expect(list.map((a) => a.nome)).toEqual(["Zumbi de Sangue", "Predador", "Dissociado"]);
  });

  it("ordenar por VD maior para menor", () => {
    const list = filterAmeacas(fixture, { ordenarPor: "vd", ordenarSentido: "desc" });
    expect(list.map((a) => a.vd)).toEqual([140, 20, 10]);
  });

  it("ordenar por VD menor para maior", () => {
    const list = filterAmeacas(fixture, { ordenarPor: "vd", ordenarSentido: "asc" });
    expect(list.map((a) => a.vd)).toEqual([10, 20, 140]);
  });

  it("com características selecionadas, ordena por prefixo: mesma ordem vem primeiro", () => {
    const list = filterAmeacas(fixture, {
      caracteristicas: ["SANGUE"],
      ordenarPor: "nome",
      ordenarSentido: "asc",
    });
    expect(list).toHaveLength(2);
    expect(list.map((a) => a.id)).toEqual(["zumbi-de-sangue", "predador"]);
  });

  it("com duas características, prefere quem tem as duas na ordem selecionada", () => {
    const data: AmeacasData = {
      ameacas: [
        { ...predador, caracteristicas: ["MEDO", "SANGUE", "CRIATURA"] },
        { ...zumbi, caracteristicas: ["SANGUE", "CRIATURA", "MÉDIO"] },
        { ...pessoa, caracteristicas: ["SANGUE", "PESSOA"] },
      ],
    };
    const list = filterAmeacas(data, {
      caracteristicas: ["SANGUE", "CRIATURA"],
      ordenarPor: "vd",
      ordenarSentido: "desc",
    });
    expect(list).toHaveLength(3);
    expect(list[0]!.id).toBe("zumbi-de-sangue");
    expect(list[1]!.id).toBe("dissociado");
    expect(list[2]!.id).toBe("predador");
  });
});

describe("getCaracteristicasParaFiltro", () => {
  it("deriva lista quando caracteristicasUnicas não existe", () => {
    const lista = getCaracteristicasParaFiltro(fixture);
    expect(lista).toContain("MEDO");
    expect(lista).toContain("SANGUE");
    expect(lista).toContain("CRIATURA");
    expect(lista).toContain("MÉDIO");
    expect(lista).toContain("PESSOA");
    expect(lista).toContain("GRANDE");
    expect(lista).toEqual([...lista].sort((a, b) => a.localeCompare(b, "pt-BR")));
  });

  it("usa caracteristicasUnicas quando presente", () => {
    const data: AmeacasData = { ...fixture, caracteristicasUnicas: ["A", "B", "C"] };
    expect(getCaracteristicasParaFiltro(data)).toEqual(["A", "B", "C"]);
  });
});

describe("getAmeacas", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    vi.resetModules();
  });

  it("retorna dados quando fetch é ok", async () => {
    const { getAmeacas: getAmeacasFresh } = await import("./ameacas");
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => fixture,
    });
    const data = await getAmeacasFresh();
    expect(data.ameacas).toHaveLength(3);
    expect(data.ameacas[0]!.nome).toBe("Predador");
  });

  it("lança erro quando fetch não é ok", async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: false });
    await expect(getAmeacas()).rejects.toThrow("Falha ao carregar ameaças");
  });
});

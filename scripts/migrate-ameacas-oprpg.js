#!/usr/bin/env node
/**
 * Migra ameaças de um arquivo Markdown para public/data/ameacas.json.
 * Ameaças que já existem no JSON (por id) são atualizadas com os dados do MD.
 * A tabela de características únicas é sempre renovada a partir das ameacas finais.
 *
 * Uso:
 *   node scripts/migrate-ameacas.js <caminho/para/ameaças.md>
 *   yarn migrate:ameacas ../../Referências/Fichas/Ameaças.md
 *   yarn migrate:ameacas ../ordem-paranormal-desespero/Referências/Fichas/Ameaças.md
 *
 * Flags:
 *   --only id1,id2  Só insere/atualiza os ids listados; os restantes ficam intactos.
 *   --dry-run       Relata novas/atualizadas/ignoradas sem escrever o JSON.
 */
const fs = require("fs");
const path = require("path");
const { writeVersion } = require("./write-version");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const OUT_PATH = path.join(PROJECT_ROOT, "public/data/ameacas.json");

/** Normaliza uma característica para o JSON: trim, maiúsculas, unifica variações. */
function normalizarCaracteristica(c) {
  if (!c || typeof c !== "string") return "";
  const v = c.trim().toUpperCase().replace(/\s+/g, " ").trim();
  // O tamanho é uma só categoria: o livro escreve MÉDIO ou MÉDIA conforme o
  // género da criatura, mas nas fichas/filtros vale sempre MÉDIA.
  if (v === "MÉDIO") return "MÉDIA";
  // Enxame é uma só categoria, escreva o livro "ENXAME", "(ENXAME)" ou
  // "CRIATURA (ENXAME)": nas fichas/filtros fica apenas ENXAME.
  if (v === "ENXAME" || v === "(ENXAME)" || v === "CRIATURA (ENXAME)")
    return "ENXAME";
  return v;
}

function slug(nome) {
  return nome
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\u0300-\u036f/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "");
}

/**
 * Preserva quebras de linha na descrição de ações (ex.: ações que não são Agredir).
 * Colapsa apenas espaços/tabs na mesma linha; normaliza \r\n e limita linhas em branco consecutivas.
 */
function normalizarDescricaoAcao(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseBlock(content) {
  // Comentários Obsidian (%% … %%) são metadados de proveniência no MD —
  // nunca fazem parte da ficha (sem isto, um marcador entre fichas colava-se
  // à descrição da última habilidade da ficha anterior).
  content = content.replace(/%%[\s\S]*?%%/g, "");
  const lines = content.split("\n").map((l) => l.trim());
  const getLine = (pat) => lines.find((l) => l.match(pat));
  const getNum = (pat) => {
    const m = getLine(pat)?.match(/(-?\d+)/);
    return m ? parseInt(m[1], 10) : undefined;
  };

  const nomeMatch = content.match(/^##\s+(.+?)$/m);
  let nome = nomeMatch ? nomeMatch[1].trim().replace(/^#+\s*/, "") : "";
  if (!nome || nome === "Modelo" || nome === "dano mental leva em conta")
    return null;
  if (nome === "Vulto" && content.includes("VD 40 WIP")) return null;

  const vd = getNum(/^VD\s+(\d+)/);
  if (vd === undefined && !nome.toLowerCase().includes("modelo")) return null;

  // Características: linha logo após "VD N" no MD (formato "X - Y - Z", pode ter acentos ex: MÉDIO)
  const vdIndex = lines.findIndex((l) => /^VD\s+\d+/.test(l));
  let carLine = null;
  if (vdIndex >= 0) {
    for (let i = vdIndex + 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      if (
        line.startsWith("PRESENÇA") ||
        line.startsWith("DEFESA") ||
        line.startsWith("###") ||
        line.startsWith("PONTOS") ||
        line.startsWith("DESLOCAMENTO") ||
        /^\d+\)/.test(line)
      )
        break;
      if (line.includes(" - ") && line.length > 2) {
        carLine = line;
        break;
      }
    }
  }
  const caracteristicas = carLine
    ? [
        // Sem duplicados após a normalização (ex.: MÉDIO+MÉDIA na mesma linha)
        ...new Set(
          carLine
            .split(/\s*-\s*/)
            .map((c) => normalizarCaracteristica(c.trim()))
            .filter(Boolean),
        ),
      ]
    : [];

  let presencaPerturbadora;
  const ppMatch = content.match(
    /PRESENÇA PERTURBADORA\s*\n\s*DT\s+(\d+)\s*-\s*([\dd+\s-]+)\s*mental\s*-\s*NEX\s+(\d+)%\+/i,
  );
  if (ppMatch) {
    presencaPerturbadora = {
      dt: parseInt(ppMatch[1], 10),
      dano: ppMatch[2].trim() + " mental",
      nexImune: parseInt(ppMatch[3], 10),
    };
  }

  const pericias = {};
  const perSec = content.match(
    /### Perícias\s*\n([\s\S]*?)(?=\n###|\nDEFESA|\nPRESENÇA|\nPONTOS|$)/i,
  );
  if (perSec) {
    const formulaRegex = /-?\d*d\d+([+-]\d+)?/i;
    for (const line of perSec[1].split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (/cegas|Penumbra|escuro|^Faro,|^Visão\s/i.test(trimmed)) continue;
      // Linhas podem trazer várias perícias separadas por "|" ou "•"
      // (ex.: "Fortitude 3d20+10 | Reflexos: 2d20+5", "Percepção d20 • Iniciativa d20").
      for (const segmentRaw of trimmed.split(/\s*[|•]\s*/)) {
        const segment = segmentRaw.replace(/[–—]/g, "-").trim();
        if (!segment) continue;
        if (/cegas|penumbra|escuro|^faro\b|^visão\b/i.test(segment)) continue;
        const formulaMatch = segment.match(formulaRegex);
        if (!formulaMatch) continue;
        const formula = formulaMatch[0].replace(/\s/g, "");
        const name = segment
          .slice(0, formulaMatch.index)
          .trim()
          .replace(/[:：]\s*$/, "")
          .trim();
        if (name && formula) pericias[name] = formula;
      }
    }
  }

  const defLine = getLine(/DEFESA/);
  const defesaMatch = defLine?.match(/DEFESA\s+(\d+)/);
  const defesa = defesaMatch
    ? parseInt(defesaMatch[1], 10)
    : defLine?.includes("-")
      ? 0
      : undefined;
  const pvLine = getLine(/PONTOS DE VIDA\s+(\d+)/);
  const pv = pvLine ? parseInt(pvLine.match(/(\d+)/)[1], 10) : undefined;
  const machucadoMatch = content.match(/Machucado\s+(\d+)/);
  const machucado = machucadoMatch
    ? parseInt(machucadoMatch[1], 10)
    : undefined;

  let resistencias, imunidades, vulnerabilidades;
  const resLine = getLine(/^RESISTÊNCIAS?\s*[:]?\s*(.+)/i);
  if (resLine)
    resistencias = resLine.replace(/^RESISTÊNCIAS?\s*[:]?\s*/i, "").trim();
  const immLine = getLine(/^IMUNIDADES?\s*[:]?\s*(.+)/i);
  if (immLine)
    imunidades = immLine.replace(/^IMUNIDADES?\s*[:]?\s*/i, "").trim();
  const vulnLine = getLine(/^VULNERABILIDADES?\s*[:]?\s*(.+)/i);
  if (vulnLine)
    vulnerabilidades = vulnLine
      .replace(/^VULNERABILIDADES?\s*[:]?\s*/i, "")
      .trim();

  const attrLine = getLine(/AGI\s+[\d-]+.*FOR.*INT.*PRE.*VIG/);
  const atributos = {};
  if (attrLine) {
    const parts = attrLine.split(/\s*\|\s*/);
    for (const p of parts) {
      const m = p.trim().match(/^([A-Z]+)\s+([-]?\d+|[-—–])$/);
      if (m) {
        const val = /^[-—–]$/.test(m[2]) ? 0 : parseInt(m[2], 10);
        atributos[m[1]] = val;
      }
    }
  }

  const deslMatch = content.match(/DESLOCAMENTO\s+([\s\S]+?)(?=\n\n|\n###|$)/i);
  let deslocamento = deslMatch ? deslMatch[1].trim().replace(/\r\n/g, "\n").replace(/\r/g, "\n") : "";

  const habilidades = [];
  const habSec = content.match(
    /### Habilidades\s*\n([\s\S]*?)(?=\n### Ações|\n### Enigma|\n### Dados|### Poderes|$)/,
  );
  if (habSec) {
    const habParts = habSec[1]
      .split(
        /\n(?=[A-ZÀ-ÚÃÕÂÊÎÔÛÁÉÍÓÚÇ][A-ZÀ-ÚÃÕÂÊÎÔÛÁÉÍÓÚÇ0-9\s\-()\/]*$)/m,
      )
      .filter(Boolean);
    for (const part of habParts) {
      const p = part.trim();
      const nameMatch = p.match(
        /^([A-ZÀ-ÚÃÕÂÊÎÔÛÁÉÍÓÚÇ][A-ZÀ-ÚÃÕÂÊÎÔÛÁÉÍÓÚÇ0-9\s\-()\/]*)$/m,
      );
      if (nameMatch) {
        const nomeHab = nameMatch[1].trim();
        const desc = p.replace(nomeHab, "").trim();
        if (desc.length > 5)
          habilidades.push({
            nome: nomeHab,
            descricao: desc
              .replace(/\r\n/g, "\n")
              .replace(/\r/g, "\n")
              .replace(/[ \t]+/g, " ")
              .replace(/\n{3,}/g, "\n\n")
              .trim()
              .replace(/mut### Ações/g, "mutações")
              .replace(/### Ações/g, "ações")
              .replace(/manifest### Ações/g, "manifestações"),
          });
      }
    }
  }

  const acoes = [];
  const acaoSec = content.match(
    /### Ações\s*\n([\s\S]*?)(?=\n### Enigma|\n### Dados|### Poderes|$)/,
  );
  if (acaoSec) {
    const text = acaoSec[1];
    const acaoBlocks = text
      .split(/\n(?=(?:PADRÃO|REAÇÃO|LIVRE|MOVIMENTO|COMPLETA)\s*[-–]\s*[A-Z])/m)
      .filter(Boolean);
    for (const block of acaoBlocks) {
      const tipoNome = block.match(
        /^(PADRÃO|REAÇÃO|LIVRE|MOVIMENTO|COMPLETA)\s*[-–]\s*(.+?)(?:\n|$)/m,
      );
      if (!tipoNome) continue;
      const tipo = tipoNome[1].trim();
      const nomeAcao = tipoNome[2].trim().split("\n")[0].trim();
      const ataques = [];
      const ataqueLines = block.matchAll(
        />\s*([^>]+?)\s*\n\s*>\s*TESTE\s+([^|]+?)\s*\|\s*DANO\s+([^\n]+)/g,
      );
      for (const atk of ataqueLines) {
        const obsMatch = atk[1].match(/(x\d+)|(crítico[^|]*)/i);
        const testeRaw = atk[2].trim();
        const testeFormula = (testeRaw.match(/[\dd+\s+-]+/) || [""])[0]
          .replace(/\s/g, "")
          .trim();
        ataques.push({
          nome: atk[1]
            .replace(/\s*Corpo a corpo.*$/i, "")
            .replace(/\s*à distância.*$/i, "")
            .trim(),
          teste: testeFormula || testeRaw.replace(/\s/g, "").replace(/\|/g, ""),
          dano: atk[3].trim(),
          obs: obsMatch ? obsMatch[1] || obsMatch[2]?.trim() : null,
        });
      }
      const descMatch = block
        .replace(/>[^>]+/g, "")
        .replace(tipo + " - " + nomeAcao, "")
        .replace(tipo + " – " + nomeAcao, "")
        .trim();
      const descNormalizada = normalizarDescricaoAcao(descMatch);
      const descricao =
        descNormalizada.length > 20
          ? descNormalizada.slice(0, 8000)
          : undefined;
      acoes.push({
        tipo,
        nome: nomeAcao,
        ataques: ataques.length ? ataques : null,
        descricao: descricao || null,
      });
    }
    // Fallback: fichas com ações por estado (ex.: Ciborgue — "ESTADO ALPHA\n<texto>")
    // não usam cabeçalhos PADRÃO/REAÇÃO/...; cada estado vira uma ação com a descrição.
    if (!acoes.length) {
      const estadoBlocks = text
        .split(/\n(?=ESTADO\s+[A-ZÀ-Ú]+\s*$)/m)
        .filter(Boolean);
      for (const block of estadoBlocks) {
        const m = block.match(/^ESTADO\s+([A-ZÀ-Ú]+)\s*\n([\s\S]*)$/);
        if (!m) continue;
        const desc = normalizarDescricaoAcao(m[2]);
        if (desc.length > 10)
          acoes.push({
            tipo: "ESTADO",
            nome: m[1].trim(),
            ataques: null,
            descricao: desc.slice(0, 8000),
          });
      }
    }
  }

  // Fichas compactas do livro: os dados mecânicos que faltam nas secções
  // estruturadas estão em prosa em "### Descrição (livro)". Extrai só o que
  // a prosa traz (atributos, deslocamento, RD, ataques, perícias d20 e
  // habilidades), sem inventar: a primeira frase é flavour e é ignorada.
  const descLivroMatch = content.match(
    /### Descrição \(livro\)\s*\n([\s\S]*?)(?=\n###|\n##\s|$)/,
  );
  if (descLivroMatch) {
    const prosa = descLivroMatch[1].replace(/\s+/g, " ").trim();
    const frases = prosa
      .split(/\.\s+(?=[A-ZÀ-Ú])/)
      .map((f) => f.trim().replace(/\.$/, ""))
      .filter(Boolean);

    if (!Object.keys(atributos).length) {
      for (const m of prosa.matchAll(
        /\b(Agi|For|Int|Pre|Vig)\s+(-?\d+|—|–)/gi,
      )) {
        const key = { agi: "AGI", for: "FOR", int: "INT", pre: "PRE", vig: "VIG" }[
          m[1].toLowerCase()
        ];
        if (key) atributos[key] = /^\d/.test(m[2]) || /^-\d/.test(m[2]) ? parseInt(m[2], 10) : 0;
      }
    }
    {
      const dm = prosa.match(/Deslocamento\s+([^.;]+)/i);
      // O regex estrutural pode ter capturado a frase inteira da prosa;
      // nesse caso (texto com frases) vale a captura curta do livro.
      if (dm && (!deslocamento || deslocamento.includes(".")))
        deslocamento = dm[1].trim();
    }
    if (!resistencias) {
      const rd = prosa.match(/\bRD\s+([^.;]+)/);
      if (rd) resistencias = `RD ${rd[1].trim()}`;
    }

    const ataquesLivro = [];
    const atkMatch = prosa.match(/Ataques?:\s*([\s\S]*?)(?=\.\s+[A-ZÀ-Ú][a-zà-ú]+\s|$)/);
    if (atkMatch && !acoes.length) {
      const lista = atkMatch[1];
      for (const m of lista.matchAll(
        /([A-ZÀ-Ú][A-Za-zÀ-ú ]*?)\s*\(([^)]+)\)/g,
      )) {
        const partes = m[2].split(",").map((s) => s.trim());
        const teste = partes.find((p) => /^-?\d*d\d+/.test(p));
        const danoParte = partes.find(
          (p) => /^\d+d\d+/.test(p) && p !== teste,
        );
        if (!teste || !danoParte) continue;
        const crit = partes.find((p) => /crítico/i.test(p));
        ataquesLivro.push({
          nome: m[1].trim(),
          teste: teste.replace(/\s/g, ""),
          dano: danoParte,
          obs: crit || null,
        });
      }
      if (ataquesLivro.length)
        acoes.push({
          tipo: "PADRÃO",
          nome: "AGREDIR",
          ataques: ataquesLivro,
          descricao: null,
        });
    }

    frases.forEach((frase, idx) => {
      if (idx === 0) return; // flavour
      if (/^(Percepção|Iniciativa|Defesa|PV)\b/.test(frase)) return;
      if (/^(Agi|For|Int|Pre|Vig)\b/.test(frase)) return;
      if (/^Deslocamento\b/i.test(frase)) return;
      if (/^Ataques?:/.test(frase)) return;
      // Perícias d20 em prosa ("Crime 2d20+5, Furtividade 2d20+5",
      // "Sobrevivência O+10" — O é o d20 do livro).
      for (const seg of frase.split(/,\s+(?=[A-ZÀ-Ú])/)) {
        const pm = seg.match(
          /^([A-ZÀ-Ú][A-Za-zÀ-ú ]+?)\s+(-?\d*d20(?:[+-]\d+)?|O(?:[+-]\d+)?)$/,
        );
        if (pm && !/^(Ataque|Agi|For|Int|Pre|Vig)$/i.test(pm[1].trim())) {
          const nomePer = pm[1].trim();
          const formula = pm[2].startsWith("O")
            ? `d20${pm[2].slice(1)}`
            : pm[2];
          if (!(nomePer in pericias)) pericias[nomePer] = formula;
        }
      }
      {
        const hm = frase.match(/^([^:]{3,45}):\s*(.+)$/);
        if (hm) {
          const nomeHab = hm[1].split("(")[0].trim().toUpperCase();
          if (
            !habilidades.some((h) => h.nome === nomeHab) &&
            hm[2].trim().length > 5
          )
            habilidades.push({
              nome: nomeHab,
              descricao: hm[2].trim().replace(/\)$/, ""),
            });
          return;
        }
        const paren = frase.match(
          /^([A-ZÀ-Ú][A-Za-zÀ-ú ]{3,35})\s*\((.+)\)$/,
        );
        if (paren) {
          const nomeHab = paren[1].trim().toUpperCase();
          if (!habilidades.some((h) => h.nome === nomeHab))
            habilidades.push({ nome: nomeHab, descricao: paren[2].trim() });
          return;
        }
        const bonus = frase.match(
          /^([A-ZÀ-Ú][A-Za-zÀ-ú ]{3,35})\s+([+-].+)$/,
        );
        if (bonus) {
          const nomeHab = bonus[1].trim().toUpperCase();
          if (!habilidades.some((h) => h.nome === nomeHab))
            habilidades.push({ nome: nomeHab, descricao: frase });
          return;
        }
        // Continuação da habilidade anterior (frase sem nome próprio).
        if (habilidades.length) {
          const ultima = habilidades[habilidades.length - 1];
          ultima.descricao = `${ultima.descricao}. ${frase}`;
        }
      }
    });
  }

  const enigmaMatch = content.match(
    /### Enigma de Medo\s*\n\s*\*?([\s\S]*?)\*?(?=\n###|$)/,
  );
  const enigmaMedo = enigmaMatch
    ? enigmaMatch[1].trim().replace(/\s+/g, " ").replace(/\*/g, "")
    : undefined;

  const dadosMatch = content.match(
    /### Dados Médios\s*\n([\s\S]*?)(?=\n##\s|$)/,
  );
  const dadosMedios = {};
  if (dadosMatch) {
    for (const line of dadosMatch[1].split("\n")) {
      const m = line.match(/^([^:]+):\s*(.+)$/);
      if (m) dadosMedios[m[1].trim()] = m[2].trim();
    }
  }

  if (defesa === undefined || pv === undefined) return null;

  return {
    id: slug(nome),
    nome: nome.replace(/-/g, " "),
    vd: vd ?? 0,
    caracteristicas: caracteristicas.length ? caracteristicas : [],
    presencaPerturbadora: presencaPerturbadora ?? null,
    pericias: Object.keys(pericias).length ? pericias : null,
    defesa: defesa ?? 0,
    pv: pv ?? 0,
    machucado: machucado ?? null,
    resistencias: resistencias ?? null,
    imunidades: imunidades ?? null,
    vulnerabilidades: vulnerabilidades ?? null,
    atributos: Object.keys(atributos).length ? atributos : {},
    deslocamento: deslocamento || "",
    habilidades: habilidades.length ? habilidades : [],
    acoes: acoes.length ? acoes : [],
    enigmaMedo: enigmaMedo ?? null,
    dadosMedios: Object.keys(dadosMedios).length ? dadosMedios : null,
  };
}

function parseOnlyArg(args) {
  const idx = args.indexOf("--only");
  if (idx < 0) return null;
  const val = args[idx + 1];
  if (!val || val.startsWith("--")) {
    console.error("Erro: --only requer uma lista de ids separados por vírgula.");
    process.exit(1);
  }
  return new Set(
    val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

function main() {
  const args = process.argv.slice(2).filter((a) => a && a !== "");
  const dryRun = args.includes("--dry-run");
  const only = parseOnlyArg(args);
  const mdPathArg = args.find(
    (a, i) => !a.startsWith("--") && args[i - 1] !== "--only",
  );

  if (!mdPathArg) {
    console.error(
      "Uso: node scripts/migrate-ameacas.js <caminho/para/ameaças.md> [--only id1,id2] [--dry-run]",
    );
    process.exit(1);
  }

  const mdPath = path.isAbsolute(mdPathArg)
    ? mdPathArg
    : path.resolve(process.cwd(), mdPathArg);

  if (!fs.existsSync(mdPath)) {
    console.error("Arquivo não encontrado:", mdPath);
    process.exit(1);
  }

  let existing = { ameacas: [] };
  if (fs.existsSync(OUT_PATH)) {
    try {
      const raw = JSON.parse(fs.readFileSync(OUT_PATH, "utf8"));
      existing.ameacas = Array.isArray(raw.ameacas) ? raw.ameacas : [];
      // caracteristicasUnicas é sempre renovada mais abaixo; não preservar a existente.
    } catch (e) {
      console.error("Erro ao ler JSON existente:", e.message);
      process.exit(1);
    }
  }

  const md = fs.readFileSync(mdPath, "utf8");
  const sections = md.split(/\n##\s+/).filter(Boolean);
  const parsedFromMd = [];

  for (const sec of sections) {
    const block = parseBlock("## " + sec);
    if (block && block.vd > 0) parsedFromMd.push(block);
  }

  const existingById = new Map(existing.ameacas.map((a) => [a.id, a]));
  const added = [];
  const updated = [];
  const changed = [];
  const ignored = [];

  for (const ameaca of parsedFromMd) {
    const id = ameaca.id;
    if (!id) continue;
    if (only && !only.has(id)) {
      ignored.push(id);
      continue;
    }

    const prev = existingById.get(id);
    if (prev) {
      if (JSON.stringify(prev) !== JSON.stringify(ameaca)) changed.push(id);
      existingById.set(id, ameaca);
      updated.push(id);
    } else {
      existingById.set(id, ameaca);
      added.push(id);
    }
  }

  if (only) {
    const parsedIds = new Set(parsedFromMd.map((a) => a.id));
    const missingOnly = [...only].filter((id) => !parsedIds.has(id));
    if (missingOnly.length)
      console.log(
        "  Aviso: ids em --only sem ficha parseável no MD:",
        missingOnly.join(", "),
      );
  }

  const ameacas = Array.from(existingById.values());

  // Renovar a tabela de características: não usar a existente no JSON; repopular só a partir das ameacas.
  const setCar = new Set();
  for (const a of ameacas) {
    if (Array.isArray(a.caracteristicas)) {
      for (const c of a.caracteristicas) {
        const n = normalizarCaracteristica(c);
        if (n) setCar.add(n);
      }
    }
  }
  const caracteristicasUnicas = Array.from(setCar).sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );

  if (dryRun) {
    console.log("Dry-run (nada foi escrito).");
    console.log("  Total no JSON após migração:", ameacas.length);
    console.log("  Características únicas:", caracteristicasUnicas.length);
    if (added.length) console.log("  Novas:", added.join(", "));
    if (changed.length)
      console.log("  Atualizadas com diferenças:", changed.join(", "));
    if (ignored.length)
      console.log(`  Ignoradas (fora de --only): ${ignored.length}`);
    return;
  }

  fs.writeFileSync(
    OUT_PATH,
    JSON.stringify({ ameacas, caracteristicasUnicas }, null, 2),
    "utf8",
  );

  console.log("Migração concluída.");
  console.log("  Total no JSON:", ameacas.length);
  console.log("  Características únicas:", caracteristicasUnicas.length);
  if (added.length) console.log("  Novas:", added.join(", "));
  if (updated.length)
    console.log("  Atualizadas a partir do MD:", updated.join(", "));
  if (ignored.length)
    console.log(`  Ignoradas (fora de --only): ${ignored.length}`);

  writeVersion(PROJECT_ROOT);
}

if (require.main === module) {
  main();
}

module.exports = {
  normalizarCaracteristica,
  slug,
  normalizarDescricaoAcao,
  parseBlock,
  parseOnlyArg,
};

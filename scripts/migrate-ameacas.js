#!/usr/bin/env node
/**
 * Migra ameaças de um arquivo Markdown para public/data/ameacas.json.
 * Ameaças que já existem no JSON (por id) são atualizadas com os dados do MD.
 * A tabela de características únicas é sempre renovada a partir das ameacas finais.
 *
 * Uso:
 *   node scripts/migrate-ameacas.js <caminho/para/ameaças.md>
 *   yarn migrate:ameacas ../../Referências e Regras/Fichas/Ameaças.md
 */
const fs = require("fs");
const path = require("path");
const { writeVersion } = require("./write-version");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const OUT_PATH = path.join(PROJECT_ROOT, "public/data/ameacas.json");

/** Normaliza uma característica para o JSON: trim, maiúsculas, unifica variações. */
function normalizarCaracteristica(c) {
  if (!c || typeof c !== "string") return "";
  return c.trim().toUpperCase().replace(/\s+/g, " ").trim();
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
  const lines = content.split("\n").map((l) => l.trim());
  const getLine = (pat) => lines.find((l) => l.match(pat));
  const getNum = (pat) => {
    const m = getLine(pat)?.match(/(-?\d+)/);
    return m ? parseInt(m[1], 10) : undefined;
  };

  const nomeMatch = content.match(/^##\s+(.+?)$/m);
  let nome = nomeMatch ? nomeMatch[1].trim().replace(/^#+\s*/, "") : "";
  if (!nome || nome === "Modelo" || nome === "dano mental leva em conta") return null;
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
      if (line.startsWith("PRESENÇA") || line.startsWith("DEFESA") || line.startsWith("###") || line.startsWith("PONTOS") || line.startsWith("DESLOCAMENTO") || /^\d+\)/.test(line)) break;
      if (line.includes(" - ") && line.length > 2) {
        carLine = line;
        break;
      }
    }
  }
  const caracteristicas = carLine
    ? carLine
        .split(/\s*-\s*/)
        .map((c) => normalizarCaracteristica(c.trim()))
        .filter(Boolean)
    : [];

  let presencaPerturbadora;
  const ppMatch = content.match(/PRESENÇA PERTURBADORA\s*\n\s*DT\s+(\d+)\s*-\s*([\dd+\s-]+)\s*mental\s*-\s*NEX\s+(\d+)%\+/i);
  if (ppMatch) {
    presencaPerturbadora = {
      dt: parseInt(ppMatch[1], 10),
      dano: ppMatch[2].trim() + " mental",
      nexImune: parseInt(ppMatch[3], 10),
    };
  }

  const pericias = {};
  const perSec = content.match(/### Perícias\s*\n([\s\S]*?)(?=\n###|\nDEFESA|\nPRESENÇA|\nPONTOS|$)/i);
  if (perSec) {
    const formulaRegex = /-?\d*d\d+([+-]\d+)?/i;
    for (const line of perSec[1].split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (/cegas|Penumbra|escuro|^Faro,|^Visão\s/i.test(trimmed)) continue;
      const formulaMatch = trimmed.match(formulaRegex);
      if (!formulaMatch) continue;
      const formula = formulaMatch[0].replace(/\s/g, "");
      const name = trimmed.slice(0, formulaMatch.index).trim();
      if (name && formula) pericias[name] = formula;
    }
  }

  const defLine = getLine(/DEFESA/);
  const defesaMatch = defLine?.match(/DEFESA\s+(\d+)/);
  const defesa = defesaMatch ? parseInt(defesaMatch[1], 10) : (defLine?.includes("-") ? 0 : undefined);
  const pvLine = getLine(/PONTOS DE VIDA\s+(\d+)/);
  const pv = pvLine ? parseInt(pvLine.match(/(\d+)/)[1], 10) : undefined;
  const machucadoMatch = content.match(/Machucado\s+(\d+)/);
  const machucado = machucadoMatch ? parseInt(machucadoMatch[1], 10) : undefined;

  let resistencias, imunidades, vulnerabilidades;
  const resLine = getLine(/^RESISTÊNCIAS?\s*[:]?\s*(.+)/i);
  if (resLine) resistencias = resLine.replace(/^RESISTÊNCIAS?\s*[:]?\s*/i, "").trim();
  const immLine = getLine(/^IMUNIDADES?\s*[:]?\s*(.+)/i);
  if (immLine) imunidades = immLine.replace(/^IMUNIDADES?\s*[:]?\s*/i, "").trim();
  const vulnLine = getLine(/^VULNERABILIDADES?\s*[:]?\s*(.+)/i);
  if (vulnLine) vulnerabilidades = vulnLine.replace(/^VULNERABILIDADES?\s*[:]?\s*/i, "").trim();

  const attrLine = getLine(/AGI\s+[\d-]+.*FOR.*INT.*PRE.*VIG/);
  const atributos = {};
  if (attrLine) {
    const parts = attrLine.split(/\s*\|\s*/);
    for (const p of parts) {
      const m = p.trim().match(/^([A-Z]+)\s+([-]?\d+|[-])$/);
      if (m) {
        const val = m[2] === "-" ? 0 : parseInt(m[2], 10);
        atributos[m[1]] = val;
      }
    }
  }

  const deslMatch = content.match(/DESLOCAMENTO\s+(.+)$/im);
  const deslocamento = deslMatch ? deslMatch[1].trim() : "";

  const habilidades = [];
  const habSec = content.match(/### Habilidades\s*\n([\s\S]*?)(?=\n### Ações|\n### Enigma|$)/);
  if (habSec) {
    const habParts = habSec[1].split(/\n(?=[A-ZÀ-ÚÃÕÂÊÎÔÛÁÉÍÓÚÇ][A-ZÀ-ÚÃÕÂÊÎÔÛÁÉÍÓÚÇ\s\-]*$)/m).filter(Boolean);
    for (const part of habParts) {
      const p = part.trim();
      const nameMatch = p.match(/^([A-ZÀ-ÚÃÕÂÊÎÔÛÁÉÍÓÚÇ][A-ZÀ-ÚÃÕÂÊÎÔÛÁÉÍÓÚÇ\s\-]*)$/m);
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
  const acaoSec = content.match(/### Ações\s*\n([\s\S]*?)(?=\n### Enigma|\n### Dados|### Poderes|$)/);
  if (acaoSec) {
    const text = acaoSec[1];
    const acaoBlocks = text
      .split(/\n(?=(?:PADRÃO|REAÇÃO|LIVRE|MOVIMENTO|COMPLETA)\s*[-–]\s*[A-Z])/m)
      .filter(Boolean);
    for (const block of acaoBlocks) {
      const tipoNome = block.match(/^(PADRÃO|REAÇÃO|LIVRE|MOVIMENTO|COMPLETA)\s*[-–]\s*(.+?)(?:\n|$)/m);
      if (!tipoNome) continue;
      const tipo = tipoNome[1].trim();
      const nomeAcao = tipoNome[2].trim().split("\n")[0].trim();
      const ataques = [];
      const ataqueLines = block.matchAll(/>\s*([^>]+?)\s*\n\s*>\s*TESTE\s+([^|]+?)\s*\|\s*DANO\s+([^\n]+)/g);
      for (const atk of ataqueLines) {
        const obsMatch = atk[1].match(/(x\d+)|(crítico[^|]*)/i);
        const testeRaw = atk[2].trim();
        const testeFormula = (testeRaw.match(/[\dd+\s+-]+/) || [""])[0].replace(/\s/g, "").trim();
        ataques.push({
          nome: atk[1]
            .replace(/\s*Corpo a corpo.*$/i, "")
            .replace(/\s*à distância.*$/i, "")
            .trim(),
          teste: testeFormula || testeRaw.replace(/\s/g, "").replace(/\|/g, ""),
          dano: atk[3].trim(),
          obs: obsMatch ? (obsMatch[1] || obsMatch[2]?.trim()) : null,
        });
      }
      const descMatch = block
        .replace(/>[^>]+/g, "")
        .replace(tipo + " - " + nomeAcao, "")
        .replace(tipo + " – " + nomeAcao, "")
        .trim();
      const descNormalizada = normalizarDescricaoAcao(descMatch);
      const descricao =
        descNormalizada.length > 20 ? descNormalizada.slice(0, 8000) : undefined;
      acoes.push({
        tipo,
        nome: nomeAcao,
        ataques: ataques.length ? ataques : null,
        descricao: descricao || null,
      });
    }
  }

  const enigmaMatch = content.match(/### Enigma de Medo\s*\n\s*\*?([\s\S]*?)\*?(?=\n###|$)/);
  const enigmaMedo = enigmaMatch
    ? enigmaMatch[1].trim().replace(/\s+/g, " ").replace(/\*/g, "")
    : undefined;

  const dadosMatch = content.match(/### Dados Médios\s*\n([\s\S]*?)(?=\n##\s|$)/);
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

function main() {
  const args = process.argv.slice(2).filter((a) => a && a !== "");
  const mdPathArg = args.find((a) => !a.startsWith("--"));

  if (!mdPathArg) {
    console.error("Uso: node scripts/migrate-ameacas.js <caminho/para/ameaças.md>");
    process.exit(1);
  }

  const mdPath = path.isAbsolute(mdPathArg) ? mdPathArg : path.resolve(process.cwd(), mdPathArg);

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

  for (const ameaca of parsedFromMd) {
    const id = ameaca.id;
    if (!id) continue;

    if (existingById.has(id)) {
      existingById.set(id, ameaca);
      updated.push(id);
    } else {
      existingById.set(id, ameaca);
      added.push(id);
    }
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
  const caracteristicasUnicas = Array.from(setCar).sort((a, b) => a.localeCompare(b, "pt-BR"));

  fs.writeFileSync(
    OUT_PATH,
    JSON.stringify({ ameacas, caracteristicasUnicas }, null, 2),
    "utf8"
  );

  console.log("Migração concluída.");
  console.log("  Total no JSON:", ameacas.length);
  console.log("  Características únicas:", caracteristicasUnicas.length);
  if (added.length) console.log("  Novas:", added.join(", "));
  if (updated.length) console.log("  Atualizadas a partir do MD:", updated.join(", "));

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
};

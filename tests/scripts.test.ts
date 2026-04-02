import { describe, it, expect, vi } from "vitest";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const require = createRequire(import.meta.url);

describe("scripts/write-version", () => {
  const { writeVersion } = require("../scripts/write-version.js");

  it("grava version.json com buildId fallback", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "em-wv-"));
    const payload = writeVersion(dir, {
      now: () => "2020-01-01T00:00:00.000Z",
    });
    expect(payload.generatedAt).toBe("2020-01-01T00:00:00.000Z");
    expect(payload.buildId).toMatch(/^build-/);
    const raw = fs.readFileSync(
      path.join(dir, "public", "version.json"),
      "utf8",
    );
    expect(JSON.parse(raw).buildId).toBe(payload.buildId);
  });

  it("usa BUILD_ID quando .next/BUILD_ID existe", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "em-wv2-"));
    const nextDir = path.join(dir, ".next");
    fs.mkdirSync(nextDir, { recursive: true });
    fs.writeFileSync(path.join(nextDir, "BUILD_ID"), "abc123\n", "utf8");
    const payload = writeVersion(dir);
    expect(payload.buildId).toBe("abc123");
  });

  it("atualiza out/version.json quando a pasta out/ existe (export estático)", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "em-wv3-"));
    fs.mkdirSync(path.join(dir, "public"), { recursive: true });
    fs.mkdirSync(path.join(dir, "out"), { recursive: true });
    fs.writeFileSync(
      path.join(dir, "out", "version.json"),
      '{"buildId":"velho"}\n',
      "utf8",
    );
    const payload = writeVersion(dir, {
      now: () => "2021-01-01T00:00:00.000Z",
    });
    const outRaw = fs.readFileSync(
      path.join(dir, "out", "version.json"),
      "utf8",
    );
    expect(JSON.parse(outRaw).buildId).toBe(payload.buildId);
    expect(JSON.parse(outRaw).generatedAt).toBe("2021-01-01T00:00:00.000Z");
  });
});

describe("scripts/migrate-ameacas", () => {
  const {
    normalizarCaracteristica,
    slug,
    normalizarDescricaoAcao,
    parseBlock,
  } = require("../scripts/migrate-ameacas.js");

  it("normalizarCaracteristica", () => {
    expect(normalizarCaracteristica("  a b  ")).toBe("A B");
    expect(normalizarCaracteristica("")).toBe("");
  });

  it("slug", () => {
    expect(slug("Olá Mundo!")).toBe("ola-mundo");
  });

  it("normalizarDescricaoAcao", () => {
    expect(normalizarDescricaoAcao("  linha  \n  outra  ")).toContain("linha");
  });

  it("parseBlock correctly handles DESLOCAMENTO with ❏", () => {
    const md = `
## Zombi de Sangue
VD 20
SANGUE - MÉDIO
### Perícias
Luta 1d20+5
PONTOS DE VIDA 40 | Machucado 20
DEFESA 15
AGI 1 | FOR 2 | INT 0 | PRE 1 | VIG 2
DESLOCAMENTO 9m | 6 ❏
### Ações
PADRÃO - Mordida
> Correr
> TESTE 1d20+5 | DANO 1d8+2
    `;
    const result = parseBlock(md);
    expect(result.deslocamento).toBe("9m | 6 ❏");
  });
});

describe("scripts/migrate-regras", () => {
  const {
    slug,
    anchor,
    parseMeta,
    parseMarkdownTable,
    extractFirstTableBlock,
  } = require("../scripts/migrate-regras.js");

  it("slug e anchor", () => {
    expect(slug("Teste A")).toBe("teste-a");
    expect(anchor("1", "Nome")).toBe("1-nome");
  });

  it("parseMeta lê título e descrição", () => {
    const md = "# Meu Escudo\n\nDescrição curta.\n\n## 1. Seção";
    const meta = parseMeta(md);
    expect(meta.title).toBe("Meu Escudo");
    expect(meta.description).toContain("Descrição");
  });

  it("parseMeta lê Fontes e sources:", () => {
    const md = "# T\n\nFontes: A, B\n\n## 1. X";
    const meta = parseMeta(md);
    expect(meta.sources).toEqual(["A", "B"]);
    const md2 = "# T\n\nsources: X; Y\n\n## 1. X";
    expect(parseMeta(md2).sources).toEqual(["X", "Y"]);
  });

  it("parseMarkdownTable valida separador e parseia linhas", () => {
    expect(parseMarkdownTable("| a |\n")).toBeNull();
    const t = parseMarkdownTable("| Col | DT |\n| --- | --- |\n| x | 12 |\n");
    expect(t?.headers).toEqual(["Col", "DT"]);
    expect(t?.rows[0]).toMatchObject({ col: "x", dt: 12 });
  });

  it("parseMarkdownTable rejeita separador inválido", () => {
    expect(parseMarkdownTable("| a | b |\n| x | y |\n")).toBeNull();
  });

  it("extractFirstTableBlock extrai e rest", () => {
    const text = "Antes\n| a | b |\n| - | - |\n| 1 | 2 |\nDepois";
    const ex = extractFirstTableBlock(text);
    expect(ex?.tableBlock).toContain("| a | b |");
    expect(ex?.rest).toContain("Depois");
    expect(extractFirstTableBlock("sem tabela")).toBeNull();
  });
});

describe("scripts/init-twa", () => {
  const { runInitTwa } = require("../scripts/init-twa.js");

  it("chama npx bubblewrap com MANIFEST_URL", () => {
    const execSync = vi.fn();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "em-twa-"));
    runInitTwa({
      execSyncImpl: execSync,
      env: { MANIFEST_URL: "https://exemplo.com/manifest.json" },
      rootDir: dir,
    });
    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining("@bubblewrap/cli"),
      expect.objectContaining({ cwd: path.join(dir, "android-twa") }),
    );
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const require = createRequire(import.meta.url);

describe("scripts/write-version", () => {
  const {
    writeVersion,
    assertPagesServiceWorker,
  } = require("../scripts/write-version.js");

  beforeEach(() => {
    vi.stubEnv("GITHUB_PAGES", "");
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

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
    fs.mkdirSync(path.join(dir, "out", "data"), { recursive: true });
    fs.writeFileSync(
      path.join(dir, "out", "version.json"),
      '{"buildId":"velho"}\n',
      "utf8",
    );
    fs.writeFileSync(
      path.join(dir, "out", "data", "ameacas.json"),
      "[]\n",
      "utf8",
    );
    const payload = writeVersion(dir, {
      now: () => "2021-01-01T00:00:00.000Z",
      skipPagesSwCheck: true,
    });
    const outRaw = fs.readFileSync(
      path.join(dir, "out", "version.json"),
      "utf8",
    );
    expect(JSON.parse(outRaw).buildId).toBe(payload.buildId);
    expect(JSON.parse(outRaw).generatedAt).toBe("2021-01-01T00:00:00.000Z");

    const manifestRaw = fs.readFileSync(
      path.join(dir, "out", "offline-manifest.json"),
      "utf8",
    );
    const manifest = JSON.parse(manifestRaw) as { paths: string[] };
    expect(manifest.paths).toContain("/data/ameacas.json");
    expect(manifest.paths).not.toContain("/version.json");
  });

  it("assertPagesServiceWorker termina build Pages sem sw.js", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "em-wv6-"));
    fs.mkdirSync(path.join(dir, "out"), { recursive: true });
    vi.stubEnv("GITHUB_PAGES", "1");
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/repo");
    const exit = vi
      .spyOn(process, "exit")
      .mockImplementation((code: number | null | undefined) => {
        throw new Error(`exit:${code}`);
      });
    expect(() => assertPagesServiceWorker(dir)).toThrow("exit:1");
    exit.mockRestore();
  });

  it("copia public/sw.js para out/ após o build PWA", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "em-wv4-"));
    fs.mkdirSync(path.join(dir, "public"), { recursive: true });
    fs.mkdirSync(path.join(dir, "out"), { recursive: true });
    fs.writeFileSync(
      path.join(dir, "public", "sw.js"),
      'precacheAndRoute([{url:"/repo/data/x.json"}])',
      "utf8",
    );
    fs.writeFileSync(
      path.join(dir, "out", "sw.js"),
      'precacheAndRoute([{url:"/data/x.json"}])',
      "utf8",
    );
    writeVersion(dir, { skipPagesSwCheck: true });
    expect(fs.readFileSync(path.join(dir, "out", "sw.js"), "utf8")).toContain(
      "/repo/data/x.json",
    );
  });
});

describe("scripts/migrate-ameacas-oprpg", () => {
  const {
    normalizarCaracteristica,
    slug,
    normalizarDescricaoAcao,
    parseBlock,
    parseOnlyArg,
  } = require("../scripts/migrate-ameacas-oprpg.js");

  it("normalizarCaracteristica", () => {
    expect(normalizarCaracteristica("  a b  ")).toBe("A B");
    expect(normalizarCaracteristica("")).toBe("");
  });

  it("normalizarCaracteristica unifica o tamanho MÉDIO como MÉDIA", () => {
    expect(normalizarCaracteristica("MÉDIO")).toBe("MÉDIA");
    expect(normalizarCaracteristica(" médio ")).toBe("MÉDIA");
    expect(normalizarCaracteristica("MÉDIA")).toBe("MÉDIA");
    // Outros valores não são tocados
    expect(normalizarCaracteristica("CRIATURA")).toBe("CRIATURA");
    expect(normalizarCaracteristica("MINÚSCULO")).toBe("MINÚSCULO");
  });

  it("normalizarCaracteristica unifica Enxame apenas como ENXAME", () => {
    expect(normalizarCaracteristica("ENXAME")).toBe("ENXAME");
    expect(normalizarCaracteristica("(Enxame)")).toBe("ENXAME");
    expect(normalizarCaracteristica("Criatura (Enxame)")).toBe("ENXAME");
    expect(normalizarCaracteristica("CRIATURA")).toBe("CRIATURA");
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

  it("parseBlock extrai atributos, ataques e habilidades da Descrição (livro)", () => {
    const md = `
## Bandido
VD 10
PESSOA - MÉDIA
### Perícias
Percepção d20
Iniciativa 2d20+5
DEFESA 14
PONTOS DE VIDA 8
### Descrição (livro)
Criminoso típico, ladrão ou assaltante. Percepção O, Iniciativa 2d20+5. Defesa 14. PV 8. Agi 2, For 2. Crime 2d20+5, Furtividade 2d20+5. Ataque: Faca (corpo a corpo, 2d20+5, 1d4+2 perfuração). Ataque Furtivo +1d6.
    `;
    const result = parseBlock(md);
    expect(result.atributos).toMatchObject({ AGI: 2, FOR: 2 });
    expect(result.pericias.Crime).toBe("2d20+5");
    const agredir = result.acoes.find(
      (a: { tipo: string; nome: string }) =>
        a.tipo === "PADRÃO" && a.nome === "AGREDIR",
    );
    expect(agredir.ataques[0].nome).toBe("Faca");
    expect(agredir.ataques[0].dano).toContain("1d4+2");
    expect(
      result.habilidades.some((h: { nome: string }) =>
        h.nome.toUpperCase().includes("ATAQUE FURTIVO"),
      ),
    ).toBe(true);
  });

  it("parseBlock trata atributo — como 0 e várias perícias na mesma linha", () => {
    const md = `
## Animal de Teste
VD 5
ANIMAL - PEQUENO
DEFESA 12
PONTOS DE VIDA 10
AGI 2 | FOR — | INT 0 | PRE 1 | VIG 1
DESLOCAMENTO 9m
### Perícias
Atletismo: 2d20 • Percepção 2d20+5 | Sobrevivência d20+10
    `;
    const result = parseBlock(md);
    expect(result.atributos.FOR).toBe(0);
    expect(result.pericias.Atletismo).toBe("2d20");
    expect(result.pericias["Percepção"]).toBe("2d20+5");
    expect(result.pericias["Sobrevivência"]).toBe("d20+10");
  });

  it("parseBlock ignora comentários Obsidian %% %% (proveniência)", () => {
    const md = `
## Criatura de Teste
VD 10
CRIATURA - MÉDIA
DEFESA 12
PONTOS DE VIDA 10
AGI 1 | FOR 1 | INT 0 | PRE 1 | VIG 1
DESLOCAMENTO 9m
### Habilidades
VISÃO NO ESCURO
Enxerga no escuro.
%% Arquivos Secretos — AS-01 %%
    `;
    const result = parseBlock(md);
    expect(JSON.stringify(result)).not.toContain("%%");
    expect(JSON.stringify(result)).not.toContain("Arquivos Secretos");
    expect(result.habilidades[0].descricao).toContain("Enxerga no escuro.");
  });

  it("parseOnlyArg devolve null sem --only e o conjunto de ids com --only", () => {
    expect(parseOnlyArg(["ficheiro.md"])).toBeNull();
    const only = parseOnlyArg(["ficheiro.md", "--only", "bandido, lobo ,,"]);
    expect([...only].sort()).toEqual(["bandido", "lobo"]);
  });
});

describe("scripts/migrate-regras-oprpg", () => {
  const {
    slug,
    anchor,
    parseMeta,
    parseMarkdownTable,
    extractFirstTableBlock,
  } = require("../scripts/migrate-regras-oprpg.js");

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

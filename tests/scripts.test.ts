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
    const payload = writeVersion(dir, { now: () => "2020-01-01T00:00:00.000Z" });
    expect(payload.generatedAt).toBe("2020-01-01T00:00:00.000Z");
    expect(payload.buildId).toMatch(/^build-/);
    const raw = fs.readFileSync(path.join(dir, "public", "version.json"), "utf8");
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
});

describe("scripts/migrate-ameacas", () => {
  const { normalizarCaracteristica, slug, normalizarDescricaoAcao } = require("../scripts/migrate-ameacas.js");

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
});

describe("scripts/migrate-regras", () => {
  const { slug, anchor, parseMeta } = require("../scripts/migrate-regras.js");

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

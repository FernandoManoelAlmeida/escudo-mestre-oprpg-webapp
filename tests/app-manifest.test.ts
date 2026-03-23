import { describe, it, expect, vi, afterEach } from "vitest";

describe("app/manifest", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("retorna manifest PWA com ícones prefixados pelo base path", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/meu-repo");
    const mod = await import("@/app/manifest");
    const m = mod.default();
    expect(m.name).toContain("Escudo do Mestre");
    expect(m.start_url).toBe("/meu-repo/");
    expect(m.scope).toBe("/meu-repo/");
    expect(m.icons[0]?.src).toBe("/meu-repo/icons/icon-192.webp");
    expect(m.icons[1]?.src).toBe("/meu-repo/icons/icon-512.webp");
  });

  it("com base path vazio usa URLs na raiz", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
    vi.resetModules();
    const mod = await import("@/app/manifest");
    const m = mod.default();
    expect(m.start_url).toBe("/");
    expect(m.icons[0]?.src).toBe("/icons/icon-192.webp");
  });
});

import { describe, it, expect } from "vitest";
import { includeUrlInPrecacheManifest } from "./pwaPrecacheFilter";

describe("includeUrlInPrecacheManifest", () => {
  it("exclui chunks e manifests do Next em /_next/static/", () => {
    expect(
      includeUrlInPrecacheManifest("/repo/_next/static/chunks/main-abc.js"),
    ).toBe(false);
    expect(
      includeUrlInPrecacheManifest("/repo/_next/static/xyz/_buildManifest.js"),
    ).toBe(false);
  });

  it("mantém dados, ícones e assets públicos", () => {
    expect(includeUrlInPrecacheManifest("/repo/data/ameacas.json")).toBe(true);
    expect(includeUrlInPrecacheManifest("/repo/icons/icon-192.webp")).toBe(true);
    expect(includeUrlInPrecacheManifest("/repo/version.json")).toBe(true);
    expect(includeUrlInPrecacheManifest("/repo/swe-worker-abc.js")).toBe(true);
  });

  it("ignora query string e origem absoluta", () => {
    expect(
      includeUrlInPrecacheManifest(
        "https://x.github.io/repo/_next/static/chunks/a.js?v=1",
      ),
    ).toBe(false);
    expect(
      includeUrlInPrecacheManifest("https://x.github.io/repo/icons/a.webp"),
    ).toBe(true);
  });
});

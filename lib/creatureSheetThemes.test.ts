import { describe, it, expect } from "vitest";
import { theme } from "./theme";
import { getCreatureSheetTheme } from "./creatureSheetThemes";
import type { ElementoFicha } from "./ameacas";

const elementos: ElementoFicha[] = [
  "SANGUE",
  "MORTE",
  "ENERGIA",
  "CONHECIMENTO",
  "MEDO",
];

describe("getCreatureSheetTheme", () => {
  it("retorna tema padrão para null", () => {
    expect(getCreatureSheetTheme(null)).toBe(theme);
  });

  it("retorna tema Sangue quando elemento é SANGUE", () => {
    const t = getCreatureSheetTheme("SANGUE");
    expect(t.colors.primary).toBe("#990000");
  });

  it("retorna tema Morte quando elemento é MORTE", () => {
    const t = getCreatureSheetTheme("MORTE");
    expect(t.colors.primary).toBe("#ffffff");
    expect(t.colors.rollButton).toBe("#8B1A1A");
  });

  it("retorna tema Energia quando elemento é ENERGIA", () => {
    const t = getCreatureSheetTheme("ENERGIA");
    expect(t.colors.primary).toBe("#A033FF");
  });

  it("retorna tema Conhecimento quando elemento é CONHECIMENTO", () => {
    const t = getCreatureSheetTheme("CONHECIMENTO");
    expect(t.colors.primary).toBe("#D4AF37");
  });

  it("retorna tema Medo quando elemento é MEDO", () => {
    const t = getCreatureSheetTheme("MEDO");
    expect(t.colors.primary).toBe("#4D96EB");
  });
});

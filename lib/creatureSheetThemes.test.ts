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
    expect(t.colors.primary).toBe("#A82626");
  });

  it("retorna tema Morte quando elemento é MORTE", () => {
    const t = getCreatureSheetTheme("MORTE");
    expect(t.colors.primary).toBe("#FFFFFF");
    expect(t.colors.rollButton).toBe("#9C3C3C");
  });

  it("retorna tema Energia quando elemento é ENERGIA", () => {
    const t = getCreatureSheetTheme("ENERGIA");
    expect(t.colors.primary).toBe("#AE52FF");
  });

  it("retorna tema Conhecimento quando elemento é CONHECIMENTO", () => {
    const t = getCreatureSheetTheme("CONHECIMENTO");
    expect(t.colors.primary).toBe("#DABB55");
  });

  it("retorna tema Medo quando elemento é MEDO", () => {
    const t = getCreatureSheetTheme("MEDO");
    expect(t.colors.primary).toBe("#68A6EE");
  });

  it("expõe sheetBody (corpo da ficha) por elemento", () => {
    expect(getCreatureSheetTheme("SANGUE").colors.sheetBody).toBe("#792626");
    expect(getCreatureSheetTheme("MORTE").colors.sheetBody).toBe("#303030");
    expect(getCreatureSheetTheme("ENERGIA").colors.sheetBody).toBe("#7E47AF");
    expect(getCreatureSheetTheme("CONHECIMENTO").colors.sheetBody).toBe(
      "#786C43",
    );
    expect(getCreatureSheetTheme("MEDO").colors.sheetBody).toBe("#5577A0");
    expect(getCreatureSheetTheme(null).colors.sheetBody).toBe("#0e1419");
  });
});

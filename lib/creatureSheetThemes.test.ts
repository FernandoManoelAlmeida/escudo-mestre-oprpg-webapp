import { describe, it, expect } from "vitest";
import { theme } from "./theme";
import { getCreatureSheetTheme } from "./creatureSheetThemes";
import type { ElementoFicha } from "./ameacas";

const elementos: ElementoFicha[] = ["SANGUE", "MORTE", "ENERGIA", "CONHECIMENTO", "MEDO"];

describe("getCreatureSheetTheme", () => {
  it("retorna tema padrão para null", () => {
    expect(getCreatureSheetTheme(null)).toBe(theme);
  });

  it("cada elemento da ficha retorna tema com cores definidas", () => {
    for (const el of elementos) {
      const t = getCreatureSheetTheme(el);
      expect(t.colors.primary).toBeTruthy();
      expect(t.colors.background).toBeTruthy();
    }
  });
});

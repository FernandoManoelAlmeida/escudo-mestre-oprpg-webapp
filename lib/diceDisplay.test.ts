import { describe, it, expect } from "vitest";
import {
  parseDiceTokensFromFormula,
  parseDiceTokensFromText,
  ariaLabelForRoll,
  diceIconSides,
} from "./diceDisplay";

describe("lib/diceDisplay", () => {
  it("converte fórmula simples em tokens", () => {
    expect(parseDiceTokensFromFormula("2d20+5")).toEqual({
      tokens: [{ count: 2, sides: 20 }],
      modifier: 5,
    });
    expect(parseDiceTokensFromFormula("d20")).toEqual({
      tokens: [{ count: 1, sides: 20 }],
      modifier: 0,
    });
    expect(parseDiceTokensFromFormula("3d6")).toEqual({
      tokens: [{ count: 3, sides: 6 }],
      modifier: 0,
    });
  });

  it("contagem negativa vira N dados (pior de Nd20)", () => {
    expect(parseDiceTokensFromFormula("-2d20")).toEqual({
      tokens: [{ count: 2, sides: 20 }],
      modifier: 0,
    });
  });

  it("rejeita fórmulas inválidas", () => {
    expect(parseDiceTokensFromFormula("abc")).toBeNull();
    expect(parseDiceTokensFromFormula("")).toBeNull();
  });

  it("extrai a fórmula de texto de dano", () => {
    expect(parseDiceTokensFromText("2d6 mental")).toEqual({
      tokens: [{ count: 2, sides: 6 }],
      modifier: 0,
    });
    expect(parseDiceTokensFromText("sem dados")).toBeNull();
  });

  it("aria-label descreve dados e modificador", () => {
    expect(ariaLabelForRoll("2d20+5")).toBe(
      "Rolar 2 dados de vinte faces mais 5",
    );
    expect(ariaLabelForRoll("1d4-1")).toBe(
      "Rolar um dado de quatro faces menos 1",
    );
    expect(ariaLabelForRoll("xyz")).toBe("Rolar dados");
  });

  it("diceIconSides só aceita dados do jogo", () => {
    expect(diceIconSides(6)).toBe(6);
    expect(diceIconSides(100)).toBe(100);
    expect(diceIconSides(7)).toBe(20);
  });
});

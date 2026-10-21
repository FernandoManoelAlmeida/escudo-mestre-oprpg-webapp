import {
  parseFormula,
  isAllowedDiceSides,
  extractDiceFormula,
} from "@/lib/dice";

export type DiceToken = {
  count: number;
  sides: number;
};

export type ParsedRollFormula = {
  tokens: DiceToken[];
  modifier: number;
};

/**
 * Converte uma fórmula OPRPG (um só grupo, ex.: "3d20+15", "-2d20", "d20")
 * em tokens para representação com ícones. Contagens negativas (pior de
 * Nd20) viram N dados, como no Escudo Shadowdark.
 */
export function parseDiceTokensFromFormula(
  formula: string,
): ParsedRollFormula | null {
  const parsed = parseFormula(formula);
  if (!parsed) return null;
  return {
    tokens: [{ count: Math.abs(parsed.count), sides: parsed.sides }],
    modifier: parsed.modifier,
  };
}

/** Extrai a primeira fórmula de um texto (ex.: "2d6 mental") e converte em tokens. */
export function parseDiceTokensFromText(
  text: string,
): ParsedRollFormula | null {
  const formula = extractDiceFormula(text);
  return formula ? parseDiceTokensFromFormula(formula) : null;
}

const SIDES_LABEL: Record<number, string> = {
  3: "três faces",
  4: "quatro faces",
  6: "seis faces",
  8: "oito faces",
  10: "dez faces",
  12: "doze faces",
  20: "vinte faces",
  100: "cem faces",
};

function tokenAriaLabel(token: DiceToken): string {
  const label = SIDES_LABEL[token.sides] ?? `${token.sides} faces`;
  if (token.count === 1) return `um dado de ${label}`;
  return `${token.count} dados de ${label}`;
}

export function ariaLabelForRoll(formula: string): string {
  const parsed = parseDiceTokensFromFormula(formula);
  if (!parsed || !parsed.tokens.length) return "Rolar dados";
  const parts = parsed.tokens.map(tokenAriaLabel);
  let label = `Rolar ${parts.join(" e ")}`;
  if (parsed.modifier > 0) label += ` mais ${parsed.modifier}`;
  if (parsed.modifier < 0) label += ` menos ${Math.abs(parsed.modifier)}`;
  return label;
}

export function diceIconSides(sides: number): number {
  return isAllowedDiceSides(sides) ? sides : 20;
}

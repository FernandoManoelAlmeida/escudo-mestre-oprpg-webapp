"use client";

import styled from "styled-components";
import { DiceIcon } from "@/components/ui/DiceIcon";
import type { ParsedRollFormula } from "@/lib/diceDisplay";
import { parseDiceTokensFromFormula, ariaLabelForRoll } from "@/lib/diceDisplay";

const StyledButton = styled.button`
  background: ${({ theme }) => theme.colors.rollButton};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.text};

  img {
    filter: brightness(0) invert(1);
  }

  &:hover {
    opacity: 0.88;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const StyledSmall = styled(StyledButton)`
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  padding: 0;
`;

type DiceRollIconButtonProps = {
  /** Fórmula OPRPG (ex.: "2d20+5"). Tem prioridade sobre `parsed`. */
  formula?: string;
  /** Tokens já parseados (ex.: a partir de texto com extractDiceFormula). */
  parsed?: ParsedRollFormula | null;
  size?: "default" | "small";
  onClick?: () => void;
  "aria-label"?: string;
  disabled?: boolean;
};

/**
 * Botão de rolagem com um único ícone: o do tipo de dado da fórmula
 * (d20, d6, …). Quantidade, sinais e bónus não são desenhados — a fórmula
 * completa continua no texto ao lado e no aria-label.
 */
export function DiceRollIconButton({
  formula,
  parsed: parsedProp,
  size = "small",
  onClick,
  "aria-label": ariaLabel,
  disabled,
}: DiceRollIconButtonProps) {
  const parsed =
    parsedProp ??
    (formula !== undefined ? parseDiceTokensFromFormula(formula) : null);
  const iconSize = size === "small" ? 20 : 28;
  const sides = parsed?.tokens[0]?.sides ?? 20;

  const defaultLabel =
    ariaLabel ??
    (formula !== undefined && parsed
      ? ariaLabelForRoll(formula)
      : "Rolar d20");

  const Button = size === "small" ? StyledSmall : StyledButton;

  return (
    <Button
      type="button"
      onClick={onClick}
      aria-label={defaultLabel}
      disabled={disabled}
    >
      <DiceIcon sides={sides} size={iconSize} />
    </Button>
  );
}

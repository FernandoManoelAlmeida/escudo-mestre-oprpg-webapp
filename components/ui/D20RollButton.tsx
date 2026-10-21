"use client";

import { DiceRollIconButton } from "@/components/ui/DiceRollIconButton";

type D20RollButtonProps = {
  onClick?: () => void;
  size?: "small" | "default";
  /**
   * Fórmula da rolagem (ex.: "2d20+5", "3d6"): os ícones passam a reflectir
   * os dados reais em vez do d20 genérico. Sem fórmula, mostra um d20.
   */
  formula?: string;
  "aria-label"?: string;
};

/**
 * Invólucro fino sobre DiceRollIconButton: mesmo nome/props de antes, para
 * os call sites existentes. Elimina o PNG externo anterior.
 */
export function D20RollButton({
  onClick,
  size = "default",
  formula,
  "aria-label": ariaLabel,
}: D20RollButtonProps) {
  return (
    <DiceRollIconButton
      onClick={onClick}
      size={size}
      formula={formula}
      aria-label={ariaLabel}
    />
  );
}

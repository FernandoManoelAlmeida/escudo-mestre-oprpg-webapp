"use client";

import styled from "styled-components";
import { assetUrl } from "@/lib/basePath";
import { diceIconSides } from "@/lib/diceDisplay";

const Img = styled.img<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  display: block;
  flex-shrink: 0;
`;

type DiceIconProps = {
  sides: number;
  size?: number;
  className?: string;
};

/**
 * Ícone local de dado (public/icons/dice/dN.svg, Game-icons CC BY 3.0 —
 * ver docs/icon-credits.md). Sem dependência de rede, como no Escudo
 * Shadowdark; antes o app usava um PNG alojado fora do PWA.
 */
export function DiceIcon({ sides, size = 20, className }: DiceIconProps) {
  const s = diceIconSides(sides);
  const src = assetUrl(`/icons/dice/d${s}.svg`);
  return (
    <Img
      $size={size}
      src={src}
      alt=""
      aria-hidden
      className={className}
      draggable={false}
    />
  );
}

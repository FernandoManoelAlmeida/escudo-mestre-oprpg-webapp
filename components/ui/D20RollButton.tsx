"use client";

import styled from "styled-components";

const D20_ICON_URL = "https://crisordemparanormal.com/assets/d20-icon-TtjmS7-Z.png";

const RoundButton = styled.button<{ $size?: "default" | "small" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => ($size === "small" ? "1.5em" : "44px")};
  height: ${({ $size }) => ($size === "small" ? "1.5em" : "44px")};
  padding: 0;
  background: ${({ theme }) => theme.colors.rollButton};
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  flex-shrink: 0;
  font-size: ${({ theme, $size }) => ($size === "small" ? theme.typography.fontSize.sm : "1rem")};

  &:hover {
    background: ${({ theme }) => theme.colors.rollButtonHover};
  }
`;

const Icon = styled.img<{ $size?: "default" | "small" }>`
  width: ${({ $size }) => ($size === "small" ? "1em" : "28px")};
  height: ${({ $size }) => ($size === "small" ? "1em" : "28px")};
  display: block;
  object-fit: contain;
`;

type D20RollButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "default" | "small";
};

export function D20RollButton({ "aria-label": ariaLabel, size = "default", ...props }: D20RollButtonProps) {
  return (
    <RoundButton type="button" $size={size} aria-label={ariaLabel ?? "Rolar dados"} {...props}>
      <Icon src={D20_ICON_URL} alt="" $size={size} />
    </RoundButton>
  );
}

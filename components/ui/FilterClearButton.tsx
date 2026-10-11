"use client";

import styled from "styled-components";

const Btn = styled.button`
  width: 100%;
  min-height: 44px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.borderHighlight};
    background: ${({ theme }) => theme.colors.surfaceHover};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  @media (min-width: 520px) {
    width: auto;
    margin-left: auto;
    display: block;
  }
`;

type Props = {
  onClick: () => void;
  disabled?: boolean;
};

export function FilterClearButton({ onClick, disabled }: Props) {
  return (
    <Btn type="button" onClick={onClick} disabled={disabled} aria-label="Limpar filtros">
      Limpar filtros
    </Btn>
  );
}

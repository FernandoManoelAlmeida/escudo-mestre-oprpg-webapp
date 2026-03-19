"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styled from "styled-components";
import { useRollToast } from "@/context/RollToastContext";
import type { RollResult } from "@/lib/dice";

const toasterShadow = (glow: string) =>
  `0 12px 32px rgba(0, 0, 0, 0.55), 0 0 0 1px ${glow}`;

const Container = styled.div`
  position: fixed;
  bottom: calc(${({ theme }) => theme.bottomNavHeight} + ${({ theme }) => theme.spacing.sm});
  right: ${({ theme }) => theme.spacing.md};
  left: ${({ theme }) => theme.spacing.md};
  max-width: 320px;
  margin-left: auto;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.xs};
  pointer-events: none;
  min-width: 260px;
  min-height: 52px;
  max-height: min(320px, 70vh);
  overflow-y: auto;
  scroll-behavior: smooth;

  @media (min-width: 400px) {
    left: auto;
  }
`;

const List = styled.div`
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  max-height: 280px;
  overflow-y: auto;
`;

const Toast = styled.div<{ $recent?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme, $recent }) =>
    $recent ? theme.colors.surface : theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => toasterShadow(theme.colors.primaryGlow)};
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const ToastLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 2px;
`;

const ToastFormula = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text};
  margin-top: 2px;
`;

const Highlight = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const LastRow = styled.div`
  pointer-events: auto;
  display: flex;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-shrink: 0;
`;

const LastToastWrap = styled.div`
  flex: 1;
  min-width: 0;
`;

const DismissBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  min-width: 36px;
  height: auto;
  align-self: stretch;
  padding: 0;
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  box-shadow: ${({ theme }) => toasterShadow(theme.colors.primaryGlow)};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryGlow};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const TrashIcon = styled.svg.attrs({ viewBox: "0 0 24 24", "aria-hidden": "true" })`
  width: 16px;
  height: 16px;
  fill: currentColor;
`;

function RollDisplay({
  result,
  suffix,
}: {
  result: RollResult;
  suffix?: string;
}) {
  const { rolls, modifier, total, chosenD20 } = result;
  const modToShow =
    chosenD20 != null && total !== chosenD20 ? total - chosenD20 : modifier;
  const modStr =
    modToShow !== 0 ? (modToShow >= 0 ? `+${modToShow}` : String(modToShow)) : "";
  const rollsPart = rolls.map((r, i) =>
    r === chosenD20 ? (
      <Highlight key={i}>{r}</Highlight>
    ) : (
      r
    )
  );
  const suffixPart = suffix ? ` ${suffix}` : "";
  return (
    <>
      [
      {rollsPart.reduce<ReactNode[]>((acc, node, i) => {
        if (i > 0) acc.push(", ");
        acc.push(node);
        return acc;
      }, [])}
      ]{modStr && <> {modStr} </>}= <Highlight>{total}</Highlight>
      {suffixPart}
    </>
  );
}

export default function RollToaster() {
  const { rolls, removeRoll, clearRolls } = useRollToast();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [rolls.length]);

  if (rolls.length === 0) return null;

  const ordered = [...rolls].reverse();
  const oldest = ordered.slice(0, -1);
  const latest = ordered[ordered.length - 1]!;

  return (
    <Container ref={containerRef} role="region" aria-label="Rolagens recentes">
      {oldest.length > 0 && (
        <List>
          {oldest.map((entry) => (
            <Toast
              key={entry.id}
              role="button"
              tabIndex={0}
              onClick={() => removeRoll(entry.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  removeRoll(entry.id);
                }
              }}
              aria-label="Fechar esta rolagem"
            >
              {entry.label && <ToastLabel>{entry.label}</ToastLabel>}
              <ToastFormula>
                <RollDisplay result={entry.result} suffix={entry.suffix} />
              </ToastFormula>
            </Toast>
          ))}
        </List>
      )}
      <LastRow>
        <LastToastWrap>
          <Toast
            $recent
            role="button"
            tabIndex={0}
            onClick={() => removeRoll(latest.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                removeRoll(latest.id);
              }
            }}
            aria-label="Fechar esta rolagem"
          >
            {latest.label && <ToastLabel>{latest.label}</ToastLabel>}
            <ToastFormula>
              <RollDisplay result={latest.result} suffix={latest.suffix} />
            </ToastFormula>
          </Toast>
        </LastToastWrap>
        <DismissBtn
          type="button"
          onClick={clearRolls}
          aria-label="Limpar todas as rolagens"
        >
          <TrashIcon>
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </TrashIcon>
        </DismissBtn>
      </LastRow>
    </Container>
  );
}

"use client";

import { useState } from "react";
import styled from "styled-components";
import {
  rollFormula,
  rollTesteAtributo,
  rollTestePericia,
  parseFormula,
} from "@/lib/dice";
import type { RollResult } from "@/lib/dice";
import { D20RollButton } from "@/components/ui/D20RollButton";

const Page = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 720px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin: 0 0 ${({ theme }) => theme.spacing.md};
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  min-height: 44px;
  width: 120px;
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  min-height: 44px;
`;

const Result = styled.div<{ $success?: boolean; $fail?: boolean }>`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: 600;
  ${({ $success, theme }) => $success && `color: ${theme.colors.success};`}
  ${({ $fail, theme }) => $fail && `color: ${theme.colors.danger};`}
`;

const ResultDetail = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: normal;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export default function RolagensPage() {
  const [formula, setFormula] = useState("2d20+5");
  const [freeResult, setFreeResult] = useState<RollResult | null>(null);

  const [atributo, setAtributo] = useState(2);
  const [dtAtributo, setDtAtributo] = useState("");
  const [atributoResult, setAtributoResult] = useState<RollResult | null>(null);

  const [periciaAtributo, setPericiaAtributo] = useState(2);
  const [periciaBonus, setPericiaBonus] = useState(5);
  const [dtPericia, setDtPericia] = useState("");
  const [periciaResult, setPericiaResult] = useState<RollResult | null>(null);

  const handleRollFree = () => {
    const r = rollFormula(formula);
    setFreeResult(r ?? null);
  };

  const handleRollAtributo = () => {
    const r = rollTesteAtributo(atributo);
    setAtributoResult(r);
  };

  const handleRollPericia = () => {
    const r = rollTestePericia(periciaAtributo, periciaBonus);
    setPericiaResult(r);
  };

  const dtA = dtAtributo ? parseInt(dtAtributo, 10) : null;
  const dtP = dtPericia ? parseInt(dtPericia, 10) : null;

  return (
    <Page>
      <Title>Rolagens</Title>

      <Section>
        <SectionTitle>Rolagem livre</SectionTitle>
        <Row>
          <Input
            type="text"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder="ex: 4d8+8"
            aria-label="Fórmula de dados"
          />
          <D20RollButton onClick={handleRollFree} aria-label="Rolar dados" />
        </Row>
        {freeResult && (
          <Result>
            {freeResult.total}
            <ResultDetail>{freeResult.display}</ResultDetail>
          </Result>
        )}
        {formula && !parseFormula(formula) && (
          <ResultDetail>
            Fórmula inválida. Use algo como 2d20+5 ou 4d8.
          </ResultDetail>
        )}
      </Section>

      <Section>
        <SectionTitle>Teste de atributo</SectionTitle>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-muted, #9a9aa5)",
            marginBottom: "0.5rem",
          }}
        >
          Role 1d20 por ponto no atributo (escolha o maior). Atributo 0: 2d20,
          use o pior.
        </p>
        <Row>
          <label>
            Atributo (0–5):{" "}
            <Select
              value={atributo}
              onChange={(e) => setAtributo(Number(e.target.value))}
              aria-label="Atributo"
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          </label>
          <Input
            type="number"
            placeholder="DT (opcional)"
            value={dtAtributo}
            onChange={(e) => setDtAtributo(e.target.value)}
            aria-label="DT"
          />
          <D20RollButton
            onClick={handleRollAtributo}
            aria-label="Rolar teste de atributo"
          />
        </Row>
        {atributoResult && (
          <Result
            $success={dtA != null ? atributoResult.total >= dtA : undefined}
            $fail={dtA != null ? atributoResult.total < dtA : undefined}
          >
            {dtA != null
              ? atributoResult.total >= dtA
                ? `Sucesso (${atributoResult.total} ≥ ${dtA})`
                : `Falha (${atributoResult.total} &lt; ${dtA})`
              : atributoResult.total}
            <ResultDetail>{atributoResult.display}</ResultDetail>
          </Result>
        )}
      </Section>

      <Section>
        <SectionTitle>Teste de perícia</SectionTitle>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-muted, #9a9aa5)",
            marginBottom: "0.5rem",
          }}
        >
          Xd20 (X = atributo), escolha o maior + bônus (treinado +5, veterano
          +10, expert +15).
        </p>
        <Row>
          <label>
            Atributo:{" "}
            <Select
              value={periciaAtributo}
              onChange={(e) => setPericiaAtributo(Number(e.target.value))}
              aria-label="Atributo base"
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          </label>
          <label>
            Bônus:{" "}
            <Select
              value={periciaBonus}
              onChange={(e) => setPericiaBonus(Number(e.target.value))}
              aria-label="Grau de treinamento"
            >
              <option value={0}>Destreinado (+0)</option>
              <option value={5}>Treinado (+5)</option>
              <option value={10}>Veterano (+10)</option>
              <option value={15}>Expert (+15)</option>
            </Select>
          </label>
          <Input
            type="number"
            placeholder="DT (opcional)"
            value={dtPericia}
            onChange={(e) => setDtPericia(e.target.value)}
            aria-label="DT"
          />
          <D20RollButton
            onClick={handleRollPericia}
            aria-label="Rolar teste de perícia"
          />
        </Row>
        {periciaResult && (
          <Result
            $success={dtP != null ? periciaResult.total >= dtP : undefined}
            $fail={dtP != null ? periciaResult.total < dtP : undefined}
          >
            {dtP != null
              ? periciaResult.total >= dtP
                ? `Sucesso (${periciaResult.total} ≥ ${dtP})`
                : `Falha (${periciaResult.total} &lt; ${dtP})`
              : periciaResult.total}
            <ResultDetail>{periciaResult.display}</ResultDetail>
          </Result>
        )}
      </Section>
    </Page>
  );
}

"use client";

import { useState } from "react";
import styled from "styled-components";
import { rollFormula, parseFormula, isAllowedDiceSides } from "@/lib/dice";
import { useRollToast } from "@/context/RollToastContext";
import { D20RollButton } from "@/components/ui/D20RollButton";

const Page = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 720px;
  margin: 0 auto;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  margin: 0;
`;

const Description = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.6;

  p {
    margin: 0 0 ${({ theme }) => theme.spacing.sm};
  }
  p:last-child {
    margin-bottom: 0;
  }
`;

const RollSection = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const RollSectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin: 0 0 ${({ theme }) => theme.spacing.md};
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  width: 100%;
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  min-height: 44px;
`;

const Hint = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
`;

export default function Home() {
  const [formula, setFormula] = useState("");
  const { addRoll } = useRollToast();

  const parsed = formula ? parseFormula(formula) : null;
  const validFormat = parsed !== null;
  const validDice = validFormat && isAllowedDiceSides(parsed.sides);

  const handleRoll = () => {
    if (!validDice) return;
    const r = rollFormula(formula);
    if (r) addRoll(r);
  };

  return (
    <Page>
      <TitleRow>
        <Title>Ordem Paranormal RPG</Title>
      </TitleRow>
      <Description>
        <p>
          Este é o <strong>Escudo do Mestre</strong>: uma referência rápida para
          mestrar sessões de Ordem Paranormal RPG usando as regras As regras
          selecionadas neste escudo são as do usuário{" "}
          <strong>@progfernando</strong>.
        </p>
        <p>
          Aqui você encontra rolagens de dados na hora, consulta às regras
          mecânicas e tabelas, glossário de termos, homebrews usados e fichas de
          ameaças — tudo em um só lugar, pensado para uso durante o jogo.
        </p>
        <p>
          Todos os direitos de conteúdo e imagem são da{" "}
          <strong>Jambo Editora</strong> e de{" "}
          <strong>Rafael &quot;Cellbit&quot; Lange</strong>. Apoie o RPG
          oficial: compre os livros e acompanhe o conteúdo oficial de Ordem
          Paranormal.
        </p>
      </Description>

      <RollSection>
        <RollSectionTitle>Rolagem rápida</RollSectionTitle>
        <Row>
          <Input
            type="text"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRoll();
            }}
            placeholder="ex: 4d8, 2d20+5, -2d20"
            aria-label="Fórmula de dados"
          />
          <D20RollButton onClick={handleRoll} aria-label="Rolar dados" />
        </Row>
        {formula && !validFormat && (
          <Hint>Fórmula inválida. Use algo como 2d20+5 ou 4d8.</Hint>
        )}
        {formula && validFormat && !validDice && (
          <Hint>Use apenas dados do jogo: d3, d4, d6, d8, d10, d12, d20, d100.</Hint>
        )}
      </RollSection>
    </Page>
  );
}

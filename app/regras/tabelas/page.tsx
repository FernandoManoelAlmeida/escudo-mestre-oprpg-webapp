"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { getEscudo } from "@/lib/escudo";
import type { EscudoData } from "@/lib/escudo";
import { ResponsiveTable } from "@/components/ui/ResponsiveTable";
import { Accordion } from "@/components/ui/Accordion";
import { RegrasTabelasSkeleton } from "@/components/skeletons";

const Page = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 720px;
  margin: 0 auto;
  padding-bottom: calc(${({ theme }) => theme.bottomNavHeight} + ${({ theme }) => theme.spacing.xl});
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: 600;
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text};
`;

const TableBlock = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};

  &:last-child {
    margin-bottom: 0;
  }
`;

const tableLabels: Record<string, string> = {
  termos_importantes: "Termos importantes",
  dificuldades_dt: "Dificuldades (DT)",
  bonus_por_grau_de_treinamento: "Bônus por grau de treinamento",
  efeitos_medo: "Efeitos de medo",
};

function tableTitle(key: string): string {
  if (tableLabels[key]) return tableLabels[key];
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function TabelasPage() {
  const [data, setData] = useState<EscudoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEscudo().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <RegrasTabelasSkeleton />;

  const tables = data.tables ? Object.entries(data.tables) : [];

  return (
    <Page>
      <BackLink href="/regras">← Regras</BackLink>
      <Title>Tabelas</Title>
      {tables.length === 0 ? (
        <p>Nenhuma tabela disponível.</p>
      ) : (
        tables.map(([key, table]) => (
          <TableBlock key={key}>
            <Accordion id={`tabela-${key}`} title={tableTitle(key)}>
              <ResponsiveTable table={table} />
            </Accordion>
          </TableBlock>
        ))
      )}
    </Page>
  );
}

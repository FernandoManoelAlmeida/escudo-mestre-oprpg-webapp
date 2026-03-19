"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { getEscudo, getSection, getTable } from "@/lib/escudo";
import type { EscudoData, EscudoSection } from "@/lib/escudo";
import MarkdownContent from "@/components/ui/MarkdownContent";
import { ResponsiveTable } from "@/components/ui/ResponsiveTable";
import { Accordion } from "@/components/ui/Accordion";
import { RegrasSectionSkeleton } from "@/components/skeletons";

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
  line-height: 1.25;
`;

const Subsection = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};

  &:last-child {
    margin-bottom: 0;
  }
`;

const Subtitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: 600;
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ContentWrap = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  &:last-child {
    margin-bottom: 0;
  }
`;

const FormulaList = styled.ul`
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  padding-left: 1.25rem;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};

  li {
    margin-top: ${({ theme }) => theme.spacing.xs};
  }
`;

type RegrasSectionClientProps = { sectionId: string };

export function RegrasSectionClient({ sectionId }: RegrasSectionClientProps) {
  const [data, setData] = useState<EscudoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEscudo().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <RegrasSectionSkeleton />;

  const section = getSection(data, sectionId);
  if (!section) {
    return (
      <Page>
        <BackLink href="/regras">← Regras</BackLink>
        <Title>§ {sectionId}</Title>
        <p>Seção não encontrada.</p>
      </Page>
    );
  }

  return (
    <Page>
      <BackLink href="/regras">← Regras</BackLink>
      <Title>§ {section.id} — {section.title}</Title>
      {section.subsections.map((sub) => (
        <Subsection key={sub.id}>
          <Subtitle>{sub.id} — {sub.title}</Subtitle>
          {sub.content && (
            <ContentWrap>
              <MarkdownContent>{sub.content}</MarkdownContent>
            </ContentWrap>
          )}
          {sub.formulas && sub.formulas.length > 0 && (
            <FormulaList>
              {sub.formulas.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </FormulaList>
          )}
          {sub.tableRef && (() => {
            const table = getTable(data, sub.tableRef!);
            return table ? (
              <Accordion id={`${sectionId}-${sub.id}-tabela`} title="Ver tabela">
                <ResponsiveTable table={table} />
              </Accordion>
            ) : null;
          })()}
        </Subsection>
      ))}
    </Page>
  );
}

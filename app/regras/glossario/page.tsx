"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { getEscudo } from "@/lib/escudo";
import type { EscudoData, GlossaryItem } from "@/lib/escudo";
import MarkdownContent from "@/components/ui/MarkdownContent";
import InlineBold from "@/components/ui/InlineBold";
import { RegrasGlossarioSkeleton } from "@/components/skeletons";

const Page = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 1000px;
  margin: 0 auto;
  padding-bottom: calc(
    ${({ theme }) => theme.bottomNavHeight} + ${({ theme }) => theme.spacing.xl}
  );
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
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
`;

const Search = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  min-height: 44px;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Item = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const Term = styled.strong`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.primary};
`;

const FullName = styled.span`
  margin-left: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const DescWrap = styled.div`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.5;

  p {
    margin: 0;
  }
`;

export default function GlossarioPage() {
  const [data, setData] = useState<EscudoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getEscudo()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <RegrasGlossarioSkeleton />;

  const glossary = data.glossary ?? [];
  const q = query.trim().toLowerCase();
  const filtered = q
    ? glossary.filter(
        (g) =>
          g.term.toLowerCase().includes(q) ||
          g.fullName.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q),
      )
    : glossary;

  return (
    <Page>
      <BackLink href="/regras">← Regras</BackLink>
      <Title>Glossário</Title>
      <Search
        type="search"
        placeholder="Buscar termo (ex.: AGI, PD, DT…)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Buscar no glossário"
      />
      <List>
        {filtered.length === 0 ? (
          <p>Nenhum termo encontrado.</p>
        ) : (
          filtered.map((g: GlossaryItem) => (
            <Item key={g.term}>
              <Term>
                <InlineBold>{g.term}</InlineBold>
              </Term>
              <FullName>
                {g.fullName != null && g.fullName !== "" ? (
                  <>
                    — <InlineBold>{g.fullName}</InlineBold>
                  </>
                ) : null}
              </FullName>
              {g.description && (
                <DescWrap>
                  <MarkdownContent>{g.description}</MarkdownContent>
                </DescWrap>
              )}
            </Item>
          ))
        )}
      </List>
    </Page>
  );
}

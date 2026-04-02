"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import styled from "styled-components";
import {
  getAmeacas,
  filterAmeacas,
  getCaracteristicasParaFiltro,
} from "@/lib/ameacas";
import type {
  AmeacasData,
  Ameaca,
  OrdenarAmeacasPor,
  OrdenarSentido,
} from "@/lib/ameacas";
import { RasterIconSvg } from "@/components/ui/RasterIconSvg";
import { AmeacasPageSkeleton } from "@/components/skeletons";
import { theme } from "@/lib/theme";

const Page = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  padding-bottom: calc(
    ${({ theme }) => theme.bottomNavHeight} + ${({ theme }) => theme.spacing.xl}
  );
  max-width: 720px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
`;

const FilterPanel = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FilterSection = styled.div`
  &:not(:first-child) {
    margin-top: ${({ theme }) => theme.spacing.md};
    padding-top: ${({ theme }) => theme.spacing.md};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: end;
  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const FilterBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
`;

const FilterLabel = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SearchWrap = styled.div`
  position: relative;
  &::before {
    content: "⌕";
    position: absolute;
    left: ${({ theme }) => theme.spacing.md};
    top: 50%;
    transform: translateY(-50%);
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.textMuted};
    pointer-events: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  padding-left: 2.25rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  min-height: 44px;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryGlow};
  }
`;

const CONTROL_HEIGHT = "40px";

const OrderGroup = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;
  min-height: ${CONTROL_HEIGHT};
`;

const OrderBtn = styled.button<{ $active?: boolean }>`
  padding: 0 ${({ theme }) => theme.spacing.sm};
  height: 32px;
  min-width: 32px;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.background};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.background : theme.colors.text};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.border};
  border-radius: 6px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
  &:hover {
    background: ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.surfaceHover};
    border-color: ${({ theme }) => theme.colors.borderHighlight};
  }
`;

const MultiSelectWrap = styled.div`
  position: relative;
  width: 100%;
`;

const MultiSelectTrigger = styled.button`
  position: relative;
  width: 100%;
  height: ${CONTROL_HEIGHT};
  padding: 0 ${({ theme }) => theme.spacing.md};
  padding-right: 2rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryGlow};
  }
  &::after {
    content: "▾";
    position: absolute;
    right: ${({ theme }) => theme.spacing.sm};
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const MultiSelectTriggerText = styled.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  cursor: pointer;
`;

const MultiSelectPanel = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;
  max-height: 220px;
  overflow-y: auto;
`;

const MultiSelectClearBtn = styled.button`
  display: block;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.borderHighlight};
  }
`;

const MultiSelectOption = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 4px;
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
  input {
    width: 18px;
    height: 18px;
    accent-color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Card = styled(Link)`
  display: block;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  color: inherit;
  text-decoration: none;
  min-height: 44px;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const CardTitle = styled.span`
  font-weight: 600;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const CardMeta = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const ResultCount = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
`;

const FeedbackWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin: 0;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

const FeedbackIcon = styled(RasterIconSvg)`
  width: 80px;
  height: auto;
  display: block;
`;

const FeedbackText = styled.p`
  margin: 0;
  white-space: pre-line;
`;

function FeedbackBlock({
  children,
  showIcon,
}: {
  children: React.ReactNode;
  showIcon?: boolean;
}) {
  return (
    <FeedbackWrapper>
      {showIcon && <FeedbackIcon name="icon-exception" decorative />}
      <FeedbackText>{children}</FeedbackText>
    </FeedbackWrapper>
  );
}

type OrdenarOpcao = {
  value: string;
  label: string;
  shortLabel: string;
  por: OrdenarAmeacasPor;
  sentido: OrdenarSentido;
};

const OPCAO_NOME_ASC: OrdenarOpcao = {
  value: "nome-asc",
  label: "Nome (A → Z)",
  shortLabel: "A→Z",
  por: "nome",
  sentido: "asc",
};
const OPCAO_NOME_DESC: OrdenarOpcao = {
  value: "nome-desc",
  label: "Nome (Z → A)",
  shortLabel: "Z→A",
  por: "nome",
  sentido: "desc",
};
const OPCAO_VD_DESC: OrdenarOpcao = {
  value: "vd-desc",
  label: "VD (maior → menor)",
  shortLabel: "VD ↓",
  por: "vd",
  sentido: "desc",
};
const OPCAO_VD_ASC: OrdenarOpcao = {
  value: "vd-asc",
  label: "VD (menor → maior)",
  shortLabel: "VD ↑",
  por: "vd",
  sentido: "asc",
};

export default function AmeacasPage() {
  const [data, setData] = useState<AmeacasData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [ordenar, setOrdenar] = useState<OrdenarOpcao>(OPCAO_NOME_ASC);
  const [caracteristicasSelecionadas, setCaracteristicasSelecionadas] =
    useState<string[]>([]);
  const [caracteristicasOpen, setCaracteristicasOpen] = useState(false);
  const caracteristicasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAmeacas()
      .then(setData)
      .catch((e) => setError(e?.message ?? "Erro ao carregar"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        caracteristicasRef.current &&
        !caracteristicasRef.current.contains(event.target as Node)
      ) {
        setCaracteristicasOpen(false);
      }
    }
    if (caracteristicasOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [caracteristicasOpen]);

  const toggleCaracteristica = (c: string) => {
    setCaracteristicasSelecionadas((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  };

  if (loading) return <AmeacasPageSkeleton />;
  if (error) {
    return (
      <Page>
        <Title>Ameaças</Title>
        <FeedbackBlock
          showIcon
        >{`Não foi possível carregar os dados.\n${error}`}</FeedbackBlock>
      </Page>
    );
  }
  if (!data) {
    return (
      <Page>
        <Title>Ameaças</Title>
        <FeedbackBlock showIcon>
          Nenhuma ameaça disponível no momento.
        </FeedbackBlock>
      </Page>
    );
  }

  const caracteristicasLista = getCaracteristicasParaFiltro(data);
  const filtered = filterAmeacas(data, {
    texto: busca || undefined,
    ordenarPor: ordenar.por,
    ordenarSentido: ordenar.sentido,
    caracteristicas: caracteristicasSelecionadas.length
      ? caracteristicasSelecionadas
      : undefined,
  });

  return (
    <Page>
      <Title>Ameaças</Title>
      <FilterPanel aria-label="Filtros de ameaças">
        <FilterSection>
          <SearchWrap>
            <SearchInput
              type="search"
              placeholder="Buscar por nome, VD, características…"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              aria-label="Buscar texto nas fichas"
            />
          </SearchWrap>
        </FilterSection>
        <FilterSection>
          <FilterRow>
            <FilterBlock>
              <FilterLabel id="ordenar-label">Ordenar</FilterLabel>
              <OrderGroup role="group" aria-labelledby="ordenar-label">
                <OrderBtn
                  type="button"
                  $active={ordenar.por === "nome"}
                  onClick={() =>
                    setOrdenar(
                      ordenar.por === "nome"
                        ? ordenar.sentido === "asc"
                          ? OPCAO_NOME_DESC
                          : OPCAO_NOME_ASC
                        : OPCAO_NOME_ASC,
                    )
                  }
                  aria-pressed={ordenar.por === "nome"}
                  aria-label={
                    ordenar.por === "nome"
                      ? ordenar.sentido === "asc"
                        ? OPCAO_NOME_ASC.label
                        : OPCAO_NOME_DESC.label
                      : "Ordenar por nome (A→Z); clique para alternar"
                  }
                  title={
                    ordenar.por === "nome"
                      ? ordenar.sentido === "asc"
                        ? OPCAO_NOME_ASC.label
                        : OPCAO_NOME_DESC.label
                      : "Ordenar por nome (clique para alternar entre A→Z e Z→A)"
                  }
                >
                  {ordenar.por === "nome"
                    ? ordenar.sentido === "asc"
                      ? "A→Z"
                      : "Z→A"
                    : "Nome"}
                </OrderBtn>
                <OrderBtn
                  type="button"
                  $active={ordenar.por === "vd"}
                  onClick={() =>
                    setOrdenar(
                      ordenar.por === "vd"
                        ? ordenar.sentido === "desc"
                          ? OPCAO_VD_ASC
                          : OPCAO_VD_DESC
                        : OPCAO_VD_DESC,
                    )
                  }
                  aria-pressed={ordenar.por === "vd"}
                  aria-label={
                    ordenar.por === "vd"
                      ? ordenar.sentido === "desc"
                        ? OPCAO_VD_DESC.label
                        : OPCAO_VD_ASC.label
                      : "Ordenar por VD (maior primeiro); clique para alternar"
                  }
                  title={
                    ordenar.por === "vd"
                      ? ordenar.sentido === "desc"
                        ? OPCAO_VD_DESC.label
                        : OPCAO_VD_ASC.label
                      : "Ordenar por VD (clique para alternar entre maior→menor e menor→maior)"
                  }
                >
                  {ordenar.por === "vd"
                    ? ordenar.sentido === "desc"
                      ? "VD ↓"
                      : "VD ↑"
                    : "VD"}
                </OrderBtn>
              </OrderGroup>
            </FilterBlock>
            <FilterBlock>
              <FilterLabel id="caracteristica-label">
                Características
              </FilterLabel>
              <MultiSelectWrap ref={caracteristicasRef}>
                <MultiSelectTrigger
                  type="button"
                  onClick={() => setCaracteristicasOpen((o) => !o)}
                  aria-expanded={caracteristicasOpen}
                  aria-haspopup="listbox"
                  aria-labelledby="caracteristica-label"
                  id="filtro-caracteristicas"
                  title={
                    caracteristicasSelecionadas.length > 0
                      ? caracteristicasSelecionadas.join(", ")
                      : undefined
                  }
                >
                  <MultiSelectTriggerText>
                    {caracteristicasSelecionadas.length === 0
                      ? "Todas"
                      : caracteristicasSelecionadas.join(", ")}
                  </MultiSelectTriggerText>
                </MultiSelectTrigger>
                {caracteristicasOpen && (
                  <MultiSelectPanel role="listbox" aria-multiselectable>
                    {caracteristicasSelecionadas.length > 0 && (
                      <MultiSelectClearBtn
                        type="button"
                        onClick={() => {
                          setCaracteristicasSelecionadas([]);
                          setCaracteristicasOpen(false);
                        }}
                        aria-label="Limpar seleção de características"
                      >
                        Limpar seleção
                      </MultiSelectClearBtn>
                    )}
                    {caracteristicasLista.map((c) => (
                      <MultiSelectOption key={c}>
                        <input
                          type="checkbox"
                          checked={caracteristicasSelecionadas.includes(c)}
                          onChange={() => toggleCaracteristica(c)}
                          aria-label={c}
                        />
                        {c}
                      </MultiSelectOption>
                    ))}
                  </MultiSelectPanel>
                )}
              </MultiSelectWrap>
            </FilterBlock>
          </FilterRow>
        </FilterSection>
      </FilterPanel>
      <List>
        {filtered.length === 0 ? (
          <FeedbackBlock showIcon>
            {data.ameacas.length === 0
              ? "Nenhuma ameaça disponível no momento."
              : "Nenhum resultado encontrado."}
          </FeedbackBlock>
        ) : (
          <>
            <ResultCount>
              {filtered.length} ameaça{filtered.length !== 1 ? "s" : ""}{" "}
              encontrada{filtered.length !== 1 ? "s" : ""}
            </ResultCount>
            {filtered.map((a: Ameaca) => (
              <Card key={a.id} href={`/ameacas/${a.id}`}>
                <CardTitle>{a.nome}</CardTitle>
                <CardMeta>
                  VD {a.vd}
                  {a.caracteristicas?.length
                    ? ` · ${a.caracteristicas.join(", ")}`
                    : ""}
                </CardMeta>
              </Card>
            ))}
          </>
        )}
      </List>
      <FeedbackText style={{ marginTop: theme.spacing.md }}>
        <small>
          *dano mental dos Dados Médios leva em conta a regra &quot;Jogando sem
          sanidade&quot;
        </small>
      </FeedbackText>
    </Page>
  );
}

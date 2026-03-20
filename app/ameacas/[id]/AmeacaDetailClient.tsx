"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styled, { ThemeProvider } from "styled-components";
import {
  getAmeacas,
  getAmeacaById,
  getElementoFromAmeaca,
} from "@/lib/ameacas";
import { getCreatureSheetTheme } from "@/lib/creatureSheetThemes";
import {
  rollFormula,
  rollTesteAtributo,
  extractDiceFormula,
  extractAllDiceFormulas,
  parseFormula,
} from "@/lib/dice";
import type { Ameaca, Ataque } from "@/lib/ameacas";
import { useRollToast } from "@/context/RollToastContext";
import { D20RollButton } from "@/components/ui/D20RollButton";
import { AmeacaDetailSkeleton } from "@/components/skeletons";
import { RasterIconSvg } from "@/components/ui/RasterIconSvg";
import type { RasterIconName } from "@/lib/rasterIcons";

const Page = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 720px;
  margin: 0 auto;
`;

const CreatureSheetContainer = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
`;

const SheetHeader = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary}22 0%,
    ${({ theme }) => theme.colors.surface} 100%
  );
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
`;

const SheetHeaderText = styled.div`
  flex: 1;
  min-width: 0;
`;

const ELEMENTO_ICON: Record<string, RasterIconName> = {
  ENERGIA: "elemento-energia-icon",
  CONHECIMENTO: "elemento-conhecimento-icon",
  MORTE: "elemento-morte-icon",
  SANGUE: "elemento-sangue-icon",
  MEDO: "elemento-medo-icon",
};

const ElementIcon = styled(RasterIconSvg)`
  flex-shrink: 0;
  height: 48px;
  width: auto;
  display: block;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
`;

const Meta = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin: 0;
`;

const Block = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-of-type {
    border-bottom: none;
  }
`;

const BlockTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
`;

const Text = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  white-space: pre-wrap;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const DadosMedios = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const AcaoItem = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  &:last-child {
    margin-bottom: 0;
  }
`;

const AtaqueLine = styled.div`
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;

const AtaqueRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: ${({ theme }) => theme.spacing.xs} 0;
`;

const AttrButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  min-width: 28px;
  padding: 0;
  background: ${({ theme }) => theme.colors.rollButton};
  color: white;
  border: none;
  border-radius: 50%;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.rollButtonHover};
  }
`;

function getDanoSuffix(danoText: string, formula: string): string {
  const idx = danoText.toUpperCase().indexOf(formula.toUpperCase());
  if (idx === -1) return "";
  return danoText.slice(idx + formula.length).trim();
}

type AmeacaDetailClientProps = { id: string };

export function AmeacaDetailClient({ id }: AmeacaDetailClientProps) {
  const [ameaca, setAmeaca] = useState<Ameaca | null>(null);
  const [loading, setLoading] = useState(true);
  const { addRoll } = useRollToast();

  useEffect(() => {
    getAmeacas()
      .then((data) => setAmeaca(getAmeacaById(data, id) ?? null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRoll = (formula: string, suffix = "", label?: string) => {
    const r = rollFormula(formula);
    if (r) addRoll(r, { suffix, label });
  };

  const handleRollDanoText = (danoText: string, label?: string) => {
    const formula = extractDiceFormula(danoText);
    if (!formula) return;
    const suffix = getDanoSuffix(danoText, formula);
    handleRoll(formula, suffix, label);
  };

  if (loading) return <AmeacaDetailSkeleton />;

  if (!ameaca) {
    return (
      <Page>
        <BackLink href="/ameacas">← Ameaças</BackLink>
        <Title>Ameaça não encontrada</Title>
      </Page>
    );
  }

  const pp = ameaca.presencaPerturbadora;
  const hasPericias =
    ameaca.pericias && Object.keys(ameaca.pericias).length > 0;
  const elemento = getElementoFromAmeaca(ameaca);
  const sheetTheme = getCreatureSheetTheme(elemento);

  const handleRollAtributo = (nome: string, valor: number) => {
    const r = rollTesteAtributo(valor);
    addRoll(r, { label: `${nome} (Teste)` });
  };

  return (
    <Page>
      <BackLink href="/ameacas">← Ameaças</BackLink>
      <ThemeProvider theme={sheetTheme}>
        <CreatureSheetContainer
          className="creature-sheet-container"
          data-elemento={elemento ?? undefined}
        >
          <SheetHeader>
            <SheetHeaderText>
              <Title>{ameaca.nome}</Title>
              <Meta>
                VD {ameaca.vd} · {ameaca.caracteristicas.join(" · ")}
              </Meta>
            </SheetHeaderText>
            {elemento && ELEMENTO_ICON[elemento] && (
              <ElementIcon name={ELEMENTO_ICON[elemento]} decorative />
            )}
          </SheetHeader>

          {pp && (
            <Block>
              <BlockTitle>Presença Perturbadora</BlockTitle>
              <Row>
                <Text style={{ marginBottom: 0 }}>
                  DT {pp.dt} — {pp.dano} — NEX {pp.nexImune}%+ imune
                </Text>
                {extractDiceFormula(pp.dano) && (
                  <D20RollButton
                    size="small"
                    onClick={() =>
                      handleRollDanoText(
                        pp.dano,
                        "Presença Perturbadora (Dano)",
                      )
                    }
                    aria-label="Rolar dano da Presença Perturbadora"
                  />
                )}
              </Row>
            </Block>
          )}

          <Block>
            <BlockTitle>Estatísticas</BlockTitle>
            <Text>DEFESA {ameaca.defesa}</Text>
            <Text>
              PV {ameaca.pv}
              {ameaca.machucado != null
                ? ` | Machucado ${ameaca.machucado}`
                : ""}
            </Text>
            {ameaca.resistencias && (
              <Text>Resistências: {ameaca.resistencias}</Text>
            )}
            {ameaca.imunidades && <Text>Imunidades: {ameaca.imunidades}</Text>}
            {ameaca.vulnerabilidades && (
              <Text>Vulnerabilidades: {ameaca.vulnerabilidades}</Text>
            )}
            {ameaca.atributos && Object.keys(ameaca.atributos).length > 0 && (
              <>
                <Row>
                  <Text style={{ marginBottom: 0 }}>Atributos:</Text>
                </Row>
                <Row style={{ flexWrap: "nowrap" }}>
                  {Object.entries(ameaca.atributos).map(([nome, valor]) => (
                    <Row
                      key={nome}
                      style={{ marginBottom: 0, justifyContent: "center" }}
                    >
                      <Text style={{ marginBottom: 0 }}>{nome}</Text>
                      <AttrButton
                        type="button"
                        onClick={() => handleRollAtributo(nome, valor)}
                        aria-label={`Rolar teste de ${nome} (${valor}d20)`}
                      >
                        {valor}
                      </AttrButton>
                    </Row>
                  ))}
                </Row>
              </>
            )}
            <Text>Deslocamento: {ameaca.deslocamento}</Text>
          </Block>

          {hasPericias && (
            <Block>
              <BlockTitle>Perícias</BlockTitle>
              {Object.entries(ameaca.pericias!).map(([nome, formula]) => (
                <Row key={nome}>
                  <Text style={{ marginBottom: 0 }}>
                    <strong>{nome}:</strong> {formula}
                  </Text>
                  {parseFormula(formula) !== null && (
                    <D20RollButton
                      size="small"
                      onClick={() => handleRoll(formula, "", `${nome} (Teste)`)}
                      aria-label={`Rolar ${nome}`}
                    />
                  )}
                </Row>
              ))}
            </Block>
          )}

          {ameaca.habilidades && ameaca.habilidades.length > 0 && (
            <Block>
              <BlockTitle>Habilidades</BlockTitle>
              {ameaca.habilidades.map((h) => (
                <Text key={h.nome}>
                  <strong>{h.nome}</strong> — {h.descricao}
                </Text>
              ))}
            </Block>
          )}

          <Block>
            <BlockTitle>Ações</BlockTitle>
            {ameaca.acoes.map((acao, i) => (
              <AcaoItem key={i}>
                <Row style={{ alignItems: "center", flexWrap: "wrap" }}>
                  <Text style={{ marginBottom: 0 }}>
                    <strong>
                      {acao.tipo} — {acao.nome}
                    </strong>
                  </Text>
                  {acao.nome.toUpperCase() !== "AGREDIR" &&
                    acao.descricao &&
                    extractAllDiceFormulas(acao.descricao).map((formula) => (
                      <D20RollButton
                        key={formula}
                        size="small"
                        onClick={() => handleRoll(formula, "", acao.nome)}
                        aria-label={`Rolar ${acao.nome}`}
                      />
                    ))}
                </Row>
                {acao.ataques?.map((atk, j) => (
                  <AtaqueBlock
                    key={j}
                    ataque={atk}
                    onRoll={handleRoll}
                    onRollDanoText={(danoText, label) =>
                      handleRollDanoText(danoText, label)
                    }
                  />
                ))}
                {acao.descricao && <Text>{acao.descricao}</Text>}
              </AcaoItem>
            ))}
          </Block>

          {ameaca.enigmaMedo && (
            <Block>
              <BlockTitle>Enigma de Medo</BlockTitle>
              <Text>{ameaca.enigmaMedo}</Text>
            </Block>
          )}

          {ameaca.dadosMedios && Object.keys(ameaca.dadosMedios).length > 0 && (
            <Block>
              <BlockTitle>Dados médios</BlockTitle>
              <DadosMedios>
                {Object.entries(ameaca.dadosMedios).map(([k, v]) => (
                  <span key={k}>
                    {k}: {String(v)}
                  </span>
                ))}
              </DadosMedios>
            </Block>
          )}
        </CreatureSheetContainer>
      </ThemeProvider>
    </Page>
  );
}

type AtaqueBlockProps = {
  ataque: Ataque;
  onRoll: (formula: string, suffix?: string, label?: string) => void;
  onRollDanoText: (danoText: string, label?: string) => void;
};

function AtaqueBlock({ ataque, onRoll, onRollDanoText }: AtaqueBlockProps) {
  const danoFormula = extractDiceFormula(ataque.dano);
  const testeValido = parseFormula(ataque.teste) !== null;

  return (
    <AtaqueLine>
      <Text style={{ marginBottom: 0 }}>
        » {ataque.nome}
        {ataque.obs ? ` (${ataque.obs})` : ""}
      </Text>
      <AtaqueRow>
        <Text style={{ marginBottom: 0 }}>TESTE {ataque.teste}</Text>
        {testeValido && (
          <D20RollButton
            size="small"
            onClick={() => onRoll(ataque.teste, "", `${ataque.nome} (Teste)`)}
            aria-label={`Rolar teste ${ataque.nome}`}
          />
        )}
      </AtaqueRow>
      <AtaqueRow>
        <Text style={{ marginBottom: 0 }}>DANO {ataque.dano}</Text>
        {danoFormula && (
          <D20RollButton
            size="small"
            onClick={() => onRollDanoText(ataque.dano, `${ataque.nome} (Dano)`)}
            aria-label={`Rolar dano ${ataque.nome}`}
          />
        )}
      </AtaqueRow>
    </AtaqueLine>
  );
}

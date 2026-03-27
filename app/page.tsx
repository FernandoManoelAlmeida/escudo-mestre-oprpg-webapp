"use client";

import styled from "styled-components";
import { OrdemParanormalDesesperoLogo } from "@/components/branding/OrdemParanormalDesesperoLogo";
import { REGRAS_CASA_RESUMO } from "@/lib/regrasCasaResumo";

const GITHUB_README_URL =
  "https://github.com/FernandoManoelAlmeida/nerogrado-rpg-repo/blob/master/README.md";

const Page = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 720px;
  margin: 0 auto;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const TitleLink = styled.a`
  display: block;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  line-height: 0;
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: opacity 0.2s;

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    width: 50%;
  }

  &:hover {
    opacity: 0.9;
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 4px;
  }
`;


const HomeLogo = styled(OrdemParanormalDesesperoLogo)`
  width: 100%;
  height: auto;
  display: block;
`;

const Description = styled.div`
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.6;

  p {
    margin: 0 0 ${({ theme }) => theme.spacing.md};
  }
  p:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const RegrasSection = styled.section`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const RegrasList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const RegraItem = styled.li`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  padding: 0 0 ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const RegraTitulo = styled.strong`
  display: block;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const RegraRef = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-left: ${({ theme }) => theme.spacing.xs};
`;

const RegraDescricao = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
`;

const LicenseFooter = styled.footer`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const OGL_OFFICIAL_URL = "https://www.opengamingfoundation.org/ogl.html";

export default function Home() {
  return (
    <Page>
      <TitleRow>
        <TitleLink
          href={GITHUB_README_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir repositório no GitHub (README)"
        >
          <HomeLogo alt="Ordem Paranormal Desespero" />
        </TitleLink>
      </TitleRow>

      <Description>
        <p>
          Este é um <strong>Escudo do Mestre</strong> feito de fã para fã: uma referência rápida para{" "}
          mestrar sessões de Ordem Paranormal RPG.
        </p>
        <p>
          As regras selecionadas neste{" "}
          escudo são as do usuário <strong>@progfernando</strong>,{" "}
          feito sem fins lucrativos, para que todos possam usar.
        </p>
        <p>
          Aqui você encontra rolagens de dados na hora, consulta às regras{" "}
          mecânicas e tabelas, glossário de termos, homebrews usados e fichas de{" "}
          ameaças — tudo em um só lugar, pensado para uso durante o jogo.
        </p>
        <p>
          Apoie o RPG{" "}
          oficial: compre os livros e acompanhe o conteúdo oficial de Ordem
          Paranormal.
        </p>
        <p>
          Todos os direitos de conteúdo e imagem são da{" "}
          <strong>Jambo Editora</strong> e de{" "}
          <strong>Rafael &quot;Cellbit&quot; Lange</strong>.
        </p>
      </Description>

      <RegrasSection aria-labelledby="regras-em-uso">
        <SectionTitle id="regras-em-uso">Regras em uso</SectionTitle>
        <RegrasList aria-label="Resumo das regras da casa e do Suplemento">
          {REGRAS_CASA_RESUMO.map((regra, index) => (
            <RegraItem key={index}>
              <RegraTitulo>
                {regra.titulo}
                {regra.referencia && <RegraRef>({regra.referencia})</RegraRef>}
              </RegraTitulo>
              <RegraDescricao>{regra.descricao}</RegraDescricao>
            </RegraItem>
          ))}
        </RegrasList>
      </RegrasSection>

      <LicenseFooter id="licenca">
        <SectionTitle>Licença</SectionTitle>
        <p>
          Open Game License (OGL): texto completo e identificação{" "}
          <a
            href={OGL_OFFICIAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir Open Game License no site oficial (nova aba)"
          >
            aqui
          </a>
          .
        </p>
      </LicenseFooter>
    </Page>
  );
}

"use client";

import styled from "styled-components";
import Image from "next/image";
import { assetUrl } from "@/lib/basePath";

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
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
`;

const TitleLink = styled.a`
  display: block;
  line-height: 0;
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: opacity 0.2s;
  margin: 0 auto;
  max-width: min(291px, 100%);

  &:hover {
    opacity: 0.9;
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 4px;
  }
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
          <Image
            src={assetUrl("/logo-ordem-paranormal-desespero.png")}
            alt="Ordem Paranormal Desespero"
            width={720}
            height={240}
            priority
            style={{ width: "100%", height: "auto" }}
          />
        </TitleLink>
      </TitleRow>
      <Description>
        <p>
          Este é o <strong>Escudo do Mestre</strong>: uma referência rápida para
          mestrar sessões de Ordem Paranormal RPG. As regras selecionadas neste
          escudo são as do usuário <strong>@progfernando</strong>.
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
    </Page>
  );
}

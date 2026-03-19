"use client";

import styled from "styled-components";

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

export default function Home() {
  return (
    <Page>
      <TitleRow>
        <Title>Ordem Paranormal RPG</Title>
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

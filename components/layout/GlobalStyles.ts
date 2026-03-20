"use client";

import { createGlobalStyle } from "styled-components";

const fallback = {
  typography: { fontFamily: '"Inter", system-ui, sans-serif' },
  colors: { background: "#080c10", text: "#e8ecf0", primary: "#00c8e6", primaryHover: "#00e5ff" },
  headerHeight: "124px",
  bottomNavHeight: "56px",
};

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
  }
  body {
    margin: 0;
    font-family: ${({ theme }) => theme?.typography?.fontFamily ?? fallback.typography.fontFamily};
    color: ${({ theme }) => theme?.colors?.text ?? fallback.colors.text};
    min-height: 100vh;
    min-height: 100dvh;
    /* Base + névoa leve em camadas (gradientes radiais fixos) */
    background-color: ${({ theme }) => theme?.colors?.background ?? fallback.colors.background};
    background-image:
      radial-gradient(ellipse 130% 65% at 15% 88%, rgba(0, 110, 128, 0.154), transparent 52%),
      radial-gradient(ellipse 110% 55% at 88% 72%, rgba(0, 160, 180, 0.099), transparent 48%),
      radial-gradient(ellipse 95% 70% at 48% 42%, rgba(0, 90, 105, 0.066), transparent 58%),
      radial-gradient(ellipse 125% 85% at 50% -18%, rgba(0, 200, 230, 0.088), transparent 55%),
      radial-gradient(ellipse 160% 45% at 50% 108%, rgba(14, 20, 25, 0.605), transparent 55%);
    background-attachment: fixed;
    background-repeat: no-repeat;
  }
  a {
    color: ${({ theme }) => theme?.colors?.primary ?? fallback.colors.primary};
    text-decoration: none;
  }
  a:hover {
    color: ${({ theme }) => theme?.colors?.primaryHover ?? fallback.colors.primaryHover};
  }
  main {
    padding-top: var(--header-height, 124px);
    padding-bottom: ${({ theme }) => theme?.bottomNavHeight ?? fallback.bottomNavHeight};
    min-height: calc(100vh - var(--header-height, 124px) - ${({ theme }) => theme?.bottomNavHeight ?? fallback.bottomNavHeight});
  }
`;

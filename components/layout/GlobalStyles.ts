"use client";

import { createGlobalStyle } from "styled-components";

const fallback = {
  typography: { fontFamily: '"Inter", system-ui, sans-serif' },
  colors: { background: "#080c10", text: "#e8ecf0", primary: "#00c8e6", primaryHover: "#00e5ff" },
  headerHeight: "48px",
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
    background: ${({ theme }) => theme?.colors?.background ?? fallback.colors.background};
    color: ${({ theme }) => theme?.colors?.text ?? fallback.colors.text};
    min-height: 100vh;
    min-height: 100dvh;
    background-image: radial-gradient(ellipse 120% 80% at 50% -20%, rgba(0, 200, 230, 0.06), transparent);
  }
  a {
    color: ${({ theme }) => theme?.colors?.primary ?? fallback.colors.primary};
    text-decoration: none;
  }
  a:hover {
    color: ${({ theme }) => theme?.colors?.primaryHover ?? fallback.colors.primaryHover};
  }
  main {
    min-height: calc(100vh - ${({ theme }) => theme?.headerHeight ?? fallback.headerHeight} - ${({ theme }) => theme?.bottomNavHeight ?? fallback.bottomNavHeight});
    padding-bottom: ${({ theme }) => theme?.bottomNavHeight ?? fallback.bottomNavHeight};
    padding-top: ${({ theme }) => theme?.headerHeight ?? fallback.headerHeight};
  }
`;

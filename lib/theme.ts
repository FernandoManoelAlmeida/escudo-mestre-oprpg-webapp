/**
 * Identidade visual inspirada em estética arcana/mística:
 * base ardósia azulada (fundo #26313D, cartões mais claros que o fundo),
 * destaque em azul elétrico/ciano. Cartões mais claros que o fundo para
 * não ficar "tudo preto"; as fichas têm temas próprios por elemento.
 */
export const theme = {
  colors: {
    background: "#26313D",
    surface: "#303D4A",
    surfaceHover: "#394857",
    sheetBody: "#0e1419",
    text: "#e8ecf0",
    textMuted: "#9DB0C3",
    primary: "#00c8e6",
    primaryHover: "#00e5ff",
    primaryGlow: "rgba(0, 200, 230, 0.35)",
    rollButton: "#00899e",
    rollButtonHover: "#00a8c4",
    border: "#46586B",
    borderHighlight: "rgba(0, 200, 230, 0.4)",
    success: "#22c55e",
    danger: "#ef4444",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  breakpoints: {
    mobile: "320px",
    tablet: "768px",
    desktop: "1024px",
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
    },
  },
  bottomNavHeight: "56px",
  borderRadius: "4px",
} as const;

/** Tipo do tema: mesmas chaves que theme, com valores de cores como string (permite temas derivados com outras cores). */
export type Theme = Omit<typeof theme, "colors"> & {
  colors: { [K in keyof typeof theme.colors]: string };
};

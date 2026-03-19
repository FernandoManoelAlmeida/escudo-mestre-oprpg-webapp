/**
 * Identidade visual inspirada em estética arcana/mística:
 * base escura (azul-marinho/preto), destaque em azul elétrico/ciano.
 */
export const theme = {
  colors: {
    background: "#080c10",
    surface: "#0e1419",
    surfaceHover: "#141c24",
    text: "#e8ecf0",
    textMuted: "#6b7a8c",
    primary: "#00c8e6",
    primaryHover: "#00e5ff",
    primaryGlow: "rgba(0, 200, 230, 0.35)",
    rollButton: "#00899e",
    rollButtonHover: "#00a8c4",
    border: "#1a2530",
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
  headerHeight: "124px",
  borderRadius: "4px",
} as const;

/** Tipo do tema: mesmas chaves que theme, com valores de cores como string (permite temas derivados com outras cores). */
export type Theme = Omit<typeof theme, "colors"> & {
  colors: { [K in keyof typeof theme.colors]: string };
};

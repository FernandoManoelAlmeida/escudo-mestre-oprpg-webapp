import { theme } from "@/lib/theme";
import type { Theme } from "@/lib/theme";
import type { ElementoFicha } from "@/lib/ameacas";

/**
 * Esquema de cores Sangue (referência: ficha Aberração de Carne):
 * vermelho carmim como destaque, fundo preto, texto branco/cinza.
 */
const sangueColors = {
  background: "#000000",
  surface: "#0a0a0a",
  surfaceHover: "#141414",
  text: "#ffffff",
  textMuted: "#a0a0a0",
  primary: "#990000",
  primaryHover: "#b30000",
  primaryGlow: "rgba(153, 0, 0, 0.35)",
  rollButton: "#8B0000",
  rollButtonHover: "#a00",
  border: "#3d0a0a",
  borderHighlight: "rgba(153, 0, 0, 0.5)",
  success: "#22c55e",
  danger: "#cc0000",
} as const;

/** Tema da ficha para o elemento Sangue. */
const sangueTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    ...sangueColors,
  },
};

/**
 * Esquema de cores Morte (referências: Aracnasita, O Deus da Morte):
 * fundo cinza quase preto (#0B0B0B), monocromático (branco/cinza), vermelho oxblood
 * (#8B1A1A) só na barra de vida e em um destaque pontual. Minimalista e sóbrio.
 */
const morteColors = {
  background: "#0B0B0B",
  surface: "#111111",
  surfaceHover: "#1a1a1a",
  text: "#ffffff",
  textMuted: "#a0a0a0",
  primary: "#ffffff",
  primaryHover: "#e0e0e0",
  primaryGlow: "rgba(255, 255, 255, 0.15)",
  rollButton: "#8B1A1A",
  rollButtonHover: "#a02020",
  border: "#1e1e1e",
  borderHighlight: "rgba(255, 255, 255, 0.2)",
  success: "#22c55e",
  danger: "#8B1A1A",
} as const;

/** Tema da ficha para o elemento Morte. */
const morteTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    ...morteColors,
  },
};

/**
 * Esquema de cores Energia (referência: ficha Anfitrião):
 * visual glitch/neon digital, roxo/magenta como destaque principal, ciano como secundário,
 * fundo escuro, barra de vida vermelha.
 */
const energiaColors = {
  background: "#0A0A0A",
  surface: "#121212",
  surfaceHover: "#1a1a1a",
  text: "#ffffff",
  textMuted: "#b0b0b0",
  primary: "#A033FF",
  primaryHover: "#B84DFF",
  primaryGlow: "rgba(160, 51, 255, 0.4)",
  rollButton: "#A033FF",
  rollButtonHover: "#B84DFF",
  border: "rgba(160, 51, 255, 0.5)",
  borderHighlight: "rgba(0, 204, 255, 0.5)",
  success: "#22c55e",
  danger: "#A01A1A",
} as const;

/** Tema da ficha para o elemento Energia. */
const energiaTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    ...energiaColors,
  },
};

/**
 * Esquema de cores Conhecimento (referência: ficha Máscara do Desespero):
 * estética oculta e sofisticada, dourado como destaque (títulos, abas ativas, bordas),
 * fundo carvão/preto, barra de vida vermelho carmim.
 */
const conhecimentoColors = {
  background: "#0D0D0D",
  surface: "#141414",
  surfaceHover: "#1a1a1a",
  text: "#ffffff",
  textMuted: "#a0a0a0",
  primary: "#D4AF37",
  primaryHover: "#E5C158",
  primaryGlow: "rgba(212, 175, 55, 0.35)",
  rollButton: "#D4AF37",
  rollButtonHover: "#E5C158",
  border: "rgba(212, 175, 55, 0.4)",
  borderHighlight: "rgba(212, 175, 55, 0.6)",
  success: "#22c55e",
  danger: "#8B0000",
} as const;

/** Tema da ficha para o elemento Conhecimento. */
const conhecimentoTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    ...conhecimentoColors,
  },
};

/**
 * Esquema de cores Medo (referência: murder board / luz de lanterna):
 * fundos muito escuros (preto/azulado), azul/ciano no foco e hover, vermelho sangue apagado
 * para alertas. Texto off-white, atmosfera fria e tensa.
 */
const medoColors = {
  background: "#0c0c0e",
  surface: "#1b1b1f",
  surfaceHover: "#252528",
  text: "#e8e6e3",
  textMuted: "#a7acb1",
  primary: "#4D96EB",
  primaryHover: "#67E5F1",
  primaryGlow: "rgba(77, 150, 235, 0.35)",
  rollButton: "#4D96EB",
  rollButtonHover: "#67E5F1",
  border: "#2d2d30",
  borderHighlight: "rgba(77, 150, 235, 0.5)",
  success: "#3d9e3d",
  danger: "#8a1a1a",
} as const;

/** Tema da ficha para o elemento Medo. */
const medoTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    ...medoColors,
  },
};

const themesByElemento: Partial<Record<ElementoFicha, Theme>> = {
  SANGUE: sangueTheme,
  MORTE: morteTheme,
  ENERGIA: energiaTheme,
  CONHECIMENTO: conhecimentoTheme,
  MEDO: medoTheme,
};

/**
 * Retorna o tema da ficha para o elemento da ameaça.
 * Se o elemento ainda não tiver tema implementado, retorna o tema padrão.
 */
export function getCreatureSheetTheme(elemento: ElementoFicha | null): Theme {
  if (elemento && themesByElemento[elemento]) {
    return themesByElemento[elemento]!;
  }
  return theme;
}

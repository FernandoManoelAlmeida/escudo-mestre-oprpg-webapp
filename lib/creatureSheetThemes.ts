import { theme } from "@/lib/theme";
import type { Theme } from "@/lib/theme";
import type { ElementoFicha } from "@/lib/ameacas";

/**
 * Paletas dos cinco elementos clareadas em 15% (cada canal RGB misturado
 * com branco nessa proporção; alfa preservado) sobre as referências originais.
 * sheetBody: cor de fundo do corpo da ficha — cor-identidade do elemento
 * misturada com a surface até o texto branco ter contraste >= 4,5:1
 * (Sangue: #792626, conforme referência visual do utilizador; Morte:
 * cinza escuro #303030, o background do próprio tema).
 */

/**
 * Esquema de cores Sangue (referência: ficha Aberração de Carne):
 * vermelho carmim como destaque, fundo preto, texto branco/cinza.
 */
const sangueColors = {
  background: "#262626",
  surface: "#2F2F2F",
  surfaceHover: "#373737",
  sheetBody: "#792626",
  text: "#FFFFFF",
  textMuted: "#AEAEAE",
  primary: "#A82626",
  primaryHover: "#BE2626",
  primaryGlow: "rgba(168, 38, 38, 0.35)",
  rollButton: "#9C2626",
  rollButtonHover: "#B72626",
  border: "#5A2F2F",
  borderHighlight: "rgba(168, 38, 38, 0.5)",
  success: "#43CE76",
  danger: "#D42626",
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
 * fundo cinza quase preto (#303030), monocromático (branco/cinza), vermelho oxblood
 * (#9C3C3C) só na barra de vida e em um destaque pontual. Minimalista e sóbrio.
 */
const morteColors = {
  background: "#303030",
  surface: "#353535",
  surfaceHover: "#3C3C3C",
  sheetBody: "#303030",
  text: "#FFFFFF",
  textMuted: "#AEAEAE",
  primary: "#FFFFFF",
  primaryHover: "#E5E5E5",
  primaryGlow: "rgba(255, 255, 255, 0.15)",
  rollButton: "#9C3C3C",
  rollButtonHover: "#AE4141",
  border: "#404040",
  borderHighlight: "rgba(255, 255, 255, 0.2)",
  success: "#43CE76",
  danger: "#9C3C3C",
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
  background: "#2F2F2F",
  surface: "#363636",
  surfaceHover: "#3C3C3C",
  sheetBody: "#7E47AF",
  text: "#FFFFFF",
  textMuted: "#BCBCBC",
  primary: "#AE52FF",
  primaryHover: "#C368FF",
  primaryGlow: "rgba(174, 82, 255, 0.4)",
  rollButton: "#AE52FF",
  rollButtonHover: "#C368FF",
  border: "rgba(174, 82, 255, 0.5)",
  borderHighlight: "rgba(38, 212, 255, 0.5)",
  success: "#43CE76",
  danger: "#AE3C3C",
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
  background: "#313131",
  surface: "#373737",
  surfaceHover: "#3C3C3C",
  sheetBody: "#786C43",
  text: "#FFFFFF",
  textMuted: "#AEAEAE",
  primary: "#DABB55",
  primaryHover: "#E9CA71",
  primaryGlow: "rgba(218, 187, 85, 0.35)",
  rollButton: "#DABB55",
  rollButtonHover: "#E9CA71",
  border: "rgba(218, 187, 85, 0.4)",
  borderHighlight: "rgba(218, 187, 85, 0.6)",
  success: "#43CE76",
  danger: "#9C2626",
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
 * Esquema de cores Transmissão (referência: página "Poderes de Transmissão"
 * enviada pelo utilizador): verde-petróleo profundo como corpo da ficha,
 * painéis verde-escuros, destaque verde vivo. Não é um dos cinco elementos:
 * tem ícone próprio (elemento-transmissao-icon) e estes tons de verde.
 */
const transmissaoColors = {
  background: "#182420",
  surface: "#1F2E28",
  surfaceHover: "#27382F",
  sheetBody: "#0E4D3C",
  text: "#FFFFFF",
  textMuted: "#B9CFC4",
  primary: "#4CC38A",
  primaryHover: "#63D6A4",
  primaryGlow: "rgba(76, 195, 138, 0.35)",
  rollButton: "#1E7A4C",
  rollButtonHover: "#25965E",
  border: "#2A4A3C",
  borderHighlight: "rgba(76, 195, 138, 0.5)",
  success: "#43CE76",
  danger: "#C93B3B",
} as const;

/** Tema da ficha para ameaças de Transmissão (ícone próprio, cores verdes). */
const transmissaoTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    ...transmissaoColors,
  },
};

/**
 * Esquema de cores Medo (referência: murder board / luz de lanterna):
 * fundos muito escuros (preto/azulado), azul/ciano no foco e hover, vermelho sangue apagado
 * para alertas. Texto off-white, atmosfera fria e tensa.
 */
const medoColors = {
  background: "#303032",
  surface: "#3D3D41",
  surfaceHover: "#464648",
  sheetBody: "#5577A0",
  text: "#EBEAE7",
  textMuted: "#B4B8BD",
  primary: "#68A6EE",
  primaryHover: "#7EE9F3",
  primaryGlow: "rgba(104, 166, 238, 0.35)",
  rollButton: "#68A6EE",
  rollButtonHover: "#7EE9F3",
  border: "#4D4D4F",
  borderHighlight: "rgba(104, 166, 238, 0.5)",
  success: "#5AAD5A",
  danger: "#9C3C3C",
} as const;

/** Tema da ficha para o elemento Medo. */
const medoTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    ...medoColors,
  },
};

/** Identidade visual da ficha: os cinco elementos, mais Transmissão. */
export type SheetThemeId = ElementoFicha | "TRANSMISSAO";

const themesByElemento: Partial<Record<SheetThemeId, Theme>> = {
  SANGUE: sangueTheme,
  MORTE: morteTheme,
  ENERGIA: energiaTheme,
  CONHECIMENTO: conhecimentoTheme,
  MEDO: medoTheme,
  TRANSMISSAO: transmissaoTheme,
};

/**
 * Retorna o tema da ficha para o elemento da ameaça (ou "TRANSMISSAO").
 * Se o elemento ainda não tiver tema implementado, retorna o tema padrão.
 */
export function getCreatureSheetTheme(elemento: SheetThemeId | null): Theme {
  if (elemento && themesByElemento[elemento]) {
    return themesByElemento[elemento]!;
  }
  return theme;
}

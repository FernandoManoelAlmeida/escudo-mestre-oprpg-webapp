import "styled-components";
import type { Theme } from "@/lib/theme";

/** styled-components v6 expõe DefaultTheme como interface; use extends para o merge funcionar. */
declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}

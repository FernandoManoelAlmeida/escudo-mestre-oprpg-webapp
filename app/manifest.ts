import type { MetadataRoute } from "next";
import { assetUrl } from "@/lib/basePath";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: `${base}/`,
    name: "Escudo do Mestre — Ordem Paranormal",
    short_name: "Escudo Mestre",
    description:
      "Consulta de regras, rolagens e ameaças do Escudo do Mestre (Ordem Paranormal RPG).",
    start_url: `${base}/`,
    scope: `${base}/`,
    display: "standalone",
    background_color: "#181f26",
    theme_color: "#0e1419",
    orientation: "portrait-primary",
    lang: "pt-BR",
    icons: [
      {
        src: assetUrl("/icons/icon-192.webp"),
        sizes: "192x192",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: assetUrl("/icons/icon-512.webp"),
        sizes: "512x512",
        type: "image/webp",
        purpose: "any",
      },
    ],
  };
}

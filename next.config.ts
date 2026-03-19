import type { NextConfig } from "next";

const buildForCapacitor = process.env.BUILD_ANDROID_CAPACITOR === "1";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development" || buildForCapacitor,
  register: true,
  scope: "/",
  sw: "sw.js",
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: /^\/data\//,
        handler: "CacheFirst",
        options: {
          cacheName: "data-cache",
          expiration: {
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dias
          },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  ...(buildForCapacitor && {
    output: "export",
    images: { unoptimized: true },
    trailingSlash: true,
  }),
  // Silencia o aviso Turbopack vs webpack no dev (PWA está desativado em desenvolvimento)
  turbopack: {},
  async headers() {
    return [
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Content-Type",
            value: "application/manifest+json",
          },
          // Evita cache longo para que, ao re-adicionar à tela inicial no mobile, o navegador busque o manifest atualizado (standalone)
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default withPWA(nextConfig);

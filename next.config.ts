import type { NextConfig } from "next";

const buildForCapacitor = process.env.BUILD_ANDROID_CAPACITOR === "1";
const buildForGitHubPages = process.env.GITHUB_PAGES === "1";
const basePath = buildForGitHubPages ? (process.env.NEXT_PUBLIC_BASE_PATH || "/escudo-mestre-oprpg-webapp") : "";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development" || buildForCapacitor,
  register: false,
  scope: basePath ? `${basePath}/` : "/",
  sw: "sw.js",
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    disableDevLogs: true,
    manifestTransforms: [
      async (manifestEntries: any[]) => {
        const manifest = manifestEntries.map((m: { url: string; revision?: string | null }) => {
          if (basePath && !m.url.startsWith(basePath)) {
            m.url = `${basePath}${m.url.startsWith("/") ? "" : "/"}${m.url}`;
          }
          return m;
        });
        return { manifest, warnings: [] };
      },
    ],
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
  ...((buildForCapacitor || buildForGitHubPages) && {
    output: "export",
    images: { unoptimized: true },
    trailingSlash: true,
  }),
  ...(basePath && {
    basePath,
  }),
  // Silencia o aviso Turbopack vs webpack no dev (PWA está desativado em desenvolvimento)
  turbopack: {},
};

export default withPWA(nextConfig);

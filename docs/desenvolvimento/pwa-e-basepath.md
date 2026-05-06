# PWA e basePath

## `NEXT_PUBLIC_BASE_PATH` e `assetUrl`

[`lib/basePath.ts`](../../lib/basePath.ts) exporta `assetUrl(path)`:

- Concatena `process.env.NEXT_PUBLIC_BASE_PATH` ao caminho (ex.: `/repo/icons/...`).
- Usado em `layout.tsx` (ícones), `UpdateBanner`, fetches versionados, etc.

Em desenvolvimento local **sem** subpath, a variável fica vazia e os caminhos são absolutos à raiz (`/data/...`).

## Service worker

- O plugin **`@ducanh2912/next-pwa`** (`next.config.ts`) gera `public/sw.js` no build, com `scope` igual ao `basePath` terminado em `/` quando há subpath.
- `register: false` no plugin: o registo é feito **manualmente** em [`components/layout/UpdateBanner.tsx`](../../components/layout/UpdateBanner.tsx) com `navigator.serviceWorker.register(swScriptUrl, { scope: scopeUrl })`, usando URLs absolutas derivadas de `assetUrl` para funcionar em GitHub Pages.

## `version.json` e precache

- [`scripts/write-version.js`](../../scripts/write-version.js) grava `public/version.json` com `buildId` (lê `.next/BUILD_ID` quando existe) e `generatedAt`.
- Regrava também `out/version.json` após o export, para o banner de actualização não ficar com build antigo.
- Em `next.config.ts`, `publicExcludes` inclui **`!version.json`** para **não** entrar no precache do Workbox (evita que o SW sirva um `buildId` antigo em cache).

## Cache de dados

`runtimeCaching` define padrão para URLs sob `/data/` (com prefixo de `basePath` quando aplicável) com estratégia **CacheFirst** e TTL de 30 dias (`cacheName: data-cache`).

## PWA desactivado

- **`yarn dev`:** `disable: true` quando `NODE_ENV === "development"`.
- **Build Capacitor:** `BUILD_ANDROID_CAPACITOR=1` também desactiva o plugin conforme configuração em `next.config.ts`.

## Documentação relacionada

- [Deploy GitHub Pages](deploy-github-pages.md)
- [Dados e migrações](dados-e-migracoes.md)

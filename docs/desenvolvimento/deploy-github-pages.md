# Deploy GitHub Pages

## Visão geral

O workflow [`.github/workflows/nextjs.yml`](../../.github/workflows/nextjs.yml) faz **build estático** do Next e publica a pasta **`out/`** no GitHub Pages.

O passo **Setup Pages** usa `configure-pages@v5` **sem** `static_site_generator: next`: esse preset altera o `next.config` e o `withPWA` deixa de emitir `sw.js` no runner (build rápido, sem linhas `(pwa)` no log). O `basePath` e `output: export` ficam só no nosso `next.config.ts`.

## Variáveis de ambiente no CI

No job de build:

- `GITHUB_PAGES=1` (local) ou `true` (CI) — activa `output: "export"` e `basePath` em `next.config.ts` (`lib/githubPagesEnv.ts`).
- `NEXT_PUBLIC_BASE_PATH=/${{ github.event.repository.name }}` — prefixo do site (ex.: `/escudo-mestre-oprpg-webapp`).

O `next.config.ts` também injecta `NEXT_PUBLIC_BASE_PATH` no cliente em builds GitHub Pages, para URLs de ícones, dados e **service worker** ficarem alinhadas.

## Ficheiro `.nojekyll`

O ficheiro `public/.nojekyll` é copiado para a raiz do export. **Sem ele**, o GitHub Pages (Jekyll) **ignora pastas que começam por `_`**, pelo que `_next/` não seria publicado — manifestações típicas: 404 em `_next/static/...`, erros de precache (`bad-precaching-response`), service worker como `Unknown`.

Após deploy, confirme que existe:

`https://<utilizador>.github.io/<repositorio>/.nojekyll` (resposta 200, corpo vazio).

## Monorepo

No workflow, `env.APP_DIR` está como `.` (raiz do webapp). Se o app estiver noutra pasta do mono-repo, ajuste `APP_DIR` e os caminhos de `cache-dependency-path` / `path` do artefacto.

## Build local (smoke)

```bash
yarn test:run
yarn build:pages:ci-simulate
```

Linux (runner ubuntu):

```bash
docker run --rm -v "$PWD":/app -w /app node:20-bookworm bash scripts/simulate-github-pages-ci.sh
```

O workflow apaga `.next` antes do build, corre verify PWA após o build e falha em `write-version` se faltar `sw.js`.

## Resolução de problemas (service worker / cache)

Se após um deploy antigo ainda vir `bad-precaching-response` ou `ServiceWorker ... script ('Unknown')`:

1. Faça um **novo deploy** com o workflow actual (ou build local com `GITHUB_PAGES=1` e `NEXT_PUBLIC_BASE_PATH=/nome-do-repo`).
2. Confirme `.nojekyll` no site (passo acima).
3. No Chrome: **DevTools → Application → Service Workers → Unregister**, limpe cache do site, recarregue (ou janela anónima).

## Documentação relacionada

- [PWA e basePath](pwa-e-basepath.md)
- [Build e testes](build-e-testes.md)

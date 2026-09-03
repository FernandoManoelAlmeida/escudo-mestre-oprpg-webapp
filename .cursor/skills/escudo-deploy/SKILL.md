---
name: escudo-deploy
description: >-
  Publica o Escudo no GitHub Pages (PWA web): GITHUB_PAGES=1, basePath, service
  worker, .nojekyll. Use para publicar, corrigir cache SW, ou troubleshooting
  de produção. Builds Android/TWA/Capacitor estão em docs, não nesta skill.
---

# escudo-deploy

Deploy **web** (GitHub Pages + PWA). Android: [docs/desenvolvimento/android-opcional.md](../../docs/desenvolvimento/android-opcional.md).

## Build de produção

`yarn build` já corre `next build --webpack` e depois `node scripts/write-version.js` (`public/version.json`).

```bash
GITHUB_PAGES=1 NEXT_PUBLIC_BASE_PATH=/escudo-mestre-oprpg-webapp yarn build
```

Em CI: workflow [`.github/workflows/nextjs.yml`](../../.github/workflows/nextjs.yml) define `GITHUB_PAGES=1` e `NEXT_PUBLIC_BASE_PATH=/${{ github.event.repository.name }}`.

## Checklist deploy

1. `yarn test:run` passa
2. `public/.nojekyll` presente no export (GitHub Pages não ignorar `_next/`)
3. Push para `master` dispara workflow (se configurado)
4. Após deploy: verificar SW, precache e `version.json` no Chrome

## Troubleshooting PWA

- SW antigo: desregistar SW + limpar cache ou janela anónima
- Precache falha: novo deploy + confirmar `.nojekyll` no site
- `basePath` deve coincidir entre Next config, `NEXT_PUBLIC_BASE_PATH` e URL do Pages
- JSON em `/data/` pode ficar em cache do SW — novo deploy após migrate

## Guardrails

- Não alterar `basePath` sem actualizar workflow e docs
- PWA via `@ducanh2912/next-pwa` — `--webpack` já está em `yarn build`

## Referências

- [docs/desenvolvimento/deploy-github-pages.md](../../docs/desenvolvimento/deploy-github-pages.md)
- [docs/desenvolvimento/pwa-e-basepath.md](../../docs/desenvolvimento/pwa-e-basepath.md)
- [AGENTS.md](../../AGENTS.md)

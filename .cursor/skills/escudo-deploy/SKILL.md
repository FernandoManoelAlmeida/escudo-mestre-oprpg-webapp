---
name: escudo-deploy
description: Deploy GitHub Pages e PWA do Escudo — basePath, GITHUB_PAGES=1, service worker, .nojekyll. Use para publicar, corrigir cache SW, ou troubleshooting de produção.
---

# escudo-deploy

## Build de produção

```bash
GITHUB_PAGES=1 NEXT_PUBLIC_BASE_PATH=/escudo-mestre-oprpg-webapp yarn build
```

Em CI: workflow [`.github/workflows/nextjs.yml`](../../.github/workflows/nextjs.yml) define `GITHUB_PAGES=1` e `NEXT_PUBLIC_BASE_PATH=/${{ github.event.repository.name }}`.

## Checklist deploy

1. `yarn test:run` passa
2. `public/.nojekyll` presente no export (GitHub Pages não ignorar `_next/`)
3. Push para `master` dispara workflow (se configurado)
4. Após deploy: verificar SW e precache no Chrome

## Troubleshooting PWA

- SW antigo: desregistar SW + limpar cache ou janela anónima
- Precache falha: novo deploy + confirmar `.nojekyll` no site
- `basePath` deve coincidir entre Next config, `NEXT_PUBLIC_BASE_PATH` e URL do Pages

## Guardrails

- Não alterar `basePath` sem actualizar workflow e docs
- PWA via `@ducanh2912/next-pwa` — build com `--webpack` se documentado

## Referências

- [docs/desenvolvimento/deploy-github-pages.md](../../docs/desenvolvimento/deploy-github-pages.md)
- [AGENTS.md](../../AGENTS.md)

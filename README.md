# Escudo do Mestre — Webapp

Webapp **mobile-first** para consulta das regras do Escudo do Mestre (Ordem Paranormal RPG), rolagens de dados e fichas de ameaças. Inclui **manifest PWA** e instalação no Chrome (telemóvel e desktop).

- **Regras:** índice de seções (§), tabelas (DT, termos) e glossário com busca.
- **Rolagens:** teste de atributo, teste de perícia e rolagem livre (fórmulas como `2d20+5`, `4d8`).
- **Ameaças:** listagem com busca por texto nas fichas; ficha detalhada por ameaça.

Dados em `public/data/` (`escudo-mestre-casa.json`, `ameacas.json`). O PWA em produção usa `@ducanh2912/next-pwa` com `yarn build --webpack`.

Este projeto usa **Yarn** (`yarn install`, `yarn dev`, etc.).

## Documentação

Guias completos para **utilizadores** (mesa) e **desenvolvimento** (setup, build, deploy, PWA):

**[docs/README.md](docs/README.md)**

## Início rápido (desenvolvimento)

```bash
yarn install
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

Para build, testes, dados, PWA e GitHub Pages em detalhe, siga a pasta [`docs/desenvolvimento/`](docs/desenvolvimento/).

## GitHub Pages (resumo)

O workflow [`.github/workflows/nextjs.yml`](.github/workflows/nextjs.yml) define `GITHUB_PAGES=1` e `NEXT_PUBLIC_BASE_PATH=/${{ github.event.repository.name }}`, alinhado ao `basePath` do Next e ao service worker.

**[Guia completo: deploy e troubleshooting](docs/desenvolvimento/deploy-github-pages.md)**

Em síntese: é necessário `public/.nojekyll` no export para o GitHub Pages não ignorar `_next/`. Se o service worker ou o precache falharem após um deploy antigo, faça novo deploy, confirme `.nojekyll` no site e, no Chrome, desregiste o service worker e limpe o cache (ou use janela anónima).

## Next.js

Documentação oficial: [Next.js](https://nextjs.org/docs).

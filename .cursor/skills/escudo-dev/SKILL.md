---
name: escudo-dev
description: >-
  Corre e valida o ambiente local do Escudo (yarn install, yarn dev, Vitest, ESLint).
  Use when debugging, running tests, linting, or verifying changes before deploy.
  Do not use for new pages, BottomNav, QuickRollBar, or mesa UX — that is escudo-features.
---

# escudo-dev

Ambiente e QA. Mapa de código: [AGENTS.md](../../AGENTS.md) §3.

## Setup

```bash
yarn install
yarn dev
```

Abrir http://localhost:3000. `yarn dev` usa `next dev --webpack`; PWA **desactivado** em desenvolvimento (esperado). O script tenta `ulimit -n 10240` e remove `.next/dev/lock` se existir.

## Testes e qualidade

```bash
yarn test:run
yarn lint
```

`yarn test:run` **obrigatório** após mudar `lib/`, `public/data/` ou componentes críticos. Opcional: `yarn lint:fix` / `yarn format`.

## Quando NÃO usar

| Pedido | Skill |
|--------|--------|
| Nova página, BottomNav, QuickRollBar, rolagens, UX mesa | `escudo-features` |
| Migrar MD do OPD | `escudo-migrate-opd` |
| Hotfix em JSON | `escudo-data` |
| Publicar Pages / cache SW | `escudo-deploy` |

## Guardrails

- **Yarn** apenas (não npm)
- Não depurar service worker em `yarn dev`
- Commits só quando o utilizador pedir

## Referências

- [docs/desenvolvimento/requisitos-e-setup.md](../../docs/desenvolvimento/requisitos-e-setup.md)
- [docs/desenvolvimento/build-e-testes.md](../../docs/desenvolvimento/build-e-testes.md)
- [AGENTS.md](../../AGENTS.md)

---
name: escudo-dev
description: Desenvolvimento local do Escudo do Mestre — yarn dev, testes Vitest, lint. Use para bugs, refactors, ou validar alterações antes de deploy.
---

# escudo-dev

## Setup

```bash
yarn install
yarn dev
```

Abrir http://localhost:3000 — PWA **desactivado** em dev (comportamento esperado).

## Testes e qualidade

```bash
yarn test:run
yarn lint   # se disponível no package.json
```

Executar `yarn test:run` após mudar `lib/`, `public/data/` ou componentes críticos.

## Estrutura

| Área | Path |
|------|------|
| Rotas | `app/` |
| Lógica | `lib/escudo.ts`, `lib/ameacas.ts`, `lib/dice.ts` |
| UI | `components/` |
| Dados | `public/data/` |

## Guardrails

- **Yarn** apenas (não npm)
- Não debugar service worker em `yarn dev`
- Commits só quando o utilizador pedir

## Referências

- [AGENTS.md](../../AGENTS.md)
- [docs/desenvolvimento/](../../docs/desenvolvimento/)

---
name: escudo-data
description: >-
  Edita public/data/*.json (escudo-mestre-casa.json, ameacas.json) no formato
  esperado por lib/escudo.ts e lib/ameacas.ts, depois yarn test:run. Use para
  hotfix pontual quando a migração OPD não cobre o caso.
---

# escudo-data

## Ficheiros

- `public/data/escudo-mestre-casa.json` — regras, seções, glossário
- `public/data/ameacas.json` — fichas de ameaças

Não há schema Zod/AJV: o formato é o que `lib/escudo.ts` e `lib/ameacas.ts` consomem.

## Fluxo preferido

1. **Preferir** editar MD no OPD + `yarn migrate:from-opd` (skill `escudo-migrate-opd`)
2. Se hotfix directo no JSON:
   - Ler consumo em `lib/escudo.ts` e `lib/ameacas.ts`
   - Editar JSON mantendo estrutura existente
   - `yarn test:run` obrigatório
   - Verificar busca, índice § e listagem de ameaças

Hotfix local **será sobrescrito** por `yarn migrate:from-opd` — documentar ou reaplicar após migrate.

## Guardrails

- Não duplicar fonte de verdade — OPD é canónico para regras/ameaças
- Documentar hotfixes manuais se não forem re-migrados
- UTF-8, português brasileiro

## Referências

- [docs/desenvolvimento/dados-e-migracoes.md](../../docs/desenvolvimento/dados-e-migracoes.md)
- [AGENTS.md](../../AGENTS.md)
- Scripts: `scripts/migrate-*.js`

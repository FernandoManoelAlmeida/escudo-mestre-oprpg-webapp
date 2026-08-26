---
name: escudo-data
description: Editar public/data/*.json (escudo-mestre-casa.json, ameacas.json) com validação de schema. Use para ajustes pontuais nos dados do PWA quando a migração OPD não cobre o caso.
---

# escudo-data

## Ficheiros

- `public/data/escudo-mestre-casa.json` — regras, seções, glossário
- `public/data/ameacas.json` — fichas de ameaças

## Fluxo preferido

1. **Preferir** editar MD no OPD + `yarn migrate:from-opd` (skill `escudo-migrate-opd`)
2. Se hotfix directo no JSON:
   - Ler schema/consumo em `lib/escudo.ts` e `lib/ameacas.ts`
   - Editar JSON mantendo estrutura existente
   - `yarn test:run` obrigatório

## Validação

- Testes em `lib/` e componentes que consomem os JSON
- Verificar busca, índice §, listagem de ameaças após alteração

## Guardrails

- Não duplicar fonte de verdade — OPD é canónico para regras/ameaças
- Documentar hotfixes manuais se não forem re-migrados
- UTF-8, português brasileiro

## Referências

- [AGENTS.md](../../AGENTS.md) §3
- Scripts: `scripts/migrate-*.js`

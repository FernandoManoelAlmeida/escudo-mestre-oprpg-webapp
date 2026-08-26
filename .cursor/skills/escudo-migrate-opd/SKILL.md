---
name: escudo-migrate-opd
description: Sincronizar regras e ameaças do vault OPD para public/data/ via yarn migrate:from-opd. Use quando o utilizador actualizar Escudo do Mestre da Casa.md, Ameaças.md, ou pedir refresh dos JSON do PWA.
---

# escudo-migrate-opd

## Quando usar

- Alterações em `../ordem-paranormal-desespero/Referências/`
- Pedidos: "actualizar ameaças", "migrar regras", "sync OPD"

## Fluxo

1. Confirmar que o OPD está em `../ordem-paranormal-desespero/` (ou `OPD_VAULT`)
2. Executar na raiz do Escudo:

```bash
yarn migrate:from-opd
```

3. Comandos individuais se necessário:

```bash
yarn migrate:regras -- ../ordem-paranormal-desespero/Referências/Escudo\ do\ Mestre\ da\ Casa.md --update
yarn migrate:ameacas -- ../ordem-paranormal-desespero/Referências/Fichas/Ameaças.md
```

4. Validar: `yarn test:run`
5. Opcional: `yarn dev` para smoke test

## Guardrails

- Editar MD **no OPD**, não no JSON directamente (excepto hotfix documentado)
- Não alterar campanhas OPD
- Documentar em `docs/desenvolvimento/` se mudar flags ou paths dos scripts

## Referências

- [AGENTS.md](../../AGENTS.md) §4
- [docs/desenvolvimento/integracao-hub-ttrpg.md](../../docs/desenvolvimento/integracao-hub-ttrpg.md)

---
name: escudo-migrate-opd
description: >-
  Sincroniza regras e ameaças do vault OPD para public/data/ via yarn migrate:from-opd.
  Use quando o utilizador actualizar Escudo do Mestre da Casa.md, Ameaças.md,
  ou pedir refresh dos JSON do PWA.
---

# escudo-migrate-opd

## Quando usar

- Alterações em `../ordem-paranormal-desespero/Referências/`
- Pedidos: "actualizar ameaças", "migrar regras", "sync OPD"

## Pré-check

Confirmar que o vault existe (`../ordem-paranormal-desespero/` ou `OPD_VAULT`) e que os MD-fonte estão presentes:

- `Referências/Escudo do Mestre da Casa.md`
- `Referências/Fichas/Ameaças.md`

Se faltar o clone: na raiz do hub, `./scripts/bootstrap.sh --only ordem-paranormal-desespero`.

## Fluxo

1. Executar na raiz do Escudo:

```bash
yarn migrate:from-opd
```

Regras sem mesclar JSON existente:

```bash
yarn migrate:from-opd -- --no-update
```

2. Comandos individuais se necessário:

```bash
yarn migrate:regras -- ../ordem-paranormal-desespero/Referências/Escudo\ do\ Mestre\ da\ Casa.md --update
yarn migrate:ameacas -- ../ordem-paranormal-desespero/Referências/Fichas/Ameaças.md
```

3. Validar: `yarn test:run`
4. Opcional: `yarn dev` para smoke test
5. Utilizadores do PWA em produção podem precisar de **novo deploy** — o SW faz cache de `/data/`

## Guardrails

- Editar MD **no OPD**, não no JSON directamente (excepto hotfix documentado)
- Não alterar campanhas OPD
- Documentar em `docs/desenvolvimento/` se mudar flags ou paths dos scripts

## Referências

- [AGENTS.md](../../AGENTS.md) §4
- [docs/desenvolvimento/integracao-hub-ttrpg.md](../../docs/desenvolvimento/integracao-hub-ttrpg.md)
- [docs/desenvolvimento/dados-e-migracoes.md](../../docs/desenvolvimento/dados-e-migracoes.md)

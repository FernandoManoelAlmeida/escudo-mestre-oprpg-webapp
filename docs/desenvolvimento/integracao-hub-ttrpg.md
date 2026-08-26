# Integração com o hub TTRPG

Este webapp faz parte do monorepo virtual **[ttrpg](https://github.com/FernandoManoelAlmeida/ttrpg)** como repo **irmão** do vault OPD. O conteúdo Markdown-fonte vive no OPD; este repo gera JSON em `public/data/` via migrações manuais.

## Layout esperado

Após `./scripts/bootstrap.sh` na raiz do hub:

```
ttrpg/
├── scripts/bootstrap.sh
└── repos/
    ├── ordem-paranormal-desespero/    # fonte MD (Referências/)
    └── escudo-mestre-oprpg-webapp/     # este repo
```

A pasta `repos/` **não** é versionada no repo pai — apenas clonada localmente.

## Setup

```bash
git clone git@github.com:FernandoManoelAlmeida/ttrpg.git
cd ttrpg
./scripts/bootstrap.sh --only escudo-mestre-oprpg-webapp
# recomendado: bootstrap de todos para ter o OPD ao lado
./scripts/bootstrap.sh
cd repos/escudo-mestre-oprpg-webapp
yarn install
yarn dev
```

## Migrar dados do OPD

### Atalho (layout hub)

```bash
cd repos/escudo-mestre-oprpg-webapp
yarn migrate:from-opd
```

Usa por padrão `../ordem-paranormal-desespero/Referências/`. Override:

```bash
OPD_VAULT=/caminho/para/ordem-paranormal-desespero yarn migrate:from-opd
```

Opção `--no-update` passa regras sem mesclar JSON existente.

### Comandos explícitos

```bash
yarn migrate:regras -- ../ordem-paranormal-desespero/Referências/Escudo\ do\ Mestre\ da\ Casa.md --update
yarn migrate:ameacas -- ../ordem-paranormal-desespero/Referências/Fichas/Ameaças.md
```

## Fluxo de trabalho

1. Editar MD no vault OPD (`Referências/Escudo do Mestre*.md`, `Referências/Fichas/Ameaças.md`)
2. Executar `yarn migrate:from-opd` (ou comandos individuais)
3. `yarn test:run` e `yarn dev` para validar
4. `yarn build` e deploy (GitHub Pages ou outro)

**Não há sync automático** — alterações no vault não aparecem no PWA até migrar e fazer build/deploy.

## Modo solo (sem hub)

Se clonar apenas este repo e o OPD em outro path, use paths absolutos ou defina `OPD_VAULT`:

```bash
yarn migrate:regras -- /caminho/para/ordem-paranormal-desespero/Referências/Escudo\ do\ Mestre\ da\ Casa.md --update
yarn migrate:ameacas -- /caminho/para/ordem-paranormal-desespero/Referências/Fichas/Ameaças.md
```

## Referências

- Hub: [ttrpg README](https://github.com/FernandoManoelAlmeida/ttrpg/blob/master/README.md)
- Hub AGENTS: roteamento multi-repo, scripts CLI §8
- OPD AGENTS: [`ordem-paranormal-desespero/AGENTS.md`](https://github.com/FernandoManoelAlmeida/ordem-paranormal-desespero/blob/master/AGENTS.md) (fonte MD)
- Escudo AGENTS: [`AGENTS.md`](../../AGENTS.md) neste repo
- [Dados e migrações](dados-e-migracoes.md)

# Dados e migrações

## Ficheiros em `public/data/`

| Ficheiro | Conteúdo |
|----------|----------|
| `escudo-mestre-casa.json` | Índice de secções, subsecções Markdown, tabelas, glossário |
| `ameacas.json` | Lista de ameaças e metadados para filtros |

Estes ficheiros são **fetch** pelo cliente em runtime (`/data/...` com prefixo `basePath` quando aplicável). Qualquer alteração exige **novo build/deploy** para utilizadores verem a versão nova (cache PWA pode atrasar até expirar ou até actualização forçada).

## Edição manual

Pode editar o JSON directamente com cuidado para manter o schema esperado pelos módulos `lib/escudo.ts` e `lib/ameacas.ts`. Recomenda-se validar com `yarn test:run` e abrir a app localmente.

## Migração a partir de Markdown

### Regras — `scripts/migrate-regras.js`

```bash
node scripts/migrate-regras.js <caminho/para/regras.md>
node scripts/migrate-regras.js <caminho/para/regras.md> --update
```

- Sem `--update`, gera/reescreve o JSON a partir do Markdown.
- Com `--update`, **mescla** com o JSON existente (preserva meta/tabelas/glossário não presentes no MD).

O formato esperado do Markdown está documentado no cabeçalho do script. Saída: `public/data/escudo-mestre-casa.json`.

Atalho Yarn:

```bash
yarn migrate:regras -- <caminho.md> [--update]
```

### Ameaças — `scripts/migrate-ameacas.js`

```bash
yarn migrate:ameacas <caminho/para/ameacas.md>
```

- Actualiza ameaças existentes por `id` e renova a lista de características para filtros.

Saída: `public/data/ameacas.json`.

## Versão após migração

Os scripts de migração podem invocar `writeVersion` para alinhar metadados de versão; em fluxo normal, o `yarn build` volta a gerar `version.json`.

## Documentação relacionada

- [PWA e basePath](pwa-e-basepath.md) — cache de `/data/`
- [Build e testes](build-e-testes.md)

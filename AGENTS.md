# AGENTS.md — Instruções para agentes de IA (Escudo do Mestre)

Fonte única para agentes que trabalham neste webapp. Stubs (`CLAUDE.md`, `GEMINI.md`, `TRAE.md`) apontam para cá.

> **Hub TTRPG:** repo filho em `repos/escudo-mestre-oprpg-webapp/`. Contexto global: [`../../AGENTS.md`](../../AGENTS.md). Fonte MD: [`../ordem-paranormal-desespero/`](../ordem-paranormal-desespero/).

---

## 1. Visão

- PWA **mobile-first** — regras, rolagens, ameaças; sem backend/login
- Dados em `public/data/` (`escudo-mestre-casa.json`, `ameacas.json`)
- Fonte Markdown no vault OPD — **sem sync automático**
- Stack: Next.js 16, React 19, Yarn, styled-components, Vitest, PWA (`@ducanh2912/next-pwa`)
- Idioma: **português brasileiro**

---

## 2. Roteamento — intenção → acção

| Objetivo | Acção | Skill |
|----------|-------|-------|
| Actualizar regras/ameaças no PWA | `yarn migrate:from-opd` | `escudo-migrate-opd` |
| Dev local, testes, lint | `yarn dev`, `yarn test:run` | `escudo-dev` |
| GitHub Pages, PWA, cache SW | push `master` ou build `GITHUB_PAGES=1` | `escudo-deploy` |
| Editar JSON manualmente | `public/data/*.json` + testes | `escudo-data` |
| Nova rota, UI, rolagens | `app/`, `components/`, `lib/` | `escudo-features` |
| Uso na mesa (como jogar) | Não alterar código | `docs/usuario/` |

### Regras operacionais

- **Yarn** (não npm)
- Editar regras/ameaças **no OPD** (`Referências/`), migrar aqui
- PWA desactivado em `yarn dev` — não debugar SW em dev
- `yarn test:run` após alterar dados ou lógica
- Só commits quando o utilizador pedir

---

## 3. Mapa de código

| Área | Path |
|------|------|
| Rotas | `app/` — `/`, `/regras`, `/rolagens`, `/ameacas` |
| Regras | `lib/escudo.ts` |
| Ameaças | `lib/ameacas.ts` |
| Dados | `lib/dice.ts` |
| Layout | `components/layout/` — `ClientLayout`, `BottomNav`, `QuickRollBar` |
| Dados estáticos | `public/data/` |
| Migrações | `scripts/migrate-*.js`, `yarn migrate:from-opd` |

---

## 4. Fluxo OPD → PWA

1. Editar MD no OPD
2. `yarn migrate:from-opd` (ou comandos individuais)
3. `yarn test:run` → `yarn dev`
4. `yarn build` → deploy

```bash
yarn migrate:from-opd
# ou:
yarn migrate:regras -- ../ordem-paranormal-desespero/Referências/Escudo\ do\ Mestre\ da\ Casa.md --update
yarn migrate:ameacas -- ../ordem-paranormal-desespero/Referências/Fichas/Ameaças.md
```

Override: `OPD_VAULT=/caminho/para/ordem-paranormal-desespero`

Docs: [`docs/desenvolvimento/integracao-hub-ttrpg.md`](docs/desenvolvimento/integracao-hub-ttrpg.md)

---

## 5. Guardrails

- Não editar campanhas OPD a partir deste repo
- Não commitar `repos/` no hub pai
- Não editar JSON sem validar schema (`lib/escudo.ts`, `lib/ameacas.ts`)
- Actualizar `docs/` se mudar rotas ou UX visível

---

## 6. Skills Cursor

- `.cursor/skills/escudo-migrate-opd/` — migração OPD
- `.cursor/skills/escudo-dev/` — desenvolvimento
- `.cursor/skills/escudo-deploy/` — deploy PWA
- `.cursor/skills/escudo-data/` — JSON em `public/data/`
- `.cursor/skills/escudo-features/` — features UI/código

---
name: escudo-features
description: >-
  Implementa páginas, BottomNav, QuickRollBar, rolagens e UX mesa no Escudo
  (styled-components, mobile-first). Use when adding a route, changing mesa
  navigation, dice UX, or visible UI. Do not use for yarn dev/test-only or OPD migrate.
---

# escudo-features

Implementação de UI e lógica de mesa. Ambiente/QA: skill `escudo-dev`.

## Áreas comuns

| Feature | Onde |
|---------|------|
| Nova rota | `app/<rota>/page.tsx` |
| Navegação | `components/layout/BottomNav`, `ClientLayout` |
| Rolagens | `lib/dice.ts`, `/rolagens` |
| Regras UI | `/regras`, `lib/escudo.ts` |
| Ameaças UI | `/ameacas`, `lib/ameacas.ts` |
| Quick roll | `components/layout/QuickRollBar` |

## Workflow

1. Ler código existente — styled-components, padrões mobile-first
2. Implementar com mudança mínima
3. `yarn test:run`
4. `yarn dev` para verificar UX
5. Actualizar `docs/usuario/` (ou `docs/desenvolvimento/`) se UX visível mudar

## Quando NÃO usar

| Pedido | Skill |
|--------|--------|
| Só instalar, `yarn dev`, testes ou lint | `escudo-dev` |
| Dados canónicos de regras/ameaças (MD OPD) | `escudo-migrate-opd` |
| Ajuste pontual de JSON sem mudar UI | `escudo-data` |
| GitHub Pages, service worker, produção | `escudo-deploy` |

## Guardrails

- Mobile-first; bottom nav e quick roll são críticos na mesa
- Dados de regras/ameaças vêm de JSON — não hardcodar texto longo
- Português brasileiro na UI
- Commits só quando pedido

## Referências

- [AGENTS.md](../../AGENTS.md)
- [docs/README.md](../../docs/README.md)
- [docs/usuario/](../../docs/usuario/)

---
name: escudo-features
description: Implementar features no Escudo — rotas app/, UI components/, lib/dice.ts, ameaças, rolagens. Use para novas páginas, melhorias UX mobile-first, ou lógica de dados.
---

# escudo-features

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
5. Actualizar `docs/usuario/` ou `docs/desenvolvimento/` se UX visível mudar

## Guardrails

- Mobile-first; bottom nav e quick roll são críticos na mesa
- Dados de regras/ameaças vêm de JSON — não hardcodar texto longo
- Português brasileiro na UI
- Commits só quando pedido

## Referências

- [AGENTS.md](../../AGENTS.md)
- [docs/README.md](../../docs/README.md)

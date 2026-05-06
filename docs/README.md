# Documentação — Escudo do Mestre (webapp)

Esta pasta contém guias em **Markdown** para utilizadores na mesa e para quem desenvolve ou faz deploy do projeto.

## Onde ler isto

- **GitHub:** abra os ficheiros na árvore do repositório (visualização nativa de `.md`).
- **Clone local:** qualquer editor ou pré-visualizador Markdown.

O build estático do Next.js (**pasta `out/`**) não publica automaticamente esta árvore `docs/` no site da aplicação. A documentação destina-se ao repositório.

## Índice

### Para mestres e jogadores

| Documento | Conteúdo |
|-----------|----------|
| [Visão geral](usuario/visao-geral.md) | O que é o app, requisitos, privacidade |
| [Navegação e acessibilidade](usuario/navegacao-e-acessibilidade.md) | Menu inferior, cabeçalho, atalhos |
| [Regras e consulta](usuario/regras-e-consulta.md) | Índice, secções, glossário, tabelas |
| [Rolagens](usuario/rolagens.md) | Página de rolagens e barra rápida |
| [Ameaças](usuario/ameacas.md) | Lista, filtros, fichas |
| [PWA e offline](usuario/pwa-e-offline.md) | Instalar, cache, nova versão |

### Para desenvolvimento e operação

| Documento | Conteúdo |
|-----------|----------|
| [Requisitos e setup](desenvolvimento/requisitos-e-setup.md) | Node, Yarn, `yarn dev` |
| [Build e testes](desenvolvimento/build-e-testes.md) | `yarn build`, testes, lint |
| [Dados e migrações](desenvolvimento/dados-e-migracoes.md) | JSON em `public/data/`, scripts |
| [Deploy GitHub Pages](desenvolvimento/deploy-github-pages.md) | Workflow, `basePath`, troubleshooting |
| [PWA e basePath](desenvolvimento/pwa-e-basepath.md) | Service worker, `version.json`, URLs |
| [Android (opcional)](desenvolvimento/android-opcional.md) | TWA / Capacitor, scripts |

### Recursos opcionais

- [assets/README.md](assets/README.md) — pasta reservada para imagens de apoio (capturas), se quiser adicionar mais tarde.

## Manutenção

Atualize a documentação quando alterar rotas em `app/`, regras de dados em `lib/dice.ts`, fluxo de deploy ou configuração PWA em `next.config.ts`.

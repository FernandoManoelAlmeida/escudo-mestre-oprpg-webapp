# Escudo do Mestre — Webapp

Webapp **mobile-first** para consulta das regras do Escudo do Mestre (Ordem Paranormal RPG), rolagens de dados e fichas de ameaças. Inclui **manifest PWA** e prompt de instalação no Chrome (celular e desktop).

- **Regras:** índice de seções (§), tabelas (DT, termos) e glossário com busca.
- **Rolagens:** teste de atributo, teste de perícia e rolagem livre (fórmulas como 2d20+5, 4d8).
- **Ameaças:** listagem com busca por texto nas fichas; ficha detalhada por ameaça.

Dados em `public/data/` (escudo-mestre-casa.json, ameacas.json). Para cache offline completo, é possível usar `@ducanh2912/next-pwa` com `yarn build --webpack`.

Este projeto usa **Yarn**. Use `yarn` para instalar dependências e rodar scripts.

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

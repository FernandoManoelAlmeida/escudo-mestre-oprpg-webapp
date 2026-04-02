# TWA (Trusted Web Activity) — APK Android

Esta pasta contém o projeto Android que empacota a PWA do Escudo do Mestre como um APK usando [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap).

## Pré-requisitos

- App publicado em **HTTPS** (ex.: Vercel, Netlify).
- **Java (JDK 11+)** — o Gradle precisa de um Java Runtime no `PATH`. Se der _"Unable to locate a Java Runtime"_, instale o JDK (ex.: `brew install openjdk@17` no macOS) ou use o JDK do Android Studio. Se der erro de certificado SSL (_"PKIX path building failed"_), use o JDK do Android Studio ou veja [Troubleshooting em docs/android-builds.md](../docs/android-builds.md#troubleshooting).
- **Android SDK** instalado (ex.: [Android Studio](https://developer.android.com/studio)).
- Node.js (para usar o Bubblewrap via npx).

## Primeira vez: inicializar o projeto TWA

Na raiz do webapp (`Apps/escudo-mestre-oprpg-webapp`), execute:

```bash
yarn build:android:twa:init
```

Será pedida a **URL do manifest** da sua PWA em produção, por exemplo:

`https://seu-dominio.vercel.app/manifest.json`

Ou defina a variável de ambiente antes:

```bash
MANIFEST_URL=https://seu-dominio.com/manifest.json yarn build:android:twa:init
```

O assistente do Bubblewrap preenche nome, ícones e cores a partir do manifest. Ajuste o package name (ex.: `com.escudo.mestre`) se desejar.

## Gerar o APK

Após inicializar, execute:

```bash
yarn build:android:twa
```

O APK assinado será gerado na pasta do projeto TWA (ex.: `app-release-signed.apk`).

## Digital Asset Links (TWA “trusted”)

Para o app abrir em modo tela cheia (sem barra do Chrome), publique o arquivo de vínculo no seu domínio:

- URL: `https://seu-dominio.com/.well-known/assetlinks.json`
- O SHA-256 do certificado é exibido pelo Bubblewrap após o primeiro build. Use-o no JSON conforme a [documentação do Chrome](https://developer.chrome.com/docs/android/trusted-web-activity/quick-start#declarar-asset-links).

Depois de publicar o `assetlinks.json`, gere o APK novamente com `yarn build:android:twa`.

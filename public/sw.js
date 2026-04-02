if (!self.define) {
  let e,
    s = {};
  const n = (n, a) => (
    (n = new URL(n + ".js", a).href),
    s[n] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          ((e.src = n), (e.onload = s), document.head.appendChild(e));
        } else ((e = n), importScripts(n), s());
      }).then(() => {
        let e = s[n];
        if (!e) throw new Error(`Module ${n} didn’t register its module`);
        return e;
      })
  );
  self.define = (a, c) => {
    const o =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[o]) return;
    let i = {};
    const t = (e) => n(e, o),
      r = { module: { uri: o }, exports: i, require: t };
    s[o] = Promise.all(a.map((e) => r[e] || t(e))).then((e) => (c(...e), i));
  };
}
define(["./workbox-f1770938"], function (e) {
  "use strict";
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/escudo-mestre-oprpg-webapp/data/ameacas.json",
          revision: "0f209ac25254b9d6efc98cc28d12ee36",
        },
        {
          url: "/escudo-mestre-oprpg-webapp/data/escudo-mestre-casa.json",
          revision: "f0eb50a0a4f9138bee8987dbf3e4123c",
        },
        {
          url: "/escudo-mestre-oprpg-webapp/fonts/SigilosDeConhecimento.ttf",
          revision: "9f2767d99518ebc448dd0e5906129300",
        },
        {
          url: "/escudo-mestre-oprpg-webapp/icons/ameacas-icon.webp",
          revision: "3edba779ec1ff8d59d4247c9aacbe450",
        },
        {
          url: "/escudo-mestre-oprpg-webapp/icons/elemento-conhecimento-icon.webp",
          revision: "23271ef71e498c73ecb9c0938abdd7c5",
        },
        {
          url: "/escudo-mestre-oprpg-webapp/icons/elemento-energia-icon.webp",
          revision: "381ad667968b496b878f7d32519fb704",
        },
        {
          url: "/escudo-mestre-oprpg-webapp/icons/elemento-medo-icon.webp",
          revision: "0422124b810eb41f417b9f8d36d5c646",
        },
        {
          url: "/escudo-mestre-oprpg-webapp/icons/elemento-morte-icon.webp",
          revision: "ca4436bc95412045911dc49bc24f0972",
        },
        {
          url: "/escudo-mestre-oprpg-webapp/icons/elemento-sangue-icon.webp",
          revision: "a3be39ae08071d625f57274d27bc3456",
        },
        {
          url: "/escudo-mestre-oprpg-webapp/icons/header-icon.webp",
          revision: "8ffc8e1d5cdef71d758a1f833763f38f",
        },
        {
          url: "/escudo-mestre-oprpg-webapp/icons/home-icon.webp",
          revision: "88aa1434866c5bc62504ea71d59327cf",
        },
        {
          url: "/escudo-mestre-oprpg-webapp/icons/icon-192.webp",
          revision: "5abdb21af8164700c9c2abed9bfdcd70",
        },
        {
          url: "/escudo-mestre-oprpg-webapp/icons/icon-512.webp",
          revision: "433eb6b50e353ce822e41c0edae17986",
        },
        {
          url: "/escudo-mestre-oprpg-webapp/icons/icon-exception.webp",
          revision: "957c365051d995a4089033a77f5486c6",
        },
        {
          url: "/escudo-mestre-oprpg-webapp/icons/regras-icon.webp",
          revision: "0e62816c943733f8f24943389328c502",
        },
        {
          url: "/escudo-mestre-oprpg-webapp/logo-ordem-paranormal-desespero.webp",
          revision: "b6bc448b10d9027b544ff2b2223609d2",
        },
        {
          url: "/escudo-mestre-oprpg-webapp/icons/pwa-icon-source.png",
          revision: "c198ef4be0fc6b4c9d7b0dcee8b715b0",
        },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/escudo-mestre-oprpg-webapp",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({ response: e }) =>
              e && "opaqueredirect" === e.type
                ? new Response(e.body, {
                    status: 200,
                    statusText: "OK",
                    headers: e.headers,
                  })
                : e,
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^\/escudo-mestre-oprpg-webapp\/data\//,
      new e.CacheFirst({
        cacheName: "data-cache",
        plugins: [new e.ExpirationPlugin({ maxAgeSeconds: 2592e3 })],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: "next-static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ sameOrigin: e, url: { pathname: s } }) =>
        !(!e || s.startsWith("/api/auth/callback") || !s.startsWith("/api/")),
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: n }) =>
        "1" === e.headers.get("RSC") &&
        "1" === e.headers.get("Next-Router-Prefetch") &&
        n &&
        !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc-prefetch",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: n }) =>
        "1" === e.headers.get("RSC") && n && !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: { pathname: e }, sameOrigin: s }) => s && !e.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ sameOrigin: e }) => !e,
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET",
    ),
    (self.__WB_DISABLE_DEV_LOGS = !0));
});

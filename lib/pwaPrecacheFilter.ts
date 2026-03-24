/**
 * Ficheiros sob `/_next/static/` têm hashes novos em cada build. Se estiverem no precache,
 * um service worker antigo (ou um deploy intermédio) continua a pedir URLs antigas → 404 e
 * `bad-precaching-response`. O runtime do Workbox já trata `/_next/static/*.js` com CacheFirst.
 */
export function includeUrlInPrecacheManifest(url: string): boolean {
  const pathOnly = (url.split("?")[0] ?? url).replace(/^https?:\/\/[^/]+/i, "");
  return !pathOnly.includes("/_next/static/");
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export { basePath };

export function assetUrl(path: string): string {
  return `${basePath}${path.startsWith("/") ? path : "/" + path}`;
}

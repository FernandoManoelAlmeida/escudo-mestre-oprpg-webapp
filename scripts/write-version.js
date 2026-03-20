#!/usr/bin/env node
/**
 * Gera public/version.json após o build de produção.
 * Lê .next/BUILD_ID quando existir; caso contrário usa timestamp.
 * Usado para detecção de nova versão no cliente (cache vs servidor).
 *
 * Uso: node scripts/write-version.js
 * Chamado pelo script de build: next build --webpack && node scripts/write-version.js
 */
const fs = require("fs");
const path = require("path");

/**
 * @param {string} [projectRoot]
 * @param {{ now?: () => string }} [opts]
 */
function writeVersion(projectRoot = path.resolve(__dirname, ".."), opts = {}) {
  const BUILD_ID_PATH = path.join(projectRoot, ".next", "BUILD_ID");
  const VERSION_PATH = path.join(projectRoot, "public", "version.json");

  let buildId;
  try {
    if (fs.existsSync(BUILD_ID_PATH)) {
      buildId = fs.readFileSync(BUILD_ID_PATH, "utf8").trim();
    }
  } catch {
    // ignore
  }
  if (!buildId) {
    buildId = `build-${Date.now()}`;
  }

  const payload = {
    buildId,
    generatedAt: (opts.now ?? (() => new Date().toISOString()))(),
  };

  const publicDir = path.dirname(VERSION_PATH);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(VERSION_PATH, JSON.stringify(payload, null, 2) + "\n", "utf8");
  return payload;
}

if (require.main === module) {
  writeVersion();
}

module.exports = { writeVersion };

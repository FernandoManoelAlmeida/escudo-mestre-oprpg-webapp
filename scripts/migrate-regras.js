#!/usr/bin/env node
console.warn(
  "[deprecated] scripts/migrate-regras.js → use migrate-regras-oprpg.js (yarn migrate:regras-oprpg)"
);
const { spawnSync } = require("child_process");
const path = require("path");
const r = spawnSync(
  process.execPath,
  [path.join(__dirname, "migrate-regras-oprpg.js"), ...process.argv.slice(2)],
  { stdio: "inherit" }
);
process.exit(r.status ?? 1);

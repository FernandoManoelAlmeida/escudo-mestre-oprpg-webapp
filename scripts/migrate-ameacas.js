#!/usr/bin/env node
console.warn(
  "[deprecated] scripts/migrate-ameacas.js → use migrate-ameacas-oprpg.js (yarn migrate:ameacas-oprpg)"
);
const { spawnSync } = require("child_process");
const path = require("path");
const r = spawnSync(
  process.execPath,
  [path.join(__dirname, "migrate-ameacas-oprpg.js"), ...process.argv.slice(2)],
  { stdio: "inherit" }
);
process.exit(r.status ?? 1);

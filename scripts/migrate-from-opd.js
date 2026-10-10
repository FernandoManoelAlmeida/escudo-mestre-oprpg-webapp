#!/usr/bin/env node
console.warn(
  "[deprecated] scripts/migrate-from-opd.js → use migrate-from-oprpg.js (yarn migrate:from-oprpg)"
);
const { spawnSync } = require("child_process");
const path = require("path");
const r = spawnSync(
  process.execPath,
  [path.join(__dirname, "migrate-from-oprpg.js"), ...process.argv.slice(2)],
  { stdio: "inherit" }
);
process.exit(r.status ?? 1);

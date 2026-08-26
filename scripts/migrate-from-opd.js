#!/usr/bin/env node
/**
 * Migra regras e ameaças a partir do vault OPD no layout hub TTRPG.
 *
 * Espera o clone OPD em ../ordem-paranormal-desespero/ (irmão deste repo em repos/).
 * Override com OPD_VAULT=/caminho/para/ordem-paranormal-desespero
 *
 * Uso:
 *   yarn migrate:from-opd
 *   yarn migrate:from-opd -- --no-update   # regras sem --update
 */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const defaultOpd = path.resolve(PROJECT_ROOT, "..", "ordem-paranormal-desespero");
const opdRoot = process.env.OPD_VAULT
  ? path.resolve(process.env.OPD_VAULT)
  : defaultOpd;

const regrasMd = path.join(opdRoot, "Referências", "Escudo do Mestre da Casa.md");
const ameacasMd = path.join(opdRoot, "Referências", "Fichas", "Ameaças.md");

const args = process.argv.slice(2);
const noUpdate = args.includes("--no-update");

function fail(msg) {
  console.error(`Erro: ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(opdRoot)) {
  fail(
    `Vault OPD não encontrado em ${opdRoot}. Defina OPD_VAULT ou clone o hub (./scripts/bootstrap.sh).`
  );
}
if (!fs.existsSync(regrasMd)) {
  fail(`Arquivo de regras não encontrado: ${regrasMd}`);
}
if (!fs.existsSync(ameacasMd)) {
  fail(`Arquivo de ameaças não encontrado: ${ameacasMd}`);
}

console.log("=== migrate:from-opd ===");
console.log(`OPD vault: ${opdRoot}`);

const regrasArgs = ["scripts/migrate-regras.js", regrasMd];
if (!noUpdate) regrasArgs.push("--update");

console.log("\n--- migrate:regras ---");
const r1 = spawnSync(process.execPath, regrasArgs, {
  cwd: PROJECT_ROOT,
  stdio: "inherit",
});
if (r1.status !== 0) process.exit(r1.status ?? 1);

console.log("\n--- migrate:ameacas ---");
const r2 = spawnSync(process.execPath, ["scripts/migrate-ameacas.js", ameacasMd], {
  cwd: PROJECT_ROOT,
  stdio: "inherit",
});
if (r2.status !== 0) process.exit(r2.status ?? 1);

console.log("\n=== Migração concluída ===");

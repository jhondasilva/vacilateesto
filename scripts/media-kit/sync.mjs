#!/usr/bin/env node
/**
 * Sincroniza el Media Kit: métricas -> PDFs -> cache-buster.
 *
 * Uso:
 *   node scripts/media-kit/sync.mjs            # bump de versión + regenerar PDFs + QA
 *   node scripts/media-kit/sync.mjs --check    # solo verifica que no haya desincronización
 *
 * Fuente única de datos: src/data/mediaKitMetrics.json
 * Consumidores: src/pages/MediaKit.tsx (web) y scripts/media-kit/generate-*.py (PDF)
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, statSync, readdirSync, unlinkSync } from "node:fs";

const METRICS = "src/data/mediaKitMetrics.json";
const PDFS = [
  { script: "scripts/media-kit/generate-ve-mediakit.py", out: "public/downloads/VacilateEsto-MediaKit-2026.pdf" },
  { script: "scripts/media-kit/generate-vem-mediakit.py", out: "public/downloads/VacilateElFutbol-MediaKit-2026.pdf" },
];
const check = process.argv.includes("--check");

const metrics = JSON.parse(readFileSync(METRICS, "utf8"));

function nextVersion(current) {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  if (!current.startsWith(today)) return today;
  const suffix = current.slice(today.length);
  const next = suffix ? String.fromCharCode(suffix.charCodeAt(0) + 1) : "b";
  return today + next;
}

// 1. Verificación de desincronización: PDF más viejo que las métricas
const metricsMtime = statSync(METRICS).mtimeMs;
const stale = PDFS.filter((p) => {
  try { return statSync(p.out).mtimeMs < metricsMtime; } catch { return true; }
});

if (check) {
  if (stale.length) {
    console.error("DESINCRONIZADO: regenerar ->", stale.map((s) => s.out).join(", "));
    process.exit(1);
  }
  console.log(`OK · métricas v${metrics.version} · PDFs al día`);
  process.exit(0);
}

// 2. Bump del cache-buster (la web lo lee del mismo JSON, no hay que tocar TSX)
const version = nextVersion(metrics.version);
metrics.version = version;
metrics.generatedAt = new Date().toISOString();
writeFileSync(METRICS, JSON.stringify(metrics, null, 2) + "\n");
console.log("cache-buster ->", version);

// 3. Regenerar PDFs
for (const { script } of PDFS) {
  console.log("generando", script);
  execFileSync("python3", [script], { stdio: "inherit" });
}

// 4. QA: render de cada página a imagen para inspección visual
const qaDir = "/tmp/mediakit-qa";
execFileSync("mkdir", ["-p", qaDir]);
for (const f of readdirSync(qaDir)) unlinkSync(`${qaDir}/${f}`);
for (const { out } of PDFS) {
  const name = out.split("/").pop().replace(".pdf", "");
  execFileSync("pdftoppm", ["-jpeg", "-r", "100", out, `${qaDir}/${name}`]);
}
console.log("QA renders en", qaDir, "->", readdirSync(qaDir).length, "páginas");
console.log("Listo. Revisa los renders antes de publicar.");

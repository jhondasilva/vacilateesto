#!/usr/bin/env node
/**
 * Validador de secciones enlazables del home.
 *
 * Recorre los componentes de las secciones del home (los que se renderizan
 * dentro de <Index />) y verifica para cada <section id="..."> que tenga:
 *   1. id único en todo el home
 *   2. aria-labelledby que apunte a un id existente dentro del mismo archivo
 *   3. itemScope + itemType (Schema.org)
 *   4. <meta itemProp="name" />, "description" y "url" sin valores duplicados
 *   5. itemProp="url" canónica: HTTPS, dominio canónico oficial,
 *      hash que coincide con el id de la sección, sin query/trailing slash sucio.
 *
 * Falla el build (exit 1) si encuentra errores.
 * Se ejecuta automáticamente vía `npm run build` (prebuild).
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Componentes que aportan secciones enlazables al home (orden de Index.tsx).
// Para cada sección se puede declarar `canonicalKind`:
//   - "home-anchor" (default): la URL debe ser https://www.vacilateesto.com/#<id>
//   - "internal-page": la URL debe ser https://www.vacilateesto.com/<path>
//   - "external": la URL puede apuntar a otro dominio oficial del ecosistema
//     (en este caso se valida https + ausencia de query, sin chequear hash).
const SECTIONS = [
  { file: "src/components/HeroSection.tsx" },
  { file: "src/components/HomeSearchSection.tsx" },
  { file: "src/components/MediaHoldingSection.tsx" },
  { file: "src/components/VacilateElMundialSection.tsx", canonicalKind: "internal-page" },
  { file: "src/components/EpisodesSection.tsx" },
  { file: "src/components/ShortsSection.tsx" },
  { file: "src/components/HostsSection.tsx" },
  { file: "src/components/EcosystemSection.tsx" },
  { file: "src/components/PlatformsSection.tsx" },
  { file: "src/components/AgendaSection.tsx" },
  { file: "src/components/PeloticaSection.tsx", canonicalKind: "external" },
  { file: "src/components/GuerraComercialesSection.tsx" },
  { file: "src/components/RutaRamenSection.tsx" },
  { file: "src/components/NewsletterSection.tsx" },
];
const SECTION_FILES = SECTIONS.map((s) => s.file);

const REQUIRED_ITEMPROPS = ["name", "description", "url"];

// Dominio canónico oficial del sitio (debe coincidir con <link rel="canonical">
// y con sitemap.xml). Cualquier itemProp="url" del home debe usar exactamente este origin.
const CANONICAL_ORIGIN = "https://www.vacilateesto.com";

/**
 * Encuentra el primer <section ...> top-level con id="..." en el archivo.
 * Devuelve el bloque de atributos como string para que regex secundarios lo procesen.
 */
function extractSectionTagAttrs(source) {
  // Buscamos cualquier <section ... id="..."> (multiline) que sea el wrapper principal.
  const re = /<section\b([^>]*?\bid=["']([^"']+)["'][^>]*)>/s;
  const m = source.match(re);
  if (!m) return null;
  return { attrs: m[1], id: m[2] };
}

function attrValue(attrs, name) {
  const re = new RegExp(`\\b${name}=["']([^"']+)["']`);
  const m = attrs.match(re);
  return m ? m[1] : null;
}

function hasBareAttr(attrs, name) {
  // Acepta tanto `itemScope` como `itemScope={true}`.
  const re = new RegExp(`\\b${name}\\b(?!=)`);
  return re.test(attrs);
}

/**
 * Devuelve los valores de <meta itemProp="X" content="Y" /> dentro del archivo
 * que pertenezcan al wrapper de la sección (heurística: cualquier meta itemProp
 * en el archivo del componente).
 */
function collectItemProps(source) {
  const result = {};
  const re =
    /<meta\s+itemProp=["']([^"']+)["']\s+content=["']([^"']+)["']\s*\/?>/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    const key = m[1];
    const val = m[2];
    if (!result[key]) result[key] = [];
    result[key].push(val);
  }
  return result;
}

const errors = [];
const warnings = [];
const seenIds = new Map(); // id -> file
const seenItemPropValues = {
  name: new Map(),
  description: new Map(),
  url: new Map(),
};

// Resultado estructurado por sección, usado para emitir el reporte HTML/JSON.
const sectionResults = [];

for (const sectionDef of SECTIONS) {
  const rel = sectionDef.file;
  const canonicalKind = sectionDef.canonicalKind || "home-anchor";
  const abs = resolve(ROOT, rel);
  const result = {
    file: rel,
    canonicalKind,
    id: null,
    ariaLabelledBy: null,
    itemType: null,
    itemProps: { name: null, description: null, url: null },
    errors: [],
    warnings: [],
  };
  const addError = (msg) => {
    errors.push(msg);
    result.errors.push(msg);
  };
  const addWarning = (msg) => {
    warnings.push(msg);
    result.warnings.push(msg);
  };

  if (!existsSync(abs)) {
    addError(`[missing-file] No se encontró ${rel}`);
    sectionResults.push(result);
    continue;
  }
  const source = readFileSync(abs, "utf8");
  const section = extractSectionTagAttrs(source);
  if (!section) {
    addError(`[no-section] ${rel}: no se encontró <section id="..."> top-level`);
    sectionResults.push(result);
    continue;
  }
  const { attrs, id } = section;
  result.id = id;

  // 1. id único
  if (seenIds.has(id)) {
    addError(
      `[dup-id] id="${id}" duplicado en ${rel} (también en ${seenIds.get(id)})`,
    );
  } else {
    seenIds.set(id, rel);
  }

  // 2. aria-labelledby presente y referenciando un id existente en el archivo
  const aria = attrValue(attrs, "aria-labelledby");
  result.ariaLabelledBy = aria;
  if (!aria) {
    addError(`[aria] ${rel}: <section id="${id}"> sin aria-labelledby`);
  } else {
    // Aceptamos:
    //   - id="X"  (HTML literal)
    //   - titleId="X" o cualquier prop *Id="X" (forwarded a un hijo, p.ej. StickerHeader)
    const literalRe = new RegExp(`\\bid=["']${aria}["']`);
    const propRe = new RegExp(`\\b[A-Za-z]+Id=["']${aria}["']`);
    if (!literalRe.test(source) && !propRe.test(source)) {
      addError(
        `[aria-target] ${rel}: aria-labelledby="${aria}" no apunta a ningún id en el archivo`,
      );
    }
  }

  // 3. itemScope + itemType
  if (!hasBareAttr(attrs, "itemScope")) {
    addError(`[itemScope] ${rel}: <section id="${id}"> sin itemScope`);
  }
  const itemType = attrValue(attrs, "itemType");
  result.itemType = itemType;
  if (!itemType) {
    addError(`[itemType] ${rel}: <section id="${id}"> sin itemType`);
  } else if (!itemType.startsWith("https://schema.org/")) {
    addWarning(
      `[itemType-url] ${rel}: itemType="${itemType}" debería empezar con https://schema.org/`,
    );
  }

  // 4. meta itemProp name/description/url presentes y únicos
  const props = collectItemProps(source);
  for (const key of REQUIRED_ITEMPROPS) {
    const values = props[key] || [];
    if (values.length === 0) {
      addError(`[itemProp-missing] ${rel} (#${id}): falta <meta itemProp="${key}" />`);
      continue;
    }
    // tomamos el primer valor como el "oficial" de la sección
    const value = values[0];
    result.itemProps[key] = value;
    const bucket = seenItemPropValues[key];
    if (bucket.has(value)) {
      addError(
        `[itemProp-dup] ${rel} (#${id}): itemProp="${key}" valor duplicado con ${bucket.get(value)} → "${value}"`,
      );
    } else {
      bucket.set(value, rel);
    }
  }

  // 5. itemProp="url" debe ser canónica.
  const urlValue = (props.url || [])[0];
  if (urlValue) {
    let parsed = null;
    try {
      parsed = new URL(urlValue);
    } catch {
      addError(
        `[url-invalid] ${rel} (#${id}): itemProp="url" no es una URL válida → "${urlValue}"`,
      );
    }
    if (parsed) {
      // Reglas comunes a todos los kinds.
      if (parsed.protocol !== "https:") {
        addError(
          `[url-protocol] ${rel} (#${id}): itemProp="url" debe usar https → "${urlValue}"`,
        );
      }
      if (parsed.search) {
        addError(
          `[url-query] ${rel} (#${id}): itemProp="url" no debe contener query string → "${urlValue}"`,
        );
      }
      if (parsed.pathname.includes("//")) {
        addError(
          `[url-double-slash] ${rel} (#${id}): itemProp="url" tiene "//" en el path → "${urlValue}"`,
        );
      }

      if (canonicalKind === "home-anchor") {
        if (parsed.origin !== CANONICAL_ORIGIN) {
          addError(
            `[url-origin] ${rel} (#${id}): itemProp="url" debe usar ${CANONICAL_ORIGIN} → "${urlValue}"`,
          );
        }
        if (parsed.pathname !== "/" && parsed.pathname !== "") {
          addError(
            `[url-path] ${rel} (#${id}): canonical home-anchor debe apuntar a "/" (recibido "${parsed.pathname}") → "${urlValue}"`,
          );
        }
        const hash = parsed.hash.replace(/^#/, "");
        if (!hash) {
          addError(
            `[url-hash-missing] ${rel} (#${id}): itemProp="url" debe terminar con "#${id}" → "${urlValue}"`,
          );
        } else if (hash !== id) {
          addError(
            `[url-hash-mismatch] ${rel} (#${id}): hash "#${hash}" no coincide con id="${id}" → "${urlValue}"`,
          );
        }
      } else if (canonicalKind === "internal-page") {
        if (parsed.origin !== CANONICAL_ORIGIN) {
          addError(
            `[url-origin] ${rel} (#${id}): canonical internal-page debe usar ${CANONICAL_ORIGIN} → "${urlValue}"`,
          );
        }
        if (!parsed.pathname || parsed.pathname === "/") {
          addError(
            `[url-path] ${rel} (#${id}): canonical internal-page debe tener un path no vacío → "${urlValue}"`,
          );
        }
        if (parsed.pathname.length > 1 && parsed.pathname.endsWith("/")) {
          addError(
            `[url-trailing-slash] ${rel} (#${id}): canonical internal-page no debe terminar en "/" → "${urlValue}"`,
          );
        }
        if (parsed.hash) {
          addWarning(
            `[url-hash-on-page] ${rel} (#${id}): canonical internal-page no suele incluir hash → "${urlValue}"`,
          );
        }
      } else if (canonicalKind === "external") {
        if (parsed.origin === CANONICAL_ORIGIN) {
          addError(
            `[url-external] ${rel} (#${id}): canonical external no debería apuntar al dominio principal → "${urlValue}"`,
          );
        }
        if (parsed.pathname.length > 1 && parsed.pathname.endsWith("/")) {
          addWarning(
            `[url-trailing-slash] ${rel} (#${id}): canonical external termina en "/" → "${urlValue}"`,
          );
        }
      } else {
        addError(
          `[canonical-kind] ${rel} (#${id}): canonicalKind desconocido "${canonicalKind}"`,
        );
      }
    }
  }
  sectionResults.push(result);
}

const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const BOLD = "\x1b[1m";

console.log(`${BOLD}🔎 Validador de secciones enlazables del home${RESET}`);
console.log(`   Archivos analizados: ${SECTION_FILES.length}`);
console.log(`   IDs únicos detectados: ${seenIds.size}`);

if (warnings.length) {
  console.log(`\n${YELLOW}⚠ Advertencias (${warnings.length}):${RESET}`);
  for (const w of warnings) console.log(`   ${YELLOW}• ${w}${RESET}`);
}

// === Reporte HTML + JSON ===
const reportDir = resolve(ROOT, "dist");
try {
  mkdirSync(reportDir, { recursive: true });
} catch {
  /* noop */
}

const generatedAt = new Date().toISOString();
const totalSections = sectionResults.length;
const sectionsOk = sectionResults.filter((s) => s.errors.length === 0).length;
const sectionsWithErrors = totalSections - sectionsOk;
const sectionsWithWarnings = sectionResults.filter((s) => s.warnings.length > 0).length;
const overallStatus = errors.length === 0 ? "pass" : "fail";

const reportData = {
  generatedAt,
  status: overallStatus,
  canonicalOrigin: CANONICAL_ORIGIN,
  totals: {
    sections: totalSections,
    sectionsOk,
    sectionsWithErrors,
    sectionsWithWarnings,
    errors: errors.length,
    warnings: warnings.length,
  },
  sections: sectionResults,
};

writeFileSync(
  resolve(reportDir, "seo-sections-report.json"),
  JSON.stringify(reportData, null, 2),
  "utf8",
);

const escapeHtml = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const statusBadge = (s) => {
  if (s.errors.length > 0) return `<span class="badge fail">FAIL</span>`;
  if (s.warnings.length > 0) return `<span class="badge warn">WARN</span>`;
  return `<span class="badge ok">OK</span>`;
};

const rows = sectionResults
  .map((s) => {
    const issues = [
      ...s.errors.map((e) => `<li class="err">${escapeHtml(e)}</li>`),
      ...s.warnings.map((w) => `<li class="warn">${escapeHtml(w)}</li>`),
    ].join("");
    return `
    <tr class="${s.errors.length ? "row-fail" : s.warnings.length ? "row-warn" : "row-ok"}">
      <td>${statusBadge(s)}</td>
      <td><code>#${escapeHtml(s.id || "—")}</code></td>
      <td><code>${escapeHtml(s.file)}</code></td>
      <td>${escapeHtml(s.canonicalKind)}</td>
      <td><code>${escapeHtml(s.itemType || "—")}</code></td>
      <td>${escapeHtml(s.itemProps.name || "—")}</td>
      <td><a href="${escapeHtml(s.itemProps.url || "#")}" rel="noopener">${escapeHtml(s.itemProps.url || "—")}</a></td>
      <td>${issues ? `<ul class="issues">${issues}</ul>` : `<span class="muted">—</span>`}</td>
    </tr>`;
  })
  .join("");

const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Reporte SEO de secciones · Vacílate Esto</title>
  <meta name="robots" content="noindex,nofollow" />
  <style>
    :root { color-scheme: light dark; }
    * { box-sizing: border-box; }
    body { font: 14px/1.5 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 32px; background: #0b0b0f; color: #e9e9ee; }
    h1 { margin: 0 0 4px; font-size: 22px; }
    .sub { color: #9b9bab; margin: 0 0 24px; font-size: 12px; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 24px; }
    .card { background: #16161e; border: 1px solid #24242f; border-radius: 10px; padding: 14px 16px; }
    .card .k { color: #9b9bab; font-size: 11px; text-transform: uppercase; letter-spacing: .08em; }
    .card .v { font-size: 22px; font-weight: 700; margin-top: 4px; }
    .card.ok .v { color: #4ade80; }
    .card.warn .v { color: #fbbf24; }
    .card.fail .v { color: #f87171; }
    table { width: 100%; border-collapse: collapse; background: #11111a; border: 1px solid #24242f; border-radius: 10px; overflow: hidden; }
    th, td { padding: 10px 12px; text-align: left; vertical-align: top; border-bottom: 1px solid #24242f; font-size: 13px; }
    th { background: #1a1a25; font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: #9b9bab; }
    tr:last-child td { border-bottom: none; }
    tr.row-fail { background: rgba(248, 113, 113, 0.05); }
    tr.row-warn { background: rgba(251, 191, 36, 0.05); }
    code { font: 12px ui-monospace, SFMono-Regular, Menlo, monospace; background: #1f1f2c; padding: 1px 6px; border-radius: 4px; }
    a { color: #93c5fd; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: .04em; }
    .badge.ok { background: #052e1c; color: #4ade80; border: 1px solid #14532d; }
    .badge.warn { background: #2a1c00; color: #fbbf24; border: 1px solid #78350f; }
    .badge.fail { background: #2b0a0e; color: #f87171; border: 1px solid #7f1d1d; }
    ul.issues { margin: 0; padding-left: 18px; }
    ul.issues li.err { color: #fca5a5; }
    ul.issues li.warn { color: #fcd34d; }
    .muted { color: #555566; }
    footer { margin-top: 24px; color: #6b6b7a; font-size: 12px; }
  </style>
</head>
<body>
  <h1>Reporte SEO de secciones del home</h1>
  <p class="sub">Generado el ${escapeHtml(generatedAt)} · Dominio canónico: <code>${escapeHtml(CANONICAL_ORIGIN)}</code> · Estado global: <strong>${overallStatus.toUpperCase()}</strong></p>

  <div class="summary">
    <div class="card"><div class="k">Secciones</div><div class="v">${totalSections}</div></div>
    <div class="card ok"><div class="k">OK</div><div class="v">${sectionsOk}</div></div>
    <div class="card fail"><div class="k">Con errores</div><div class="v">${sectionsWithErrors}</div></div>
    <div class="card warn"><div class="k">Con avisos</div><div class="v">${sectionsWithWarnings}</div></div>
    <div class="card fail"><div class="k">Errores totales</div><div class="v">${errors.length}</div></div>
    <div class="card warn"><div class="k">Avisos totales</div><div class="v">${warnings.length}</div></div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Estado</th>
        <th>ID</th>
        <th>Archivo</th>
        <th>Canonical</th>
        <th>itemType</th>
        <th>itemProp name</th>
        <th>itemProp url</th>
        <th>Issues</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <footer>Generado por <code>scripts/validate-home-sections.mjs</code> · También disponible como <code>seo-sections-report.json</code>.</footer>
</body>
</html>
`;

writeFileSync(resolve(reportDir, "seo-sections-report.html"), html, "utf8");
console.log(`\n📄 Reporte: dist/seo-sections-report.html (+ .json)`);

if (errors.length) {
  console.log(`\n${RED}✖ Errores (${errors.length}):${RESET}`);
  for (const e of errors) console.log(`   ${RED}• ${e}${RESET}`);
  console.log(
    `\n${RED}${BOLD}Build abortado: corrige los errores de SEO/accesibilidad de las secciones del home.${RESET}\n`,
  );
  process.exit(1);
}

console.log(`\n${GREEN}✔ Todas las secciones del home cumplen el contrato (id único, aria-labelledby, itemScope/itemType, meta itemProp).${RESET}\n`);
process.exit(0);
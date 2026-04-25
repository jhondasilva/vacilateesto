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
  if (!existsSync(abs)) {
    errors.push(`[missing-file] No se encontró ${rel}`);
    continue;
  }
  const source = readFileSync(abs, "utf8");
  const section = extractSectionTagAttrs(source);
  if (!section) {
    errors.push(`[no-section] ${rel}: no se encontró <section id="..."> top-level`);
    continue;
  }
  const { attrs, id } = section;

  // 1. id único
  if (seenIds.has(id)) {
    errors.push(
      `[dup-id] id="${id}" duplicado en ${rel} (también en ${seenIds.get(id)})`,
    );
  } else {
    seenIds.set(id, rel);
  }

  // 2. aria-labelledby presente y referenciando un id existente en el archivo
  const aria = attrValue(attrs, "aria-labelledby");
  if (!aria) {
    errors.push(`[aria] ${rel}: <section id="${id}"> sin aria-labelledby`);
  } else {
    // Aceptamos:
    //   - id="X"  (HTML literal)
    //   - titleId="X" o cualquier prop *Id="X" (forwarded a un hijo, p.ej. StickerHeader)
    const literalRe = new RegExp(`\\bid=["']${aria}["']`);
    const propRe = new RegExp(`\\b[A-Za-z]+Id=["']${aria}["']`);
    if (!literalRe.test(source) && !propRe.test(source)) {
      errors.push(
        `[aria-target] ${rel}: aria-labelledby="${aria}" no apunta a ningún id en el archivo`,
      );
    }
  }

  // 3. itemScope + itemType
  if (!hasBareAttr(attrs, "itemScope")) {
    errors.push(`[itemScope] ${rel}: <section id="${id}"> sin itemScope`);
  }
  const itemType = attrValue(attrs, "itemType");
  if (!itemType) {
    errors.push(`[itemType] ${rel}: <section id="${id}"> sin itemType`);
  } else if (!itemType.startsWith("https://schema.org/")) {
    warnings.push(
      `[itemType-url] ${rel}: itemType="${itemType}" debería empezar con https://schema.org/`,
    );
  }

  // 4. meta itemProp name/description/url presentes y únicos
  const props = collectItemProps(source);
  for (const key of REQUIRED_ITEMPROPS) {
    const values = props[key] || [];
    if (values.length === 0) {
      errors.push(`[itemProp-missing] ${rel} (#${id}): falta <meta itemProp="${key}" />`);
      continue;
    }
    // tomamos el primer valor como el "oficial" de la sección
    const value = values[0];
    const bucket = seenItemPropValues[key];
    if (bucket.has(value)) {
      errors.push(
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
      errors.push(
        `[url-invalid] ${rel} (#${id}): itemProp="url" no es una URL válida → "${urlValue}"`,
      );
    }
    if (parsed) {
      // Reglas comunes a todos los kinds.
      if (parsed.protocol !== "https:") {
        errors.push(
          `[url-protocol] ${rel} (#${id}): itemProp="url" debe usar https → "${urlValue}"`,
        );
      }
      if (parsed.search) {
        errors.push(
          `[url-query] ${rel} (#${id}): itemProp="url" no debe contener query string → "${urlValue}"`,
        );
      }
      if (parsed.pathname.includes("//")) {
        errors.push(
          `[url-double-slash] ${rel} (#${id}): itemProp="url" tiene "//" en el path → "${urlValue}"`,
        );
      }

      if (canonicalKind === "home-anchor") {
        if (parsed.origin !== CANONICAL_ORIGIN) {
          errors.push(
            `[url-origin] ${rel} (#${id}): itemProp="url" debe usar ${CANONICAL_ORIGIN} → "${urlValue}"`,
          );
        }
        if (parsed.pathname !== "/" && parsed.pathname !== "") {
          errors.push(
            `[url-path] ${rel} (#${id}): canonical home-anchor debe apuntar a "/" (recibido "${parsed.pathname}") → "${urlValue}"`,
          );
        }
        const hash = parsed.hash.replace(/^#/, "");
        if (!hash) {
          errors.push(
            `[url-hash-missing] ${rel} (#${id}): itemProp="url" debe terminar con "#${id}" → "${urlValue}"`,
          );
        } else if (hash !== id) {
          errors.push(
            `[url-hash-mismatch] ${rel} (#${id}): hash "#${hash}" no coincide con id="${id}" → "${urlValue}"`,
          );
        }
      } else if (canonicalKind === "internal-page") {
        if (parsed.origin !== CANONICAL_ORIGIN) {
          errors.push(
            `[url-origin] ${rel} (#${id}): canonical internal-page debe usar ${CANONICAL_ORIGIN} → "${urlValue}"`,
          );
        }
        if (!parsed.pathname || parsed.pathname === "/") {
          errors.push(
            `[url-path] ${rel} (#${id}): canonical internal-page debe tener un path no vacío → "${urlValue}"`,
          );
        }
        if (parsed.pathname.length > 1 && parsed.pathname.endsWith("/")) {
          errors.push(
            `[url-trailing-slash] ${rel} (#${id}): canonical internal-page no debe terminar en "/" → "${urlValue}"`,
          );
        }
        if (parsed.hash) {
          warnings.push(
            `[url-hash-on-page] ${rel} (#${id}): canonical internal-page no suele incluir hash → "${urlValue}"`,
          );
        }
      } else if (canonicalKind === "external") {
        if (parsed.origin === CANONICAL_ORIGIN) {
          errors.push(
            `[url-external] ${rel} (#${id}): canonical external no debería apuntar al dominio principal → "${urlValue}"`,
          );
        }
        if (parsed.pathname.length > 1 && parsed.pathname.endsWith("/")) {
          warnings.push(
            `[url-trailing-slash] ${rel} (#${id}): canonical external termina en "/" → "${urlValue}"`,
          );
        }
      } else {
        errors.push(
          `[canonical-kind] ${rel} (#${id}): canonicalKind desconocido "${canonicalKind}"`,
        );
      }
    }
  }
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
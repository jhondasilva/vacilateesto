import { test } from "node:test";
import { ok, strictEqual } from "node:assert";
import { resolveBrandLogo, BRAND_LOGO_MAP } from "../src/lib/brandLogos";

// Read-only inventory of the 28 existing brand slugs; existing remote logos stay untouched.
const existingLogoSlugs = ["bnc", "buchanans", "covencaucho", "nestea", "plumrose"];
const allSlugs = ["banco-de-venezuela", "bnc", "buchanans", "cashea", "club-social", "coca-cola", "covencaucho", "diablitos", "doritos-pdg", "empire", "harina-pan", "kfc", "maggi", "maltin-pdg", "nestea", "pan-pdg", "pelotica-de-goma", "pilsen-pdg", "plan-b", "planeta-sport", "plumrose", "podcast-en-la-cumbre", "quimicolor", "ronco", "solera", "speed-stick", "vacilate-el-mundial", "vatel"];

test("all 28 existing brand entries resolve a logo from the registry or their existing logo_url", () => {
  strictEqual(allSlugs.length, 28);
  for (const slug of allSlugs) ok(resolveBrandLogo(slug, existingLogoSlugs.includes(slug) ? `/existing/${slug}.png` : null)?.src, slug);
});

for (const slug of ["coca-cola", "kfc"]) {
  test(`${slug} keeps existing logo_url priority and local fallback`, () => {
    strictEqual(resolveBrandLogo(slug, "/existing/official.png")?.src, "/existing/official.png");
    strictEqual(resolveBrandLogo(slug)?.src, BRAND_LOGO_MAP[slug].src);
  });
}

test("dark-ink additions and existing light logos keep white-backing role", () => {
  for (const slug of ["banco-de-venezuela", "planeta-sport", "quimicolor", "diablitos", "cashea"]) strictEqual(resolveBrandLogo(slug)?.bg, "light", slug);
});

test("PAN reuses Harina P.A.N. and rectangular original dimensions are preserved", () => {
  strictEqual(resolveBrandLogo("pan-pdg")?.src, resolveBrandLogo("harina-pan")?.src);
  const viewport = resolveBrandLogo("plan-b")?.viewport;
  strictEqual(viewport?.imageWidth, 2048);
  strictEqual(viewport?.imageHeight, 918);
  strictEqual(viewport?.width, 2012);
  strictEqual(viewport?.height, 600);
});

test("Pelotica de Goma dashboard uses the official black-text artwork on white", () => {
  const logo = resolveBrandLogo("pelotica-de-goma");
  strictEqual(logo?.bg, "light");
  ok(logo?.src.includes("pelotica-texto-negro-oficial.png"));
  deepStrictEqual(logo?.viewport, {
    imageWidth: 2000,
    imageHeight: 2000,
    x: 638,
    y: 278,
    width: 807,
    height: 1466,
  });
});
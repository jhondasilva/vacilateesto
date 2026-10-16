import { test } from "node:test";
import { strictEqual, deepStrictEqual } from "node:assert";
import { readFileSync } from "node:fs";
import { classifyIntent, createDeduper, isPrivatePath, isProductionHost, sanitizeUrl } from "../src/lib/analytics";
import { routeSeo, isPublicRoute } from "../src/lib/seo";
import { episodeJsonLd, isValidVideoId } from "../src/lib/episodes";

test("solo mide en vacilateesto.com y www.vacilateesto.com", () => {
  strictEqual(isProductionHost("www.vacilateesto.com"), true);
  strictEqual(isProductionHost("vacilateesto.com"), true);
  strictEqual(isProductionHost("localhost"), false);
  strictEqual(isProductionHost("id-preview--x.lovable.app"), false);
  strictEqual(isProductionHost("vacilateesto.lovable.app"), false);
  strictEqual(isProductionHost("vacilateelmundial.com"), false);
});

test("rutas privadas excluidas", () => {
  for (const p of ["/dashboard", "/dashboard/pilsen", "/gira", "/gira/politicas", "/reset-password", "/admin", "/auth/callback"]) {
    strictEqual(isPrivatePath(p), true, p);
  }
  for (const p of ["/", "/fali", "/blog/x", "/dashboards-publicos", "/gira-mundial"]) strictEqual(isPrivatePath(p), false, p);
});

test("page_location sin query, hash ni rutas privadas", () => {
  strictEqual(sanitizeUrl("https://www.vacilateesto.com/buscador?q=correo@x.com#a"), "https://www.vacilateesto.com/buscador");
  strictEqual(sanitizeUrl("https://www.vacilateesto.com/dashboard/pilsen?t=1"), "https://www.vacilateesto.com/");
  strictEqual(sanitizeUrl(""), "");
});

test("deduplicación: StrictMode no duplica; atrás/adelante sí cuenta", () => {
  const isNew = createDeduper();
  strictEqual(isNew({ key: "default", pathname: "/" }), true);
  strictEqual(isNew({ key: "default", pathname: "/" }), false); // doble efecto StrictMode
  strictEqual(isNew({ key: "k1", pathname: "/fali" }), true);
  strictEqual(isNew({ key: "default", pathname: "/" }), true); // botón atrás
  strictEqual(isNew({ key: "k1", pathname: "/fali" }), true); // botón adelante
});

test("intención de contacto separada del lead", () => {
  strictEqual(classifyIntent("mailto:prensa@x.com"), "email");
  strictEqual(classifyIntent("https://wa.me/58412"), "whatsapp");
  strictEqual(classifyIntent("/downloads/VacilateEsto-MediaKit-2026.pdf?v=3"), "media_kit");
  strictEqual(classifyIntent("/media-kit"), null);
});

test("metadatos: canonical www por ruta pública y noindex en privadas y 404", () => {
  deepStrictEqual(routeSeo("/").canonical, "https://www.vacilateesto.com/");
  deepStrictEqual(routeSeo("/press-kit/").canonical, "https://www.vacilateesto.com/press-kit");
  deepStrictEqual(routeSeo("/episodios/abcdefghijk").canonical, "https://www.vacilateesto.com/episodios/abcdefghijk");
  strictEqual(routeSeo("/dashboard").canonical, null);
  strictEqual(routeSeo("/dashboard").robots.startsWith("noindex"), true);
  strictEqual(routeSeo("/no-existe").robots.startsWith("noindex"), true);
  strictEqual(routeSeo("/gira/politicas").robots.startsWith("noindex"), true);
  strictEqual(isPublicRoute("/en/fali"), true);
});

test("episodios: id válido y schema VideoObject + Breadcrumb con canonical propio", () => {
  strictEqual(isValidVideoId("dQw4w9WgXcQ"), true);
  strictEqual(isValidVideoId("../etc"), false);
  const ld = episodeJsonLd({ video_id: "dQw4w9WgXcQ", title: "T", description: null, thumbnail_url: null, published_at: null, duration_seconds: null, kind: "podcast" });
  const [video, crumbs] = ld["@graph"] as any[];
  strictEqual(video["@type"], "VideoObject");
  strictEqual(video.url, "https://www.vacilateesto.com/episodios/dQw4w9WgXcQ");
  strictEqual("uploadDate" in video, false); // sin fecha inventada
  strictEqual(crumbs["@type"], "BreadcrumbList");
});

test("sitemap: sin rutas privadas ni anclas, con prensa/premios/proyectos", () => {
  const xml = readFileSync("public/sitemap.xml", "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  strictEqual(locs.some((l) => l.includes("#")), false);
  strictEqual(locs.some((l) => l.includes("/gira")), false);
  for (const p of ["/premios", "/press-kit", "/prensa/pico-bolivar", "/prensa/fiap-2026", "/prensa/cobertura", "/walking-ads", "/streaming-from-the-lost-world", "/cannes"]) {
    strictEqual(locs.includes(`https://www.vacilateesto.com${p}`), true, p);
  }
  for (const l of locs) strictEqual(l.startsWith("https://www.vacilateesto.com/"), true, l);
  for (const l of locs) strictEqual(isPublicRoute(new URL(l).pathname), true, l);
});

test("funciones de sitemap/feed apuntan a /episodios y no usan la fecha de hoy", () => {
  const sv = readFileSync("supabase/functions/sitemap-videos/index.ts", "utf8");
  const feed = readFileSync("supabase/functions/episodes-feed/index.ts", "utf8");
  strictEqual(sv.includes("buscador?v="), false);
  strictEqual(feed.includes("buscador?v="), false);
  strictEqual(sv.includes("new Date().toISOString"), false);
  strictEqual(sv.includes("/episodios/"), true);
});

describe("Metricool y service worker", () => {
  it("omite Metricool con query, hash o referrer sensible", async () => {
    const { metricoolSafe } = await import("../src/lib/analytics");
    expect(metricoolSafe("https://www.vacilateesto.com/blog", "")).toBe(true);
    expect(metricoolSafe("https://www.vacilateesto.com/buscador?q=hola", "")).toBe(false);
    expect(metricoolSafe("https://www.vacilateesto.com/?token=x", "")).toBe(false);
    expect(metricoolSafe("https://www.vacilateesto.com/#access_token=x", "")).toBe(false);
    expect(metricoolSafe("https://www.vacilateesto.com/", "https://www.vacilateesto.com/dashboard/x")).toBe(false);
    expect(metricoolSafe("https://www.vacilateesto.com/", "https://google.com/search?q=a")).toBe(false);
    expect(metricoolSafe("https://www.vacilateesto.com/", "https://www.google.com/")).toBe(true);
  });
  it("el SW no sirve la app en robots, sitemaps, llms ni descargas", async () => {
    const src = (await import("fs")).readFileSync("vite.config.ts", "utf8");
    const m = src.match(/navigateFallbackDenylist: \[([\s\S]*?)\],/)!;
    const list = eval(`[${m[1].replace(/\/\/.*$/gm, "")}]`) as RegExp[];
    const denied = (p: string) => list.some((r) => r.test(p));
    for (const p of ["/robots.txt", "/sitemap.xml", "/sitemap-videos.xml", "/llms.txt", "/google123.html", "/downloads/VacilateEsto-MediaKit-2026.pdf"]) expect(denied(p)).toBe(true);
    for (const p of ["/", "/fali", "/en/fali", "/episodios/abc123", "/blog/numeros-vacilate-esto-2026"]) expect(denied(p)).toBe(false);
  });
});

import { test } from "node:test";
import { strictEqual, deepStrictEqual } from "node:assert";

// Navegador simulado en producción (sin red: los <script> no se cargan).
const loc = { hostname: "www.vacilateesto.com", origin: "https://www.vacilateesto.com", pathname: "/", href: "https://www.vacilateesto.com/?q=a#x" };
const g = globalThis as unknown as Record<string, unknown>;
g.window = g;
g.location = loc;
g.document = { referrer: "https://www.google.com/search?q=juan", head: { appendChild: () => {} }, createElement: () => ({}) };

const calls = (): unknown[][] => ((g.dataLayer as IArguments[]) || []).map((a) => Array.from(a));

test("contexto SPA: config limpia antes de un único page_view por ruta pública; nada en privadas", async () => {
  const a = await import("../src/lib/analytics");
  const go = (key: string, path: string) => {
    loc.pathname = path; loc.href = loc.origin + path;
    a.setCurrentEntry(`${key}|${path}`); a.setRoutePrivacy(path);
  };
  go("k1", "/");
  a.sendPageView("/", "Inicio", "k1|/");
  go("k2", "/premios");
  a.sendPageView("/premios", "Premios", "k2|/premios");
  go("k3", "/dashboard");
  a.sendPageView("/dashboard", "Privado", "k3|/dashboard");
  a.trackFormSuccess("newsletter");

  const c = calls().filter((x) => x[0] === "config" || x[0] === "event");
  deepStrictEqual(c, [
    ["config", a.GA_ID, { send_page_view: false, page_location: "https://www.vacilateesto.com/", page_referrer: "https://www.google.com/", page_title: "Inicio" }],
    ["event", "page_view", { page_location: "https://www.vacilateesto.com/", page_referrer: "https://www.google.com/", page_title: "Inicio" }],
    ["config", a.GA_ID, { send_page_view: false, page_location: "https://www.vacilateesto.com/premios", page_referrer: "https://www.vacilateesto.com/", page_title: "Premios" }],
    ["event", "page_view", { page_location: "https://www.vacilateesto.com/premios", page_referrer: "https://www.vacilateesto.com/", page_title: "Premios" }],
  ]);
  strictEqual(c.filter((x) => x[1] === "page_view").length, 2);
  strictEqual(g[`ga-disable-${a.GA_ID}`], true);

  // Vuelta a pública: el evento de negocio usa la URL y el referrer limpios actuales.
  go("k4", "/blog");
  a.sendPageView("/blog", "Blog", "k4|/blog");
  a.trackFormSuccess("newsletter");
  const last = calls().at(-1)!;
  deepStrictEqual(last, ["event", "newsletter_signup", { form_type: "newsletter", page_location: "https://www.vacilateesto.com/blog", page_referrer: "https://www.vacilateesto.com/premios" }]);
});

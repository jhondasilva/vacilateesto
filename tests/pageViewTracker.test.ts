import { test } from "node:test";
import { strictEqual, deepStrictEqual } from "node:assert";
import { readFileSync, readdirSync } from "node:fs";
import { createPageViewTracker, createMetricoolQueue } from "../src/lib/pageViewTracker";
import { isPublicRoute } from "../src/lib/routes";

const setup = () => {
  const env = { path: "/", title: "Inicio", noindex: false, waiting: false };
  const sent: [string, string][] = [];
  const privacy: string[] = [];
  let id = 0;
  const timers = new Map<number, { fn: () => void; ms: number }>();
  const observers = new Set<() => void>();
  const t = createPageViewTracker({
    getPath: () => env.path, getTitle: () => env.title, isNoindex: () => env.noindex,
    isWaiting: () => env.waiting,
    send: (p, title) => sent.push([p, title]), setPrivacy: (p) => privacy.push(p),
    setTimer: (fn, ms) => { timers.set(++id, { fn, ms }); return id; }, clearTimer: (i) => timers.delete(i),
    observeHead: (cb) => { observers.add(cb); return () => observers.delete(cb); },
  });
  const nav = (key: string, path: string) => { env.path = path; t.onLocation(key, path); };
  const runTimers = (limit = Infinity) => { const due = [...timers].filter(([, t]) => t.ms <= limit); due.forEach(([k]) => timers.delete(k)); due.forEach(([, t]) => t.fn()); };
  const headChanged = (title: string) => { env.title = title; [...observers].forEach((o) => o()); };
  return { env, sent, privacy, nav, runTimers, headChanged, timers };
};

test("carrera pública → privada: no se envía la vista pendiente ni el título privado", () => {
  const s = setup();
  s.nav("a", "/blog");
  s.nav("b", "/dashboard");
  s.env.title = "Dashboard privado";
  s.runTimers();
  deepStrictEqual(s.sent, []);
  strictEqual(s.timers.size, 0);
});

test("privada → pública: cuenta una vista con el título final de la pública", () => {
  const s = setup();
  s.nav("a", "/dashboard");
  s.nav("b", "/premios");
  s.headChanged("Premios | Vacílate Esto");
  s.runTimers();
  deepStrictEqual(s.sent, [["/premios", "Premios | Vacílate Esto"]]);
});

test("StrictMode: la misma entrada dos veces cuenta una sola vista", () => {
  const s = setup();
  s.nav("a", "/fali"); s.nav("a", "/fali");
  s.runTimers();
  strictEqual(s.sent.length, 1);
});

test("Atrás/adelante entre rutas distintas cuenta cada entrada", () => {
  const s = setup();
  s.nav("a", "/blog"); s.runTimers();
  s.nav("b", "/premios"); s.runTimers();
  s.nav("a", "/blog"); s.runTimers();
  deepStrictEqual(s.sent.map((x) => x[0]), ["/blog", "/premios", "/blog"]);
});

test("cambios solo de query (búsqueda) no repiten la vista", () => {
  const s = setup();
  s.nav("a", "/buscador"); s.runTimers();
  s.nav("b", "/buscador"); s.nav("c", "/buscador"); s.runTimers();
  strictEqual(s.sent.length, 1);
});

test("título tardío: espera la marca de carga y usa el título real", () => {
  const s = setup();
  s.env.waiting = true;
  s.nav("a", "/episodios/dQw4w9WgXcQ");
  s.headChanged("Inicio genérico");
  s.runTimers(500); // solo corre el settle: sigue esperando
  strictEqual(s.sent.length, 0);
  s.env.waiting = false;
  s.headChanged("Episodio X | Vacílate Esto");
  s.runTimers();
  deepStrictEqual(s.sent, [["/episodios/dQw4w9WgXcQ", "Episodio X | Vacílate Esto"]]);
});

test("rutas desconocidas, 404 con noindex y parámetros inválidos no se miden", () => {
  const s = setup();
  s.nav("a", "/no-existe"); s.runTimers();
  s.nav("b", "/episodios/correo@x.com"); s.runTimers();
  s.nav("c", "/blog/Juan Perez 0414"); s.runTimers();
  s.env.noindex = true; s.nav("d", "/blog/slug-borrado"); s.runTimers();
  deepStrictEqual(s.sent, []);
  strictEqual(isPublicRoute("/episodios/dQw4w9WgXcQ"), true);
  strictEqual(isPublicRoute("/blog/numeros-vacilate-esto-2026"), true);
  strictEqual(isPublicRoute("/~oauth/x"), false);
});

test("Metricool: callback tardío del SDK no emite un hit viejo en la ruta nueva", () => {
  let ready = false, current = "a|/blog", hits = 0;
  const q = createMetricoolQueue({ isReady: () => ready, currentEntry: () => current, isSafeNow: () => true, hit: () => hits++ });
  q.request("a|/blog");
  current = "b|/premios";
  ready = true; q.onReady();
  strictEqual(hits, 0);
  q.request("b|/premios"); q.request("b|/premios"); q.onReady();
  strictEqual(hits, 1);
});

test("Metricool: carga tardía en la misma entrada emite una sola vez y respeta seguridad", () => {
  let ready = false, hits = 0;
  const safe = true;
  const q = createMetricoolQueue({ isReady: () => ready, currentEntry: () => "a|/", isSafeNow: () => safe, hit: () => hits++ });
  q.request("a|/"); ready = true; q.onReady(); q.onReady(); q.request("a|/");
  strictEqual(hits, 1);
  const q2 = createMetricoolQueue({ isReady: () => true, currentEntry: () => "x|/", isSafeNow: () => false, hit: () => hits++ });
  q2.request("x|/");
  strictEqual(hits, 1);
});

test("sendPageView nunca rehabilita GA si la ruta actual no es la pedida o no es pública", () => {
  const src = readFileSync("src/lib/analytics.ts", "utf8");
  const body = src.slice(src.indexOf("export const sendPageView"));
  const guard = body.indexOf("if (current !== pathname || !isPublicRoute(current)");
  const enable = body.indexOf("setGaDisabled(false)");
  strictEqual(guard > 0 && guard < enable, true);
});

test("páginas públicas con Helmet propio declaran og:title y og:description", () => {
  const dirs = ["src/pages", "src/pages/blog"];
  const skip = /^(Gira|GiraPoliticas|IngestHealth|LabHosts|Dashboard|Admin)/;
  for (const d of dirs) for (const f of readdirSync(d).filter((x) => x.endsWith(".tsx") && !skip.test(x))) {
    const s = readFileSync(`${d}/${f}`, "utf8");
    if (!s.includes("<title>") && !s.includes("<title ")) continue;
    strictEqual(/og:title/.test(s) && /og:description/.test(s), true, f);
  }
});

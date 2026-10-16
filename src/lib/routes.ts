/**
 * Registro común de rutas (sin dependencias) para medición y metadatos.
 * Evita importaciones circulares entre seo.ts y analytics.ts.
 */

const PRIVATE_PATH = /^\/(dashboard|gira|reset-password|admin|auth|~oauth)(\/|$)/i;
export const isPrivatePath = (pathname: string) => PRIVATE_PATH.test(pathname);

/** Validadores reales de parámetros dinámicos. */
export const VIDEO_ID_RE = /^[A-Za-z0-9_-]{11}$/;
export const BLOG_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+){0,15}$/;
const PARAM_RULES: Record<string, RegExp> = { videoId: VIDEO_ID_RE, slug: BLOG_SLUG_RE };

/** Rutas públicas indexables (deben coincidir con App.tsx). */
export const PUBLIC_ROUTES = [
  "/", "/podcast-en-la-cumbre", "/prensa/pico-bolivar", "/press-kit", "/prensa/cobertura",
  "/podcast-eterno", "/premios", "/prensa/fiap-2026", "/vacilate-el-futbol", "/media-kit",
  "/media-kit-vem", "/privacidad", "/terminos", "/instalar", "/buscador", "/hosts",
  "/mejores-podcasts-venezuela", "/podcasts-venezolanos-comedia", "/podcasts-venezolanos-futbol",
  "/podcasts-venezolanos-spotify", "/hecho-en-venezuela", "/fali", "/en/fali", "/walking-ads",
  "/streaming-from-the-lost-world", "/cannes", "/blog", "/blog/:slug", "/episodios/:videoId",
];

export const normalizePath = (pathname: string) => {
  const p = pathname.replace(/\/+$/, "");
  return p === "" ? "/" : p;
};

export const matchesRoute = (pattern: string, pathname: string) => {
  const p = normalizePath(pathname);
  if (pattern === "/") return p === "/";
  const a = pattern.split("/");
  const b = p.split("/");
  if (a.length !== b.length) return false;
  return a.every((seg, i) => {
    if (!seg.startsWith(":")) return seg === b[i];
    const rule = PARAM_RULES[seg.slice(1)];
    return rule ? rule.test(b[i]) : false;
  });
};

/** Solo rutas públicas reconocidas (con parámetros válidos). Desconocidas y privadas: false. */
export const isPublicRoute = (pathname: string) =>
  !isPrivatePath(pathname) && PUBLIC_ROUTES.some((r) => matchesRoute(r, pathname));

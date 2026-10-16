import { isPublicRoute, normalizePath, PUBLIC_ROUTES, matchesRoute } from "./routes";
export { isPublicRoute, normalizePath, PUBLIC_ROUTES, matchesRoute };

/** Dominio canónico: el host primario del hosting (www). */
export const SITE = "https://www.vacilateesto.com";
export const DEFAULT_OG_IMAGE = `${SITE}/og-image.png`;
export const DEFAULT_TITLE = "Vacílate Esto | Sistema de contenidos venezolano de Fun Educaitment";
export const DEFAULT_DESCRIPTION =
  "Vacílate Esto: sistema de contenidos venezolano de Fun Educaitment. Fútbol, gastronomía, historia, leyendas y mitos urbanos contados con calle y con data.";

/** Elementos del <head> estático que pasan a ser gestionados por ruta. */
export const MANAGED_HEAD_SELECTORS = [
  'link[rel="canonical"]', 'meta[name="description"]', 'meta[name="title"]', 'meta[name="robots"]',
  'meta[name="googlebot"]', 'meta[property^="og:"]', 'meta[name^="twitter:"]',
  'script[type="application/ld+json"]',
];

export type RouteSeoInfo = { canonical: string | null; robots: string };

/** Metadatos base deterministas para cualquier ruta. */
export const routeSeo = (pathname: string): RouteSeoInfo => {
  if (isPublicRoute(pathname)) {
    const p = normalizePath(pathname);
    return { canonical: p === "/" ? `${SITE}/` : `${SITE}${p}`, robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" };
  }
  return { canonical: null, robots: "noindex, nofollow" };
};

/** Quita el <head> estático (sirve a rastreadores sin JS) para que cada ruta tenga una sola fuente. */
export const removeStaticHead = (doc: Document) => {
  doc.head.querySelectorAll(MANAGED_HEAD_SELECTORS.join(",")).forEach((n) => {
    if (!n.hasAttribute("data-rh")) n.remove();
  });
};

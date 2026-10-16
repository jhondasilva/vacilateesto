import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { installIntentListener, sendPageView, setCurrentEntry, setRoutePrivacy } from "@/lib/analytics";
import { createPageViewTracker } from "@/lib/pageViewTracker";
import { normalizePath } from "@/lib/routes";

const tracker = typeof window === "undefined" ? null : createPageViewTracker({
  getPath: () => window.location.pathname,
  getTitle: () => document.title,
  isNoindex: () => Array.from(document.querySelectorAll('meta[name="robots"]'))
    .some((m) => /noindex/i.test(m.getAttribute("content") || "")),
  send: sendPageView,
  setPrivacy: setRoutePrivacy,
  setTimer: (fn, ms) => window.setTimeout(fn, ms),
  clearTimer: (id) => window.clearTimeout(id),
  observeHead: typeof MutationObserver === "undefined" ? undefined : (cb) => {
    const obs = new MutationObserver(cb);
    obs.observe(document.head, { subtree: true, childList: true, characterData: true, attributes: true });
    return () => obs.disconnect();
  },
});

let lastPath: string | null = null;

/**
 * Un único page_view manual (GA4 + Metricool) por ruta pública reconocida, incluida la carga
 * inicial. Espera el título de Helmet (máx. 1,2 s); al navegar, cancela la vista pendiente.
 */
const AnalyticsPageViews = () => {
  const { pathname, key } = useLocation();

  useEffect(() => { installIntentListener(); }, []);

  useEffect(() => {
    // La entrada actual solo cambia con el pathname (cambios de query/hash no cuentan).
    const path = normalizePath(pathname);
    if (path !== lastPath) { lastPath = path; setCurrentEntry(`${key}|${path}`); }
    tracker?.onLocation(key, pathname);
  }, [pathname, key]);

  return null;
};

export default AnalyticsPageViews;

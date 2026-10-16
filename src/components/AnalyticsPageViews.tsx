import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { createDeduper, installIntentListener, isPrivatePath, sendPageView, setRoutePrivacy } from "@/lib/analytics";

const isNewEntry = createDeduper();
let pending: { id: string; pathname: string; timer: number; observer?: MutationObserver } | null = null;

const flush = () => {
  if (!pending) return;
  const p = pending;
  pending = null;
  window.clearTimeout(p.timer);
  p.observer?.disconnect();
  sendPageView(p.pathname, document.title);
};

/**
 * Un único page_view manual (GA4 + Metricool) por entrada de historial pública,
 * incluida la carga inicial. Espera a que Helmet actualice el título (máx. 1,2 s).
 */
const AnalyticsPageViews = () => {
  const { pathname, key } = useLocation();

  useEffect(() => { installIntentListener(); }, []);

  useEffect(() => {
    setRoutePrivacy(pathname);
    if (!isNewEntry({ key, pathname })) return;
    // Nueva entrada: si quedó una vista pendiente de otra ruta, se envía antes.
    if (pending) flush();
    if (isPrivatePath(pathname)) return;
    const startTitle = document.title;
    const timer = window.setTimeout(flush, 1200);
    pending = { id: key, pathname, timer };
    const titleEl = document.querySelector("title");
    if (titleEl && typeof MutationObserver !== "undefined") {
      let settle = 0;
      const obs = new MutationObserver(() => {
        if (document.title === startTitle) return;
        window.clearTimeout(settle);
        settle = window.setTimeout(flush, 150);
      });
      obs.observe(document.head, { subtree: true, childList: true, characterData: true });
      pending.observer = obs;
    }
  }, [pathname, key]);

  return null;
};

export default AnalyticsPageViews;

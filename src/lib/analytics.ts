/**
 * Medición del sitio público (GA4 + Metricool).
 * - Solo se carga y mide en el host de producción.
 * - Nunca mide rutas privadas (aunque se llegue navegando desde una pública).
 * - Un único page_view manual por entrada de historial (sin duplicar por StrictMode).
 * - page_location / page_referrer sin query, hash ni datos personales.
 */

export const GA_ID = "G-8C1W3N2FBE";
export const METRICOOL_HASH = "ea27a283da270adea7c04cfa40488e8e";
const PROD_HOSTS = new Set(["vacilateesto.com", "www.vacilateesto.com"]);
import { isPrivatePath, isPublicRoute, normalizePath } from "./routes";
import { createMetricoolQueue } from "./pageViewTracker";
export { isPrivatePath };

export const isProductionHost = (hostname: string) => PROD_HOSTS.has(hostname.toLowerCase());

/** Devuelve origin + pathname (sin query ni hash). Si la ruta es privada, solo el origin. */
export const sanitizeUrl = (raw: string): string => {
  if (!raw) return "";
  try {
    const u = new URL(raw);
    return u.origin + (isPublicRoute(u.pathname) ? normalizePath(u.pathname) : "/");
  } catch {
    return "";
  }
};

export type EntryKey = { key: string; pathname: string };

/**
 * Deduplicador por entrada de historial: la misma entrada (key) no se cuenta dos veces
 * seguidas (StrictMode), pero volver atrás/adelante a otra entrada sí cuenta.
 */
export const createDeduper = () => {
  let last: string | null = null;
  return (entry: EntryKey) => {
    const id = `${entry.key}|${entry.pathname}`;
    if (id === last) return false;
    last = id;
    return true;
  };
};

/** Tipos de formulario permitidos para eventos de negocio. */
export type FormType = "newsletter" | "press_request" | "media_kit_contact" | "media_kit_email";
export type IntentMethod = "whatsapp" | "email" | "media_kit";

type Gtag = (...args: unknown[]) => void;
type W = Window & {
  dataLayer?: unknown[];
  gtag?: Gtag;
  beTracker?: { t: (o: { hash: string }) => void };
  [k: string]: unknown;
};

let gaLoaded = false;
let metricoolState: "idle" | "loading" | "ready" = "idle";
let lastPublicUrl = "";
let currentReferrer = "";

const win = () => (typeof window === "undefined" ? null : (window as unknown as W));

export const measurementEnabled = () => {
  const w = win();
  return !!w && isProductionHost(w.location.hostname);
};

const setGaDisabled = (disabled: boolean) => {
  const w = win();
  // Bandera oficial de exclusión de gtag.js: bloquea también eventos automáticos en rutas privadas.
  if (w) w[`ga-disable-${GA_ID}`] = disabled;
};

const loadGa = () => {
  const w = win();
  if (!w || gaLoaded) return;
  gaLoaded = true;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  w.gtag("js", new Date());
  // La config por ruta se envía en sendPageView (contexto SPA limpio y actual).
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
};

/** Parámetros de consulta considerados seguros para Metricool (lista vacía: ninguno). */
const METRICOOL_SAFE_PARAMS = new Set<string>();
const SENSITIVE_REFERRER = /\/(dashboard|gira|reset-password|admin|auth|~oauth)(\/|$|\?|#)/i;

/**
 * Metricool (beTracker.t) lee location/referrer reales y no admite override.
 * Si la URL tiene hash o algún parámetro fuera de la lista segura, o el referrer
 * viene de una ruta privada/sensible o trae query/hash, se omite el hit.
 */
export const metricoolSafe = (href: string, referrer: string): boolean => {
  try {
    const u = new URL(href);
    if (u.hash) return false;
    for (const k of u.searchParams.keys()) if (!METRICOOL_SAFE_PARAMS.has(k)) return false;
    if (!isPublicRoute(u.pathname)) return false;
    if (referrer) {
      const r = new URL(referrer);
      if (r.search || r.hash || SENSITIVE_REFERRER.test(r.pathname)) return false;
    }
    return true;
  } catch {
    return false;
  }
};

let currentEntry: string | null = null;
/** Entrada de historial actual (key|pathname), fijada en cada cambio de ubicación. */
export const setCurrentEntry = (entryId: string) => { currentEntry = entryId; };

const metricoolQueue = createMetricoolQueue({
  isReady: () => metricoolState === "ready" && !!win()?.beTracker,
  currentEntry: () => currentEntry,
  isSafeNow: () => {
    const w = win();
    return !!w && measurementEnabled() && isPublicRoute(w.location.pathname) && metricoolSafe(w.location.href, document.referrer);
  },
  hit: () => win()!.beTracker!.t({ hash: METRICOOL_HASH }),
});

const loadMetricool = () => {
  if (metricoolState !== "idle") return;
  metricoolState = "loading";
  const s = document.createElement("script");
  s.type = "text/javascript";
  s.src = "https://tracker.metricool.com/resources/be.js";
  s.onload = () => {
    metricoolState = "ready";
    metricoolQueue.onReady();
  };
  document.head.appendChild(s);
};

/** Marca la ruta actual (llamar en cada cambio de pathname, antes de medir). */
export const setRoutePrivacy = (pathname: string) => {
  if (measurementEnabled()) setGaDisabled(!isPublicRoute(pathname));
};

/**
 * Envía un page_view a GA4 y pide un hit a Metricool para la entrada actual.
 * Solo si la ruta pedida es exactamente la actual y es pública reconocida;
 * nunca re-habilita GA en una ruta privada o desconocida.
 */
export const sendPageView = (pathname: string, title: string, entryId: string) => {
  const w = win();
  if (!w || !measurementEnabled()) return;
  const current = normalizePath(w.location.pathname);
  if (current !== pathname || !isPublicRoute(current) || entryId !== currentEntry) return;
  setGaDisabled(false);
  loadGa();
  loadMetricool();
  const location = w.location.origin + pathname;
  const referrer = lastPublicUrl || sanitizeUrl(document.referrer) || "";
  // Config a nivel de destino: prevalece sobre `set`, así que se actualiza en cada ruta
  // pública confirmada para que los eventos automáticos usen la URL/referrer actuales.
  w.gtag!("config", GA_ID, { send_page_view: false, page_location: location, page_referrer: referrer, page_title: title });
  w.gtag!("event", "page_view", { page_location: location, page_referrer: referrer, page_title: title });
  currentReferrer = referrer;
  lastPublicUrl = location;
  metricoolQueue.request(entryId);
};

const sendEvent = (name: string, params: Record<string, string>) => {
  const w = win();
  if (!w || !measurementEnabled() || !isPublicRoute(w.location.pathname) || !gaLoaded) return;
  w.gtag!("event", name, { ...params, page_location: w.location.origin + normalizePath(w.location.pathname), page_referrer: currentReferrer });
};

/** Solo tras confirmación del backend. Sin datos personales. */
export const trackFormSuccess = (formType: FormType) => {
  if (formType === "newsletter") sendEvent("newsletter_signup", { form_type: formType });
  else sendEvent("generate_lead", { form_type: formType });
};

/** Clasifica un enlace como intención de contacto (nunca un lead). */
export const classifyIntent = (href: string): IntentMethod | null => {
  const h = href.toLowerCase();
  if (h.startsWith("mailto:")) return "email";
  if (h.includes("wa.me/") || h.includes("api.whatsapp.com") || h.startsWith("whatsapp:")) return "whatsapp";
  if (/media-?kit/.test(h) && (h.endsWith(".pdf") || h.includes("/downloads/"))) return "media_kit";
  return null;
};

export const trackIntent = (method: IntentMethod) => sendEvent("contact_intent", { method });

/** Delegación global de clics para intención (email/WhatsApp/descarga de media kit). */
export const installIntentListener = () => {
  const w = win();
  if (!w || (w as W).__veIntent) return;
  (w as W).__veIntent = true;
  document.addEventListener("click", (e) => {
    const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!a) return;
    const m = classifyIntent(a.getAttribute("href") || "");
    if (m) trackIntent(m);
  }, { capture: true });
};

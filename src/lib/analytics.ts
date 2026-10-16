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
const PRIVATE_PATH = /^\/(dashboard|gira|reset-password|admin|auth)(\/|$)/i;

export const isProductionHost = (hostname: string) => PROD_HOSTS.has(hostname.toLowerCase());
export const isPrivatePath = (pathname: string) => PRIVATE_PATH.test(pathname);

/** Devuelve origin + pathname (sin query ni hash). Si la ruta es privada, solo el origin. */
export const sanitizeUrl = (raw: string): string => {
  if (!raw) return "";
  try {
    const u = new URL(raw);
    return u.origin + (isPrivatePath(u.pathname) ? "/" : u.pathname);
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
let metricoolQueued = false;
let lastPublicUrl = "";
let currentPathPrivate = true;

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
  w.gtag("config", GA_ID, {
    send_page_view: false,
    page_location: sanitizeUrl(w.location.href),
    page_referrer: sanitizeUrl(document.referrer),
  });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
};

const metricoolHit = () => {
  const w = win();
  if (metricoolState === "ready" && w?.beTracker) w.beTracker.t({ hash: METRICOOL_HASH });
  else metricoolQueued = true;
};

const loadMetricool = () => {
  if (metricoolState !== "idle") return;
  metricoolState = "loading";
  const s = document.createElement("script");
  s.type = "text/javascript";
  s.src = "https://tracker.metricool.com/resources/be.js";
  s.onload = () => {
    metricoolState = "ready";
    if (metricoolQueued && !currentPathPrivate) {
      metricoolQueued = false;
      metricoolHit();
    }
  };
  document.head.appendChild(s);
};

/** Marca la ruta actual (llamar en cada cambio de pathname, antes de medir). */
export const setRoutePrivacy = (pathname: string) => {
  currentPathPrivate = isPrivatePath(pathname);
  if (measurementEnabled()) setGaDisabled(currentPathPrivate);
};

/** Envía un page_view a GA4 y un hit a Metricool para una ruta pública. */
export const sendPageView = (pathname: string, title: string) => {
  const w = win();
  if (!w || !measurementEnabled() || isPrivatePath(pathname)) return;
  setGaDisabled(false);
  loadGa();
  loadMetricool();
  const location = w.location.origin + pathname;
  const referrer = lastPublicUrl || sanitizeUrl(document.referrer);
  w.gtag!("event", "page_view", { page_location: location, page_referrer: referrer, page_title: title });
  lastPublicUrl = location;
  metricoolHit();
};

const sendEvent = (name: string, params: Record<string, string>) => {
  const w = win();
  if (!w || !measurementEnabled() || isPrivatePath(w.location.pathname) || !gaLoaded) return;
  w.gtag!("event", name, { ...params, page_location: w.location.origin + w.location.pathname });
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

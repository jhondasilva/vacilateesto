import { isPublicRoute, normalizePath } from "./routes";

/**
 * Controlador puro de page_view por entrada de historial (testeable sin DOM).
 * - Una vista por pathname público reconocido; cambios solo de query/hash no cuentan.
 * - StrictMode (misma entrada dos veces) no duplica.
 * - Al navegar, la vista pendiente anterior se CANCELA (nunca se envía con datos nuevos).
 * - Antes de emitir revalida que la ruta actual sea exactamente la pendiente, pública y sin noindex.
 */
export type TrackerDeps = {
  getPath: () => string;
  getTitle: () => string;
  isNoindex: () => boolean;
  /** La página aún carga su título real (p. ej. ficha de episodio). */
  isWaiting?: () => boolean;
  send: (pathname: string, title: string, activationId: string) => void;
  /** Nueva activación (cada llegada a un pathname, incluidas privadas y regresos Atrás/Adelante). */
  onActivate?: (activationId: string) => void;
  setPrivacy: (pathname: string) => void;
  setTimer: (fn: () => void, ms: number) => number;
  clearTimer: (id: number) => void;
  /** Observa cambios del <head>; devuelve función para dejar de observar. */
  observeHead?: (cb: () => void) => () => void;
};

export const createPageViewTracker = (d: TrackerDeps, maxWait = 1200, settleMs = 150) => {
  let lastEntry: string | null = null;
  let lastPath: string | null = null;
  let seq = 0;
  let pending: { token: number; pathname: string; entryId: string; timers: number[]; stop?: () => void } | null = null;

  const cancel = () => {
    if (!pending) return;
    pending.timers.forEach(d.clearTimer);
    pending.stop?.();
    pending = null;
  };

  const emit = (token: number, force = false) => {
    const p = pending;
    if (!p || p.token !== token) return;
    if (!force && d.isWaiting?.()) return; // el próximo cambio del <head> reprograma

    cancel();
    const current = normalizePath(d.getPath());
    if (current !== p.pathname || !isPublicRoute(current) || d.isNoindex()) return;
    d.send(p.pathname, d.getTitle(), p.entryId);
  };

  return {
    onLocation(key: string, rawPath: string) {
      const pathname = normalizePath(rawPath);
      d.setPrivacy(pathname);
      const entryId = `${key}|${pathname}`;
      if (entryId === lastEntry) return; // StrictMode
      lastEntry = entryId;
      if (pathname === lastPath) return; // solo cambió query/hash
      lastPath = pathname;
      cancel();
      const token = ++seq;
      const activationId = `${entryId}#${token}`;
      d.onActivate?.(activationId);
      if (!isPublicRoute(pathname)) return;
      const startTitle = d.getTitle();
      pending = { token, pathname, entryId: activationId, timers: [d.setTimer(() => emit(token, true), maxWait)] };
      if (d.observeHead) {
        let settle = 0;
        pending.stop = d.observeHead(() => {
          if (!pending || pending.token !== token || (d.getTitle() === startTitle && !d.isWaiting)) return;
          if (settle) d.clearTimer(settle);
          settle = d.setTimer(() => emit(token), settleMs);
          pending.timers.push(settle);
        });
      }
    },
    cancel,
  };
};

/**
 * Cola de Metricool por ACTIVACIÓN (cada llegada a una ruta, también al volver con Atrás):
 * un hit como máximo por activación (protege de repeticiones StrictMode); si el SDK carga tarde,
 * solo emite si la entrada encolada sigue siendo la actual y es segura.
 */
export const createMetricoolQueue = (d: {
  isReady: () => boolean;
  currentEntry: () => string | null;
  isSafeNow: () => boolean;
  hit: () => void;
}) => {
  let lastSent: string | null = null;
  let queued: string | null = null;
  const tryHit = (entryId: string) => {
    if (lastSent === entryId || d.currentEntry() !== entryId || !d.isSafeNow()) return;
    lastSent = entryId;
    d.hit();
  };
  return {
    request(entryId: string) {
      if (d.isReady()) { queued = null; tryHit(entryId); } else queued = entryId;
    },
    onReady() {
      const q = queued;
      queued = null;
      if (q) tryHit(q);
    },
  };
};

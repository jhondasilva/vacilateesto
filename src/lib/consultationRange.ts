/**
 * Rango de consulta compartido por los dashboards de cliente (no PAN).
 * Reutiliza sin modificar la lógica de fechas Caracas de PAN (panTimestamp / panDateBounds):
 * días calendario America/Caracas, fin inclusivo como límite exclusivo del día siguiente.
 * Filtra SIEMPRE por fecha de publicación; nunca por fecha de captura.
 */
import { PAN_SPLIT4, panDateBounds, panTimestamp } from "@/lib/panDashboard";

export type ConsultationRange = { from: string; to: string };
export const EMPTY_RANGE: ConsultationRange = { from: "", to: "" };

/** Timestamp de publicación (ISO con zona, o sin zona interpretado en Caracas). NaN si no existe/no es válido. */
export const publicationTimestamp = (value: string | null | undefined): number => panTimestamp(value ?? null);

const isRealDay = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(panDateBounds(s, "")?.from ?? NaN);

export type RangeValidation =
  | { ok: true; active: boolean; bounds: { from: number; to: number }; message: null }
  | { ok: false; message: string; active?: undefined; bounds?: undefined };

export function validateRange(range: ConsultationRange): RangeValidation {
  if (range.from && !isRealDay(range.from)) return { ok: false, message: "La fecha «Desde» no es una fecha real." };
  if (range.to && !isRealDay(range.to)) return { ok: false, message: "La fecha «Hasta» no es una fecha real." };
  const bounds = panDateBounds(range.from, range.to);
  if (!bounds) return { ok: false, message: "«Desde» es posterior a «Hasta». Corrige el rango." };
  return { ok: true, active: Boolean(range.from || range.to), bounds, message: null };
}

/** true/false si la fecha de publicación está o no en el rango; null si no hay fecha de publicación válida. */
export function inConsultationRange(published: string | null | undefined, range: ConsultationRange): boolean | null {
  const v = validateRange(range);
  if (!v.ok) return false;
  const ts = publicationTimestamp(published);
  if (!Number.isFinite(ts)) return null;
  return ts >= v.bounds.from && ts < v.bounds.to;
}

/**
 * Separa elementos dentro del rango. Rango inválido => nada (nunca totales viejos).
 * Con rango activo, los elementos sin fecha de publicación se excluyen y se cuentan en `undated`.
 */
export function applyConsultationRange<T>(items: T[], getPublished: (item: T) => string | null | undefined, range: ConsultationRange) {
  const v = validateRange(range);
  if (!v.ok) return { valid: false as const, message: v.message, included: [] as T[], undated: 0 };
  let undated = 0;
  const included = items.filter((item) => {
    const ts = publicationTimestamp(getPublished(item));
    if (!Number.isFinite(ts)) {
      undated++;
      return !v.active;
    }
    return ts >= v.bounds.from && ts < v.bounds.to;
  });
  return { valid: true as const, message: null, included, undated: v.active ? undated : 0 };
}

const lastDay = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();
const month = (y: number, m: number, label: string) => ({
  key: `${y}-${String(m).padStart(2, "0")}`,
  label,
  from: `${y}-${String(m).padStart(2, "0")}-01`,
  to: `${y}-${String(m).padStart(2, "0")}-${lastDay(y, m)}`,
});

export const CONSULTATION_PRESETS: { key: string; label: string; from: string; to: string }[] = [
  { key: "all", label: "Todo el histórico", from: "", to: "" },
  { key: "split4", label: PAN_SPLIT4.label, from: PAN_SPLIT4.from, to: PAN_SPLIT4.to },
  { key: "2026", label: "Acumulado 2026", from: "2026-01-01", to: "2026-12-31" },
  month(2026, 10, "Octubre 2026"),
  month(2026, 9, "Septiembre 2026"),
  month(2026, 8, "Agosto 2026"),
  month(2026, 7, "Julio 2026"),
];

export const presetKeyFor = (r: ConsultationRange) =>
  CONSULTATION_PRESETS.find((p) => p.from === r.from && p.to === r.to)?.key ?? null;

export function rangeLabel(r: ConsultationRange): string {
  const preset = CONSULTATION_PRESETS.find((p) => p.from === r.from && p.to === r.to);
  if (preset) return preset.label;
  return `${r.from || "sin inicio"} → ${r.to || "sin fin"}`;
}

/** Fechas JS (para el PDF) a partir de los límites Caracas; el fin se muestra como el último instante incluido. */
export function rangeDates(r: ConsultationRange, fallbackFrom: Date): { from: Date; to: Date } {
  const v = validateRange(r);
  if (!v.ok) return { from: fallbackFrom, to: new Date() };
  return {
    from: Number.isFinite(v.bounds.from) ? new Date(v.bounds.from) : fallbackFrom,
    to: Number.isFinite(v.bounds.to) ? new Date(v.bounds.to - 1) : new Date(),
  };
}

type Page<T> = { data: T[] | null; error: { message: string } | null };

/** Paginación estable (el llamador debe ordenar por columnas únicas). Señala cobertura incompleta en vez de truncar en silencio. */
export async function fetchAllPages<T>(
  page: (from: number, to: number) => PromiseLike<Page<T>>,
  { pageSize = 1000, maxRows = 50000 }: { pageSize?: number; maxRows?: number } = {},
): Promise<{ rows: T[]; error: string | null; truncated: boolean }> {
  const rows: T[] = [];
  for (let offset = 0; offset < maxRows; offset += pageSize) {
    const { data, error } = await page(offset, offset + pageSize - 1);
    if (error) return { rows, error: error.message, truncated: true };
    rows.push(...(data ?? []));
    if (!data || data.length < pageSize) return { rows, error: null, truncated: false };
  }
  return { rows, error: null, truncated: true };
}

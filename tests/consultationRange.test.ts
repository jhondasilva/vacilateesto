import { describe, expect, test } from "bun:test";
import {
  applyConsultationRange, CONSULTATION_PRESETS, fetchAllPages, inConsultationRange, rangeDates, validateRange,
} from "../src/lib/consultationRange";
import { PAN_SPLIT4, panDateBounds, panTimestamp, selectPanPosts } from "../src/lib/panDashboard";
import { livesInRange, PELOTICA_LIVES } from "../src/components/dashboard/PeloticaLivesSection";

const split4 = { from: "2026-08-01", to: "2026-10-15" };

describe("rango de consulta · límites Caracas", () => {
  test("27 de enero queda fuera del 4.º split (1 ago–15 oct)", () => {
    expect(inConsultationRange("2026-01-27T15:00:00Z", split4)).toBe(false);
    expect(inConsultationRange("2026-01-27T12:00:00", split4)).toBe(false);
  });
  test("1 ago 00:00 Caracas entra; 31 jul 23:59:59.999 Caracas no", () => {
    expect(inConsultationRange("2026-08-01T00:00:00-04:00", split4)).toBe(true);
    expect(inConsultationRange("2026-08-01T04:00:00Z", split4)).toBe(true);
    expect(inConsultationRange("2026-07-31T23:59:59.999-04:00", split4)).toBe(false);
  });
  test("15 oct 23:59:59.999 Caracas entra; 16 oct 00:00 Caracas no", () => {
    expect(inConsultationRange("2026-10-15T23:59:59.999-04:00", split4)).toBe(true);
    expect(inConsultationRange("2026-10-16T03:59:59.999Z", split4)).toBe(true);
    expect(inConsultationRange("2026-10-16T00:00:00-04:00", split4)).toBe(false);
    expect(inConsultationRange("2026-10-16T04:00:00Z", split4)).toBe(false);
  });
  test("mismo día incluye el día completo", () => {
    const d = { from: "2026-09-20", to: "2026-09-20" };
    expect(inConsultationRange("2026-09-20T00:00:00-04:00", d)).toBe(true);
    expect(inConsultationRange("2026-09-20T23:59:59.999-04:00", d)).toBe(true);
    expect(inConsultationRange("2026-09-21T00:00:00-04:00", d)).toBe(false);
  });
  test("límites vacíos: abiertos", () => {
    expect(validateRange({ from: "", to: "" })).toMatchObject({ ok: true, active: false });
    expect(inConsultationRange("2020-01-01T00:00:00Z", { from: "", to: "2026-01-01" })).toBe(true);
    expect(inConsultationRange("2030-01-01T00:00:00Z", { from: "2026-01-01", to: "" })).toBe(true);
  });
  test("fechas irreales e invertidas son inválidas y no devuelven totales", () => {
    expect(validateRange({ from: "2026-02-30", to: "" }).ok).toBe(false);
    expect(validateRange({ from: "2026-13-01", to: "" }).ok).toBe(false);
    expect(validateRange({ from: "", to: "abc" }).ok).toBe(false);
    expect(validateRange({ from: "2026-10-15", to: "2026-08-01" }).ok).toBe(false);
    const r = applyConsultationRange([{ d: "2026-09-01T00:00:00Z" }], (x) => x.d, { from: "2026-10-15", to: "2026-08-01" });
    expect(r.valid).toBe(false);
    expect(r.included).toEqual([]);
  });
  test("bisiestos: 29 feb 2028 es real, 29 feb 2026 no", () => {
    expect(validateRange({ from: "2028-02-29", to: "2028-02-29" }).ok).toBe(true);
    expect(inConsultationRange("2028-02-29T23:59:59-04:00", { from: "2028-02-29", to: "2028-02-29" })).toBe(true);
    expect(validateRange({ from: "2026-02-29", to: "" }).ok).toBe(false);
  });
  test("sin fecha de publicación: se excluye con rango activo y se informa", () => {
    const items = [{ d: null }, { d: "2026-09-01T12:00:00Z" }, { d: "fecha rara" }];
    const r = applyConsultationRange(items, (x) => x.d, split4);
    expect(r.included.length).toBe(1);
    expect(r.undated).toBe(2);
    expect(inConsultationRange(null, split4)).toBeNull();
  });
  test("independiente de la zona horaria del navegador (TZ del proceso)", () => {
    const b = validateRange(split4);
    expect(b.ok && b.bounds.from).toBe(Date.parse("2026-08-01T04:00:00Z"));
    expect(b.ok && b.bounds.to).toBe(Date.parse("2026-10-16T04:00:00Z"));
    const d = rangeDates(split4, new Date(0));
    expect(d.to.toISOString()).toBe("2026-10-16T03:59:59.999Z");
  });
});

describe("presets y PAN sin cambios", () => {
  test("el preset del 4.º split usa las fechas oficiales de PAN", () => {
    const p = CONSULTATION_PRESETS.find((x) => x.key === "split4")!;
    expect([p.from, p.to]).toEqual([PAN_SPLIT4.from, PAN_SPLIT4.to]);
  });
  test("presets mensuales terminan el último día real del mes", () => {
    expect(CONSULTATION_PRESETS.find((x) => x.key === "2026-09")!.to).toBe("2026-09-30");
    expect(CONSULTATION_PRESETS.find((x) => x.key === "2026-10")!.to).toBe("2026-10-31");
  });
  test("la lógica PAN conserva sus límites", () => {
    expect(panDateBounds("2026-08-01", "2026-10-15")).toEqual({ from: Date.parse("2026-08-01T04:00:00Z"), to: Date.parse("2026-10-16T04:00:00Z") });
    expect(panTimestamp("2026-08-01")).toBe(Date.parse("2026-08-01T04:00:00Z"));
    expect(selectPanPosts([], "all", "2026-10-15", "2026-08-01")).toEqual([]);
  });
});

describe("lives y consistencia", () => {
  test("lives del 4.º split son los 16 de septiembre; agosto no tiene", () => {
    expect(livesInRange(PELOTICA_LIVES, split4).length).toBe(16);
    expect(livesInRange(PELOTICA_LIVES, { from: "2026-08-01", to: "2026-08-31" }).length).toBe(0);
    expect(livesInRange(PELOTICA_LIVES, { from: "2026-09-27", to: "2026-09-27" }).length).toBe(2);
    expect(livesInRange(PELOTICA_LIVES, { from: "2026-09-27", to: "2026-09-01" }).length).toBe(0);
  });
  test("lista y totales salen del mismo conjunto filtrado", () => {
    const posts = [
      { d: "2026-01-27T10:00:00Z", v: 100 },
      { d: "2026-08-01T04:00:00Z", v: 5 },
      { d: "2026-10-16T04:00:00Z", v: 7 },
    ];
    const r = applyConsultationRange(posts, (p) => p.d, split4);
    expect(r.included.length).toBe(1);
    expect(r.included.reduce((a, p) => a + p.v, 0)).toBe(5);
  });
});

describe("paginación sin truncar en silencio", () => {
  test("lee todas las páginas", async () => {
    const all = Array.from({ length: 2345 }, (_, i) => i);
    const res = await fetchAllPages<number>(async (a, b) => ({ data: all.slice(a, b + 1), error: null }));
    expect(res.rows.length).toBe(2345);
    expect(res.truncated).toBe(false);
  });
  test("marca cobertura incompleta en error o al llegar al tope", async () => {
    const err = await fetchAllPages<number>(async (a) => (a === 0 ? { data: Array(1000).fill(1), error: null } : { data: null, error: { message: "x" } }));
    expect(err.rows.length).toBe(1000);
    expect(err.truncated).toBe(true);
    const cap = await fetchAllPages<number>(async () => ({ data: Array(10).fill(1), error: null }), { pageSize: 10, maxRows: 30 });
    expect(cap.truncated).toBe(true);
  });
});

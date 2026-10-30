import { describe, expect, test } from "bun:test";
import { applyConsultationRange } from "../src/lib/consultationRange";
import { buildAuditCsv, caracasDateTime, csvCell, explainInclusion, PDG_INCLUDED_EXTERNAL_IDS, type AuditablePost } from "../src/lib/postAudit";

const base: AuditablePost = { id: "a", platform: "tiktok", external_id: "1", category: "equipo", author_handle: "@diablosdelabastidas", url: "https://www.tiktok.com/@x/video/1", text: "", hashtags: [], published_at: "2026-08-01T04:00:00Z", views: 10, likes: 0, comments: null, shares: 2, synced_at: "2026-10-30T00:00:00Z" };

describe("motivos", () => {
  test("cuenta de equipo del roster es verificada", () => {
    const e = explainInclusion(base);
    expect(e.verified).toBe(true);
    expect(e.reasons[0]).toContain("roster");
  });
  test("hashtag real del texto es verificado", () => {
    const e = explainInclusion({ ...base, category: "chivo", author_handle: "@mabastidas", text: "Gran juego #PeloticaDeGoma" });
    expect(e.verified).toBe(true);
    expect(e.reasons.some((r) => r.includes("#PeloticaDeGoma"))).toBe(true);
  });
  test("solo categoría histórica => no verificada, sin inventar mención", () => {
    const e = explainInclusion({ ...base, category: "chivo", author_handle: "@otro" });
    expect(e.verified).toBe(false);
    expect(e.reasons.join()).not.toContain("Mención");
    expect(e.doubts.join()).toContain("categoría histórica");
  });
  test("excepción manual sin evidencia se marca", () => {
    const id = [...PDG_INCLUDED_EXTERNAL_IDS][0];
    const e = explainInclusion({ ...base, external_id: id, category: "influencer", author_handle: "@x" });
    expect(e.verified).toBe(false);
    expect(e.doubts[0]).toContain("excepción manual");
  });
  test("faltantes señalados", () => {
    const e = explainInclusion({ ...base, url: null, published_at: null });
    expect(e.doubts).toContain("Falta URL");
    expect(e.doubts).toContain("Falta fecha de publicación");
  });
});

describe("CSV", () => {
  test("fórmulas neutralizadas y escapes", () => {
    expect(csvCell("=HYPERLINK(1)")).toBe("'=HYPERLINK(1)");
    expect(csvCell("@a")).toBe("'@a");
    expect(csvCell("-1+2")).toBe("'-1+2");
    expect(csvCell("\tx")).toBe("\"'\tx\"");
    expect(csvCell('a,"b"\nc')).toBe('"a,""b""\nc"');
  });
  test("null vacío, cero se conserva, formato/alcance no disponible", () => {
    const csv = buildAuditCsv([base], { section: "s", period: "p", filters: "f", partial: false });
    const row = csv.trim().split("\r\n").pop()!;
    expect(row).toContain(",10,0,,2,");
    expect(row).toContain("no disponible");
    expect(row).toContain("https://www.tiktok.com/@x/video/1");
  });
  test("export parcial declarado", () => {
    expect(buildAuditCsv([], { section: "s", period: "p", filters: "f", partial: true })).toContain("PARCIAL");
  });
  test("mismas filas que el conjunto filtrado (1 ago–15 oct)", () => {
    const posts = [
      { ...base, id: "jan", published_at: "2026-01-27T15:00:00Z" },
      { ...base, id: "start", published_at: "2026-08-01T00:00:00-04:00" },
      { ...base, id: "end", published_at: "2026-10-15T23:59:59.999-04:00" },
      { ...base, id: "out", published_at: "2026-10-16T00:00:00-04:00" },
    ];
    const r = applyConsultationRange(posts, (p) => p.published_at, { from: "2026-08-01", to: "2026-10-15" });
    expect(r.included.map((p) => p.id)).toEqual(["start", "end"]);
    const csv = buildAuditCsv(r.included, { section: "s", period: "p", filters: "f", partial: false });
    expect(csv).toContain("# Filas: 2");
    expect(caracasDateTime("2026-10-15T23:59:59.999-04:00")).toBe("2026-10-15 23:59:59");
  });
});

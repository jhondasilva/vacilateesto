import { describe, expect, test } from "bun:test";
import { applyConsultationRange, fetchAllPages, rangeDates } from "../src/lib/consultationRange";
import { reportAggregateAnnexesAllowed, reportDateLabel, reportPeriodLabel, selectReportData, selectReportLives } from "../src/lib/reportSelection";

const range = { from: "2026-08-01", to: "2026-10-15" };
const dates = rangeDates(range, new Date(0));
const posts = [
  { platform: "instagram" as const, publishedAt: "2026-08-01T00:00:00", metrics: { views: 10, likes: 2, comments: 1, impressions: 20 } },
  { platform: "tiktok" as const, publishedAt: "2026-10-15T23:59:59.999-04:00", metrics: { views: 30, likes: 4, comments: 3, impressions: 40 } },
  { platform: "instagram" as const, publishedAt: "2026-01-27T12:00:00", metrics: { views: 999 } },
  { platform: "tiktok" as const, publishedAt: "2026-10-16T04:00:00Z", metrics: { views: 999 } },
];
const ranged = applyConsultationRange(posts, (p) => p.publishedAt, range).included;
describe("PDF consultation selection", () => {
  test("literal Aug1–Oct15 period stays Caracas in every process timezone", () => {
    expect(reportPeriodLabel(dates.from, dates.to)).toBe("1 ago 2026 — 15 oct 2026 (America/Caracas)");
  });
  test("naive publication at final day and offset timestamp use Caracas labels", () => {
    expect(reportDateLabel("2026-10-15T23:59:59.999")).toBe("15 oct 2026");
    expect(reportDateLabel("2026-10-16T03:59:59.999Z", true)).toBe("15 oct 26");
    expect(reportDateLabel("2026-08-01")).toBe("1 ago 2026");
    expect(reportDateLabel(null)).toBe("—");
  });
  test("one network posts/counters/totals all derive from exactly one selected row", () => {
    const data = selectReportData(ranged, "instagram");
    expect(data.posts).toEqual([posts[0]]);
    expect(data.matchedCount).toBe(1);
    expect(data.byPlatform).toEqual({ instagram: 1, tiktok: 0, youtube: 0, facebook: 0 });
    expect(data.totals).toEqual({ views: 10, likes: 2, comments: 1, impressions: 20 });
  });
  test("all networks includes final millisecond but not Jan27 or next day", () => {
    const data = selectReportData(ranged, "all");
    expect(data.posts).toEqual(posts.slice(0, 2));
    expect(data.matchedCount).toBe(2);
    expect(data.totals).toEqual({ views: 40, likes: 6, comments: 4, impressions: 60 });
  });
  test("same-day includes both ends of the Caracas day", () => {
    const d = rangeDates({ from: "2026-10-15", to: "2026-10-15" }, new Date(0));
    expect(reportPeriodLabel(d.from, d.to)).toBe("15 oct 2026 — 15 oct 2026 (America/Caracas)");
    expect(applyConsultationRange(posts, (p) => p.publishedAt, { from: "2026-10-15", to: "2026-10-15" }).included).toEqual([posts[1]]);
  });
  test("empty bounds include historical posts; reversed selection has no stale totals", () => {
    expect(selectReportData(applyConsultationRange(posts, (p) => p.publishedAt, { from: "", to: "" }).included, "all").matchedCount).toBe(4);
    expect(selectReportData(applyConsultationRange(posts, (p) => p.publishedAt, { from: range.to, to: range.from }).included, "all").totals.views).toBe(0);
  });
  test("lives require a valid date, the same inclusive range and selected network", () => {
    const lives = [
      { date: "2026-08-01", platform: "youtube" as const },
      { date: "2026-10-15T23:59:59.999", platform: "tiktok" as const },
      { date: "2026-10-16", platform: "tiktok" as const },
      { date: "11 jun, 12:16 p.m.", platform: "tiktok" as const },
    ];
    expect(selectReportLives(lives, dates.from, dates.to, "all")).toEqual(lives.slice(0, 2));
    expect(selectReportLives(lives, dates.from, dates.to, "tiktok")).toEqual([lives[1]]);
    expect(selectReportLives(lives, dates.to, dates.from, "all")).toEqual([]);
  });
  test("selected periods and single networks exclude independent aggregate annexes", () => {
    expect(reportAggregateAnnexesAllowed(true, "all")).toBe(false);
    expect(reportAggregateAnnexesAllowed(false, "tiktok")).toBe(false);
    expect(reportAggregateAnnexesAllowed(false, "all")).toBe(true);
  });
  test("pagination failure retains rows but requires incomplete coverage", async () => {
    const result = await fetchAllPages(async (a) => a === 0
      ? { data: [posts[0]], error: null }
      : { data: null, error: { message: "failed page" } }, { pageSize: 1 });
    expect(result.rows).toHaveLength(1);
    expect(result.error).toBe("failed page");
    expect(result.truncated).toBe(true);
  });
});
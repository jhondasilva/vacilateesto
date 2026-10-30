import { publicationTimestamp } from "@/lib/consultationRange";

export type ReportPlatform = "instagram" | "tiktok" | "facebook" | "youtube";
export type ReportNetwork = "all" | ReportPlatform;
export const REPORT_PLATFORMS: ReportPlatform[] = ["instagram", "tiktok", "facebook", "youtube"];
export const reportNetworkLabel = (network: ReportNetwork) => ({
  all: "Todas las redes", instagram: "Instagram", tiktok: "TikTok", facebook: "Facebook", youtube: "YouTube",
})[network];

/** Explicit Caracas formatting; naive publication timestamps use the shared parser. */
export function reportDateLabel(value: Date | string | null, shortYear = false): string {
  const timestamp = value instanceof Date ? value.getTime() : publicationTimestamp(value);
  if (!Number.isFinite(timestamp)) return "—";
  const parts = new Intl.DateTimeFormat("es-VE", {
    timeZone: "America/Caracas", day: "numeric", month: "short", year: "numeric",
  }).formatToParts(timestamp);
  const part = (name: string) => parts.find((p) => p.type === name)?.value ?? "";
  const year = part("year");
  return `${part("day")} ${part("month").replace(/\.$/, "")} ${shortYear ? year.slice(-2) : year}`;
}

export const reportPeriodLabel = (from: Date, to: Date) =>
  `${reportDateLabel(from)} — ${reportDateLabel(to)} (America/Caracas)`;

type ReportPost = { platform: ReportPlatform; metrics: Record<string, number> };
/** Rows, counts and totals are always derived from the identical selected network set. */
export function selectReportData<T extends ReportPost>(posts: T[], network: ReportNetwork) {
  const selected = posts.filter((p) => network === "all" || p.platform === network);
  const byPlatform = Object.fromEntries(REPORT_PLATFORMS.map((p) => [p, 0])) as Record<string, number>;
  const totals = { views: 0, likes: 0, comments: 0, impressions: 0 };
  for (const p of selected) {
    byPlatform[p.platform]++;
    totals.views += p.metrics.views ?? 0;
    totals.likes += p.metrics.likes ?? p.metrics.reactions ?? 0;
    totals.comments += p.metrics.comments ?? 0;
    totals.impressions += p.metrics.impressions ?? 0;
  }
  return { posts: selected, matchedCount: selected.length, byPlatform, totals };
}

/** Exact instants from the consultation bounds; the final instant is inclusive. */
export function selectReportLives<T extends { date: string; platform: ReportPlatform }>(
  lives: T[], from: Date, to: Date, network: ReportNetwork,
): T[] {
  return lives.filter((live) => {
    const ts = publicationTimestamp(live.date);
    return (network === "all" || live.platform === network) &&
      Number.isFinite(ts) && ts >= from.getTime() && ts <= to.getTime();
  });

}

export const reportAggregateAnnexesAllowed = (selectedPeriod: boolean, network: ReportNetwork) =>
  !selectedPeriod && network === "all";
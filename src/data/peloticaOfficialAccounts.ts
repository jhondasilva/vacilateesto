// Cuentas oficiales de Pelotica de Goma (Metricool, blog 1908520).
// Fuente: informes "Social Media Insights" de Metricool exportados el 29/09/2026.
export type OfficialRow = { key: "facebook" | "instagram" | "tiktok" | "youtube"; label: string };

export const OFFICIAL_PLATFORMS: OfficialRow[] = [
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "facebook", label: "Facebook" },
  { key: "youtube", label: "YouTube" },
];

type Metric = { total: number; change: string; by: Record<OfficialRow["key"], number> };
export type OfficialPeriod = {
  label: string;
  followers: Metric;
  impressions: Metric;
  interactions: Metric;
  publications: Metric;
};

export const PELOTICA_OFFICIAL: { year: OfficialPeriod; september: OfficialPeriod } = {
  year: {
    label: "1 ene – 29 sep 2026",
    followers: { total: 100080, change: "+39,2%", by: { facebook: 1062, instagram: 48770, tiktok: 49630, youtube: 610 } },
    impressions: { total: 13940000, change: "+150,8%", by: { facebook: 3180000, instagram: 7080000, tiktok: 3660000, youtube: 11130 } },
    interactions: { total: 437970, change: "+644%", by: { facebook: 1090, instagram: 138750, tiktok: 297980, youtube: 156 } },
    publications: { total: 1805, change: "+8,6%", by: { facebook: 517, instagram: 1036, tiktok: 236, youtube: 16 } },
  },
  september: {
    label: "1 – 29 sep 2026",
    followers: { total: 100080, change: "+18,0%", by: { facebook: 1062, instagram: 48770, tiktok: 49630, youtube: 610 } },
    impressions: { total: 9830000, change: "+321,5%", by: { facebook: 2210000, instagram: 4990000, tiktok: 2620000, youtube: 7083 } },
    interactions: { total: 292270, change: "+109,3%", by: { facebook: 703, instagram: 79260, tiktok: 212180, youtube: 122 } },
    publications: { total: 1176, change: "+352,3%", by: { facebook: 302, instagram: 678, tiktok: 184, youtube: 12 } },
  },
};

export const FOLLOWER_GROWTH_YEAR = { facebook: "+4,3%", instagram: "+22,4%", tiktok: "+61,6%", youtube: "+80,5%" };

export const OFFICIAL_AUDIENCE = {
  instagram: [
    ["Venezuela", 74.39], ["Estados Unidos", 5.83], ["España", 4.49], ["Chile", 4.11], ["Colombia", 2.46],
  ] as [string, number][],
  instagramCities: [
    ["Caracas", 29.39], ["Santiago de Chile", 3.07], ["Barquisimeto", 2.53], ["Valencia", 2.36], ["Guatire", 1.92],
  ] as [string, number][],
  facebook: [
    ["Venezuela", 86.91], ["Colombia", 4.24], ["Perú", 1.22], ["México", 1.04], ["Brasil", 0.94],
  ] as [string, number][],
  youtube: [
    ["Venezuela", 86.86], ["Estados Unidos", 3.13], ["Colombia", 2.2], ["España", 1.9], ["Brasil", 0.83],
  ] as [string, number][],
};

export const TOP_HASHTAGS: { tag: string; views: number }[] = [
  { tag: "#perrosdelosguayos", views: 73360 },
  { tag: "#AmoaJugá", views: 58080 },
  { tag: "#pareonone", views: 36490 },
  { tag: "#alfredosadel", views: 25570 },
  { tag: "#laguaira", views: 16860 },
];

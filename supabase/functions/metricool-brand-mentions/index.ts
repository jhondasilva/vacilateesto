import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const TOKEN = Deno.env.get("METRICOOL_USER_TOKEN")!;
const USER_ID = Deno.env.get("METRICOOL_USER_ID")!;
const BASE = "https://app.metricool.com/api/v2/analytics/posts";

const norm = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const matchesKeywords = (text: string, keywords: string[]) => {
  const n = norm(text);
  return keywords.some((k) => n.includes(norm(k)));
};

const excludesKeywords = (text: string, keywords: string[]) => {
  if (!keywords.length) return false;
  const n = norm(text);
  return keywords.some((k) => n.includes(norm(k)));
};

type Unified = {
  platform: "instagram" | "tiktok" | "facebook" | "youtube";
  id: string;
  url: string;
  publishedAt: string | null;
  text: string;
  thumbnail: string | null;
  metrics: Record<string, number>;
};

function unify(platform: Unified["platform"], p: any): Unified | null {
  switch (platform) {
    case "instagram":
      // Handles feed posts, reels and stories
      const igId = p.postId ?? p.reelId ?? "";
      const igUrl = p.url ?? p.permalink ?? "";
      const igThumb = p.imageUrl ?? p.thumbnailUrl ?? null;
      return {
        platform,
        id: igId,
        url: igUrl,
        publishedAt: p.publishedAt?.dateTime ?? null,
        text: p.content ?? "",
        thumbnail: igThumb,
        metrics: {
          likes: p.likes ?? 0,
          comments: p.comments ?? p.replies ?? 0,
          reach: p.reach ?? 0,
          impressions: p.impressions ?? p.impressionsTotal ?? 0,
          views: p.views ?? p.videoViews ?? 0,
          saved: p.saved ?? 0,
          shares: p.shares ?? 0,
        },
      };
    case "tiktok":
      return {
        platform,
        id: p.videoId,
        url: p.shareUrl,
        publishedAt: p.createTime ?? null,
        text: p.videoDescription ?? p.title ?? "",
        thumbnail: p.coverImageUrl ?? null,
        metrics: {
          views: p.viewCount ?? p.views ?? 0,
          likes: p.likeCount ?? p.likes ?? 0,
          comments: p.commentCount ?? p.comments ?? 0,
          shares: p.shareCount ?? p.shares ?? 0,
        },
      };
    case "facebook":
      // Handles both feed posts and reels (FB reels use reelId + description + reelUrl)
      const fbId = p.postId ?? p.reelId ?? "";
      const fbText = p.text ?? p.description ?? "";
      const fbViews = p.blueReelsPlayCount ?? p.videoViews ?? 0;
      return {
        platform,
        id: fbId,
        url: p.link ?? p.reelUrl ?? "",
        publishedAt: p.created?.dateTime ?? null,
        text: fbText,
        thumbnail: p.picture ?? p.thumbnailUrl ?? null,
        metrics: {
          impressions: p.impressions ?? p.postImpressionsUnique ?? 0,
          reactions: p.reactions ?? p.postVideoReactions ?? 0,
          comments: p.comments ?? 0,
          shares: p.shares ?? 0,
          views: fbViews,
        },
      };
    case "youtube":
      return {
        platform,
        id: p.videoId,
        url: p.watchUrl,
        publishedAt: p.publishedAt?.dateTime ?? null,
        text: `${p.title ?? ""}\n${p.description ?? ""}`,
        thumbnail: p.thumbnailUrl ?? null,
        metrics: {
          views: p.views ?? 0,
          likes: p.likes ?? 0,
          comments: p.comments ?? 0,
        },
      };
  }
  return null;
}

async function fetchPlatform(
  platform: Unified["platform"],
  blogId: number,
  from: string,
  to: string,
): Promise<Unified[]> {
  // Instagram has feed posts + reels in two separate endpoints; fetch both.
  const endpoints =
    platform === "instagram"
      ? [
          `${BASE}/instagram?blogId=${blogId}&from=${from}&to=${to}&userId=${USER_ID}`,
          `https://app.metricool.com/api/v2/analytics/reels/instagram?blogId=${blogId}&from=${from}&to=${to}&userId=${USER_ID}`,
          `https://app.metricool.com/api/v2/analytics/stories/instagram?blogId=${blogId}&from=${from}&to=${to}&userId=${USER_ID}`,
        ]
      : platform === "facebook"
      ? [
          `${BASE}/facebook?blogId=${blogId}&from=${from}&to=${to}&userId=${USER_ID}`,
          `https://app.metricool.com/api/v2/analytics/reels/facebook?blogId=${blogId}&from=${from}&to=${to}&userId=${USER_ID}`,
        ]
      : [`${BASE}/${platform}?blogId=${blogId}&from=${from}&to=${to}&userId=${USER_ID}`];

  const results = await Promise.all(
    endpoints.map(async (url) => {
      const r = await fetch(url, { headers: { "X-Mc-Auth": TOKEN } });
      if (!r.ok) return [] as any[];
      const json = await r.json();
      return Array.isArray(json) ? json : (json.data ?? []);
    }),
  );
  const arr = results.flat();
  // Dedupe by id (reel + feed shouldn't overlap, but be safe)
  const seen = new Set<string>();
  const out: Unified[] = [];
  for (const p of arr) {
    const u = unify(platform, p);
    if (!u) continue;
    if (seen.has(u.id)) continue;
    seen.add(u.id);
    out.push(u);
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const blogId = Number(body.blogId ?? 1943481);
    const keywords: string[] = body.keywords ?? [
      "@cocacola",
      "@cocacolavzla",
      "@cocacolave",
      "#cocacolave",
      "#cocacolavzla",
      "cocacolave",
      "coca-cola femsa",
      "cocacolafemsa",
      "#cocacola",
      "#coca-cola",
      "coca-cola",
      "#vacilateelmundial",
      "#vacilateelfutbol",
      "vacilate el mundial",
      "vacilate el futbol",
      "vacílate el mundial",
      "vacílate el fútbol",
      "#mundial2026",
      "mundial 2026",
      "panini",
      "álbum panini",
    ];
    const now = new Date();
    const from =
      body.from ?? new Date(now.getTime() - 365 * 24 * 3600 * 1000).toISOString().slice(0, 19);
    const to = body.to ?? now.toISOString().slice(0, 19);

    const platforms: Unified["platform"][] = ["instagram", "tiktok", "facebook", "youtube"];
    const requested: Unified["platform"][] = Array.isArray(body.platforms) && body.platforms.length
      ? body.platforms.filter((p: string) => platforms.includes(p as any))
      : platforms;
    const results = await Promise.all(requested.map((p) => fetchPlatform(p, blogId, from, to)));
    const all = results.flat();
    const fromMs = new Date(from).getTime();
    const toMs = new Date(to).getTime();
    const scope: "all" | "brand" = body.scope === "all" ? "all" : "brand";
    const excludeKeywords: string[] = body.excludeKeywords ?? [];
    const matched = all
      .filter((p) => {
        if (scope === "all") return true;
        return matchesKeywords(p.text, keywords) && !excludesKeywords(p.text, excludeKeywords);
      })
      .filter((p) => {
        if (!p.publishedAt) return false;
        const t = new Date(p.publishedAt).getTime();
        if (Number.isNaN(t)) return false;
        return t >= fromMs && t <= toMs;
      })
      .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));

    const totals = matched.reduce(
      (acc, p) => {
        acc.views += p.metrics.views ?? 0;
        acc.likes += p.metrics.likes ?? p.metrics.reactions ?? 0;
        acc.comments += p.metrics.comments ?? 0;
        acc.impressions += p.metrics.impressions ?? 0;
        return acc;
      },
      { views: 0, likes: 0, comments: 0, impressions: 0 },
    );

    const byPlatform = matched.reduce<Record<string, number>>((acc, p) => {
      acc[p.platform] = (acc[p.platform] ?? 0) + 1;
      return acc;
    }, {});

    return new Response(
      JSON.stringify({
        blogId,
        keywords,
        from,
        to,
        totalScanned: all.length,
        matchedCount: matched.length,
        byPlatform,
        totals,
        posts: matched,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
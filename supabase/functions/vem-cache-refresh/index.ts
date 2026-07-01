import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Vacílate El Mundial = todo lo publicado en las 3 plataformas core del podcast
// durante la ventana de cobertura del Mundial FIFA 2026 (feb–jul 2026).
const BLOG_ID = 1943481; // Vacílate Esto Podcast
const PLATFORMS = ["instagram", "tiktok", "youtube"];
const BRAND_SLUG = "vacilate-el-mundial";

// Meses de la campaña. Extender si el mundial se alarga.
const MONTHS: Array<{ key: string; label: string; year: number; month: number }> = [
  { key: "2026-02", label: "Feb 2026", year: 2026, month: 2 },
  { key: "2026-03", label: "Mar 2026", year: 2026, month: 3 },
  { key: "2026-04", label: "Abr 2026", year: 2026, month: 4 },
  { key: "2026-05", label: "May 2026", year: 2026, month: 5 },
  { key: "2026-06", label: "Jun 2026", year: 2026, month: 6 },
  { key: "2026-07", label: "Jul 2026", year: 2026, month: 7 },
];

const fmtIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;

type PlatformAgg = {
  posts: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  impressions: number;
  saved: number;
};

function emptyAgg(): PlatformAgg {
  return { posts: 0, views: 0, likes: 0, comments: 0, shares: 0, reach: 0, impressions: 0, saved: 0 };
}

function aggregate(posts: any[]): { byPlatform: Record<string, PlatformAgg>; totals: PlatformAgg } {
  const byPlatform: Record<string, PlatformAgg> = {
    instagram: emptyAgg(),
    tiktok: emptyAgg(),
    youtube: emptyAgg(),
  };
  for (const p of posts) {
    const bucket = byPlatform[p.platform];
    if (!bucket) continue;
    bucket.posts += 1;
    const m = p.metrics || {};
    bucket.views += m.views || 0;
    bucket.likes += m.likes || 0;
    bucket.comments += m.comments || 0;
    bucket.shares += m.shares || 0;
    bucket.reach += m.reach || 0;
    bucket.impressions += m.impressions || 0;
    bucket.saved += m.saved || 0;
  }
  const totals = emptyAgg();
  for (const bucket of Object.values(byPlatform)) {
    for (const k of Object.keys(totals) as (keyof PlatformAgg)[]) {
      totals[k] += bucket[k];
    }
  }
  return { byPlatform, totals };
}

async function fetchWindow(from: Date, to: Date) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await fetch(`${SUPABASE_URL}/functions/v1/metricool-brand-mentions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SERVICE_ROLE}`,
      },
      body: JSON.stringify({
        blogId: BLOG_ID,
        scope: "all",
        platforms: PLATFORMS,
        from: fmtIso(from),
        to: fmtIso(to),
      }),
    });
    const text = await r.text();
    if (r.ok) {
      const json = JSON.parse(text);
      if (typeof json?.error === "string" && /rate limit/i.test(json.error)) {
        await new Promise((res) => setTimeout(res, 8000));
        continue;
      }
      return json;
    }
    if (r.status === 429) {
      await new Promise((res) => setTimeout(res, 8000));
      continue;
    }
    throw new Error(`metricool ${r.status}: ${text}`);
  }
  throw new Error("metricool: rate limit sostenido");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false },
    });
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    // Solo procesamos meses ya iniciados.
    const monthsToRun = MONTHS.filter((m) => m.key <= currentMonthKey);
    const results: any[] = [];

    // 1) Cada mes por separado
    const monthlyAggs: Array<{ key: string; label: string; agg: ReturnType<typeof aggregate> }> = [];
    for (const m of monthsToRun) {
      const from = new Date(m.year, m.month - 1, 1, 0, 0, 0);
      const to = new Date(m.year, m.month, 0, 23, 59, 59);
      try {
        const payload = await fetchWindow(from, to);
        const agg = aggregate(payload.posts || []);
        monthlyAggs.push({ key: m.key, label: m.label, agg });
        const { error } = await supabase.from("brand_metricool_cache").upsert(
          {
            brand_slug: BRAND_SLUG,
            scope: "all",
            period_key: m.key,
            period_label: m.label,
            period_from: from.toISOString(),
            period_to: to.toISOString(),
            payload: { byPlatform: agg.byPlatform, totals: agg.totals, matchedCount: payload.matchedCount },
            refreshed_at: new Date().toISOString(),
          },
          { onConflict: "brand_slug,scope,period_key" },
        );
        if (error) throw error;
        results.push({ period: m.key, posts: agg.totals.posts, views: agg.totals.views });
        await new Promise((res) => setTimeout(res, 700));
      } catch (e: any) {
        results.push({ period: m.key, error: e?.message || String(e) });
      }
    }

    // 2) Acumulado feb → mes actual (usa los meses ya cargados, no re-consulta)
    const cumulativeTotals = emptyAgg();
    const cumulativeByPlatform: Record<string, PlatformAgg> = {
      instagram: emptyAgg(),
      tiktok: emptyAgg(),
      youtube: emptyAgg(),
    };
    for (const { agg } of monthlyAggs) {
      for (const [pl, bucket] of Object.entries(agg.byPlatform)) {
        for (const k of Object.keys(bucket) as (keyof PlatformAgg)[]) {
          cumulativeByPlatform[pl][k] += bucket[k];
          cumulativeTotals[k] += bucket[k];
        }
      }
    }
    const from0 = new Date(2026, 1, 1, 0, 0, 0);
    const toNow = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    await supabase.from("brand_metricool_cache").upsert(
      {
        brand_slug: BRAND_SLUG,
        scope: "all",
        period_key: "cumulative",
        period_label: "Acumulado campaña",
        period_from: from0.toISOString(),
        period_to: toNow.toISOString(),
        payload: { byPlatform: cumulativeByPlatform, totals: cumulativeTotals },
        refreshed_at: new Date().toISOString(),
      },
      { onConflict: "brand_slug,scope,period_key" },
    );
    results.push({ period: "cumulative", posts: cumulativeTotals.posts, views: cumulativeTotals.views });

    return new Response(
      JSON.stringify({ ok: true, ranAt: new Date().toISOString(), results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e: any) {
    console.error("vem-cache-refresh error", e);
    return new Response(
      JSON.stringify({ ok: false, error: e?.message || String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
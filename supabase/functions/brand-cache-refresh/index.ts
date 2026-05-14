import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Mismas keywords que el frontend (src/pages/DashboardBrand.tsx)
const BRAND_KEYWORDS: Record<
  string,
  { keywords: string[]; excludeKeywords: string[] }
> = {
  "coca-cola": {
    keywords: [
      "@cocacola", "@cocacolavzla", "@cocacolave",
      "#cocacolave", "#cocacolavzla", "cocacolave",
      "coca-cola femsa", "cocacolafemsa",
      "#cocacola", "#coca-cola", "coca-cola",
      "#vacilateelmundial", "#vacilateelfutbol",
      "vacilate el mundial", "vacilate el futbol",
      "vacílate el mundial", "vacílate el fútbol",
      "#mundial2026", "mundial 2026", "panini", "álbum panini",
    ],
    excludeKeywords: ["@kfcve", "@kfcvzla", "#kfcve", "#kfcvzla", "#kfc", "kfc"],
  },
  kfc: {
    keywords: [
      "@kfc_vzla", "#kfc_vzla", "kfc_vzla",
      "@kfcvzla", "#kfcvzla", "kfcvzla",
      "@kfcve", "#kfcve",
    ],
    excludeKeywords: [],
  },
  vatel: {
    keywords: [
      "@vatelvenezuela", "#vatelvenezuela", "vatelvenezuela",
      "#vatel", "vatel",
    ],
    excludeKeywords: [],
  },
};

const fmtIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;

function buildPeriods() {
  const now = new Date();
  const periods: { key: string; label: string; from: Date; to: Date }[] = [];

  // Acumulado 2026 → hoy
  periods.push({
    key: "cumulative-2026",
    label: "Acumulado 2026",
    from: new Date(2026, 1, 1, 0, 0, 0),
    to: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59),
  });

  // Mes actual
  const monthFrom = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
  const monthTo = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  periods.push({
    key: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
    label: "Mes actual",
    from: monthFrom,
    to: monthTo,
  });

  // Mes anterior (por si recién cambió)
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevFrom = new Date(prev.getFullYear(), prev.getMonth(), 1, 0, 0, 0);
  const prevTo = new Date(prev.getFullYear(), prev.getMonth() + 1, 0, 23, 59, 59);
  periods.push({
    key: `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`,
    label: "Mes anterior",
    from: prevFrom,
    to: prevTo,
  });

  return periods;
}

async function callMetricool(body: Record<string, unknown>) {
  const r = await fetch(`${SUPABASE_URL}/functions/v1/metricool-brand-mentions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SERVICE_ROLE}`,
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`metricool ${r.status}: ${await r.text()}`);
  return await r.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false },
    });

    const { data: brands, error: brandsErr } = await supabase
      .from("brands")
      .select("slug, name");
    if (brandsErr) throw brandsErr;

    const periods = buildPeriods();
    const results: any[] = [];

    for (const brand of brands ?? []) {
      const cfg = BRAND_KEYWORDS[brand.slug];
      if (!cfg) {
        results.push({ brand: brand.slug, skipped: "no keywords configured" });
        continue;
      }
      for (const period of periods) {
        for (const scope of ["brand", "all"] as const) {
          try {
            const payload = await callMetricool({
              from: fmtIso(period.from),
              to: fmtIso(period.to),
              scope,
              ...(scope === "brand"
                ? { keywords: cfg.keywords, excludeKeywords: cfg.excludeKeywords }
                : {}),
            });
            const { error: upErr } = await supabase
              .from("brand_metricool_cache")
              .upsert(
                {
                  brand_slug: brand.slug,
                  scope,
                  period_key: period.key,
                  period_label: period.label,
                  period_from: period.from.toISOString(),
                  period_to: period.to.toISOString(),
                  payload,
                  refreshed_at: new Date().toISOString(),
                },
                { onConflict: "brand_slug,scope,period_key" },
              );
            if (upErr) throw upErr;
            results.push({
              brand: brand.slug,
              period: period.key,
              scope,
              matched: payload?.matchedCount ?? 0,
            });
          } catch (e: any) {
            results.push({
              brand: brand.slug,
              period: period.key,
              scope,
              error: e?.message || String(e),
            });
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ ok: true, ranAt: new Date().toISOString(), results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e: any) {
    console.error("brand-cache-refresh error", e);
    return new Response(
      JSON.stringify({ ok: false, error: e?.message || String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
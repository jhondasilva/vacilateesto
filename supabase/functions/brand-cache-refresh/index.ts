import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Mismas keywords que el frontend (src/pages/DashboardBrand.tsx)
const BRAND_KEYWORDS: Record<
  string,
  { keywords: string[]; excludeKeywords: string[]; blogIds?: number[]; includeAllFromBlogIds?: number[] }
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
    blogIds: [1943481, 1908520],
    keywords: [
      "@vatelvenezuela", "#vatelvenezuela", "vatelvenezuela",
      "#vatel", "vatel",
    ],
    excludeKeywords: [],
  },
  maggi: {
    blogIds: [1943481, 1908520],
    keywords: [
      "@maggivenezuela", "#maggivenezuela", "maggivenezuela",
      "#maggi", "maggi",
    ],
    excludeKeywords: [],
  },
  empire: {
    blogIds: [1943481, 1908520],
    keywords: [
      "@empirekeeway", "#empirekeeway", "empirekeeway",
      "#empire", "empire",
    ],
    excludeKeywords: [],
  },
  buchanans: {
    keywords: [
      "@buchananslatam", "#buchananslatam", "buchananslatam",
      "#buchanans", "buchanans",
    ],
    excludeKeywords: [],
  },
  plumrose: {
    keywords: [
      "@plumrosevzla", "#plumrosevzla", "plumrosevzla",
      "#plumrose", "plumrose",
    ],
    excludeKeywords: [],
  },
  nestea: {
    blogIds: [1943481, 1908520],
    keywords: [
      "@nesteavzla", "#nesteavzla", "nesteavzla",
      "#nestea", "nestea",
    ],
    excludeKeywords: [],
  },
  covencaucho: {
    keywords: [
      "@covencaucho", "#covencaucho", "covencaucho",
    ],
    excludeKeywords: [],
  },
  bnc: {
    keywords: [
      "@bncbanco", "#bncbanco", "bncbanco",
      "#bnc", "bnc",
    ],
    excludeKeywords: [],
  },
  "pelotica-de-goma": {
    blogIds: [1908520, 1943481],
    includeAllFromBlogIds: [1908520],
    keywords: [
      "#peloticadegoma", "peloticadegoma", "@peloticadegoma", "@peloticadegomave",
      "#amoajuga", "amoajuga", "@amoajuga", "#amoajugar",
    ],
    excludeKeywords: [],
  },
  diablitos: {
    blogIds: [1908520, 1943481],
    keywords: [

      "@diablitos_vzla", "#diablitos_vzla", "diablitos_vzla",
      "#diablitos", "diablitos",
    ],
    excludeKeywords: [],
  },
  "podcast-en-la-cumbre": {
    blogIds: [1943481, 1908520],
    keywords: [
      "#podcastenlacumbre", "podcastenlacumbre", "@podcastenlacumbre",
      "podcast en la cumbre",
    ],
    excludeKeywords: [],
  },
};

// Año de inicio del análisis por dashboard (por defecto 2026)
const BRAND_START_YEAR: Record<string, number> = {
  "podcast-en-la-cumbre": 2025,
};




// Dashboard de campaña (no es una marca comercial)
BRAND_KEYWORDS["vacilate-el-mundial"] = {
  keywords: [
    "#vacilateelmundial", "#vacilateelfutbol", "#vacílateelmundial", "#vacílateelfútbol",
    "vacilate el mundial", "vacílate el mundial",
    "vacilate el futbol", "vacílate el fútbol", "vacilate el fútbol", "vacílate el futbol",
    "hablemos de futbol", "hablemos de fútbol", "#hablemosdefutbol", "#hablemosdefútbol",
    "#mundial2026", "mundial 2026", "copa del mundo", "worldcup2026", "#worldcup2026",
    "@bncbanco", "#bncbanco", "bncbanco", "#bnc",
    "@buchananslatam", "#buchananslatam", "buchananslatam", "#buchanans",
    "@kfc_vzla", "@kfcvzla", "#kfcvzla", "#kfc_vzla", "@kfcve", "#kfcve",
    "@cocacola", "@cocacolave", "@cocacolavzla", "#cocacola", "#cocacolave", "#cocacolavzla",
    "@maggivenezuela", "#maggivenezuela", "#maggi",
    "@empirekeeway", "#empirekeeway", "empirekeeway", "#empire", "empire",
  ],
  excludeKeywords: [
    "@plumrosevzla", "#plumrosevzla", "plumrosevzla", "#plumrose", "plumrose",
    "@covencaucho", "#covencaucho", "covencaucho",
  ],
};

const fmtIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;

function buildPeriods(brandSlug?: string) {
  const now = new Date();
  const periods: { key: string; label: string; from: Date; to: Date }[] = [];
  const startYear = (brandSlug && BRAND_START_YEAR[brandSlug]) || 2026;

  if (startYear < 2026) {
    // Acumulado histórico (enero del año inicial → hoy)
    periods.push({
      key: "cumulative-all",
      label: `Acumulado ${startYear}-${now.getFullYear()}`,
      from: new Date(startYear, 0, 1, 0, 0, 0),
      to: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59),
    });
    // Meses completos desde el año inicial
    let y = startYear;
    let m = 0;
    while (y < now.getFullYear() || (y === now.getFullYear() && m <= now.getMonth())) {
      periods.push({
        key: `${y}-${String(m + 1).padStart(2, "0")}`,
        label: `${y}-${String(m + 1).padStart(2, "0")}`,
        from: new Date(y, m, 1, 0, 0, 0),
        to: new Date(y, m + 1, 0, 23, 59, 59),
      });
      m++;
      if (m > 11) { m = 0; y++; }
    }
    return periods;
  }

  // Acumulado 2026 (enero → hoy)
  periods.push({
    key: "cumulative-2026",
    label: "Acumulado 2026",
    from: new Date(2026, 0, 1, 0, 0, 0),
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
  // Reintenta con backoff cuando Metricool devuelve rate limit.
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await fetch(`${SUPABASE_URL}/functions/v1/metricool-brand-mentions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SERVICE_ROLE}`,
      },
      body: JSON.stringify(body),
    });
    const text = await r.text();
    if (r.ok) {
      try {
        const json = JSON.parse(text);
        if (typeof json?.error === "string" && /rate limit/i.test(json.error)) {
          const m = json.error.match(/Retry after (\d+)ms/i);
          const wait = m ? Math.min(parseInt(m[1], 10) + 500, 35000) : 8000;
          await new Promise((res) => setTimeout(res, wait));
          continue;
        }
        return json;
      } catch {
        return JSON.parse(text);
      }
    }
    if (r.status === 429 || /rate limit/i.test(text)) {
      const m = text.match(/Retry after (\d+)ms/i);
      const wait = m ? Math.min(parseInt(m[1], 10) + 500, 35000) : 8000;
      await new Promise((res) => setTimeout(res, wait));
      continue;
    }
    throw new Error(`metricool ${r.status}: ${text}`);
  }
  throw new Error("metricool: rate limit, no quedó cupo tras reintentos");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false },
    });

    // Permitir filtrar marcas vía body para ejecutes más rápidos.
    let brandFilter: string[] | null = null;
    if (req.method === "POST") {
      try {
        const body = await req.json();
        if (Array.isArray(body?.brands) && body.brands.length > 0) {
          brandFilter = body.brands.map((s: string) => String(s).trim().toLowerCase());
        }
      } catch {
        /* body vacío o no JSON */
      }
    }

    let brandsQuery = supabase.from("brands").select("slug, name");
    if (brandFilter) {
      brandsQuery = brandsQuery.in("slug", brandFilter);
    }
    const { data: brands, error: brandsErr } = await brandsQuery;
    if (brandsErr) throw brandsErr;

    const results: any[] = [];

    // Cache de scope="all" por periodo: el payload no depende de la marca,
    // así que lo calculamos una sola vez por periodo y lo reusamos.
    const allByPeriod = new Map<string, unknown>();

    for (const brand of brands ?? []) {
      const cfg = BRAND_KEYWORDS[brand.slug];
      if (!cfg) {
        results.push({ brand: brand.slug, skipped: "no keywords configured" });
        continue;
      }
      const periods = buildPeriods(brand.slug);
      for (const period of periods) {
        for (const scope of ["brand", "all"] as const) {
          try {
            let payload: any;
            const sharesAllCache = !cfg.blogIds;
            if (scope === "all" && sharesAllCache && allByPeriod.has(period.key)) {
              payload = allByPeriod.get(period.key);
            } else {
              payload = await callMetricool({
                from: fmtIso(period.from),
                to: fmtIso(period.to),
                scope,
                ...((cfg as any).blogIds ? { blogIds: (cfg as any).blogIds } : {}),
                ...(scope === "brand"
                  ? {
                      keywords: cfg.keywords,
                      excludeKeywords: cfg.excludeKeywords,
                      ...((cfg as any).includeAllFromBlogIds
                        ? { includeAllFromBlogIds: (cfg as any).includeAllFromBlogIds }
                        : {}),
                    }
                  : {}),
              });

              if (scope === "all" && sharesAllCache) allByPeriod.set(period.key, payload);

              // Pequeña pausa para no saturar a Metricool entre llamadas.
              await new Promise((res) => setTimeout(res, 800));
            }
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
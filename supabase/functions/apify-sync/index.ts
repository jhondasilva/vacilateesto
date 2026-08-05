import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/apify";
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const APIFY_API_KEY = Deno.env.get("APIFY_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const TIKTOK_ACTOR = "clockworks~tiktok-profile-scraper";

function addCors(headers: HeadersInit = {}) {
  return { ...corsHeaders, ...headers };
}

async function apifyFetch(path: string, init: RequestInit = {}) {
  const res = await fetch(`${GATEWAY_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": APIFY_API_KEY,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  return res;
}

async function startTikTokRun(handle: string, fromDate: string, toDate: string) {
  const res = await apifyFetch(`/acts/${TIKTOK_ACTOR}/runs`, {
    method: "POST",
    body: JSON.stringify({
      profiles: [handle.replace(/^@/, "")],
      oldestPostDate: fromDate,
      newestPostDate: toDate,
      resultsPerPage: 1000,
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Apify start run failed ${res.status}: ${text}`);
  }
  const json = JSON.parse(text);
  return { runId: json.data.id, datasetId: json.data.defaultDatasetId };
}

async function getRunStatus(runId: string) {
  const res = await apifyFetch(`/acts/${TIKTOK_ACTOR}/runs/${runId}`);
  const text = await res.text();
  if (!res.ok) throw new Error(`Apify status failed ${res.status}: ${text}`);
  const json = JSON.parse(text);
  return {
    status: json.data.status,
    datasetId: json.data.defaultDatasetId,
  };
}

async function getDatasetItems(datasetId: string, limit = 5000) {
  const res = await apifyFetch(`/datasets/${datasetId}/items?limit=${limit}`);
  const text = await res.text();
  if (!res.ok) throw new Error(`Apify dataset failed ${res.status}: ${text}`);
  return JSON.parse(text) as any[];
}

function normalizeDateInput(d: string) {
  // Acepta YYYY-MM-DD o ISO.
  return d.split("T")[0];
}

async function pollAndStore(
  runId: string,
  datasetId: string | null,
  handle: string,
  fromDate: string,
  toDate: string,
) {
  let attempts = 0;
  const maxAttempts = 12; // ~60s
  let currentDatasetId = datasetId;

  while (attempts < maxAttempts) {
    const status = await getRunStatus(runId);
    currentDatasetId = status.datasetId || currentDatasetId;
    if (status.status === "SUCCEEDED") {
      break;
    }
    if (["FAILED", "ABORTED", "TIMED-OUT"].includes(status.status)) {
      throw new Error(`Apify run ${runId} finished with status ${status.status}`);
    }
    await new Promise((res) => setTimeout(res, 5000));
    attempts++;
  }

  if (!currentDatasetId) {
    throw new Error("Apify run did not return a dataset");
  }

  const items = await getDatasetItems(currentDatasetId);
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

  // Limpia métricas previas del mismo periodo para evitar duplicados.
  const { error: delErr } = await supabase
    .from("apify_metrics")
    .delete()
    .eq("platform", "tiktok")
    .eq("metric_type", "video")
    .gte("recorded_at", `${fromDate}T00:00:00Z`)
    .lte("recorded_at", `${toDate}T23:59:59Z`);
  if (delErr) console.error("delete previous apify metrics error", delErr);

  // El actor no siempre devuelve una fila de perfil separada; toma el primer video como fallback.
  const profileRow = items.find((it) => it.authorMeta && !it.webVideoUrl) || items.find((it) => it.authorMeta);
  const profileMeta = profileRow?.authorMeta;

  let inserted = 0;
  const metricsToInsert: any[] = [];

  // Métricas de perfil (estado actual)
  if (profileMeta) {
    const now = new Date().toISOString();
    metricsToInsert.push(
      { platform: "tiktok", metric_type: "profile_followers", external_id: handle, value: Number(profileMeta.fans) || 0, unit: "followers", recorded_at: now, raw_data: profileMeta },
      { platform: "tiktok", metric_type: "profile_likes", external_id: handle, value: Number(profileMeta.heart) || 0, unit: "likes", recorded_at: now, raw_data: profileMeta },
      { platform: "tiktok", metric_type: "profile_videos", external_id: handle, value: Number(profileMeta.video) || 0, unit: "videos", recorded_at: now, raw_data: profileMeta },
    );
  }

  // Métricas por video
  for (const it of items) {
    if (!it.webVideoUrl) continue;
    const url = it.webVideoUrl as string;
    const videoId = url.split("/video/").pop() || url;
    const recordedAt = it.createTimeISO ? new Date(it.createTimeISO).toISOString() : new Date().toISOString();
    const metrics = [
      { platform: "tiktok", metric_type: "video", external_id: videoId, value: Number(it.playCount) || 0, unit: "views", recorded_at: recordedAt, raw_data: { ...it, metricUnit: "views" } },
      { platform: "tiktok", metric_type: "video", external_id: videoId, value: Number(it.diggCount) || 0, unit: "likes", recorded_at: recordedAt, raw_data: { ...it, metricUnit: "likes" } },
      { platform: "tiktok", metric_type: "video", external_id: videoId, value: Number(it.commentCount) || 0, unit: "comments", recorded_at: recordedAt, raw_data: { ...it, metricUnit: "comments" } },
      { platform: "tiktok", metric_type: "video", external_id: videoId, value: Number(it.shareCount) || 0, unit: "shares", recorded_at: recordedAt, raw_data: { ...it, metricUnit: "shares" } },
    ];
    metricsToInsert.push(...metrics);
  }

  // Inserta en chunks de 100 para no superar límites.
  const chunkSize = 100;
  for (let i = 0; i < metricsToInsert.length; i += chunkSize) {
    const chunk = metricsToInsert.slice(i, i + chunkSize);
    const { error } = await supabase.from("apify_metrics").insert(chunk);
    if (error) {
      console.error("apify_metrics insert error", error);
      throw new Error(`Error insertando métricas: ${error.message}`);
    }
    inserted += chunk.length;
  }

  const videos = items.filter((it) => it.webVideoUrl);
  const totalViews = videos.reduce((acc, it) => acc + (Number(it.playCount) || 0), 0);
  const totalLikes = videos.reduce((acc, it) => acc + (Number(it.diggCount) || 0), 0);
  const totalComments = videos.reduce((acc, it) => acc + (Number(it.commentCount) || 0), 0);
  const totalShares = videos.reduce((acc, it) => acc + (Number(it.shareCount) || 0), 0);

  return {
    runId,
    datasetId: currentDatasetId,
    videos: videos.length,
    inserted,
    profile: profileMeta
      ? {
          followers: Number(profileMeta.fans) || 0,
          likes: Number(profileMeta.heart) || 0,
          videoCount: Number(profileMeta.video) || 0,
        }
      : null,
    totals: { views: totalViews, likes: totalLikes, comments: totalComments, shares: totalShares },
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: addCors() });
  }

  try {
    if (!LOVABLE_API_KEY || !APIFY_API_KEY) {
      throw new Error("Faltan credenciales de Apify o Lovable");
    }

    const { platform, handle, from, to, wait = true } = await req.json();

    if (!platform || !handle || !from || !to) {
      return new Response(
        JSON.stringify({ error: "Faltan parámetros: platform, handle, from, to" }),
        { status: 400, headers: addCors({ "Content-Type": "application/json" }) },
      );
    }

    if (platform !== "tiktok") {
      return new Response(
        JSON.stringify({ error: "Plataforma no soportada. Use 'tiktok'." }),
        { status: 400, headers: addCors({ "Content-Type": "application/json" }) },
      );
    }

    const fromDate = normalizeDateInput(from);
    const toDate = normalizeDateInput(to);
    const { runId, datasetId } = await startTikTokRun(handle, fromDate, toDate);

    if (!wait) {
      return new Response(
        JSON.stringify({ ok: true, started: true, runId, datasetId }),
        { headers: addCors({ "Content-Type": "application/json" }) },
      );
    }

    const result = await pollAndStore(runId, datasetId, handle, fromDate, toDate);
    return new Response(
      JSON.stringify({ ok: true, ...result }),
      { headers: addCors({ "Content-Type": "application/json" }) },
    );
  } catch (e: any) {
    console.error("apify-sync error", e);
    return new Response(
      JSON.stringify({ ok: false, error: e?.message || String(e) }),
      { status: 500, headers: addCors({ "Content-Type": "application/json" }) },
    );
  }
});

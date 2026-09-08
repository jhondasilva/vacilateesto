import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/apify";
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const APIFY_API_KEY = Deno.env.get("APIFY_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const TIKTOK_HASHTAG_ACTOR = "clockworks~tiktok-scraper";
const IG_HASHTAG_ACTOR = "apify~instagram-hashtag-scraper";

// Cuentas oficiales del ecosistema: NO son influencers.
const OFFICIAL_HANDLES = new Set(
  [
    "peloticadegomave",
    "peloticadegoma",
    "vacilateestopodcast",
    "vacilateesto",
    "diablosdelabastidas",
    "bombillosdepetare",
    "vikingosdecharallave",
    "torosdelavega",
    "losperrosdelosguayos",
    "losvipdepintoo",
    "coquitoysucombopdg",
    "losrelampagoskk",
  ].map((h) => h.toLowerCase()),
);

const DEFAULT_HASHTAGS = ["peloticadegoma", "amoajuga"];

function addCors(headers: HeadersInit = {}) {
  return { ...corsHeaders, ...headers };
}

async function apifyFetch(path: string, init: RequestInit = {}) {
  return await fetch(`${GATEWAY_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": APIFY_API_KEY,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
}

async function startRun(actorId: string, input: Record<string, unknown>) {
  const res = await apifyFetch(`/acts/${actorId}/runs`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`start ${actorId} ${res.status}: ${text.slice(0, 400)}`);
  const json = JSON.parse(text);
  return { runId: json.data.id as string, datasetId: json.data.defaultDatasetId as string };
}

async function waitForRun(actorId: string, runId: string, maxMs = 150000) {
  const started = Date.now();
  let datasetId: string | null = null;
  while (Date.now() - started < maxMs) {
    const res = await apifyFetch(`/acts/${actorId}/runs/${runId}`);
    const text = await res.text();
    if (!res.ok) throw new Error(`status ${res.status}: ${text.slice(0, 300)}`);
    const json = JSON.parse(text);
    datasetId = json.data.defaultDatasetId ?? datasetId;
    const status = json.data.status;
    if (status === "SUCCEEDED") return datasetId;
    if (["FAILED", "ABORTED", "TIMED-OUT"].includes(status)) {
      throw new Error(`run ${runId} ${status}`);
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
  // Devuelve lo que haya alcanzado a escribir el dataset.
  return datasetId;
}

async function getItems(datasetId: string, limit = 1000) {
  const res = await apifyFetch(`/datasets/${datasetId}/items?limit=${limit}`);
  const text = await res.text();
  if (!res.ok) throw new Error(`dataset ${res.status}: ${text.slice(0, 300)}`);
  try {
    return JSON.parse(text) as any[];
  } catch {
    return [];
  }
}

function extractHashtags(text: string) {
  return (text.match(/#[\p{L}\p{N}_]+/gu) ?? []).map((h) => h.toLowerCase());
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: addCors() });

  try {
    if (!LOVABLE_API_KEY || !APIFY_API_KEY) {
      throw new Error("Faltan credenciales de Apify o Lovable");
    }

    let body: any = {};
    if (req.method === "POST") {
      try {
        body = await req.json();
      } catch {
        body = {};
      }
    }

    const campaignSlug: string = body.campaignSlug ?? "pelotica-de-goma";
    const hashtags: string[] = (body.hashtags ?? DEFAULT_HASHTAGS).map((h: string) =>
      String(h).replace(/^#/, "").toLowerCase(),
    );
    const perHashtag: number = Math.min(Number(body.limit) || 100, 300);
    const platforms: string[] = body.platforms ?? ["tiktok", "instagram"];

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false },
    });

    const rows: any[] = [];
    const errors: string[] = [];

    // Lanza ambos actores en paralelo y espera a que terminen.
    const jobs: Promise<void>[] = [];

    if (platforms.includes("tiktok")) {
      jobs.push(
        (async () => {
          try {
            const { runId } = await startRun(TIKTOK_HASHTAG_ACTOR, {
              hashtags,
              resultsPerPage: perHashtag,
              shouldDownloadVideos: false,
              shouldDownloadCovers: false,
            });
            const datasetId = await waitForRun(TIKTOK_HASHTAG_ACTOR, runId);
            if (!datasetId) throw new Error("sin dataset");
            const items = await getItems(datasetId);
            for (const it of items) {
              const url = it.webVideoUrl as string | undefined;
              if (!url) continue;
              const handle = String(it.authorMeta?.uniqueId ?? "").toLowerCase();
              if (!handle || OFFICIAL_HANDLES.has(handle)) continue;
              const text = String(it.text ?? "");
              rows.push({
                campaign_slug: campaignSlug,
                platform: "tiktok",
                external_id: url.split("/video/").pop() || url,
                author_handle: `@${handle}`,
                author_name: it.authorMeta?.nickName ?? null,
                author_followers: Number(it.authorMeta?.fans) || null,
                url,
                text,
                thumbnail: it.videoMeta?.coverUrl ?? null,
                published_at: it.createTimeISO ?? null,
                views: Number(it.playCount) || 0,
                likes: Number(it.diggCount) || 0,
                comments: Number(it.commentCount) || 0,
                shares: Number(it.shareCount) || 0,
                hashtags: extractHashtags(text),
                synced_at: new Date().toISOString(),
              });
            }
          } catch (e: any) {
            errors.push(`tiktok: ${e?.message || String(e)}`);
          }
        })(),
      );
    }

    if (platforms.includes("instagram")) {
      jobs.push(
        (async () => {
          try {
            const { runId } = await startRun(IG_HASHTAG_ACTOR, {
              hashtags,
              resultsLimit: perHashtag,
            });
            const datasetId = await waitForRun(IG_HASHTAG_ACTOR, runId);
            if (!datasetId) throw new Error("sin dataset");
            const items = await getItems(datasetId);
            for (const it of items) {
              const url = (it.url as string | undefined) ?? null;
              const id = (it.id as string | undefined) ?? (it.shortCode as string | undefined);
              if (!url || !id) continue;
              const handle = String(it.ownerUsername ?? "").toLowerCase();
              if (!handle || OFFICIAL_HANDLES.has(handle)) continue;
              const text = String(it.caption ?? "");
              const tags = (it.hashtags ?? []).map((h: string) => `#${String(h).toLowerCase()}`);
              rows.push({
                campaign_slug: campaignSlug,
                platform: "instagram",
                external_id: id,
                author_handle: `@${handle}`,
                author_name: it.ownerFullName ?? null,
                author_followers: null,
                url,
                text,
                thumbnail: it.displayUrl ?? null,
                published_at: it.timestamp ?? null,
                views: Number(it.videoViewCount ?? it.videoPlayCount) || 0,
                likes: Number(it.likesCount) || 0,
                comments: Number(it.commentsCount) || 0,
                shares: 0,
                hashtags: tags.length ? tags : extractHashtags(text),
                synced_at: new Date().toISOString(),
              });
            }
          } catch (e: any) {
            errors.push(`instagram: ${e?.message || String(e)}`);
          }
        })(),
      );
    }

    await Promise.all(jobs);

    // Deduplica por (plataforma, id) antes del upsert.
    const seen = new Set<string>();
    const unique = rows.filter((r) => {
      const k = `${r.platform}:${r.external_id}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    let upserted = 0;
    for (let i = 0; i < unique.length; i += 100) {
      const chunk = unique.slice(i, i + 100);
      const { error } = await supabase
        .from("influencer_posts")
        .upsert(chunk, { onConflict: "campaign_slug,platform,external_id" });
      if (error) throw new Error(`upsert: ${error.message}`);
      upserted += chunk.length;
    }

    return new Response(
      JSON.stringify({ ok: true, hashtags, found: unique.length, upserted, errors }),
      { headers: addCors({ "Content-Type": "application/json" }) },
    );
  } catch (e: any) {
    console.error("influencer-hashtag-sync error", e);
    return new Response(JSON.stringify({ ok: false, error: e?.message || String(e) }), {
      status: 500,
      headers: addCors({ "Content-Type": "application/json" }),
    });
  }
});

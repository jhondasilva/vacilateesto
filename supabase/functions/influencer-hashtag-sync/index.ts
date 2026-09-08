import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/apify";
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const APIFY_API_KEY = Deno.env.get("APIFY_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const TIKTOK_HASHTAG_ACTOR = "clockworks~tiktok-scraper";
const IG_HASHTAG_ACTOR = "apify~instagram-hashtag-scraper";
const IG_PROFILE_ACTOR = "apify~instagram-scraper";

// Cuentas oficiales del ecosistema: NO son influencers.
const OFFICIAL_HANDLES = new Set([
  "peloticadegomave",
  "peloticadegoma",
  "vacilateestopodcast",
  "vacilateesto",
]);

const TEAM_HANDLES = new Set([
  "diablosdelabastidas",
  "bombillosdepetare",
  "vikingosdecharallave",
  "torosdelavega",
  "losperrosdelosguayos",
  "losvipdepintoo",
  "coquitoysucombopdg",
  "losrelampagoskk",
]);

const CHIVO_HANDLES = new Set([
  "mabastidas",
  "luis_sojo19",
  "gesaria",
  "luchomosqueda",
  "azuaje.230",
  "lamentedepinto",
  "coquitooriginal",
  "diazkarate",
]);

const SUPER_CHIVO_HANDLES = new Set(["jhonsnacks", "juansofa"]);

function classify(handle: string) {
  const h = handle.toLowerCase();
  if (OFFICIAL_HANDLES.has(h)) return "oficial";
  if (TEAM_HANDLES.has(h)) return "equipo";
  if (CHIVO_HANDLES.has(h)) return "chivo";
  if (SUPER_CHIVO_HANDLES.has(h)) return "super-chivo";
  return "influencer";
}


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

async function getItems(datasetId: string, fields: string, limit = 500) {
  const items: any[] = [];
  // Se pagina para evitar respuestas gigantes que rompen el parseo.
  for (let offset = 0; offset < limit; offset += 100) {
    const res = await apifyFetch(
      `/datasets/${datasetId}/items?clean=true&limit=100&offset=${offset}&fields=${encodeURIComponent(fields)}`,
    );
    const text = await res.text();
    if (!res.ok) throw new Error(`dataset ${res.status}: ${text.slice(0, 300)}`);
    let page: any[] = [];
    try {
      page = JSON.parse(text);
    } catch (e) {
      throw new Error(`dataset parse: ${String(e)} :: ${text.slice(0, 200)}`);
    }
    items.push(...page);
    if (page.length < 100) break;
  }
  return items;
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
    const skipHashtags: boolean = body.skipHashtags === true;
    const profileLimit: number = Math.min(Number(body.profileLimit) || 100, 200);

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false },
    });

    const rows: any[] = [];
    const errors: string[] = [];

    // Lanza ambos actores en paralelo y espera a que terminen.
    const jobs: Promise<void>[] = [];

    if (platforms.includes("tiktok") && !skipHashtags) {
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
            const items = await getItems(
              datasetId,
              "webVideoUrl,authorMeta,text,videoMeta,createTimeISO,playCount,diggCount,commentCount,shareCount",
            );
            console.log("tiktok dataset", datasetId, "items", items.length);

            for (const it of items) {
              const url = it.webVideoUrl as string | undefined;
              if (!url) continue;
              const handle = String(
                it.authorMeta?.uniqueId ?? it.authorMeta?.name ?? "",
              ).toLowerCase();

              if (!handle) continue;
              const text = String(it.text ?? "");
              rows.push({
                campaign_slug: campaignSlug,
                category: classify(handle),

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

    if (platforms.includes("instagram") && !skipHashtags) {
      jobs.push(
        (async () => {
          try {
            const { runId } = await startRun(IG_HASHTAG_ACTOR, {
              hashtags,
              resultsLimit: perHashtag,
            });
            const datasetId = await waitForRun(IG_HASHTAG_ACTOR, runId);
            if (!datasetId) throw new Error("sin dataset");
            const items = await getItems(
              datasetId,
              "url,id,shortCode,ownerUsername,ownerFullName,caption,displayUrl,timestamp,videoViewCount,videoPlayCount,likesCount,commentsCount,hashtags",
            );

            for (const it of items) {
              const url = (it.url as string | undefined) ?? null;
              const id = (it.id as string | undefined) ?? (it.shortCode as string | undefined);
              if (!url || !id) continue;
              const handle = String(it.ownerUsername ?? "").toLowerCase();
              if (!handle) continue;
              const text = String(it.caption ?? "");
              const tags = (it.hashtags ?? []).map((h: string) => `#${String(h).toLowerCase()}`);
              rows.push({
                campaign_slug: campaignSlug,
                category: classify(handle),

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

    // Cuentas oficiales de los equipos: se traen TODOS sus posts, sin filtro.
    // Cuentas de chivos: son personales, se traen y luego se filtran por hashtag.
    const teamHandles: string[] = Array.isArray(body.handles) && body.handles.length
      ? body.handles.map((h: string) => String(h).replace(/^@/, "").toLowerCase())
      : [...TEAM_HANDLES, ...CHIVO_HANDLES];

    if (platforms.includes("tiktok")) {
      jobs.push(
        (async () => {
          try {
            const { runId } = await startRun(TIKTOK_HASHTAG_ACTOR, {
              profiles: teamHandles,
              profileScrapeSections: ["videos"],
              profileSorting: "latest",
              resultsPerPage: profileLimit,
              excludePinnedPosts: false,
              shouldDownloadVideos: false,
              shouldDownloadCovers: false,
            });
            const datasetId = await waitForRun(TIKTOK_HASHTAG_ACTOR, runId);
            if (!datasetId) throw new Error("sin dataset");
            const items = await getItems(
              datasetId,
              "webVideoUrl,authorMeta,text,videoMeta,createTimeISO,playCount,diggCount,commentCount,shareCount",
              900,
            );
            for (const it of items) {
              const url = it.webVideoUrl as string | undefined;
              if (!url) continue;
              const handle = String(it.authorMeta?.uniqueId ?? "").toLowerCase();
              if (!TEAM_HANDLES.has(handle) && !CHIVO_HANDLES.has(handle)) continue;
              const text = String(it.text ?? "");
              rows.push({
                campaign_slug: campaignSlug,
                category: classify(handle),
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
            errors.push(`tiktok-equipos: ${e?.message || String(e)}`);
          }
        })(),
      );
    }

    if (platforms.includes("instagram")) {
      jobs.push(
        (async () => {
          try {
            const { runId } = await startRun(IG_PROFILE_ACTOR, {
              directUrls: teamHandles.map((h) => `https://www.instagram.com/${h}/`),
              resultsType: "posts",
              resultsLimit: profileLimit,
            });
            const datasetId = await waitForRun(IG_PROFILE_ACTOR, runId);
            if (!datasetId) throw new Error("sin dataset");
            const items = await getItems(
              datasetId,
              "url,id,shortCode,ownerUsername,ownerFullName,caption,displayUrl,timestamp,videoViewCount,videoPlayCount,likesCount,commentsCount,hashtags",
              900,
            );
            for (const it of items) {
              const url = (it.url as string | undefined) ?? null;
              const id = (it.id as string | undefined) ?? (it.shortCode as string | undefined);
              if (!url || !id) continue;
              const handle = String(it.ownerUsername ?? "").toLowerCase();
              if (!TEAM_HANDLES.has(handle) && !CHIVO_HANDLES.has(handle)) continue;
              const text = String(it.caption ?? "");
              const tags = (it.hashtags ?? []).map((h: string) => `#${String(h).toLowerCase()}`);
              rows.push({
                campaign_slug: campaignSlug,
                category: classify(handle),
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
            errors.push(`instagram-equipos: ${e?.message || String(e)}`);
          }
        })(),
      );
    }

    await Promise.all(jobs);

    // Filtro obligatorio: el post debe traer los DOS hashtags (#peloticadegoma
    // y #amoajuga) o mencionar a un equipo de la liga / un chivo.
    const MENTIONS = [...TEAM_HANDLES, ...CHIVO_HANDLES, ...SUPER_CHIVO_HANDLES, "peloticadegomave"];
    const hasRequiredTag = (r: any) => {
      // Las cuentas oficiales de los equipos entran completas, sin filtro.
      if (r.category === "equipo") return true;
      const tags = `${(r.text ?? "")} ${(r.hashtags ?? []).join(" ")}`
        .toLowerCase()
        .replace(/\s+/g, "");
      const algunHT =
        tags.includes("#peloticadegoma") ||
        tags.includes("#amoajuga") ||
        tags.includes("#vamoajuga");
      // Chivos: cuentas personales, basta con uno de los hashtags oficiales.
      if (r.category === "chivo" || r.category === "oficial" || r.category === "super-chivo")
        return algunHT;
      const norm = `${(r.text ?? "")} ${(r.hashtags ?? []).join(" ")}`
        .toLowerCase()
        .replace(/\s+/g, "");
      const ambosHT =
        norm.includes("#peloticadegoma") &&
        (norm.includes("#amoajuga") || norm.includes("#vamoajuga"));
      const mencionaEquipo = MENTIONS.some((h) => norm.includes(`@${h}`));
      return ambosHT || mencionaEquipo;
    };
    const valid = rows.filter(hasRequiredTag);
    rows.length = 0;
    rows.push(...valid);

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

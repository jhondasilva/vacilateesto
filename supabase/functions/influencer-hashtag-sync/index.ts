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

async function runActor(actorId: string, input: Record<string, unknown>, limit = 500) {
  const res = await apifyFetch(
    `/acts/${actorId}/run-sync-get-dataset-items?limit=${limit}`,
    { method: "POST", body: JSON.stringify(input) },
  );
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Apify ${actorId} ${res.status}: ${text.slice(0, 500)}`);
  }
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

    if (platforms.includes("tiktok")) {
      try {
        const items = await runActor(TIKTOK_HASHTAG_ACTOR, {
          hashtags,
          resultsPerPage: perHashtag,
          shouldDownloadVideos: false,
          shouldDownloadCovers: false,
        });
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
    }

    if (platforms.includes("instagram")) {
      try {
        const items = await runActor(IG_HASHTAG_ACTOR, {
          hashtags,
          resultsLimit: perHashtag,
        });
        for (const it of items) {
          const url = (it.url as string | undefined) ?? null;
          const id = (it.id as string | undefined) ?? (it.shortCode as string | undefined);
          if (!url || !id) continue;
          const handle = String(it.ownerUsername ?? "").toLowerCase();
          if (!handle || OFFICIAL_HANDLES.has(handle)) continue;
          const text = String(it.caption ?? "");
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
            hashtags: (it.hashtags ?? []).map((h: string) => `#${String(h).toLowerCase()}`).length
              ? (it.hashtags ?? []).map((h: string) => `#${String(h).toLowerCase()}`)
              : extractHashtags(text),
            synced_at: new Date().toISOString(),
          });
        }
      } catch (e: any) {
        errors.push(`instagram: ${e?.message || String(e)}`);
      }
    }

    let upserted = 0;
    for (let i = 0; i < rows.length; i += 100) {
      const chunk = rows.slice(i, i + 100);
      const { error } = await supabase
        .from("influencer_posts")
        .upsert(chunk, { onConflict: "campaign_slug,platform,external_id" });
      if (error) throw new Error(`upsert: ${error.message}`);
      upserted += chunk.length;
    }

    return new Response(
      JSON.stringify({ ok: true, hashtags, found: rows.length, upserted, errors }),
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

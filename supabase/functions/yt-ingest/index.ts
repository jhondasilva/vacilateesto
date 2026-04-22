// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const CHANNEL_HANDLE = "Vacilateestopodcast";
const EMBEDDING_MODEL = "google/text-embedding-004";
const EMBEDDING_DIMS = 1536;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// Parse ISO 8601 duration (e.g. PT1H2M3S) to seconds
function isoDurationToSeconds(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  const h = parseInt(m[1] || "0", 10);
  const min = parseInt(m[2] || "0", 10);
  const s = parseInt(m[3] || "0", 10);
  return h * 3600 + min * 60 + s;
}

async function getUploadsPlaylistId(): Promise<string> {
  const tryUrls = [
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=@${CHANNEL_HANDLE}&key=${YOUTUBE_API_KEY}`,
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${CHANNEL_HANDLE}&key=${YOUTUBE_API_KEY}`,
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(CHANNEL_HANDLE)}&maxResults=1&key=${YOUTUBE_API_KEY}`,
  ];
  for (let i = 0; i < tryUrls.length; i++) {
    const r = await fetch(tryUrls[i]);
    const j = await r.json();
    console.log(`channels attempt ${i}:`, r.status, JSON.stringify(j).slice(0, 300));
    if (!r.ok) continue;
    let id = j.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!id && j.items?.[0]?.id?.channelId) {
      // search returned a channelId — fetch its uploads playlist
      const channelId = j.items[0].id.channelId;
      const r2 = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${YOUTUBE_API_KEY}`,
      );
      const j2 = await r2.json();
      id = j2.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    }
    if (id) return id;
  }
  throw new Error("uploads playlist not found for channel");
}

async function listAllVideoIds(playlistId: string, max = 1000): Promise<string[]> {
  const ids: string[] = [];
  let pageToken: string | undefined;
  while (ids.length < max) {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}${
      pageToken ? `&pageToken=${pageToken}` : ""
    }`;
    const r = await fetch(url);
    const j = await r.json();
    if (!r.ok) throw new Error(`playlistItems.list failed: ${JSON.stringify(j)}`);
    for (const it of j.items || []) {
      const vid = it.contentDetails?.videoId;
      if (vid) ids.push(vid);
    }
    pageToken = j.nextPageToken;
    if (!pageToken) break;
  }
  return ids;
}

async function fetchVideoDetails(videoIds: string[]): Promise<any[]> {
  const out: any[] = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${batch.join(",")}&key=${YOUTUBE_API_KEY}`;
    const r = await fetch(url);
    const j = await r.json();
    if (!r.ok) throw new Error(`videos.list failed: ${JSON.stringify(j)}`);
    out.push(...(j.items || []));
  }
  return out;
}

// Transcripts are produced by the local Python worker (scripts/youtube-search/ingest.py),
// which uses Lovable AI Gemini to transcribe the audio and uploads chunks directly to the DB.
// This edge function only refreshes catalog metadata.

async function logIngest(
  videoId: string | null,
  status: string,
  message: string,
  metadata: any = {},
) {
  await supabase.from("yt_ingest_log").insert({
    video_id: videoId,
    status,
    message,
    metadata,
  });
}

async function processVideo(v: any, kind: "podcast" | "short"): Promise<string> {
  const videoId = v.id;
  const title = v.snippet?.title || "(sin título)";
  const description = v.snippet?.description || "";
  const publishedAt = v.snippet?.publishedAt;
  const thumb =
    v.snippet?.thumbnails?.maxres?.url ||
    v.snippet?.thumbnails?.high?.url ||
    v.snippet?.thumbnails?.default?.url;
  const duration = isoDurationToSeconds(v.contentDetails?.duration || "PT0S");
  const views = parseInt(v.statistics?.viewCount || "0", 10);

  // Upsert video metadata
  const { error: upErr } = await supabase
    .from("yt_videos")
    .upsert(
      {
        video_id: videoId,
        title,
        description,
        published_at: publishedAt,
        duration_seconds: duration,
        thumbnail_url: thumb,
        kind,
        view_count: views,
      },
      { onConflict: "video_id" },
    );
  if (upErr) throw upErr;

  // Catalog only — transcription is handled by the local Python worker.
  await logIngest(videoId, "catalog_updated", `${kind} metadata refreshed`);
  return "catalog updated";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    if (!YOUTUBE_API_KEY) throw new Error("YOUTUBE_API_KEY missing");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const body = await req.json().catch(() => ({}));
    const limit = Math.min(parseInt(body.limit || "10", 10), 50);
    const includeShorts = body.includeShorts !== false;
    const onlyNew = body.onlyNew !== false;

    const playlistId = await getUploadsPlaylistId();
    const allIds = await listAllVideoIds(playlistId, 1000);
    console.log(`playlist ${playlistId} → ${allIds.length} ids`);

    let toFetch = allIds;
    if (onlyNew) {
      const { data: existing } = await supabase
        .from("yt_videos")
        .select("video_id, indexed_at");
      const indexedSet = new Set(
        (existing || []).filter((v: any) => v.indexed_at).map((v: any) => v.video_id),
      );
      toFetch = allIds.filter((id) => !indexedSet.has(id));
    }
    toFetch = toFetch.slice(0, limit);

    if (toFetch.length === 0) {
      return new Response(
        JSON.stringify({ ok: true, processed: 0, message: "nothing new" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const details = await fetchVideoDetails(toFetch);
    console.log(`details fetched: ${details.length}, toFetch: ${toFetch.length}`);
    const results: any[] = [];
    for (const v of details) {
      const dur = isoDurationToSeconds(v.contentDetails?.duration || "PT0S");
      const kind: "podcast" | "short" = dur > 0 && dur <= 180 ? "short" : "podcast";
      console.log(`video ${v.id} duration=${dur}s kind=${kind}`);
      if (kind === "short" && !includeShorts) continue;
      try {
        const msg = await processVideo(v, kind);
        results.push({ video_id: v.id, kind, result: msg });
      } catch (e: any) {
        const errMsg = e?.message || String(e);
        await logIngest(v.id, "error", errMsg);
        results.push({ video_id: v.id, kind, error: errMsg });
      }
    }

    return new Response(
      JSON.stringify({ ok: true, processed: results.length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e: any) {
    console.error("yt-ingest fatal", e);
    return new Response(
      JSON.stringify({ ok: false, error: e?.message || String(e) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
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
const CHUNK_SECONDS = 60;
const CHUNK_OVERLAP_SECONDS = 10;

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

// Try to fetch transcript from YouTube's timedtext endpoint (auto-generated captions)
async function fetchTranscript(
  videoId: string,
): Promise<Array<{ start: number; dur: number; text: string }> | null> {
  // First, get the watch page to discover available caption tracks
  try {
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}&hl=es`;
    const watchRes = await fetch(watchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
      },
    });
    const html = await watchRes.text();
    const m = html.match(/"captionTracks":(\[.*?\])/);
    if (!m) return null;
    const tracks = JSON.parse(m[1]);
    // Prefer Spanish, fallback to first
    const track =
      tracks.find((t: any) => /^es/i.test(t.languageCode)) || tracks[0];
    if (!track?.baseUrl) return null;
    const ttUrl = track.baseUrl + "&fmt=json3";
    const ttRes = await fetch(ttUrl);
    if (!ttRes.ok) return null;
    const tt = await ttRes.json();
    const events = (tt.events || []).filter((e: any) => e.segs);
    return events.map((e: any) => ({
      start: (e.tStartMs || 0) / 1000,
      dur: (e.dDurationMs || 0) / 1000,
      text: (e.segs || []).map((s: any) => s.utf8 || "").join("").replace(/\n/g, " ").trim(),
    })).filter((c: any) => c.text);
  } catch (e) {
    console.error("transcript fetch error", videoId, e);
    return null;
  }
}

// Group transcript cues into ~60s chunks with 10s overlap
function chunkTranscript(
  cues: Array<{ start: number; dur: number; text: string }>,
) {
  const chunks: Array<{ start: number; end: number; text: string }> = [];
  if (cues.length === 0) return chunks;
  const totalEnd = cues[cues.length - 1].start + cues[cues.length - 1].dur;
  let windowStart = 0;
  while (windowStart < totalEnd) {
    const windowEnd = windowStart + CHUNK_SECONDS;
    const inWin = cues.filter(
      (c) => c.start + c.dur > windowStart && c.start < windowEnd,
    );
    if (inWin.length > 0) {
      const text = inWin.map((c) => c.text).join(" ").replace(/\s+/g, " ").trim();
      if (text.length > 20) {
        chunks.push({
          start: Math.max(windowStart, inWin[0].start),
          end: Math.min(windowEnd, inWin[inWin.length - 1].start + inWin[inWin.length - 1].dur),
          text,
        });
      }
    }
    windowStart += CHUNK_SECONDS - CHUNK_OVERLAP_SECONDS;
  }
  return chunks;
}

async function embedTexts(texts: string[]): Promise<number[][]> {
  // Lovable AI embeddings — request 1536 dims to match our column
  const r = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: texts,
      dimensions: EMBEDDING_DIMS,
    }),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`embeddings failed [${r.status}]: ${t}`);
  }
  const j = await r.json();
  return j.data.map((d: any) => d.embedding);
}

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

  // Skip if already indexed
  const { data: existing } = await supabase
    .from("yt_videos")
    .select("indexed_at")
    .eq("video_id", videoId)
    .maybeSingle();
  if (existing?.indexed_at) return "skipped (already indexed)";

  // Fetch transcript
  const cues = await fetchTranscript(videoId);
  if (!cues || cues.length === 0) {
    await logIngest(videoId, "no_transcript", "no captions available");
    return "no transcript";
  }

  const chunks = chunkTranscript(cues);
  if (chunks.length === 0) {
    await logIngest(videoId, "empty_chunks", "transcript yielded no chunks");
    return "no chunks";
  }

  // Embed in batches of 50
  const rows: any[] = [];
  for (let i = 0; i < chunks.length; i += 50) {
    const slice = chunks.slice(i, i + 50);
    const embeddings = await embedTexts(slice.map((c) => c.text));
    slice.forEach((c, idx) => {
      rows.push({
        video_id: videoId,
        chunk_index: i + idx,
        start_seconds: c.start,
        end_seconds: c.end,
        text: c.text,
        embedding: embeddings[idx] as any,
      });
    });
  }

  // Replace any prior chunks for this video
  await supabase.from("yt_transcript_chunks").delete().eq("video_id", videoId);
  const { error: insErr } = await supabase
    .from("yt_transcript_chunks")
    .insert(rows);
  if (insErr) throw insErr;

  await supabase
    .from("yt_videos")
    .update({ indexed_at: new Date().toISOString() })
    .eq("video_id", videoId);

  await logIngest(videoId, "indexed", `${rows.length} chunks`);
  return `indexed ${rows.length} chunks`;
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
    const results: any[] = [];
    for (const v of details) {
      const dur = isoDurationToSeconds(v.contentDetails?.duration || "PT0S");
      const kind: "podcast" | "short" = dur > 0 && dur <= 180 ? "short" : "podcast";
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
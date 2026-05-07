const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// In-memory cache shared across requests within the same isolate.
// Keeps results for 12h to drastically reduce calls to the YouTube API.
type Stat = { views: number; likes: number; comments: number; title?: string };
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12h
const cache = new Map<string, { value: Stat; expiresAt: number }>();
const VIDEO_ID_RE = /^[a-zA-Z0-9_-]{6,15}$/;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { videoIds } = await req.json();
    if (!Array.isArray(videoIds) || videoIds.length === 0) {
      return new Response(JSON.stringify({ stats: {} }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("YOUTUBE_API_KEY");
    if (!apiKey) throw new Error("YOUTUBE_API_KEY not configured");

    // Normalize, validate y dedupe estricto.
    const normalized = (videoIds as unknown[])
      .filter((v): v is string => typeof v === "string")
      .map((v) => v.trim())
      .filter((v) => VIDEO_ID_RE.test(v));
    const unique = Array.from(new Set(normalized));

    const stats: Record<string, Stat> = {};
    const now = Date.now();
    const toFetch: string[] = [];

    // 1) Sirve desde cache lo posible
    for (const id of unique) {
      const hit = cache.get(id);
      if (hit && hit.expiresAt > now) {
        stats[id] = hit.value;
      } else {
        toFetch.push(id);
      }
    }

    // 2) Solo va a la API por los que faltan, en chunks de 50
    const chunks: string[][] = [];
    for (let i = 0; i < toFetch.length; i += 50) chunks.push(toFetch.slice(i, i + 50));

    for (const chunk of chunks) {
      const url = new URL("https://www.googleapis.com/youtube/v3/videos");
      url.searchParams.set("part", "statistics,snippet");
      url.searchParams.set("id", chunk.join(","));
      url.searchParams.set("key", apiKey);

      const res = await fetch(url.toString());
      if (!res.ok) {
        const txt = await res.text();
        console.error("YouTube API error:", res.status, txt);
        continue;
      }
      const data = await res.json();
      for (const item of data.items ?? []) {
        const value: Stat = {
          views: Number(item.statistics?.viewCount ?? 0),
          likes: Number(item.statistics?.likeCount ?? 0),
          comments: Number(item.statistics?.commentCount ?? 0),
          title: item.snippet?.title,
        };
        stats[item.id] = value;
        cache.set(item.id, { value, expiresAt: now + CACHE_TTL_MS });
      }
    }

    const cacheHits = unique.length - toFetch.length;
    console.log(`youtube-stats: req=${unique.length} cache=${cacheHits} fetched=${toFetch.length} api_calls=${chunks.length}`);

    return new Response(JSON.stringify({ stats }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        // Cache HTTP: 12h fresh + 24h stale-while-revalidate
        "Cache-Control": "public, max-age=43200, stale-while-revalidate=86400",
      },
    });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
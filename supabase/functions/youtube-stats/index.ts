const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    // Dedupe + chunk de 50 (límite de la API)
    const unique = Array.from(new Set(videoIds.filter((v: any) => typeof v === "string" && v.length > 0)));
    const chunks: string[][] = [];
    for (let i = 0; i < unique.length; i += 50) chunks.push(unique.slice(i, i + 50));

    const stats: Record<string, { views: number; likes: number; comments: number; title?: string }> = {};

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
        stats[item.id] = {
          views: Number(item.statistics?.viewCount ?? 0),
          likes: Number(item.statistics?.likeCount ?? 0),
          comments: Number(item.statistics?.commentCount ?? 0),
          title: item.snippet?.title,
        };
      }
    }

    return new Response(JSON.stringify({ stats }), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=21600" },
    });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
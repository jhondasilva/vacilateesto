import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE = "https://www.vacilateesto.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const url = new URL(req.url);
    const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "200"), 500);
    const kind = url.searchParams.get("kind"); // 'podcast' | 'short' | null

    let q = supabase
      .from("yt_videos")
      .select("video_id, title, description, thumbnail_url, published_at, duration_seconds, kind, view_count")
      .order("published_at", { ascending: false })
      .limit(limit);
    if (kind) q = q.eq("kind", kind);

    const { data: videos, error } = await q;
    if (error) throw error;

    const items = (videos ?? []).map((v, idx) => ({
      "@type": "PodcastEpisode",
      position: idx + 1,
      name: v.title,
      description: (v.description ?? "").slice(0, 500),
      url: `${SITE}/buscador?v=${v.video_id}`,
      datePublished: v.published_at,
      duration: v.duration_seconds ? `PT${v.duration_seconds}S` : undefined,
      thumbnailUrl: v.thumbnail_url,
      contentUrl: `https://www.youtube.com/watch?v=${v.video_id}`,
      embedUrl: `https://www.youtube.com/embed/${v.video_id}`,
      interactionStatistic: v.view_count
        ? {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/WatchAction",
            userInteractionCount: v.view_count,
          }
        : undefined,
      partOfSeries: {
        "@type": "PodcastSeries",
        name: v.kind === "short" ? "Vacílate Esto Shorts" : "Vacílate Esto",
        url: SITE,
      },
    }));

    const payload = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Catálogo de episodios de Vacílate Esto",
      description: "Listado completo de episodios y shorts del podcast venezolano Vacílate Esto, incluyendo Podcast en la Cumbre, El Podcast Eterno y Pelotica de Goma.",
      url: `${SITE}/buscador`,
      numberOfItems: items.length,
      itemListElement: items,
    };

    return new Response(JSON.stringify(payload, null, 2), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/ld+json; charset=utf-8",
        "Cache-Control": "public, max-age=1800, s-maxage=1800",
      },
    });
  } catch (e) {
    console.error("episodes-feed error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
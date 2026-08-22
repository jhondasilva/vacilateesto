import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE = "https://www.vacilateesto.com";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Solo podcasts (los shorts saturarían el sitemap; Google ya los indexa por YouTube)
    const { data: videos, error } = await supabase
      .from("yt_videos")
      .select("video_id, title, description, thumbnail_url, published_at, duration_seconds")
      .eq("kind", "podcast")
      .eq("is_available", true)
      .order("published_at", { ascending: false })
      .limit(1000);

    if (error) throw error;

    const today = new Date().toISOString().split("T")[0];

    const staticUrls = [
      { loc: `${SITE}/`, priority: "1.0", changefreq: "daily" },
      { loc: `${SITE}/buscador`, priority: "0.9", changefreq: "daily" },
      { loc: `${SITE}/vacilate-el-futbol`, priority: "0.95", changefreq: "daily" },
      { loc: `${SITE}/mejores-podcasts-venezuela`, priority: "0.95", changefreq: "weekly" },
      { loc: `${SITE}/podcasts-venezolanos-comedia`, priority: "0.85", changefreq: "monthly" },
      { loc: `${SITE}/podcasts-venezolanos-futbol`, priority: "0.85", changefreq: "monthly" },
      { loc: `${SITE}/podcasts-venezolanos-spotify`, priority: "0.85", changefreq: "monthly" },
      { loc: `${SITE}/media-kit`, priority: "0.7", changefreq: "monthly" },
      { loc: `${SITE}/podcast-en-la-cumbre`, priority: "0.8", changefreq: "weekly" },
      { loc: `${SITE}/podcast-eterno`, priority: "0.8", changefreq: "monthly" },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n`;

    for (const u of staticUrls) {
      xml += `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>\n`;
    }

    for (const v of videos ?? []) {
      const pageUrl = `${SITE}/buscador?v=${v.video_id}`;
      const ytUrl = `https://www.youtube.com/watch?v=${v.video_id}`;
      const lastmod = v.published_at
        ? new Date(v.published_at).toISOString().split("T")[0]
        : today;
      const title = escapeXml((v.title ?? "").slice(0, 100));
      const desc = escapeXml((v.description ?? v.title ?? "Episodio de Vacílate Esto").slice(0, 2000));
      const thumb = escapeXml(v.thumbnail_url ?? `https://i.ytimg.com/vi/${v.video_id}/hqdefault.jpg`);

      xml += `  <url>\n`;
      xml += `    <loc>${pageUrl}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `    <video:video>\n`;
      xml += `      <video:thumbnail_loc>${thumb}</video:thumbnail_loc>\n`;
      xml += `      <video:title>${title}</video:title>\n`;
      xml += `      <video:description>${desc}</video:description>\n`;
      xml += `      <video:player_loc allow_embed="yes">https://www.youtube.com/embed/${v.video_id}</video:player_loc>\n`;
      xml += `      <video:content_loc>${ytUrl}</video:content_loc>\n`;
      if (v.duration_seconds) xml += `      <video:duration>${v.duration_seconds}</video:duration>\n`;
      if (v.published_at) xml += `      <video:publication_date>${new Date(v.published_at).toISOString()}</video:publication_date>\n`;
      xml += `      <video:family_friendly>yes</video:family_friendly>\n`;
      xml += `      <video:live>no</video:live>\n`;
      xml += `    </video:video>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>\n`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (e) {
    console.error("sitemap-videos error:", e);
    return new Response(`<!-- error: ${e instanceof Error ? e.message : "unknown"} -->`, {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/xml" },
    });
  }
});
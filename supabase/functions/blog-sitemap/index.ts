import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE = "https://www.vacilateesto.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, published_at, updated_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(5000);

  if (error) {
    return new Response(`<!-- error: ${error.message} -->`, {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8" },
    });
  }

  const urls = (data ?? [])
    .map(
      (p: any) => `  <url>
    <loc>${SITE}/blog/${p.slug}</loc>
    <lastmod>${(p.updated_at || p.published_at).slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
});
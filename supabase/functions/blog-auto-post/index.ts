import { createClient } from "npm:@supabase/supabase-js@2";
import { generateText } from "npm:ai";
import { createLovableAiGatewayProvider } from "../_shared/ai-gateway.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rotación temática — el cron escoge el índice por (epoch_week + day) % themes.length
const THEMES = [
  { key: "humor-venezolano", label: "Humor venezolano", query: "chiste risa broma humor pana vacile", category: "Humor" },
  { key: "comida-criolla", label: "Comida criolla", query: "arepa hallaca pabellón cachapa empanada perro caliente comida", category: "Gastronomía" },
  { key: "musica-venezuela", label: "Música venezolana", query: "música canción gaita salsa joropo merengue arpa cuatro", category: "Cultura" },
  { key: "futbol-vinotinto", label: "Fútbol y Vinotinto", query: "vinotinto fútbol mundial selección gol partido bocha", category: "Deporte" },
  { key: "nostalgia-90s", label: "Nostalgia venezolana", query: "infancia colegio caracas años 90 marcas recuerdo", category: "Cultura" },
  { key: "caracas-vida", label: "Caracas y vida urbana", query: "caracas autopista metro avenida cola tráfico ciudad", category: "Cultura" },
  { key: "anecdotas-podcast", label: "Anécdotas del podcast", query: "anécdota historia juan jhon invitado pasó increíble", category: "Detrás de cámaras" },
  { key: "frases-jergas", label: "Jergas y frases", query: "chévere pana coño marico vaina arrecho jerga venezolana", category: "Cultura" },
  { key: "viajes-gira", label: "Gira y viajes", query: "viaje país ciudad gira tour avión hotel", category: "Vacílate El Mundial" },
  { key: "cultura-pop", label: "Cultura pop", query: "película serie netflix actor reality programa televisión", category: "Cultura pop" },
];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function pickTheme(): typeof THEMES[number] {
  const ms = Date.now();
  const day = Math.floor(ms / 86_400_000);
  return THEMES[day % THEMES.length];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // Permitir override de tema vía body para testing
    let body: { theme?: string; force?: boolean } = {};
    try { body = await req.json(); } catch { /* empty body OK */ }

    const theme = body.theme
      ? THEMES.find((t) => t.key === body.theme) ?? pickTheme()
      : pickTheme();

    // Buscar chunks: intentar cada keyword del tema hasta encontrar resultados.
    // Usamos FTS palabra por palabra (OR semántico) para maximizar coincidencias.
    const keywords = theme.query.split(/\s+/).filter(Boolean);
    let chunks: any[] = [];
    for (const kw of keywords) {
      const { data, error } = await supabase.rpc("yt_search_chunks_fts", {
        query_text: kw,
        filter_kind: "podcast",
        match_count: 10,
      });
      if (error) throw error;
      if (data && data.length) {
        chunks.push(...data);
      }
      if (chunks.length >= 20) break;
    }
    // Deduplicar chunks por id
    const seen = new Set<string>();
    chunks = chunks.filter((c: any) => {
      if (seen.has(c.chunk_id)) return false;
      seen.add(c.chunk_id);
      return true;
    });

    if (!chunks || chunks.length === 0) {
      return new Response(JSON.stringify({ skipped: true, reason: "no chunks", theme: theme.key }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Agrupar por video (top 5)
    const byVideo = new Map<string, any>();
    for (const c of chunks as any[]) {
      if (!byVideo.has(c.video_id)) byVideo.set(c.video_id, { ...c, snippets: [] });
      byVideo.get(c.video_id).snippets.push({
        t: Math.floor(c.start_seconds),
        text: c.text,
      });
    }
    const topVideos = Array.from(byVideo.values()).slice(0, 5);

    // Construir contexto compacto para el modelo
    const sourceContext = topVideos.map((v: any) => ({
      video_id: v.video_id,
      title: v.title,
      published_at: v.published_at,
      snippets: v.snippets.slice(0, 4).map((s: any) => `[${s.t}s] ${s.text}`),
    }));

    const sourceVideoIds = topVideos.map((v: any) => v.video_id);

    const gateway = createLovableAiGatewayProvider(LOVABLE_API_KEY);

    const prompt = `Eres redactor SEO de Vacílate Esto (podcast venezolano #1 con JuanSofa y JhonSnacks).
Tema de hoy: "${theme.label}".
Usa los siguientes fragmentos transcritos REALES de episodios para escribir un artículo de blog en español venezolano, natural, divertido y SEO-friendly.

FUENTES (no inventes datos, cita momentos cuando sea útil):
${JSON.stringify(sourceContext, null, 2)}

Devuelve SOLO un objeto JSON válido con esta forma exacta (sin markdown, sin \`\`\`):
{
  "slug": "kebab-case-corto-con-keyword",
  "title": "Título SEO con keyword <60 chars",
  "h1": "H1 visible atractivo",
  "description": "Meta description <160 chars",
  "keywords": "5-8 keywords separadas por comas",
  "category": "${theme.category}",
  "tags": ["tag1","tag2","tag3","tag4"],
  "reading_minutes": 6,
  "body_md": "Markdown completo del artículo (1000-1500 palabras). Usa ## para subtítulos, listas, negritas. Incluye 2-3 secciones que conecten con momentos específicos de los episodios usando enlaces tipo: [ver momento](https://www.youtube.com/watch?v=VIDEO_ID&t=SECONDSs). Cierra con CTA al buscador (/buscador) y a YouTube/Spotify.",
  "faq": [{"question":"...","answer":"..."},{"question":"...","answer":"..."},{"question":"...","answer":"..."}]
}`;

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      prompt,
    });

    // Extraer JSON robustamente
    const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Model did not return JSON");
    const article = JSON.parse(jsonMatch[0]);

    // Asegurar slug único
    let slug = slugify(article.slug || article.h1 || article.title);
    if (!slug) slug = `${theme.key}-${Date.now()}`;
    const { data: existing } = await supabase.from("blog_posts").select("id").eq("slug", slug).maybeSingle();
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const row = {
      slug,
      title: String(article.title).slice(0, 160),
      h1: String(article.h1).slice(0, 200),
      description: String(article.description).slice(0, 200),
      keywords: String(article.keywords || ""),
      category: String(article.category || theme.category),
      tags: Array.isArray(article.tags) ? article.tags.slice(0, 8).map(String) : [],
      body_md: String(article.body_md || ""),
      faq: Array.isArray(article.faq) ? article.faq : [],
      source_video_ids: sourceVideoIds,
      theme_key: theme.key,
      reading_minutes: Number(article.reading_minutes) || 6,
      status: "published",
      published_at: new Date().toISOString(),
    };

    const { data: inserted, error: insertErr } = await supabase
      .from("blog_posts")
      .insert(row)
      .select("id, slug")
      .single();
    if (insertErr) throw insertErr;

    return new Response(
      JSON.stringify({ success: true, post: inserted, theme: theme.key, source_video_ids: sourceVideoIds }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("blog-auto-post error", e);
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
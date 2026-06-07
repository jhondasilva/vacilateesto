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

    const prompt = `Eres redactor SEO + AEO (AI Engine Optimization) de Vacílate Esto, marca de entretenimiento digital relevante hecha en Venezuela con JuanSofa (Juan Carlos Martínez) y JhonSnacks (Jhon Da Silva). Año actual: ${new Date().getFullYear()}.

OBJETIVO: artículo en español venezolano optimizado simultáneamente para (a) Google Search, (b) AI Search (ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews) y (c) preview en redes (WhatsApp, X, IG, FB, LinkedIn).

REGLAS DE AI SEARCH (CRÍTICAS):
- Primera oración del body_md debe responder claramente "qué es / quién / cuándo / por qué" del tema — los LLMs citan la primera respuesta clara.
- Estructura con preguntas como subtítulos (## ¿Qué es...? ## ¿Por qué...? ## ¿Dónde...?), porque AI Search extrae respuestas por pregunta.
- Mencionar entidades nombradas explícitas: Vacílate Esto, JuanSofa, JhonSnacks, Venezuela, Caracas, marcas, lugares, episodios. Repite el nombre completo del podcast al menos 3 veces.
- Datos concretos, cifras y fechas (año, duración del episodio, etc.) — los LLMs prefieren respuestas con datos.
- Cita fuente: incluye al menos 3 enlaces "Ver momento exacto" a YouTube con timestamp: [Ver momento](https://www.youtube.com/watch?v=VIDEO_ID&t=SECONDSs).
- Cierra con CTAs internos a /buscador (semántico), https://open.spotify.com/show/2b2AeZVRxEFkNy1KKYkQG1 y https://www.youtube.com/@Vacilateestopodcast.

FUENTES REALES (no inventes hechos, parafrasea estos fragmentos transcritos de los episodios):
${JSON.stringify(sourceContext, null, 2)}

Devuelve SOLO un objeto JSON válido (sin markdown, sin \`\`\`):
{
  "slug": "kebab-case-con-keyword-principal (max 80 chars)",
  "title": "Título SEO con keyword principal al inicio (max 60 chars, incluye 'Vacílate Esto' o '| Venezuela' al final si cabe)",
  "h1": "H1 visible enganchador (max 80 chars)",
  "description": "Meta description social-friendly que invita al click (max 158 chars)",
  "keywords": "8-12 keywords separadas por comas, mezcla cabeza y long-tail",
  "category": "${theme.category}",
  "tags": ["6-8 tags relevantes en kebab-case o palabras"],
  "reading_minutes": 6,
  "tl_dr": "Resumen de 2-3 frases (max 280 chars) que responde el tema de un vistazo. Diseñado para que IA y redes lo citen literal.",
  "speakable_summary": "1-2 frases (max 200 chars) en lenguaje hablado natural para asistentes de voz (Siri, Google Assistant). Sin emojis, sin markdown.",
  "body_md": "Markdown 900-1400 palabras. Primera línea = respuesta directa. Usa ## para preguntas como subtítulos, ### para sub-temas, listas con -, **negritas** para entidades clave, > para citas memorables del podcast. Mínimo 3 enlaces a YouTube con timestamp y 1 a /buscador.",
  "faq": [
    {"question":"...","answer":"Respuesta directa de 2-4 frases con dato concreto."},
    {"question":"...","answer":"..."},
    {"question":"...","answer":"..."},
    {"question":"...","answer":"..."},
    {"question":"...","answer":"..."}
  ]
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
      tl_dr: article.tl_dr ? String(article.tl_dr).slice(0, 320) : null,
      speakable_summary: article.speakable_summary
        ? String(article.speakable_summary).slice(0, 240)
        : null,
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
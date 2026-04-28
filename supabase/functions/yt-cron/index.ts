// deno-lint-ignore-file no-explicit-any
// Cron job: refresca catálogo de YouTube cada día (metadata: títulos, thumbs, fechas).
// La transcripción real (audio → chunks) la sigue haciendo el worker Python local
// (`scripts/youtube-search/ingest.py`) porque requiere yt-dlp + ffmpeg.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    // Llamamos a yt-ingest con onlyNew=true y un límite alto para cubrir todo lo nuevo
    const r = await fetch(`${SUPABASE_URL}/functions/v1/yt-ingest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ limit: 50, onlyNew: false, includeShorts: true }),
    });
    const data = await r.json();
    console.log("yt-cron → yt-ingest:", JSON.stringify(data).slice(0, 500));

    return new Response(
      JSON.stringify({ ok: true, ranAt: new Date().toISOString(), ingest: data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e: any) {
    console.error("yt-cron error", e);
    return new Response(
      JSON.stringify({ ok: false, error: e?.message || String(e) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
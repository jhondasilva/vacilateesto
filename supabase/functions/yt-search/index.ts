// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const EMBEDDING_MODEL = "google/text-embedding-004";
const EMBEDDING_DIMS = 1536;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function embedQuery(text: string): Promise<number[]> {
  const r = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
      dimensions: EMBEDDING_DIMS,
    }),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`embed query failed [${r.status}]: ${t}`);
  }
  const j = await r.json();
  return j.data[0].embedding;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const { query, kind, limit } = await req.json();
    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return new Response(
        JSON.stringify({ ok: false, error: "query required (min 2 chars)" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const embedding = await embedQuery(query.trim());
    const matchCount = Math.min(parseInt(limit || "20", 10), 50);

    const { data, error } = await supabase.rpc("yt_search_chunks", {
      query_embedding: embedding as any,
      match_count: matchCount,
      filter_kind: kind === "podcast" || kind === "short" ? kind : null,
    });
    if (error) throw error;

    // Group by video, keep top chunk per video
    const byVideo = new Map<string, any>();
    for (const row of data || []) {
      if (!byVideo.has(row.video_id)) {
        byVideo.set(row.video_id, { ...row, chunks: [row] });
      } else {
        byVideo.get(row.video_id).chunks.push(row);
      }
    }
    const results = Array.from(byVideo.values())
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 12);

    return new Response(
      JSON.stringify({ ok: true, query, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e: any) {
    console.error("yt-search error", e);
    const status = /rate|429/i.test(e?.message || "")
      ? 429
      : /402|payment/i.test(e?.message || "")
      ? 402
      : 500;
    return new Response(
      JSON.stringify({ ok: false, error: e?.message || String(e) }),
      {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
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

const RERANK_MODEL = "google/gemini-2.5-flash-lite";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

/** Race a promise against a hard timeout; returns fallback if it loses. */
function withTimeout<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((resolve) =>
      setTimeout(() => {
        console.warn(`withTimeout: hit ${ms}ms, using fallback`);
        resolve(fallback);
      }, ms),
    ),
  ]);
}

/**
 * Expand a natural-language query into a few keyword variants in Spanish
 * (so Postgres FTS catches synonyms / declensions). Falls back to the
 * original query if the AI call fails.
 */
async function expandQuery(query: string): Promise<string[]> {
  try {
    const r = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        signal: AbortSignal.timeout(8000),
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: RERANK_MODEL,
          messages: [
            {
              role: "system",
              content:
                "Devuelves variantes de búsqueda en español venezolano para encontrar contenido en transcripciones de podcasts. Incluye sinónimos, modismos y palabras relacionadas. Solo usa la herramienta.",
            },
            { role: "user", content: query },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "search_variants",
                description:
                  "Devuelve 3-5 variantes de búsqueda cortas (1-4 palabras cada una)",
                parameters: {
                  type: "object",
                  properties: {
                    variants: {
                      type: "array",
                      items: { type: "string" },
                      minItems: 1,
                      maxItems: 5,
                    },
                  },
                  required: ["variants"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "search_variants" },
          },
        }),
      },
    );
    if (!r.ok) return [query];
    const j = await r.json();
    const args =
      j?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) return [query];
    const parsed = JSON.parse(args);
    const variants: string[] = Array.isArray(parsed?.variants)
      ? parsed.variants.filter((v: any) => typeof v === "string" && v.trim())
      : [];
    const all = [query, ...variants];
    return Array.from(new Set(all.map((s) => s.trim().toLowerCase())));
  } catch (e) {
    console.error("expandQuery failed", e);
    return [query];
  }
}

/**
 * Re-rank a candidate set with Gemini: returns chunk_ids ordered by
 * relevance to the query. Falls back to FTS rank if AI call fails.
 */
async function rerank(
  query: string,
  candidates: { chunk_id: string; text: string; title: string }[],
): Promise<string[]> {
  if (candidates.length === 0) return [];
  if (candidates.length === 1) return [candidates[0].chunk_id];
  try {
    const list = candidates
      .map(
        (c, i) =>
          `[${i}] (${c.title.slice(0, 60)}) ${c.text.slice(0, 280)}`,
      )
      .join("\n");
    const r = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        signal: AbortSignal.timeout(15000),
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: RERANK_MODEL,
          messages: [
            {
              role: "system",
              content:
                "Reordenas fragmentos de transcripción según relevancia a una consulta. Devuelves SOLO los índices más relevantes en orden, usando la herramienta.",
            },
            {
              role: "user",
              content: `Consulta: "${query}"\n\nFragmentos:\n${list}`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "rank_results",
                description:
                  "Devuelve los índices de los fragmentos ordenados de más a menos relevante",
                parameters: {
                  type: "object",
                  properties: {
                    order: {
                      type: "array",
                      items: { type: "integer" },
                    },
                  },
                  required: ["order"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "rank_results" },
          },
        }),
      },
    );
    if (!r.ok) return candidates.map((c) => c.chunk_id);
    const j = await r.json();
    const args =
      j?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) return candidates.map((c) => c.chunk_id);
    const parsed = JSON.parse(args);
    const order: number[] = Array.isArray(parsed?.order) ? parsed.order : [];
    const seen = new Set<number>();
    const ids: string[] = [];
    for (const i of order) {
      if (
        Number.isInteger(i) &&
        i >= 0 &&
        i < candidates.length &&
        !seen.has(i)
      ) {
        seen.add(i);
        ids.push(candidates[i].chunk_id);
      }
    }
    // append any missing candidates at the end
    for (let i = 0; i < candidates.length; i++) {
      if (!seen.has(i)) ids.push(candidates[i].chunk_id);
    }
    return ids;
  } catch (e) {
    console.error("rerank failed", e);
    return candidates.map((c) => c.chunk_id);
  }
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

    const cleanQuery = query.trim();
    const matchCount = Math.min(parseInt(limit || "30", 10), 60);
    const filterKind =
      kind === "podcast" || kind === "short" ? kind : null;

    // 1. Expand the query with Gemini → multiple FTS searches
    //    Hard cap at 6s so a hanging gateway can't kill the whole request.
    const variants = await withTimeout(expandQuery(cleanQuery), 6000, [cleanQuery]);
    const seenChunks = new Map<string, any>();
    const ftsResults = await Promise.all(
      variants.map((v) =>
        supabase.rpc("yt_search_chunks_fts", {
          query_text: v,
          match_count: matchCount,
          filter_kind: filterKind,
        }),
      ),
    );
    ftsResults.forEach(({ data, error }, i) => {
      if (error) {
        console.error("FTS error for variant", variants[i], error);
        return;
      }
      for (const row of data || []) {
        const existing = seenChunks.get(row.chunk_id);
        if (!existing || (row.rank ?? 0) > (existing.rank ?? 0)) {
          seenChunks.set(row.chunk_id, row);
        }
      }
    });

    const candidates = Array.from(seenChunks.values())
      .sort((a, b) => (b.rank ?? 0) - (a.rank ?? 0))
      .slice(0, 30);

    // 2. Re-rank with Gemini for semantic precision (hard cap 12s, fallback to FTS order)
    const fallbackOrder = candidates.map((c) => c.chunk_id);
    const rerankedIds = await withTimeout(
      rerank(
        cleanQuery,
        candidates.map((c) => ({
          chunk_id: c.chunk_id,
          text: c.text,
          title: c.title,
        })),
      ),
      12000,
      fallbackOrder,
    );
    const idToRow = new Map(candidates.map((c) => [c.chunk_id, c]));
    const ordered = rerankedIds
      .map((id) => idToRow.get(id))
      .filter(Boolean) as any[];

    // 3. Group by video, keep top chunk per video
    const byVideo = new Map<string, any>();
    for (const row of ordered) {
      if (!byVideo.has(row.video_id)) {
        byVideo.set(row.video_id, {
          ...row,
          similarity: row.rank ?? 0,
          chunks: [row],
        });
      } else {
        byVideo.get(row.video_id).chunks.push(row);
      }
    }
    const results = Array.from(byVideo.values()).slice(0, 30);

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
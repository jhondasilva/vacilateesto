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

/** Race a promise against a hard timeout; returns fallback if it loses.
 *  Also aborts the underlying fetch via the provided AbortController so the
 *  request doesn't keep the function "busy" past the timeout. */
function withTimeout<T>(
  p: Promise<T>,
  ms: number,
  fallback: T,
  ctrl?: AbortController,
): Promise<T> {
  return Promise.race([
    p.catch(() => fallback),
    new Promise<T>((resolve) =>
      setTimeout(() => {
        console.warn(`withTimeout: hit ${ms}ms, using fallback`);
        try { ctrl?.abort(); } catch (_) { /* noop */ }
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
async function expandQuery(query: string, signal?: AbortSignal): Promise<string[]> {
  try {
    const r = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        signal,
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
  signal?: AbortSignal,
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
        signal,
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
    //    Hard cap at 4s; abort the fetch on timeout so we don't keep it open.
    const expandCtrl = new AbortController();
    const variants = await withTimeout(
      expandQuery(cleanQuery, expandCtrl.signal),
      4000,
      [cleanQuery],
      expandCtrl,
    );
    const groupedResults = await Promise.all(
      variants.map((v) =>
        supabase.rpc("yt_search_chunks_grouped", {
          query_text: v,
          match_count: matchCount,
          filter_kind: filterKind,
          per_video_limit: 8,
        }),
      ),
    );

    // Merge variants by video_id, keeping the union of chunks (deduped) and best rank.
    const byVideo = new Map<string, any>();
    groupedResults.forEach(({ data, error }, i) => {
      if (error) {
        console.error("grouped error for variant", variants[i], error);
        return;
      }
      for (const row of (data || []) as any[]) {
        const existing = byVideo.get(row.video_id);
        if (!existing) {
          byVideo.set(row.video_id, {
            ...row,
            chunks: [...(row.chunks || [])],
          });
        } else {
          existing.best_rank = Math.max(existing.best_rank ?? 0, row.best_rank ?? 0);
          const seen = new Set(existing.chunks.map((c: any) => c.chunk_id));
          for (const c of row.chunks || []) {
            if (!seen.has(c.chunk_id)) {
              existing.chunks.push(c);
              seen.add(c.chunk_id);
            }
          }
        }
      }
    });

    const merged = Array.from(byVideo.values())
      .sort((a, b) => (b.best_rank ?? 0) - (a.best_rank ?? 0))
      .slice(0, 30);

    // Re-rank top videos by their best chunk text using Gemini.
    const topChunks = merged.map((v) => {
      const best = (v.chunks || [])
        .slice()
        .sort((a: any, b: any) => (b.rank ?? 0) - (a.rank ?? 0))[0];
      return {
        chunk_id: v.video_id, // use video_id as the rerank key
        text: best?.text ?? "",
        title: v.title ?? "",
      };
    });
    const fallbackOrder = topChunks.map((c) => c.chunk_id);
    const rerankCtrl = new AbortController();
    const rerankedIds = await withTimeout(
      rerank(cleanQuery, topChunks, rerankCtrl.signal),
      8000,
      fallbackOrder,
      rerankCtrl,
    );
    const idToVideo = new Map(merged.map((v) => [v.video_id, v]));
    const orderedVideos = rerankedIds
      .map((id) => idToVideo.get(id))
      .filter(Boolean) as any[];

    // Shape each result to match the frontend contract (top-level chunk fields + chunks[]).
    const results = orderedVideos.map((v) => {
      const sortedChunks = (v.chunks || [])
        .slice()
        .sort((a: any, b: any) => (b.rank ?? 0) - (a.rank ?? 0));
      const top = sortedChunks[0] || {};
      return {
        chunk_id: top.chunk_id,
        video_id: v.video_id,
        title: v.title,
        kind: v.kind,
        thumbnail_url: v.thumbnail_url,
        published_at: v.published_at,
        start_seconds: top.start_seconds ?? 0,
        end_seconds: top.end_seconds ?? 0,
        text: top.text ?? "",
        similarity: v.best_rank ?? 0,
        match_count_total: v.match_count_total ?? sortedChunks.length,
        chunks: sortedChunks.map((c: any) => ({
          chunk_id: c.chunk_id,
          video_id: v.video_id,
          title: v.title,
          kind: v.kind,
          thumbnail_url: v.thumbnail_url,
          published_at: v.published_at,
          start_seconds: c.start_seconds,
          end_seconds: c.end_seconds,
          text: c.text,
          similarity: c.rank ?? 0,
        })),
      };
    });

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
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "npm:ai";
import { z } from "npm:zod";
import { createLovableAiGatewayProvider } from "../_shared/ai-gateway.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const gateway = createLovableAiGatewayProvider(LOVABLE_API_KEY);
const model = gateway("google/gemini-3-flash-preview");

const SYSTEM_PROMPT = `Eres un analista de podcasts hispanohablante para "Vacílate Esto", el podcast de Jhon Da Silva (JhonSnacks, Instagram @jhonsnacksn) y Juan Carlos Martínez (JuanSofa, Instagram @juansofa).

Tienes acceso a transcripciones diarizadas: cada chunk tiene quién habló (jhon, juan, invitado o sin clasificar) y un timestamp.

REGLAS DURAS:
- Solo analiza a JHON y JUAN. Ignora explícitamente lo que dicen invitados.
- Cuando uses search_quotes o sample_quotes, SIEMPRE filtra por speaker = "jhon" o "juan".
- Cuando cites a alguien, indica de qué episodio (título) y el timestamp aproximado en formato m:ss.
- Sé directo, conciso y específico. Cita textualmente cuando aporta valor.
- Si la pregunta es comparativa ("quién habla más de X"), usa search_quotes para ambos y compara conteos.
- Si te piden estadísticas globales, usa speaker_stats.
- Responde en español venezolano natural.`;

const tools = {
  search_quotes: tool({
    description:
      "Busca frases textuales (full-text en español) dichas por Jhon o Juan en los episodios diarizados. Devuelve fragmentos con texto, video, timestamp.",
    inputSchema: z.object({
      query: z.string().min(2).describe("Término o frase a buscar"),
      speaker: z.enum(["jhon", "juan"]).describe("Hablante a filtrar"),
      limit: z.number().int().min(1).max(40).default(15),
    }),
    execute: async ({ query, speaker, limit }) => {
      const { data, error } = await supabase
        .from("yt_transcript_chunks")
        .select("video_id, start_seconds, text")
        .eq("speaker", speaker)
        .textSearch("text_tsv", query, { config: "spanish", type: "websearch" })
        .limit(limit);
      if (error) return { error: error.message };
      const ids = Array.from(new Set((data || []).map((r) => r.video_id)));
      const titlesMap: Record<string, string> = {};
      if (ids.length) {
        const { data: vids } = await supabase
          .from("yt_videos")
          .select("video_id, title")
          .in("video_id", ids);
        for (const v of vids || []) titlesMap[v.video_id] = v.title;
      }
      return {
        speaker,
        query,
        count: data?.length || 0,
        results: (data || []).map((r) => ({
          video_id: r.video_id,
          title: titlesMap[r.video_id] || r.video_id,
          ts: Math.floor(Number(r.start_seconds)),
          text: r.text,
        })),
      };
    },
  }),

  speaker_stats: tool({
    description:
      "Devuelve estadísticas agregadas de tiempo hablado, palabras y turnos por episodio. Filtra por speaker (jhon o juan) y opcionalmente por video_id.",
    inputSchema: z.object({
      speaker: z.enum(["jhon", "juan"]).optional(),
      video_id: z.string().optional(),
      top_n: z.number().int().min(1).max(50).default(10),
    }),
    execute: async ({ speaker, video_id, top_n }) => {
      const { data, error } = await supabase.rpc("yt_episode_speaker_stats", {
        p_video_id: video_id ?? null,
      });
      if (error) return { error: error.message };
      let rows = (data || []) as Array<{
        video_id: string;
        title: string;
        published_at: string | null;
        speaker: string;
        seconds: number;
        words: number;
        turns: number;
      }>;
      if (speaker) rows = rows.filter((r) => r.speaker === speaker);
      else rows = rows.filter((r) => r.speaker === "jhon" || r.speaker === "juan");
      // Sort by seconds desc, take top_n
      rows.sort((a, b) => Number(b.seconds) - Number(a.seconds));
      const top = rows.slice(0, top_n);
      const totals: Record<string, { seconds: number; words: number; turns: number; episodes: number }> = {};
      for (const r of rows) {
        const k = r.speaker;
        const t = (totals[k] ||= { seconds: 0, words: 0, turns: 0, episodes: 0 });
        t.seconds += Number(r.seconds);
        t.words += Number(r.words);
        t.turns += Number(r.turns);
        t.episodes += 1;
      }
      return { totals, top_episodes: top };
    },
  }),

  sample_quotes: tool({
    description:
      "Trae una muestra de frases recientes dichas por Jhon o Juan, sin filtro de búsqueda. Útil para entender estilo o temas frecuentes.",
    inputSchema: z.object({
      speaker: z.enum(["jhon", "juan"]),
      limit: z.number().int().min(1).max(30).default(15),
    }),
    execute: async ({ speaker, limit }) => {
      const { data, error } = await supabase
        .from("yt_transcript_chunks")
        .select("video_id, start_seconds, text")
        .eq("speaker", speaker)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) return { error: error.message };
      return {
        speaker,
        sample: (data || []).map((r) => ({
          video_id: r.video_id,
          ts: Math.floor(Number(r.start_seconds)),
          text: r.text,
        })),
      };
    },
  }),
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { messages } = (await req.json()) as { messages: UIMessage[] };
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const result = streamText({
      model,
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(50),
    });
    return result.toUIMessageStreamResponse({ headers: corsHeaders });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
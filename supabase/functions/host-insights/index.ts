// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const sb = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false },
});

// Common Spanish stopwords + Venezuelan extras to filter from "top words".
const STOPWORDS = new Set<string>([
  "a","al","algo","algún","alguna","algunas","alguno","algunos","ante","antes","aquel","aquella","aquellas","aquello","aquellos",
  "aquí","así","aún","ay","bien","cada","casi","como","cómo","con","contra","cual","cuál","cuales","cuáles","cuando","cuándo",
  "cuanta","cuantas","cuanto","cuantos","de","del","desde","donde","dónde","dos","el","él","ella","ellas","ello","ellos",
  "en","entre","era","erais","éramos","eran","eras","eres","es","esa","esas","ese","eso","esos","esta","está","estaba",
  "estabais","estábamos","estaban","estabas","estad","estada","estadas","estado","estados","estamos","están","estar","estará",
  "estarán","estarás","estaré","estaréis","estaremos","estaría","estaríais","estaríamos","estarían","estarías","estas",
  "este","esto","estos","estoy","estuve","estuviera","estuvierais","estuviéramos","estuvieran","estuvieras","estuvieron",
  "estuviese","estuvieseis","estuviésemos","estuviesen","estuvieses","estuvimos","estuviste","estuvisteis","estuvo",
  "fue","fuera","fuerais","fuéramos","fueran","fueras","fueron","fuese","fueseis","fuésemos","fuesen","fueses","fui",
  "fuimos","fuiste","fuisteis","ha","habéis","haber","habida","habidas","habido","habidos","habiendo","habrá","habrán",
  "habrás","habré","habréis","habremos","habría","habríais","habríamos","habrían","habrías","han","has","hasta","hay",
  "haya","hayáis","hayamos","hayan","hayas","he","hemos","hube","hubiera","hubierais","hubiéramos","hubieran","hubieras",
  "hubieron","hubiese","hubieseis","hubiésemos","hubiesen","hubieses","hubimos","hubiste","hubisteis","hubo","la","las",
  "le","les","lo","los","más","me","mi","mí","mía","mías","mientras","mío","míos","mis","mucho","muchos","muy","nada","ni",
  "no","nos","nosotras","nosotros","nuestra","nuestras","nuestro","nuestros","o","os","otra","otras","otro","otros","para",
  "pero","poco","por","porque","que","qué","quien","quién","quienes","quiénes","se","sea","seáis","seamos","sean","seas",
  "ser","será","serán","serás","seré","seréis","seremos","sería","seríais","seríamos","serían","serías","sí","siendo","sin",
  "sobre","sois","somos","son","soy","su","sus","suya","suyas","suyo","suyos","también","tanto","te","tendrá","tendrán",
  "tendrás","tendré","tendréis","tendremos","tendría","tendríais","tendríamos","tendrían","tendrías","tened","tenéis",
  "tenemos","tener","tenga","tengáis","tengamos","tengan","tengas","tengo","tenida","tenidas","tenido","tenidos","teniendo",
  "tenía","teníais","teníamos","tenían","tenías","ti","tiene","tienen","tienes","todo","todos","tu","tú","tus","tuya","tuyas",
  "tuyo","tuyos","un","una","unas","uno","unos","va","vais","vamos","van","vas","ven","ver","vez","vi","vienen","viene",
  "vino","vio","vos","vosotras","vosotros","voy","vuestra","vuestras","vuestro","vuestros","y","ya","yo","si","sin",
  "ahí","ahora","entonces","luego","pues","ese","esa","eso","aquí","allá","allí","tipo","cosa","cosas","gente","nadie",
  "siempre","nunca","mucho","poco","todo","nada","algo","algunas","entre","sólo","solo","tan","aunque","mismo","misma",
]);

// Venezuelan/colloquial fillers to count separately.
const FILLER_PATTERNS: { name: string; regex: RegExp }[] = [
  { name: "o sea", regex: /\bo sea\b/gi },
  { name: "este…", regex: /\beste\b(?=[\s,.])/gi },
  { name: "como que", regex: /\bcomo que\b/gi },
  { name: "vale", regex: /\bvale\b/gi },
  { name: "chamo", regex: /\bchamo\b/gi },
  { name: "marico", regex: /\bmarico\b/gi },
  { name: "épale", regex: /\bépale\b/gi },
  { name: "coño", regex: /\bcoño\b/gi },
  { name: "verga", regex: /\bverga\b/gi },
  { name: "burda", regex: /\bburda\b/gi },
  { name: "pana", regex: /\bpana\b/gi },
  { name: "vaina", regex: /\bvaina\b/gi },
  { name: "literal", regex: /\bliteral\b/gi },
  { name: "obvio", regex: /\bobvio\b/gi },
  { name: "imagínate", regex: /\bimag[íi]nate\b/gi },
  { name: "exacto", regex: /\bexacto\b/gi },
  { name: "claro", regex: /\bclaro\b/gi },
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^\p{L}\s']/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

async function fetchAllChunks(host: "juan" | "jhon"): Promise<any[]> {
  // Solo analizamos episodios de podcast — nunca shorts.
  const podcastIds = new Set<string>();
  {
    const PAGE = 1000;
    let from = 0;
    while (true) {
      const { data, error } = await sb
        .from("yt_videos")
        .select("video_id")
        .eq("kind", "podcast")
        .range(from, from + PAGE - 1);
      if (error) throw error;
      if (!data || data.length === 0) break;
      for (const r of data) podcastIds.add(r.video_id);
      if (data.length < PAGE) break;
      from += PAGE;
    }
  }

  const all: any[] = [];
  const PAGE = 1000;
  let from = 0;
  while (true) {
    const { data, error } = await sb
      .from("yt_transcript_chunks")
      .select("video_id,start_seconds,end_seconds,text")
      .eq("speaker", host)
      .range(from, from + PAGE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    for (const ch of data) {
      if (podcastIds.has(ch.video_id)) all.push(ch);
    }
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return all;
}

function computeStats(chunks: any[]) {
  let totalSeconds = 0;
  const wordCounts = new Map<string, number>();
  const fillerCounts = new Map<string, number>();
  const videos = new Set<string>();
  let totalWords = 0;

  for (const ch of chunks) {
    const dur = Number(ch.end_seconds) - Number(ch.start_seconds);
    if (dur > 0 && dur < 600) totalSeconds += dur; // ignore outliers
    videos.add(ch.video_id);

    const text = String(ch.text || "");
    for (const f of FILLER_PATTERNS) {
      const matches = text.match(f.regex);
      if (matches) fillerCounts.set(f.name, (fillerCounts.get(f.name) || 0) + matches.length);
    }
    const tokens = tokenize(text);
    totalWords += tokens.length;
    for (const t of tokens) wordCounts.set(t, (wordCounts.get(t) || 0) + 1);
  }

  const topWords = Array.from(wordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100)
    .map(([word, count]) => ({ word, count }));

  const topFillers = Array.from(fillerCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([word, count]) => ({ word, count }));

  const uniqueWords = wordCounts.size;
  const lexicalRichness = totalWords > 0 ? uniqueWords / totalWords : 0;
  const avgTurnLength = chunks.length > 0 ? totalSeconds / chunks.length : 0;

  return {
    total_seconds_spoken: totalSeconds,
    total_turns: chunks.length,
    total_words: totalWords,
    unique_words: uniqueWords,
    avg_turn_length_seconds: avgTurnLength,
    lexical_richness: lexicalRichness,
    top_words: topWords,
    top_fillers: topFillers,
    top_topics: [], // reserved for future clustering
    videos_analyzed: videos.size,
    last_computed_at: new Date().toISOString(),
  };
}

async function recompute() {
  const results: Record<string, any> = {};
  for (const host of ["juan", "jhon"] as const) {
    const display = host === "juan" ? "Juan Carlos Martínez (JuanSofa)" : "Jhon Da Silva (JhonSnacks)";
    const chunks = await fetchAllChunks(host);
    const stats = computeStats(chunks);
    const row = { host_key: host, display_name: display, ...stats };
    const { error } = await sb.from("host_stats").upsert(row, { onConflict: "host_key" });
    if (error) throw error;
    results[host] = { videos: stats.videos_analyzed, turns: stats.total_turns, words: stats.total_words };
  }
  return results;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    let action = "get";
    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      action = body?.action || "get";
    }

    if (action === "recompute") {
      const result = await recompute();
      return new Response(JSON.stringify({ ok: true, ...result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // default: read cache
    const { data, error } = await sb.from("host_stats").select("*").order("host_key");
    if (error) throw error;
    return new Response(JSON.stringify({ ok: true, hosts: data || [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("host-insights error", e);
    return new Response(JSON.stringify({ ok: false, error: e?.message || String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
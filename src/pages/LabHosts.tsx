import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Loader2, Search, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type Speaker = "all" | "jhon" | "juan" | "invitado" | "unknown";

type ChunkRow = {
  id: string;
  video_id: string;
  start_seconds: number;
  end_seconds: number;
  text: string;
  speaker: string | null;
  speaker_confidence: number | null;
};

type VideoRow = {
  video_id: string;
  title: string;
  thumbnail_url: string | null;
  published_at: string | null;
  kind: string;
};

const SPEAKERS: { k: Speaker; label: string; color: string }[] = [
  { k: "all", label: "Todos", color: "bg-foreground text-background" },
  { k: "jhon", label: "Jhon", color: "bg-primary text-primary-foreground" },
  { k: "juan", label: "Juan", color: "bg-accent text-accent-foreground" },
  { k: "invitado", label: "Invitado", color: "bg-muted text-foreground" },
  { k: "unknown", label: "Sin clasificar", color: "bg-muted text-muted-foreground" },
];

function fmtTs(s: number) {
  const sec = Math.floor(s);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const ss = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  return `${m}:${String(ss).padStart(2, "0")}`;
}

function speakerColor(sp: string | null) {
  if (sp === "jhon") return "bg-primary text-primary-foreground";
  if (sp === "juan") return "bg-accent text-accent-foreground";
  if (sp === "invitado") return "bg-muted text-foreground border border-border";
  return "bg-muted/60 text-muted-foreground";
}

const LabHosts = () => {
  const [query, setQuery] = useState("");
  const [speaker, setSpeaker] = useState<Speaker>("all");
  const [loading, setLoading] = useState(false);
  const [chunks, setChunks] = useState<ChunkRow[]>([]);
  const [videos, setVideos] = useState<Record<string, VideoRow>>({});
  const [error, setError] = useState<string | null>(null);
  const [coverage, setCoverage] = useState<{ done: number; total: number; episodes: number } | null>(null);

  // Load coverage stats
  useEffect(() => {
    (async () => {
      try {
        const [doneRes, totalRes, epsRes] = await Promise.all([
          supabase
            .from("yt_transcript_chunks")
            .select("id", { count: "exact", head: true })
            .not("speaker", "is", null),
          supabase.from("yt_transcript_chunks").select("id", { count: "exact", head: true }),
          supabase.rpc("count_diarized_episodes" as never).single(),
        ]);
        setCoverage({
          done: doneRes.count ?? 0,
          total: totalRes.count ?? 0,
          episodes: (epsRes.data as any) ?? 0,
        });
      } catch {
        // ignore
      }
    })();
  }, []);

  const runSearch = async () => {
    const q = query.trim();
    if (q.length < 3) return;
    setLoading(true);
    setError(null);
    setChunks([]);
    setVideos({});
    try {
      let req = supabase
        .from("yt_transcript_chunks")
        .select("id, video_id, start_seconds, end_seconds, text, speaker, speaker_confidence")
        .textSearch("text_tsv", q, { config: "spanish", type: "websearch" })
        .limit(80);
      if (speaker !== "all") {
        if (speaker === "unknown") req = req.is("speaker", null);
        else req = req.eq("speaker", speaker);
      }
      const { data, error: err } = await req;
      if (err) throw err;
      const rows = (data || []) as ChunkRow[];
      setChunks(rows);
      // Fetch video metadata
      const ids = Array.from(new Set(rows.map((r) => r.video_id)));
      if (ids.length) {
        const { data: vids } = await supabase
          .from("yt_videos")
          .select("video_id, title, thumbnail_url, published_at, kind")
          .in("video_id", ids);
        const map: Record<string, VideoRow> = {};
        for (const v of (vids || []) as VideoRow[]) map[v.video_id] = v;
        setVideos(map);
      }
    } catch (e: any) {
      setError(e?.message || "Error en la búsqueda");
    } finally {
      setLoading(false);
    }
  };

  const grouped = useMemo(() => {
    const by: Record<string, ChunkRow[]> = {};
    for (const c of chunks) (by[c.video_id] ||= []).push(c);
    return Object.entries(by).map(([vid, list]) => ({
      video_id: vid,
      chunks: list.sort((a, b) => a.start_seconds - b.start_seconds),
    }));
  }, [chunks]);

  const speakerCounts = useMemo(() => {
    const c: Record<string, number> = { jhon: 0, juan: 0, invitado: 0, unknown: 0 };
    for (const ch of chunks) {
      const s = ch.speaker || "unknown";
      c[s] = (c[s] || 0) + 1;
    }
    return c;
  }, [chunks]);

  return (
    <>
      <Helmet>
        <title>Lab · Búsqueda por hablante</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-5xl px-4 py-10">
          <div className="mb-8">
            <Badge variant="outline" className="mb-3 font-mono text-[10px] uppercase tracking-widest">
              /lab — interno
            </Badge>
            <h1 className="font-display font-black text-3xl md:text-5xl tracking-tight">
              ¿Quién dijo qué?
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              Busca cualquier frase y filtra por hablante (Jhon, Juan o invitado) en los episodios diarizados.
            </p>
            {coverage && (
              <p className="text-xs text-muted-foreground mt-3 font-mono">
                Cobertura: {coverage.done.toLocaleString()} / {coverage.total.toLocaleString()} chunks ·{" "}
                {coverage.episodes} episodios diarizados
              </p>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              runSearch();
            }}
            className="mb-6"
          >
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ej: Salomón Rondón, llaneridad, mundial…"
                  className="pl-10 h-12"
                />
              </div>
              <Button type="submit" disabled={loading || query.trim().length < 3} className="h-12 px-6">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buscar"}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {SPEAKERS.map(({ k, label }) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSpeaker(k)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border-2 transition-all ${
                    speaker === k
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-muted-foreground border-border hover:border-foreground/40"
                  }`}
                >
                  {label}
                  {chunks.length > 0 && k !== "all" && (
                    <span className="ml-1 opacity-70">
                      · {speakerCounts[k] || 0}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </form>

          {error && (
            <Card className="p-4 mb-6 border-destructive/40 bg-destructive/10 text-destructive text-sm">
              {error}
            </Card>
          )}

          {!loading && chunks.length === 0 && query && (
            <p className="text-sm text-muted-foreground py-12 text-center">
              Sin resultados para esta búsqueda y filtro.
            </p>
          )}

          <div className="space-y-6">
            {grouped.map(({ video_id, chunks: list }) => {
              const v = videos[video_id];
              return (
                <Card key={video_id} className="p-5">
                  <div className="flex gap-4 mb-4">
                    {v?.thumbnail_url && (
                      <img
                        src={v.thumbnail_url}
                        alt=""
                        className="w-24 h-14 object-cover rounded-md flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm md:text-base line-clamp-2">
                        {v?.title || video_id}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {v?.published_at ? new Date(v.published_at).toLocaleDateString("es-VE") : ""} · {list.length}{" "}
                        coincidencias
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {list.map((c) => (
                      <a
                        key={c.id}
                        href={`https://youtube.com/watch?v=${video_id}&t=${Math.floor(c.start_seconds)}s`}
                        target="_blank"
                        rel="noreferrer"
                        className="block p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors group"
                      >
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${speakerColor(
                              c.speaker,
                            )}`}
                          >
                            {c.speaker || "?"}
                          </span>
                          {c.speaker_confidence != null && (
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {(c.speaker_confidence * 100).toFixed(0)}%
                            </span>
                          )}
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {fmtTs(c.start_seconds)}
                          </span>
                          <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground group-hover:text-foreground" />
                        </div>
                        <p className="text-sm leading-relaxed">{c.text}</p>
                      </a>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default LabHosts;
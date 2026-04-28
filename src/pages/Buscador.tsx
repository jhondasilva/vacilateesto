import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Play,
  Loader2,
  Sparkles,
  Clock,
  Mic,
  Film,
  ChevronDown,
  ChevronUp,
  Layers,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

type SearchChunk = {
  chunk_id: string;
  video_id: string;
  title: string;
  kind: "podcast" | "short";
  thumbnail_url: string | null;
  published_at: string | null;
  start_seconds: number;
  end_seconds: number;
  text: string;
  similarity: number;
};

type SearchResult = SearchChunk & { chunks: SearchChunk[] };

const FALLBACK_SUGGESTIONS = [
  "la radiografía del perro caliente",
  "fidelidad a una marca",
  "llaneridad y código de honor",
  "marcas que viven en tus recuerdos",
  "viajar por Sudamérica sin fecha de vuelta",
  "el cine que conocías ya no existe",
];

type Programa = "all" | "podcast" | "streaming" | "pelotica" | "cumbre";

const PROGRAMAS: { k: Programa; label: string }[] = [
  { k: "all", label: "Todos" },
  { k: "podcast", label: "Podcast" },
  { k: "streaming", label: "Streaming" },
  { k: "pelotica", label: "Pelotica de Goma" },
  { k: "cumbre", label: "En la Cumbre" },
];

type SortMode = "relevance" | "recent";

function detectPrograma(title: string): Programa {
  const t = title.toLowerCase();
  if (t.includes("cumbre")) return "cumbre";
  if (t.includes("pelotica")) return "pelotica";
  if (
    t.includes("streaming") ||
    /\b(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)\b\s*\|/i.test(t) ||
    t.startsWith("live ")
  )
    return "streaming";
  return "podcast";
}

function formatTimestamp(seconds: number): string {
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2);
  if (tokens.length === 0) return text;
  const re = new RegExp(`(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(re);
  return parts.map((p, i) =>
    re.test(p) ? (
      <mark key={i} className="bg-primary/30 text-foreground rounded px-0.5 font-semibold">
        {p}
      </mark>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

// Simple in-memory result cache, scoped to the page lifetime.
const resultCache = new Map<string, SearchResult[]>();
const cacheKey = (q: string, k: string) => `${k}::${q.trim().toLowerCase()}`;

const Buscador = () => {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "podcast" | "short">("all");
  const [programa, setPrograma] = useState<Programa>("all");
  const [sortMode, setSortMode] = useState<SortMode>("relevance");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ podcasts: number; shorts: number } | null>(null);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>(FALLBACK_SUGGESTIONS);
  const abortRef = useRef<AbortController | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const runSearch = async (q: string, k: typeof filter) => {
    if (!q || q.trim().length < 3) return;
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const key = cacheKey(q, k);
    setSubmittedQuery(q.trim());
    setExpanded(new Set());
    if (resultCache.has(key)) {
      setResults(resultCache.get(key)!);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("yt-search", {
        body: {
          query: q.trim(),
          kind: k === "all" ? null : k,
          limit: 30,
        },
      });
      if (ctrl.signal.aborted) return;
      if (error) throw error;
      if (!data?.ok) throw new Error(data?.error || "Error desconocido");
      const r = (data.results || []) as SearchResult[];
      resultCache.set(key, r);
      setResults(r);
    } catch (e: any) {
      if (ctrl.signal.aborted) return;
      setError(e?.message || "No pudimos buscar en este momento. Inténtalo de nuevo en un ratico.");
      setResults([]);
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    if (submittedQuery) runSearch(submittedQuery, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Read ?q= from URL on mount and auto-search
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && q.trim().length >= 2) {
      setQuery(q);
      runSearch(q, filter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load real catalog stats + dynamic suggestions (recent episode titles).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [pc, sc, recent] = await Promise.all([
          supabase.from("yt_videos").select("video_id", { count: "exact", head: true }).eq("kind", "podcast"),
          supabase.from("yt_videos").select("video_id", { count: "exact", head: true }).eq("kind", "short"),
          supabase
            .from("yt_videos")
            .select("title")
            .eq("kind", "podcast")
            .order("published_at", { ascending: false, nullsFirst: false })
            .limit(12),
        ]);
        if (cancelled) return;
        setStats({ podcasts: pc.count ?? 0, shorts: sc.count ?? 0 });
        const titles = (recent.data || [])
          .map((r: any) => (r.title || "").trim())
          .filter((t: string) => t.length > 0 && t.length < 70)
          .map((t: string) =>
            t.replace(/\s*ft\.?\s.*$/i, "").replace(/\s*\|.*$/, "").replace(/^\W+|\W+$/g, "").trim(),
          )
          .filter((t: string) => t.length > 6);
        if (titles.length >= 3) setDynamicSuggestions(titles.slice(0, 6));
      } catch (e) {
        // keep fallback
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) setSearchParams({ q: query.trim() }, { replace: true });
    runSearch(query, filter);
  };

  const placeholder = useMemo(() => {
    const s = dynamicSuggestions[Math.floor(Math.random() * dynamicSuggestions.length)];
    return `Por ejemplo: ${s}`;
  }, [dynamicSuggestions]);

  const filteredResults = useMemo(() => {
    if (!results) return [];
    let r = programa === "all" ? results : results.filter((x) => detectPrograma(x.title) === programa);
    if (sortMode === "recent") {
      r = [...r].sort((a, b) => {
        const ta = a.published_at ? new Date(a.published_at).getTime() : 0;
        const tb = b.published_at ? new Date(b.published_at).getTime() : 0;
        return tb - ta;
      });
    }
    return r;
  }, [results, programa, sortMode]);

  const programaCounts = useMemo(() => {
    const counts: Record<Programa, number> = { all: 0, podcast: 0, streaming: 0, pelotica: 0, cumbre: 0 };
    if (!results) return counts;
    counts.all = results.length;
    for (const r of results) counts[detectPrograma(r.title)]++;
    return counts;
  }, [results]);

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <Helmet>
        <title>Buscador de momentos | Vacílate Esto</title>
        <meta
          name="description"
          content={`Busca cualquier tema en ${stats ? `${stats.podcasts} episodios y ${stats.shorts} shorts` : "todos los episodios y shorts"} de Vacílate Esto. Encuentra el minuto exacto donde lo conversamos y míralo en YouTube.`}
        />
        <link rel="canonical" href="https://www.vacilateesto.com/buscador" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />

        {/* HERO — Sticker Pack Y2K */}
        <section className="relative overflow-hidden border-b-4 border-foreground pt-24 md:pt-28 bg-background">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_60%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-[0.05] [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:18px_18px]"
          />
          {/* Floating stickers */}
          <div aria-hidden className="absolute top-24 left-6 hidden md:block rotate-[-10deg] bg-foreground text-background border-2 border-foreground px-3 py-1 font-display font-black text-xs uppercase tracking-widest shadow-[6px_6px_0_hsl(var(--primary))]">
            ◆ {stats ? `${stats.podcasts} episodios` : "Episodios"}
          </div>
          <div aria-hidden className="absolute top-32 right-8 hidden md:block rotate-[10deg] bg-accent text-accent-foreground border-2 border-foreground px-3 py-1 font-display font-black text-xs uppercase tracking-widest shadow-[6px_6px_0_hsl(var(--foreground))]">
            ★ {stats ? `${stats.shorts.toLocaleString()} shorts` : "Shorts"}
          </div>

          <div className="container mx-auto px-4 pt-10 pb-8 md:pt-20 md:pb-14 max-w-4xl">
            <div className="text-center mb-6 md:mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-foreground text-background border-2 border-foreground text-[10px] md:text-xs font-display font-black uppercase tracking-widest mb-5 md:mb-7 shadow-[4px_4px_0_hsl(var(--primary))] rotate-[-2deg]">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                Búsqueda con IA
              </div>
              <h1 className="font-display font-black tracking-[-0.04em] leading-[0.9] text-[12vw] sm:text-6xl md:text-7xl lg:text-8xl mb-5 md:mb-6">
                Encuentra el{" "}
                <span className="italic bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  momento exacto
                </span>
                .
              </h1>
              <p className="font-body text-muted-foreground text-sm sm:text-base md:text-xl max-w-2xl mx-auto px-2">
                Escribe cualquier tema y te llevamos al{" "}
                <span className="font-semibold text-foreground">minuto exacto</span> del episodio o el short donde lo conversamos.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="relative">
              <div className="relative flex items-center rounded-2xl bg-card border-2 border-foreground focus-within:border-primary transition-all shadow-[6px_6px_0_hsl(var(--foreground))] hover:shadow-[8px_8px_0_hsl(var(--primary))] overflow-hidden">
                <Search className="absolute left-4 md:left-5 w-4 h-4 md:w-5 md:h-5 text-muted-foreground pointer-events-none z-10" />
                <Input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                  className="pl-11 md:pl-14 pr-2 h-14 md:h-[72px] text-sm md:text-lg border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none placeholder:text-muted-foreground/70"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading || query.trim().length < 3}
                  className="m-1.5 md:m-2 h-11 md:h-14 px-4 md:px-8 text-sm md:text-base font-bold shrink-0"
                  aria-label="Buscar momento en los episodios"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                      <span className="hidden sm:inline">Buscando…</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="hidden sm:inline">Buscar</span>
                    </>
                  )}
                </Button>
              </div>

              {!submittedQuery && (
                <div className="mt-5 flex flex-wrap gap-2 justify-center">
                  <span className="text-xs text-muted-foreground self-center mr-1">
                    Prueba con:
                  </span>
                  {dynamicSuggestions.slice(0, 4).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setQuery(s);
                        runSearch(s, filter);
                      }}
                      className="text-xs md:text-sm px-3 py-1.5 rounded-full bg-muted hover:bg-primary/10 hover:text-primary border border-border hover:border-primary/40 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </form>

            <div className="flex gap-2 mt-6 justify-center">
              {([
                { k: "all", label: "Todo", icon: Sparkles },
                { k: "podcast", label: "Podcasts", icon: Mic },
                { k: "short", label: "Shorts", icon: Film },
              ] as const).map(({ k, label, icon: Icon }) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setFilter(k)}
                  className={`inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold px-4 py-2 rounded-full border-2 transition-all ${
                    filter === k
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 mt-3 justify-center flex-wrap">
              {PROGRAMAS.map(({ k, label }) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setPrograma(k)}
                  className={`text-[11px] md:text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                    programa === k
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {label}
                  {results && k !== "all" && programaCounts[k] > 0 && (
                    <span className="ml-1 opacity-70">·{programaCounts[k]}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* RESULTS */}
        <main className="container mx-auto px-4 py-10 md:py-14 max-w-4xl">
          {loading && !results && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-40 rounded-2xl" />
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="inline-block px-6 py-4 rounded-2xl bg-destructive/10 text-destructive font-medium">
                {error}
              </div>
            </div>
          )}

          {results && filteredResults.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Search className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-xl font-bold mb-2">
                {results.length === 0
                  ? `Nada por aquí para "${submittedQuery}"`
                  : `Sin resultados en este programa para "${submittedQuery}"`}
              </p>
              <p className="text-muted-foreground">
                {results.length === 0
                  ? "Prueba con otras palabras o quita los filtros para ver más resultados."
                  : "Cambia el programa o selecciona “Todos” para ver más resultados."}
              </p>
            </div>
          )}

          {results && filteredResults.length > 0 && (
            <>
              <div className="flex items-center justify-between gap-3 mb-5 px-1 flex-wrap">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{filteredResults.length}</span>{" "}
                  {filteredResults.length === 1 ? "episodio" : "episodios"} con momentos para{" "}
                  <span className="font-semibold text-foreground">"{submittedQuery}"</span>
                </p>
                <div className="flex gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setSortMode("relevance")}
                    className={`px-2.5 py-1 rounded-full border font-semibold transition-colors ${
                      sortMode === "relevance"
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    Más relevantes
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortMode("recent")}
                    className={`px-2.5 py-1 rounded-full border font-semibold transition-colors ${
                      sortMode === "recent"
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    Más recientes
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {filteredResults.map((r) => {
                  const seconds = Math.floor(r.start_seconds);
                  const url = `https://youtu.be/${r.video_id}?t=${seconds}s`;
                  const extraChunks = (r.chunks || []).slice(1);
                  const isOpen = expanded.has(r.video_id);
                  return (
                    <Card
                      key={r.video_id}
                      className="overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all group"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 p-4">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative shrink-0 block"
                        >
                          <img
                            src={r.thumbnail_url || "/placeholder.svg"}
                            alt={r.title}
                            loading="lazy"
                            className="w-full sm:w-52 aspect-video object-cover rounded-xl"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 rounded-xl transition-opacity">
                            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
                              <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground ml-0.5" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/85 text-white text-xs font-mono font-semibold px-2 py-1 rounded-md flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(r.start_seconds)}
                          </div>
                        </a>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge
                              variant={r.kind === "short" ? "secondary" : "default"}
                              className="font-semibold"
                            >
                              {r.kind === "short" ? (
                                <>
                                  <Film className="w-3 h-3 mr-1" />
                                  Short
                                </>
                              ) : (
                                <>
                                  <Mic className="w-3 h-3 mr-1" />
                                  Podcast
                                </>
                              )}
                            </Badge>
                            {r.published_at && (
                              <span className="text-[11px] text-muted-foreground">
                                {new Date(r.published_at).toLocaleDateString("es-VE", {
                                  year: "numeric",
                                  month: "short",
                                })}
                              </span>
                            )}
                            {extraChunks.length > 0 && (
                              <Badge variant="outline" className="font-semibold gap-1">
                                <Layers className="w-3 h-3" />
                                {r.chunks.length} momentos
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-bold text-base sm:text-lg leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {r.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
                            …{highlight(r.text, submittedQuery)}…
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Button asChild size="sm">
                              <a href={url} target="_blank" rel="noopener noreferrer">
                                <Play className="w-4 h-4 fill-current" />
                                Ir al minuto {formatTimestamp(r.start_seconds)}
                              </a>
                            </Button>
                            {extraChunks.length > 0 && (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => toggleExpanded(r.video_id)}
                              >
                                {isOpen ? (
                                  <>
                                    <ChevronUp className="w-4 h-4" />
                                    Ocultar
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-4 h-4" />
                                    Ver {extraChunks.length} más
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      {isOpen && extraChunks.length > 0 && (
                        <div className="border-t border-border bg-muted/30 px-4 py-3 space-y-2">
                          {extraChunks.map((c) => {
                            const cs = Math.floor(c.start_seconds);
                            const cu = `https://youtu.be/${c.video_id}?t=${cs}s`;
                            return (
                              <a
                                key={c.chunk_id}
                                href={cu}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex gap-3 items-start p-2.5 rounded-lg hover:bg-background transition-colors group/chunk"
                              >
                                <div className="shrink-0 mt-0.5 flex items-center gap-1 bg-foreground text-background text-[11px] font-mono font-bold px-2 py-1 rounded-md">
                                  <Clock className="w-3 h-3" />
                                  {formatTimestamp(c.start_seconds)}
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 group-hover/chunk:text-foreground">
                                  …{highlight(c.text, submittedQuery)}…
                                </p>
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Buscador;
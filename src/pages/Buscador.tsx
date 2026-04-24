import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Search, Play, Loader2, Sparkles, Clock, Mic, Film } from "lucide-react";
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

const SUGGESTIONS = [
  "la mejor arepa de Caracas",
  "el gol de Salomón Rondón",
  "leyenda del Silbón",
  "cuando hablaron de Roraima",
  "Diosdado Cabello",
  "el perro caliente",
];

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

const Buscador = () => {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "podcast" | "short">("all");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const runSearch = async (q: string, k: typeof filter) => {
    if (!q || q.trim().length < 3) return;
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    setError(null);
    setSubmittedQuery(q.trim());
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
      setResults(data.results || []);
    } catch (e: any) {
      if (ctrl.signal.aborted) return;
      setError(e?.message || "No pudimos buscar ahora mismo");
      setResults([]);
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    if (submittedQuery) runSearch(submittedQuery, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query, filter);
  };

  const placeholder = useMemo(
    () => `ej: ${SUGGESTIONS[Math.floor(Date.now() / 4000) % SUGGESTIONS.length]}`,
    [],
  );

  return (
    <>
      <Helmet>
        <title>Buscador de momentos | Vacílate Esto</title>
        <meta
          name="description"
          content="Busca cualquier tema en los más de 200 episodios y 600 shorts de Vacílate Esto. Encuentra el momento exacto y mira el video desde ese segundo."
        />
        <link rel="canonical" href="https://www.vacilateesto.com/buscador" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />

        {/* HERO */}
        <section className="relative overflow-hidden border-b border-border pt-20">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.18),transparent_60%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-[0.04] [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:18px_18px]"
          />
          <div
            aria-hidden
            className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl -z-10"
          />
          <div
            aria-hidden
            className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-accent/40 blur-3xl -z-10"
          />

          <div className="container mx-auto px-4 pt-16 pb-10 md:pt-24 md:pb-14 max-w-4xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-bold uppercase tracking-wider mb-6 border border-primary/20">
                <Sparkles className="w-4 h-4" />
                Búsqueda con IA
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-5 leading-[1.05]">
                Encuentra el{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-primary to-[hsl(15_85%_55%)] bg-clip-text text-transparent">
                    momento exacto
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-1 h-3 bg-primary/15 -z-0 rounded"
                  />
                </span>
              </h1>
              <p className="text-muted-foreground text-base md:text-xl max-w-2xl mx-auto">
                Buscá cualquier tema en los episodios y shorts. Te llevamos al{" "}
                <span className="font-semibold text-foreground">segundo exacto</span> donde lo dijimos.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="relative">
              <div className="relative flex items-center rounded-2xl bg-card border-2 border-border focus-within:border-primary focus-within:shadow-[0_0_0_4px_hsl(var(--primary)/0.12)] transition-all shadow-lg overflow-hidden">
                <Search className="absolute left-5 w-5 h-5 text-muted-foreground pointer-events-none" />
                <Input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                  className="pl-14 pr-2 h-16 md:h-[72px] text-base md:text-lg border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading || query.trim().length < 3}
                  className="m-2 h-12 md:h-14 px-5 md:px-8 text-base font-bold shrink-0"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="hidden sm:inline">Buscando…</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span className="hidden sm:inline">Buscar</span>
                    </>
                  )}
                </Button>
              </div>

              {!submittedQuery && (
                <div className="mt-5 flex flex-wrap gap-2 justify-center">
                  <span className="text-xs text-muted-foreground self-center mr-1">
                    Probá:
                  </span>
                  {SUGGESTIONS.slice(0, 4).map((s) => (
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

          {results && results.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Search className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-xl font-bold mb-2">No encontramos nada para "{submittedQuery}"</p>
              <p className="text-muted-foreground">Probá con otras palabras o quitá los filtros.</p>
            </div>
          )}

          {results && results.length > 0 && (
            <>
              <p className="text-sm text-muted-foreground mb-5 px-1">
                <span className="font-semibold text-foreground">{results.length}</span>{" "}
                {results.length === 1 ? "resultado" : "resultados"} para{" "}
                <span className="font-semibold text-foreground">"{submittedQuery}"</span>
              </p>
              <div className="space-y-4">
                {results.map((r) => {
                  const seconds = Math.floor(r.start_seconds);
                  const url = `https://youtu.be/${r.video_id}?t=${seconds}s`;
                  return (
                    <Card
                      key={r.chunk_id}
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
                            <span className="text-xs text-muted-foreground font-medium">
                              {Math.round(r.similarity * 100)}% coincidencia
                            </span>
                          </div>
                          <h3 className="font-bold text-base sm:text-lg leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {r.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
                            …{highlight(r.text, submittedQuery)}…
                          </p>
                          <Button asChild size="sm">
                            <a href={url} target="_blank" rel="noopener noreferrer">
                              <Play className="w-4 h-4 fill-current" />
                              Ver desde {formatTimestamp(r.start_seconds)}
                            </a>
                          </Button>
                        </div>
                      </div>
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
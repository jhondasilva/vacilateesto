import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Search, Play, Loader2, Sparkles } from "lucide-react";
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
      <mark key={i} className="bg-primary/30 text-foreground rounded px-0.5">
        {p}
      </mark>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

const Buscador = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "podcast" | "short">("all");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!query || query.trim().length < 3) {
      setResults(null);
      setError(null);
      return;
    }
    debounceRef.current = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.functions.invoke("yt-search", {
          body: {
            query: query.trim(),
            kind: filter === "all" ? null : filter,
            limit: 30,
          },
        });
        if (error) throw error;
        if (!data?.ok) throw new Error(data?.error || "Error desconocido");
        setResults(data.results || []);
      } catch (e: any) {
        setError(e?.message || "No pudimos buscar ahora mismo");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query, filter]);

  const placeholder = useMemo(
    () =>
      [
        "ej: cuando hablaron de Roraima",
        "ej: la mejor arepa de Caracas",
        "ej: el gol de Salomón Rondón",
        "ej: leyenda del Silbón",
      ][Math.floor(Date.now() / 4000) % 4],
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
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Búsqueda con IA
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
              Encuentra el momento exacto
            </h1>
            <p className="text-muted-foreground text-lg">
              Busca en todos los episodios y shorts. Te llevamos al segundo donde lo dijimos.
            </p>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="pl-12 h-14 text-lg rounded-2xl border-2 focus-visible:ring-primary"
            />
            {loading && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
            )}
          </div>

          <div className="flex gap-2 mb-8 justify-center">
            {(["all", "podcast", "short"] as const).map((k) => (
              <Button
                key={k}
                size="sm"
                variant={filter === k ? "default" : "outline"}
                onClick={() => setFilter(k)}
                className="rounded-full"
              >
                {k === "all" ? "Todo" : k === "podcast" ? "Podcasts" : "Shorts"}
              </Button>
            ))}
          </div>

          {!query && (
            <div className="text-center text-muted-foreground py-16">
              <p className="text-sm">Escribe algo arriba para empezar a buscar.</p>
            </div>
          )}

          {loading && !results && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
          )}

          {error && (
            <div className="text-center text-destructive py-8">{error}</div>
          )}

          {results && results.length === 0 && !loading && (
            <div className="text-center text-muted-foreground py-16">
              <p className="text-lg font-medium">No encontramos nada para "{query}"</p>
              <p className="text-sm mt-2">Probá con otras palabras o quitá los filtros.</p>
            </div>
          )}

          {results && results.length > 0 && (
            <div className="space-y-4">
              {results.map((r) => {
                const seconds = Math.floor(r.start_seconds);
                const url = `https://youtu.be/${r.video_id}?t=${seconds}s`;
                return (
                  <Card
                    key={r.chunk_id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 p-4">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative shrink-0 group"
                      >
                        <img
                          src={r.thumbnail_url || "/placeholder.svg"}
                          alt={r.title}
                          loading="lazy"
                          className="w-full sm:w-48 aspect-video object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 rounded-lg transition-opacity">
                          <Play className="w-10 h-10 text-white fill-white" />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-mono px-1.5 py-0.5 rounded">
                          {formatTimestamp(r.start_seconds)}
                        </div>
                      </a>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={r.kind === "short" ? "secondary" : "default"}>
                            {r.kind === "short" ? "Short" : "Podcast"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Coincidencia {Math.round(r.similarity * 100)}%
                          </span>
                        </div>
                        <h3 className="font-semibold text-base sm:text-lg leading-snug mb-2 line-clamp-2">
                          {r.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                          …{highlight(r.text, query)}…
                        </p>
                        <Button asChild size="sm" variant="outline">
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            <Play className="w-4 h-4 mr-1" />
                            Ver desde {formatTimestamp(r.start_seconds)}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Buscador;
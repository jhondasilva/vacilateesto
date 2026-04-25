import { useEffect, useState } from "react";
import { Play, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

type Episode = {
  video_id: string;
  title: string;
  published_at: string | null;
  view_count: number | null;
  thumbnail_url: string | null;
};

const formatViews = (n: number | null) => {
  if (!n || n < 1) return "Nuevo";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M vistas`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K vistas`;
  return `${n} vistas`;
};

const formatRelative = (iso: string | null) => {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "Hace minutos";
  if (h < 24) return `Hace ${h} ${h === 1 ? "hora" : "horas"}`;
  const d = Math.floor(h / 24);
  if (d < 7) return `Hace ${d} ${d === 1 ? "día" : "días"}`;
  const w = Math.floor(d / 7);
  if (w < 5) return `Hace ${w} ${w === 1 ? "semana" : "semanas"}`;
  const m = Math.floor(d / 30);
  if (m < 12) return `Hace ${m} ${m === 1 ? "mes" : "meses"}`;
  const y = Math.floor(d / 365);
  return `Hace ${y} ${y === 1 ? "año" : "años"}`;
};

const EpisodesSection = () => {
  const [episodes, setEpisodes] = useState<Episode[] | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("yt_videos")
        .select("video_id,title,published_at,view_count,thumbnail_url")
        .eq("kind", "podcast")
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(4);
      if (!active) return;
      if (error || !data) {
        setEpisodes([]);
        return;
      }
      setEpisodes(data as Episode[]);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="episodes" className="py-20 md:py-28 bg-muted/40 relative overflow-hidden" aria-labelledby="episodes-title">
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-accent/8 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="container mx-auto px-4 relative z-10">
        <header className="text-center mb-12 md:mb-16">
          <span className="text-primary font-semibold text-xs sm:text-sm uppercase tracking-[0.2em]">Lo Más Reciente</span>
          <h2 id="episodes-title" className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4 text-foreground tracking-tight">
            Últimos Episodios
          </h2>
          <p className="font-body text-muted-foreground text-base md:text-lg max-w-xl mx-auto px-2">
            No te pierdas nuestras aventuras y conversaciones más recientes.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {episodes === null
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-background rounded-3xl overflow-hidden border border-border">
                  <Skeleton className="aspect-video w-full rounded-none" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))
            : episodes.map((episode, index) => (
                <a
                  key={episode.video_id}
                  href={`https://www.youtube.com/watch?v=${episode.video_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-500 hover:shadow-elevated hover:-translate-y-1 block"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={episode.thumbnail_url || `https://img.youtube.com/vi/${episode.video_id}/maxresdefault.jpg`}
                      alt={`Episodio: ${episode.title} - Vacílate Esto Podcast Venezuela`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
                      </div>
                    </div>

                    {index === 0 && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-primary rounded-full">
                        <span className="text-xs font-bold text-primary-foreground uppercase">Nuevo</span>
                      </div>
                    )}

                    <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-white/90">
                      <div className="flex items-center gap-1 bg-foreground/50 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Eye className="w-3 h-3" />
                        {formatViews(episode.view_count)}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2 text-foreground tracking-tight">
                      {episode.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatRelative(episode.published_at)}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
        </div>

        <div className="text-center mt-12">
          <a href="https://www.youtube.com/@Vacilateestopodcast/videos" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg">
              Ver Todos los Episodios
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default EpisodesSection;

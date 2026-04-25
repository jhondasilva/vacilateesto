import { useEffect, useState } from "react";
import { Play, Clock, Eye, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import StickerMarquee from "@/components/StickerMarquee";
import StickerHeader from "@/components/StickerHeader";

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

const TICKER = ["NUEVO EPISODIO", "★", "VACÍLATE ESTO", "✦", "PODCAST SEMANAL", "★", "FUN EDUCAITMENT", "✦"];

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
    <section id="episodes" className="relative overflow-hidden bg-background pt-0 pb-20 md:pb-28" aria-labelledby="episodes-title" itemScope itemType="https://schema.org/ItemList">
      <meta itemProp="name" content="Episodios recientes del podcast Vacílate Esto" />
      <meta itemProp="description" content="Últimos episodios del podcast Vacílate Esto con JuanSofa y JhonSnacks: humor, cultura, fútbol, gastronomía e historias venezolanas. Disponibles en Spotify y YouTube." />
      <meta itemProp="url" content="https://www.vacilateesto.com/#episodes" />
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 -left-32 w-[36rem] h-[36rem] bg-primary/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 -right-32 w-[36rem] h-[36rem] bg-accent/15 rounded-full blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      <StickerMarquee items={TICKER} variant="dark" className="mb-16 md:mb-20" />

      <div className="container mx-auto px-4 relative z-10">
        <StickerHeader
        titleId="episodes-title"
          badge="Lo más reciente"
          title="últimos"
          highlight="episodios"
          description="No te pierdas nuestras aventuras y conversaciones más recientes."
        />

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {episodes === null
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-background rounded-3xl overflow-hidden border-2 border-foreground">
                  <Skeleton className="aspect-video w-full rounded-none" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))
            : episodes.map((episode, index) => {
                const accentColor = index % 2 === 0 ? "primary" : "accent";
                return (
                  <a
                    key={episode.video_id}
                    href={`https://www.youtube.com/watch?v=${episode.video_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group block bg-background rounded-3xl overflow-hidden border-2 border-foreground hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 sticker-shadow-lg-${accentColor}`}
                  >
                    <div className="relative aspect-video overflow-hidden border-b-2 border-foreground">
                      <img
                        src={episode.thumbnail_url || `https://img.youtube.com/vi/${episode.video_id}/maxresdefault.jpg`}
                        alt={`Episodio: ${episode.title} - Vacílate Esto Podcast Venezuela`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 rounded-full bg-foreground border-2 border-background flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-background ml-1" fill="currentColor" />
                        </div>
                      </div>

                      {index === 0 && (
                        <div className="absolute top-4 left-4 bg-primary text-primary-foreground rounded-full px-3 py-1 -rotate-3 border-2 border-foreground">
                          <span className="font-display font-black text-[10px] uppercase tracking-widest">★ Nuevo</span>
                        </div>
                      )}

                      <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-background border-2 border-foreground px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        <Eye className="w-3 h-3" />
                        {formatViews(episode.view_count)}
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <h3 className="font-display font-black text-base sm:text-lg md:text-xl mb-3 line-clamp-2 text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors">
                        {episode.title}
                      </h3>
                      <div className="flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground font-semibold uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5" />
                          {formatRelative(episode.published_at)}
                        </div>
                        <span className="inline-flex items-center gap-1 text-foreground font-display font-black text-[10px] uppercase tracking-widest">
                          Ver
                          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
        </div>

        <div className="text-center mt-14">
          <Button
            asChild
            size="xl"
            className="rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground border-2 border-foreground shadow-[6px_6px_0_hsl(var(--primary))] hover:shadow-[8px_8px_0_hsl(var(--accent))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-display font-black uppercase tracking-wider text-xs"
          >
            <a href="https://www.youtube.com/@Vacilateestopodcast/videos" target="_blank" rel="noopener noreferrer">
              Ver todos los episodios
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EpisodesSection;

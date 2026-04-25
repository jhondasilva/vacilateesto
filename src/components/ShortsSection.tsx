import { useEffect, useState } from "react";
import { Play, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

type Short = {
  video_id: string;
  title: string;
  view_count: number | null;
  thumbnail_url: string | null;
};

const formatViews = (n: number | null) => {
  if (!n || n < 1) return "Nuevo";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
};

const ShortsSection = () => {
  const [shorts, setShorts] = useState<Short[] | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("yt_videos")
        .select("video_id,title,view_count,thumbnail_url")
        .eq("kind", "short")
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(4);
      if (!active) return;
      setShorts((data as Short[]) ?? []);
    })();
    return () => { active = false; };
  }, []);

  return (
    <section id="shorts" className="py-16 md:py-24 bg-background relative overflow-hidden" aria-labelledby="shorts-title">
      <div className="container mx-auto px-4 relative z-10">
        <header className="text-center mb-10 md:mb-14">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Shorts Diarios</span>
          <h2 id="shorts-title" className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4 text-foreground">
            Últimos Shorts
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto px-2">
            Cuentos y anécdotas en formato corto, todos los días.
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {shorts === null
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[9/16] w-full rounded-2xl" />
              ))
            : shorts.map((s) => (
                <a
                  key={s.video_id}
                  href={`https://www.youtube.com/shorts/${s.video_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-[9/16] rounded-2xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-500 hover:shadow-elevated block bg-muted"
                >
                  <img
                    src={s.thumbnail_url || `https://img.youtube.com/vi/${s.video_id}/hqdefault.jpg`}
                    alt={`Short: ${s.title} - Vacílate Esto`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
                    </div>
                  </div>

                  <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-foreground/60 backdrop-blur-sm flex items-center gap-1 text-[10px] text-white/90 font-medium">
                    <Eye className="w-3 h-3" />
                    {formatViews(s.view_count)}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white text-sm font-semibold line-clamp-2 leading-snug">
                      {s.title}
                    </h3>
                  </div>
                </a>
              ))}
        </div>

        <div className="text-center mt-12">
          <a href="https://www.youtube.com/@Vacilateestopodcast/shorts" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg">
              Ver Todos los Shorts
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ShortsSection;

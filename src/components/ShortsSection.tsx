import { useEffect, useState } from "react";
import { Play, Eye, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import StickerMarquee from "@/components/StickerMarquee";
import StickerHeader from "@/components/StickerHeader";

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

const TICKER = ["SHORTS DIARIOS", "★", "1 MIN", "✦", "TIKTOK · IG · YT", "★", "VIRAL", "✦"];

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
    <section id="shorts" className="relative overflow-hidden bg-background pt-0 pb-20 md:pb-28" aria-labelledby="shorts-title">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-accent/15 rounded-full blur-[140px] pointer-events-none" aria-hidden="true" />

      <StickerMarquee items={TICKER} variant="accent" className="mb-16 md:mb-20" reverse />

      <div className="container mx-auto px-4 relative z-10">
        <StickerHeader
          badge="Diario · ~1 min"
          badgeVariant="accent"
          title="últimos"
          highlight="shorts"
          description="Cuentos y anécdotas en formato corto, todos los días."
        />

        <div
          className={`grid gap-5 md:gap-6 mx-auto ${
            shorts && shorts.length <= 2
              ? "grid-cols-1 sm:grid-cols-2 max-w-2xl"
              : "grid-cols-2 md:grid-cols-4 max-w-5xl"
          }`}
        >
          {shorts === null
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[9/16] w-full rounded-3xl" />
              ))
            : shorts.map((s, i) => {
                const accentColor = i % 2 === 0 ? "accent" : "primary";
                const rotation = (i % 2 === 0 ? -1 : 1) * 1.5;
                return (
                  <a
                    key={s.video_id}
                    href={`https://www.youtube.com/shorts/${s.video_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-[9/16] rounded-3xl overflow-hidden border-2 border-foreground transition-all duration-300 hover:-translate-y-1 block bg-muted"
                    style={{
                      boxShadow: `6px 6px 0 hsl(var(--${accentColor}))`,
                      transform: `rotate(${rotation}deg)`,
                    }}
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
                      <div className="w-14 h-14 rounded-full bg-foreground border-2 border-background flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 text-background ml-0.5" fill="currentColor" />
                      </div>
                    </div>

                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-background border-2 border-foreground flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                      <Eye className="w-3 h-3" />
                      {formatViews(s.view_count)}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="font-display text-background text-sm font-black line-clamp-2 leading-snug tracking-tight">
                        {s.title}
                      </h3>
                    </div>
                  </a>
                );
              })}
        </div>

        <div className="text-center mt-14">
          <Button
            asChild
            size="xl"
            className="rounded-full bg-foreground text-background hover:bg-accent hover:text-accent-foreground border-2 border-foreground shadow-[6px_6px_0_hsl(var(--accent))] hover:shadow-[8px_8px_0_hsl(var(--primary))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-display font-black uppercase tracking-wider text-xs"
          >
            <a href="https://www.youtube.com/@Vacilateestopodcast/shorts" target="_blank" rel="noopener noreferrer">
              Ver todos los shorts
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ShortsSection;

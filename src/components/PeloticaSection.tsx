import { ExternalLink, ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import StickerMarquee from "@/components/StickerMarquee";
import StickerHeader from "@/components/StickerHeader";

const TICKER = ["PELOTICA DE GOMA", "★", "FENÓMENO GLOBAL 🌎", "✦", "DESDE VENEZUELA", "★", "VIRAL", "✦"];

const PeloticaSection = () => {
  return (
    <section id="pelotica-de-goma" className="relative overflow-hidden bg-background pt-0 pb-20 md:pb-28" aria-labelledby="pelotica-title">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -right-20 top-1/3 w-[28rem] h-[28rem] bg-primary/12 rounded-full blur-[140px]" />
        <div className="absolute -left-20 bottom-1/4 w-[28rem] h-[28rem] bg-accent/12 rounded-full blur-[140px]" />
      </div>

      <StickerMarquee items={TICKER} variant="accent" className="mb-16 md:mb-20" reverse />

      <div className="container mx-auto px-4 relative z-10">
        <StickerHeader
          badge="Fenómeno Global"
          badgeIcon={Sparkles}
          badgeVariant="accent"
          title="pelotica"
          highlight="de goma"
          description="Somos los creadores del fenómeno local y global de la Pelotica de Goma. Descubre la historia detrás de este movimiento que ha trascendido fronteras."
        />

        <div className="max-w-4xl mx-auto mb-10">
          <div className="relative bg-background rounded-3xl overflow-hidden border-2 border-foreground sticker-shadow-lg-accent" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src="https://www.youtube.com/embed/177jg-ARY5Y"
              title="Pelotica de Goma - La Historia"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="absolute top-0 left-0 w-full h-full border-0"
            />
          </div>
        </div>

        <div className="text-center">
          <Button
            asChild
            size="xl"
            className="rounded-full bg-foreground text-background hover:bg-accent hover:text-accent-foreground border-2 border-foreground shadow-[6px_6px_0_hsl(var(--accent))] hover:shadow-[8px_8px_0_hsl(var(--primary))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-display font-black uppercase tracking-wider text-xs"
          >
            <a href="https://www.peloticadegoma.com" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              Visitar Pelotica de Goma
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PeloticaSection;

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const PeloticaSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-accent/20 relative overflow-hidden" aria-labelledby="pelotica-title">
      {/* Background decoration */}
      <div className="absolute -right-20 top-1/3 w-60 md:w-80 h-60 md:h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute -left-20 bottom-1/4 w-40 md:w-60 h-40 md:h-60 bg-[#7DE8E8]/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <header className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-sm font-medium text-foreground">Fenómeno Global 🌎</span>
          </div>
          <h2 id="pelotica-title" className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pelotica de Goma
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-2">
            Somos los creadores del fenómeno local y global de la Pelotica de Goma. 
            Descubre la historia detrás de este movimiento que ha trascendido fronteras.
          </p>
        </header>

        {/* Video Embed */}
        <div className="max-w-4xl mx-auto mb-8 md:mb-10">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-elevated bg-card" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src="https://www.youtube.com/embed/177jg-ARY5Y"
              title="Pelotica de Goma - La Historia del fenómeno viral venezolano"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="absolute top-0 left-0 w-full h-full border-0"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a 
            href="https://www.peloticadegoma.com" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button variant="hero" size="lg" className="group">
              <ExternalLink className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Visitar Pelotica de Goma
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default PeloticaSection;

import { useEffect, useRef } from "react";
import { Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const TikTokSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load TikTok embed script
    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -left-20 bottom-0 w-60 h-60 bg-[#7DE8E8]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/10 border border-foreground/20 mb-4">
            <Play className="w-4 h-4 text-primary" fill="currentColor" />
            <span className="text-sm font-medium text-foreground">Contenido Viral</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Lo Último en TikTok
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Mira nuestro contenido más reciente. Entretenimiento y educación en formato corto. 
            ¡Fun Educaitment que nunca se queda quieto!
          </p>
        </div>

        {/* TikTok Embed Container */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          {/* TikTok Embed */}
          <div 
            ref={containerRef}
            className="w-full max-w-[325px] min-h-[580px] rounded-2xl overflow-hidden bg-card shadow-elevated"
          >
            <blockquote 
              className="tiktok-embed" 
              cite="https://www.tiktok.com/@vacilateestopodcast" 
              data-unique-id="vacilateestopodcast" 
              data-embed-from="embed_page" 
              data-embed-type="creator"
              style={{ maxWidth: "325px", minWidth: "288px" }}
            >
              <section>
                <a 
                  target="_blank" 
                  rel="noopener noreferrer"
                  href="https://www.tiktok.com/@vacilateestopodcast?refer=creator_embed"
                >
                  @vacilateestopodcast
                </a>
              </section>
            </blockquote>
          </div>

          {/* CTA Content */}
          <div className="text-center lg:text-left max-w-md">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-background" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">@vacilateestopodcast</h3>
                <p className="text-sm text-muted-foreground">Síguenos en TikTok</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-6">
              Shorts, clips virales, momentos épicos y todo el contenido que nos hace únicos. 
              ¡Únete a la comunidad más divertida de Venezuela!
            </p>

            <a 
              href="https://www.tiktok.com/@vacilateestopodcast" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="hero" size="lg" className="group">
                Ver más en TikTok
                <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TikTokSection;

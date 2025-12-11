import { Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const SocialReelsSection = () => {
  useEffect(() => {
    // Load TikTok embed script
    const tiktokScript = document.createElement("script");
    tiktokScript.src = "https://www.tiktok.com/embed.js";
    tiktokScript.async = true;
    document.body.appendChild(tiktokScript);

    // Load Instagram embed script
    const instaScript = document.createElement("script");
    instaScript.src = "https://www.instagram.com/embed.js";
    instaScript.async = true;
    document.body.appendChild(instaScript);

    return () => {
      document.body.removeChild(tiktokScript);
      document.body.removeChild(instaScript);
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
            Lo Último en Redes
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Mira nuestro contenido más reciente en TikTok e Instagram. 
            ¡Fun Educaitment que nunca se queda quieto!
          </p>
        </div>

        {/* Embeds Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* TikTok Embed */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
              TikTok
            </h3>
            <blockquote 
              className="tiktok-embed rounded-2xl overflow-hidden" 
              cite="https://www.tiktok.com/@vacilateesto/video/7344078628344335621" 
              data-video-id="7344078628344335621" 
              style={{ maxWidth: "325px", minWidth: "280px" }}
            >
              <section>
                <a 
                  target="_blank" 
                  title="@vacilateesto" 
                  href="https://www.tiktok.com/@vacilateesto?refer=embed"
                  rel="noopener noreferrer"
                >
                  @vacilateesto
                </a>
              </section>
            </blockquote>
          </div>

          {/* Instagram Embed */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </h3>
            <blockquote
              className="instagram-media rounded-2xl overflow-hidden"
              data-instgrm-permalink="https://www.instagram.com/p/C-TlbjTh5mj/"
              data-instgrm-version="14"
              style={{ 
                background: "#FFF", 
                border: "0", 
                borderRadius: "3px", 
                boxShadow: "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)", 
                margin: "1px", 
                maxWidth: "325px", 
                minWidth: "280px", 
                padding: "0", 
                width: "calc(100% - 2px)" 
              }}
            >
              <a 
                href="https://www.instagram.com/p/C-TlbjTh5mj/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-4 text-center text-muted-foreground"
              >
                Ver post en Instagram
              </a>
            </blockquote>
          </div>
        </div>

        {/* Follow CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Síguenos en todas las plataformas para no perderte ningún contenido
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="https://www.tiktok.com/@vacilateestopodcast" target="_blank" rel="noopener noreferrer">
              <Button variant="hero" size="lg" className="group">
                <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                TikTok
              </Button>
            </a>
            <a href="https://www.instagram.com/vacilateestopodcast/" target="_blank" rel="noopener noreferrer">
              <Button variant="heroOutline" size="lg" className="group">
                <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialReelsSection;

import { Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const SocialReelsSection = () => {
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

        {/* Social Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* TikTok Card */}
          <a 
            href="https://www.tiktok.com/@vacilateestopodcast" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group"
          >
            <div className="relative h-[400px] rounded-3xl overflow-hidden bg-foreground shadow-elevated transition-transform duration-500 group-hover:scale-[1.02]">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground to-foreground/90">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-20 h-20 border-2 border-background/30 rounded-full" />
                  <div className="absolute bottom-20 right-10 w-32 h-32 border-2 border-background/20 rounded-full" />
                  <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-background/20 rounded-full" />
                </div>
              </div>
              
              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                {/* TikTok Icon */}
                <div className="w-24 h-24 rounded-full bg-background/10 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" className="w-12 h-12 text-background" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-background mb-2">TikTok</h3>
                <p className="text-background/70 text-sm mb-2">@vacilateestopodcast</p>
                <p className="text-background/60 text-sm mb-6 max-w-xs">
                  Videos cortos, clips virales y los mejores momentos del ecosistema
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-background/10 text-background group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <span className="font-semibold">Ver TikToks</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </a>

          {/* Instagram Card */}
          <a 
            href="https://www.instagram.com/vacilateestopodcast/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group"
          >
            <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-elevated transition-transform duration-500 group-hover:scale-[1.02]">
              {/* Instagram Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-10 right-10 w-24 h-24 border-2 border-background/30 rounded-full" />
                  <div className="absolute bottom-16 left-10 w-28 h-28 border-2 border-background/20 rounded-full" />
                  <div className="absolute top-1/3 right-1/4 w-14 h-14 border-2 border-background/20 rounded-full" />
                </div>
              </div>
              
              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                {/* Instagram Icon */}
                <div className="w-24 h-24 rounded-full bg-background/10 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" className="w-12 h-12 text-background" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-background mb-2">Instagram</h3>
                <p className="text-background/70 text-sm mb-2">@vacilateestopodcast</p>
                <p className="text-background/60 text-sm mb-6 max-w-xs">
                  Reels, stories y fotos de las aventuras del equipo
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-background/10 text-background group-hover:bg-background group-hover:text-foreground transition-all duration-300">
                  <span className="font-semibold">Ver Reels</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </a>
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

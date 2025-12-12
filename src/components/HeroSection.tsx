import { Button } from "@/components/ui/button";
import { Play, Headphones, Users, Video, Star } from "lucide-react";
import Logo from "@/components/Logo";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20"
      aria-label="Vacílate Esto - El mejor podcast de Venezuela"
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#7DE8E8]/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/3 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-foreground">Uno de los Mejores Podcast de Venezuela 🇻🇪</span>
          </div>

          {/* Logo with SEO-friendly heading */}
          <div className="flex justify-center mb-8 animate-scale-in">
            <h1 className="sr-only">Vacílate Esto - El Mejor Podcast Hecho en Venezuela</h1>
            <Logo size="xl" className="animate-bounce-slow" />
          </div>

          {/* Subtitle with SEO keywords */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in leading-relaxed" style={{ animationDelay: "0.2s" }}>
            ¡El podcast venezolano que nunca se queda quieto! Somos una marca de contenido que mezcla 
            entretenimiento y educación. Podcast, shorts, lives y mucho más. 
            ¡El mejor podcast hecho en Venezuela! ✨👋
          </p>

          {/* CTA Buttons */}
          <nav className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }} aria-label="Acciones principales">
            <a 
              href="https://www.youtube.com/@Vacilateestopodcast" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Ver Vacílate Esto en YouTube - Uno de los mejores podcasts de Venezuela"
            >
              <Button variant="hero" size="xl" className="group">
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" aria-hidden="true" />
                Ver en YouTube
              </Button>
            </a>
            <a 
              href="https://open.spotify.com/show/2b2AeZVRxEFkNy1KKYkQG1" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Escuchar Vacílate Esto en Spotify - Mejor podcast venezolano"
            >
              <Button variant="heroOutline" size="xl" className="group">
                <Headphones className="w-5 h-5 group-hover:scale-110 transition-transform" aria-hidden="true" />
                Escuchar en Spotify
              </Button>
            </a>
          </nav>

          {/* Secondary Links */}
          <nav className="flex flex-wrap items-center justify-center gap-3 mt-6 animate-fade-in" style={{ animationDelay: "0.5s" }} aria-label="Nuestros proyectos">
            <a href="/podcast-en-la-cumbre">
              <Button variant="outline" size="default" className="group">
                Podcast en la Cumbre
              </Button>
            </a>
            <a href="/podcast-eterno">
              <Button variant="outline" size="default" className="group">
                Podcast Eterno
              </Button>
            </a>
            <a 
              href="https://www.peloticadegoma.com" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="default" className="group">
                Pelotica de Goma
              </Button>
            </a>
          </nav>

          {/* Stats with semantic markup */}
          <div 
            className="grid grid-cols-3 gap-3 sm:gap-6 max-w-md mx-auto mt-12 sm:mt-16 animate-fade-in px-2" 
            style={{ animationDelay: "0.6s" }}
            role="region"
            aria-label="Estadísticas del podcast venezolano"
          >
            <div className="text-center p-3 sm:p-4 rounded-2xl bg-card shadow-card">
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" aria-hidden="true" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">113K+</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">Suscriptores</div>
            </div>
            <div className="text-center p-3 sm:p-4 rounded-2xl bg-card shadow-card">
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <Video className="w-4 h-4 sm:w-5 sm:h-5 text-primary" aria-hidden="true" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">1.3K+</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">Videos</div>
            </div>
            <div className="text-center p-3 sm:p-4 rounded-2xl bg-card shadow-card">
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-primary" aria-hidden="true" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">4.9</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-primary" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

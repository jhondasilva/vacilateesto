import { Button } from "@/components/ui/button";
import { Play, Headphones } from "lucide-react";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-float-delayed" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Nuevo Episodio Cada Semana</span>
          </div>

          {/* Main Title */}
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-none mb-6 animate-slide-up">
            VACÍLATE
            <br />
            <span className="text-gradient">ESTO</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            El podcast que te hace reír, pensar y disfrutar. 
            Conversaciones sin filtro sobre la vida, cultura y todo lo demás.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button variant="hero" size="xl" className="group">
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Último Episodio
            </Button>
            <Button variant="heroSecondary" size="xl" className="group">
              <Headphones className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Explorar Podcast
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <div className="text-center">
              <div className="font-display text-4xl md:text-5xl text-gradient">200+</div>
              <div className="text-sm text-muted-foreground mt-1">Episodios</div>
            </div>
            <div className="text-center">
              <div className="font-display text-4xl md:text-5xl text-gradient">50K+</div>
              <div className="text-sm text-muted-foreground mt-1">Oyentes</div>
            </div>
            <div className="text-center">
              <div className="font-display text-4xl md:text-5xl text-gradient">4.9</div>
              <div className="text-sm text-muted-foreground mt-1">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

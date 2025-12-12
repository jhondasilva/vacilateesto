import { ExternalLink, MapPin, Star, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";

const RutaRamenSection = () => {
  const restaurants = [
    {
      name: "Sake",
      description: "Sabores y texturas que sorprenden en cada bocado.",
      rating: "4.3",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden" aria-labelledby="ramen-title">
      {/* Background decoration */}
      <div className="absolute -left-20 top-1/4 w-60 md:w-80 h-60 md:h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute -right-20 bottom-1/4 w-40 md:w-60 h-40 md:h-60 bg-[#7DE8E8]/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <header className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Utensils className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground">Vacílate Esto Comiendo</span>
          </div>
          <h2 id="ramen-title" className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            La Ruta del Ramen 🍜
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-2">
            Juan Sofa y Jhon Snacks se lanzan a buscar los mejores lugares para comer ramen en Caracas. 
            Desde caldos profundos hasta noodles artesanales, probamos y evaluamos cada elemento 
            para ayudarte a encontrar el mejor ramen de la ciudad.
          </p>
        </header>

        {/* Video Embed */}
        <div className="max-w-4xl mx-auto mb-8 md:mb-12">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-elevated bg-card" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src="https://www.youtube.com/embed/K6f1fHsqgg8"
              title="Ruta del Ramen en Caracas - Vacílate Esto Comiendo EP 1 - Mejor Ramen Venezuela"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="absolute top-0 left-0 w-full h-full border-0"
            />
          </div>
        </div>

        {/* Evaluation Criteria */}
        <div className="max-w-4xl mx-auto mb-12">
          <h3 className="text-xl font-bold text-foreground mb-6 text-center">
            ¿Cómo Evaluamos el Ramen?
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {["Caldo", "Noodles", "Proteína", "Toppings", "Presentación"].map((criteria, index) => (
              <div 
                key={criteria}
                className="text-center p-4 rounded-xl bg-card shadow-card hover:shadow-elevated transition-shadow"
              >
                <div className="text-2xl font-bold text-primary mb-1">{index + 1}</div>
                <div className="text-sm font-medium text-foreground">{criteria}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Restaurants Visited */}
        <div className="max-w-4xl mx-auto mb-10">
          <h3 className="text-xl font-bold text-foreground mb-6 text-center flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Restaurantes Visitados
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {restaurants.map((restaurant) => (
              <div 
                key={restaurant.name}
                className="p-6 rounded-2xl bg-card shadow-card hover:shadow-elevated transition-all border border-border/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-bold text-foreground">{restaurant.name}</h4>
                  <div className="flex items-center gap-1 text-primary">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{restaurant.rating}</span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">{restaurant.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            ¡La búsqueda del mejor ramen continúa! Mira todos los episodios en YouTube.
          </p>
          <a 
            href="https://www.youtube.com/@Vacilateestopodcast" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button variant="hero" size="lg" className="group">
              <ExternalLink className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Ver Más Episodios
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default RutaRamenSection;

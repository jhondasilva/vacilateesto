import { ExternalLink, MapPin, Star, Utensils, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import StickerMarquee from "@/components/StickerMarquee";
import StickerHeader from "@/components/StickerHeader";

const TICKER = ["RUTA DEL RAMEN", "★", "VACÍLATE COMIENDO", "✦", "CARACAS · VENEZUELA", "★", "🍜 MASTER", "✦"];

const restaurants = [
  { name: "Sake", description: "Sabores y texturas que sorprenden en cada bocado.", rating: "4.3" },
];

const criteria = ["Caldo", "Noodles", "Proteína", "Toppings", "Presentación"];

const RutaRamenSection = () => {
  return (
    <section id="ruta-ramen" className="relative overflow-hidden bg-background pt-0 pb-20 md:pb-28" aria-labelledby="ramen-title">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -left-20 top-1/4 w-[28rem] h-[28rem] bg-primary/12 rounded-full blur-[140px]" />
        <div className="absolute -right-20 bottom-1/4 w-[28rem] h-[28rem] bg-accent/12 rounded-full blur-[140px]" />
      </div>

      <StickerMarquee items={TICKER} variant="dark" className="mb-16 md:mb-20" />

      <div className="container mx-auto px-4 relative z-10">
        <StickerHeader
          badge="Vacílate Esto Comiendo"
          badgeIcon={Utensils}
          title="ruta del"
          highlight="ramen"
          description="Juan Sofa y Jhon Snacks se lanzan a buscar los mejores lugares para comer ramen en Caracas. Desde caldos profundos hasta noodles artesanales, probamos y evaluamos cada elemento."
        />

        {/* Video */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative bg-background rounded-3xl overflow-hidden border-2 border-foreground sticker-shadow-lg-primary" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src="https://www.youtube.com/embed/K6f1fHsqgg8"
              title="Ruta del Ramen en Caracas - Vacílate Esto Comiendo EP 1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="absolute top-0 left-0 w-full h-full border-0"
            />
          </div>
        </div>

        {/* Criteria */}
        <div className="max-w-4xl mx-auto mb-14">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground text-background border-2 border-foreground">
              <span className="font-display font-black text-[10px] uppercase tracking-widest">★ Cómo evaluamos</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
            {criteria.map((c, index) => (
              <div
                key={c}
                className={`text-center p-4 sm:p-5 rounded-2xl bg-background border-2 border-foreground hover:-translate-y-1 transition-all sticker-card-rotate sticker-shadow-${index % 2 === 0 ? "primary" : "accent"}`}
                style={{ transform: `rotate(${(index % 2 === 0 ? -1 : 1) * 1.5}deg)` }}
              >
                <div className="font-display font-black text-2xl sm:text-3xl text-foreground mb-1">{index + 1}</div>
                <div className="text-xs font-bold text-foreground uppercase tracking-wider">{c}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Restaurants */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground text-background border-2 border-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span className="font-display font-black text-[10px] uppercase tracking-widest">Restaurantes visitados</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
            {restaurants.map((restaurant, idx) => (
              <div
                key={restaurant.name}
                className={`p-5 sm:p-6 md:p-7 rounded-3xl bg-background border-2 border-foreground hover:-translate-y-1 transition-all sticker-shadow-${idx % 2 === 0 ? "primary" : "accent"}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-display font-black text-2xl text-foreground uppercase tracking-tight">{restaurant.name}</h4>
                  <div className="flex items-center gap-1 bg-primary text-primary-foreground border-2 border-foreground rounded-full px-3 py-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="font-display font-black text-sm">{restaurant.rating}</span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{restaurant.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            ¡La búsqueda del mejor ramen continúa! ✦
          </p>
          <Button
            asChild
            size="xl"
            className="rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground border-2 border-foreground shadow-[6px_6px_0_hsl(var(--primary))] hover:shadow-[8px_8px_0_hsl(var(--accent))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-display font-black uppercase tracking-wider text-xs"
          >
            <a href="https://www.youtube.com/@Vacilateestopodcast" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              Ver más episodios
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RutaRamenSection;

import { useState } from "react";
import { ExternalLink, MapPin, Star, Utensils, Flame, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import StickerMarquee from "@/components/StickerMarquee";
import StickerHeader from "@/components/StickerHeader";

const TICKER = ["RUTAS", "★", "VACÍLATE COMIENDO", "✦", "RAMEN & BBQ", "★", "🍜 🍖", "✦"];

type Ruta = {
  id: "ramen" | "bbq";
  label: string;
  icon: typeof Utensils;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  videoId: string;
  videoTitle: string;
  criteria: string[];
  placesLabel: string;
  places: { name: string; description: string; rating: string }[];
};

const RUTAS: Ruta[] = [
  {
    id: "ramen",
    label: "Ruta del Ramen",
    icon: Utensils,
    badge: "Vacílate Esto Comiendo",
    title: "ruta del",
    highlight: "ramen",
    description:
      "Juan Sofa y Jhon Snacks se lanzan a buscar los mejores lugares para comer ramen en Caracas. Desde caldos profundos hasta noodles artesanales, probamos y evaluamos cada elemento.",
    videoId: "K6f1fHsqgg8",
    videoTitle: "Ruta del Ramen en Caracas - Vacílate Esto Comiendo EP 1",
    criteria: ["Caldo", "Noodles", "Proteína", "Toppings", "Presentación"],
    placesLabel: "Restaurantes visitados",
    places: [
      { name: "Noraneko", description: "El mejor ramen de Venezuela. Puntuación perfecta del jurado.", rating: "5.0" },
      { name: "Selva de Paria", description: "Ramen artesanal con ingredientes de huerto propio. Sorpresa total.", rating: "4.7" },
      { name: "Omono", description: "Caldo profundo y los mejores fideos de Caracas. Cerdo impecable.", rating: "4.2" },
      { name: "Cachicamero", description: "Ramen venezolano con chuleta ahumada. Sabores que conectan.", rating: "3.8" },
      { name: "Taiko", description: "Esencia japonesa en Caracas. Caldo reconfortante, fideos discretos.", rating: "3.3" },
      { name: "Ramen Bar", description: "Propuesta agridulce con sabores asiáticos en plena Caracas.", rating: "3.3" },
      { name: "Ajisen Ramen", description: "Caldo sabroso pero fideos suaves y chashu por debajo del estándar.", rating: "3.3" },
      { name: "Itto", description: "Costilla y dumplings rescatan; caldo y noodles industrializados.", rating: "2.6" },
    ],
  },
  {
    id: "bbq",
    label: "Ruta del BBQ",
    icon: Flame,
    badge: "Vacílate Esto Comiendo",
    title: "ruta del",
    highlight: "bbq",
    description:
      "La Ruta del Ahumado nos llevó a Houston, Texas: brisket, costillas, pulled pork y música country. Recorrimos los templos del BBQ para encontrar el mejor humo de la ciudad.",
    videoId: "lT5oyPdurPM",
    videoTitle: "The Pit Room - La Ruta del BBQ en Houston",
    criteria: ["Brisket", "Costillas", "Pulled Pork", "Sides", "Ambiente"],
    placesLabel: "Paradas en Houston",
    places: [
      { name: "The Pit Room", description: "Vinimos por el brisket y el pulled pork se llevó el premio gordo del día.", rating: "4.5" },
      { name: "Truth Barbeque", description: "Brisket que se deshace, pork ribs jugosas y mac & cheese de campeonato.", rating: "4.8" },
    ],
  },
];

const RutasSection = () => {
  const [active, setActive] = useState<Ruta["id"]>("ramen");
  const ruta = RUTAS.find((r) => r.id === active)!;

  return (
    <section
      id="rutas"
      className="relative overflow-hidden bg-background pt-0 pb-20 md:pb-28"
      aria-labelledby="rutas-title"
      itemScope
      itemType="https://schema.org/WebPageElement"
    >
      <meta itemProp="name" content="Rutas · Series gastronómicas de Vacílate Esto" />
      <meta
        itemProp="description"
        content="Las rutas gastronómicas de Vacílate Esto: la Ruta del Ramen en Caracas y la Ruta del BBQ en Houston, con ranking, reseñas y formato Fun Educaitment."
      />
      <meta itemProp="url" content="https://www.vacilateesto.com/#rutas" />
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -left-20 top-1/4 w-[28rem] h-[28rem] bg-primary/12 rounded-full blur-[140px]" />
        <div className="absolute -right-20 bottom-1/4 w-[28rem] h-[28rem] bg-accent/12 rounded-full blur-[140px]" />
      </div>

      <StickerMarquee items={TICKER} variant="dark" className="mb-16 md:mb-20" />

      <div className="container mx-auto px-4 relative z-10">
        <StickerHeader
          titleId="rutas-title"
          badge="Vacílate Esto Comiendo"
          badgeIcon={Utensils}
          title="nuestras"
          highlight="rutas"
          description="Series gastronómicas donde recorremos ciudades buscando lo mejor de un solo plato. Hoy: la Ruta del Ramen en Caracas y la Ruta del BBQ en Houston."
        />

        {/* Selector de ruta */}
        <div className="flex justify-center gap-3 sm:gap-4 mb-10 flex-wrap" role="tablist" aria-label="Rutas gastronómicas">
          {RUTAS.map((r) => {
            const Icon = r.icon;
            const isActive = r.id === active;
            return (
              <button
                key={r.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(r.id)}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-full border-2 border-foreground font-display font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-0.5 ${
                  isActive
                    ? "bg-foreground text-background shadow-[5px_5px_0_hsl(var(--primary))]"
                    : "bg-background text-foreground shadow-[3px_3px_0_hsl(var(--accent))]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Intro de la ruta activa */}
        <p className="max-w-3xl mx-auto text-center text-muted-foreground mb-10">{ruta.description}</p>

        {/* Video */}
        <div className="max-w-4xl mx-auto mb-12">
          <div
            className="relative bg-background rounded-3xl overflow-hidden border-2 border-foreground sticker-shadow-lg-primary"
            style={{ paddingBottom: "56.25%" }}
          >
            <iframe
              key={ruta.videoId}
              src={`https://www.youtube.com/embed/${ruta.videoId}`}
              title={ruta.videoTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="absolute top-0 left-0 w-full h-full border-0"
            />
          </div>
        </div>

        {/* Criterios */}
        <div className="max-w-4xl mx-auto mb-14">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground text-background border-2 border-foreground">
              <span className="font-display font-black text-[10px] uppercase tracking-widest">★ Cómo evaluamos</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
            {ruta.criteria.map((c, index) => (
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

        {/* Lugares */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground text-background border-2 border-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span className="font-display font-black text-[10px] uppercase tracking-widest">{ruta.placesLabel}</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
            {ruta.places.map((place, idx) => (
              <div
                key={place.name}
                className={`p-5 sm:p-6 md:p-7 rounded-3xl bg-background border-2 border-foreground hover:-translate-y-1 transition-all sticker-shadow-${idx % 2 === 0 ? "primary" : "accent"}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-display font-black text-2xl text-foreground uppercase tracking-tight">{place.name}</h4>
                  <div className="flex items-center gap-1 bg-primary text-primary-foreground border-2 border-foreground rounded-full px-3 py-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="font-display font-black text-sm">{place.rating}</span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{place.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            {active === "ramen" ? "¡La búsqueda del mejor ramen continúa! ✦" : "¡La Ruta del Ahumado sigue sumando paradas! ✦"}
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

export default RutasSection;

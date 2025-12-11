import { Play, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const episodes = [
  {
    id: 1,
    title: "Las Historias Más Locas del Mercado",
    description: "Grabando en vivo desde el mercado local, entrevistamos a los vendedores más carismáticos y escuchamos sus historias increíbles.",
    duration: "1h 23min",
    date: "Dic 5, 2024",
    image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&q=80",
    isNew: true,
  },
  {
    id: 2,
    title: "Emprendedores Sin Miedo",
    description: "Conversamos con jóvenes emprendedores que dejaron todo para seguir sus sueños. Sus fracasos, éxitos y aprendizajes.",
    duration: "58min",
    date: "Nov 28, 2024",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80",
    isNew: false,
  },
  {
    id: 3,
    title: "La Música que nos Define",
    description: "Un viaje nostálgico por las canciones que marcaron nuestra generación y por qué la música tiene tanto poder emocional.",
    duration: "1h 05min",
    date: "Nov 21, 2024",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    isNew: false,
  },
];

const EpisodesSection = () => {
  return (
    <section id="episodes" className="py-24 bg-background relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Lo Más Reciente</span>
          <h2 className="font-display text-5xl md:text-6xl mt-3 mb-4">
            ÚLTIMOS EPISODIOS
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            No te pierdas nuestras conversaciones más recientes. Nuevo contenido cada semana.
          </p>
        </div>

        {/* Episodes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {episodes.map((episode, index) => (
            <article
              key={episode.id}
              className="group bg-card-gradient rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={episode.image}
                  alt={episode.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-16 h-16 rounded-full bg-primary flex items-center justify-center glow-primary hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-primary-foreground ml-1" />
                  </button>
                </div>

                {/* New Badge */}
                {episode.isNew && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-secondary rounded-full">
                    <span className="text-xs font-bold text-secondary-foreground uppercase">Nuevo</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-2xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {episode.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {episode.description}
                </p>
                
                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {episode.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {episode.date}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Ver Todos los Episodios
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EpisodesSection;

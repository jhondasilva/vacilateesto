import { Play, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const episodes = [
  {
    id: 1,
    title: "La flecha positiva de las redes: El motivador adicional",
    description: "Exploramos el poder de la motivación en las redes sociales y cómo puede transformar vidas.",
    views: "4 vistas",
    date: "Hace 2 horas",
    videoId: "lyxAHHQYQVk",
    image: "https://img.youtube.com/vi/lyxAHHQYQVk/maxresdefault.jpg",
    isNew: true,
  },
  {
    id: 2,
    title: "RORAIMA: 2.000 MILLONES de años de ancestralidad",
    description: "Un viaje épico por uno de los lugares más antiguos y místicos del planeta con JuanSofa y JhonSnacks.",
    views: "53K vistas",
    date: "Hace 2 semanas",
    videoId: "NZWSKJvOdXg",
    image: "https://img.youtube.com/vi/NZWSKJvOdXg/maxresdefault.jpg",
    isNew: false,
  },
  {
    id: 3,
    title: "Comunidades ancestrales vs. Digitales: ¿Qué define realmente una comunidad?",
    description: "Reflexionamos sobre qué es lo que realmente define a una comunidad en el mundo moderno.",
    views: "50K vistas",
    date: "Hace 3 semanas",
    videoId: "yceBDe5eF_o",
    image: "https://img.youtube.com/vi/yceBDe5eF_o/maxresdefault.jpg",
    isNew: false,
  },
  {
    id: 4,
    title: "Descubriendo selvas y tepuyes con los Brewer-Carías",
    description: "Una aventura increíble explorando los tesoros naturales de Venezuela con JhonSnacks y la familia Brewer.",
    views: "73K vistas",
    date: "Hace 1 mes",
    videoId: "cKOW9kR6Sxg",
    image: "https://img.youtube.com/vi/cKOW9kR6Sxg/maxresdefault.jpg",
    isNew: false,
  },
];

const EpisodesSection = () => {
  return (
    <section id="episodes" className="py-16 md:py-24 bg-muted/30 relative overflow-hidden" aria-labelledby="episodes-title">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <header className="text-center mb-10 md:mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Lo Más Reciente</span>
          <h2 id="episodes-title" className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4 text-foreground">
            Últimos Episodios
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto px-2">
            No te pierdas nuestras aventuras y conversaciones más recientes.
          </p>
        </header>

        {/* Episodes Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {episodes.map((episode, index) => (
            <a
              key={episode.id}
              href={`https://www.youtube.com/watch?v=${episode.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-background rounded-3xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-elevated block"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={episode.image}
                  alt={`Episodio: ${episode.title} - Vacílate Esto Podcast Venezuela`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
                  </div>
                </div>

                {/* New Badge */}
                {episode.isNew && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-primary rounded-full">
                    <span className="text-xs font-bold text-primary-foreground uppercase">Nuevo</span>
                  </div>
                )}

                {/* Duration/Views on image */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-white/90">
                  <div className="flex items-center gap-1 bg-foreground/50 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Eye className="w-3 h-3" />
                    {episode.views}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2 text-foreground">
                  {episode.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {episode.description}
                </p>
                
                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {episode.date}
                  </div>
                </div>
              </div>
            </a>
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

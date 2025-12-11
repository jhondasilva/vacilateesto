import { Play, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const episodes = [
  {
    id: 1,
    title: "Vacílate Esto 20 de julio de 2025",
    description: "El episodio más reciente del ecosistema de Fun Educaitment que nunca se queda quieto.",
    views: "Nuevo",
    date: "Julio 2025",
    videoId: "IYVb9IPgerc",
    image: "https://img.youtube.com/vi/IYVb9IPgerc/maxresdefault.jpg",
    isNew: true,
  },
  {
    id: 2,
    title: "Vacílate Esto 18 de mayo de 2025",
    description: "Contenido fresco con las mejores conversaciones y aventuras del equipo.",
    views: "50K views",
    date: "Mayo 2025",
    videoId: "rbN27-i-qhw",
    image: "https://img.youtube.com/vi/rbN27-i-qhw/maxresdefault.jpg",
    isNew: false,
  },
  {
    id: 3,
    title: "NORANEKO: El MEJOR RAMEN de VENEZUELA 🍜✨",
    description: "JuanSofa & JhonSnacks prueban el que podría ser el mejor ramen de Venezuela.",
    views: "73K views",
    date: "2024",
    videoId: "3LMk_9LwRwM",
    image: "https://img.youtube.com/vi/3LMk_9LwRwM/maxresdefault.jpg",
    isNew: false,
  },
  {
    id: 4,
    title: "How to recognize and escape manipulation? | Psychology Exposed",
    description: "Descubre cómo reconocer las señales de manipulación y protegerte de dinámicas tóxicas.",
    views: "45K views",
    date: "2024",
    videoId: "C886Do_Mhpk",
    image: "https://img.youtube.com/vi/C886Do_Mhpk/maxresdefault.jpg",
    isNew: false,
  },
];

const EpisodesSection = () => {
  return (
    <section id="episodes" className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Lo Más Reciente</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 text-foreground">
            Últimos Episodios
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            No te pierdas nuestras aventuras y conversaciones más recientes.
          </p>
        </div>

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
                  alt={episode.title}
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

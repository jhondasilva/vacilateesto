import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const platforms = [
  {
    name: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    color: "group-hover:text-[#FF0000]",
    link: "https://youtube.com/@Vacilateestopodcast",
    subscribers: "113K suscriptores",
  },
  {
    name: "Spotify",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
    color: "group-hover:text-[#1DB954]",
    link: "#",
    subscribers: "Podcast",
  },
  {
    name: "Apple Podcasts",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0H5.34zm6.525 2.568c2.336 0 4.448.902 6.056 2.587 1.224 1.272 1.912 2.619 2.264 4.392.12.59-.254.96-.624.96-.404 0-.636-.274-.744-.79-.272-1.31-.708-2.262-1.468-3.12-1.296-1.47-2.952-2.192-4.86-2.2h-.084c-2.356 0-4.14.96-5.456 2.906-.594.876-.924 1.9-1.138 3.166-.106.518-.348.78-.694.78h-.126c-.468-.052-.666-.472-.586-.96.256-1.548.808-2.903 1.816-4.166 1.596-2.004 3.864-3.142 6.644-3.555zm.072 2.664c1.932.072 3.54.79 4.77 2.124.78.848 1.212 1.726 1.476 2.976.096.468-.186.852-.648.852-.378 0-.588-.23-.696-.714-.264-1.2-.696-2.094-1.404-2.76-.828-.774-1.836-1.246-3.048-1.328-.144-.008-.288-.012-.432-.012-1.368-.024-2.532.45-3.522 1.422-.852.834-1.386 1.98-1.63 3.198-.073.366-.3.564-.657.564-.442 0-.696-.324-.618-.828.216-1.356.744-2.52 1.584-3.482 1.26-1.44 2.916-2.184 4.825-2.012zm-.096 2.508c1.308 0 2.388.39 3.276 1.182.78.696 1.188 1.392 1.44 2.412.09.36-.156.726-.57.762-.336.03-.594-.162-.72-.576-.228-.756-.564-1.32-1.068-1.746-.576-.486-1.296-.72-2.184-.756h-.132c-.786 0-1.446.198-2.016.624-.6.45-.984.99-1.236 1.746-.096.282-.312.492-.66.492h-.018c-.426-.006-.66-.336-.57-.762.234-.954.708-1.728 1.428-2.382.852-.774 1.92-1.158 3.03-1.158v.162zm0 3.24c.516 0 .96.192 1.332.564.372.372.564.816.564 1.332 0 .516-.192.96-.564 1.332-.372.372-.816.564-1.332.564-.516 0-.96-.192-1.332-.564-.372-.372-.564-.816-.564-1.332 0-.516.192-.96.564-1.332.372-.372.816-.564 1.332-.564z"/>
      </svg>
    ),
    color: "group-hover:text-[#FA57C1]",
    link: "#",
    subscribers: "Podcast",
  },
  {
    name: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
    color: "group-hover:text-[#E4405F]",
    link: "https://instagram.com/vacilateesto",
    subscribers: "Síguenos",
  },
];

const PlatformsSection = () => {
  return (
    <section id="platforms" className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Escúchanos Donde Quieras</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 text-foreground">
            Nuestras Plataformas
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Disponible en todas las plataformas principales. Elige tu favorita y empieza a disfrutar.
          </p>
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {platforms.map((platform, index) => (
            <a
              key={platform.name}
              href={platform.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex flex-col items-center justify-center p-8 bg-background rounded-3xl border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-elevated ${platform.color}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="text-muted-foreground group-hover:scale-110 transition-all duration-300">
                {platform.icon}
              </div>
              <span className="mt-4 font-semibold text-foreground group-hover:text-primary transition-colors">
                {platform.name}
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                {platform.subscribers}
              </span>
            </a>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-8 bg-background rounded-3xl border border-border shadow-card">
            <div className="w-16 h-16 rounded-full bg-[#25D366] flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-foreground font-bold text-lg">¿Tienes alguna pregunta?</p>
              <p className="text-muted-foreground">Escríbenos por WhatsApp y responderemos pronto</p>
            </div>
            <Button className="bg-[#25D366] hover:bg-[#128C7E] text-white">
              Chatear Ahora
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformsSection;

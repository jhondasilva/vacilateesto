import { 
  Mic,
  Utensils,
  Film,
  Radio,
  MapPin,
  Mail,
  MessageCircle,
  Star,
  Trophy,
  Smartphone,
  Play,
  Video
} from "lucide-react";

const contentFormats = [
  {
    title: "Vacílate Esto Cuentos",
    subtitle: "Shorts Diarios",
    description: "Cuentos y anécdotas de aproximadamente un minuto que salen todos los días. Contenido viral que conecta con la audiencia a través de historias cortas y entretenidas.",
    icon: Smartphone,
    color: "bg-accent",
    stats: "Diario · ~1 min",
    platforms: "Facebook, Instagram, TikTok, YouTube Shorts",
  },
  {
    title: "Podcast",
    subtitle: "Vacílate Esto",
    description: "Nuestro formato estrella de análisis y reflexiones profundas sobre historias, leyendas, datos curiosos y cultura venezolana. Episodios semanales de ~45 minutos que generan conversación.",
    icon: Mic,
    color: "bg-primary",
    stats: "Semanal · ~45 min",
    platforms: "Radio Circuito Líder, Televen TV, YouTube, Spotify",
  },
  {
    title: "Vacílate Esto Comiendo",
    subtitle: "Serie Gastronómica",
    description: "Juan y Jhon se lanzan a probar distintas propuestas gastronómicas, explorando cada detalle, las comidas y las experiencias desde lugares sencillos hasta restaurantes sofisticados.",
    icon: Utensils,
    color: "bg-accent",
    stats: "Ruta del Ramen",
  },
  {
    title: "Metraje",
    subtitle: "Documental",
    description: "Jhon lleva a Juan o Juan lleva a Jhon a un lugar fuera del estudio y le explica por qué le lleva a ese lugar. Sirve de excusa para mostrarle a la comunidad de Vacílate Esto lugares insólitos y sus historias.",
    icon: Film,
    color: "bg-primary",
    stats: "Formato aventura",
  },
  {
    title: "Lives",
    subtitle: "En Vivo",
    description: "Hacer un podcast es divertido, pero con público es mejor. Transformamos nuestro formato de estudio a una experiencia totalmente en vivo, donde nos relajamos y compartimos con la audiencia.",
    icon: Radio,
    color: "bg-accent",
    stats: "Shows en vivo",
  },
  {
    title: "Streaming",
    subtitle: "TikTok Live",
    description: "Transmisiones en vivo en TikTok desde la grabación de nuestro podcast, fútbol en vivo o proyectos especiales como Roraima. Contenido interactivo que conecta en tiempo real con nuestra comunidad.",
    icon: Video,
    color: "bg-primary",
    stats: "En directo",
  },
  {
    title: "Guerra de Comerciales",
    subtitle: "Campeonato Nacional",
    description: "Torneo estilo Mundial de Fútbol donde enfrentamos los comerciales más icónicos de Venezuela. 40,773 votos, 1.35M impresiones y Covencaucho como campeón absoluto.",
    icon: Trophy,
    color: "bg-primary",
    stats: "40K+ votos",
    platforms: "Instagram, TikTok",
  },
  {
    title: "Rutas",
    subtitle: "Exploraciones Temáticas",
    description: "Series de exploración donde recorremos lugares con un tema específico. Como la Ruta del Ramen, donde probamos y evaluamos los mejores restaurantes de ramen en la ciudad.",
    icon: MapPin,
    color: "bg-accent",
    stats: "Series temáticas",
    platforms: "TikTok, Instagram, YouTube",
  },
  {
    title: "Newsletter",
    subtitle: "Semanal",
    description: "Semanalmente enviamos un boletín informativo donde compartimos contenido curado y lo más visto del ecosistema esa semana.",
    icon: Mail,
    color: "bg-primary",
    stats: "Contenido curado",
  },
  {
    title: "Canales de Difusión",
    subtitle: "Comunidad VIP",
    description: "Canales exclusivos en Instagram y WhatsApp con contenidos especiales para nuestras comunidades más fieles. Acceso directo y cercano con nuestra audiencia.",
    icon: MessageCircle,
    color: "bg-accent",
    stats: "Instagram y WhatsApp",
  },
  {
    title: "Proyectos Especiales",
    subtitle: "Producciones Únicas",
    description: "Proyectos con identidad propia que nacen del ecosistema Vacílate Esto: Podcast Eterno, Podcast en la Cumbre y Pelotica de Goma. Cada uno con su audiencia y comunidad.",
    icon: Star,
    color: "bg-primary",
    stats: "3 proyectos realizados",
  },
  {
    title: "Vacílate El Mundial",
    subtitle: "Cobertura Especial 2026",
    description: "El Mundial de Fútbol 2026 visto desde los ojos de Vacílate Esto. Una cobertura única con nuestro estilo, análisis y entretenimiento de febrero a julio 2026.",
    icon: Trophy,
    color: "bg-accent",
    stats: "Feb - Jul 2026",
  },
];

const EcosystemSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden" aria-labelledby="ecosystem-title">
      {/* Studio neon background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 w-72 md:w-[32rem] h-72 md:h-[32rem] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-80 md:w-[36rem] h-80 md:h-[36rem] bg-accent/10 rounded-full blur-[120px]" />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <header className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-4">
            <Play className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            <span className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">Formatos de Contenido</span>
          </div>
          <h2 id="ecosystem-title" className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 px-2 tracking-tight">
            Nuestro Ecosistema de <span className="text-gradient">Contenido</span>
          </h2>
          <div className="neon-divider w-32 mx-auto mb-5" />
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-2 leading-relaxed">
            Múltiples formatos para conectar con nuestra audiencia de diferentes maneras
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {contentFormats.map((format, index) => {
            const isAccent = format.color === "bg-accent";
            const iconTextColor = isAccent ? "text-accent-foreground" : "text-primary-foreground";
            return (
              <article
                key={index}
                className="group relative bg-card rounded-3xl p-7 md:p-8 border border-border shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Hover gradient wash */}
                <div className="absolute inset-0 bg-studio opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true" />

                <div className="relative">
                  <div className={`w-14 h-14 ${format.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-soft`}>
                    <format.icon className={`w-7 h-7 ${iconTextColor}`} aria-hidden="true" />
                  </div>
                  <div className="text-[11px] md:text-xs font-semibold text-primary mb-1.5 uppercase tracking-wider">{format.subtitle}</div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 tracking-tight">{format.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {format.description}
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-xs font-semibold text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {format.stats}
                  </div>
                  {format.platforms && (
                    <p className="text-xs text-muted-foreground mt-3">
                      {format.platforms}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;

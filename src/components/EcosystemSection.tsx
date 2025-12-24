import { 
  Mic,
  Utensils,
  Film,
  Radio,
  MapPin,
  Mail,
  Footprints,
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
    color: "bg-[#7DE8E8]",
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
    color: "bg-[#7DE8E8]",
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
    color: "bg-[#7DE8E8]",
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
    color: "bg-[#7DE8E8]",
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
    title: "Caminado",
    subtitle: "Formato Aventura",
    description: "Un formato más aventurero de nuestro ecosistema, donde nos atrevemos a caminar partes de nuestro país y registramos todo el recorrido.",
    icon: Footprints,
    color: "bg-primary",
    stats: "Exploraciones a pie",
  },
  {
    title: "Canales de Difusión",
    subtitle: "Comunidad VIP",
    description: "Canales exclusivos en Instagram y WhatsApp con contenidos especiales para nuestras comunidades más fieles. Acceso directo y cercano con nuestra audiencia.",
    icon: MessageCircle,
    color: "bg-[#7DE8E8]",
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
    color: "bg-[#7DE8E8]",
    stats: "Feb - Jul 2026",
  },
];

const EcosystemSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden" aria-labelledby="ecosystem-title">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 w-48 md:w-72 h-48 md:h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 md:w-96 h-64 md:h-96 bg-[#7DE8E8] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <header className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Play className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground">Formatos de Contenido</span>
          </div>
          <h2 id="ecosystem-title" className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 px-2">
            Nuestro Ecosistema de <span className="text-primary">Contenido</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto px-2">
            Múltiples formatos para conectar con nuestra audiencia de diferentes maneras
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {contentFormats.map((format, index) => (
            <article 
              key={index}
              className="group bg-card rounded-2xl md:rounded-3xl p-6 md:p-8 border border-border shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 md:w-14 md:h-14 ${format.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform`}>
                <format.icon className="w-6 h-6 md:w-7 md:h-7 text-background" aria-hidden="true" />
              </div>
              <div className="text-xs md:text-sm font-medium text-primary mb-1">{format.subtitle}</div>
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 md:mb-3">{format.title}</h3>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-3 md:mb-4">
                {format.description}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-[10px] md:text-xs font-medium text-foreground">
                {format.stats}
              </div>
              {format.platforms && (
                <p className="text-[10px] md:text-xs text-muted-foreground mt-2 md:mt-3">
                  {format.platforms}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;

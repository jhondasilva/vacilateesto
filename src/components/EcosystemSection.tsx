import {
  Mic, Utensils, Film, Radio, MapPin, Mail,
  MessageCircle, Star, Trophy, Smartphone, Play, Video,
} from "lucide-react";
import StickerMarquee from "@/components/StickerMarquee";
import StickerHeader from "@/components/StickerHeader";

const contentFormats = [
  { title: "Vacílate Esto Cuentos", subtitle: "Shorts Diarios", description: "Cuentos y anécdotas de aproximadamente un minuto que salen todos los días. Contenido viral que conecta con la audiencia a través de historias cortas y entretenidas.", icon: Smartphone, color: "accent" as const, stats: "Diario · ~1 min", platforms: "Facebook, Instagram, TikTok, YouTube Shorts" },
  { title: "Podcast", subtitle: "Vacílate Esto", description: "Nuestro formato estrella de análisis y reflexiones profundas sobre historias, leyendas, datos curiosos y cultura venezolana. Episodios semanales de ~45 minutos que generan conversación.", icon: Mic, color: "primary" as const, stats: "Semanal · ~45 min", platforms: "Radio Circuito Líder, Televen TV, YouTube, Spotify" },
  { title: "Vacílate Esto Comiendo", subtitle: "Serie Gastronómica", description: "Juan y Jhon se lanzan a probar distintas propuestas gastronómicas, explorando cada detalle, las comidas y las experiencias desde lugares sencillos hasta restaurantes sofisticados.", icon: Utensils, color: "accent" as const, stats: "Ruta del Ramen" },
  { title: "Metraje", subtitle: "Documental", description: "Jhon lleva a Juan o Juan lleva a Jhon a un lugar fuera del estudio y le explica por qué le lleva a ese lugar. Sirve de excusa para mostrarle a la comunidad de Vacílate Esto lugares insólitos y sus historias.", icon: Film, color: "primary" as const, stats: "Formato aventura" },
  { title: "Lives", subtitle: "En Vivo", description: "Hacer un podcast es divertido, pero con público es mejor. Transformamos nuestro formato de estudio a una experiencia totalmente en vivo, donde nos relajamos y compartimos con la audiencia.", icon: Radio, color: "accent" as const, stats: "Shows en vivo" },
  { title: "Streaming", subtitle: "TikTok Live", description: "Transmisiones en vivo en TikTok desde la grabación de nuestro podcast, fútbol en vivo o proyectos especiales como Roraima. Contenido interactivo que conecta en tiempo real con nuestra comunidad.", icon: Video, color: "primary" as const, stats: "En directo" },
  { title: "Guerra de Comerciales", subtitle: "Campeonato Nacional", description: "Torneo estilo Mundial de Fútbol donde enfrentamos los comerciales más icónicos de Venezuela. 40,773 votos, 1.35M impresiones y Covencaucho como campeón absoluto.", icon: Trophy, color: "primary" as const, stats: "40K+ votos", platforms: "Instagram, TikTok" },
  { title: "Rutas", subtitle: "Exploraciones Temáticas", description: "Series de exploración donde recorremos lugares con un tema específico. Como la Ruta del Ramen, donde probamos y evaluamos los mejores restaurantes de ramen en la ciudad.", icon: MapPin, color: "accent" as const, stats: "Series temáticas", platforms: "TikTok, Instagram, YouTube" },
  { title: "Newsletter", subtitle: "Semanal", description: "Semanalmente enviamos un boletín informativo donde compartimos contenido curado y lo más visto del ecosistema esa semana.", icon: Mail, color: "primary" as const, stats: "Contenido curado" },
  { title: "Canales de Difusión", subtitle: "Comunidad VIP", description: "Canales exclusivos en Instagram y WhatsApp con contenidos especiales para nuestras comunidades más fieles. Acceso directo y cercano con nuestra audiencia.", icon: MessageCircle, color: "accent" as const, stats: "Instagram y WhatsApp" },
  { title: "Proyectos Especiales", subtitle: "Producciones Únicas", description: "Proyectos con identidad propia que nacen del ecosistema Vacílate Esto: Podcast Eterno, Podcast en la Cumbre y Pelotica de Goma. Cada uno con su audiencia y comunidad.", icon: Star, color: "primary" as const, stats: "3 proyectos realizados" },
  { title: "Vacílate El Mundial", subtitle: "Cobertura Especial 2026", description: "El Mundial de Fútbol 2026 visto desde los ojos de Vacílate Esto. Una cobertura única con nuestro estilo, análisis y entretenimiento de febrero a julio 2026.", icon: Trophy, color: "accent" as const, stats: "Feb - Jul 2026" },
];

const TICKER = ["ECOSISTEMA", "★", "12 FORMATOS", "✦", "MULTIPLATAFORMA", "★", "VACÍLATE ESTO", "✦"];

const EcosystemSection = () => {
  return (
    <section id="ecosistema" className="relative overflow-hidden bg-background pt-0 pb-20 md:pb-28" aria-labelledby="ecosystem-title" itemScope itemType="https://schema.org/WebPageElement">
      <meta itemProp="name" content="Ecosistema de contenido Vacílate Esto" />
      <meta itemProp="description" content="Formatos del ecosistema: Podcast, Cuentos (shorts), Metraje (docuseries), Streaming (lives) y experiencias presenciales. Contenido 24/7 multiplataforma con Fun Educaitment." />
      <meta itemProp="url" content="https://www.vacilateesto.com/#ecosistema" />
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 w-[32rem] h-[32rem] bg-primary/12 rounded-full blur-[140px]" />
        <div className="absolute bottom-20 right-10 w-[36rem] h-[36rem] bg-accent/12 rounded-full blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      <StickerMarquee items={TICKER} variant="dark" className="mb-16 md:mb-20" />

      <div className="container mx-auto px-4 relative z-10">
        <StickerHeader
          badge="Formatos de contenido"
          badgeIcon={Play}
          title="nuestro"
          highlight="ecosistema"
          description="Múltiples formatos para conectar con nuestra audiencia de diferentes maneras."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {contentFormats.map((format, index) => {
            const isAccent = format.color === "accent";
            const rotation = (index % 3 === 0 ? -1 : index % 3 === 1 ? 0 : 1) * 1;
            return (
              <article
                key={index}
                className={`group relative bg-background rounded-3xl p-5 sm:p-6 md:p-7 border-2 border-foreground transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 sticker-card-rotate sticker-shadow-${format.color}`}
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 ${isAccent ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"} rounded-2xl border-2 border-foreground flex items-center justify-center mb-4 sm:mb-5 group-hover:rotate-6 transition-transform duration-300 shadow-[3px_3px_0_hsl(var(--foreground))] sm:shadow-[4px_4px_0_hsl(var(--foreground))]`}
                >
                  <format.icon className="w-6 h-6 sm:w-7 sm:h-7" aria-hidden="true" />
                </div>
                <div className="font-display font-black text-[10px] text-foreground mb-1.5 uppercase tracking-widest opacity-60">{format.subtitle}</div>
                <h3 className="font-display font-black text-lg sm:text-xl md:text-2xl text-foreground mb-3 tracking-tight leading-tight uppercase">{format.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {format.description}
                </p>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-foreground text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0_hsl(var(--foreground))] ${
                    isAccent ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
                  }`}
                >
                  ★ {format.stats}
                </div>
                {format.platforms && (
                  <p className="text-[11px] text-muted-foreground mt-3 font-semibold uppercase tracking-wider">
                    {format.platforms}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;

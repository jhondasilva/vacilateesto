import { 
  Tv, 
  Calendar, 
  Database, 
  ShoppingBag,
  Play,
  Mountain,
  Gamepad2,
  Trophy,
  Cookie,
  Shirt,
  ExternalLink,
  ArrowRight,
  Video,
  BarChart3,
  Coins,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const businessArms = [
  {
    id: "media",
    title: "Media & Narrativa",
    subtitle: "El Núcleo",
    description: "El motor que genera confianza masiva. Podcast, shorts, lives, docuseries. El contenido no es el producto final; es el motor de marketing para todo el ecosistema.",
    icon: Tv,
    gradient: "from-primary to-accent",
    bgGradient: "from-primary/10 to-accent/10",
    products: [
      { name: "Podcast Vacílate Esto", link: "https://youtube.com/@Vacilateestopodcast" },
      { name: "Vacílate El Mundial 2026", link: "/vacilate-el-mundial" },
      { name: "Vacílate Esto Cuentos", link: "https://www.tiktok.com/@vacilateesto" },
    ]
  },
  {
    id: "experiences",
    title: "Experiencias",
    subtitle: "El Brazo Físico",
    description: "Sacamos a la gente de la pantalla y la llevamos al mundo físico. Eventos sold-out que generan su propio contenido viral. La nostalgia y la innovación se encuentran.",
    icon: Mountain,
    gradient: "from-primary to-[#9000ff]",
    bgGradient: "from-primary/10 to-[#9000ff]/10",
    products: [
      { name: "Pelotica de Goma", link: "https://www.peloticadegoma.com" },
      { name: "Podcast en la Cumbre", link: "/podcast-en-la-cumbre" },
      { name: "Eventos en Vivo", link: null },
    ]
  },
  {
    id: "tech",
    title: "Tecnología & Data",
    subtitle: "El Cerebro",
    description: "First-party data. Dejamos de depender del algoritmo. Ahora somos dueños de la relación con el fan: sus correos, sus teléfonos, sus preferencias.",
    icon: Database,
    gradient: "from-accent to-[#0066ff]",
    bgGradient: "from-accent/10 to-[#0066ff]/10",
    products: [
      { name: "La Quiniela", link: "https://laquiniela.vacilateesto.com" },
      { name: "Manager Pelotica", link: "https://manager.peloticadegoma.com" },
      { name: "Newsletter Semanal", link: null },
    ]
  },
  {
    id: "retail",
    title: "Retail & Consumo",
    subtitle: "La Nueva Frontera",
    description: "Monetización directa. Dejamos de depender 100% de los presupuestos de marketing de otras marcas. Ahora tenemos nuestros propios productos en el anaquel.",
    icon: ShoppingBag,
    gradient: "from-[#f59e0b] to-primary",
    bgGradient: "from-[#f59e0b]/10 to-primary/10",
    products: [
      { name: "Merchandising", link: null },
    ]
  },
];

const MediaHoldingSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden" aria-labelledby="media-holding-title">
      {/* Studio neon background */}
      <div className="absolute inset-0 opacity-50 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-soft mb-6">
            <Play className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-medium text-foreground tracking-wide">Ecosistema de Entretenimiento</span>
          </div>
          <h2 id="media-holding-title" className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Más que contenido: <span className="text-gradient">Un Media Holding</span>
          </h2>
          <p className="font-body text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            No vendemos solo atención. Convertimos la atención en activos propios: Data, Experiencias y Productos de Consumo.
            Un ecosistema circular donde el éxito de cada unidad alimenta a las demás.
          </p>
        </header>

        {/* Flywheel Visual */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {businessArms.map((arm, index) => (
            <article 
              key={arm.id}
              className={`group relative bg-card rounded-3xl p-6 md:p-8 border border-border hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 shadow-soft hover:shadow-elevated overflow-hidden`}
            >
              {/* Soft tint background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${arm.bgGradient} opacity-60 pointer-events-none`} aria-hidden="true" />
              <div className="relative z-10">
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${arm.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                <arm.icon className="w-7 h-7 text-primary-foreground" aria-hidden="true" />
              </div>

              {/* Content */}
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                {arm.subtitle}
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3 tracking-tight">{arm.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
                {arm.description}
              </p>

              {/* Products */}
              <div className="space-y-2">
                {arm.products.map((product, idx) => (
                  product.link ? (
                    product.link.startsWith('http') ? (
                      <a
                        key={idx}
                        href={product.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors group/link"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {product.name}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <Link
                        key={idx}
                        to={product.link}
                        className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors group/link"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {product.name}
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      </Link>
                    )
                  ) : (
                    <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                      {product.name}
                    </div>
                  )
                ))}
              </div>
              </div>

              {/* Connection Arrow */}
              {index < businessArms.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                  <div className="w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Flywheel Explanation */}
        <div className="bg-card rounded-3xl p-8 md:p-12 border border-border shadow-soft max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-3 tracking-tight">El Flywheel Vacílate</h3>
            <p className="font-body text-muted-foreground">
              Nuestro negocio ya no es lineal, es circular. El éxito de una unidad alimenta a la otra.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 text-center relative">
            {/* Flechas decorativas */}
            <div className="hidden md:flex absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 text-primary/30">
              <ArrowRight className="w-8 h-8" />
            </div>
            <div className="hidden md:flex absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 text-accent/40">
              <ArrowRight className="w-8 h-8" />
            </div>
            
            <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Video className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="font-display font-bold text-lg mb-2">Contenido</div>
              <div className="text-sm text-muted-foreground">
                Genera audiencia y confianza masiva
              </div>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-accent/15 to-accent/5 rounded-2xl border border-accent/30 hover:border-accent/50 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-accent to-accent/70 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <BarChart3 className="w-7 h-7 text-foreground" />
              </div>
              <div className="font-display font-bold text-lg mb-2">Data</div>
              <div className="text-sm text-muted-foreground">
                Construye relación directa con el fan
              </div>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-2xl border border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Coins className="w-7 h-7 text-white" />
              </div>
              <div className="font-display font-bold text-lg mb-2">Monetización</div>
              <div className="text-sm text-muted-foreground">
                Financia más y mejor contenido
              </div>
            </div>
          </div>
          
          {/* Indicador circular */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
              <span>Ciclo continuo de crecimiento</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaHoldingSection;

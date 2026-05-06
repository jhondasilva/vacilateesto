import { Tv, Database, ShoppingBag, Mountain, ExternalLink, ArrowRight, Video, BarChart3, Coins, RefreshCw, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import StickerMarquee from "@/components/StickerMarquee";
import StickerHeader from "@/components/StickerHeader";

const businessArms = [
  { id: "media", title: "Media & Narrativa", subtitle: "El Núcleo", description: "El motor que genera confianza masiva. Podcast, shorts, lives, docuseries. El contenido no es el producto final; es el motor de marketing para todo el ecosistema.", icon: Tv, color: "primary" as const, products: [
    { name: "Podcast Vacílate Esto", link: "https://youtube.com/@Vacilateestopodcast" },
    { name: "Vacílate El Fútbol 2026", link: "/vacilate-el-futbol" },
    { name: "Vacílate Esto Cuentos", link: "https://www.tiktok.com/@vacilateesto" },
  ]},
  { id: "experiences", title: "Experiencias", subtitle: "El Brazo Físico", description: "Sacamos a la gente de la pantalla y la llevamos al mundo físico. Eventos sold-out que generan su propio contenido viral. La nostalgia y la innovación se encuentran.", icon: Mountain, color: "accent" as const, products: [
    { name: "Pelotica de Goma", link: "https://www.peloticadegoma.com" },
    { name: "Podcast en la Cumbre", link: "/podcast-en-la-cumbre" },
    { name: "Eventos en Vivo", link: null },
  ]},
  { id: "tech", title: "Tecnología & Data", subtitle: "El Cerebro", description: "First-party data. Dejamos de depender del algoritmo. Ahora somos dueños de la relación con el fan: sus correos, sus teléfonos, sus preferencias.", icon: Database, color: "primary" as const, products: [
    { name: "La Quiniela", link: "https://laquiniela.vacilateesto.com" },
    { name: "Manager Pelotica", link: "https://manager.peloticadegoma.com" },
    { name: "Newsletter Semanal", link: null },
  ]},
  { id: "retail", title: "Retail & Consumo", subtitle: "La Nueva Frontera", description: "Monetización directa. Dejamos de depender 100% de los presupuestos de marketing de otras marcas. Ahora tenemos nuestros propios productos en el anaquel.", icon: ShoppingBag, color: "accent" as const, products: [
    { name: "Merchandising", link: null },
  ]},
];

const TICKER = ["MEDIA HOLDING", "★", "4 UNIDADES", "✦", "FLYWHEEL CIRCULAR", "★", "DATA + EXPERIENCIAS", "✦"];

const MediaHoldingSection = () => {
  return (
    <section id="media-holding" className="relative overflow-hidden bg-background pt-0 pb-20 md:pb-28" aria-labelledby="media-holding-title" itemScope itemType="https://schema.org/WebPageElement">
      <meta itemProp="name" content="Media Holding · El Ecosistema Vacílate Esto" />
      <meta itemProp="description" content="Vacílate Esto opera como un Media Holding con 4 unidades: Media & Narrativa (podcast, shorts, lives), Experiencias (Pelotica de Goma, Podcast en la Cumbre, eventos), Tecnología & Data (La Quiniela, Vacílalo) y Retail & Consumo (Chocolates LATE)." />
      <meta itemProp="url" content="https://www.vacilateesto.com/#media-holding" />
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-[32rem] h-[32rem] bg-primary/12 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[32rem] h-[32rem] bg-accent/12 rounded-full blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      <StickerMarquee items={TICKER} variant="dark" className="mb-16 md:mb-20" />

      <div className="container mx-auto px-4 relative z-10">
        <StickerHeader
        titleId="media-holding-title"
          badge="Más que contenido"
          badgeIcon={Sparkles}
          title="un media"
          highlight="holding"
          description="No vendemos solo atención. Convertimos la atención en activos propios: Data, Experiencias y Productos de Consumo. Un ecosistema circular donde el éxito de cada unidad alimenta a las demás."
        />

        {/* Business arms grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-12 md:mb-16">
          {businessArms.map((arm, index) => {
            const isAccent = arm.color === "accent";
            const rotation = (index % 2 === 0 ? -1 : 1) * 1;
            return (
              <article
                key={arm.id}
                className={`group relative bg-background rounded-3xl p-5 sm:p-6 md:p-7 border-2 border-foreground transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 sticker-card-rotate sticker-shadow-${arm.color}`}
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-foreground flex items-center justify-center mb-4 sm:mb-5 group-hover:rotate-6 transition-transform shadow-[3px_3px_0_hsl(var(--foreground))] sm:shadow-[4px_4px_0_hsl(var(--foreground))] ${isAccent ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}`}>
                  <arm.icon className="w-6 h-6 sm:w-7 sm:h-7" aria-hidden="true" />
                </div>
                <div className="font-display font-black text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                  {arm.subtitle}
                </div>
                <h3 className="font-display font-black text-lg sm:text-xl text-foreground mb-3 tracking-tight uppercase">{arm.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-5">
                  {arm.description}
                </p>

                <div className="space-y-2 pt-4 border-t-2 border-dashed border-border">
                  {arm.products.map((product, idx) => (
                    product.link ? (
                      product.link.startsWith('http') ? (
                        <a key={idx} href={product.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors group/link">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {product.name}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity ml-auto" />
                        </a>
                      ) : (
                        <Link key={idx} to={product.link} className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors group/link">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {product.name}
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity ml-auto" />
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
              </article>
            );
          })}
        </div>

        {/* Flywheel card */}
        <div className="relative bg-background rounded-3xl p-6 sm:p-8 md:p-12 border-2 border-foreground sticker-shadow-lg-foreground max-w-5xl mx-auto">
          <div className="absolute -top-4 left-4 sm:left-8 bg-foreground text-background px-3 py-1.5 sm:px-4 rounded-full border-2 border-foreground">
            <span className="font-display font-black text-[10px] uppercase tracking-widest">★ El Flywheel Vacílate</span>
          </div>

          <div className="text-center mb-8 sm:mb-10 mt-2">
            <h3 className="font-display font-black text-2xl sm:text-3xl md:text-4xl tracking-tight uppercase mb-3">Negocio Circular</h3>
            <p className="font-body text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Nuestro negocio ya no es lineal, es circular. El éxito de una unidad alimenta a la otra.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6 relative">
            {[
              { icon: Video, title: "Contenido", desc: "Genera audiencia y confianza masiva", color: "primary" },
              { icon: BarChart3, title: "Data", desc: "Construye relación directa con el fan", color: "accent" },
              { icon: Coins, title: "Monetización", desc: "Financia más y mejor contenido", color: "primary" },
            ].map((step, i) => (
              <div
                key={i}
                className={`p-5 sm:p-6 rounded-2xl border-2 border-foreground bg-background sticker-card-rotate hover:-translate-y-1 transition-transform sticker-shadow-${step.color}`}
                style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 1}deg)` }}
              >
                <div className={`w-14 h-14 rounded-2xl border-2 border-foreground flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0_hsl(var(--foreground))] ${step.color === "accent" ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}`}>
                  <step.icon className="w-7 h-7" />
                </div>
                <div className="font-display font-black text-lg text-center mb-2 uppercase tracking-tight">{step.title}</div>
                <div className="text-sm text-muted-foreground text-center">{step.desc}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <div className="inline-flex items-center gap-2 bg-foreground text-background rounded-full px-4 py-2 border-2 border-foreground">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="font-display font-black text-[10px] uppercase tracking-widest">Ciclo continuo de crecimiento</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaHoldingSection;

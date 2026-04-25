import { Trophy, Users, Eye, Heart, Share2, MessageCircle, Bookmark, TrendingUp, Download, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoGuerraComerciales from "@/assets/logo-guerra-comerciales.png";
import StickerMarquee from "@/components/StickerMarquee";
import StickerHeader from "@/components/StickerHeader";

const TICKER = ["GUERRA DE COMERCIALES", "★", "40K+ VOTOS", "✦", "1.35M IMPRESIONES", "★", "COVENCAUCHO CAMPEÓN", "✦"];

const stats = [
  { icon: Eye, value: "1.35M", label: "Impresiones" },
  { icon: Users, value: "618K", label: "Cuentas alcanzadas" },
  { icon: Heart, value: "40,773", label: "Votos totales" },
  { icon: TrendingUp, value: "27.95%", label: "Engagement máx" },
];

const instagramStats = [
  { icon: Heart, value: "18.4K", label: "Likes" },
  { icon: Share2, value: "6.1K", label: "Compartidos" },
  { icon: Bookmark, value: "2.4K", label: "Guardados" },
  { icon: MessageCircle, value: "4.3K", label: "Comentarios" },
];

const tiktokStats = [
  { icon: Heart, value: "11.4K", label: "Likes" },
  { icon: Share2, value: "1.4K", label: "Compartidos" },
  { icon: Bookmark, value: "1.5K", label: "Guardados" },
  { icon: MessageCircle, value: "1.3K", label: "Comentarios" },
];

const timeline = [
  { date: "21 Nov", phase: "Lanzamiento", desc: "Cuadro de competencia" },
  { date: "22 Nov - 5 Dic", phase: "Rondas Iniciales", desc: "Duelos grupales" },
  { date: "6 - 15 Dic", phase: "Octavos y Cuartos", desc: "Mayor debate" },
  { date: "16 - 18 Dic", phase: "Semifinales", desc: "Duelos de alto perfil" },
  { date: "21 Dic", phase: "Gran Final", desc: "Coven vs Plumrose" },
];

const GuerraComercialesSection = () => {
  return (
    <section id="guerra-comerciales" className="relative overflow-hidden bg-background pt-0 pb-20 md:pb-28">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 -left-20 w-[32rem] h-[32rem] bg-primary/12 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 -right-20 w-[32rem] h-[32rem] bg-accent/12 rounded-full blur-[140px]" />
      </div>

      <StickerMarquee items={TICKER} variant="primary" className="mb-16 md:mb-20" reverse />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with logo + headline */}
        <div className="grid lg:grid-cols-12 gap-8 items-center mb-16">
          <div className="lg:col-span-5 relative">
            <div className="relative max-w-sm mx-auto">
              <div className="absolute -top-3 right-0 z-30 bg-foreground text-background rounded-full px-3 py-1.5 rotate-6 border-2 border-foreground">
                <span className="font-display font-black text-[10px] uppercase tracking-widest">★ Proyecto 2025</span>
              </div>

              <div className="relative bg-background rounded-3xl border-2 border-foreground p-6 shadow-[10px_10px_0_hsl(var(--primary))] -rotate-2 hover:rotate-0 hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300">
                <img
                  src={logoGuerraComerciales}
                  alt="Campeonato de Comerciales de Venezuela"
                  className="w-full rounded-2xl"
                  loading="lazy"
                />
              </div>

              <div className="absolute -bottom-4 -left-4 z-30 bg-accent text-accent-foreground rounded-2xl px-3 py-2 -rotate-6 border-2 border-foreground shadow-[5px_5px_0_hsl(var(--foreground))]">
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4" />
                  <span className="font-display font-black text-sm uppercase tracking-tight">Coven Wins</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground text-background border-2 border-foreground mb-5">
              <Trophy className="w-3.5 h-3.5" />
              <span className="font-display font-black text-[10px] uppercase tracking-widest">Campeonato Nacional</span>
            </div>
            <h2 className="font-display font-black text-foreground tracking-[-0.04em] leading-[0.88] text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6">
              guerra de
              <span className="block"><span className="text-gradient italic">comerciales</span>.</span>
            </h2>
            <p className="font-body text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed lg:mr-0 mx-auto">
              El campeonato nacional que enfrentó a los comerciales más icónicos de Venezuela en un torneo estilo Mundial de Fútbol durante un mes completo. ✦
            </p>
          </div>
        </div>

        {/* Finalists */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {/* Champion */}
          <div className="relative bg-background rounded-3xl p-6 border-2 border-foreground shadow-[10px_10px_0_hsl(var(--primary))] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300">
            <div className="absolute -top-3 -right-3 z-20 bg-primary text-primary-foreground rounded-full px-3 py-1.5 rotate-6 border-2 border-foreground shadow-[3px_3px_0_hsl(var(--foreground))]">
              <div className="flex items-center gap-1 font-display font-black text-[10px] uppercase tracking-widest">
                <Trophy className="w-3 h-3" />
                Campeón
              </div>
            </div>
            <h3 className="font-display font-black text-2xl text-foreground mb-4 uppercase tracking-tight">🏆 Covencaucho</h3>
            <div className="aspect-video rounded-2xl overflow-hidden border-2 border-foreground mb-4">
              <iframe src="https://www.youtube.com/embed/bP3VsF2LUyg" title="Comercial Covencaucho - Campeón" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              El comercial que conquistó a Venezuela con su jingle icónico y la movilización masiva de su comunidad.
            </p>
          </div>

          {/* Runner-up */}
          <div className="relative bg-background rounded-3xl p-6 border-2 border-foreground shadow-[10px_10px_0_hsl(var(--accent))] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300">
            <div className="absolute -top-3 -right-3 z-20 bg-accent text-accent-foreground rounded-full px-3 py-1.5 -rotate-6 border-2 border-foreground shadow-[3px_3px_0_hsl(var(--foreground))]">
              <span className="font-display font-black text-[10px] uppercase tracking-widest">🥈 Subcampeón</span>
            </div>
            <h3 className="font-display font-black text-2xl text-foreground mb-4 uppercase tracking-tight">Plumrose</h3>
            <div className="aspect-video rounded-2xl overflow-hidden border-2 border-foreground mb-4">
              <iframe src="https://www.youtube.com/embed/WkNxe8ClC5s" title="Comercial Plumrose - Subcampeón" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              El emotivo comercial navideño que llegó a la Gran Final representando la nostalgia venezolana.
            </p>
          </div>
        </div>

        {/* Final result */}
        <div className="relative bg-foreground text-background rounded-3xl p-8 mb-12 text-center border-2 border-foreground shadow-[8px_8px_0_hsl(var(--primary))]">
          <p className="font-display font-black text-[10px] uppercase tracking-widest text-background/60 mb-2">★ La Gran Final</p>
          <p className="font-display font-black text-3xl md:text-5xl tracking-tight">
            <span className="text-primary">Covencaucho</span> <span className="text-background/40 italic">venció a</span> <span className="text-accent">Plumrose</span>
          </p>
          <p className="text-sm text-background/60 mt-3">
            Superando a gigantes como Polar Ice, Harina P.A.N., Nestlé y M.A.S.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-background rounded-2xl p-6 text-center border-2 border-foreground hover:-translate-y-1 transition-all"
              style={{
                boxShadow: `5px 5px 0 hsl(var(--${index % 2 === 0 ? "primary" : "accent"}))`,
                transform: `rotate(${(index % 2 === 0 ? -1 : 1) * 1}deg)`,
              }}
            >
              <stat.icon className="w-7 h-7 text-foreground mx-auto mb-3" />
              <p className="font-display font-black text-3xl md:text-4xl text-foreground mb-1 tracking-tight">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative bg-background rounded-3xl p-8 mb-12 border-2 border-foreground shadow-[8px_8px_0_hsl(var(--foreground))]">
          <div className="absolute -top-4 left-8 bg-foreground text-background px-4 py-1.5 rounded-full border-2 border-foreground">
            <span className="font-display font-black text-[10px] uppercase tracking-widest">★ Cronología del Torneo</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3">
            {timeline.map((item, index) => (
              <div
                key={index}
                className="text-center p-4 bg-background rounded-2xl border-2 border-foreground"
                style={{ boxShadow: `3px 3px 0 hsl(var(--${index % 2 === 0 ? "primary" : "accent"}))` }}
              >
                <p className="font-display font-black text-[10px] text-primary uppercase tracking-widest mb-1">{item.date}</p>
                <p className="font-display font-black text-foreground text-sm uppercase tracking-tight mb-1">{item.phase}</p>
                <p className="text-[10px] text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform stats */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {[
            { name: "Instagram", total: "31.2K", stats: instagramStats, color: "primary" },
            { name: "TikTok", total: "11.4K", stats: tiktokStats, color: "accent" },
          ].map((platform) => (
            <div
              key={platform.name}
              className="bg-background rounded-3xl p-7 border-2 border-foreground"
              style={{ boxShadow: `8px 8px 0 hsl(var(--${platform.color}))` }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl border-2 border-foreground flex items-center justify-center shadow-[3px_3px_0_hsl(var(--foreground))] ${platform.color === "primary" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
                  <span className="font-display font-black text-lg">{platform.name[0]}</span>
                </div>
                <div>
                  <h4 className="font-display font-black text-xl text-foreground uppercase tracking-tight">{platform.name}</h4>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{platform.total} interacciones totales</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {platform.stats.map((stat, index) => (
                  <div key={index} className="bg-background rounded-xl p-4 text-center border-2 border-foreground">
                    <stat.icon className="w-4 h-4 text-foreground mx-auto mb-2" />
                    <p className="font-display font-black text-2xl text-foreground tracking-tight">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <p className="text-muted-foreground max-w-3xl mx-auto mb-8">
            El torneo logró una visibilidad sin precedentes para Vacílate Esto, alcanzando a más de
            <span className="text-foreground font-bold"> 800,000 personas únicas</span> entre ambas plataformas.
          </p>
          <Button
            asChild
            size="xl"
            className="rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground border-2 border-foreground shadow-[6px_6px_0_hsl(var(--primary))] hover:shadow-[8px_8px_0_hsl(var(--accent))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-display font-black uppercase tracking-wider text-xs"
          >
            <a href="/press/Reporte_Guerra_de_Comerciales_2025.pdf" download="Reporte_Guerra_de_Comerciales_2025.pdf" target="_blank" rel="noopener noreferrer">
              <Download className="w-5 h-5" />
              Descargar Reporte
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GuerraComercialesSection;

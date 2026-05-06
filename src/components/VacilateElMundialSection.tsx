import { Globe, UtensilsCrossed, Newspaper, MapPin, Zap, Sparkles, ArrowUpRight } from "lucide-react";
import logoVacilateElMundial from "@/assets/logo-vacilate-mundial.svg";

const TICKER = ["VACÍLATE EL FÚTBOL 2026", "★", "MÉXICO · USA · CANADÁ", "✦", "FEB — JUL 2026", "★", "EL GOL Y EL TACO", "✦"];

const features = [
  { icon: Globe, title: "Multiplataforma", description: "Instagram, YouTube, TikTok (incluyendo TikTok Live) y Radio FM Center" },
  { icon: Zap, title: "Fun Educaitment", description: "Diversión, educación y entretenimiento en cada contenido" },
  { icon: UtensilsCrossed, title: "El Gol y la Comida", description: "Sabores de México, USA y Canadá mientras celebramos cada gol" },
  { icon: Newspaper, title: "Vacílalo News", description: "Noticias del Mundial con ironía y data insólita" },
];

const stats = [
  { value: "2M+", label: "Seguidores Activos" },
  { value: "24/7", label: "Presencia Digital" },
  { value: "100%", label: "Engagement" },
];

const formats = [
  { icon: UtensilsCrossed, title: "El Gol y el Taco", desc: "Probamos la comida típica de las sedes. Cada platillo, una historia." },
  { icon: Newspaper, title: "Vacílalo News", desc: "Noticias del Mundial con ironía y data insólita para cortar la sed de información." },
  { icon: MapPin, title: "Desde el Estadio", desc: "Cobertura en ruta, zonas de hinchas y cánticos. La energía del Mundial en vivo." },
];

const VacilateElMundialSection = () => {
  return (
    <section
      id="vacilate-el-mundial"
      aria-labelledby="vem-title"
      itemScope
      itemType="https://schema.org/SportsEvent"
      className="relative overflow-hidden bg-background py-20 md:py-28"
    >
      <meta itemProp="name" content="Vacílate El Fútbol 2026 · Cobertura del Mundial FIFA México, USA y Canadá" />
      <meta itemProp="description" content="Plataforma de cobertura del Mundial FIFA 2026 producida por Vacílate Esto: podcasts, shorts, lives y brand placement desde las 16 ciudades sede. Hosts: JuanSofa y JhonSnacks. Junio–Julio 2026." />
      <meta itemProp="startDate" content="2026-06-11" />
      <meta itemProp="endDate" content="2026-07-19" />
      <meta itemProp="url" content="https://www.vacilateesto.com/vacilate-el-mundial" />
      {/* Background blobs + dot grid */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[40rem] h-[40rem] bg-primary/25 rounded-full blur-[140px] animate-float" />
        <div className="absolute -bottom-32 -right-32 w-[40rem] h-[40rem] bg-accent/25 rounded-full blur-[140px] animate-float-delayed" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      {/* Top marquee */}
      <div className="relative z-10 border-y-2 border-foreground bg-primary text-primary-foreground overflow-hidden py-1.5 sm:py-2 -mt-20 md:-mt-28 mb-10 md:mb-16">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((item, i) => (
            <span
              key={i}
              className="font-display font-black text-xs sm:text-sm md:text-base tracking-[0.15em] uppercase mx-4 sm:mx-6 inline-flex items-center"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-10 sm:gap-8 items-center mb-12 md:mb-16">
          {/* Logo card with stickers */}
          <div className="lg:col-span-5 relative">
            <div className="relative max-w-[260px] sm:max-w-sm mx-auto">
              {/* Spinning sticker */}
              <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 z-30 w-20 h-20 sm:w-24 sm:h-24 animate-spin-slow">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <path id="vemPath" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                  </defs>
                  <text className="fill-foreground font-display font-black" style={{ fontSize: "10px", letterSpacing: "2px" }}>
                    <textPath href="#vemPath">
                      ★ MUNDIAL · 2026 · COBERTURA · ESPECIAL · ★ MUNDIAL ·
                    </textPath>
                  </text>
                </svg>
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 sm:w-7 sm:h-7 text-primary" aria-hidden="true" />
              </div>

              {/* Sticker: PROYECTO ESPECIAL */}
              <div className="absolute -top-3 right-0 z-30 bg-foreground text-background rounded-full px-3 py-1.5 rotate-6 hover:-rotate-2 transition-transform border-2 border-foreground">
                <span className="font-display font-black text-[10px] uppercase tracking-widest">★ Proyecto 2026</span>
              </div>

              <div className="relative bg-background rounded-3xl border-2 border-foreground p-6 sm:p-8 md:p-10 sticker-shadow-lg-accent hover:shadow-[16px_16px_0_hsl(var(--primary))] hover:-translate-x-1 hover:-translate-y-1 transition-all -rotate-2 hover:rotate-0">
                <img
                  src={logoVacilateElMundial}
                  alt="Vacílate El Fútbol 2026"
                  className="w-full h-auto"
                  loading="lazy"
                />
                <div className="mt-5 pt-5 border-t-2 border-dashed border-border flex items-center justify-between">
                  <span className="font-display font-black text-xs uppercase tracking-wider">Feb — Jul</span>
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">MX · USA · CAN</span>
                </div>
              </div>

              {/* Floating stat sticker */}
              <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 z-30 bg-accent text-accent-foreground rounded-2xl px-2.5 py-1.5 sm:px-3 sm:py-2 -rotate-6 hover:rotate-0 transition-transform border-2 border-foreground shadow-[4px_4px_0_hsl(var(--foreground))] sm:shadow-[5px_5px_0_hsl(var(--foreground))]">
                <div className="font-display font-black text-xl leading-none">2M+</div>
                <div className="text-[9px] uppercase tracking-widest font-bold mt-0.5">Seguidores</div>
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground text-background border-2 border-foreground mb-5">
              <Globe className="w-3.5 h-3.5" />
              <span className="font-display font-black text-[10px] uppercase tracking-widest">Cobertura Especial</span>
            </div>

            <h2 id="vem-title" className="font-display font-black text-foreground tracking-[-0.04em] leading-[0.88] text-[2.25rem] sm:text-5xl md:text-6xl lg:text-[5.5rem] mb-5 sm:mb-6">
              la magia
              <span className="block"><span className="text-gradient italic">del mundial</span></span>
              <span className="block">se vive en el feed.</span>
            </h2>

            <p className="font-body text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed lg:mr-0 mx-auto">
              Hablamos del Mundial pero desde ángulos inesperados, al más puro estilo Vacílate Esto.
              Datos insólitos, anécdotas legendarias e historias que te harán ver el fútbol con otros ojos. ✦
            </p>
          </div>
        </div>

        {/* Stats — sticker chips */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-3xl mx-auto mb-12 md:mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative bg-background border-2 border-foreground rounded-2xl p-3 sm:p-4 md:p-6 text-center sticker-card-rotate sticker-shadow-foreground hover:shadow-[7px_7px_0_hsl(var(--primary))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              style={{ transform: `rotate(${[-1.5, 0.5, -1][index]}deg)` }}
            >
              <div className="font-display font-black text-2xl sm:text-3xl md:text-5xl text-foreground tracking-tight">
                {stat.value}
              </div>
              <div className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground mt-1 font-bold uppercase tracking-widest leading-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features — sticker grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-12 md:mb-16">
          {features.map((feature, index) => {
            const isAccent = index % 2 === 0;
            const shadowColor = isAccent ? "primary" : "accent";
            return (
              <article
                key={index}
                className={`group relative bg-background rounded-3xl border-2 border-foreground p-5 sm:p-6 hover:-translate-y-1 transition-all duration-300 sticker-shadow-${shadowColor}`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border-2 border-foreground group-hover:rotate-6 transition-transform ${
                    isAccent ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
                  }`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-black text-lg mb-2 tracking-tight uppercase">{feature.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </article>
            );
          })}
        </div>

        {/* Content formats — neo-brutalist card */}
        <div className="relative bg-background rounded-3xl border-2 border-foreground p-6 sm:p-8 md:p-12 sticker-shadow-lg-foreground">
          <div className="absolute -top-4 left-4 sm:left-8 bg-foreground text-background px-3 py-1.5 sm:px-4 rounded-full border-2 border-foreground">
            <span className="font-display font-black text-[10px] uppercase tracking-widest">★ Contenido que conecta</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 mt-4">
            {formats.map((f, i) => {
              const colors = [
                "bg-primary text-primary-foreground",
                "bg-accent text-accent-foreground",
                "bg-foreground text-background",
              ];
              return (
                <div key={i} className="group text-center">
                  <div className={`w-16 h-16 rounded-2xl ${colors[i]} flex items-center justify-center mx-auto mb-4 border-2 border-foreground shadow-[4px_4px_0_hsl(var(--foreground))] group-hover:rotate-6 group-hover:-translate-y-0.5 transition-all`}>
                    <f.icon className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-black mb-2 uppercase tracking-tight">{f.title}</h4>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 pt-8 border-t-2 border-dashed border-border">
            <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground mr-1">Seguinos:</span>
            {["Instagram", "TikTok", "YouTube", "Radio FM Center"].map((p, i) => (
              <span
                key={p}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-background border-2 border-foreground text-foreground shadow-[3px_3px_0_hsl(var(--foreground))]"
                style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 1.5}deg)` }}
              >
                {p}
                <ArrowUpRight className="w-3 h-3" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VacilateElMundialSection;

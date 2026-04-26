import { Button } from "@/components/ui/button";
import { Play, Headphones, Sparkles, ArrowUpRight, Star } from "lucide-react";
import studioSet from "@/assets/studio-set.jpg";

const marqueeItems = [
  "VACÍLATE ESTO",
  "★",
  "FUN EDUCAITMENT",
  "✦",
  "PODCAST · SHORTS · LIVES",
  "★",
  "DESDE VENEZUELA 🇻🇪",
  "✦",
];

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex flex-col overflow-hidden bg-background"
      aria-labelledby="hero-title"
      itemScope
      itemType="https://schema.org/WebPageElement"
    >
      <meta itemProp="name" content="Vacílate Esto · Ecosistema de Entretenimiento de Venezuela" />
      <meta itemProp="description" content="Inicio de Vacílate Esto: el podcast venezolano #1 y ecosistema de Fun Educaitment con humor, fútbol, gastronomía, historia y mitos urbanos. Hosts: JuanSofa y JhonSnacks. 2M+ seguidores." />
      <meta itemProp="url" content="https://www.vacilateesto.com/#hero" />
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[36rem] h-[36rem] bg-primary/30 rounded-full blur-[140px] animate-float" />
        <div className="absolute -bottom-32 -right-32 w-[40rem] h-[40rem] bg-accent/30 rounded-full blur-[140px] animate-float-delayed" />
        <div
          className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:28px_28px]"
        />
      </div>

      {/* Top marquee */}
      <div className="relative z-10 border-y-2 border-foreground bg-foreground text-background overflow-hidden py-2.5">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="font-display font-black text-sm md:text-base tracking-[0.15em] uppercase mx-6 inline-flex items-center"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 container mx-auto px-4 relative z-10 pt-8 md:pt-14 pb-10 md:pb-12">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          {/* LEFT — type-as-hero */}
          <div className="lg:col-span-7 relative">
            {/* Floating sticker: ON AIR */}
            <div className="absolute -top-2 sm:-top-4 left-0 md:-left-6 z-20 bg-primary text-primary-foreground rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow-[0_8px_24px_hsl(var(--primary)/0.4)] -rotate-6 hover:rotate-0 transition-transform duration-300 border-2 border-foreground">
              <div className="flex items-center gap-2 font-display font-black text-[10px] sm:text-xs uppercase tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-background opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-background" />
                </span>
                On Air · Live
              </div>
            </div>

            {/* Floating sticker: NEW */}
            <div className="absolute top-0 sm:-top-2 right-0 md:right-12 z-20 bg-accent text-accent-foreground rounded-2xl px-2.5 py-1 sm:px-3 sm:py-1.5 rotate-6 hover:-rotate-3 transition-transform duration-300 border-2 border-foreground shadow-[4px_4px_0_hsl(var(--foreground))] sm:shadow-[6px_6px_0_hsl(var(--foreground))]">
              <span className="font-display font-black text-[10px] uppercase tracking-widest">★ Nuevo Episodio</span>
            </div>

            <h1 id="hero-title" className="font-display font-black tracking-[-0.04em] leading-[0.92] mt-14 sm:mt-16 md:mt-20 pb-2">
              <span className="block text-foreground text-[20vw] sm:text-[15vw] lg:text-[10rem] xl:text-[12rem]">
                vací
              </span>
              <span className="block text-[20vw] sm:text-[15vw] lg:text-[10rem] xl:text-[12rem] -mt-2 pr-[0.15em]">
                <span className="text-gradient italic inline-block pr-[0.08em]">late</span>
                <span className="text-foreground">.</span>
              </span>
              <span className="block text-foreground text-[20vw] sm:text-[15vw] lg:text-[10rem] xl:text-[12rem] -mt-2">
                esto
              </span>
            </h1>

            {/* Subtitle + CTAs */}
            <div className="mt-6 sm:mt-8 max-w-xl">
              <p className="font-body text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
                El <span className="font-bold text-foreground">ecosistema de Fun Educaitment</span> que mezcla podcast, shorts, lives y docuseries.
                Fútbol, gastronomía, leyendas y mitos urbanos — desde Venezuela para el mundo. ✦
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild size="xl" className="group rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground border-2 border-foreground shadow-[4px_4px_0_hsl(var(--primary))] sm:shadow-[6px_6px_0_hsl(var(--primary))] hover:shadow-[8px_8px_0_hsl(var(--accent))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                  <a
                    href="https://www.youtube.com/@Vacilateestopodcast"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Ver en YouTube"
                  >
                    <Play className="w-5 h-5" fill="currentColor" aria-hidden="true" />
                    Ver en YouTube
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </Button>
                <Button asChild size="xl" variant="outline" className="group rounded-full border-2 border-foreground bg-background hover:bg-accent hover:text-accent-foreground hover:border-foreground">
                  <a
                    href="https://open.spotify.com/show/2b2AeZVRxEFkNy1KKYkQG1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Headphones className="w-5 h-5" aria-hidden="true" />
                    Spotify
                  </a>
                </Button>
              </div>

              {/* Sub-projects chips */}
              <div className="flex flex-wrap items-center gap-2 mt-6">
                <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground mr-1">Spin-offs:</span>
                {[
                  { label: "En la Cumbre", href: "/podcast-en-la-cumbre" },
                  { label: "Eterno", href: "/podcast-eterno" },
                  { label: "Pelotica de Goma", href: "https://www.peloticadegoma.com" },
                ].map((p) => (
                  <a
                    key={p.label}
                    href={p.href}
                    target={p.href.startsWith("http") ? "_blank" : undefined}
                    rel={p.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted hover:bg-foreground hover:text-background border border-border text-xs font-semibold transition-colors"
                  >
                    {p.label}
                    <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — set photo with stickers */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] max-w-[300px] sm:max-w-[380px] md:max-w-[440px] mx-auto">
              {/* Spinning sticker badge */}
              <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 z-30 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 animate-spin-slow">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <path
                      id="circlePath"
                      d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                    />
                  </defs>
                  <text className="fill-foreground font-display font-black" style={{ fontSize: "11px", letterSpacing: "2px" }}>
                    <textPath href="#circlePath">
                      ★ FUN · EDUCAITMENT · DESDE 2020 · ★ FUN · EDUCAITMENT ·
                    </textPath>
                  </text>
                </svg>
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 sm:w-8 sm:h-8 text-primary" aria-hidden="true" />
              </div>

              {/* Polaroid-ish frame */}
              <div className="relative w-full h-full bg-background rounded-3xl border-2 border-foreground shadow-[6px_6px_0_hsl(var(--primary))] sm:shadow-[10px_10px_0_hsl(var(--primary))] lg:shadow-[12px_12px_0_hsl(var(--primary))] hover:shadow-[16px_16px_0_hsl(var(--accent))] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 rotate-2 hover:rotate-0 overflow-hidden">
                <img
                  src={studioSet}
                  alt="Estudio de Vacílate Esto con luces neón rosa y cyan"
                  width={880}
                  height={1100}
                  className="w-full h-full object-cover"
                />
                {/* Bottom tag */}
                <div className="absolute bottom-3 left-3 right-3 bg-background/90 backdrop-blur-md rounded-xl px-3 py-2 border border-border flex items-center justify-between">
                  <span className="font-display font-black text-xs uppercase tracking-wider">El Estudio</span>
                  <span className="text-xs text-muted-foreground">Caracas · VE</span>
                </div>
              </div>

              {/* Floating rating sticker */}
              <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 z-30 bg-background border-2 border-foreground rounded-2xl px-2.5 py-1.5 sm:px-3 sm:py-2 shadow-[4px_4px_0_hsl(var(--foreground))] sm:shadow-[6px_6px_0_hsl(var(--foreground))] -rotate-6 hover:rotate-0 transition-transform">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-primary" fill="currentColor" />
                  <span className="font-display font-black text-sm">4.9</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">/5</span>
                </div>
              </div>

              {/* Floating squiggle */}
              <svg
                className="hidden sm:block absolute -top-8 right-8 z-20 w-20 h-20 text-accent animate-wiggle"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M10,50 Q30,10 50,50 T90,50" />
              </svg>

              {/* Stats sticker — total comunidad agregada (Metricool, ene 2025 – abr 2026) */}
              <div
                className="absolute top-1/2 -left-4 sm:-left-8 md:-left-12 z-30 bg-foreground text-background rounded-2xl px-2.5 py-2 sm:px-3 sm:py-2.5 -rotate-12 hover:rotate-0 transition-transform border-2 border-foreground"
                title="Comunidad total · TikTok + Instagram + Facebook + YouTube + Threads · Fuente: Metricool"
                aria-label="1.84 millones de seguidores en total entre TikTok, Instagram, Facebook, YouTube y Threads"
              >
                <div className="font-display font-black text-2xl leading-none">1.84M+</div>
                <div className="text-[9px] uppercase tracking-widest text-background/70 font-bold mt-0.5">Seguidores</div>
                <div className="text-[8px] uppercase tracking-widest text-background/50 font-semibold mt-0.5">5 plataformas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom marquee — counter direction */}
      <div className="relative z-10 border-y-2 border-foreground bg-primary text-primary-foreground overflow-hidden py-2">
        <div className="flex whitespace-nowrap animate-marquee-fast" style={{ animationDirection: "reverse" }}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <span key={idx} className="inline-flex items-center mx-6">
              <span className="font-display font-black text-sm md:text-base tracking-[0.15em] uppercase">
                1.84M+ Comunidad
              </span>
              <span className="mx-6 text-background/70">✦</span>
              <span className="font-display font-black text-sm md:text-base tracking-[0.15em] uppercase">
                89.6M Impresiones
              </span>
              <span className="mx-6 text-background/70">✦</span>
              <span className="font-display font-black text-sm md:text-base tracking-[0.15em] uppercase">
                5.2M Interacciones
              </span>
              <span className="mx-6 text-background/70">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

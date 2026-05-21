import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import StickerMarquee from "@/components/StickerMarquee";
import {
  Trophy,
  MapPin,
  Calendar,
  Users,
  Mic,
  Utensils,
  Newspaper,
  Plane,
  Mail,
  Globe,
  Download,
  Sparkles,
  Eye,
  Clock,
  Megaphone,
  Instagram,
  Youtube,
  Tv,
  Play,
  Radio,
} from "lucide-react";
import logoVEM from "@/assets/logo-vacilate-futbol.png";

const stats = [
  { number: "2M+", label: "Seguidores" },
  { number: "24/7", label: "Presencia" },
  { number: "16", label: "Paradas" },
  { number: "4", label: "Países" },
];

const reachStats = [
  { number: "93.15M", label: "Impresiones", icon: Eye },
  { number: "5.33M", label: "Interacciones", icon: Sparkles },
  { number: "7,068", label: "Publicaciones", icon: Megaphone },
];

const pillars = [
  {
    title: "Humor",
    description: "Sátira informativa con Vacílalo News.",
    icon: Sparkles,
    color: "bg-primary",
  },
  {
    title: "Data",
    description: "Historia, estadística y fiebre futbolera.",
    icon: Eye,
    color: "bg-accent",
  },
  {
    title: "Calle",
    description: "Cobertura on-the-road desde las sedes.",
    icon: Megaphone,
    color: "bg-foreground",
  },
];

const hosts = [
  {
    role: "El Fiebrúo",
    name: "Jhon Da Silva",
    handle: "@jhonsnacks",
    description:
      "Aporta la data dura, la historia y la pasión que todo fanático del fútbol respeta. Su conocimiento profundo del juego retiene al núcleo duro futbolero.",
    color: "bg-primary",
  },
  {
    role: "El Escéptico",
    name: "Juan Carlos Mtz.",
    handle: "@juansofa",
    description:
      "Sigue la vibra, la calle y el entretenimiento que hace el contenido viral. Su enfoque expande la audiencia hacia el 80% del mercado generalista.",
    color: "bg-accent",
  },
];

const formats = [
  {
    tag: "Serie Gastronómica",
    title: "El Gol y la Comida",
    description:
      "Probamos la comida típica de las sedes (México, USA, Canadá). El maridaje natural con la cultura. Cada platillo, una historia.",
    icon: Utensils,
    color: "bg-primary",
  },
  {
    tag: "Sátira Informativa",
    title: "Vacílalo News",
    description:
      "Noticias del Mundial con ironía y data insólita. Los mejores momentos, las polémicas y las curiosidades con nuestro toque único.",
    icon: Newspaper,
    color: "bg-accent",
  },
  {
    tag: "On The Road",
    title: "Desde el Estadio",
    description:
      "Cobertura en ruta, zonas de hinchas y cánticos donde la marea de fanáticos está presente. La energía del Mundial en vivo.",
    icon: Plane,
    color: "bg-foreground",
  },
];

const ecosystem = [
  {
    title: "Redes",
    icon: Instagram,
    color: "bg-primary",
    items: ["Reels", "Shorts", "TikToks", "Stories diarias"],
  },
  {
    title: "Streaming",
    icon: Tv,
    color: "bg-accent",
    items: ["TikTok Live", "YouTube Live", "Watch parties", "Reacciones"],
  },
  {
    title: "Podcast",
    icon: Mic,
    color: "bg-foreground",
    items: ["Episodios semanales", "Especiales Mundial", "Spotify · YouTube"],
  },
  {
    title: "Radio",
    icon: Radio,
    color: "bg-primary",
    items: ["FM Center", "Cobertura nacional", "Cápsulas diarias"],
  },
];

const route = [
  { n: 1, country: "MX", city: "CDMX", date: "10–12 jun" },
  { n: 2, country: "USA", city: "New York", date: "12–14 jun" },
  { n: 3, country: "USA", city: "Austin", date: "14–15 jun" },
  { n: 4, country: "USA", city: "Houston", date: "16–18 jun" },
  { n: 5, country: "FRA", city: "Cannes", date: "19–26 jun" },
  { n: 6, country: "USA", city: "Miami", date: "26–28 jun" },
  { n: 7, country: "VEN", city: "Caracas", date: "28 jun – 1 jul" },
  { n: 8, country: "USA", city: "San Francisco", date: "1–3 jul" },
  { n: 9, country: "USA", city: "Philadelphia", date: "4–5 jul" },
  { n: 10, country: "USA", city: "New York", date: "5–7 jul" },
  { n: 11, country: "USA", city: "Boston", date: "7–10 jul" },
  { n: 12, country: "USA", city: "Miami", date: "10–11 jul" },
  { n: 13, country: "USA", city: "Dallas", date: "12–14 jul" },
  { n: 14, country: "USA", city: "Atlanta", date: "15–16 jul" },
  { n: 15, country: "USA", city: "New York", date: "17–20 jul" },
  { n: 16, country: "VEN", city: "Caracas", date: "20 jul" },
];

const benefits = [
  {
    title: "Visibilidad 24/7",
    description: "Presencia constante durante 6 meses de cobertura.",
    icon: Clock,
  },
  {
    title: "Audiencia Segmentada",
    description: "Fans del fútbol y audiencia generalista.",
    icon: Users,
  },
  {
    title: "Engagement Alto",
    description: "Contenido que genera conversación y viralidad.",
    icon: Sparkles,
  },
  {
    title: "Branded Content",
    description: "Integración natural de marca en el contenido.",
    icon: Megaphone,
  },
];

const MediaKitVEM = () => {
  const url = "https://www.vacilateesto.com/media-kit-vem";

  return (
    <>
      <Helmet>
        <title>Media Kit Vacílate El Fútbol 2026 | Cobertura Mundial FIFA MX·USA·CAN</title>
        <meta
          name="description"
          content="Media Kit oficial de Vacílate El Fútbol 2026. Cobertura no-oficial del Mundial FIFA con humor, data y calle. 15 ciudades, 4 países, feb-jul 2026. 2M+ seguidores."
        />
        <meta
          name="keywords"
          content="vacilate el fútbol, mundial 2026, media kit mundial, patrocinio mundial, cobertura mundial fifa, vacilate esto fútbol"
        />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Media Kit Vacílate El Fútbol 2026" />
        <meta
          property="og:description"
          content="Cobertura del Mundial FIFA 2026 con humor, data y calle. 15 ciudades · 4 países · feb-jul 2026."
        />
        <meta property="og:url" content={url} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main role="main" className="pt-20">
          {/* HERO — same style as Home */}
          <section
            id="hero-vem"
            className="relative overflow-hidden bg-background"
            aria-labelledby="hero-vem-title"
          >
            {/* Background blobs */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute -top-32 -left-32 w-[36rem] h-[36rem] bg-primary/30 rounded-full blur-[140px] animate-float" />
              <div className="absolute -bottom-32 -right-32 w-[40rem] h-[40rem] bg-accent/30 rounded-full blur-[140px] animate-float-delayed" />
              <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:28px_28px]" />
            </div>

            {/* Top marquee */}
            <div className="relative z-10 border-y-2 border-foreground bg-foreground text-background overflow-hidden py-2.5">
              <div className="flex whitespace-nowrap animate-marquee">
                {Array.from({ length: 4 }).flatMap((_, k) => [
                  "VACÍLATE EL FÚTBOL 2026",
                  "★",
                  "MX · USA · CAN · FRA · VEN",
                  "✦",
                  "FEB — JUL 2026",
                  "★",
                  "16 PARADAS · 4 PAÍSES",
                  "✦",
                ].map((item, i) => (
                  <span
                    key={`${k}-${i}`}
                    className="font-display font-black text-sm md:text-base tracking-[0.15em] uppercase mx-6 inline-flex items-center"
                  >
                    {item}
                  </span>
                )))}
              </div>
            </div>

            {/* Main content */}
            <div className="container mx-auto px-4 relative z-10 pt-10 md:pt-16 pb-12 md:pb-16 max-w-6xl">
              <div className="grid lg:grid-cols-12 gap-10 lg:gap-6 items-center">
                {/* LEFT — type-as-hero */}
                <div className="lg:col-span-7 relative">
                  {/* Floating sticker: MEDIA KIT */}
                  <div className="absolute -top-2 sm:-top-4 left-0 md:-left-6 z-20 bg-primary text-primary-foreground rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow-[0_8px_24px_hsl(var(--primary)/0.4)] -rotate-6 hover:rotate-0 transition-transform duration-300 border-2 border-foreground">
                    <div className="flex items-center gap-2 font-display font-black text-[10px] sm:text-xs uppercase tracking-widest">
                      <Trophy className="w-3.5 h-3.5" /> Media Kit 2026
                    </div>
                  </div>

                  {/* Floating sticker: 16 PARADAS */}
                  <div className="absolute top-0 sm:-top-2 right-0 md:right-12 z-20 bg-accent text-accent-foreground rounded-2xl px-2.5 py-1 sm:px-3 sm:py-1.5 rotate-6 hover:-rotate-3 transition-transform duration-300 border-2 border-foreground shadow-[4px_4px_0_hsl(var(--foreground))] sm:shadow-[6px_6px_0_hsl(var(--foreground))]">
                    <span className="font-display font-black text-[10px] uppercase tracking-widest">★ 16 Paradas · 4 Países</span>
                  </div>

                  <h1
                    id="hero-vem-title"
                    className="font-display font-black tracking-[-0.04em] leading-[0.92] mt-14 sm:mt-16 md:mt-20 pb-2"
                  >
                    <span className="block text-foreground text-[15vw] sm:text-[12vw] lg:text-[7.5rem] xl:text-[9rem]">
                      vacílate
                    </span>
                    <span className="block text-[15vw] sm:text-[12vw] lg:text-[7.5rem] xl:text-[9rem] -mt-2 pr-[0.15em]">
                      <span className="text-gradient italic inline-block pr-[0.08em]">el mundial</span>
                    </span>
                    <span className="block text-foreground text-[15vw] sm:text-[12vw] lg:text-[7.5rem] xl:text-[9rem] -mt-2">
                      2026<span className="text-primary">.</span>
                    </span>
                  </h1>

                  {/* Subtitle + CTAs */}
                  <div className="mt-6 sm:mt-8 max-w-xl">
                    <p className="font-body text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
                      El <span className="font-bold text-foreground">ecosistema de Fun Educaitment</span> que cubre el Mundial FIFA 2026 con
                      <span className="font-bold text-foreground"> humor, data y calle</span>. MX · USA · CAN · FRA · VEN — feb a jul 2026. ✦
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        asChild
                        size="xl"
                        className="group rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground border-2 border-foreground shadow-[4px_4px_0_hsl(var(--primary))] sm:shadow-[6px_6px_0_hsl(var(--primary))] hover:shadow-[8px_8px_0_hsl(var(--accent))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                      >
                        <a
                          href="/downloads/VacilateElFutbol-MediaKit-2026.pdf?v=20260517"
                          target="_blank"
                          rel="noopener noreferrer"
                          download="Vacilate-El-Futbol-MediaKit-2026.pdf"
                        >
                          <Download className="w-5 h-5" aria-hidden="true" />
                          Descargar PDF
                        </a>
                      </Button>
                      <Button
                        asChild
                        size="xl"
                        variant="outline"
                        className="group rounded-full border-2 border-foreground bg-background hover:bg-accent hover:text-accent-foreground hover:border-foreground"
                      >
                        <a href="#contacto">
                          <Mail className="w-5 h-5" aria-hidden="true" />
                          Hablemos
                        </a>
                      </Button>
                    </div>

                    {/* Quick chips */}
                    <div className="flex flex-wrap items-center gap-2 mt-6">
                      <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground mr-1">Highlights:</span>
                      {["2M+ Seguidores", "24/7 Presencia", "16 Paradas", "4 Países"].map((p) => (
                        <span
                          key={p}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted border border-border text-xs font-semibold"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT — logo with stickers */}
                <div className="lg:col-span-5 relative">
                  <div className="relative aspect-square max-w-[300px] sm:max-w-[380px] md:max-w-[440px] mx-auto">
                    {/* Spinning sticker badge */}
                    <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 z-30 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 animate-spin-slow">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <defs>
                          <path id="circlePathVem" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                        </defs>
                        <text className="fill-foreground font-display font-black" style={{ fontSize: "11px", letterSpacing: "2px" }}>
                          <textPath href="#circlePathVem">
                            ★ MUNDIAL · 2026 · MX · USA · CAN · ★ MUNDIAL · 2026 ·
                          </textPath>
                        </text>
                      </svg>
                      <Trophy className="absolute inset-0 m-auto w-6 h-6 sm:w-8 sm:h-8 text-primary" aria-hidden="true" />
                    </div>

                    {/* Frame with logo */}
                    <div className="relative w-full h-full bg-background rounded-3xl border-2 border-foreground shadow-[6px_6px_0_hsl(var(--primary))] sm:shadow-[10px_10px_0_hsl(var(--primary))] lg:shadow-[12px_12px_0_hsl(var(--primary))] hover:shadow-[16px_16px_0_hsl(var(--accent))] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 rotate-2 hover:rotate-0 overflow-hidden flex items-center justify-center p-8">
                      <img
                        src={logoVEM}
                        alt="Vacílate El Fútbol 2026"
                        className="w-full h-auto max-h-full object-contain"
                        loading="eager"
                      />
                      <div className="absolute bottom-3 left-3 right-3 bg-background/90 backdrop-blur-md rounded-xl px-3 py-2 border border-border flex items-center justify-between">
                        <span className="font-display font-black text-xs uppercase tracking-wider">VEF 2026</span>
                        <span className="text-xs text-muted-foreground">Feb — Jul</span>
                      </div>
                    </div>

                    {/* Floating rating sticker */}
                    <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 z-30 bg-background border-2 border-foreground rounded-2xl px-2.5 py-1.5 sm:px-3 sm:py-2 shadow-[4px_4px_0_hsl(var(--foreground))] sm:shadow-[6px_6px_0_hsl(var(--foreground))] -rotate-6 hover:rotate-0 transition-transform">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="font-display font-black text-sm">FIFA</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">2026</span>
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

                    {/* Stats sticker */}
                    <div
                      className="absolute top-1/2 -left-4 sm:-left-8 md:-left-12 z-30 bg-foreground text-background rounded-2xl px-2.5 py-2 sm:px-3 sm:py-2.5 -rotate-12 hover:rotate-0 transition-transform border-2 border-foreground"
                      aria-label="16 paradas en 4 países"
                    >
                      <div className="font-display font-black text-2xl leading-none">16</div>
                      <div className="text-[9px] uppercase tracking-widest text-background/70 font-bold mt-0.5">Paradas</div>
                      <div className="text-[8px] uppercase tracking-widest text-background/50 font-semibold mt-0.5">4 países</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom marquee */}
            <div className="relative z-10 border-y-2 border-foreground bg-primary text-primary-foreground overflow-hidden py-2">
              <div className="flex whitespace-nowrap animate-marquee-fast" style={{ animationDirection: "reverse" }}>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <span key={idx} className="inline-flex items-center mx-6">
                    <span className="font-display font-black text-sm md:text-base tracking-[0.15em] uppercase">
                      Humor · Data · Calle
                    </span>
                    <span className="mx-6 text-background/70">✦</span>
                    <span className="font-display font-black text-sm md:text-base tracking-[0.15em] uppercase">
                      Fun Educaitment
                    </span>
                    <span className="mx-6 text-background/70">✦</span>
                    <span className="font-display font-black text-sm md:text-base tracking-[0.15em] uppercase">
                      Mundial FIFA 2026
                    </span>
                    <span className="mx-6 text-background/70">✦</span>
                  </span>
                ))}
              </div>
            </div>
          </section>

          <StickerMarquee
            items={[
              "VACÍLATE EL FÚTBOL 2026",
              "MX · USA · CAN",
              "FEB — JUL 2026",
              "FUN EDUCAITMENT",
              "16 PARADAS · 4 PAÍSES",
            ]}
            variant="primary"
          />

          {/* STATS */}
          <section className="container mx-auto px-4 py-16 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-card rounded-3xl p-6 sm:p-8 border-2 border-foreground sticker-shadow-primary text-center"
                >
                  <div className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-gradient">
                    {s.number}
                  </div>
                  <div className="mt-2 font-display font-bold uppercase tracking-widest text-xs sm:text-sm text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Acumulado de alcance — período enero 2025 / abril 2026 */}
            <div className="mt-10">
              <div className="flex flex-wrap items-end justify-between gap-2 mb-5">
                <div>
                  <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-display font-black uppercase tracking-widest border-2 border-foreground">
                    Alcance acumulado
                  </span>
                  <h3 className="mt-3 font-display font-black text-2xl sm:text-3xl uppercase leading-tight">
                    Lo que mueve el ecosistema
                  </h3>
                </div>
                <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
                  01 ene 2025 — 30 abr 2026 · Fuente: Metricool
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {reachStats.map((s) => (
                  <div
                    key={s.label}
                    className="bg-card rounded-3xl p-6 sm:p-8 border-2 border-foreground sticker-shadow-foreground"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center border-2 border-foreground">
                      <s.icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div className="mt-4 font-display font-black text-3xl sm:text-4xl md:text-5xl text-foreground">
                      {s.number}
                    </div>
                    <div className="mt-1 font-display font-bold uppercase tracking-widest text-xs sm:text-sm text-muted-foreground">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* WHAT IS IT */}
          <section className="bg-secondary/40 border-y-2 border-foreground">
            <div className="container mx-auto px-4 py-16 max-w-5xl">
              <span className="inline-block bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-display font-black uppercase tracking-widest border-2 border-foreground">
                ¿Qué es?
              </span>
              <h2 className="mt-4 font-display font-black text-3xl sm:text-5xl uppercase leading-tight">
                Vacílate El Fútbol
              </h2>
              <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Es la cobertura no-oficial del Mundial FIFA 2026 desde la mirada de Vacílate Esto. Un ecosistema de contenido que mezcla humor, data, gastronomía y calle para hablarle tanto al fanático duro del fútbol como al 80% del mercado que disfruta el Mundial sin ser futbolero.
              </p>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Reels, Shorts, TikToks, Streaming en vivo y Podcast — desde Caracas hasta las sedes de México, Estados Unidos, Francia y Venezuela. Todo, todo el tiempo: la locura.
              </p>

              {/* Pillars */}
              <div className="mt-10 grid md:grid-cols-3 gap-4 sm:gap-6">
                {pillars.map((p) => (
                  <div
                    key={p.title}
                    className="bg-card rounded-3xl p-6 border-2 border-foreground sticker-shadow-foreground"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl ${p.color} text-background flex items-center justify-center border-2 border-foreground`}
                    >
                      <p.icon className="w-6 h-6" />
                    </div>
                    <h3 className="mt-4 font-display font-black text-2xl uppercase">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* HOSTS */}
          <section className="container mx-auto px-4 py-16 max-w-6xl">
            <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-display font-black uppercase tracking-widest border-2 border-foreground">
              Los Protagonistas
            </span>
            <h2 className="mt-4 font-display font-black text-3xl sm:text-5xl uppercase">
              Los Hosts
            </h2>
            <p className="mt-2 text-muted-foreground">El dúo que lo hace posible.</p>

            <div className="mt-10 grid md:grid-cols-2 gap-6">
              {hosts.map((h) => (
                <div
                  key={h.handle}
                  className="bg-card rounded-3xl p-6 sm:p-8 border-2 border-foreground sticker-shadow-primary"
                >
                  <span
                    className={`inline-block ${h.color} text-background px-3 py-1 rounded-full text-xs font-display font-black uppercase tracking-widest border-2 border-foreground`}
                  >
                    {h.role}
                  </span>
                  <h3 className="mt-4 font-display font-black text-3xl sm:text-4xl uppercase">
                    {h.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-mono">{h.handle}</p>
                  <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                    {h.description}
                  </p>
                </div>
              ))}
            </div>

            <blockquote className="mt-10 bg-foreground text-background rounded-3xl p-6 sm:p-10 border-2 border-foreground">
              <p className="font-display text-xl sm:text-2xl md:text-3xl leading-snug italic">
                "El Mundial no se vive solo en la cancha. Se vive en la mesa, en el bar, en el chat y en la calle. Nosotros lo contamos como nadie: con humor, data y la calle bien puesta."
              </p>
            </blockquote>
          </section>

          {/* FORMATS */}
          <section className="bg-secondary/40 border-y-2 border-foreground">
            <div className="container mx-auto px-4 py-16 max-w-6xl">
              <span className="inline-block bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-display font-black uppercase tracking-widest border-2 border-foreground">
                Formatos
              </span>
              <h2 className="mt-4 font-display font-black text-3xl sm:text-5xl uppercase">
                El Contenido
              </h2>
              <p className="mt-2 text-muted-foreground">Qué hacemos, cómo lo hacemos.</p>

              <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {formats.map((f) => (
                  <div
                    key={f.title}
                    className="bg-card rounded-3xl p-6 border-2 border-foreground sticker-shadow-accent"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl ${f.color} text-background flex items-center justify-center border-2 border-foreground`}
                    >
                      <f.icon className="w-6 h-6" />
                    </div>
                    <span className="mt-4 inline-block text-xs font-display font-black uppercase tracking-widest text-muted-foreground">
                      {f.tag}
                    </span>
                    <h3 className="mt-1 font-display font-black text-xl sm:text-2xl uppercase">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Plataformas */}
              <div className="mt-10">
                <h3 className="font-display font-black text-xl uppercase tracking-widest mb-4">
                  Plataformas
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "Instagram", icon: Instagram },
                    { label: "TikTok", icon: Play },
                    { label: "YouTube", icon: Youtube },
                    { label: "TikTok Live", icon: Tv },
                    { label: "Radio FM Center", icon: Radio },
                  ].map((p) => (
                    <span
                      key={p.label}
                      className="inline-flex items-center gap-2 bg-card border-2 border-foreground rounded-full px-4 py-2 text-sm font-display font-bold uppercase tracking-wider sticker-shadow-foreground"
                    >
                      <p.icon className="w-4 h-4" /> {p.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ECOSYSTEM */}
          <section className="container mx-auto px-4 py-16 max-w-6xl">
            <span className="inline-block bg-foreground text-background px-3 py-1 rounded-full text-xs font-display font-black uppercase tracking-widest border-2 border-foreground">
              Todo, todo el tiempo
            </span>
            <h2 className="mt-4 font-display font-black text-3xl sm:text-5xl uppercase">
              El Ecosistema
            </h2>

            <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {ecosystem.map((e) => (
                <div
                  key={e.title}
                  className={`${e.color} text-background rounded-3xl p-6 border-2 border-foreground sticker-shadow-primary`}
                >
                  <div className="flex items-center gap-3">
                    <e.icon className="w-7 h-7" />
                    <h3 className="font-display font-black text-2xl uppercase">{e.title}</h3>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {e.items.map((it) => (
                      <li key={it} className="text-sm font-medium opacity-90 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-background/80" /> {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* RUTA */}
          <section className="bg-secondary/40 border-y-2 border-foreground">
            <div className="container mx-auto px-4 py-16 max-w-6xl">
              <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-display font-black uppercase tracking-widest border-2 border-foreground">
                <Calendar className="w-3.5 h-3.5 inline mr-1" /> Jun — Jul 2026
              </span>
              <h2 className="mt-4 font-display font-black text-3xl sm:text-5xl uppercase">
                La Ruta
              </h2>
              <p className="mt-2 text-muted-foreground">
                16 paradas · 4 países. Junio a las sedes, escala en Caracas, julio la locura y cierre triunfal en Caracas.
              </p>

              <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {route.map((r) => (
                  <div
                    key={`${r.n}-${r.city}-${r.date}`}
                    className="bg-card rounded-2xl p-4 border-2 border-foreground sticker-shadow-foreground"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-black text-xl text-gradient">
                        {String(r.n).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] font-display font-black uppercase tracking-widest bg-foreground text-background px-2 py-0.5 rounded-full">
                        {r.country}
                      </span>
                    </div>
                    <div className="mt-3 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
                      <h3 className="font-display font-bold text-sm uppercase leading-tight">
                        {r.city}
                      </h3>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground font-mono">{r.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* BENEFITS */}
          <section className="container mx-auto px-4 py-16 max-w-6xl">
            <span className="inline-block bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-display font-black uppercase tracking-widest border-2 border-foreground">
              Patrocinios y marcas
            </span>
            <h2 className="mt-4 font-display font-black text-3xl sm:text-5xl uppercase">
              Vamos juntos
            </h2>

            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="bg-card rounded-3xl p-6 border-2 border-foreground sticker-shadow-primary"
                >
                  <div className="w-12 h-12 rounded-2xl bg-foreground text-background flex items-center justify-center border-2 border-foreground">
                    <b.icon className="w-6 h-6" />
                  </div>
                  <h3 className="mt-4 font-display font-black text-lg uppercase">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CONTACT */}
          <section id="contacto" className="bg-foreground text-background border-y-2 border-foreground">
            <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
              <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-display font-black uppercase tracking-widest border-2 border-background">
                Contacto
              </span>
              <h2 className="mt-4 font-display font-black text-3xl sm:text-5xl uppercase">
                ¿Listos para el vacile?
              </h2>
              <p className="mt-4 text-background/80 max-w-2xl mx-auto">
                Si tu marca quiere estar en la conversación del Mundial 2026 con humor, data y calle, hablemos. Somos Hacemos Lo Que Nos Gusta — y nos gusta hacer cosas memorables.
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
                <a
                  href="mailto:elpatio@hacemosloquenosgusta.com"
                  className="bg-background text-foreground rounded-2xl p-5 border-2 border-background hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-display font-black uppercase tracking-widest opacity-70">
                    <Mail className="w-4 h-4" /> Email
                  </div>
                  <div className="mt-2 font-display font-bold break-all">
                    elpatio@hacemosloquenosgusta.com
                  </div>
                </a>
                <div className="bg-background text-foreground rounded-2xl p-5 border-2 border-background">
                  <div className="flex items-center gap-2 text-xs font-display font-black uppercase tracking-widest opacity-70">
                    <Globe className="w-4 h-4" /> Web
                  </div>
                  <div className="mt-2 font-display font-bold space-y-1">
                    <a
                      href="https://vacilateesto.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:text-primary"
                    >
                      vacilateesto.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  className="border-2 border-background sticker-shadow-accent font-display font-black uppercase tracking-widest"
                  asChild
                >
                  <a
                    href="/downloads/VacilateElFutbol-MediaKit-2026.pdf?v=20260517"
                    target="_blank"
                    rel="noopener noreferrer"
                    download="Vacilate-El-Futbol-MediaKit-2026.pdf"
                  >
                    <Download className="w-5 h-5 mr-2" /> Descargar Media Kit PDF
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MediaKitVEM;
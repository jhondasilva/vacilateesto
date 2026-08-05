import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InstagramEmbed from "@/components/InstagramEmbed";
import StickerMarquee from "@/components/StickerMarquee";
import StickerHeader from "@/components/StickerHeader";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Tv,
  UtensilsCrossed,
  Newspaper,
  MapPin,
  Users,
  Clock,
  Zap,
  Instagram,
  Radio,
  Calendar,
  Trophy,
  Target,
  TrendingUp,
  Play,
  ArrowRight,
  ArrowUpRight,
  Smartphone,
  Eye,
  Heart,
  Star,
  Flag,
  BarChart3,
  Award,
  Flame,
  CheckCircle,
  Sparkles,
  MessageCircle,
  Radio as RadioIcon,
} from "lucide-react";
import logoVacilateElMundial from "@/assets/logo-vacilate-futbol.png";
import jhonDaSilva from "@/assets/jhon-da-silva.jpg";
import juanCarlosMartinez from "@/assets/juan-carlos-martinez.jpg";
import RouteMap from "@/components/vacilate-mundial/RouteMap";
import PlanesParticipacion from "@/components/vacilate-mundial/PlanesParticipacion";

// ───────────────────────── Data ─────────────────────────

const HERO_TICKER = [
  "VACÍLATE EL MUNDIAL 2026",
  "★",
  "MX · USA · CAN",
  "✦",
  "FEB — JUL 2026",
  "★",
  "FUN EDUCAITMENT",
  "✦",
];

const stats = [
  { value: "2M+", label: "Seguidores", icon: Users },
  { value: "24/7", label: "Presencia", icon: Clock },
  { value: "9", label: "Ciudades", icon: MapPin },
  { value: "4", label: "Países", icon: Globe },
];

const platforms = [
  { name: "Instagram", icon: Instagram },
  { name: "TikTok", icon: Play },
  { name: "YouTube", icon: Play },
  { name: "TikTok Live", icon: Tv },
  { name: "Radio FM Center", icon: Radio },
];

const contentFormats = [
  {
    title: "El Gol y la Comida",
    description:
      "Probamos la comida típica de las sedes (México, USA, Canadá). El maridaje natural con la cultura. Cada platillo, una historia.",
    icon: UtensilsCrossed,
    color: "primary" as const,
    stats: "Serie gastronómica",
  },
  {
    title: "Vacílalo News",
    description:
      "Noticias del fútbol con ironía y data insólita. Los mejores momentos, las polémicas y las curiosidades con nuestro toque único.",
    icon: Newspaper,
    color: "accent" as const,
    stats: "Sátira informativa",
  },
  {
    title: "Desde el Estadio",
    description:
      "Cobertura en ruta, zonas de hinchas y cánticos donde la marea de fanáticos está presente. La energía del fútbol en vivo.",
    icon: MapPin,
    color: "primary" as const,
    stats: "On the road",
  },
];

const timeline = [
  {
    month: "Febrero 2026",
    event: "Arrancan los Reels, Shorts y TikToks: calentamos motores en redes sociales",
    status: "upcoming",
  },
  {
    month: "Marzo 2026",
    event: "Seguimos en redes con contenido de equipos, jugadores e historias",
    status: "upcoming",
  },
  {
    month: "Abril 2026",
    event: "Se suma el Streaming en vivo: martes 5 PM + redes a tope",
    status: "upcoming",
  },
  {
    month: "Mayo 2026",
    event: "Arranca el Podcast (jueves) — Streaming + Redes desde Caracas",
    status: "upcoming",
  },
  {
    month: "Junio 2026",
    event: "A las sedes del fútbol: cobertura en ruta según itinerario",
    status: "highlight",
  },
  {
    month: "Julio 2026",
    event: "La locura total: todo, todo el tiempo, hasta la final",
    status: "highlight",
  },
];

const hosts = [
  {
    name: "Jhon Da Silva",
    role: "El Fiebrúo",
    description:
      "Aporta la data dura, la historia y la pasión que todo fanático del fútbol respeta. Su conocimiento profundo del juego retiene al núcleo duro futbolero.",
    image: jhonDaSilva,
    instagram: "@jhonsnacks",
    color: "primary" as const,
  },
  {
    name: "Juan Carlos Martínez",
    role: "El Escéptico",
    description:
      "Sigue la vibra, la calle y el entretenimiento que hace el contenido viral. Su enfoque fresco expande la audiencia hacia el 80% del mercado que disfruta el fútbol sin ser experto.",
    image: juanCarlosMartinez,
    instagram: "@juansofa",
    color: "accent" as const,
  },
];

const sponsorBenefits = [
  { icon: Eye, title: "Visibilidad 24/7", description: "Presencia constante durante 6 meses de cobertura" },
  { icon: Target, title: "Audiencia Segmentada", description: "Fans del fútbol y audiencia generalista" },
  { icon: TrendingUp, title: "Engagement Alto", description: "Contenido que genera conversación y viralidad" },
  { icon: Star, title: "Branded Content", description: "Integración natural de marca en el contenido" },
];

type RouteStop = { n: number; city: string; country: "MX" | "US" | "FR" | "VE"; date: string };
const routeStops: RouteStop[] = [
  { n: 1, city: "Ciudad de México", country: "MX", date: "9 jun" },
  { n: 2, city: "New York", country: "US", date: "12 jun" },
  { n: 3, city: "Houston", country: "US", date: "14 jun" },
  { n: 4, city: "Cannes", country: "FR", date: "19 jun" },
  { n: 5, city: "Miami", country: "US", date: "26 jun" },
  { n: 6, city: "Caracas", country: "VE", date: "28 jun – 19 jul · Semis y Final" },
];
const countryLabel: Record<RouteStop["country"], string> = {
  MX: "México",
  US: "USA",
  FR: "Francia",
  VE: "Venezuela",
};

const REELS = [
  "https://www.instagram.com/p/DZDsiy2pwka/",
  "https://www.instagram.com/p/DZLgY7MJzK4/",
  "https://www.instagram.com/p/DZLuzWDBN8a/",
  "https://www.instagram.com/p/DY-shj2h72u/",
  "https://www.instagram.com/p/DZTZ2WdMz6n/",
];

// ───────────────────────── Component ─────────────────────────

const VacilateElMundial = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const MEDIAKIT_URL = "/downloads/VacilateElFutbol-MediaKit-2026.pdf?v=20260805c";
  const PAGE_URL = "https://www.vacilateesto.com/vacilate-el-futbol";

  const handleSendByEmail = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Email inválido",
        description: "Introduce un email válido.",
        variant: "destructive",
      });
      return;
    }
    try {
      setSending(true);
      const res = await fetch(MEDIAKIT_URL);
      const blob = await res.blob();
      const reader = new FileReader();
      const pdfBase64: string = await new Promise((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      const { error } = await supabase.functions.invoke("send-mediakit-email", {
        body: { email, pdfBase64, kit: "mundial" },
      });
      if (error) throw error;
      toast({ title: "¡Enviado!", description: `Media Kit enviado a ${email}` });
      setEmail("");
    } catch (err) {
      console.error(err);
      toast({
        title: "Error al enviar",
        description: "Inténtalo de nuevo en unos segundos.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const lineShareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(
    `Vacílate El Mundial 2026 — Media Kit\n${PAGE_URL}\nPDF: https://www.vacilateesto.com${MEDIAKIT_URL}`
  )}`;

  return (
    <>
      <Helmet>
        <title>Vacílate El Fútbol 2026 | Cobertura Mundial FIFA</title>
        <meta
          name="description"
          content="Vacílate El Mundial 2026: contenido multiplataforma sobre el fútbol en el Mundial FIFA 2026. Fun Educaitment con datos insólitos, gastronomía y cobertura en vivo desde 6 ciudades. Por Vacílate Esto."
        />
        <meta
          name="keywords"
          content="mundial 2026, fifa world cup 2026, mundial mexico usa canada, podcast mundial, cobertura mundial 2026, vacilate esto mundial"
        />
        <link rel="canonical" href="https://www.vacilateesto.com/vacilate-el-futbol" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="Vacílate Esto - JuanSofa y JhonSnacks" />
        <meta name="geo.region" content="VE" />
        <meta name="geo.country" content="Venezuela" />
        <meta name="ai-content-summary" content="Vacílate El Mundial 2026 (VEM 2026) es la plataforma de cobertura del fútbol en el Mundial FIFA 2026 (México, EE.UU. y Canadá) producida por Vacílate Esto. Incluye podcasts, shorts, lives, brand placement y cobertura en vivo desde 6 ciudades. Hosts: JuanSofa (Juan Carlos Martínez) y JhonSnacks (Jhon Da Silva). Media Kit descargable: /downloads/VacilateElFutbol-MediaKit-2026.pdf?v=20260805c" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Vacílate El Mundial 2026 | La Magia del Fútbol en el Feed" />
        <meta
          property="og:description"
          content="Contenido multiplataforma sobre el fútbol en el Mundial 2026. Fun Educaitment, gastronomía y cobertura en vivo. 2M+ seguidores listos para vivir la experiencia."
        />
        <meta property="og:url" content="https://www.vacilateesto.com/vacilate-el-futbol" />
        <meta property="og:site_name" content="Vacílate Esto" />
        <meta property="og:image" content="https://www.vacilateesto.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="es_VE" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vacilateesto" />
        <meta name="twitter:title" content="Vacílate El Mundial 2026" />
        <meta
          name="twitter:description"
          content="El fútbol del Mundial 2026 visto desde ángulos inesperados. Fun Educaitment por Vacílate Esto."
        />
        <meta name="twitter:image" content="https://www.vacilateesto.com/og-image.png" />

        {/* JSON-LD - SportsEvent (Mundial FIFA 2026 coverage) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            "name": "Vacílate El Mundial 2026 - Cobertura del fútbol en el Mundial FIFA 2026",
            "description": "Cobertura multiplataforma del fútbol en el Mundial FIFA 2026 (México, Estados Unidos y Canadá) producida por Vacílate Esto. Podcasts, shorts, lives y cobertura desde 6 ciudades sede.",
            "startDate": "2026-06-11",
            "endDate": "2026-07-19",
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
            "url": "https://www.vacilateesto.com/vacilate-el-futbol",
            "image": "https://www.vacilateesto.com/og-image.png",
            "location": [
              { "@type": "Country", "name": "México" },
              { "@type": "Country", "name": "United States" },
              { "@type": "Country", "name": "Canada" }
            ],
            "organizer": {
              "@type": "Organization",
              "name": "Vacílate Esto",
              "url": "https://www.vacilateesto.com"
            },
            "performer": [
              { "@type": "Person", "name": "Juan Carlos Martínez (JuanSofa)" },
              { "@type": "Person", "name": "Jhon Da Silva (JhonSnacks)" }
            ]
          })}
        </script>

        {/* JSON-LD - CreativeWork (Media Kit descargable) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DigitalDocument",
            "name": "Media Kit Vacílate El Mundial 2026",
            "description": "Media Kit oficial con formatos, métricas y oportunidades de patrocinio para Vacílate El Mundial 2026.",
            "encodingFormat": "application/pdf",
            "url": "https://www.vacilateesto.com/downloads/VacilateElFutbol-MediaKit-2026.pdf?v=20260805c",
            "inLanguage": "es-VE",
            "publisher": { "@type": "Organization", "name": "Vacílate Esto" }
          })}
        </script>

        {/* JSON-LD - BreadcrumbList */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.vacilateesto.com" },
              { "@type": "ListItem", "position": 2, "name": "Vacílate El Mundial 2026", "item": "https://www.vacilateesto.com/vacilate-el-futbol" }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* ───────────── TOP DOWNLOAD BANNER ───────────── */}
        <div className="fixed top-20 left-0 right-0 z-40 bg-primary border-y-2 border-foreground">
          <div className="container mx-auto px-4 py-2.5">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <span className="font-display font-black text-[10px] sm:text-xs uppercase tracking-widest text-primary-foreground">
                Media Kit 2026 actualizado
              </span>
              <div className="flex items-center gap-2">
                <Link
                  to="/media-kit-vem"
                  className="inline-flex items-center gap-2 bg-background text-foreground border-2 border-foreground rounded-full px-4 py-1.5 font-display font-black uppercase tracking-widest text-[10px] sm:text-xs shadow-[3px_3px_0_hsl(var(--foreground))] hover:shadow-[4px_4px_0_hsl(var(--foreground))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Ver online
                </Link>
                <a
                  href={MEDIAKIT_URL}
                  download
                  className="inline-flex items-center gap-2 bg-foreground text-background border-2 border-foreground rounded-full px-4 py-1.5 font-display font-black uppercase tracking-widest text-[10px] sm:text-xs shadow-[3px_3px_0_hsl(var(--background))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar PDF
                </a>
              </div>
            </div>
          </div>
        </div>

        <main className="pt-10">
          {/* ───────────── HERO — Sticker Pack ───────────── */}
          <section
            id="hero"
            className="relative overflow-hidden bg-background pt-10 md:pt-14 pb-16 md:pb-24"
            aria-label="Vacílate El Mundial 2026"
          >
            {/* Background blobs + dot grid */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute -top-32 -left-32 w-[40rem] h-[40rem] bg-primary/30 rounded-full blur-[140px] animate-float" />
              <div className="absolute -bottom-32 -right-32 w-[40rem] h-[40rem] bg-accent/30 rounded-full blur-[140px] animate-float-delayed" />
              <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:28px_28px]" />
            </div>

            <StickerMarquee items={HERO_TICKER} variant="primary" className="mb-10 md:mb-14" />

            <div className="container mx-auto px-4 relative z-10">
              <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                {/* Logo card */}
                <div className="lg:col-span-5 order-2 lg:order-1">
                  <div className="relative max-w-[280px] sm:max-w-sm mx-auto">
                    {/* Spinning sticker */}
                    <div className="absolute -top-5 -left-5 sm:-top-6 sm:-left-6 z-30 w-20 h-20 sm:w-24 sm:h-24 animate-spin-slow">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <defs>
                          <path id="vemHeroPath" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                        </defs>
                        <text className="fill-foreground font-display font-black" style={{ fontSize: "10px", letterSpacing: "2px" }}>
                          <textPath href="#vemHeroPath">★ MUNDIAL · 2026 · COBERTURA · ESPECIAL · ★ MUNDIAL ·</textPath>
                        </text>
                      </svg>
                      <Sparkles className="absolute inset-0 m-auto w-6 h-6 sm:w-7 sm:h-7 text-primary" aria-hidden="true" />
                    </div>

                    <div className="absolute -top-3 right-0 z-30 bg-foreground text-background rounded-full px-3 py-1.5 rotate-6 hover:-rotate-2 transition-transform border-2 border-foreground">
                      <span className="font-display font-black text-[10px] uppercase tracking-widest">★ FIFA 2026</span>
                    </div>

                    <div className="relative bg-background rounded-3xl border-2 border-foreground p-6 sm:p-8 md:p-10 sticker-shadow-lg-accent hover:shadow-[16px_16px_0_hsl(var(--primary))] hover:-translate-x-1 hover:-translate-y-1 transition-all -rotate-2 hover:rotate-0">
                      <img src={logoVacilateElMundial} alt="Vacílate El Mundial 2026" className="w-full h-auto" />
                      <div className="mt-5 pt-5 border-t-2 border-dashed border-border flex items-center justify-between">
                        <span className="font-display font-black text-xs uppercase tracking-wider">Feb — Jul</span>
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">MX · USA · CAN</span>
                      </div>
                    </div>

                    <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 z-30 bg-accent text-accent-foreground rounded-2xl px-3 py-2 -rotate-6 hover:rotate-0 transition-transform border-2 border-foreground shadow-[5px_5px_0_hsl(var(--foreground))]">
                      <div className="font-display font-black text-xl leading-none">2M+</div>
                      <div className="text-[9px] uppercase tracking-widest font-bold mt-0.5">Seguidores</div>
                    </div>
                  </div>
                </div>

                {/* Headline + CTAs */}
                <div className="lg:col-span-7 order-1 lg:order-2 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground text-background border-2 border-foreground mb-5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="font-display font-black text-[10px] uppercase tracking-widest">Cobertura especial · Feb — Jul 2026</span>
                  </div>

                  <h1 className="font-display font-black text-foreground tracking-[-0.04em] leading-[0.88] text-[2.25rem] sm:text-5xl md:text-6xl lg:text-[5rem] mb-5 sm:mb-6">
                    la magia
                    <span className="block">
                      <span className="text-gradient italic">del fútbol</span>
                    </span>
                    <span className="block">se vive en el feed.</span>
                  </h1>

                  <p className="font-body text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed lg:mx-0 mx-auto mb-6 md:mb-8">
                    Contenido multiplataforma en Instagram, YouTube y TikTok. Hablamos del fútbol pero desde ángulos
                    inesperados, al más puro estilo Vacílate Esto. ✦
                  </p>

                  <div className="mb-6 md:mb-8">
                    <WorldCupCountdown />
                  </div>

                  <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center lg:justify-start">
                    <Link to="/media-kit-vem">
                      <Button
                        size="lg"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-foreground rounded-full font-display font-black uppercase tracking-widest text-xs sm:text-sm shadow-[4px_4px_0_hsl(var(--foreground))] hover:shadow-[6px_6px_0_hsl(var(--foreground))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Media Kit Online
                      </Button>
                    </Link>
                    <a href={MEDIAKIT_URL} download>
                      <Button
                        size="lg"
                        variant="outline"
                        className="bg-background text-foreground border-2 border-foreground rounded-full font-display font-black uppercase tracking-widest text-xs sm:text-sm shadow-[4px_4px_0_hsl(var(--foreground))] hover:bg-foreground hover:text-background hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar PDF
                      </Button>
                    </a>
                    <a href="#la-ruta">
                      <Button
                        size="lg"
                        variant="outline"
                        className="bg-background text-foreground border-2 border-foreground rounded-full font-display font-black uppercase tracking-widest text-xs sm:text-sm shadow-[4px_4px_0_hsl(var(--foreground))] hover:bg-foreground hover:text-background hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        La Ruta
                      </Button>
                    </a>
                    <a
                      href="https://laquiniela.vacilateesto.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="lg"
                        className="bg-accent text-accent-foreground hover:bg-accent/90 border-2 border-foreground rounded-full font-display font-black uppercase tracking-widest text-xs sm:text-sm shadow-[4px_4px_0_hsl(var(--foreground))] hover:shadow-[6px_6px_0_hsl(var(--foreground))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                      >
                        <Gamepad2 className="w-4 h-4 mr-2" />
                        Jugar Quiniela
                        <ExternalLink className="w-3.5 h-3.5 ml-2" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ───────────── STATS — sticker chips ───────────── */}
          <section className="relative bg-background py-12 md:py-16 border-y-2 border-foreground">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-5xl mx-auto">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  const rotation = [-1.5, 0.5, -1, 1.5][index];
                  return (
                    <div
                      key={index}
                      className="relative bg-background border-2 border-foreground rounded-2xl p-4 md:p-6 text-center sticker-shadow-foreground hover:shadow-[7px_7px_0_hsl(var(--primary))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                      style={{ transform: `rotate(${rotation}deg)` }}
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary text-primary-foreground border-2 border-foreground flex items-center justify-center mx-auto mb-3 shadow-[3px_3px_0_hsl(var(--foreground))]">
                        <Icon className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="font-display font-black text-2xl md:text-4xl text-foreground tracking-tight">
                        {stat.value}
                      </div>
                      <div className="text-[10px] md:text-xs text-muted-foreground mt-1 font-bold uppercase tracking-widest">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ───────────── REELS ───────────── */}
          <section className="relative bg-background py-16 md:py-24 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute top-20 left-10 w-[28rem] h-[28rem] bg-accent/15 rounded-full blur-[120px]" />
              <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:28px_28px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <StickerHeader
                badge="Contenido audiovisual"
                badgeIcon={Play}
                title="míralo"
                highlight="en acción"
                description="Reels, shorts y contenido exclusivo de Vacílate El Mundial 2026."
              />

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 max-w-7xl mx-auto items-start">
                {REELS.map((url, i) => {
                  const rot = [-1.5, 1.2, -0.8, 1.5, -1.2, 0.6, -0.5, 1][i] ?? 0;
                  return (
                    <div
                      key={url}
                      className="bg-background border-2 border-foreground rounded-3xl overflow-hidden p-3 md:p-4 sticker-shadow-primary hover:shadow-[8px_8px_0_hsl(var(--accent))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                      style={{ transform: `rotate(${rot}deg)` }}
                    >
                      <InstagramEmbed postUrl={url} className="w-full" />
                    </div>
                  );
                })}
              </div>

              <div className="text-center mt-10">
                <a href="https://www.instagram.com/vacilateestopodcast" target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    className="bg-foreground text-background hover:bg-foreground/90 border-2 border-foreground rounded-full font-display font-black uppercase tracking-widest text-xs sm:text-sm shadow-[4px_4px_0_hsl(var(--primary))] hover:shadow-[6px_6px_0_hsl(var(--accent))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                  >
                    <Instagram className="w-4 h-4 mr-2" />
                    Ver más en Instagram
                    <ArrowUpRight className="w-3.5 h-3.5 ml-2" />
                  </Button>
                </a>
              </div>
            </div>
          </section>

          {/* ───────────── ¿QUÉ ES? + plataformas + el desafío ───────────── */}
          <section className="relative bg-background py-16 md:py-24 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute -top-32 right-0 w-[36rem] h-[36rem] bg-primary/15 rounded-full blur-[140px]" />
              <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:28px_28px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <StickerHeader
                badge="Fun Educaitment"
                badgeIcon={Zap}
                title="qué es"
                highlight="vacílate el mundial"
                description="No somos creadores buscando audiencia desde cero. Somos una comunidad masiva lista para amplificar tu marca desde el día uno."
              />

              {/* Platforms */}
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12 md:mb-16">
                {platforms.map((p, i) => (
                  <span
                    key={p.name}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border-2 border-foreground text-foreground shadow-[3px_3px_0_hsl(var(--foreground))] text-xs sm:text-sm font-bold uppercase tracking-wider"
                    style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 1.5}deg)` }}
                  >
                    <p.icon className="w-3.5 h-3.5" />
                    {p.name}
                  </span>
                ))}
              </div>

              {/* La pantalla grande vs chica */}
              <div className="grid md:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
                <article className="relative bg-background rounded-3xl border-2 border-foreground p-6 md:p-8 sticker-shadow-lg-primary hover:-translate-x-1 hover:-translate-y-1 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground border-2 border-foreground flex items-center justify-center mb-4 shadow-[3px_3px_0_hsl(var(--foreground))]">
                    <Tv className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-black text-xl md:text-2xl uppercase tracking-tight mb-3">La Pantalla Grande</h3>
                  <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
                    La audiencia verá los 90 minutos del partido oficial en la TV. El momento del gol, la emoción del juego,
                    la transmisión tradicional.
                  </p>
                </article>
                <article className="relative bg-background rounded-3xl border-2 border-foreground p-6 md:p-8 sticker-shadow-lg-accent hover:-translate-x-1 hover:-translate-y-1 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-accent text-accent-foreground border-2 border-foreground flex items-center justify-center mb-4 shadow-[3px_3px_0_hsl(var(--foreground))]">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-black text-xl md:text-2xl uppercase tracking-tight mb-3">La Pantalla Chica</h3>
                  <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
                    La conversación real vivirá 24/7 en el móvil. Antes, durante y después del partido. TikTok, Instagram,
                    memes, debates… el fútbol nunca para.
                  </p>
                </article>
              </div>
            </div>
          </section>

          {/* ───────────── LA RUTA — 6 paradas ───────────── */}
          <section
            id="la-ruta"
            className="relative bg-background py-16 md:py-24 overflow-hidden scroll-mt-24"
          >
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute top-20 right-10 w-[32rem] h-[32rem] bg-accent/15 rounded-full blur-[120px]" />
              <div className="absolute bottom-20 left-10 w-[28rem] h-[28rem] bg-primary/15 rounded-full blur-[120px]" />
              <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:28px_28px]" />
            </div>

            <StickerMarquee
              items={["LA GRAN EXPEDICIÓN", "★", "6 CIUDADES", "✦", "4 PAÍSES", "★", "6 MESES EN VIVO", "✦"]}
              variant="dark"
              className="mb-12 md:mb-16"
            />

            <div className="container mx-auto px-4 relative z-10">
              <StickerHeader
                badge="La Ruta · 2026"
                badgeIcon={MapPin}
                title="la gran"
                highlight="expedición"
                description="6 paradas · 4 países · 6 meses cubriendo el fútbol en vivo desde donde pasa la acción."
              />

              <div className="max-w-6xl mx-auto mb-10 md:mb-14">
                <RouteMap />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 max-w-6xl mx-auto">
                {routeStops.map((stop, index) => {
                  const isAccent = index % 2 === 0;
                  const rot = (index % 3 === 0 ? -1.5 : index % 3 === 1 ? 0.5 : -0.5);
                  return (
                    <article
                      key={stop.n}
                      className={`relative bg-background border-2 border-foreground rounded-2xl p-4 sticker-shadow-${
                        isAccent ? "accent" : "primary"
                      } hover:shadow-[7px_7px_0_hsl(var(--foreground))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all`}
                      style={{ transform: `rotate(${rot}deg)` }}
                    >
                      <div
                        className={`absolute -top-3 -left-3 w-9 h-9 rounded-full border-2 border-foreground flex items-center justify-center font-display font-black text-sm shadow-[3px_3px_0_hsl(var(--foreground))] ${
                          isAccent ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {stop.n}
                      </div>
                      <div className="flex items-center justify-between mb-2 mt-1">
                        <span className="text-[10px] font-display font-black uppercase tracking-widest text-foreground bg-background border-2 border-foreground rounded-full px-2 py-0.5">
                          {countryLabel[stop.country]}
                        </span>
                        <Flag className="w-3.5 h-3.5 text-foreground" />
                      </div>
                      <h4 className="font-display font-black text-base md:text-lg uppercase tracking-tight leading-tight mb-2">
                        {stop.city}
                      </h4>
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {stop.date}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ───────────── PLANES DE PARTICIPACIÓN ───────────── */}
          <PlanesParticipacion />

          {/* ───────────── MEDIA KIT ───────────── */}
          <section
            id="media-kit"
            className="relative bg-foreground text-background py-16 md:py-24 overflow-hidden border-y-2 border-foreground scroll-mt-24"
          >
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute top-10 left-10 w-[28rem] h-[28rem] bg-primary/30 rounded-full blur-[140px]" />
              <div className="absolute bottom-10 right-10 w-[32rem] h-[32rem] bg-accent/30 rounded-full blur-[140px]" />
              <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(hsl(var(--background))_1px,transparent_1px)] [background-size:28px_28px]" />
            </div>

            <StickerMarquee
              items={["MEDIA KIT", "★", "DESCARGAR PDF", "✦", "ENVIAR POR EMAIL", "★", "COMPARTIR EN LINE", "✦"]}
              variant="primary"
              className="mb-12 md:mb-16 -mt-16 md:-mt-24"
            />

            <div className="container mx-auto px-4 relative z-10">
              <StickerHeader
                badge="Media Kit Mundial 2026"
                badgeIcon={FileText}
                badgeVariant="primary"
                title="llévate el"
                highlight="media kit"
                description="Toda la propuesta de Vacílate El Mundial: la ruta, los formatos, la audiencia y cómo activar tu marca."
                onDark
              />

              <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
                {/* Download */}
                <a
                  href={MEDIAKIT_URL}
                  download
                  className="group bg-background text-foreground rounded-3xl border-2 border-primary p-6 text-center shadow-[6px_6px_0_hsl(var(--primary))] hover:shadow-[8px_8px_0_hsl(var(--accent))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                  style={{ transform: "rotate(-1.5deg)" }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground border-2 border-foreground flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0_hsl(var(--foreground))] group-hover:rotate-6 transition-transform">
                    <Download className="w-7 h-7" />
                  </div>
                  <h3 className="font-display font-black text-lg uppercase tracking-tight mb-1">Descargar PDF</h3>
                  <p className="font-body text-sm text-muted-foreground mb-4">8 páginas · Sticker pack</p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-primary">
                    Descargar <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </a>

                {/* View online (web page) */}
                <Link
                  to="/media-kit-vem"
                  className="group bg-background text-foreground rounded-3xl border-2 border-accent p-6 text-center shadow-[6px_6px_0_hsl(var(--accent))] hover:shadow-[8px_8px_0_hsl(var(--primary))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                  style={{ transform: "rotate(0.5deg)" }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-accent text-accent-foreground border-2 border-foreground flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0_hsl(var(--foreground))] group-hover:rotate-6 transition-transform">
                    <Eye className="w-7 h-7" />
                  </div>
                  <h3 className="font-display font-black text-lg uppercase tracking-tight mb-1">Ver online</h3>
                  <p className="font-body text-sm text-muted-foreground mb-4">Web navegable, sin descarga</p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-accent">
                    Abrir Media Kit <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>

                {/* LINE */}
                <a
                  href={lineShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-background text-foreground rounded-3xl border-2 border-primary p-6 text-center shadow-[6px_6px_0_hsl(var(--primary))] hover:shadow-[8px_8px_0_hsl(var(--accent))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                  style={{ transform: "rotate(-0.5deg)" }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-foreground text-background border-2 border-foreground flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0_hsl(var(--primary))] group-hover:rotate-6 transition-transform">
                    <Send className="w-7 h-7" />
                  </div>
                  <h3 className="font-display font-black text-lg uppercase tracking-tight mb-1">Compartir en LINE</h3>
                  <p className="font-body text-sm text-muted-foreground mb-4">Envíalo a tu chat o grupo</p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-foreground">
                    Abrir LINE <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </a>
              </div>

              {/* Email form */}
              <div className="mt-10 bg-background text-foreground border-2 border-accent rounded-3xl p-6 md:p-8 max-w-2xl mx-auto shadow-[8px_8px_0_hsl(var(--accent))]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-foreground text-background border-2 border-foreground flex items-center justify-center shadow-[3px_3px_0_hsl(var(--primary))]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-base md:text-lg uppercase tracking-tight">Recíbelo por email</h3>
                    <p className="font-body text-xs md:text-sm text-muted-foreground">Te lo enviamos como adjunto al instante.</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background text-foreground border-2 border-foreground h-12 rounded-full px-5"
                    disabled={sending}
                  />
                  <Button
                    onClick={handleSendByEmail}
                    disabled={sending}
                    className="h-12 bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-foreground rounded-full font-display font-black uppercase tracking-widest text-xs whitespace-nowrap shadow-[4px_4px_0_hsl(var(--foreground))] hover:shadow-[6px_6px_0_hsl(var(--foreground))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Media Kit
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Contacto oficial:{" "}
                  <a href="mailto:elpatio@hacemosloquenosgusta.com" className="underline font-semibold text-foreground">
                    elpatio@hacemosloquenosgusta.com
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* ───────────── LA QUINIELA ───────────── */}
          <section className="relative bg-background py-16 md:py-24 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute -top-32 -left-32 w-[40rem] h-[40rem] bg-accent/25 rounded-full blur-[140px] animate-float" />
              <div className="absolute -bottom-32 -right-32 w-[40rem] h-[40rem] bg-primary/25 rounded-full blur-[140px] animate-float-delayed" />
              <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:28px_28px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <StickerHeader
                badge="Juego Interactivo"
                badgeIcon={Gamepad2}
                badgeVariant="accent"
                title="la"
                highlight="quiniela"
                description="Predice los resultados, compite con la comunidad y demuestra que sabes más de fútbol que nadie."
              />

              <div className="relative bg-background rounded-3xl border-2 border-foreground p-6 sm:p-8 md:p-12 sticker-shadow-lg-foreground max-w-5xl mx-auto">
                <div className="absolute -top-4 left-4 sm:left-8 bg-accent text-accent-foreground px-4 py-1.5 rounded-full border-2 border-foreground shadow-[3px_3px_0_hsl(var(--foreground))]">
                  <span className="font-display font-black text-[10px] uppercase tracking-widest">★ Juega gratis</span>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="font-display font-black text-2xl md:text-4xl uppercase tracking-tight mb-4 leading-tight">
                      Demuestra que sabes
                      <span className="block text-gradient italic">más que nadie</span>
                    </h3>
                    <p className="font-body text-muted-foreground mb-6 leading-relaxed">
                      Haz tus pronósticos antes y durante los partidos, compite con miles de fanáticos y gana premios
                      exclusivos. ¡Miles de fans ya están jugando!
                    </p>
                    <a href="https://laquiniela.vacilateesto.com" target="_blank" rel="noopener noreferrer">
                      <Button
                        size="lg"
                        className="bg-foreground text-background hover:bg-foreground/90 border-2 border-foreground rounded-full font-display font-black uppercase tracking-widest text-xs sm:text-sm shadow-[4px_4px_0_hsl(var(--accent))] hover:shadow-[6px_6px_0_hsl(var(--primary))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                      >
                        <Trophy className="w-4 h-4 mr-2" />
                        Jugar La Quiniela
                        <ExternalLink className="w-3.5 h-3.5 ml-2" />
                      </Button>
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Gamepad2, title: "En Tiempo Real", desc: "Pronósticos antes y durante los partidos" },
                      { icon: Award, title: "Rankings", desc: "Compite y gana premios exclusivos" },
                      { icon: BarChart3, title: "Estadísticas", desc: "Analiza tendencias y mejora" },
                      { icon: Users, title: "Comunidad", desc: "Debate con miles de fans" },
                    ].map((f, i) => {
                      const isAccent = i % 2 === 0;
                      return (
                        <div
                          key={f.title}
                          className={`bg-background border-2 border-foreground rounded-2xl p-3 sticker-shadow-${
                            isAccent ? "accent" : "primary"
                          }`}
                          style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 1}deg)` }}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl border-2 border-foreground flex items-center justify-center mb-2 shadow-[2px_2px_0_hsl(var(--foreground))] ${
                              isAccent ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
                            }`}
                          >
                            <f.icon className="w-4 h-4" />
                          </div>
                          <div className="font-display font-black text-xs uppercase tracking-tight mb-1">{f.title}</div>
                          <p className="text-[11px] text-muted-foreground leading-tight">{f.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ───────────── HOSTS ───────────── */}
          <section className="relative bg-background py-16 md:py-24 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:28px_28px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <StickerHeader
                badge="Dos voces, un universo"
                badgeIcon={Users}
                title="los"
                highlight="protagonistas"
                description="El equilibrio perfecto entre credibilidad y entretenimiento."
              />

              <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
                {hosts.map((host, index) => {
                  const rot = index === 0 ? -1.5 : 1.5;
                  return (
                    <article
                      key={host.name}
                      className={`relative bg-background rounded-3xl border-2 border-foreground p-6 md:p-8 text-center sticker-shadow-lg-${host.color} hover:-translate-x-1 hover:-translate-y-1 transition-all`}
                      style={{ transform: `rotate(${rot}deg)` }}
                    >
                      <div className="relative w-28 h-28 md:w-32 md:h-32 mx-auto mb-5">
                        <div className="absolute inset-0 rounded-full border-2 border-foreground bg-background overflow-hidden shadow-[5px_5px_0_hsl(var(--foreground))]">
                          <img src={host.image} alt={host.name} className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-foreground mb-3 shadow-[3px_3px_0_hsl(var(--foreground))] ${
                          host.color === "primary"
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent text-accent-foreground"
                        }`}
                      >
                        <span className="font-display font-black text-[10px] uppercase tracking-widest">{host.role}</span>
                      </div>
                      <h3 className="font-display font-black text-xl md:text-2xl uppercase tracking-tight mb-3">
                        {host.name}
                      </h3>
                      <p className="font-body text-sm md:text-base text-muted-foreground mb-4 leading-relaxed">
                        {host.description}
                      </p>
                      <a
                        href={`https://instagram.com/${host.instagram.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border-2 border-foreground text-foreground shadow-[3px_3px_0_hsl(var(--foreground))] text-xs font-bold uppercase tracking-wider hover:-translate-y-0.5 transition-transform"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                        {host.instagram}
                      </a>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ───────────── CONTENT FORMATS ───────────── */}
          <section className="relative bg-background py-16 md:py-24 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute -top-32 -right-32 w-[36rem] h-[36rem] bg-primary/15 rounded-full blur-[140px]" />
              <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:28px_28px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <StickerHeader
                badge="Estrategia de contenido"
                badgeIcon={Sparkles}
                title="formatos"
                highlight="que conectan"
                description="Acompañamos al fanático en todo el viaje del fútbol, integrando contenido de forma orgánica en la cultura del viaje, la comida y la celebración."
              />

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-5xl mx-auto">
                {contentFormats.map((format, index) => {
                  const isAccent = format.color === "accent";
                  const rotation = (index % 3 === 0 ? -1 : index % 3 === 1 ? 0 : 1) * 1;
                  return (
                    <article
                      key={format.title}
                      className={`group relative bg-background rounded-3xl p-6 sm:p-7 border-2 border-foreground transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 sticker-shadow-${format.color}`}
                      style={{ transform: `rotate(${rotation}deg)` }}
                    >
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 ${
                          isAccent ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
                        } rounded-2xl border-2 border-foreground flex items-center justify-center mb-5 group-hover:rotate-6 transition-transform shadow-[3px_3px_0_hsl(var(--foreground))]`}
                      >
                        <format.icon className="w-6 h-6 sm:w-7 sm:h-7" aria-hidden="true" />
                      </div>
                      <h3 className="font-display font-black text-lg sm:text-xl md:text-2xl text-foreground mb-3 tracking-tight uppercase leading-tight">
                        {format.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">{format.description}</p>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-foreground text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0_hsl(var(--foreground))] ${
                          isAccent ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
                        }`}
                      >
                        ★ {format.stats}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ───────────── CALENDARIO 2026 ───────────── */}
          <section className="relative bg-background py-16 md:py-24 overflow-hidden border-t-2 border-foreground">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute top-20 right-10 w-[32rem] h-[32rem] bg-accent/12 rounded-full blur-[120px]" />
              <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:28px_28px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <StickerHeader
                badge="Calendario 2026"
                badgeIcon={Calendar}
                title="seis meses"
                highlight="de locura"
                description="De febrero a julio: el ecosistema arranca en redes y va sumando capas hasta llegar a la locura total del fútbol."
              />

              {/* Ecosistema legend */}
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-3xl mx-auto mb-12 md:mb-16">
                <span
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border-2 border-foreground text-foreground shadow-[3px_3px_0_hsl(var(--primary))] text-xs sm:text-sm font-bold uppercase tracking-wider"
                  style={{ transform: "rotate(-1.5deg)" }}
                >
                  <Instagram className="w-3.5 h-3.5" />
                  Redes · Reels · Shorts · TikToks
                </span>
                <span
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border-2 border-foreground text-foreground shadow-[3px_3px_0_hsl(var(--accent))] text-xs sm:text-sm font-bold uppercase tracking-wider"
                  style={{ transform: "rotate(1deg)" }}
                >
                  <Tv className="w-3.5 h-3.5" />
                  Streaming · Martes 5:00 PM
                </span>
                <span
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border-2 border-foreground text-foreground shadow-[3px_3px_0_hsl(var(--foreground))] text-xs sm:text-sm font-bold uppercase tracking-wider"
                  style={{ transform: "rotate(-0.5deg)" }}
                >
                  <Radio className="w-3.5 h-3.5" />
                  Podcast · Jueves
                </span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-5xl mx-auto">
                {timeline.map((item, index) => {
                  const isHighlight = item.status === "highlight";
                  const rot = (index % 3 === 0 ? -1 : index % 3 === 1 ? 0.5 : -0.5);
                  return (
                    <article
                      key={item.month}
                      className={`relative bg-background border-2 border-foreground rounded-3xl p-5 md:p-6 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 ${
                        isHighlight ? "sticker-shadow-lg-primary" : "sticker-shadow-accent"
                      }`}
                      style={{ transform: `rotate(${rot}deg)` }}
                    >
                      {isHighlight && (
                        <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground border-2 border-foreground rounded-full px-3 py-1 shadow-[3px_3px_0_hsl(var(--foreground))]">
                          <span className="font-display font-black text-[10px] uppercase tracking-widest flex items-center gap-1">
                            <Flame className="w-3 h-3" /> En vivo
                          </span>
                        </div>
                      )}
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-foreground mb-3 shadow-[3px_3px_0_hsl(var(--foreground))] ${
                          isHighlight
                            ? "bg-primary text-primary-foreground"
                            : "bg-foreground text-background"
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        <span className="font-display font-black text-[10px] uppercase tracking-widest">{item.month}</span>
                      </div>
                      <p className="font-body text-sm md:text-base text-foreground leading-relaxed">{item.event}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ───────────── PATROCINIO ───────────── */}
          <section className="relative bg-background py-16 md:py-24 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute -top-32 -left-32 w-[36rem] h-[36rem] bg-accent/15 rounded-full blur-[140px]" />
              <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:28px_28px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <StickerHeader
                badge="Oportunidades de patrocinio"
                badgeIcon={Trophy}
                title="por qué"
                highlight="patrocinar"
                description="No interrumpimos la experiencia, la potenciamos. Tu marca integrada de forma natural en el contenido que la audiencia ama."
              />

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 max-w-5xl mx-auto mb-10">
                {sponsorBenefits.map((benefit, index) => {
                  const isAccent = index % 2 === 0;
                  const rot = (index % 4 === 0 ? -1.5 : index % 4 === 1 ? 1 : index % 4 === 2 ? -0.5 : 1.5);
                  return (
                    <article
                      key={benefit.title}
                      className={`relative bg-background border-2 border-foreground rounded-3xl p-5 text-center sticker-shadow-${
                        isAccent ? "accent" : "primary"
                      } hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all`}
                      style={{ transform: `rotate(${rot}deg)` }}
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl border-2 border-foreground flex items-center justify-center mx-auto mb-3 shadow-[3px_3px_0_hsl(var(--foreground))] ${
                          isAccent ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <benefit.icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-display font-black text-sm md:text-base uppercase tracking-tight mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{benefit.description}</p>
                    </article>
                  );
                })}
              </div>

              <div className="text-center">
                <a href="#media-kit">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-foreground rounded-full font-display font-black uppercase tracking-widest text-xs sm:text-sm shadow-[4px_4px_0_hsl(var(--foreground))] hover:shadow-[6px_6px_0_hsl(var(--foreground))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Quiero el Media Kit
                    <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </Button>
                </a>
              </div>
            </div>
          </section>

          {/* ───────────── FINAL CTA ───────────── */}
          <section className="relative bg-foreground text-background py-16 md:py-24 overflow-hidden border-t-2 border-foreground">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute top-10 left-10 w-[28rem] h-[28rem] bg-primary/30 rounded-full blur-[140px]" />
              <div className="absolute bottom-10 right-10 w-[32rem] h-[32rem] bg-accent/30 rounded-full blur-[140px]" />
              <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(hsl(var(--background))_1px,transparent_1px)] [background-size:28px_28px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
              <h2 className="font-display font-black tracking-[-0.04em] leading-[0.88] text-[2.25rem] sm:text-5xl md:text-6xl lg:text-7xl mb-5">
                listo para el
                <span className="block">
                  <span className="text-gradient italic">fútbol</span>
                  <span>.</span>
                </span>
              </h2>
              <p className="font-body text-base md:text-lg text-background/80 max-w-2xl mx-auto mb-8">
                Únete a nuestra comunidad y vive el fútbol desde ángulos que nunca imaginaste. La magia del fútbol está en
                el feed.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
                <a href="https://www.instagram.com/vacilateestopodcast" target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-background rounded-full font-display font-black uppercase tracking-widest text-xs sm:text-sm shadow-[4px_4px_0_hsl(var(--background))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                  >
                    <Instagram className="w-4 h-4 mr-2" />
                    Seguir en Instagram
                  </Button>
                </a>
                <a href="https://www.tiktok.com/@vacilateesto" target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 border-2 border-background rounded-full font-display font-black uppercase tracking-widest text-xs sm:text-sm shadow-[4px_4px_0_hsl(var(--background))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Seguir en TikTok
                  </Button>
                </a>
                <Link to="/media-kit-vem">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-background rounded-full font-display font-black uppercase tracking-widest text-xs sm:text-sm shadow-[4px_4px_0_hsl(var(--background))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Media Kit VEF
                  </Button>
                </Link>
                <Link to="/media-kit">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-background text-foreground hover:bg-background/90 border-2 border-background rounded-full font-display font-black uppercase tracking-widest text-xs sm:text-sm shadow-[4px_4px_0_hsl(var(--primary))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Ecosistema Vacílate Esto
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Floating Media Kit quick access */}
        <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 items-end">
          <Link
            to="/media-kit-vem"
            aria-label="Ver Media Kit online"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground border-2 border-foreground rounded-full px-4 py-2.5 font-display font-black uppercase tracking-widest text-[10px] sm:text-xs shadow-[4px_4px_0_hsl(var(--foreground))] hover:shadow-[6px_6px_0_hsl(var(--foreground))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            Media Kit
          </Link>
          <a
            href={MEDIAKIT_URL}
            download
            aria-label="Descargar Media Kit PDF"
            className="inline-flex items-center gap-2 bg-foreground text-background border-2 border-foreground rounded-full px-3 py-2 font-display font-black uppercase tracking-widest text-[10px] shadow-[3px_3px_0_hsl(var(--primary))] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            PDF
          </a>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default VacilateElMundial;
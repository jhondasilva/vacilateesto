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
  Radio,
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
} from "lucide-react";
import logoVEM from "@/assets/logo-vacilate-mundial.svg";

const stats = [
  { number: "2M+", label: "Seguidores" },
  { number: "24/7", label: "Presencia" },
  { number: "16", label: "Paradas" },
  { number: "4", label: "Países" },
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
    items: ["Episodios semanales", "Especiales Mundial", "Spotify · YouTube", "FM Center"],
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
        <title>Media Kit Vacílate El Mundial 2026 | Cobertura Mundial FIFA MX·USA·CAN</title>
        <meta
          name="description"
          content="Media Kit oficial de Vacílate El Mundial 2026. Cobertura no-oficial del Mundial FIFA con humor, data y calle. 15 ciudades, 4 países, feb-jul 2026. 2M+ seguidores."
        />
        <meta
          name="keywords"
          content="vacilate el mundial, mundial 2026, media kit mundial, patrocinio mundial, cobertura mundial fifa, vacilate esto mundial"
        />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Media Kit Vacílate El Mundial 2026" />
        <meta
          property="og:description"
          content="Cobertura del Mundial FIFA 2026 con humor, data y calle. 15 ciudades · 4 países · feb-jul 2026."
        />
        <meta property="og:url" content={url} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main role="main" className="pt-20">
          {/* HERO */}
          <section className="relative overflow-hidden bg-hero">
            <div className="container mx-auto px-4 py-16 sm:py-24 max-w-6xl">
              <div className="flex flex-col items-center text-center gap-6">
                <img
                  src={logoVEM}
                  alt="Vacílate El Mundial 2026"
                  className="w-40 sm:w-56 md:w-72 h-auto"
                  loading="eager"
                />
                <span className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-1.5 rounded-full text-xs font-display font-black uppercase tracking-widest border-2 border-foreground">
                  <Trophy className="w-3.5 h-3.5" /> Media Kit 2026
                </span>
                <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl uppercase leading-[0.95] tracking-tight">
                  Vacílate <span className="text-gradient">El Mundial</span> 2026
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl">
                MX · USA · CAN · FRA · VEN | FEB - JUL 2026 | 16 paradas | 4 países. El ecosistema de Fun Educaitment que cubre el Mundial FIFA 2026 con humor, data y calle.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <Button
                    size="lg"
                    className="border-2 border-foreground sticker-shadow-foreground font-display font-black uppercase tracking-widest"
                    asChild
                  >
                    <a
                      href="/downloads/VacilateElMundial-MediaKit-2026.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      download="Vacilate-El-Mundial-MediaKit-2026.pdf"
                    >
                      <Download className="w-5 h-5 mr-2" /> Descargar PDF
                    </a>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-foreground sticker-shadow-accent font-display font-black uppercase tracking-widest"
                    asChild
                  >
                    <a href="#contacto">
                      <Mail className="w-5 h-5 mr-2" /> Hablemos
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <StickerMarquee
            items={[
              "VACÍLATE EL MUNDIAL 2026",
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
          </section>

          {/* WHAT IS IT */}
          <section className="bg-secondary/40 border-y-2 border-foreground">
            <div className="container mx-auto px-4 py-16 max-w-5xl">
              <span className="inline-block bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-display font-black uppercase tracking-widest border-2 border-foreground">
                ¿Qué es?
              </span>
              <h2 className="mt-4 font-display font-black text-3xl sm:text-5xl uppercase leading-tight">
                Vacílate El Mundial
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

              <div className="mt-10 grid md:grid-cols-3 gap-4 sm:gap-6">
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
                    { label: "FM Center", icon: Radio },
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

            <div className="mt-10 grid md:grid-cols-3 gap-4 sm:gap-6">
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
                      href="https://vacilateelmundial.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:text-primary"
                    >
                      vacilateelmundial.com
                    </a>
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
                    href="/downloads/VacilateElMundial-MediaKit-2026.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    download="Vacilate-El-Mundial-MediaKit-2026.pdf"
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
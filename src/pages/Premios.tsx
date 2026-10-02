import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickerHeader from "@/components/StickerHeader";
import { Trophy, Download, Mail, ArrowLeft, Star, Award, ExternalLink } from "lucide-react";

const PDF = "/press/Nota_de_Prensa_FIAP_2026.pdf";

const FINALISTS = [
  {
    discipline: "Producción",
    category: "Técnicas de Producción de Contenidos",
    project: "Streaming from the Lost World",
    result: "Sol de Bronce",
  },
  {
    discipline: "Formatos",
    category: "Mejor estrategia de lanzamiento de programa",
    project: "Walking Ads Above the Algorithm",
    result: "Sol de Bronce",
  },
  {
    discipline: "Producción",
    category: "Técnicas de Producción — Promoción de Broadcast",
    project: "Walking Ads Above the Algorithm",
    result: "Sol de Bronce",
  },
  {
    discipline: "Formatos",
    category: "Evento en Vivo o Híbrido",
    project: "Pelotica de Goma: The Legacy",
    result: "Mención de Honor · Shortlist",
  },
  {
    discipline: "Formatos",
    category: "Contenido con mejor estrategia digital",
    project: "Walking Ads Above the Algorithm",
    result: "Sol de Bronce",
  },
];

const CIMA_SHORTLIST = [
  { category: "Contenido para Plataformas Digitales", project: "Walking Ads Above the Algorithm" },
  { category: "Campaña en Plataformas Digitales", project: "Walking Ads Above the Algorithm" },
  { category: "Contenido de Campaña Generada con IA", project: "The Soul of Slang: The Efficiency of Immortality" },
  { category: "Experiencia Figital", project: "Movilnet en Pelotica de Goma" },
  { category: "Plataforma de Streaming de Medios", project: "Streaming from the Lost World" },
  { category: "Podcast", project: "Podcast en la Cumbre" },
  { category: "Premio Ápice", project: "Pelotica de Goma: The Legacy" },
  { category: "Creativo del Año", project: "Jhon da Silva" },
];

const CONTACTS = [
  { name: "Andreína Ascensión", role: "Dirección de producción", email: "andreina.ascension@hacemosloquenosgusta.com" },
  { name: "Samira Rivas", role: "Logística", email: "samira.rivas@hacemosloquenosgusta.com" },
  { name: "Estrella Rodríguez", role: "Coordinadora de producción", email: "estrella.rodriguez@hacemosloquenosgusta.com" },
];

const Premios = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    headline: "Vacílate Esto: 4 Soles de Bronce FIAP 2026 y 8 nominaciones CIMA 2026",
    description:
      "Cuatro Soles de Bronce en FIAP 2026 para casos de Vacílate Esto Podcast; 8 nominaciones CIMA 2026.",
    datePublished: "2026-10-02",
    inLanguage: "es-VE",
    author: { "@type": "Organization", name: "Vacílate Esto" },
    publisher: { "@type": "Organization", name: "Vacílate Esto" },
    about: "FIAP 2026 · Premios CIMA 2026 · Cannes Lions · El Dorado · Effie Latam",
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Vacílate Esto: 4 Soles de Bronce FIAP y 8 nominaciones CIMA 2026</title>
        <meta
          name="description"
          content="Cuatro Soles de Bronce FIAP 2026 para casos de Vacílate Esto Podcast y 8 nominaciones CIMA 2026. Cannes, El Dorado y Effie Latam."
        />
        <link rel="canonical" href="https://www.vacilateesto.com/premios" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Vacílate Esto: 4 Soles de Bronce FIAP y 8 nominaciones CIMA 2026" />
        <meta
          property="og:description"
          content="Cuatro Soles de Bronce FIAP 2026, 8 nominaciones CIMA y selecciones en Cannes, El Dorado y Effie Latam."
        />
        <meta property="og:url" content="https://www.vacilateesto.com/premios" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vacílate Esto: 4 Soles de Bronce FIAP y 8 nominaciones CIMA 2026" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <Header />

      <main>
        {/* Hero */}
        <section className="py-14 sm:py-20 bg-foreground text-background border-b-4 border-foreground">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-display font-black text-[10px] uppercase tracking-widest text-background/70 hover:text-primary mb-6"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Inicio
            </Link>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground border-2 border-background rounded-full mb-6 rotate-[-2deg]">
              <Trophy className="w-4 h-4" />
              <span className="font-display font-black text-xs uppercase tracking-widest">Reconocimientos 2026</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl tracking-[-0.04em] leading-[0.92]">
              4 Soles de Bronce en <span className="italic text-primary">FIAP 2026</span>
            </h1>
            <p className="font-body text-background/80 text-base sm:text-lg leading-relaxed mt-6">
              <strong className="text-primary">Walking Ads Above the Algorithm</strong> obtuvo tres bronces y{" "}
              <strong className="text-primary">Streaming from the Lost World</strong> uno. Los casos son de Vacílate Esto
              Podcast. Además, hay 8 nominaciones en los Premios CIMA 2026.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href={PDF}
                download
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-background rounded-full font-display font-black text-sm uppercase tracking-widest hover:-translate-y-0.5 transition-transform"
              >
                <Download className="w-4 h-4" /> Nota histórica de finalistas (PDF)
              </a>
              <Link
                to="/media-kit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-background text-foreground border-2 border-background rounded-full font-display font-black text-sm uppercase tracking-widest hover:-translate-y-0.5 transition-transform"
              >
                <Award className="w-4 h-4" /> Ver Media Kit
              </Link>
            </div>
          </div>
        </section>

        {/* Tabla de finalistas */}
        <section className="py-14 sm:py-20 bg-background border-b-4 border-foreground">
          <div className="container mx-auto px-4 max-w-5xl">
            <StickerHeader
              badge="Resultados FIAP 2026"
              badgeIcon={Star}
              badgeVariant="primary"
              title="4 Soles de Bronce"
              highlight="y una mención de honor"
              align="center"
            />
            <div className="grid gap-3 mt-8 sm:hidden">
              {FINALISTS.map((f) => (
                <div key={`${f.project}-${f.category}`} className="border-2 border-foreground bg-card rounded-md p-4">
                  <p className="text-xs font-display font-black uppercase text-primary mb-2">{f.result}</p>
                  <h3 className="font-display font-black text-base text-foreground leading-tight">{f.project}</h3>
                  <p className="text-sm text-foreground mt-2">{f.category}</p>
                  <p className="text-xs text-muted-foreground mt-1">{f.discipline}</p>
                </div>
              ))}
            </div>
            <div className="hidden sm:block overflow-x-auto mt-8">
              <table className="w-full bg-card rounded-2xl border-2 border-foreground sticker-shadow-foreground overflow-hidden">
                <thead className="bg-foreground text-background">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 text-left text-[10px] sm:text-xs font-display font-black uppercase tracking-widest">Disciplina</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-[10px] sm:text-xs font-display font-black uppercase tracking-widest">Categoría</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-[10px] sm:text-xs font-display font-black uppercase tracking-widest">Proyecto</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-[10px] sm:text-xs font-display font-black uppercase tracking-widest">Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {FINALISTS.map((f, idx) => (
                    <tr key={idx} className="border-t-2 border-foreground hover:bg-primary/10 transition-colors">
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-muted-foreground font-medium whitespace-nowrap">{f.discipline}</td>
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-foreground font-semibold">{f.category}</td>
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-foreground">{f.project}</td>
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-foreground font-bold">{f.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Cinco finalistas, cuatro metales: 80 % de conversión. Todos los casos son de Vacílate Esto Podcast.
            </p>
          </div>
        </section>

        {/* Shortlist CIMA 2026 */}
        <section className="py-14 sm:py-20 bg-muted/30 border-b-4 border-foreground">
          <div className="container mx-auto px-4 max-w-5xl">
            <StickerHeader
              badge="Premios CIMA 2026"
              badgeIcon={Trophy}
              badgeVariant="accent"
              title="8 nominaciones en los"
              highlight="Premios de la Creatividad Venezolana"
              align="center"
            />
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {CIMA_SHORTLIST.map((item, idx) => (
                <div
                  key={`${item.category}-${idx}`}
                  className={`bg-card rounded-2xl p-5 border-2 border-foreground ${idx % 2 === 0 ? "sticker-shadow-primary" : "sticker-shadow-accent"} hover:-translate-y-1 transition-transform`}
                >
                  <p className="font-display font-black text-[10px] uppercase tracking-widest text-primary mb-2">
                    {item.category}
                  </p>
                  <p className="font-display font-black text-base sm:text-lg text-foreground tracking-[-0.02em] leading-tight">
                    {item.project}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-6 text-center">
              Estas ocho categorías ya publicadas forman parte de las 8 nominaciones anunciadas. La premiación será el 19 de octubre de 2026; aún no son premios ganados.
            </p>
          </div>
        </section>

        {/* Qué es FIAP */}
        <section className="py-14 sm:py-20 bg-muted/30 border-b-4 border-foreground">
          <div className="container mx-auto px-4 max-w-3xl space-y-5 font-body text-foreground/85 leading-relaxed">
            <p className="text-lg text-foreground font-semibold">
              En FIAP 2026, los casos de Vacílate Esto Podcast fueron cinco finalistas y obtuvieron cuatro Soles de Bronce
              en Producción y Formatos.
            </p>
            <p>
              <strong>Walking Ads Above the Algorithm</strong> ganó tres bronces: lanzamiento de programa, estrategia digital y promoción de broadcast.
              <strong> Streaming from the Lost World</strong> ganó uno en Técnicas de Producción de Contenidos.
              <strong> Pelotica de Goma: The Legacy</strong> recibió mención de honor / shortlist en Evento en Vivo o Híbrido.
            </p>
            <p>
              Estos reconocimientos consolidan a Vacílate Esto como una de las marcas de entretenimiento digital más relevantes
              de Venezuela, hecha en Venezuela, con capacidad de producir formatos propios que compiten a nivel
              iberoamericano en creatividad, ejecución y estrategia.
            </p>
          </div>
        </section>

        <section className="py-14 sm:py-20 bg-background border-b-4 border-foreground">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-foreground mb-8">Más reconocimientos</h2>
            <div className="grid md:grid-cols-3 gap-5">
              <div className="border-2 border-foreground bg-card p-6 rounded-md">
                <h3 className="font-display font-black text-xl mb-3">Cannes Lions</h3>
                <p className="font-body text-sm leading-relaxed">Silver Lion 2025 para <strong>Saving Pelotica de Goma</strong> (Entertainment for Sport). En 2026, <strong>Pelotica de Goma: The Legacy</strong> fue shortlist en Entertainment for Sport · Cultural Engagement.</p>
              </div>
              <div className="border-2 border-foreground bg-card p-6 rounded-md">
                <h3 className="font-display font-black text-xl mb-3">El Dorado 2026</h3>
                <p className="font-body text-sm leading-relaxed"><strong>Saving Pelotica de Goma</strong>: selección oficial / shortlist en Creative Effectiveness y Creative Strategy. Sin metales en esta edición.</p>
              </div>
              <div className="border-2 border-foreground bg-card p-6 rounded-md">
                <h3 className="font-display font-black text-xl mb-3">Effie Latam 2026</h3>
                <p className="font-body text-sm leading-relaxed"><strong>Salvando Pelotica de Goma</strong>: shortlist en Deportes y Entretenimiento, el único shortlist venezolano en Effie Latam 2026.</p>
              </div>
            </div>
            <p className="mt-7 text-sm text-muted-foreground">Los casos mencionados son de Vacílate Esto Podcast. “Movilnet en Pelotica de Goma” es un caso distinto, nominado a Experiencia Figital en CIMA 2026.</p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 sm:py-20 bg-background border-b-4 border-foreground">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <StickerHeader
              badge="Material para medios"
              badgeIcon={Download}
              badgeVariant="accent"
              title="Descarga la nota de prensa"
              highlight="y el press kit"
              align="center"
            />
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <a
                href={PDF}
                download
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-foreground rounded-full font-display font-black text-sm uppercase tracking-widest hover:-translate-y-0.5 transition-transform sticker-shadow-foreground"
              >
                <Download className="w-4 h-4" /> Nota histórica de finalistas FIAP
              </a>
              <Link
                to="/press-kit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-background text-foreground border-2 border-foreground rounded-full font-display font-black text-sm uppercase tracking-widest hover:-translate-y-0.5 transition-transform sticker-shadow-accent"
              >
                <ExternalLink className="w-4 h-4" /> Press Kit
              </Link>
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section className="py-14 sm:py-20 bg-foreground text-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-display font-black text-3xl sm:text-4xl tracking-[-0.03em] text-center mb-8">
              Contacto de <span className="italic text-primary">prensa</span>
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {CONTACTS.map((c) => (
                <div key={c.email} className="bg-background/5 border-2 border-background/30 rounded-2xl p-5">
                  <p className="font-display font-black text-lg tracking-[-0.02em]">{c.name}</p>
                  <p className="font-display font-black text-[10px] uppercase tracking-widest text-primary mt-1 mb-3">{c.role}</p>
                  <a
                    href={`mailto:${c.email}`}
                    className="inline-flex items-start gap-2 font-body text-xs text-background/80 hover:text-primary break-all"
                  >
                    <Mail className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {c.email}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Premios;

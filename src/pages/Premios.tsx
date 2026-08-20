import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickerHeader from "@/components/StickerHeader";
import { Trophy, Download, Mail, ArrowLeft, Star, Award, ExternalLink } from "lucide-react";

const PDF = "/press/Nota_de_Prensa_FIAP_2026.pdf";

const FINALISTS = [
  {
    discipline: "Técnicas de Producción de Contenidos",
    category: "Contenido con mejor estrategia digital",
    project: "Streaming from the Lost World",
    brand: "Vacílate Esto Podcast",
  },
  {
    discipline: "Formatos",
    category: "Mejor estrategia de lanzamiento de programa",
    project: "Walking Ads Above the Algorithm",
    brand: "Vacílate Esto",
  },
  {
    discipline: "Producción",
    category: "Técnicas de Producción — Promoción de Broadcast",
    project: "Walking Ads Above the Algorithm",
    brand: "Vacílate Esto Podcast",
  },
  {
    discipline: "Formatos",
    category: "Evento en Vivo o Híbrido",
    project: "Pelotica de Goma: The Legacy",
    brand: "Vacílate Esto Podcast",
  },
  {
    discipline: "Formatos",
    category: "Contenido con mejor estrategia digital",
    project: "Walking Ads Above the Algorithm",
    brand: "Vacílate Esto Podcast",
  },
];

const CONTACTS = [
  { name: "Andreína Ascensión", role: "Dirección de producción", email: "andreina.ascension@hacemosloquenosgusta.com" },
  { name: "Samira Rivas", role: "Logística", email: "samira.rivas@hacemosloquenosgusta.com" },
  { name: "Estrella Rodríguez", role: "Pauta y equipos", email: "estrella.rodriguez@hacemosloquenosgusta.com" },
];

const Premios = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    headline: "Vacílate Esto: 5 finalistas en FIAP 2026",
    description:
      "Vacílate Esto es finalista en cinco categorías de los FIAP 2026 con los proyectos Streaming from the Lost World, Walking Ads Above the Algorithm y Pelotica de Goma: The Legacy.",
    datePublished: "2026-08-20",
    inLanguage: "es-VE",
    author: { "@type": "Organization", name: "Vacílate Esto" },
    publisher: { "@type": "Organization", name: "Vacílate Esto" },
    about: "FIAP 2026 · Premios Iberoamericanos de Publicidad · Finalistas",
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Vacílate Esto: 5 finalistas en FIAP 2026</title>
        <meta
          name="description"
          content="Vacílate Esto es finalista en cinco categorías de los FIAP 2026 con Streaming from the Lost World, Walking Ads Above the Algorithm y Pelotica de Goma: The Legacy."
        />
        <link rel="canonical" href="https://www.vacilateesto.com/premios" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Vacílate Esto: 5 finalistas en FIAP 2026" />
        <meta
          property="og:description"
          content="Cinco nominaciones en los FIAP 2026 para los proyectos Streaming from the Lost World, Walking Ads Above the Algorithm y Pelotica de Goma: The Legacy."
        />
        <meta property="og:url" content="https://www.vacilateesto.com/premios" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vacílate Esto: 5 finalistas en FIAP 2026" />
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
              5 finalistas en los{" "}
              <span className="italic text-primary">FIAP 2026</span>
            </h1>
            <p className="font-body text-background/80 text-base sm:text-lg leading-relaxed mt-6">
              Los proyectos <strong className="text-primary">Streaming from the Lost World</strong>,{" "}
              <strong className="text-primary">Walking Ads Above the Algorithm</strong> y{" "}
              <strong className="text-primary">Pelotica de Goma: The Legacy</strong> fueron seleccionados en cinco
              categorías de los FIAP, los premios iberoamericanos de publicidad y comunicación.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href={PDF}
                download
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-background rounded-full font-display font-black text-sm uppercase tracking-widest hover:-translate-y-0.5 transition-transform"
              >
                <Download className="w-4 h-4" /> Descargar nota de prensa (PDF)
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
              badge="Finalistas FIAP 2026"
              badgeIcon={Star}
              badgeVariant="primary"
              title="Los cinco reconocimientos"
              highlight="por categoría"
              align="center"
            />
            <div className="overflow-x-auto mt-8">
              <table className="w-full bg-card rounded-2xl border-2 border-foreground sticker-shadow-foreground overflow-hidden">
                <thead className="bg-foreground text-background">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 text-left text-[10px] sm:text-xs font-display font-black uppercase tracking-widest">Disciplina</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-[10px] sm:text-xs font-display font-black uppercase tracking-widest">Categoría</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-[10px] sm:text-xs font-display font-black uppercase tracking-widest">Proyecto</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-[10px] sm:text-xs font-display font-black uppercase tracking-widest">Marca / Anunciante</th>
                  </tr>
                </thead>
                <tbody>
                  {FINALISTS.map((f, idx) => (
                    <tr key={idx} className="border-t-2 border-foreground hover:bg-primary/10 transition-colors">
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-muted-foreground font-medium whitespace-nowrap">{f.discipline}</td>
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-foreground font-semibold">{f.category}</td>
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-foreground">{f.project}</td>
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-foreground">{f.brand}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Listado según comunicación oficial de FIAP 2026. Los ganadores se anunciarán en la ceremonia de premiación.
            </p>
          </div>
        </section>

        {/* Qué es FIAP */}
        <section className="py-14 sm:py-20 bg-muted/30 border-b-4 border-foreground">
          <div className="container mx-auto px-4 max-w-3xl space-y-5 font-body text-foreground/85 leading-relaxed">
            <p className="text-lg text-foreground font-semibold">
              <strong>Caracas, Venezuela — 20 de agosto de 2026.</strong> Vacílate Esto suma cinco finalistas en la
              edición 2026 de los FIAP (Festival Iberoamericano de Publicidad), el certamen que reconoce las mejores
              piezas y estrategias de comunicación de Iberoamérica.
            </p>
            <p>
              Las nominaciones abarcan tres proyectos del ecosistema Vacílate Esto: la docuserie{" "}
              <strong>Streaming from the Lost World</strong>, la campaña{" "}
              <strong>Walking Ads Above the Algorithm</strong> y el evento{" "}
              <strong>Pelotica de Goma: The Legacy</strong>. Las categorías reconocen tanto la producción de contenidos
              como la estrategia digital, el lanzamiento de programas y la realización de eventos en vivo o híbridos.
            </p>
            <p>
              Los FIAP 2026 consolidan a Vacílate Esto como una de las marcas de entretenimiento digital más relevantes
              de Venezuela, hecha en Venezuela, con capacidad de producir formatos propios que compiten a nivel
              iberoamericano en creatividad, ejecución y estrategia.
            </p>
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
                <Download className="w-4 h-4" /> Nota de prensa FIAP 2026
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

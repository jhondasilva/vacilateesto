import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickerHeader from "@/components/StickerHeader";
import { Download, Trophy, Mountain, Mail, Newspaper, CheckCircle2, ArrowLeft } from "lucide-react";

const PDF = "/press/Nota_de_Prensa_Pico_Bolivar_2026.pdf";

const BRANDS = ["Plan B", "Harina P.A.N.", "Club Social", "Ronco", "Planeta Sport", "Restaurant Alazán"];

const CONTACTS = [
  { name: "Andreína Ascensión", role: "Dirección de producción", email: "andreina.ascension@hacemosloquenosgusta.com" },
  { name: "Estrella Rodríguez", role: "Coordinadora de producción", email: "estrella.rodriguez@hacemosloquenosgusta.com" },
];

const PrensaPicoBolivar = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: "Vacílate Esto prepara un estudio de podcast en la cumbre del Pico Bolívar",
    datePublished: "2026-08-05",
    inLanguage: "es-VE",
    author: { "@type": "Organization", name: "Vacílate Esto" },
    publisher: { "@type": "Organization", name: "Vacílate Esto" },
    about: "Podcast en la Cumbre · Pico Bolívar (aproximadamente 4.978 m) · 15 al 23 de noviembre de 2026 · sujeto a seguridad y viabilidad",
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Nota de prensa: Podcast en la Cumbre · Pico Bolívar 2026</title>
        <meta
          name="description"
          content="Plan para grabar un episodio completo con un estudio de podcast en la cumbre del Pico Bolívar del 15 al 23 de noviembre de 2026, sujeto a seguridad y viabilidad."
        />
        <link rel="canonical" href="https://www.vacilateesto.com/prensa/pico-bolivar" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://www.vacilateesto.com/prensa/pico-bolivar" />
        <meta property="og:title" content="Nota de prensa: Podcast en la Cumbre · Pico Bolívar 2026" />
        <meta property="og:description" content="Estudio de podcast previsto en la cumbre del Pico Bolívar, aproximadamente 4.978 m, del 15 al 23 de noviembre de 2026, sujeto a seguridad y viabilidad." />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <Header />

      <main>
        {/* Hero */}
        <section className="py-14 sm:py-20 bg-foreground text-background border-b-4 border-foreground">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link to="/podcast-en-la-cumbre" className="inline-flex items-center gap-2 font-display font-black text-[10px] uppercase tracking-widest text-background/70 hover:text-primary mb-6">
              <ArrowLeft className="w-3.5 h-3.5" /> Podcast en la Cumbre
            </Link>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground border-2 border-background rounded-full mb-6 rotate-[-2deg]">
              <Newspaper className="w-4 h-4" />
              <span className="font-display font-black text-xs uppercase tracking-widest">Nota de prensa · Caracas, 5 de agosto de 2026</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl tracking-[-0.04em] leading-[0.92]">
              Vacílate Esto prepara un <span className="italic text-primary">estudio de podcast</span> en la cumbre del Pico Bolívar
            </h1>
            <p className="font-body text-background/80 text-base sm:text-lg leading-relaxed mt-6">
              El plan de <strong className="text-primary">Podcast en la Cumbre</strong> es grabar un episodio completo con un estudio de podcast en la cumbre, en la ventana del 15 al 23 de noviembre de 2026, sujeto a condiciones de seguridad y viabilidad. El Pico Bolívar alcanza aproximadamente 4.978 m; la altitud exacta del punto de grabación está por certificar.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href={PDF}
                download
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-background rounded-full font-display font-black text-sm uppercase tracking-widest hover:-translate-y-0.5 transition-transform"
              >
                <Download className="w-4 h-4" /> Descargar nota (PDF)
              </a>
              <Link
                to="/podcast-en-la-cumbre#marcas-bolivar"
                className="inline-flex items-center gap-2 px-6 py-3 bg-background text-foreground border-2 border-background rounded-full font-display font-black text-sm uppercase tracking-widest hover:-translate-y-0.5 transition-transform"
              >
                <Trophy className="w-4 h-4" /> Propuesta para marcas
              </Link>
            </div>
          </div>
        </section>

        {/* Cuerpo */}
        <section className="py-14 sm:py-20 bg-background border-b-4 border-foreground">
          <div className="container mx-auto px-4 max-w-3xl space-y-5 font-body text-foreground/85 leading-relaxed">
            <p className="text-lg text-foreground font-semibold">
              <strong>Caracas, Venezuela — 5 de agosto de 2026.</strong> Vacílate Esto prepara el plan de grabar un episodio completo con un estudio de podcast en la cumbre del Pico Bolívar, del 15 al 23 de noviembre de 2026, sujeto a condiciones de seguridad y viabilidad. La montaña alcanza aproximadamente 4.978 m; la altitud exacta del punto de grabación está por certificar.
            </p>
            <p>
              El plan de cierre de <strong>Podcast en la Cumbre</strong> sigue a las expediciones con grabación en el
              Pico Naiguatá (2.765 m) y en el Monte Roraima (2.810 m). Ambas entregas suman 212 publicaciones, 2,6 millones de vistas y
              137 mil interacciones, con un engagement promedio de 6,6%. La duración de cada video editado no equivale al tiempo de grabación en cumbre. Roraima dura 1 h 01 min (1 h 01 min 29 s en el archivo editado) e incluye una introducción desde Santa Elena.
            </p>
            <p>
              La expedición se apoyará en Mérida como base de operaciones e incluirá un mes completo de contenidos: recorrido gastronómico
              y de historias de la ciudad, un podcast grabado en Mérida con invitados locales, el ascenso documentado por la Sierra Nevada y,
              como cierre previsto, un episodio completo con un estudio de podcast en la cumbre, sujeto a seguridad y viabilidad, sin un mínimo continuo de duración confirmado.
            </p>
            <p>
              Cualquier posible reconocimiento como récord queda sujeto a verificación y a los criterios del organismo correspondiente. No se afirma que exista una solicitud introducida, una categoría aceptada, homologación o certificación.
            </p>
            <p>
              El proyecto es una producción de Vacílate Esto junto a El Patio Content Studio, conducida por <strong>JhonSnacks</strong> y
              <strong> JuanSofa</strong>, con dirección de producción de Andreína Ascensión, coordinación de producción a cargo de Estrella Rodríguez.
            </p>
          </div>
        </section>

        {/* Datos clave */}
        <section className="py-14 sm:py-20 bg-muted/30 border-b-4 border-foreground">
          <div className="container mx-auto px-4">
            <StickerHeader badge="Datos clave" badgeIcon={Mountain} badgeVariant="dark" title="La cifra de la" highlight="cumbre" align="center" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                { v: "≈ 4.978 m", l: "Altitud de la montaña" },
                { v: "15–23 nov", l: "Ventana prevista · 2026" },
                { v: "Estudio", l: "Podcast en cumbre · previsto" },
                { v: "2,6M", l: "Vistas previas" },
              ].map((s) => (
                <div key={s.l} className="bg-background border-2 border-foreground rounded-2xl p-5 text-center sticker-shadow-primary">
                  <div className="font-display font-black text-2xl md:text-3xl tracking-[-0.03em] text-primary leading-none mb-2">{s.v}</div>
                  <div className="font-display font-black text-[10px] uppercase tracking-widest text-foreground/70">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Marcas */}
        <section className="py-14 sm:py-20 bg-background border-b-4 border-foreground">
          <div className="container mx-auto px-4">
            <StickerHeader
              badge="Marcas confirmadas"
              badgeIcon={CheckCircle2}
              badgeVariant="primary"
              title="Quienes suben"
              highlight="con nosotros"
              description="Aliados confirmados de Podcast en la Cumbre · Pico Bolívar."
              align="center"
            />
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {BRANDS.map((b, i) => (
                <span
                  key={b}
                  className={`px-5 py-3 bg-background border-2 border-foreground rounded-full font-display font-black text-sm uppercase tracking-widest text-foreground ${i % 2 ? "rotate-[1.5deg]" : "rotate-[-1.5deg]"}`}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Contactos */}
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
                  <a href={`mailto:${c.email}`} className="inline-flex items-start gap-2 font-body text-xs text-background/80 hover:text-primary break-all">
                    <Mail className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {c.email}
                  </a>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <a
                href={PDF}
                download
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-background rounded-full font-display font-black text-sm uppercase tracking-widest"
              >
                <Download className="w-4 h-4" /> Descargar nota de prensa (PDF)
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PrensaPicoBolivar;

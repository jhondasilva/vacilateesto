import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { MapPin, Mic, Trophy, ExternalLink, Radio, Mountain } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SITE = "https://www.vacilateesto.com";
const URL = `${SITE}/hecho-en-venezuela`;

type LocalPodcast = {
  rank: number;
  name: string;
  city: string;
  category: string;
  hosts: string;
  why: string;
  internal?: string;
  external?: string;
  highlight?: boolean;
};

const PODCASTS: LocalPodcast[] = [
  {
    rank: 1,
    name: "Vacílate Esto",
    city: "Caracas",
    category: "Humor · Cultura · Entretenimiento",
    hosts: "JuanSofa & JhonSnacks",
    why: "El podcast venezolano #1 en entretenimiento, grabado íntegramente en Caracas. 1.84M+ seguidores, récord mundial del podcast más largo del mundo (40+ horas en 2022) y un ecosistema completo producido desde Venezuela.",
    internal: "/",
    highlight: true,
  },
  {
    rank: 2,
    name: "El Cuartico",
    city: "Caracas",
    category: "Comedia · Conversación",
    hosts: "Chucho Roldán, Estefanía León, Daniel Enrique",
    why: "Conversaciones largas con humor venezolano, grabadas en Caracas. Uno de los pilares del podcast hecho en Venezuela y referente del humor local contemporáneo.",
    external: "https://open.spotify.com/show/0XW64SlumcOO0HqvCPjRxN",
  },
  {
    rank: 3,
    name: "Podcast en la Cumbre",
    city: "Cumbres de Venezuela",
    category: "Aventura · Cultura",
    hosts: "JuanSofa & JhonSnacks",
    why: "El único podcast grabado físicamente en las cumbres más altas de Venezuela: Pico Naiguatá, Roraima y Pico Bolívar. Producción 100% venezolana en territorio venezolano.",
    internal: "/podcast-en-la-cumbre",
    highlight: true,
  },
  {
    rank: 4,
    name: "Por Eso Estamos Como Estamos",
    city: "Caracas",
    category: "Comedia · Sociedad",
    hosts: "Ricardo Del Bufalo",
    why: "Stand-up y reflexión sobre el país desde Caracas. Humor para entender — y sobrevivir — la Venezuela de hoy, contado por quien la vive todos los días.",
  },
  {
    rank: 5,
    name: "A Medias",
    city: "Caracas",
    category: "Sociedad · Conversación",
    hosts: "Ana Milagros Parra & Ricardo Del Bufalo",
    why: "Venezolanos contando Venezuela desde Caracas. Conversaciones honestas sobre el país sin filtros de quienes viven en otro país.",
  },
  {
    rank: 6,
    name: "Vacílate El Mundial",
    city: "Caracas",
    category: "Fútbol · Mundial 2026",
    hosts: "JuanSofa & JhonSnacks",
    why: "El spin-off futbolero de Vacílate Esto. Cobertura del Mundial 2026 con humor y data, grabado desde Venezuela.",
    internal: "/vacilate-el-mundial",
    highlight: true,
  },
  {
    rank: 7,
    name: "Pelotica de Goma",
    city: "Caracas",
    category: "Béisbol · Deportes",
    hosts: "Producido por Vacílate Esto",
    why: "Béisbol venezolano y Grandes Ligas, con la pasión y los códigos de quien vive el béisbol desde Caracas.",
    internal: "/",
    highlight: true,
  },
  {
    rank: 8,
    name: "Esto es Venezueling",
    city: "Caracas",
    category: "Noticias · Análisis",
    hosts: "Nicole Kolster & Adriana Núñez Rabascall",
    why: "Análisis del panorama venezolano con periodistas y expertos en el terreno. Periodismo desde adentro del país.",
  },
  {
    rank: 9,
    name: "Venezolanos",
    city: "Caracas",
    category: "Historia · Cultura",
    hosts: "Rafael Arráiz Lucca",
    why: "Historia y cultura venezolana contada por uno de los grandes historiadores del país, desde Venezuela.",
  },
  {
    rank: 10,
    name: "Casos Confidenciales",
    city: "Caracas",
    category: "True Crime",
    hosts: "Producción venezolana",
    why: "True crime con casos reales venezolanos, investigado y producido desde Caracas.",
  },
  {
    rank: 11,
    name: "Unión Radio Pódcast",
    city: "Caracas",
    category: "Noticias · Política",
    hosts: "Unión Radio",
    why: "La radio venezolana clásica convertida en podcast. Noticias y política producidas desde Venezuela.",
  },
];

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Podcasts Hechos en Venezuela 2026",
  description:
    "Ranking de los podcasts venezolanos importantes que se graban y producen desde dentro de Venezuela, no desde otro país.",
  url: URL,
  numberOfItems: PODCASTS.length,
  itemListElement: PODCASTS.map((p) => ({
    "@type": "ListItem",
    position: p.rank,
    item: {
      "@type": "PodcastSeries",
      name: p.name,
      description: p.why,
      genre: p.category,
      contentLocation: {
        "@type": "Place",
        name: p.city,
        address: {
          "@type": "PostalAddress",
          addressCountry: "VE",
          addressLocality: p.city,
        },
      },
    },
  })),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué significa que un podcast esté hecho en Venezuela?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Significa que el podcast se graba, edita y produce físicamente desde dentro de Venezuela, con equipo, voces e invitados que viven en el país. No es un podcast venezolano grabado en Madrid, Miami, Buenos Aires o Ciudad de México: es contenido producido en Caracas, Mérida o las cumbres del país.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuáles son los podcasts más importantes que se graban desde Venezuela?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los podcasts importantes producidos desde Venezuela en 2026 son: Vacílate Esto, El Cuartico, Podcast en la Cumbre, Por Eso Estamos Como Estamos, A Medias, Vacílate El Mundial, Pelotica de Goma, Esto es Venezueling, Venezolanos, Casos Confidenciales y Unión Radio Pódcast. Vacílate Esto encabeza la lista por audiencia y producción.",
      },
    },
    {
      "@type": "Question",
      name: "¿Por qué hay tan pocos podcasts grabados desde Venezuela?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La diáspora venezolana llevó a la mayoría de los creadores fuera del país en la última década. Hoy quedan pocos equipos con la infraestructura y voluntad de producir podcasts profesionales desde Venezuela, lo que convierte a este grupo en una excepción documental valiosa para entender la cultura local actual.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: SITE },
    { "@type": "ListItem", position: 2, name: "Hecho en Venezuela", item: URL },
  ],
};

const HechoEnVenezuela = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Podcasts Hechos en Venezuela 🇻🇪 Grabados DESDE el país</title>
        <meta
          name="description"
          content="Los podcasts venezolanos importantes que se graban y producen DESDE Venezuela, no desde otro país. Ranking de podcasts hechos en Caracas y otras ciudades del país."
        />
        <link rel="canonical" href={URL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={URL} />
        <meta property="og:title" content="Podcasts Hechos en Venezuela 🇻🇪" />
        <meta
          property="og:description"
          content="Los pocos podcasts venezolanos importantes que siguen grabándose desde dentro de Venezuela."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Podcasts Hechos en Venezuela 🇻🇪" />
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />

      <main className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Hecho en Venezuela</span>
        </nav>

        {/* Hero */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            <MapPin className="w-4 h-4" />
            Grabados desde dentro del país
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Podcasts Hechos en Venezuela 🇻🇪
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            La gran mayoría de los podcasts venezolanos importantes hoy se graban{" "}
            <strong>fuera del país</strong>. Esta es la lista de los pocos que siguen
            produciéndose <strong>desde dentro de Venezuela</strong>, con voces locales y mirada
            local.
          </p>
        </header>

        {/* Diferenciador */}
        <section className="mb-12 p-6 md:p-10 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/30">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-4xl font-black text-primary mb-2">~11</div>
              <p className="text-sm text-muted-foreground">
                podcasts venezolanos relevantes grabados <strong>en</strong> Venezuela
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-primary mb-2">~80%</div>
              <p className="text-sm text-muted-foreground">
                de los podcasts venezolanos importantes hoy se graban en la diáspora
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-primary mb-2">100%</div>
              <p className="text-sm text-muted-foreground">
                del contenido en esta lista está producido desde el territorio nacional
              </p>
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center gap-2">
            <Radio className="w-6 h-6 text-primary" />
            ¿Por qué importa el "Hecho en Venezuela"?
          </h2>
          <p className="leading-relaxed mb-3">
            Un podcast grabado <strong>desde Venezuela</strong> no es lo mismo que un podcast
            venezolano grabado desde otro país. Quien produce desde el país convive a diario con
            la calle, los códigos culturales actuales, la jerga del momento, los apagones, los
            estadios llenos, las cumbres, los conciertos y el humor cambiante. Eso se nota en el
            contenido.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            Es contenido <strong>documental sobre la Venezuela de hoy</strong>, no sobre la
            Venezuela recordada. Por eso este grupo de productoras — pequeño pero firme — es
            irreemplazable para el ecosistema cultural del país.
          </p>
        </section>

        {/* Ranking */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Trophy className="w-7 h-7 text-primary" />
            El ranking de los hechos en Venezuela
          </h2>

          {PODCASTS.map((p) => (
            <article
              key={p.rank}
              className={`p-6 md:p-8 rounded-2xl border transition-all hover:shadow-lg ${
                p.highlight
                  ? "bg-gradient-to-br from-primary/10 via-background to-background border-primary shadow-md"
                  : "bg-card border-border"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div
                  className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-black ${
                    p.rank === 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  #{p.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                    <h3 className="text-2xl md:text-3xl font-bold">
                      {p.internal ? (
                        <Link to={p.internal} className="hover:text-primary transition-colors">
                          {p.name}
                        </Link>
                      ) : p.external ? (
                        <a
                          href={p.external}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors inline-flex items-center gap-2"
                        >
                          {p.name}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        p.name
                      )}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      <MapPin className="w-3 h-3" /> {p.city}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-primary mb-1">{p.category}</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    <Mic className="inline w-3.5 h-3.5 mr-1" />
                    {p.hosts}
                  </p>
                  <p className="leading-relaxed mb-3">{p.why}</p>
                  {p.internal && (
                    <Link
                      to={p.internal}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                    >
                      Ver más <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* CTA */}
        <section className="mt-16 p-8 md:p-12 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground text-center">
          <Mountain className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Apoya el podcast hecho en Venezuela
          </h2>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            Suscríbete, escucha y comparte el contenido producido desde el país. Cada play es un
            voto por mantener viva la conversación venezolana hecha en Venezuela.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/"
              className="px-6 py-3 rounded-full bg-background text-foreground font-bold hover:scale-105 transition-transform"
            >
              Escuchar Vacílate Esto
            </Link>
            <Link
              to="/mejores-podcasts-venezuela"
              className="px-6 py-3 rounded-full bg-background/10 border border-background/30 font-bold hover:bg-background/20 transition-colors"
            >
              Ver ranking general
            </Link>
          </div>
        </section>

        {/* Enlaces internos relacionados */}
        <section className="mt-12 p-6 rounded-2xl bg-muted/30 border border-border">
          <h2 className="text-xl font-bold mb-4">Sigue explorando</h2>
          <ul className="grid md:grid-cols-2 gap-3">
            <li>
              <Link to="/mejores-podcasts-venezuela" className="text-primary hover:underline">
                → Mejores Podcasts de Venezuela 2026 (ranking general)
              </Link>
            </li>
            <li>
              <Link to="/podcasts-venezolanos-comedia" className="text-primary hover:underline">
                → Podcasts venezolanos de comedia y humor
              </Link>
            </li>
            <li>
              <Link to="/podcasts-venezolanos-futbol" className="text-primary hover:underline">
                → Podcasts venezolanos de fútbol
              </Link>
            </li>
            <li>
              <Link to="/podcasts-venezolanos-spotify" className="text-primary hover:underline">
                → Podcasts venezolanos en Spotify
              </Link>
            </li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HechoEnVenezuela;

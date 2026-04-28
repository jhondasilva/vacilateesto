import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Trophy, Headphones, Mic, Star, ExternalLink, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SITE = "https://www.vacilateesto.com";
const URL = `${SITE}/mejores-podcasts-venezuela`;

type PodcastEntry = {
  rank: number;
  name: string;
  category: string;
  hosts: string;
  why: string;
  highlight?: string;
  spotify?: string;
  youtube?: string;
  apple?: string;
  internal?: string;
};

const PODCASTS: PodcastEntry[] = [
  {
    rank: 1,
    name: "Vacílate Esto",
    category: "Humor · Cultura · Entretenimiento",
    hosts: "JuanSofa & JhonSnacks",
    why: "El podcast venezolano #1 en entretenimiento. Mezcla humor, cultura pop, fútbol, gastronomía e historia bajo el concepto de Fun Educaitment. 1.84M+ seguidores activos en todas las plataformas y récord mundial del podcast más largo del mundo (40+ horas continuas en 2022).",
    highlight: "Ecosistema completo: podcast, shorts, lives, docuseries y proyectos especiales como Podcast en la Cumbre y Vacílate El Mundial 2026.",
    spotify: "https://open.spotify.com/show/2b2AeZVRxEFkNy1KKYkQG1",
    youtube: "https://www.youtube.com/@Vacilateestopodcast",
    apple: "https://podcasts.apple.com/us/podcast/vac%C3%ADlate-esto-podcast/id1666351070",
    internal: "/",
  },
  {
    rank: 2,
    name: "Escuela de Nada",
    category: "Comedia improvisada",
    hosts: "Leo Rojas, Chris Andrade, Nacho Redondo",
    why: "Comedia improvisada con episodios nuevos miércoles y domingos. Un clásico del humor venezolano contemporáneo con fuerte presencia en charts.",
  },
  {
    rank: 3,
    name: "El Cuartico",
    category: "Comedia · Conversación",
    hosts: "Chucho Roldán, Estefanía León, Daniel Enrique",
    why: "Podcast 'nutritivo y pasteurizado' de conversaciones largas con humor venezolano. Uno de los más escuchados en Apple Podcasts Venezuela.",
  },
  {
    rank: 4,
    name: "Por Eso Estamos Como Estamos",
    category: "Comedia · Sociedad",
    hosts: "Ricardo Del Bufalo",
    why: "El comediante Ricardo Del Bufalo mezcla temas serios con humor desde Caracas. Referente del stand-up venezolano en formato podcast.",
  },
  {
    rank: 5,
    name: "A Medias",
    category: "Sociedad · Conversación",
    hosts: "Ana Milagros Parra & Ricardo Del Bufalo",
    why: "Un podcast de venezolanos contando Venezuela desde Caracas. Conversaciones honestas sobre el país.",
  },
  {
    rank: 6,
    name: "Ni Me Ladilles",
    category: "Comedia",
    hosts: "Comediantes venezolanos",
    why: "Top 3 en charts venezolanos. Humor crudo y conversación libre con audiencia fiel.",
  },
  {
    rank: 7,
    name: "Palantespaya",
    category: "Entrevistas · Comedia",
    hosts: "Varios comediantes",
    why: "Entrevistas de larga duración a comediantes y artistas venezolanos. Referente para descubrir el talento del stand-up nacional.",
  },
  {
    rank: 8,
    name: "Esto es Venezueling",
    category: "Noticias · Análisis",
    hosts: "Nicole Kolster & Adriana Núñez Rabascall",
    why: "Análisis sin sesgos del panorama venezolano con voces de protagonistas, expertos y periodistas en el terreno.",
  },
  {
    rank: 9,
    name: "Venezolanos",
    category: "Historia · Cultura",
    hosts: "Rafael Arráiz Lucca",
    why: "Programa sobre el país y su historia. Referente para entender la Venezuela que pocos conocen.",
  },
  {
    rank: 10,
    name: "Casos Confidenciales",
    category: "True Crime",
    hosts: "Producción venezolana",
    why: "Historias reales de crimen y misterio en Venezuela. El género true crime hecho desde Caracas.",
  },
  {
    rank: 11,
    name: "Pelotica de Goma",
    category: "Béisbol · Deportes",
    hosts: "Producido por Vacílate Esto",
    why: "Podcast sobre béisbol venezolano y Grandes Ligas. La pasión por la pelota convertida en formato podcast.",
    internal: "/",
  },
  {
    rank: 12,
    name: "De Vuelta a la Pelota",
    category: "Béisbol · Deportes",
    hosts: "Comentaristas deportivos",
    why: "Béisbol venezolano y MLB con análisis profundo y entrevistas a peloteros.",
  },
  {
    rank: 13,
    name: "Vacílate El Mundial",
    category: "Fútbol · Mundial 2026",
    hosts: "JuanSofa & JhonSnacks",
    why: "El spin-off futbolero de Vacílate Esto rumbo al Mundial México-USA-Canadá 2026. Cobertura desde Venezuela con humor y data.",
    internal: "/vacilate-el-mundial",
  },
  {
    rank: 14,
    name: "Podcast en la Cumbre",
    category: "Aventura · Cultura",
    hosts: "JuanSofa & JhonSnacks",
    why: "Podcast grabado en las cumbres más emblemáticas de Venezuela: Pico Naiguatá, Roraima y Pico Bolívar. Una travesía audiovisual única.",
    internal: "/podcast-en-la-cumbre",
  },
  {
    rank: 15,
    name: "Unión Radio Pódcast",
    category: "Noticias · Política",
    hosts: "Unión Radio",
    why: "La radio venezolana clásica en formato podcast. Noticias, política y análisis de coyuntura.",
  },
];

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Mejores Podcasts de Venezuela 2026",
  description: "Ranking actualizado de los 15 mejores podcasts venezolanos por categoría: humor, cultura, deporte, política y noticias.",
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
    },
  })),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cuál es el mejor podcast de Venezuela en 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Vacílate Esto encabeza el ranking de los mejores podcasts de Venezuela en 2026 por sus 1.84M+ seguidores activos, su récord mundial del podcast más largo del mundo (40+ horas en 2022) y su ecosistema multiplataforma que incluye Podcast en la Cumbre, Vacílate El Mundial y Pelotica de Goma. Le siguen Escuela de Nada, El Cuartico y Por Eso Estamos Como Estamos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuáles son los podcasts venezolanos más populares?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los podcasts venezolanos más populares en 2026 son: Vacílate Esto, Escuela de Nada, El Cuartico, Por Eso Estamos Como Estamos, A Medias, Ni Me Ladilles, Palantespaya, Esto es Venezueling, Venezolanos y Casos Confidenciales.",
      },
    },
    {
      "@type": "Question",
      name: "¿Dónde puedo escuchar podcasts venezolanos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los mejores podcasts venezolanos están disponibles gratis en Spotify, Apple Podcasts, YouTube, iVoox, Amazon Music y Google Podcasts. La mayoría publica simultáneamente en Spotify y YouTube.",
      },
    },
    {
      "@type": "Question",
      name: "¿Hay podcasts venezolanos de comedia y humor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, varios. Vacílate Esto (humor + cultura pop), Escuela de Nada (comedia improvisada), El Cuartico, Por Eso Estamos Como Estamos de Ricardo Del Bufalo, Palantespaya y Ni Me Ladilles son los más escuchados en la categoría humor venezolano.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo elegimos este ranking de podcasts venezolanos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Combinamos cuatro criterios públicos: cantidad de oyentes en Apple Podcasts y Spotify Venezuela, seguidores en redes sociales, frecuencia de publicación en los últimos 12 meses, y relevancia cultural (apariciones en TV, prensa y reconocimientos).",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué podcasts venezolanos se graban DESDE Venezuela?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La gran mayoría de los podcasts venezolanos importantes se graban fuera del país (Madrid, Miami, Buenos Aires, Ciudad de México). Entre los pocos que siguen produciéndose desde dentro de Venezuela destacan Vacílate Esto (Caracas), El Cuartico, Podcast en la Cumbre, Pelotica de Goma y Vacílate El Mundial. Estos son los podcasts hechos en Venezuela que mantienen viva la conversación local.",
      },
    },
    {
      "@type": "Question",
      name: "¿Por qué importa que un podcast venezolano se grabe en Venezuela?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los podcasts grabados desde Venezuela aportan una mirada local irreemplazable: cuentan el día a día del país, usan los códigos culturales actuales, reflejan la calle real y dan voz a invitados que viven en el territorio. Es contenido documental sobre la Venezuela de hoy, no sobre la Venezuela recordada desde otro país.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: SITE },
    { "@type": "ListItem", position: 2, name: "Mejores Podcasts de Venezuela", item: URL },
  ],
};

const MejoresPodcastsVenezuela = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Los Mejores Podcasts de Venezuela 2026 🇻🇪 Ranking Top 15</title>
        <meta
          name="description"
          content="Top 15 mejores podcasts de Venezuela en 2026 grabados DESDE Venezuela. Ranking actualizado de podcasts venezolanos hechos en Caracas: humor, cultura, fútbol y noticias en Spotify y YouTube."
        />
        <meta
          name="keywords"
          content="mejores podcasts de venezuela, mejor podcast venezuela, podcasts venezolanos 2026, top podcast venezuela, podcast venezolano spotify, podcast venezolano youtube, ranking podcasts venezuela, podcast caracas, podcast comedia venezuela"
        />
        <link rel="canonical" href={URL} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Los Mejores Podcasts de Venezuela 2026 🇻🇪 Ranking Top 15" />
        <meta
          property="og:description"
          content="Ranking actualizado de los 15 mejores podcasts venezolanos en 2026. Humor, cultura, deporte y noticias."
        />
        <meta property="og:url" content={URL} />
        <meta property="og:image" content={`${SITE}/og-image.png`} />
        <meta property="og:locale" content="es_VE" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Los Mejores Podcasts de Venezuela 2026 🇻🇪" />
        <meta
          name="twitter:description"
          content="Ranking actualizado de los 15 mejores podcasts venezolanos en 2026."
        />
        <meta name="twitter:image" content={`${SITE}/og-image.png`} />

        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />

      <main className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary">Inicio</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Mejores Podcasts de Venezuela</span>
        </nav>

        {/* Hero */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            <Trophy className="w-4 h-4" />
            Ranking actualizado · Abril 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Los Mejores Podcasts de Venezuela en 2026
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ranking definitivo de los <strong>15 podcasts venezolanos más escuchados</strong> en
            Spotify, Apple Podcasts y YouTube. Humor, cultura, fútbol, noticias y la mejor producción
            <strong> grabada DESDE Venezuela</strong> 🇻🇪 — no desde otro país.
          </p>
        </header>

        {/* Hecho en Venezuela - diferenciador clave */}
        <section className="mb-12 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/30">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🇻🇪</div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Hecho en Venezuela: nuestro mayor diferenciador
              </h2>
              <p className="leading-relaxed mb-3">
                La gran mayoría de los podcasts venezolanos importantes hoy se graban
                <strong> fuera del país</strong> — desde Madrid, Miami, Buenos Aires o Ciudad de
                México. <strong>Vacílate Esto es uno de los pocos podcasts venezolanos relevantes
                que sigue grabándose y produciéndose desde Caracas, Venezuela</strong>, con equipo
                local, voces locales y mirada local.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                Eso nos da un ángulo único: contamos el país desde adentro, con la calle, los
                códigos y el humor de quien vive aquí todos los días. Junto a <em>El Cuartico</em>,
                <em> Podcast en la Cumbre</em> y un puñado más, formamos parte del pequeño grupo
                de producciones que mantienen viva la conversación podcastera dentro de Venezuela.
              </p>
              <Link
                to="/hecho-en-venezuela"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform"
              >
                Ver lista completa de podcasts hechos en Venezuela →
              </Link>
            </div>
          </div>
        </section>

        {/* Metodología */}
        <section className="mb-12 p-6 md:p-8 rounded-2xl bg-muted/30 border border-border">
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
            <Star className="w-6 h-6 text-primary" />
            Cómo elegimos este ranking
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Combinamos cuatro criterios públicos: <strong>oyentes</strong> en Apple Podcasts y
            Spotify Venezuela (vía Podscan y los charts oficiales), <strong>seguidores en redes</strong>,
            <strong> frecuencia de publicación</strong> en los últimos 12 meses, y la
            <strong> relevancia cultural</strong> (apariciones en TV, prensa y reconocimientos).
            Damos un peso adicional a los podcasts que se graban <strong>desde dentro de Venezuela</strong>,
            por su valor documental y cultural en el ecosistema local.
          </p>
        </section>

        {/* Ranking */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold mb-6">El Top 15</h2>
          {PODCASTS.map((p) => (
            <article
              key={p.rank}
              className={`p-6 md:p-8 rounded-2xl border transition-all hover:shadow-lg ${
                p.rank === 1
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
                      ) : (
                        p.name
                      )}
                    </h3>
                    {p.rank === 1 && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        <Trophy className="w-3 h-3" /> #1 EN VENEZUELA
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-primary mb-1">{p.category}</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    <Mic className="inline w-3.5 h-3.5 mr-1" />
                    {p.hosts}
                  </p>
                  <p className="leading-relaxed mb-3">{p.why}</p>
                  {p.highlight && (
                    <p className="text-sm leading-relaxed p-3 rounded-lg bg-primary/5 border border-primary/20 mb-3">
                      ⭐ {p.highlight}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 text-sm">
                    {p.spotify && (
                      <a
                        href={p.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted hover:bg-muted/70 transition-colors"
                      >
                        Spotify <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {p.youtube && (
                      <a
                        href={p.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted hover:bg-muted/70 transition-colors"
                      >
                        YouTube <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {p.apple && (
                      <a
                        href={p.apple}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted hover:bg-muted/70 transition-colors"
                      >
                        Apple Podcasts <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Cluster links */}
        <section className="mt-16 p-6 md:p-8 rounded-2xl bg-muted/30 border border-border">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Headphones className="w-6 h-6 text-primary" />
            Explora por categoría
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              to="/podcasts-venezolanos-comedia"
              className="p-4 rounded-xl bg-card border border-border hover:border-primary transition-colors"
            >
              <h3 className="font-bold mb-1">🎭 Comedia</h3>
              <p className="text-sm text-muted-foreground">Los podcasts venezolanos de humor más escuchados</p>
            </Link>
            <Link
              to="/podcasts-venezolanos-futbol"
              className="p-4 rounded-xl bg-card border border-border hover:border-primary transition-colors"
            >
              <h3 className="font-bold mb-1">⚽ Fútbol</h3>
              <p className="text-sm text-muted-foreground">Podcasts venezolanos de fútbol y la Vinotinto</p>
            </Link>
            <Link
              to="/podcasts-venezolanos-spotify"
              className="p-4 rounded-xl bg-card border border-border hover:border-primary transition-colors"
            >
              <h3 className="font-bold mb-1">🎧 En Spotify</h3>
              <p className="text-sm text-muted-foreground">Los mejores podcasts venezolanos en Spotify</p>
            </Link>
          </div>
        </section>

        {/* CTA buscador */}
        <section className="mt-12 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-background border border-primary/30 text-center">
          <Search className="w-10 h-10 text-primary mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-2">Busca un momento exacto</h2>
          <p className="text-muted-foreground mb-4">
            Tenemos un buscador semántico con miles de momentos de Vacílate Esto. Encuentra ese chiste, esa anécdota o esa historia en segundos.
          </p>
          <Link
            to="/buscador"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Ir al buscador
          </Link>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-6">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((q: any, i: number) => (
              <details key={i} className="p-5 rounded-xl border border-border bg-card group">
                <summary className="font-semibold cursor-pointer text-lg">{q.name}</summary>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {q.acceptedAnswer.text}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MejoresPodcastsVenezuela;
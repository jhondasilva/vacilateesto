import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const POSTS = [
  {
    slug: "pelotica-de-goma-split-4",
    title: "Pelotica de Goma 4to Split: 35 juegos en septiembre por La Guaira",
    excerpt:
      "Fechas, sedes, formato del Final Four y los 8 equipos del 4to Split de la Liga Pelotica de Goma Vacílate Esto.",
    category: "Deporte",
    minutes: 7,
    date: "2026-08-21",
  },
  {
    slug: "tio-simon-frases-tributo",
    title: "Tío Simón Díaz: frases, tributo y por qué sigue siendo el alma de Venezuela",
    excerpt:
      "Las mejores frases, canciones y el tributo del episodio 200 al hombre que tradujo el llano al mundo entero.",
    category: "Cultura",
    minutes: 8,
    date: "2026-05-20",
  },
  {
    slug: "mejor-perro-caliente-caracas",
    title: "Los mejores perros calientes de Caracas: la ruta definitiva 2026",
    excerpt:
      "Anatomía del perro caraqueño, los mejores perreros y las reglas no escritas del ritual nocturno más sagrado de la ciudad.",
    category: "Gastronomía",
    minutes: 9,
    date: "2026-04-24",
  },
  {
    slug: "que-es-la-llaneridad",
    title: "Qué es la llaneridad: el código del llanero venezolano",
    excerpt:
      "El ADN, los códigos de honor y las costumbres del llanero. Una guía cultural para entender la raíz de Venezuela.",
    category: "Cultura",
    minutes: 10,
    date: "2026-04-10",
  },
  {
    slug: "marcas-venezolanas-nostalgicas",
    title: "Marcas venezolanas que viven en tus recuerdos",
    excerpt:
      "Savoy, Polar, Pampero, Toddy, Cocosette y todas las marcas que se volvieron parte de la identidad nacional.",
    category: "Cultura",
    minutes: 10,
    date: "2026-03-28",
  },
  {
    slug: "mejores-podcasts-venezolanos-2026",
    title: "Los mejores podcasts venezolanos para escuchar en 2026",
    excerpt:
      "Top 15 podcasts hechos en Venezuela por categoría: humor, cultura, deporte, política y marketing.",
    category: "Listas",
    minutes: 9,
    date: "2026-04-26",
  },
  {
    slug: "como-subir-roraima-guia-completa",
    title: "Cómo subir el Monte Roraima: guía completa 2026",
    excerpt:
      "Días, dificultad, costo, qué llevar y operadores. La guía definitiva al tepuy más famoso de Venezuela.",
    category: "Aventura",
    minutes: 14,
    date: "2026-04-26",
  },
  {
    slug: "como-subir-pico-naiguata",
    title: "Cómo subir el Pico Naiguatá, el techo de Caracas",
    excerpt:
      "Rutas, dificultad, permisos Inparques y qué esperar de los 2.765 metros de la Cordillera de la Costa.",
    category: "Aventura",
    minutes: 9,
    date: "2026-04-26",
  },
  {
    slug: "leyendas-urbanas-venezuela",
    title: "10 leyendas urbanas de Venezuela que dan escalofríos",
    excerpt:
      "La Sayona, El Silbón, La Llorona del Catatumbo y todos los mitos que marcaron tu infancia venezolana.",
    category: "Cultura",
    minutes: 11,
    date: "2026-04-26",
  },
  {
    slug: "historia-de-la-arepa",
    title: "Historia de la arepa y las mejores areperas de Caracas",
    excerpt:
      "De los timoto-cuicas al Wynwood: el origen de la arepa y dónde te la comes mejor en Caracas.",
    category: "Gastronomía",
    minutes: 12,
    date: "2026-04-26",
  },
  {
    slug: "donde-ver-mundial-2026-desde-venezuela",
    title: "Dónde ver el Mundial 2026 desde Venezuela",
    excerpt:
      "Canales, apps de streaming, horarios de la Vinotinto y paquetes para viajar a México, USA y Canadá.",
    category: "Mundial 2026",
    minutes: 8,
    date: "2026-04-26",
  },
  {
    slug: "podcast-mas-largo-historia",
    title: "El podcast más largo de la historia: top 5 maratones del mundo",
    excerpt:
      "Récords de podcasts maratón en el mundo, con el caso del Podcast Eterno de Vacílate Esto (40 horas).",
    category: "Récords",
    minutes: 7,
    date: "2026-04-26",
  },
  {
    slug: "ruta-del-ramen-caracas",
    title: "Ruta del ramen en Caracas: los 10 mejores spots",
    excerpt:
      "El mapa definitivo del ramen caraqueño, reseñado por JuanSofa y JhonSnacks. De Las Mercedes a La Castellana.",
    category: "Gastronomía",
    minutes: 8,
    date: "2026-04-26",
  },
];

const SITE = "https://www.vacilateesto.com";

const BlogIndex = () => {
  const [dbPosts, setDbPosts] = useState<typeof POSTS>([]);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("slug,title,description,category,reading_minutes,published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        if (!data) return;
        setDbPosts(
          data.map((p: any) => ({
            slug: p.slug,
            title: p.title,
            excerpt: p.description,
            category: p.category || "Podcast",
            minutes: p.reading_minutes || 6,
            date: (p.published_at || "").slice(0, 10),
          })),
        );
      });
  }, []);

  const allPosts = [...dbPosts, ...POSTS].sort((a, b) =>
    (b.date || "").localeCompare(a.date || ""),
  );

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog de Vacílate Esto",
    url: `${SITE}/blog`,
    inLanguage: "es-VE",
    publisher: {
      "@type": "Organization",
      name: "Vacílate Esto",
      url: SITE,
    },
    blogPost: allPosts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE}/blog/${p.slug}`,
      datePublished: p.date,
      author: { "@type": "Organization", name: "Vacílate Esto" },
    })),
  };

  return (
    <>
      <Helmet>
        <html lang="es-VE" />
        <title>Blog | Vacílate Esto - Cultura venezolana, aventura y entretenimiento</title>
        <meta
          name="description"
          content="Guías, listicles y reportajes desde Venezuela: mejores podcasts venezolanos, ascensos al Roraima y Naiguatá, leyendas urbanas, historia de la arepa, Mundial 2026 y mucho más."
        />
        <meta name="keywords" content="blog vacilate esto, blog venezuela, cultura venezolana, podcast venezolano, mejores podcasts venezuela, leyendas urbanas venezuela, historia arepa, mundial 2026 venezuela, roraima, pico naiguata, ramen caracas" />
        <link rel="canonical" href={`${SITE}/blog`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Blog | Vacílate Esto" />
        <meta property="og:description" content="Guías, listicles y reportajes hechos en Venezuela." />
        <meta property="og:url" content={`${SITE}/blog`} />
        <meta property="og:image" content={`${SITE}/og-image.png`} />
        <script type="application/ld+json">{JSON.stringify(blogSchema)}</script>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <header className="mb-12 text-center">
            <p className="text-xs uppercase tracking-widest text-primary font-bold mb-3">
              Blog
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4 break-words hyphens-auto">
              Lo que vacilamos por escrito
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Guías, listicles y reportajes desde Venezuela. Cultura, aventura, gastronomía y todo lo que da pie pa' un buen episodio.
            </p>
          </header>

          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            {allPosts.map((p) => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="group block p-5 sm:p-6 md:p-7 bg-card border border-border rounded-2xl hover:border-primary/40 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-3 text-xs flex-wrap">
                  <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full font-semibold uppercase tracking-wide">
                    {p.category}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground whitespace-nowrap">
                    <Clock className="w-3 h-3" /> {p.minutes} min
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 leading-tight group-hover:text-primary transition-colors break-words hyphens-auto">
                  {p.title}
                </h2>
                <p className="text-foreground/70 text-sm md:text-base leading-relaxed mb-4">
                  {p.excerpt}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Leer artículo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default BlogIndex;
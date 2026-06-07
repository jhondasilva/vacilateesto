import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import StickerHeader from "./StickerHeader";

const STATIC_POSTS = [
  {
    slug: "tio-simon-frases-tributo",
    title: "Tío Simón Díaz: frases, tributo y por qué sigue siendo el alma de Venezuela",
    excerpt: "Las mejores frases, canciones y el tributo del episodio 200 al hombre que tradujo el llano al mundo entero.",
    category: "Cultura",
    minutes: 8,
    date: "2026-05-20",
  },
  {
    slug: "mejor-perro-caliente-caracas",
    title: "Los mejores perros calientes de Caracas: la ruta definitiva 2026",
    excerpt: "Anatomía del perro caraqueño, los mejores perreros y las reglas no escritas del ritual nocturno más sagrado de la ciudad.",
    category: "Gastronomía",
    minutes: 9,
    date: "2026-04-24",
  },
  {
    slug: "que-es-la-llaneridad",
    title: "Qué es la llaneridad: el código del llanero venezolano",
    excerpt: "El ADN, los códigos de honor y las costumbres del llanero. Una guía cultural para entender la raíz de Venezuela.",
    category: "Cultura",
    minutes: 10,
    date: "2026-04-10",
  },
  {
    slug: "marcas-venezolanas-nostalgicas",
    title: "Marcas venezolanas que viven en tus recuerdos",
    excerpt: "Savoy, Polar, Pampero, Toddy, Cocosette y todas las marcas que se volvieron parte de la identidad nacional.",
    category: "Cultura",
    minutes: 10,
    date: "2026-03-28",
  },
];

const BlogSection = () => {
  const [dbPosts, setDbPosts] = useState<typeof STATIC_POSTS>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("slug,title,description,category,reading_minutes,published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(4)
      .then(({ data }) => {
        if (data) {
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
        }
        setLoading(false);
      });
  }, []);

  const allPosts = [...dbPosts, ...STATIC_POSTS].sort((a, b) =>
    (b.date || "").localeCompare(a.date || ""),
  ).slice(0, 4);

  return (
    <section id="blog" className="relative overflow-hidden bg-background py-20 md:py-28">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 left-0 w-[28rem] h-[28rem] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[28rem] h-[28rem] bg-accent/8 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <StickerHeader
          titleId="blog-section-title"
          badge="Contenido escrito"
          badgeIcon={Sparkles}
          title="lo que vacilamos"
          highlight="por escrito"
          description="Guías, listicles y reportajes desde Venezuela. Cultura, aventura, gastronomía y todo lo que da pie pa' un buen episodio."
        />

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-card border border-border rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {allPosts.map((p) => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="group block p-6 md:p-7 bg-card border border-border rounded-2xl hover:border-primary/40 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3 mb-3 text-xs">
                  <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full font-semibold uppercase tracking-wide">
                    {p.category}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" /> {p.minutes} min
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 leading-tight group-hover:text-primary transition-colors">
                  {p.title}
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed mb-4 line-clamp-2">
                  {p.excerpt}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Leer artículo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-foreground text-background rounded-full px-6 py-3 border-2 border-foreground font-display font-black text-sm uppercase tracking-widest hover:bg-background hover:text-foreground transition-colors"
          >
            Ver todo el blog
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;

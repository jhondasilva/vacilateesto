import { Helmet } from "react-helmet-async";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Calendar, Clock, Tag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BlogArticleLayoutProps {
  /** Slug after /blog/, e.g. "mejores-podcasts-venezolanos-2026". Use full path for non-blog (e.g. "/hosts"). */
  slug: string;
  /** Full canonical path including leading slash, e.g. "/blog/xxx" or "/hosts". */
  canonicalPath: string;
  title: string; // <title>
  h1: string; // visible H1
  description: string; // meta description (<160 chars)
  keywords: string;
  /** ISO date "YYYY-MM-DD" */
  datePublished: string;
  dateModified?: string;
  readingMinutes: number;
  category: string;
  tags: string[];
  /** Optional FAQ rendered as block + JSON-LD FAQPage schema. */
  faq?: FAQItem[];
  /** Hero image URL (absolute or root-relative). Defaults to og-image. */
  heroImage?: string;
  /** Table of contents items (anchor + label). Optional. */
  toc?: { id: string; label: string }[];
  children: ReactNode;
}

const SITE = "https://www.vacilateesto.com";

const BlogArticleLayout = ({
  canonicalPath,
  title,
  h1,
  description,
  keywords,
  datePublished,
  dateModified,
  readingMinutes,
  category,
  tags,
  faq,
  heroImage = "/og-image.png",
  toc,
  children,
}: BlogArticleLayoutProps) => {
  const url = `${SITE}${canonicalPath}`;
  const image = heroImage.startsWith("http") ? heroImage : `${SITE}${heroImage}`;
  const modified = dateModified ?? datePublished;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: h1,
    description,
    image: [image],
    datePublished,
    dateModified: modified,
    inLanguage: "es-VE",
    keywords,
    articleSection: category,
    author: [
      {
        "@type": "Person",
        name: "Juan Carlos Martínez",
        alternateName: "JuanSofa",
        url: "https://www.instagram.com/juansofa/",
      },
      {
        "@type": "Person",
        name: "Jhon Da Silva",
        alternateName: "JhonSnacks",
        url: "https://www.instagram.com/jhonsnacks/",
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "Vacílate Esto",
      url: SITE,
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/og-image.png`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE },
      ...(canonicalPath.startsWith("/blog/")
        ? [{ "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` }]
        : []),
      {
        "@type": "ListItem",
        position: canonicalPath.startsWith("/blog/") ? 3 : 2,
        name: h1,
        item: url,
      },
    ],
  };

  const faqSchema = faq && faq.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <>
      <Helmet>
        <html lang="es-VE" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="Vacílate Esto" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={url} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        <meta property="og:locale" content="es_VE" />
        <meta property="og:site_name" content="Vacílate Esto" />
        <meta property="article:published_time" content={datePublished} />
        <meta property="article:modified_time" content={modified} />
        <meta property="article:section" content={category} />
        {tags.map((t) => (
          <meta property="article:tag" content={t} key={t} />
        ))}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {faqSchema && (
          <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        )}
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24 pb-16">
        <article className="container mx-auto px-4 max-w-3xl">
          {/* Breadcrumb visual */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 flex-wrap min-w-0"
          >
            <Link to="/" className="hover:text-primary transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-3 h-3" />
            {canonicalPath.startsWith("/blog/") ? (
              <>
                <span className="text-muted-foreground">Blog</span>
                <ChevronRight className="w-3 h-3" />
              </>
            ) : null}
            <span className="text-foreground font-medium truncate">{h1}</span>
          </nav>

          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-x-2 gap-y-1.5 mb-4 text-xs flex-wrap">
              <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full font-semibold uppercase tracking-wide">
                {category}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground whitespace-nowrap">
                <Calendar className="w-3 h-3" />
                {new Date(datePublished).toLocaleDateString("es-VE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground whitespace-nowrap">
                <Clock className="w-3 h-3" />
                {readingMinutes} min de lectura
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight text-foreground mb-4 break-words hyphens-auto">
              {h1}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>
          </header>

          {/* TOC */}
          {toc && toc.length > 0 && (
            <aside className="mb-10 p-5 bg-muted/40 border border-border rounded-xl">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Contenido
              </h2>
              <ol className="space-y-1.5 text-sm">
                {toc.map((item, i) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      <span className="text-muted-foreground mr-2">
                        {String(i + 1).padStart(2, "0")}.
                      </span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </aside>
          )}

          {/* Body */}
          <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-foreground/85 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-li:text-foreground/85 prose-blockquote:border-primary prose-blockquote:text-foreground/90">
            {children}
          </div>

          {/* FAQ */}
          {faq && faq.length > 0 && (
            <section className="mt-16 pt-10 border-t border-border" id="faq">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight">
                Preguntas frecuentes
              </h2>
              <div className="space-y-4">
                {faq.map((f) => (
                  <details
                    key={f.question}
                    className="group bg-muted/30 border border-border rounded-xl p-5 transition-all hover:border-primary/40"
                  >
                    <summary className="cursor-pointer font-semibold text-foreground flex items-center justify-between gap-4">
                      <span>{f.question}</span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-90 flex-shrink-0" />
                    </summary>
                    <p className="mt-3 text-foreground/80 leading-relaxed">
                      {f.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Tags */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 text-xs bg-muted text-muted-foreground rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-10 p-6 md:p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl">
              <p className="text-xs uppercase tracking-wider text-primary font-bold mb-2">
                Vacílate Esto
              </p>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Escucha el marca de entretenimiento digital relevante hecha en Venezuela
              </h3>
              <p className="text-foreground/75 mb-5">
                Humor, cultura y entretenimiento todas las semanas con JuanSofa y JhonSnacks.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://open.spotify.com/show/2b2AeZVRxEFkNy1KKYkQG1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-opacity text-sm"
                >
                  Escuchar en Spotify
                </a>
                <a
                  href="https://www.youtube.com/@Vacilateestopodcast"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-2.5 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-opacity text-sm"
                >
                  Ver en YouTube
                </a>
                <Link
                  to="/buscador"
                  className="inline-flex items-center px-5 py-2.5 border border-border text-foreground font-semibold rounded-full hover:bg-muted transition-colors text-sm"
                >
                  Buscar momentos
                </Link>
              </div>
            </div>
          </footer>
        </article>
      </main>

      <Footer />
    </>
  );
};

export default BlogArticleLayout;
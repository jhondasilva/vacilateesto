import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import BlogArticleLayout from "@/components/blog/BlogArticleLayout";

type Post = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  keywords: string;
  category: string;
  tags: string[];
  hero_image: string | null;
  body_md: string;
  faq: { question: string; answer: string }[];
  reading_minutes: number;
  published_at: string;
  updated_at: string;
  tl_dr: string | null;
  speakable_summary: string | null;
};

const BlogPostDynamic = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    setLoading(true);
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        setPost((data as unknown as Post) ?? null);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Cargando…</div>
      </div>
    );
  }

  if (!post) return <Navigate to="/blog" replace />;

  // Speakable schema for AI Search / voice assistants
  const speakableSchema = post.speakable_summary
    ? {
        "@context": "https://schema.org",
        "@type": "WebPage",
        url: `https://www.vacilateesto.com/blog/${post.slug}`,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["#tl-dr", "h1"],
        },
        about: post.h1,
        description: post.speakable_summary,
      }
    : null;

  return (
    <>
      {speakableSchema && (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(speakableSchema)}
          </script>
        </Helmet>
      )}
    <BlogArticleLayout
      slug={post.slug}
      canonicalPath={`/blog/${post.slug}`}
      title={post.title}
      h1={post.h1}
      description={post.description}
      keywords={post.keywords}
      datePublished={post.published_at.slice(0, 10)}
      dateModified={post.updated_at.slice(0, 10)}
      readingMinutes={post.reading_minutes}
      category={post.category}
      tags={post.tags || []}
      faq={post.faq || []}
      heroImage={post.hero_image || undefined}
    >
        {post.tl_dr && (
          <div
            id="tl-dr"
            className="not-prose mb-8 p-5 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent"
          >
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              Resumen rápido
            </div>
            <p className="text-foreground/90 leading-relaxed text-base">
              {post.tl_dr}
            </p>
          </div>
        )}
      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {post.body_md}
      </ReactMarkdown>
    </BlogArticleLayout>
    </>
  );
};

export default BlogPostDynamic;
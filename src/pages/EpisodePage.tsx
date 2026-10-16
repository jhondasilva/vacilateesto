import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFound from "@/pages/NotFound";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/seo";
import { episodeJsonLd, isValidVideoId, type PublicEpisode } from "@/lib/episodes";

const formatDuration = (s: number) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h ? `${h} h ${String(m).padStart(2, "0")} min` : `${m} min`;
};

const EpisodePage = () => {
  const { videoId = "" } = useParams();
  const [episode, setEpisode] = useState<PublicEpisode | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "missing">("loading");

  useEffect(() => {
    if (!isValidVideoId(videoId)) { setState("missing"); return; }
    let alive = true;
    setState("loading");
    // Solo columnas ya públicas del catálogo; nunca transcripciones.
    supabase
      .from("yt_videos")
      .select("video_id, title, description, thumbnail_url, published_at, duration_seconds, kind")
      .eq("video_id", videoId)
      .eq("is_available", true)
      .not("published_at", "is", null)
      .maybeSingle()
      .then(({ data }) => {
        if (!alive) return;
        if (data) { setEpisode(data as PublicEpisode); setState("ok"); } else setState("missing");
      });
    return () => { alive = false; };
  }, [videoId]);

  if (state === "missing") return <NotFound />;

  const url = `${SITE}/episodios/${videoId}`;
  const date = episode?.published_at ? new Date(episode.published_at) : null;

  return (
    <div className="min-h-screen bg-background">
      {episode && (
        <Helmet>
          <title>{`${episode.title} | Vacílate Esto`}</title>
          <meta name="description" content={(episode.description || episode.title).slice(0, 160)} />
          <link rel="canonical" href={url} />
          <meta property="og:type" content="video.other" />
          <meta property="og:url" content={url} />
          <meta property="og:title" content={episode.title} />
          <meta property="og:description" content={(episode.description || episode.title).slice(0, 200)} />
          {episode.thumbnail_url && <meta property="og:image" content={episode.thumbnail_url} />}
          {episode.thumbnail_url && <meta name="twitter:image" content={episode.thumbnail_url} />}
          <script type="application/ld+json">{JSON.stringify(episodeJsonLd(episode))}</script>
        </Helmet>
      )}
      <Header />
      <main className="container mx-auto max-w-4xl px-4 pb-16 pt-28">
        <nav aria-label="Ruta de navegación" className="mb-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Inicio</Link>
          <span aria-hidden="true"> / </span>
          <Link to="/buscador" className="hover:text-primary">Episodios</Link>
        </nav>
        {state === "loading" || !episode ? (
          <div role="status" className="space-y-4">
            <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
            <div className="aspect-video w-full animate-pulse rounded-2xl bg-muted" />
            <span className="sr-only">Cargando episodio…</span>
          </div>
        ) : (
          <article>
            <h1 className="mb-3 font-display text-3xl font-bold text-foreground md:text-4xl">{episode.title}</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              {date && <time dateTime={episode.published_at!}>{date.toLocaleDateString("es-VE", { day: "numeric", month: "long", year: "numeric" })}</time>}
              {episode.duration_seconds ? <> · {formatDuration(episode.duration_seconds)}</> : null}
            </p>
            <div className="mb-8 aspect-video w-full overflow-hidden rounded-2xl border border-border bg-muted">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${episode.video_id}`}
                title={episode.title}
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {episode.description && (
              <p className="mb-8 whitespace-pre-line text-foreground/90">{episode.description}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm">
              <a href={`https://www.youtube.com/watch?v=${episode.video_id}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">Ver en YouTube</a>
              <Link to="/buscador" className="font-semibold text-primary hover:underline">Buscar en otros episodios</Link>
            </div>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default EpisodePage;

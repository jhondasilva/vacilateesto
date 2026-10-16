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
  const [state, setState] = useState<"loading" | "ok" | "missing" | "error">("loading");

  useEffect(() => {
    // Limpia el episodio anterior para no mezclar título viejo con canonical nuevo.
    setEpisode(null);
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
      .lte("published_at", new Date().toISOString())
      .maybeSingle()
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) { setState("error"); return; }
        if (data) { setEpisode(data as PublicEpisode); setState("ok"); } else setState("missing");
      });
    return () => { alive = false; };
  }, [videoId]);

  if (state === "missing") return <NotFound />;

  const url = `${SITE}/episodios/${videoId}`;
  const shown = state === "ok" && episode && episode.video_id === videoId ? episode : null;
  const date = shown?.published_at ? new Date(shown.published_at) : null;

  return (
    <div className="min-h-screen bg-background">
      {!shown && (
        <Helmet>
          <title>{state === "error" ? "Episodio no disponible por ahora | Vacílate Esto" : "Cargando episodio | Vacílate Esto"}</title>
          {state === "error" && <meta name="robots" content="noindex, nofollow" />}
        </Helmet>
      )}
      {shown && (
        <Helmet>
          <title>{`${shown.title} | Vacílate Esto`}</title>
          <meta name="description" content={(shown.description || shown.title).slice(0, 160)} />
          <link rel="canonical" href={url} />
          <meta property="og:type" content="video.other" />
          <meta property="og:url" content={url} />
          <meta property="og:title" content={shown.title} />
          <meta property="og:description" content={(shown.description || shown.title).slice(0, 200)} />
          {shown.thumbnail_url && <meta property="og:image" content={shown.thumbnail_url} />}
          {shown.thumbnail_url && <meta name="twitter:image" content={shown.thumbnail_url} />}
          <script type="application/ld+json">{JSON.stringify(episodeJsonLd(shown))}</script>
        </Helmet>
      )}
      <Header />
      <main className="container mx-auto max-w-4xl px-4 pb-16 pt-28">
        <nav aria-label="Ruta de navegación" className="mb-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Inicio</Link>
          <span aria-hidden="true"> / </span>
          <Link to="/buscador" className="hover:text-primary">Episodios</Link>
        </nav>
        {state === "error" ? (
          <div role="alert" className="space-y-4">
            <p className="text-foreground">No pudimos cargar este episodio en este momento. Revisa tu conexión e inténtalo de nuevo.</p>
            <button type="button" onClick={() => window.location.reload()} className="font-semibold text-primary hover:underline">Reintentar</button>
          </div>
        ) : !shown ? (
          <div role="status" className="space-y-4">
            <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
            <div className="aspect-video w-full animate-pulse rounded-2xl bg-muted" />
            <span className="sr-only">Cargando episodio…</span>
          </div>
        ) : (
          <article>
            <h1 className="mb-3 font-display text-3xl font-bold text-foreground md:text-4xl">{shown.title}</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              {date && <time dateTime={shown.published_at!}>{date.toLocaleDateString("es-VE", { day: "numeric", month: "long", year: "numeric" })}</time>}
              {shown.duration_seconds ? <> · {formatDuration(shown.duration_seconds)}</> : null}
            </p>
            <div className="mb-8 aspect-video w-full overflow-hidden rounded-2xl border border-border bg-muted">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${shown.video_id}`}
                title={shown.title}
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {shown.description && (
              <p className="mb-8 whitespace-pre-line text-foreground/90">{shown.description}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm">
              <a href={`https://www.youtube.com/watch?v=${shown.video_id}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">Ver en YouTube</a>
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

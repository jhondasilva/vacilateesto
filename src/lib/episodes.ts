import { SITE } from "./seo";

export type PublicEpisode = {
  video_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  published_at: string | null;
  duration_seconds: number | null;
  kind: string | null;
};

/** IDs de YouTube: 11 caracteres [A-Za-z0-9_-]. */
export const isValidVideoId = (id: string) => /^[A-Za-z0-9_-]{11}$/.test(id);
export const episodePath = (id: string) => `/episodios/${id}`;

export const episodeJsonLd = (e: PublicEpisode) => {
  const url = `${SITE}${episodePath(e.video_id)}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VideoObject",
        "@id": `${url}#video`,
        name: e.title,
        description: (e.description || e.title).slice(0, 2000),
        thumbnailUrl: e.thumbnail_url || `https://i.ytimg.com/vi/${e.video_id}/hqdefault.jpg`,
        ...(e.published_at ? { uploadDate: e.published_at } : {}),
        ...(e.duration_seconds ? { duration: `PT${e.duration_seconds}S` } : {}),
        embedUrl: `https://www.youtube.com/embed/${e.video_id}`,
        url,
        inLanguage: "es-VE",
        publisher: { "@type": "Organization", name: "Vacílate Esto", url: `${SITE}/` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Episodios", item: `${SITE}/buscador` },
          { "@type": "ListItem", position: 3, name: e.title, item: url },
        ],
      },
    ],
  };
};

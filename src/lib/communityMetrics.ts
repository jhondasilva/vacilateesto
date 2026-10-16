// Indicadores de comunidad (vínculo) separados de los de alcance (volumen).
export type CommunityPost = {
  platform: string;
  id: string;
  url: string;
  text: string;
  publishedAt: string | null;
  metrics: Record<string, number>;
};

export type PlatformCommunity = {
  platform: string;
  posts: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  /** (me gusta + comentarios + compartidos + guardados) / vistas, en % */
  interactionRate: number;
  /** Acciones de conversación (comentarios + compartidos + guardados) por cada 1.000 vistas */
  conversationPer1000: number;
  commentsPerPost: number;
  /** Peso de la conversación dentro de todas las interacciones, en % */
  conversationShare: number;
  commentsReported: boolean;
};

const n = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);

/** Vistas comparables por red: Instagram y Facebook usan vistas; si faltan, impresiones. */
export const postViews = (p: CommunityPost) => n(p.metrics.views) || n(p.metrics.impressions);

export function summarizeCommunity(posts: CommunityPost[]): PlatformCommunity[] {
  const by = new Map<string, CommunityPost[]>();
  for (const p of posts) by.set(p.platform, [...(by.get(p.platform) ?? []), p]);
  return [...by.entries()]
    .map(([platform, list]) => {
      const sum = (k: string) => list.reduce((a, p) => a + n(p.metrics[k]), 0);
      const views = list.reduce((a, p) => a + postViews(p), 0);
      const likes = sum("likes");
      const comments = sum("comments");
      const shares = sum("shares");
      const saves = sum("saved");
      const conversation = comments + shares + saves;
      const total = likes + conversation;
      return {
        platform,
        posts: list.length,
        views,
        likes,
        comments,
        shares,
        saves,
        interactionRate: views ? (total / views) * 100 : 0,
        conversationPer1000: views ? (conversation / views) * 1000 : 0,
        commentsPerPost: list.length ? comments / list.length : 0,
        conversationShare: total ? (conversation / total) * 100 : 0,
        // Facebook (Reels) no entrega comentarios por la API de Metricool.
        commentsReported: platform !== "facebook",
      };
    })
    .sort((a, b) => b.interactionRate - a.interactionRate);
}

export function topCommented(posts: CommunityPost[], limit = 10) {
  return [...posts].sort((a, b) => n(b.metrics.comments) - n(a.metrics.comments)).slice(0, limit);
}

export function monthlyCommunity(posts: CommunityPost[]) {
  const by = new Map<string, { views: number; comments: number; conversation: number; posts: number }>();
  for (const p of posts) {
    if (!p.publishedAt) continue;
    const k = p.publishedAt.slice(0, 7);
    const m = by.get(k) ?? { views: 0, comments: 0, conversation: 0, posts: 0 };
    m.views += postViews(p);
    m.comments += n(p.metrics.comments);
    m.conversation += n(p.metrics.comments) + n(p.metrics.shares) + n(p.metrics.saved);
    m.posts += 1;
    by.set(k, m);
  }
  return [...by.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, m]) => ({ month, ...m, conversationPer1000: m.views ? (m.conversation / m.views) * 1000 : 0 }));
}

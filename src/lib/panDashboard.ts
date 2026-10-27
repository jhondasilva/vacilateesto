/** Stored-data-only PAN classification and explicitly confirmed measurement selection. */
export type PanScope = "all" | "pelotica" | "cumbre";
export type PanPost = {
  platform: string;
  id: string;
  url: string | null;
  text: string;
  hashtags: string[];
  publishedAt: string | null;
  thumbnail: string | null;
  source: "metricool" | "stored";
  updatedAt: string | null;
  metrics: { views: number | null; impressions: number | null; likes: number | null; comments: number | null; shares: number | null };
};
export type ClassifiedPanPost = PanPost & { initiative: "pelotica" | "cumbre"; key: string; reviewReason?: string };
const handle = /(?:^|[\s([{¡¿,;:"“”])@panvenezuela(?![\p{L}\p{N}\p{M}_.@])/iu;
const pelotica = /(?:^|[^\p{L}\p{N}\p{M}_#@/])#peloticadegoma(?![\p{L}\p{N}\p{M}_])/iu;
const peloticaMention = /(?:^|[\s([{¡¿,;:"“”])@peloticadegomave(?![\p{L}\p{N}\p{M}_.@])/iu;
const cumbre = /(?:^|[^\p{L}\p{N}\p{M}_#@/])#podcastenlacumbre(?![\p{L}\p{N}\p{M}_])/iu;
const evidenceText = (post: Pick<PanPost, "text" | "hashtags">) => `${post.text} ${post.hashtags.map(t => /^[#@]/.test(t) ? t : `#${t}`).join(" ")}`;

/** Exact URL-derived, platform-scoped identities; never match a bare ID from another network. */
export const PAN_CUMBRE_REVIEWS = [
  { identity: "facebook:reel:3302943209913397", kind: "tree", day: "2026-05-31", reason: "Día del Árbol: relato de Podcast en la Cumbre y patrocinio @panvenezuela; falta hashtag." },
  { identity: "instagram:permalink:DZBKez1hGZN", kind: "tree", day: "2026-05-31", reason: "Día del Árbol: relato de Podcast en la Cumbre y patrocinio @panvenezuela; falta hashtag." },
  { identity: "youtube:id:PdQBoXKOsjM", kind: "tree", day: "2026-05-31", reason: "Día del Árbol: relato de Podcast en la Cumbre y patrocinio @panvenezuela; falta hashtag." },
  { identity: "tiktok:id:7646137166988397842", kind: "tree", day: "2026-05-31", reason: "Día del Árbol: relato de Podcast en la Cumbre y patrocinio @panvenezuela; falta hashtag." },
  { identity: "tiktok:id:7573780272949251384", kind: "home", day: "2025-11-17", reason: "Roraima y patrocinio explícito @pan.venezuela: nutre nuestro hogar." },
  { identity: "instagram:story:3757076637541087029", kind: "story", day: "2025-11-02", reason: "Lista de patrocinantes y #PodcastEnLaCumbre; typo @@panvenezuela." },
  { identity: "tiktok:id:7566312886297955595", kind: "adventure", day: "2025-10-28", reason: "Roraima y agradecimiento explícito a @pan.venezuela por acompañar la aventura." },
  { identity: "instagram:permalink:DPBxzJ4DmhB", kind: "stolk", day: "2025-09-25", reason: "Manantial Stolk: #PodcastEnLaCumbre y panvenezuela sin @ en patrocinantes." },
] as const;

export function panReviewReason(post: PanPost): string | undefined {
  // URL required as well as canonical identity and reviewed semantic context.
  const identities = panIdentity({ ...post, id: "" });
  const text = evidenceText(post);
  const review = PAN_CUMBRE_REVIEWS.find(r => identities.includes(r.identity));
  if (!review) return undefined;
  const context = review.kind === "tree"
    ? handle.test(text) && /En Podcast en la Cumbre hemos aprendido/iu.test(text) && /Naiguat[áa]|Roraima/iu.test(text)
    : cumbre.test(text) && (review.kind === "home"
      ? /Roraima/iu.test(text) && /@pan\.venezuela nutre nuestro hogar/iu.test(text)
      : review.kind === "story" ? /@@panvenezuela(?![\p{L}\p{N}\p{M}_.])/iu.test(text) && /Falta poco/iu.test(text)
      : review.kind === "adventure" ? /Gracias a @pan\.venezuela por acompañarnos en esta nueva aventura/iu.test(text)
      : /Desde que subimos e hicimos/iu.test(text) && /(?:^|\n)\s*panvenezuela\s*(?:\n|$)/iu.test(post.text));
  return context ? `Revisión 2026-10-27 · ${review.reason}` : undefined;
}

export function panInitiative(post: Pick<PanPost, "text" | "hashtags"> & Partial<PanPost>): "pelotica" | "cumbre" | null {
  if (post.platform && post.url && panReviewReason(post as PanPost)) return "cumbre";
  const evidence = evidenceText(post);
  if (!handle.test(evidence)) return null;
  // Mixed posts belong only to Cumbres, never Solo en Pelotica.
  if (cumbre.test(evidence)) return "cumbre";
  return pelotica.test(evidence) || peloticaMention.test(evidence) ? "pelotica" : null;
}

export const availableMetric = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;

export function panIdentity(post: Pick<PanPost, "platform" | "id" | "url">): string[] {
  const keys: string[] = [];
  if (post.id) {
    keys.push(`${post.platform}:id:${post.id}`);
    if (post.platform === "instagram" && /^\d+(?:_\d+)?$/.test(post.id)) {
      keys.push(`instagram:id:${post.id.split("_")[0]}`);
    }
  }
  if (post.url) {
    try {
      const url = new URL(post.url);
      const host = url.hostname.toLowerCase().replace(/^www\./, "");
      const path = url.pathname.replace(/\/+$/, "");
      if (post.platform === "instagram" && /^(?:instagram\.com|m\.instagram\.com)$/.test(host)) {
        const code = path.match(/^\/(?:p|reel|reels)\/([\w-]+)$/)?.[1];
        if (code) keys.push(`instagram:permalink:${code}`); // Preserve shortcode case.
        const story = path.match(/^\/stories\/[\w.]+\/(\d+)$/)?.[1];
        if (story) keys.push(`instagram:story:${story}`);
      } else if (post.platform === "tiktok" && /^(?:www\.|m\.)?tiktok\.com$/.test(host)) {
        const id = path.match(/^\/@[\w.]+\/video\/(\d+)$/)?.[1];
        if (id) keys.push(`tiktok:id:${id}`);
      } else if (post.platform === "youtube" && ["youtube.com", "m.youtube.com", "youtu.be"].includes(host)) {
        const id = host === "youtu.be" ? path.slice(1) : url.searchParams.get("v") ?? path.match(/^\/(?:shorts|live)\/([\w-]+)$/)?.[1];
        if (id && /^[\w-]{11}$/.test(id)) keys.push(`youtube:id:${id}`);
      } else if (post.platform === "facebook" && ["facebook.com", "m.facebook.com", "fb.watch"].includes(host)) {
        const reel = path.match(/^\/reel\/(\d+)$/)?.[1];
        if (reel) keys.push(`facebook:reel:${reel}`);
        keys.push(`facebook:permalink:${host === "m.facebook.com" ? "facebook.com" : host}${path}${url.searchParams.has("story_fbid") ? `?story_fbid=${url.searchParams.get("story_fbid")}` : ""}`);
      }
    } catch { /* An invalid link must not merge unrelated posts. */ }
  }
  return [...new Set(keys)];
}

export function deduplicatePanPosts(posts: PanPost[]): PanPost[] {
  const groups: { post: PanPost; aliases: Set<string> }[] = [];
  for (const post of posts) {
    const aliases = new Set(panIdentity(post));
    const matches = groups.filter(g => [...aliases].some(k => g.aliases.has(k)));
    if (!matches.length) { groups.push({ post, aliases }); continue; }
    const records = [...matches.map(g => g.post), post].sort((a, b) =>
      (a.source === "metricool" ? 0 : 1) - (b.source === "metricool" ? 0 : 1) ||
      (Date.parse(b.updatedAt ?? "") || 0) - (Date.parse(a.updatedAt ?? "") || 0));
    const preferred = records[0];
    const metrics = { ...preferred.metrics };
    for (const name of Object.keys(metrics) as (keyof PanPost["metrics"])[]) {
      metrics[name] = records.map(p => availableMetric(p.metrics[name])).find(v => v !== null) ?? null;
    }
    const merged: PanPost = {
      ...preferred, metrics,
      text: [...new Set(records.map(p => p.text))].join("\n"),
      hashtags: [...new Set(records.flatMap(p => p.hashtags))],
      url: preferred.url ?? records.find(p => p.url)?.url ?? null,
    };
    for (const g of matches) {
      for (const key of g.aliases) aliases.add(key);
      groups.splice(groups.indexOf(g), 1);
    }
    groups.push({ post: merged, aliases });
  }
  return groups.map(g => g.post);
}

export const PAN_SPLIT4 = { from: "2026-08-01", to: "2026-10-15", label: "4.º split · 1 ago–15 oct 2026" } as const;
export type PanRanges = Record<PanScope, { from: string; to: string }>;
export const initialPanRanges = (): PanRanges => ({ all: { from: "", to: "" }, pelotica: { from: "", to: "" }, cumbre: { from: "", to: "" } });
export const updatePanRange = (ranges: PanRanges, scope: PanScope, range: { from: string; to: string }): PanRanges => ({ ...ranges, [scope]: range });
export const isPanSplit4 = (from: string, to: string) => from === PAN_SPLIT4.from && to === PAN_SPLIT4.to;

/** Naive timestamps and day-only dates use Caracas, not the browser's timezone. */
export function panTimestamp(value: string | null): number {
  if (!value) return NaN;
  const match = value.match(/^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?)(Z|[+-]\d{2}:?\d{2})?)?$/i);
  if (!match) return NaN;
  const day = new Date(`${match[1]}T00:00:00Z`);
  if (!Number.isFinite(day.getTime()) || day.toISOString().slice(0, 10) !== match[1]) return NaN;
  return Date.parse(`${match[1]}T${match[2] ?? "00:00:00"}${match[3] ?? "-04:00"}`);
}

/** Inclusive Caracas days represented as a half-open UTC interval. */
export function panDateBounds(from: string, to: string): { from: number; to: number } | null {
  const day = (s: string, end: boolean) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return NaN;
    const utc = new Date(`${s}T00:00:00Z`);
    if (!Number.isFinite(utc.getTime()) || utc.toISOString().slice(0, 10) !== s) return NaN;
    return panTimestamp(s) + (end ? 86400000 : 0);
  };
  const start = from ? day(from, false) : -Infinity;
  const end = to ? day(to, true) : Infinity;
  return Number.isNaN(start) || Number.isNaN(end) || start >= end ? null : { from: start, to: end };
}

export function selectPanPosts(posts: PanPost[], scope: PanScope, from = "", to = ""): ClassifiedPanPost[] {
  const range = panDateBounds(from, to);
  if (!range) return [];
  return deduplicatePanPosts(posts).flatMap((post, index) => {
    const initiative = panInitiative(post);
    if (!initiative || (scope !== "all" && scope !== initiative)) return [];
    const timestamp = panTimestamp(post.publishedAt);
    if ((from || to) && (!Number.isFinite(timestamp) || timestamp < range.from || timestamp >= range.to)) return [];
    return [{ ...post, initiative, key: panIdentity(post)[0] ?? `unidentified:${index}`, reviewReason: panReviewReason(post) }];
  });
}

export const filterPanNetworks = <T extends PanPost>(posts: T[], network: string): T[] => posts.filter(p => network === "all" || (network === "ig-tiktok" ? ["instagram", "tiktok"].includes(p.platform) : p.platform === network));

export function sumPanMetric(posts: PanPost[], metric: keyof PanPost["metrics"]) {
  const values = posts.map(p => p.platform === "instagram" && metric === "views" && p.metrics.views === 0
    ? null : availableMetric(p.metrics[metric]));
  const known = values.filter((v): v is number => v !== null);
  return { value: known.length ? known.reduce((a, b) => a + b, 0) : null, available: known.length, missing: values.length - known.length };
}
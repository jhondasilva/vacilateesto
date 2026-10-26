/** Stored-data-only PAN classification. Never derives a split period. */
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
export type ClassifiedPanPost = PanPost & { initiative: "pelotica" | "cumbre"; key: string };
const handle = /(?:^|[^\w@])@panvenezuela(?![\w.])/i;
const pelotica = /(?:^|[^\w#])#(?:peloticadegoma|amoajuga)(?![\w])/i;
const cumbre = /(?:^|[^\w#])#podcastenlacumbre(?![\w])/i;

export function panInitiative(post: Pick<PanPost, "text" | "hashtags">): "pelotica" | "cumbre" | null {
  if (!handle.test(post.text)) return null;
  const evidence = `${post.text} ${post.hashtags.map(t => t.startsWith("#") ? t : `#${t}`).join(" ")}`;
  // Mixed posts belong only to Cumbres, never Solo en Pelotica.
  if (cumbre.test(evidence)) return "cumbre";
  return pelotica.test(evidence) ? "pelotica" : null;
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
      if (/^(?:instagram\.com|m\.instagram\.com)$/.test(host)) {
        const code = path.match(/^\/(?:p|reel|reels)\/([\w-]+)$/)?.[1];
        if (code) keys.push(`instagram:permalink:${code}`); // Preserve shortcode case.
      } else if (host.endsWith("tiktok.com") && /^(?:[\w-]+\.)*tiktok\.com$/.test(host)) {
        const id = path.match(/\/video\/(\d+)$/)?.[1];
        if (id) keys.push(`tiktok:id:${id}`);
      } else if (["youtube.com", "m.youtube.com", "youtu.be"].includes(host)) {
        const id = host === "youtu.be" ? path.slice(1) : url.searchParams.get("v") ?? path.match(/^\/(?:shorts|live)\/([\w-]+)$/)?.[1];
        if (id) keys.push(`youtube:id:${id}`);
      } else if (["facebook.com", "m.facebook.com", "fb.watch"].includes(host)) {
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

/** Manual day bounds in Venezuela, inclusive through the last millisecond. */
export function panDateBounds(from: string, to: string): { from: number; to: number } | null {
  const day = (s: string, end: boolean) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return NaN;
    const utc = new Date(`${s}T00:00:00Z`);
    if (!Number.isFinite(utc.getTime()) || utc.toISOString().slice(0, 10) !== s) return NaN;
    return Date.parse(`${s}T${end ? "23:59:59.999" : "00:00:00.000"}-04:00`);
  };
  const start = from ? day(from, false) : -Infinity;
  const end = to ? day(to, true) : Infinity;
  return Number.isNaN(start) || Number.isNaN(end) || start > end ? null : { from: start, to: end };
}

export function selectPanPosts(posts: PanPost[], scope: PanScope, from = "", to = ""): ClassifiedPanPost[] {
  const range = panDateBounds(from, to);
  if (!range) return [];
  return deduplicatePanPosts(posts).flatMap((post, index) => {
    const initiative = panInitiative(post);
    if (!initiative || (scope !== "all" && scope !== initiative)) return [];
    const timestamp = Date.parse(post.publishedAt ?? "");
    if ((from || to) && (!Number.isFinite(timestamp) || timestamp < range.from || timestamp > range.to)) return [];
    return [{ ...post, initiative, key: panIdentity(post)[0] ?? `unidentified:${index}` }];
  });
}

export function sumPanMetric(posts: PanPost[], metric: keyof PanPost["metrics"]) {
  const values = posts.map(p => p.platform === "instagram" && metric === "views" && p.metrics.views === 0
    ? null : availableMetric(p.metrics[metric]));
  const known = values.filter((v): v is number => v !== null);
  return { value: known.length ? known.reduce((a, b) => a + b, 0) : null, available: known.length, missing: values.length - known.length };
}
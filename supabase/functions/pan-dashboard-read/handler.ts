import {
  availableMetric,
  panTimestamp,
  selectPanPosts,
  type ClassifiedPanPost,
  type PanPost,
} from "../_shared/panDashboard.ts";

export const PAN_SOURCE_CACHES = [
  { slug: "harina-pan", period: "cumulative-all", label: "P.A.N. · caché histórica" },
  { slug: "pelotica-de-goma", period: "cumulative-2026", label: "P.A.N. · caché de Pelotica 2026" },
] as const;

export type RecordData = Record<string, unknown>;
export type PanCoverage = {
  label: string;
  updated: string | null;
  from: string | null;
  to: string | null;
  count: number;
};
export type PanReadResponse = {
  schemaVersion: 1;
  authorization: { userId: string };
  posts: ClassifiedPanPost[];
  coverage: PanCoverage[];
};

/** No provider, writer, arbitrary SQL, or caller-selected brand exists in this interface. */
export type PanReadDependencies = {
  authenticate: (token: string) => Promise<{ id: string; emailConfirmed: boolean } | null>;
  hasPanAccess: (token: string, userId: string) => Promise<boolean>;
  readCache: (slug: typeof PAN_SOURCE_CACHES[number]["slug"], period: typeof PAN_SOURCE_CACHES[number]["period"]) => Promise<RecordData | null>;
  readStoredPage: (offset: number, pageSize: number) => Promise<RecordData[]>;
};

const PAGE_SIZE = 500;
// A safety ceiling causes a complete error, never a partial success.
const MAX_PAGES = 200;
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "private, no-store, max-age=0",
  "Pragma": "no-cache",
  "Vary": "Authorization, Origin",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });
const record = (v: unknown): RecordData | null => v !== null && typeof v === "object" && !Array.isArray(v) ? v as RecordData : null;
const nullableString = (v: unknown) => typeof v === "string" ? v : null;
const stringArray = (v: unknown): string[] => Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
const postId = (v: unknown): string => typeof v === "string" || typeof v === "number" ? String(v) : "";

/** Only the exact server RPC contract authorizes a data read; truthy/string values do not. */
export function canReadPanContext(value: unknown): boolean {
  const context = record(value);
  return context !== null
    && (context.access_mode === "pan_readonly" || context.access_mode === "standard")
    && context.can_read_pan === true;
}

/** Reject even valid-looking selectors: authorization scope is fixed on the server. */
async function hasEmptyBody(req: Request): Promise<boolean> {
  if (!req.body) return true;
  const reader = req.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let text = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 1024) {
        await reader.cancel();
        return false;
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } finally {
    reader.releaseLock();
  }
  if (!text.trim()) return true;
  try {
    const parsed = record(JSON.parse(text));
    return parsed !== null && Object.keys(parsed).length === 0;
  } catch {
    return false;
  }
}

function cachedPosts(row: RecordData): PanPost[] {
  const payload = record(row.payload);
  // A missing/malformed source is not the same thing as a legitimately empty source.
  if (!payload || !Array.isArray(payload.posts)) throw new Error("Invalid cache source");
  return payload.posts.map((raw): PanPost => {
    const p = record(raw);
    if (!p || typeof p.platform !== "string") throw new Error("Invalid cache post");
    const metrics = record(p.metrics) ?? {};
    return {
      platform: p.platform,
      id: postId(p.id),
      url: nullableString(p.url),
      text: nullableString(p.text) ?? "",
      hashtags: stringArray(p.hashtags),
      publishedAt: nullableString(p.publishedAt),
      thumbnail: nullableString(p.thumbnail),
      source: "metricool",
      updatedAt: nullableString(row.refreshed_at),
      metrics: {
        views: availableMetric(metrics.views),
        impressions: availableMetric(metrics.impressions),
        likes: availableMetric(metrics.likes ?? metrics.reactions),
        comments: availableMetric(metrics.comments),
        shares: availableMetric(metrics.shares),
      },
    };
  });
}

function storedPosts(rows: RecordData[]): PanPost[] {
  return rows.map((p): PanPost => {
    if (typeof p.platform !== "string") throw new Error("Invalid stored post");
    return {
      platform: p.platform,
      id: postId(p.external_id),
      url: nullableString(p.url),
      text: nullableString(p.text) ?? "",
      hashtags: stringArray(p.hashtags),
      publishedAt: nullableString(p.published_at),
      thumbnail: nullableString(p.thumbnail),
      source: "stored",
      updatedAt: nullableString(p.synced_at),
      metrics: {
        views: availableMetric(p.views),
        impressions: null,
        likes: availableMetric(p.likes),
        comments: availableMetric(p.comments),
        shares: availableMetric(p.shares),
      },
    };
  });
}

/** Coverage describes only P.A.N. posts, not the source's global counts or date bounds. */
function scopedCoverage(label: string, source: PanPost[]): PanCoverage {
  const posts = selectPanPosts(source, "all");
  const dates = posts.map(p => panTimestamp(p.publishedAt)).filter(Number.isFinite).sort((a, b) => a - b);
  const updates = posts.map(p => panTimestamp(p.updatedAt)).filter(Number.isFinite).sort((a, b) => a - b);
  return {
    label,
    count: posts.length,
    from: dates.length ? new Date(dates[0]).toISOString() : null,
    to: dates.length ? new Date(dates[dates.length - 1]).toISOString() : null,
    updated: updates.length ? new Date(updates[0]).toISOString() : null,
  };
}

/** Explicit allowlist; never spread a database row or payload into the response. */
function publicPost(p: ClassifiedPanPost): ClassifiedPanPost {
  return {
    platform: p.platform,
    id: p.id,
    url: p.url,
    text: p.text,
    hashtags: p.hashtags,
    publishedAt: p.publishedAt,
    thumbnail: p.thumbnail,
    source: p.source,
    updatedAt: p.updatedAt,
    metrics: {
      views: p.metrics.views,
      impressions: p.metrics.impressions,
      likes: p.metrics.likes,
      comments: p.metrics.comments,
      shares: p.metrics.shares,
    },
    initiative: p.initiative,
    key: p.key,
    ...(p.reviewReason ? { reviewReason: p.reviewReason } : {}),
  };
}

export function createPanReadHandler(deps: PanReadDependencies) {
  return async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (req.method !== "GET" && req.method !== "POST") return json({ error: "Method not allowed" }, 405);

    const authorization = req.headers.get("Authorization") ?? "";
    const match = /^Bearer ([^\s]+)$/i.exec(authorization);
    if (!match) return json({ error: "Unauthorized" }, 401);

    try {
      // Every database data-read dependency is unreachable until both checks pass.
      const user = await deps.authenticate(match[1]);
      if (!user?.id || !user.emailConfirmed) return json({ error: "Unauthorized" }, 401);
      if (!(await deps.hasPanAccess(match[1], user.id))) return json({ error: "Forbidden" }, 403);
      if (new URL(req.url).search || !(await hasEmptyBody(req))) return json({ error: "This endpoint has no client-selectable scope" }, 400);

      const collected: PanPost[] = [];
      const coverage: PanCoverage[] = [];
      for (const source of PAN_SOURCE_CACHES) {
        const row = await deps.readCache(source.slug, source.period);
        if (!row) throw new Error("Missing cache source");
        const posts = cachedPosts(row);
        collected.push(...posts);
        coverage.push(scopedCoverage(source.label, posts));
      }

      const stored: RecordData[] = [];
      let completed = false;
      for (let pageNumber = 0; pageNumber < MAX_PAGES; pageNumber++) {
        const page = await deps.readStoredPage(pageNumber * PAGE_SIZE, PAGE_SIZE);
        if (!Array.isArray(page) || page.length > PAGE_SIZE) throw new Error("Invalid stored page");
        stored.push(...page);
        if (page.length < PAGE_SIZE) { completed = true; break; }
      }
      if (!completed) throw new Error("Stored source exceeds bounded read");
      const posts = storedPosts(stored);
      collected.push(...posts);
      coverage.push(scopedCoverage("P.A.N. · capturas almacenadas", posts));

      const response: PanReadResponse = {
        schemaVersion: 1,
        authorization: { userId: user.id },
        posts: selectPanPosts(collected, "all").map(publicPost),
        coverage,
      };
      return json(response);
    } catch {
      // Do not return DB errors, JWTs, service credentials, or partial results.
      return json({ error: "No se pudieron leer todas las fuentes autorizadas de P.A.N." }, 503);
    }
  };
}

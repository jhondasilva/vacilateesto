import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  createPanReadHandler,
  canReadPanContext,
  type PanReadDependencies,
  type PanReadResponse,
  type RecordData,
} from "../supabase/functions/pan-dashboard-read/handler.ts";
import { selectPanPosts, type PanPost } from "../supabase/functions/_shared/panDashboard.ts";

const USER = "33333333-3333-4333-8333-333333333333";
const PAN_TEXT = "Gracias @panvenezuela #PeloticaDeGoma";
const CUMBRE_TEXT = "Gracias @panvenezuela #PodcastEnLaCumbre";
const OTHER_TEXT = "EXCLUDED_OTHER_BRAND #PeloticaDeGoma";
const timestamp = "2026-10-20T00:00:00Z";
const cached = (id: string, text: string, extra: RecordData = {}): RecordData => ({
  platform: "instagram", id, url: `https://www.instagram.com/p/${id}/`, text,
  publishedAt: "2026-09-01T12:00:00-04:00", hashtags: [],
  metrics: { likes: 10, views: 0, impressions: null, comments: 2, shares: 1 },
  ...extra,
});
const row = (posts: RecordData[]): RecordData => ({
  payload: { posts, secret: "LEAK_PAYLOAD", globalCount: 8931 },
  refreshed_at: timestamp, period_from: "2020-01-01", period_to: "2099-01-01",
});
const stored = (id: string, text: string, extra: RecordData = {}): RecordData => ({
  platform: "instagram", external_id: id, url: `https://www.instagram.com/p/${id}/`, text,
  hashtags: [], published_at: "2026-09-01T12:00:00-04:00", thumbnail: null,
  views: 50, likes: 8, comments: null, shares: 1, synced_at: timestamp,
  ...extra,
});
const request = (body: unknown = {}, query = "") => new Request(`https://local.invalid/pan-dashboard-read${query}`, {
  method: "POST", headers: { Authorization: "Bearer valid-token", "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

function fixture(overrides: Partial<PanReadDependencies> = {}) {
  const calls = { authenticate: 0, authorize: 0, readCache: 0, readStoredPage: 0, selectors: [] as string[], pages: [] as number[] };
  const deps: PanReadDependencies = {
    async authenticate(token) { calls.authenticate++; assert.equal(token, "valid-token"); return { id: USER, emailConfirmed: true }; },
    async hasPanAccess(token, id) { calls.authorize++; assert.equal(token, "valid-token"); assert.equal(id, USER); return true; },
    async readCache(slug, period) {
      calls.readCache++;
      calls.selectors.push(`${slug}/${period}`);
      return slug === "harina-pan" ? row([cached("CUMBRE", CUMBRE_TEXT)]) : row([cached("PAN", PAN_TEXT), cached("OTHER", OTHER_TEXT)]);
    },
    async readStoredPage(offset, pageSize) {
      calls.readStoredPage++; calls.pages.push(offset); assert.equal(pageSize, 500);
      return [stored("PAN", PAN_TEXT), stored("OTHER_CAPTURE", OTHER_TEXT)];
    },
    ...overrides,
  };
  return { handler: createPanReadHandler(deps), calls };
}

test("missing, malformed and anonymous headers cannot reach authorization or data", async () => {
  for (const authorization of ["", "Basic abc", "Bearer ", "Bearer token injected", "Bearer a\tb"]) {
    const { handler, calls } = fixture();
    const response = await handler(new Request("https://local.invalid/pan-dashboard-read", { headers: { Authorization: authorization } }));
    assert.equal(response.status, 401);
    assert.deepEqual([calls.authenticate, calls.authorize, calls.readCache, calls.readStoredPage], [0, 0, 0, 0]);
  }
});

test("invalid token or unconfirmed identity never reaches authorization or data", async () => {
  for (const user of [null, { id: USER, emailConfirmed: false }, { id: "", emailConfirmed: true }]) {
    const { handler, calls } = fixture({ authenticate: async () => user });
    const response = await handler(request());
    assert.equal(response.status, 401);
    assert.deepEqual([calls.authorize, calls.readCache, calls.readStoredPage], [0, 0, 0]);
  }
});

test("valid identity without PAN permission is denied before privileged SELECTs", async () => {
  const { handler, calls } = fixture({ hasPanAccess: async () => false });
  const response = await handler(request());
  assert.equal(response.status, 403);
  assert.deepEqual([calls.readCache, calls.readStoredPage], [0, 0]);
});

test("malformed, missing, contradictory and stringly-typed authorization contexts deny", () => {
  for (const context of [null, undefined, true, "true", [], {}, { can_read_pan: true },
    { access_mode: "none", can_read_pan: true }, { access_mode: "admin", can_read_pan: true },
    { access_mode: "pan_readonly", can_read_pan: "true" }, { access_mode: "standard", can_read_pan: 1 },
    { access_mode: "pan_readonly", can_read_pan: false }]) assert.equal(canReadPanContext(context), false);
  assert.equal(canReadPanContext({ access_mode: "pan_readonly", can_read_pan: true }), true);
  assert.equal(canReadPanContext({ access_mode: "standard", can_read_pan: true }), true);
});

test("authorization exception fails closed with no SQL data reads and no internal error", async () => {
  const { handler, calls } = fixture({ hasPanAccess: async () => { throw new Error("LEAK_AUTH_TOKEN_OR_DB_DETAILS"); } });
  const response = await handler(request());
  assert.equal(response.status, 503);
  assert.doesNotMatch(await response.text(), /LEAK_AUTH/);
  assert.deepEqual([calls.readCache, calls.readStoredPage], [0, 0]);
});

test("client-controlled brand, scope, identity, SQL and query parameters are rejected", async () => {
  for (const body of [{ brand_id: "other" }, { blogIds: [123] }, { scope: "all" }, { userId: "admin" }, { sql: "select *" }, { from: "2026-01-01" }, [], null, "all"]) {
    const { handler, calls } = fixture();
    const response = await handler(request(body));
    assert.equal(response.status, 400);
    assert.deepEqual([calls.readCache, calls.readStoredPage], [0, 0]);
  }
  const { handler, calls } = fixture();
  assert.equal((await handler(request({}, "?scope=all"))).status, 400);
  assert.deepEqual([calls.readCache, calls.readStoredPage], [0, 0]);
});

test("oversized and malformed bodies fail before data reads", async () => {
  for (const body of ["{", " ".repeat(1025), '{"padding":"' + "x".repeat(1025) + '"}']) {
    const { handler, calls } = fixture();
    const response = await handler(new Request("https://local.invalid/pan-dashboard-read", {
      method: "POST", headers: { Authorization: "Bearer valid-token" }, body,
    }));
    assert.equal(response.status, 400);
    assert.deepEqual([calls.readCache, calls.readStoredPage], [0, 0]);
  }
});

test("authorized output contains only PAN; client can select both initiatives locally", async () => {
  const { handler, calls } = fixture();
  const response = await handler(request());
  assert.equal(response.status, 200);
  const payload = await response.json() as PanReadResponse;
  assert.equal(payload.schemaVersion, 1);
  assert.deepEqual(payload.authorization, { userId: USER });
  assert.deepEqual(payload.posts.map(p => p.id), ["CUMBRE", "PAN"]);
  assert.deepEqual(payload.posts.map(p => p.initiative), ["cumbre", "pelotica"]);
  assert.equal(selectPanPosts(payload.posts, "all").length, 2);
  assert.equal(selectPanPosts(payload.posts, "cumbre").length, 1);
  assert.equal(selectPanPosts(payload.posts, "pelotica").length, 1);
  assert.deepEqual(calls.selectors, ["harina-pan/cumulative-all", "pelotica-de-goma/cumulative-2026"]);
  assert.doesNotMatch(JSON.stringify(payload), /OTHER|LEAK_PAYLOAD|8931|2020-01-01|2099-01-01/);
  assert.deepEqual(payload.coverage.map(c => c.count), [1, 1, 1]);
});

test("response and coverage omit raw payload properties, author details and arbitrary metrics", async () => {
  const { handler } = fixture({
    readCache: async () => row([cached("PAN", PAN_TEXT, {
      raw_data: "LEAK_RAW", author_email: "LEAK_EMAIL", access_token: "LEAK_TOKEN",
      metrics: { likes: 10, secret: "LEAK_METRIC", views: null },
    })]),
    readStoredPage: async () => [stored("PAN", PAN_TEXT, { user_id: "LEAK_UUID", receipt_url: "LEAK_RECEIPT" })],
  });
  const response = await handler(request());
  const payload = await response.json() as PanReadResponse;
  assert.doesNotMatch(JSON.stringify(payload), /LEAK_|raw_data|author_email|access_token|receipt_url/);
  assert.deepEqual(Object.keys(payload.posts[0].metrics).sort(), ["comments", "impressions", "likes", "shares", "views"]);
});

test("single canonical classifier merges records exactly like reviewed logic", async () => {
  const cache = cached("123_456", PAN_TEXT, { url: "https://www.instagram.com/reel/Canonical/", metrics: { likes: 10, views: null } });
  const capture = stored("123", PAN_TEXT, { url: "https://www.instagram.com/p/Canonical/", views: 99, likes: 7 });
  const { handler } = fixture({ readCache: async slug => row(slug === "harina-pan" ? [cache] : []), readStoredPage: async () => [capture] });
  const response = await handler(request());
  const payload = await response.json() as PanReadResponse;
  const original: PanPost[] = [
    { platform: "instagram", id: "123_456", url: cache.url as string, text: PAN_TEXT, hashtags: [], publishedAt: cache.publishedAt as string, thumbnail: null,
      source: "metricool", updatedAt: timestamp, metrics: { likes: 10, views: null, impressions: null, comments: null, shares: null } },
    { platform: "instagram", id: "123", url: capture.url as string, text: PAN_TEXT, hashtags: [], publishedAt: capture.published_at as string, thumbnail: null,
      source: "stored", updatedAt: timestamp, metrics: { likes: 7, views: 99, impressions: null, comments: null, shares: 1 } },
  ];
  assert.deepEqual(payload.posts, JSON.parse(JSON.stringify(selectPanPosts(original, "all"))));
  assert.equal(payload.posts[0].metrics.likes, 10);
  assert.equal(payload.posts[0].metrics.views, 99);
});

test("reviewed Cumbre exception is preserved, but the same ID on a different platform is excluded", async () => {
  const reviewed = cached("7646137166988397842", "En Podcast en la Cumbre hemos aprendido en Roraima. Gracias @panvenezuela", {
    platform: "tiktok", url: "https://www.tiktok.com/@vacilateesto/video/7646137166988397842",
  });
  const fake = { ...reviewed, platform: "instagram", url: "https://www.instagram.com/p/Other/" };
  const { handler } = fixture({ readCache: async slug => row(slug === "harina-pan" ? [reviewed, fake] : []), readStoredPage: async () => [] });
  const response = await handler(request());
  const payload = await response.json() as PanReadResponse;
  assert.equal(payload.posts.length, 1);
  assert.equal(payload.posts[0].initiative, "cumbre");
  assert.match(payload.posts[0].reviewReason ?? "", /Revisión 2026-10-27/);
});

test("missing/malformed source and database errors produce no partial output", async () => {
  for (const broken of [null, {}, { payload: {} }, { payload: { posts: [null] } }]) {
    const { handler } = fixture({ readCache: async slug => slug === "harina-pan" ? row([cached("CUMBRE", CUMBRE_TEXT)]) : broken });
    const response = await handler(request());
    assert.equal(response.status, 503);
    const result = await response.json();
    assert.equal("posts" in result, false);
    assert.equal("coverage" in result, false);
  }
  const { handler } = fixture({ readStoredPage: async () => { throw new Error("LEAK_SQL_SCHEMA"); } });
  const response = await handler(request());
  assert.equal(response.status, 503);
  assert.doesNotMatch(await response.text(), /LEAK_SQL_SCHEMA|CUMBRE/);
});

test("empty but present caches return zero PAN with no excluded source metadata", async () => {
  const { handler } = fixture({ readCache: async () => row([cached("OTHER", OTHER_TEXT)]), readStoredPage: async () => [] });
  const response = await handler(request());
  assert.equal(response.status, 200);
  const payload = await response.json() as PanReadResponse;
  assert.deepEqual(payload.posts, []);
  for (const coverage of payload.coverage) assert.deepEqual({ count: coverage.count, from: coverage.from, to: coverage.to, updated: coverage.updated }, { count: 0, from: null, to: null, updated: null });
});

test("stored reads paginate; exhausted ceiling fails without partial results", async () => {
  const pages: number[] = [];
  const { handler } = fixture({ readStoredPage: async (offset) => {
    pages.push(offset);
    return offset === 0 ? Array.from({ length: 500 }, (_, i) => stored(`OTHER${i}`, OTHER_TEXT)) : [stored("LAST_PAN", PAN_TEXT)];
  } });
  const response = await handler(request());
  assert.equal(response.status, 200);
  assert.deepEqual(pages, [0, 500]);
  assert((await response.json() as PanReadResponse).posts.some(p => p.id === "LAST_PAN"));
  const exhausted = fixture({ readStoredPage: async () => Array.from({ length: 500 }, () => stored("OTHER", OTHER_TEXT)) });
  const failed = await exhausted.handler(request());
  assert.equal(failed.status, 503);
  assert.equal("posts" in await failed.json(), false);
});

test("HTTP methods are bounded, preflight reads nothing, and all responses forbid caching", async () => {
  for (const method of ["OPTIONS", "DELETE", "PUT", "PATCH"]) {
    const { handler, calls } = fixture();
    const response = await handler(new Request("https://local.invalid/pan-dashboard-read", { method }));
    assert.equal(response.status, method === "OPTIONS" ? 204 : 405);
    assert.match(response.headers.get("Cache-Control") ?? "", /no-store/);
    assert.equal(calls.authenticate + calls.readCache + calls.readStoredPage, 0);
  }
  const { handler } = fixture();
  const response = await handler(new Request("https://local.invalid/pan-dashboard-read", { headers: { Authorization: "Bearer valid-token" } }));
  assert.equal(response.status, 200);
  assert.match(response.headers.get("Cache-Control") ?? "", /no-store/);
  assert.match(response.headers.get("Vary") ?? "", /Authorization/);
});

test("deployed adapter uses verified caller JWT for no-argument authorization and fixed SELECTs only", () => {
  const source = readFileSync(new URL("../supabase/functions/pan-dashboard-read/index.ts", import.meta.url), "utf8");
  assert.match(source, /\.auth\.getUser\(token\)/);
  assert.match(source, /Authorization: `Bearer \$\{token\}`/);
  assert.match(source, /\.rpc\("get_pan_access_context"\)/);
  assert.match(source, /return !error && canReadPanContext\(data\)/);
  assert.match(source, /\.eq\("scope", "brand"\)/);
  assert.match(source, /\.eq\("campaign_slug", "pelotica-de-goma"\)/);
  assert.doesNotMatch(source, /\.(?:insert|upsert|update|delete)\s*\(|functions\.invoke|fetch\s*\(/);
  assert.doesNotMatch(source, /req\.json|req\.url|req\.body/);
});

test("shared classifier is byte-identical to reviewed HEAD classifier", () => {
  const shared = readFileSync(new URL("../supabase/functions/_shared/panDashboard.ts", import.meta.url), "utf8");
  assert.equal(createHash("sha256").update(shared).digest("hex"), "488244ad326efca9089cca5d4db153ce37aff1d8f71c6cf407b9b46bb2b593c0");
});

// Optional offline regression against a caller-supplied, already captured audit fixture.
// The fixture is never committed or uploaded; output contains counts only.
import assert from "node:assert/strict";
import fs from "node:fs";
import { createPanReadHandler } from "../supabase/functions/pan-dashboard-read/handler.ts";
import { availableMetric, selectPanPosts, sumPanMetric } from "../supabase/functions/_shared/panDashboard.ts";

if (!process.argv[2]) throw new Error("Pass an existing local audit fixture path; no network capture is performed.");
const rows = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
if (!Array.isArray(rows)) throw new Error("Unexpected audit fixture");
const sources = Object.groupBy(rows, row => row.source_label);
const normalized = rows.map(row => {
  const p = row.raw_post;
  return {
    platform: p.platform, id: String(p.id ?? ""), url: p.url ?? null, text: p.text ?? "",
    hashtags: row.source_order === 2 ? p.hashtags ?? [] : [], publishedAt: p.publishedAt ?? null,
    thumbnail: p.thumbnail ?? null, source: row.source_order === 2 ? "stored" : "metricool",
    updatedAt: row.updated_at,
    metrics: { views: availableMetric(p.metrics?.views), impressions: availableMetric(p.metrics?.impressions),
      likes: availableMetric(p.metrics?.likes ?? p.metrics?.reactions), comments: availableMetric(p.metrics?.comments), shares: availableMetric(p.metrics?.shares) },
  };
});
const cacheRow = (slug, period) => {
  const source = sources[`${slug}/${period}`];
  assert(source?.length, "Required source missing from local fixture");
  assert.equal(new Set(source.map(row => row.updated_at)).size, 1, "Cache source must have a single row timestamp");
  return { payload: { posts: source.map(row => row.raw_post) }, refreshed_at: source[0].updated_at };
};
const captures = (sources.influencer_posts ?? []).map(row => {
  const p = row.raw_post;
  return { platform: p.platform, external_id: p.id, url: p.url ?? null, text: p.text ?? "", hashtags: p.hashtags ?? [],
    published_at: p.publishedAt ?? null, thumbnail: p.thumbnail ?? null, synced_at: row.updated_at,
    views: p.metrics?.views, likes: p.metrics?.likes, comments: p.metrics?.comments, shares: p.metrics?.shares };
});
const handler = createPanReadHandler({
  authenticate: async () => ({ id: "offline-fixture-user", emailConfirmed: true }),
  hasPanAccess: async () => true,
  readCache: async (slug, period) => cacheRow(slug, period),
  readStoredPage: async (offset, pageSize) => captures.slice(offset, offset + pageSize),
});
const response = await handler(new Request("https://offline.invalid/pan-dashboard-read", { headers: { Authorization: "Bearer offline-token" } }));
assert.equal(response.status, 200);
const payload = await response.json();
const expected = JSON.parse(JSON.stringify(selectPanPosts(normalized, "all")));
assert.deepEqual(payload.posts, expected, "Endpoint must return exactly the reviewed P.A.N. partition and allowed fields");
for (const scope of ["all", "pelotica", "cumbre"]) {
  for (const metric of ["views", "likes", "comments", "shares"]) {
    assert.deepEqual(sumPanMetric(selectPanPosts(payload.posts, scope), metric), sumPanMetric(selectPanPosts(normalized, scope), metric));
  }
}
assert.equal(payload.posts.length, 591);
assert.equal(selectPanPosts(payload.posts, "cumbre").length, 155);
assert.equal(selectPanPosts(payload.posts, "pelotica").length, 436);
console.log(JSON.stringify({ sourceRows: rows.length, authorizedPanPosts: payload.posts.length,
  cumbre: 155, pelotica: 436, exactCanonicalOutputMatch: true, sourceCoverageCounts: payload.coverage.map(row => row.count) }, null, 2));

import { test } from "node:test";
import { strictEqual, deepStrictEqual } from "node:assert";
import { deduplicatePanPosts, panInitiative, panIdentity, panDateBounds, selectPanPosts, sumPanMetric, type PanPost } from "../src/lib/panDashboard";

// Synthetic fixtures. Dates exercise boundaries only, NOT an approved split period.
const post = (id: string, text = "@panvenezuela #PeloticaDeGoma", extra: Partial<PanPost> = {}): PanPost => ({
  platform: "instagram", id, text, url: null, hashtags: [], publishedAt: "2026-09-10T12:00:00-04:00",
  thumbnail: null, source: "stored", updatedAt: "2026-10-01T00:00:00Z",
  metrics: { views: 100, impressions: null, likes: 10, comments: 2, shares: 1 }, ...extra,
});

test("PAN requires exact @panvenezuela, never #PAN or another sponsor alone", () => {
  strictEqual(panInitiative(post("a", "@panvenezuela #PeloticaDeGoma")), "pelotica");
  strictEqual(panInitiative(post("a", "#PAN #PeloticaDeGoma")), null);
  strictEqual(panInitiative(post("a", "@vatelvenezuela #PeloticaDeGoma")), null);
  strictEqual(panInitiative(post("a", "@panvenezuela_extra #PeloticaDeGoma")), null);
  strictEqual(panInitiative(post("a", "@panvenezuela.other #PeloticaDeGoma")), null);
});
test("exact #PeloticaDeGoma alternative matches caption or stored hashtags case insensitively", () => {
  strictEqual(panInitiative(post("a", "@PANVENEZUELA #PELOTICADEGOMA")), "pelotica");
  strictEqual(panInitiative(post("a", "@panvenezuela", { hashtags: ["PeloticaDeGoma"] })), "pelotica");
});
test("exact @peloticadegomave alternative matches caption or stored token list", () => {
  strictEqual(panInitiative(post("a", "@panvenezuela @PELOTICADEGOMAVE")), "pelotica");
  strictEqual(panInitiative(post("a", "@panvenezuela", { hashtags: ["@peloticadegomave"] })), "pelotica");
});
test("author_handle alone is not evidence", () => {
  const authorOnly = { ...post("a", "@panvenezuela"), author_handle: "@peloticadegomave" };
  strictEqual(panInitiative(authorOnly), null);
});
test("#AmoAJuga alone no longer qualifies, including stored hashtag list", () => {
  strictEqual(panInitiative(post("a", "@PANVENEZUELA #AMOAJUGA")), null);
  strictEqual(panInitiative(post("a", "@panvenezuela", { hashtags: ["AmoAJuga"] })), null);
});
test("partial hashtag and mention identifiers never qualify", () => {
  for (const token of ["#PeloticaDeGomaOtra", "#PeloticaDeGoma_extra", "#PeloticaDeGomañ", "@peloticadegomave_extra", "@peloticadegomave.otro", "@peloticadegomave2", "@peloticadegomaveñ", "x@peloticadegomave", "##PeloticaDeGoma"]) {
    strictEqual(panInitiative(post("a", `@panvenezuela ${token}`)), null, token);
  }
});
test("Cumbre PAN without Pelotica evidence never enters Solo Pelotica", () => {
  strictEqual(selectPanPosts([post("a", "@panvenezuela #PodcastEnLaCumbre")], "pelotica").length, 0);
});
test("Cumbre requires hashtag; mixed content is excluded from Solo Pelotica", () => {
  strictEqual(panInitiative(post("a", "@panvenezuela #PodcastEnLaCumbre")), "cumbre");
  strictEqual(panInitiative(post("a", "@panvenezuela Podcast en la Cumbre")), null);
  strictEqual(selectPanPosts([post("a", "@panvenezuela #PodcastEnLaCumbre #PeloticaDeGoma")], "pelotica").length, 0);
  strictEqual(selectPanPosts([post("a", "@panvenezuela #PodcastEnLaCumbre @peloticadegomave")], "pelotica").length, 0);
});
test("consolidated counts and known totals equal disjoint Pelotica and Cumbre partitions", () => {
  const fixtures = [post("a"), post("b", "@panvenezuela #PodcastEnLaCumbre"),
    post("c", "@panvenezuela #PodcastEnLaCumbre #AmoAJuga"), post("d", "@panvenezuela"), post("e", "@doritosvzla #AmoAJuga")];
  const all = selectPanPosts(fixtures, "all");
  const pdg = selectPanPosts(fixtures, "pelotica");
  const cumbre = selectPanPosts(fixtures, "cumbre");
  strictEqual(all.length, 3); strictEqual(pdg.length, 1); strictEqual(cumbre.length, 2);
  strictEqual(sumPanMetric(all, "views").value, 300);
  strictEqual(sumPanMetric(pdg, "views").value, 100);
  strictEqual(sumPanMetric(cumbre, "views").value, 200);
  deepStrictEqual(all.map(p => p.id).sort(), [...pdg, ...cumbre].map(p => p.id).sort());
});
test("collabs merge canonical IG p/reel permalinks without query/fragment and keep shortcode case", () => {
  const rows = [post("owner", undefined, { url: "https://www.instagram.com/p/AbC123/?utm_source=x#z" }),
    post("collab", undefined, { url: "https://instagram.com/reel/AbC123/", source: "metricool", metrics: { views: null, impressions: 500, likes: 20, comments: null, shares: null } })];
  const result = deduplicatePanPosts(rows);
  strictEqual(result.length, 1);
  deepStrictEqual(result[0].metrics, { views: 100, impressions: 500, likes: 20, comments: 2, shares: 1 });
  strictEqual(deduplicatePanPosts([...rows, post("lower", undefined, { url: "https://instagram.com/p/abc123/" })]).length, 2);
});
test("canonical ID connects aliases transitively and separates networks", () => {
  const rows = [post("one", undefined, { url: "https://instagram.com/p/AA/" }), post("two", undefined, { url: "https://instagram.com/p/BB/" }),
    post("two", undefined, { url: "https://instagram.com/reel/AA/" })];
  strictEqual(deduplicatePanPosts(rows).length, 1);
  strictEqual(deduplicatePanPosts([post("same"), post("same", undefined, { platform: "tiktok" })]).length, 2);
  deepStrictEqual(panIdentity(post("x", undefined, { platform: "tiktok", url: "https://www.tiktok.com/@a/video/123456?x=y" })), ["tiktok:id:x", "tiktok:id:123456"]);
});
test("null metrics remain unavailable, IG unvalidated zero is not counted as real views", () => {
  const nulls = post("a", undefined, { metrics: { views: null, impressions: null, likes: null, comments: null, shares: null } });
  strictEqual(deduplicatePanPosts([nulls, { ...nulls }])[0].metrics.views, null);
  deepStrictEqual(sumPanMetric([nulls], "views"), { value: null, available: 0, missing: 1 });
  deepStrictEqual(sumPanMetric([nulls, post("b")], "views"), { value: 100, available: 1, missing: 1 });
  const zero = post("z", undefined, { metrics: { ...nulls.metrics, views: 0 } });
  strictEqual(sumPanMetric([zero], "views").value, null);
  strictEqual(sumPanMetric([{ ...zero, platform: "tiktok" }], "views").value, 0);
});
test("Instagram numeric media IDs deduplicate owner suffix aliases without permalink", () => {
  strictEqual(deduplicatePanPosts([post("123456_789"), post("123456")]).length, 1);
  strictEqual(deduplicatePanPosts([post("123456_789"), post("987654_789")]).length, 2);
});
test("fixture manual Venezuela date bounds include exact first/last millisecond, not adjacent days", () => {
  const rows = ["2026-09-10T03:59:59.999Z", "2026-09-10T04:00:00.000Z", "2026-09-11T03:59:59.999Z", "2026-09-11T04:00:00.000Z"]
    .map((publishedAt, i) => post(String(i), undefined, { publishedAt }));
  deepStrictEqual(selectPanPosts(rows, "all", "2026-09-10", "2026-09-10").map(p => p.id), ["1", "2"]);
  strictEqual(selectPanPosts(rows, "all").length, 4);
  strictEqual(panDateBounds("2026-02-30", ""), null);
  strictEqual(panDateBounds("2026-09-11", "2026-09-10"), null);
  strictEqual(selectPanPosts([post("n", undefined, { publishedAt: null })], "all", "2026-09-10", "").length, 0);
});
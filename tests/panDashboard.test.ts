import { test } from "node:test";
import { strictEqual, deepStrictEqual } from "node:assert";
import { deduplicatePanPosts, filterPanNetworks, initialPanRanges, isPanSplit4, PAN_CUMBRE_REVIEWS, PAN_SPLIT4, panTimestamp, updatePanRange, panInitiative, panIdentity, panDateBounds, selectPanPosts, sumPanMetric, type PanPost } from "../src/lib/panDashboard";

// Synthetic fixtures with explicit confirmed split boundary tests, not source coverage claims.
const post = (id: string, text = "@panvenezuela #PeloticaDeGoma", extra: Partial<PanPost> = {}): PanPost => ({
  platform: "instagram", id, text, url: null, hashtags: [], publishedAt: "2026-09-10T12:00:00-04:00",
  thumbnail: null, source: "stored", updatedAt: "2026-10-01T00:00:00Z",
  metrics: { views: 100, impressions: null, likes: 10, comments: 2, shares: 1 }, ...extra,
});

test("Unicode-safe PAN tokens reject emails, lookalikes and combining marks", () => {
  for (const brand of ["ñ@panvenezuela", "a.@panvenezuela", "a+@panvenezuela", "@@panvenezuela", "@panvenezuelañ", "@panvenezuela\u0301", "@panvenezuela@email.com", "@pan.venezuela"]) {
    strictEqual(panInitiative(post("a", `${brand} #PeloticaDeGoma`)), null, brand);
  }
  for (const token of ["ñ#PeloticaDeGoma", "#PeloticaDeGoma\u0301", "ñ@peloticadegomave", "a.@peloticadegomave", "@peloticadegomave@example.com", "@peloticadegomave\u0301"]) {
    strictEqual(panInitiative(post("a", `@panvenezuela ${token}`)), null, token);
  }
  strictEqual(panInitiative(post("a", "¡@PANVENEZUELA! #PeloticaDeGoma")), "pelotica");
  strictEqual(panInitiative(post("a", "", { hashtags: ["@panvenezuela", "@peloticadegomave"] })), "pelotica");
});

test("confirmed split is exactly the Caracas half-open UTC interval", () => {
  deepStrictEqual(panDateBounds(PAN_SPLIT4.from, PAN_SPLIT4.to), {
    from: Date.parse("2026-08-01T04:00:00Z"), to: Date.parse("2026-10-16T04:00:00Z"),
  });
  const dates = ["2026-08-01T03:59:59.999Z", "2026-08-01T04:00:00Z", "2026-10-16T03:59:59.999Z", "2026-10-16T04:00:00Z", "2026-08-01", "2026-10-15", "2026-10-16", "2026-08-01T00:00:00", "2026-07-31T23:59:59.999", "2026-10-15T23:59:59.999", "2026-10-16T00:00:00", "2026-08-01T06:00:00+02:00", "2026-08-01T03:00:00Z", "2026-02-30", "bad"];
  const rows = dates.map((publishedAt, i) => post(String(i), undefined, { publishedAt }));
  deepStrictEqual(selectPanPosts(rows, "pelotica", PAN_SPLIT4.from, PAN_SPLIT4.to).map(p => p.id), ["1", "2", "4", "5", "7", "9", "11"]);
});

test("naive date policy does not depend on browser/system timezone", () => {
  strictEqual(Number.isNaN(panTimestamp("2026-08-01T24:00:00")), true);
  strictEqual(Number.isNaN(panTimestamp("2026-08-01T12:60:00")), true);
  const original = process.env.TZ;
  try {
    for (const tz of ["UTC", "America/Caracas", "Asia/Tokyo", "America/Los_Angeles"]) {
      process.env.TZ = tz;
      strictEqual(panTimestamp("2026-08-01 00:00:00"), Date.parse("2026-08-01T04:00:00Z"));
      strictEqual(panTimestamp("2026-08-01"), Date.parse("2026-08-01T04:00:00Z"));
      strictEqual(panTimestamp("2026-08-01T00:00:00Z"), Date.parse("2026-08-01T00:00:00Z"));
    }
  } finally { if (original === undefined) delete process.env.TZ; else process.env.TZ = original; }
});

test("preset apply/remove and manual selection are independent per tab", () => {
  let ranges = updatePanRange(initialPanRanges(), "pelotica", PAN_SPLIT4);
  strictEqual(isPanSplit4(ranges.pelotica.from, ranges.pelotica.to), true);
  deepStrictEqual(ranges.cumbre, { from: "", to: "" });
  deepStrictEqual(ranges.all, { from: "", to: "" });
  ranges = updatePanRange(ranges, "cumbre", { from: "2025-09-01", to: "2025-11-30" });
  ranges = updatePanRange(ranges, "pelotica", { from: "", to: "" });
  strictEqual(isPanSplit4(ranges.pelotica.from, ranges.pelotica.to), false);
  deepStrictEqual(ranges.cumbre, { from: "2025-09-01", to: "2025-11-30" });
});

const reviewedFixtures = () => {
  const urls = ["https://www.facebook.com/reel/3302943209913397/", "https://www.instagram.com/reel/DZBKez1hGZN/", "https://www.youtube.com/watch?v=PdQBoXKOsjM", "https://www.tiktok.com/@vacilateesto/video/7646137166988397842", "https://www.tiktok.com/@vacilateesto/video/7573780272949251384", "https://instagram.com/stories/vacilateestopodcast/3757076637541087029", "https://www.tiktok.com/@vacilateesto/video/7566312886297955595", "https://www.instagram.com/p/DPBxzJ4DmhB/"];
  return PAN_CUMBRE_REVIEWS.map((r, i) => post(`review-${i}`, r.kind === "tree" ? "En Podcast en la Cumbre hemos aprendido del bosque de Naiguatá y la selva en Roraima. @panvenezuela" : r.kind === "home" ? "Así como Roraima nutre la tierra, @pan.venezuela nutre nuestro hogar #PodcastEnLaCumbre" : r.kind === "story" ? "@@panvenezuela ¡Falta poco! #PodcastEnLaCumbre" : r.kind === "adventure" ? "Gracias a @pan.venezuela por acompañarnos en esta nueva aventura #PodcastEnLaCumbre Roraima" : "Desde que subimos e hicimos #PodcastEnLaCumbre\n-\npanvenezuela\n@roncovzla", { platform: r.identity.split(":")[0], url: urls[i], publishedAt: r.day }));
};

test("eight reviewed canonical identities belong only to Cumbres with an audit reason", () => {
  const rows = reviewedFixtures();
  const c = selectPanPosts(rows, "cumbre");
  strictEqual(c.length, 8);
  strictEqual(c.filter(p => p.reviewReason?.startsWith("Revisión 2026-10-27")).length, 8);
  strictEqual(selectPanPosts(rows, "pelotica").length, 0);
  strictEqual(selectPanPosts([...rows, post("normal")], "all").length, 9);
  strictEqual(selectPanPosts(rows.slice(0, 4), "cumbre").length, 4); // Not one multiplatform item.
});

test("review allowlist needs the correct platform URL and semantic context", () => {
  for (const row of reviewedFixtures()) {
    strictEqual(panInitiative({ ...row, text: "@pan.venezuela cumbre", hashtags: [] }), null);
    strictEqual(panInitiative({ ...row, url: null }), null);
    strictEqual(panInitiative({ ...row, platform: row.platform === "instagram" ? "facebook" : "instagram" }), null);
    strictEqual(panInitiative({ ...row, url: row.url?.replace(/\.com/, ".com.evil.test") ?? null }), null);
    if (row.platform === "youtube") strictEqual(panInitiative({ ...row, url: "https://www.youtube.com/not-watch?v=PdQBoXKOsjM" }), null);
    strictEqual(panInitiative({ ...row, url: row.url?.replace(/\/reel\/|\/p\/|\/video\/|\/stories\//, "/other/").replace("PdQBoXKOsjM", "XXXXXXXXXXX") ?? null }), null);
  }
  const mixed = { ...reviewedFixtures()[0], text: `${reviewedFixtures()[0].text} #PeloticaDeGoma` };
  strictEqual(selectPanPosts([mixed], "pelotica").length, 0);
  strictEqual(selectPanPosts([mixed], "all").length, 1);
});

test("network selection includes IG+TikTok together without changing the partition", () => {
  const rows = [post("ig"), post("tt", undefined, { platform: "tiktok" }), post("yt", undefined, { platform: "youtube" })];
  strictEqual(filterPanNetworks(rows, "all").length, 3);
  deepStrictEqual(filterPanNetworks(rows, "ig-tiktok").map(p => p.id), ["ig", "tt"]);
  strictEqual(filterPanNetworks(rows, "instagram").length, 1);
});

test("Metricool populated zero wins; only absent fields fall back, unknown stays unknown", () => {
  const stored = post("same");
  const metricool = post("same", undefined, { source: "metricool", metrics: { views: 0, impressions: null, likes: 0, comments: null, shares: null } });
  const merged = deduplicatePanPosts([stored, metricool])[0];
  deepStrictEqual(merged.metrics, { views: 0, impressions: null, likes: 0, comments: 2, shares: 1 });
  deepStrictEqual(sumPanMetric([merged], "views"), { value: null, available: 0, missing: 1 });
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
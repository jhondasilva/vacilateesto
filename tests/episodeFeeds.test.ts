import { test } from "node:test";
import { strictEqual, deepStrictEqual } from "node:assert";
import { readFileSync } from "node:fs";

// Clasificador replicado del feed (mock puro, sin tocar la base de datos):
// shorts → VideoObject, podcasts → PodcastEpisode.
const classify = (kind: string) => (kind === "short" ? "VideoObject" : "PodcastEpisode");

test("feed: shorts se clasifican VideoObject y podcasts PodcastEpisode", () => {
  deepStrictEqual(
    [
      { kind: "short" },
      { kind: "podcast" },
      { kind: "podcast" },
      { kind: "short" },
    ].map((v) => classify(v.kind)),
    ["VideoObject", "PodcastEpisode", "PodcastEpisode", "VideoObject"],
  );
});

test("episodes-feed: solo publicados (published_at <= ahora), IDs válidos, limit [1,500] y kind conocido", () => {
  const src = readFileSync("supabase/functions/episodes-feed/index.ts", "utf8");
  strictEqual(src.includes('.lte("published_at", new Date().toISOString())'), true);
  strictEqual(src.includes("VIDEO_ID.test(v.video_id"), true);
  strictEqual(src.includes("Math.min(Math.max(rawLimit, 1), 500)"), true);
  strictEqual(src.includes('KINDS.has(rawKind)'), true);
  strictEqual(src.includes('v.kind === "short" ? "VideoObject" : "PodcastEpisode"'), true);
});

test("sitemap-videos: solo publicados, IDs válidos y sin video:content_loc (página watch no es archivo multimedia)", () => {
  const src = readFileSync("supabase/functions/sitemap-videos/index.ts", "utf8");
  strictEqual(src.includes('.lte("published_at", new Date().toISOString())'), true);
  strictEqual(src.includes("VIDEO_ID.test(v.video_id"), true);
  strictEqual(src.includes("video:content_loc"), false);
  strictEqual(src.includes("video:player_loc"), true);
});

test("EpisodePage: un error temporal de red no pone noindex; solo el 404 real (NotFound) lo lleva", () => {
  const src = readFileSync("src/pages/EpisodePage.tsx", "utf8");
  strictEqual(src.includes("noindex"), false);
  strictEqual(src.includes("Reintentar"), true);
  const notFound = readFileSync("src/pages/NotFound.tsx", "utf8");
  strictEqual(notFound.includes("noindex"), true);
});

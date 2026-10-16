import { test } from "node:test";
import { strictEqual } from "node:assert";
import { summarizeCommunity, topCommented } from "../src/lib/communityMetrics";

const post = (platform: string, metrics: Record<string, number>, id = Math.random().toString()) => ({
  platform, id, url: "", text: "", publishedAt: "2026-09-01T00:00:00", metrics,
});

test("tasa de interacción suma me gusta, comentarios, compartidos y guardados sobre vistas", () => {
  const [ig] = summarizeCommunity([post("instagram", { views: 1000, likes: 50, comments: 10, shares: 20, saved: 20 })]);
  strictEqual(ig.interactionRate, 10);
  strictEqual(ig.conversationPer1000, 50);
});

test("Facebook se marca sin comentarios reportados", () => {
  const [fb] = summarizeCommunity([post("facebook", { views: 100, likes: 5 })]);
  strictEqual(fb.commentsReported, false);
});

test("los posts más comentados salen primero", () => {
  const top = topCommented([post("tiktok", { comments: 3 }, "a"), post("tiktok", { comments: 9 }, "b")], 1);
  strictEqual(top[0].id, "b");
});

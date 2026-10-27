import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { digestsEqual, sha256Hex, verifyCronRefreshToken } from "../supabase/functions/_shared/cronRefreshAuth.ts";

const TOKEN = "a".repeat(64);

describe("cron refresh token", () => {
  test("accepts the exact token whose digest is active for the target", async () => {
    const d = await sha256Hex(TOKEN);
    expect(await verifyCronRefreshToken(TOKEN, "brand-cache-refresh", async () => [d])).toBe(true);
  });
  test("rejects a different token, malformed tokens and missing tokens", async () => {
    const d = await sha256Hex(TOKEN);
    for (const t of [null, "", "b".repeat(64), TOKEN.toUpperCase(), TOKEN + "0", "short"]) {
      expect(await verifyCronRefreshToken(t, "vem-cache-refresh", async () => [d])).toBe(false);
    }
  });
  test("fails closed when the verifier errors or returns malformed data", async () => {
    expect(await verifyCronRefreshToken(TOKEN, "brand-cache-refresh", async () => { throw new Error("x"); })).toBe(false);
    expect(await verifyCronRefreshToken(TOKEN, "brand-cache-refresh", async () => null)).toBe(false);
    expect(await verifyCronRefreshToken(TOKEN, "brand-cache-refresh", async () => [])).toBe(false);
  });
  test("rejects targets outside the two refresh functions", async () => {
    const d = await sha256Hex(TOKEN);
    // deno-lint-ignore no-explicit-any
    expect(await verifyCronRefreshToken(TOKEN, "metricool-brand-mentions" as any, async () => [d])).toBe(false);
  });
  test("digest comparison is exact", () => {
    expect(digestsEqual("ab", "ab")).toBe(true);
    expect(digestsEqual("ab", "ac")).toBe(false);
    expect(digestsEqual("ab", "abc")).toBe(false);
  });
  test("only the two refresh functions opt into the cron token", () => {
    const fns = ["admin-login-activity", "apify-sync", "brand-user-create", "brand-user-invite", "extract-receipt", "influencer-hashtag-sync", "metricool-brand-mentions"];
    for (const f of fns) expect(readFileSync(`supabase/functions/${f}/index.ts`, "utf8")).not.toContain("cronTarget");
    expect(readFileSync("supabase/functions/brand-cache-refresh/index.ts", "utf8")).toContain('cronTarget: "brand-cache-refresh"');
    expect(readFileSync("supabase/functions/vem-cache-refresh/index.ts", "utf8")).toContain('cronTarget: "vem-cache-refresh"');
  });
});

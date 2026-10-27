// PROPOSAL ONLY. Harness: logs only statuses/counts/UUID. Password and JWTs live in memory only.
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";

const URL_ = process.env.VITE_SUPABASE_URL!, ANON = process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;
const FN = `${URL_}/functions/v1`;
const adminJwt = JSON.parse(readFileSync(`${homedir()}/.cache/lovable-auth/session.json`, "utf8")).session.access_token;
const call = (jwt: string, path: string, init: RequestInit = {}) =>
  fetch(`${FN}/${path}`, { ...init, headers: { apikey: ANON, Authorization: `Bearer ${jwt}`, "Content-Type": "application/json", ...(init.headers ?? {}) } });
const fixture = (action: string, extra: object = {}) =>
  call(adminJwt, "pan-qa-fixture", { method: "POST", body: JSON.stringify({ action, ...extra }) });
const log = (k: string, v: unknown) => console.log(`${k}=${v}`);

const LEGACY = ["influencer-hashtag-sync","brand-cache-refresh","vem-cache-refresh","apify-sync","extract-receipt",
  "metricool-brand-mentions","brand-user-invite","admin-login-activity","brand-user-create"];

let password: string | null = crypto.getRandomValues(new Uint8Array(32)).reduce((s, b) => s + b.toString(16).padStart(2, "0"), "");
let qaJwt: string | null = null; let created = false; let failures = 0;
const check = (name: string, ok: boolean) => { log(name, ok ? "PASS" : "FAIL"); if (!ok) failures++; };

try {
  const c = await fixture("create", { password }); const cj = await c.json();
  log("create_status", c.status); log("fixture_user_id", cj.fixture_user_id ?? "none");
  created = c.status === 200 || Boolean(cj.run_id);
  if (c.status !== 200) throw new Error("create_failed");
  const sb = createClient(URL_, ANON, { auth: { persistSession: false } });
  const { data: s, error } = await sb.auth.signInWithPassword({ email: cj.email ?? "", password: password! });
  password = null;
  if (error || !s.session) throw new Error("signin_failed");
  qaJwt = s.session.access_token;
  const q = createClient(URL_, ANON, { global: { headers: { Authorization: `Bearer ${qaJwt}` } }, auth: { persistSession: false } });

  const pan = await call(qaJwt, "pan-dashboard-read", { method: "POST", body: "{}" }); const pj = await pan.json();
  check("pan_591", pj?.counts?.total === 591 && pj?.counts?.pelotica === 436 && pj?.counts?.cumbre === 155);
  for (const t of [{ brand: "pilsen" }, { keyword: "doritos" }, { scope: "all" }]) {
    const r = await call(qaJwt, "pan-dashboard-read", { method: "POST", body: JSON.stringify(t) });
    check(`tamper_${Object.keys(t)[0]}`, r.status >= 400);
  }
  for (const t of ["brand_metricool_cache", "influencer_posts", "apify_metrics", "brand_reports", "allowed_users"]) {
    const { data, error } = await q.from(t).select("*", { count: "exact", head: false }).limit(1);
    check(`raw_${t}`, Boolean(error) || (data?.length ?? 0) === 0);
  }
  const { data: agg, error: ae } = await q.rpc("apify_metrics_by_month", { p_platform: "instagram", p_handle: "x" } as never);
  check("agg_rpc", Boolean(ae) || (Array.isArray(agg) && agg.length === 0));
  const { data: brands } = await q.from("brands").select("slug");
  check("brands_only_pan", (brands ?? []).every((b: { slug: string }) => ["harina-pan", "pan-pdg"].includes(b.slug)));
  const { error: se } = await q.storage.from("brand-reports").createSignedUrl("x/y.pdf", 60);
  check("storage_sign_denied", Boolean(se));
  for (const fn of LEGACY) {
    const r = await call(qaJwt, fn, { method: "POST", headers: { "x-auth-probe": "1" }, body: "{}" });
    check(`legacy_${fn}`, r.status === 401 || r.status === 403);
  }
} catch (e) { log("error", (e as Error).message); failures++; }
finally {
  password = null;
  if (created) {
    const d = await fixture("disable"); log("disable_status", d.status);
    if (d.status !== 200) { log("STOP", "disable_failed"); process.exit(2); }
    if (qaJwt) {
      const r = await call(qaJwt, "pan-dashboard-read", { method: "POST", body: "{}" });
      const q = createClient(URL_, ANON, { global: { headers: { Authorization: `Bearer ${qaJwt}` } }, auth: { persistSession: false } });
      const { data } = await q.from("brand_metricool_cache").select("brand_id").limit(1);
      check("post_revoke_pan_denied", r.status === 401 || r.status === 403);
      check("post_revoke_raw_empty", (data?.length ?? 0) === 0);
      await fetch(`${URL_}/auth/v1/logout?scope=global`, { method: "POST", headers: { apikey: ANON, Authorization: `Bearer ${qaJwt}` } });
    }
    const cl = await fixture("close"); log("close_status", cl.status);
    const again = await fixture("create", { password: "x".repeat(32) }); log("tombstone_status", again.status);
  }
  qaJwt = null; log("failures", failures);
}

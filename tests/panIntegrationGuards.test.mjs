import { test } from "node:test";
import { strictEqual, ok, match } from "node:assert";
import { readFileSync } from "node:fs";
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

// These are integration wiring assertions, not browser, SQL, or deployed-runtime tests.
test("all nine audited legacy provider/admin handlers gate before their existing body", () => {
  for (const name of ["metricool-brand-mentions", "brand-cache-refresh", "vem-cache-refresh", "apify-sync", "influencer-hashtag-sync", "brand-user-create", "brand-user-invite", "admin-login-activity", "extract-receipt"]) {
    const source = read(`supabase/functions/${name}/index.ts`);
    const handler = source.slice(source.indexOf("serve(async (req) => {"));
    const gate = handler.indexOf("await guardLegacyDashboardRequest(req,");
    ok(gate >= 0, name);
    ok(gate < handler.indexOf("  try {"), name);
    ok(handler.indexOf("if (accessDenied) return accessDenied;") < handler.indexOf("  try {"), name);
  }
});
test("restricted frontend branch consumes only the scoped response and has no raw fallback", () => {
  const source = read("src/components/dashboard/PanDashboard.tsx");
  const branch = source.slice(source.indexOf("if (readonlyMode) {"), source.indexOf("for (const [brandSlug"));
  match(branch, /invoke\("pan-dashboard-read"\)/);
  match(branch, /authorization\?\.userId !== viewerId/);
  match(branch, /throw new Error/);
  match(branch, /return;/);
  strictEqual(/\.from\(|metricool-brand-mentions|apify-sync/.test(branch), false);
});
test("private routes remount and clear shared caches only on identity changes or logout", () => {
  const boundary = read("src/components/DashboardSessionBoundary.tsx");
  match(boundary, /onAuthStateChange/);
  match(boundary, /lastIdentity === identity/);
  match(boundary, /event === "SIGNED_OUT"/);
  match(boundary, /queryClient\.cancelQueries\(\)/);
  match(boundary, /queryClient\.clear\(\)/);
  match(boundary, /Fragment key=\{revision\}/);
  const app = read("src/App.tsx");
  for (const component of ["Gira", "DashboardHome", "DashboardBrand", "DashboardAdmin", "DashboardComunidad", "IngestHealth", "AdminMediaKitVEM"]) {
    ok(app.includes(`<DashboardSessionBoundary><${component} /></DashboardSessionBoundary>`), component);
  }
});
test("generic reports and stale identity UI are blocked for restricted mode", () => {
  const brand = read("src/pages/DashboardBrand.tsx");
  match(brand, /if \(accessMode !== "pan_readonly"\)/);
  match(brand, /loadedForUser !== session\.user\.id/);
  match(brand, /key=\{`\$\{session!\.user\.id\}:\$\{accessMode\}:\$\{brand\.slug\}`\}/);
  const hook = read("src/hooks/useBrandAuth.ts");
  match(hook, /mode !== "pan_readonly" && adminCheck === true/);
  match(hook, /supabase\.rpc\("get_pan_access_context"\)/);
  match(hook, /!guard\.current\(ticket\)/);
});
test("the new handler still has gateway JWT validation and the canonical classifier is not duplicated", () => {
  match(read("supabase/config.toml"), /\[functions\.pan-dashboard-read\]\s*verify_jwt = true/);
  match(read("src/lib/panDashboard.ts"), /export \* from "\.\.\/\.\.\/supabase\/functions\/_shared\/panDashboard\.ts"/);
  strictEqual(read("src/lib/panDashboard.ts").includes("export function selectPanPosts"), false);
});

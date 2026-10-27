// REVIEW ONLY. No invocation until the one-shot fixture helper is approved/deployed.
// Credentials remain in process memory / child stdin. Never log response bodies, errors, paths or tokens.
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { denied, emptyRead, validPan, sameCanonical, onlyPanBrand, storageDenied } from './harness-checks.mjs';

type Json = Record<string, any>;
type Result = { status: number; body: any };
const BASE = process.env.VITE_SUPABASE_URL!;
const KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY!; // public application key, never a service key
let ownerState: Json;
try { ownerState = JSON.parse(readFileSync(`${homedir()}/.cache/lovable-auth/session.json`, 'utf8')); }
catch { console.log('STOP=OWNER_SESSION_UNAVAILABLE'); process.exit(2); }
let ownerSession: Json | null = ownerState.session;
let ownerJwt: string | null = ownerSession?.access_token ?? null;
const OWNER_ID = ownerSession?.user?.id;
const checks: Record<string, 'PASS' | 'FAIL' | 'INCONCLUSIVE'> = {};
const record = (name: string, value: boolean | 'INCONCLUSIVE') => {
  checks[name] = value === 'INCONCLUSIVE' ? value : value ? 'PASS' : 'FAIL';
  console.log(`${name}=${checks[name]}`);
};
const logStatus = (name: string, status: number) => console.log(`${name}=${Number.isInteger(status) ? status : 0}`);
const request = async (jwt: string | null, path: string, init: RequestInit = {}): Promise<Result> => {
  try {
    const r = await fetch(`${BASE}${path}`, { ...init, redirect: 'error', signal: AbortSignal.timeout(25000),
      headers: { apikey: KEY, ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}), 'Content-Type': 'application/json', ...(init.headers ?? {}) } });
    const body = await r.json().catch(() => null);
    return { status: r.status, body };
  } catch { return { status: 0, body: null }; }
};
const post = (jwt: string | null, path: string, body: unknown, headers: Record<string, string> = {}) =>
  request(jwt, path, { method: 'POST', headers, body: JSON.stringify(body) });
const fixture = (action: string, extra: object = {}) => post(ownerJwt, '/functions/v1/pan-qa-fixture', { action, ...extra });
const pan = (jwt: string) => post(jwt, '/functions/v1/pan-dashboard-read', {});
const tables = ['brand_metricool_cache', 'influencer_posts', 'apify_metrics', 'brand_reports', 'allowed_users',
  'expense_reports', 'calendar_settings', 'trip_activities', 'trip_cities', 'trip_comments', 'trip_settings',
  'trip_sponsors', 'yt_ingest_log'];
const legacy = ['influencer-hashtag-sync', 'brand-cache-refresh', 'vem-cache-refresh', 'apify-sync', 'extract-receipt',
  'metricool-brand-mentions', 'brand-user-invite', 'admin-login-activity', 'brand-user-create'];
const objectPath = (s: unknown): string | null => {
  // Do not follow URLs or sign arbitrary hosts. Sources below must contain bucket-relative paths.
  if (typeof s !== 'string' || !s || /^(?:https?:|\/)/i.test(s) || s.includes('?') || s.includes('..')) return null;
  return s;
};
const encodedPath = (p: string) => p.split('/').map(encodeURIComponent).join('/');

async function checkPrivateObject(qa: string) {
  let found = false;
  for (const [table, column, bucket] of [['brand_reports', 'pdf_url', 'brand-reports'], ['expense_reports', 'receipt_url', 'expense-receipts']]) {
    const meta = await request(ownerJwt, `/rest/v1/${table}?select=${column}&${column}=not.is.null&limit=20`);
    if (meta.status !== 200 || !Array.isArray(meta.body)) { record(`storage_${bucket}_metadata`, false); continue; }
    for (const row of meta.body) {
      const path = objectPath(row[column]); if (!path) continue;
      const endpoint = `/storage/v1/object/sign/${bucket}/${encodedPath(path)}`;
      const own = await post(ownerJwt, endpoint, { expiresIn: 30 });
      // Never print or fetch the signed URL. It is used only as proof the object exists and is signable.
      if (own.status !== 200 || typeof (own.body?.signedURL ?? own.body?.signedUrl) !== 'string') continue;
      found = true;
      const restricted = await post(qa, endpoint, { expiresIn: 30 });
      record(`storage_${bucket}_existing_object_denied`, storageDenied(restricted.status, restricted.body));
      break;
    }
  }
  if (!found) record('storage_existing_object_fixture', 'INCONCLUSIVE');
}

function browserCheck(qaSession: Json): boolean {
  const script = fileURLToPath(new URL('./browser-check.py', import.meta.url));
  const p = spawnSync('python3', [script], { input: JSON.stringify({ base: process.env.QA_BROWSER_BASE_URL ?? 'http://localhost:8080',
    ownerSession, qaSession, expectedQaId: qaSession.user.id }), encoding: 'utf8', timeout: 110000, maxBuffer: 16384 });
  // stderr and arbitrary stdout are never logged; a failed browser cannot disclose tokens via errors.
  try {
    const b = JSON.parse(p.stdout ?? '');
    if (p.status !== 0 || b.availability !== 'ready') { record('browser_runtime', 'INCONCLUSIVE'); return false; }
    for (const k of ['owner_home', 'identity_cache_clear', 'pan_screen', 'other_brand_route', 'admin_route', 'finance_route',
      'no_unexpected_functions', 'qa_logout', 'logout_private_screen_cleared']) {
      const v = b.checks?.[k];
      record(`browser_${k}`, v === true ? true : v === false ? false : 'INCONCLUSIVE');
    }
    return b.checks?.qa_logout === true;
  } catch { record('browser_runtime', 'INCONCLUSIVE'); return false; }
}

let password: string | null = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('');
let qaJwt: string | null = null, qaSession: Json | null = null, attemptedCreate = false, browserLoggedOut = false;
let cleanupPending = false;
try {
  if (BASE !== 'https://dpgvanocynbrmqvgvgvd.supabase.co' || !KEY || !ownerJwt || !OWNER_ID) throw new Error('preflight');
  const before = await pan(ownerJwt);
  record('owner_canonical_baseline', validPan(before.status, before.body, OWNER_ID));
  if (!validPan(before.status, before.body, OWNER_ID)) throw new Error('baseline');
  attemptedCreate = true;
  const c = await fixture('create', { password }); logStatus('fixture_create_http', c.status);
  if (c.status !== 200 || c.body?.status !== 'bound' || !/^[0-9a-f-]{36}$/i.test(c.body?.fixture_user_id ?? '')
      || !/^pan-qa-[a-z0-9]+@example\.invalid$/.test(c.body?.email ?? '')) throw new Error('fixture');
  console.log(`fixture_user_id=${c.body.fixture_user_id}`); // only non-secret synthetic identity
  const login = await post(null, '/auth/v1/token?grant_type=password', { email: c.body.email, password });
  password = null;
  if (login.status !== 200 || login.body?.user?.id !== c.body.fixture_user_id || typeof login.body?.access_token !== 'string') throw new Error('signin');
  qaSession = login.body; qaJwt = login.body.access_token;
  const scoped = await pan(qaJwt!);
  record('restricted_pan_591_436_155', validPan(scoped.status, scoped.body, c.body.fixture_user_id));
  record('restricted_matches_canonical', scoped.status === 200 && sameCanonical(before.body, scoped.body));
  for (const [key, value] of [['brand', 'pilsen'], ['keyword', 'doritos'], ['scope', 'all']]) {
    const r = await post(qaJwt, '/functions/v1/pan-dashboard-read', { [key]: value }); record(`tamper_${key}`, r.status === 400);
  }
  record('tamper_query', (await request(qaJwt, '/functions/v1/pan-dashboard-read?scope=all')).status === 400);
  for (const t of tables) {
    const r = await request(qaJwt, `/rest/v1/${t}?select=*&limit=1`); record(`raw_${t}`, emptyRead(r.status, r.body));
  }
  const agg = await post(qaJwt, '/rest/v1/rpc/apify_metrics_by_month', { p_platform: 'instagram', p_handle: 'x' });
  record('aggregate_rpc', emptyRead(agg.status, agg.body));
  const brands = await request(qaJwt, '/rest/v1/brands?select=slug'); record('brands_exactly_pan', onlyPanBrand(brands.status, brands.body));
  const links = await request(qaJwt, '/rest/v1/brand_users?select=brand_id,user_id,access_mode');
  record('own_pan_link_only', links.status === 200 && Array.isArray(links.body) && links.body.length === 1
    && links.body[0].brand_id === '2d249115-874e-40c6-aa58-9cf66f05c651' && links.body[0].user_id === c.body.fixture_user_id
    && links.body[0].access_mode === 'pan_readonly');
  const digest = await post(qaJwt, '/rest/v1/rpc/get_cron_refresh_digests', { p_target: 'brand-cache-refresh' });
  record('service_digest_rpc_denied', denied(digest.status));
  await checkPrivateObject(qaJwt!);
  for (const fn of legacy) {
    const r = await post(qaJwt, `/functions/v1/${fn}`, {}, { 'x-auth-probe': '1' }); record(`legacy_${fn}`, denied(r.status));
  }
  // No provider calls are permitted from this browser; helper aborts every other Edge Function route.
  browserLoggedOut = browserCheck(qaSession!);
} catch { record('execution_complete', false); }
finally {
  password = null;
  // Retain only this synthetic JWT for stale-token checks; never sign out the owner.
  if (qaJwt && !browserLoggedOut) {
    const out = await request(qaJwt, '/auth/v1/logout?scope=global', { method: 'POST' });
    record('qa_global_signout', [200, 204].includes(out.status));
  }
  if (attemptedCreate) {
    const d = await fixture('disable'); logStatus('fixture_disable_http', d.status);
    const noRun = d.status === 404 && d.body?.status === 'no_run';
    if ((d.status !== 200 || d.body?.status !== 'disabled') && !noRun) { cleanupPending = true; record('fixture_disabled', false); }
    else if (!noRun) {
      record('fixture_disabled', d.body?.status === 'disabled');
      if (qaJwt) {
        const p = await pan(qaJwt); record('stale_jwt_pan_denied', denied(p.status));
        for (const t of ['brand_metricool_cache', 'influencer_posts', 'apify_metrics', 'brand_reports']) {
          const r = await request(qaJwt, `/rest/v1/${t}?select=*&limit=1`); record(`stale_jwt_${t}`, emptyRead(r.status, r.body));
        }
      }
      const close = await fixture('close'); record('fixture_closed', close.status === 200 && close.body?.status === 'closed');
      const again = await fixture('create', { password: 'tombstone-probe-only-not-a-credential'.repeat(2) });
      record('fixture_tombstone_410', again.status === 410);
    }
  }
  qaJwt = null; qaSession = null; ownerJwt = null; ownerSession = null;
  const failed = Object.values(checks).filter(v => v === 'FAIL').length;
  const inconclusive = Object.values(checks).filter(v => v === 'INCONCLUSIVE').length;
  console.log(`failures=${failed}`); console.log(`inconclusive=${inconclusive}`);
  if (cleanupPending) console.log('STOP=FIXTURE_CLEANUP_PENDING');
  process.exitCode = cleanupPending ? 2 : failed || inconclusive ? 1 : 0;
}

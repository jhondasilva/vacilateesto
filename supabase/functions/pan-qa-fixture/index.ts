// PROPOSAL ONLY. Target if separately approved: supabase/functions/pan-qa-fixture/index.ts.
// One-shot fixture; no existing identities are changed. No password/JWT/body logging.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const H = { "Content-Type": "application/json", "Cache-Control": "private, no-store", "Vary": "Authorization" };
const reply = (status: number, body: Record<string, unknown>) => new Response(JSON.stringify(body), { status, headers: H });
const BAN = "876000h";
type Run = {
  run_id: string; admin_user_id: string; planned_user_id: string; actual_user_id: string | null;
  candidate_user_id: string | null; auth_user_present: boolean; email: string; state: string; banned: boolean;
};

/** Caller-scoped RPC evidence only; never user_metadata or a decoded JWT claim. */
export function hasStandardAdminContext(confirmed: boolean, allowed: unknown, context: unknown): boolean {
  return confirmed && allowed === true && context !== null && typeof context === "object"
    && (context as { access_mode?: unknown }).access_mode === "standard";
}
export function ownsFixture(caller: string, run: Pick<Run, "admin_user_id"> | undefined): boolean {
  return !run || run.admin_user_id === caller;
}

/** Factory injection permits tests to prove zero privileged calls for unauthorized requests. */
export function createQaHandler(factory: typeof createClient = createClient) {
  return async (req: Request): Promise<Response> => {
    if (req.method !== "POST") return reply(405, { status: "method_not_allowed" });
    const match = req.headers.get("Authorization")?.match(/^Bearer ([^\s]+)$/);
    if (!match) return reply(401, { status: "unauthorized" });
    const url = Deno.env.get("SUPABASE_URL"), anon = Deno.env.get("SUPABASE_ANON_KEY");
    if (!url || !anon) return reply(503, { status: "configuration_unavailable" });
    const callerClient = factory(url, anon, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${match[1]}` } },
    });
    let caller: string;
    try {
      const { data: who, error } = await callerClient.auth.getUser(match[1]);
      if (error || !who?.user?.id) return reply(401, { status: "unauthorized" });
      const [allowed, context] = await Promise.all([
        callerClient.rpc("is_allowed_user"), callerClient.rpc("get_pan_access_context"),
      ]);
      if (allowed.error || context.error) return reply(503, { status: "authorization_unavailable" });
      if (!hasStandardAdminContext(Boolean(who.user.email_confirmed_at), allowed.data, context.data)) {
        return reply(403, { status: "forbidden" });
      }
      caller = who.user.id;
    } catch { return reply(503, { status: "authorization_unavailable" }); }

    // No privileged client exists until current confirmed standard-admin authorization succeeds.
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!service) return reply(503, { status: "configuration_unavailable" });
    const admin = factory(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
    const loadRun = async (): Promise<Run | undefined> => {
      const { data, error } = await admin.rpc("pan_qa_status", { p_admin: caller });
      if (error) throw new Error("status_unavailable");
      const r: Run | undefined = data?.[0];
      if (!ownsFixture(caller, r)) throw new Error("not_run_owner");
      return r;
    };
    let run: Run | undefined;
    try { run = await loadRun(); }
    catch { return reply(403, { status: "run_unavailable" }); }
    if (run?.state === "closed") return reply(410, { status: "gone" });

    let body: { action?: unknown; password?: unknown };
    try {
      const raw = await req.text();
      if (raw.length > 4096) return reply(413, { status: "request_too_large" });
      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return reply(400, { status: "bad_request" });
      body = parsed as { action?: unknown; password?: unknown };
    } catch { return reply(400, { status: "bad_request" }); }
    if (Object.keys(body).some(k => k !== "action" && k !== "password")
      || !["create", "disable", "close"].includes(String(body.action))
      || (body.action !== "create" && "password" in body)) return reply(400, { status: "bad_request" });

    // Ban only an ID recorded by strict SQL provenance checks for this exact run. Always revoke
    // the new grant even if ban fails. A failure is explicit and recoverable, never reported as success.
    const cleanup = async (): Promise<{ complete: boolean; fixture_user_id?: string; banned: boolean; revoked: boolean }> => {
      let r: Run | undefined;
      try { r = await loadRun(); } catch { return { complete: false, banned: false, revoked: false }; }
      if (!r || r.state === "closed") return { complete: Boolean(r), banned: Boolean(r?.banned), revoked: Boolean(r) };
      if (!r.actual_user_id && r.candidate_user_id) {
        try {
          const tracked = await admin.rpc("pan_qa_record_created", {
            p_admin: caller, p_run: r.run_id, p_created: r.candidate_user_id,
          });
          if (!tracked.error) r = await loadRun();
        } catch { /* Still revoke this run's known grant below; report incomplete cleanup. */ }
        if (!r) return { complete: false, banned: false, revoked: false };
      }
      const uid = r.actual_user_id; // ONLY the identity recorded for this run; never a request parameter.
      let banned = uid === null && !r.auth_user_present;
      if (uid) {
        try {
          const ban = await admin.auth.admin.updateUserById(uid, { ban_duration: BAN });
          if (!ban.error) {
            const verified = await admin.rpc("pan_qa_mark_banned", { p_admin: caller, p_run: r.run_id });
            banned = !verified.error;
          }
        } catch { banned = false; }
      }
      let revoked = false;
      try {
        const revocation = await admin.rpc("pan_qa_revoke", { p_admin: caller, p_run: r.run_id });
        revoked = !revocation.error;
      } catch { revoked = false; }
      // close performs an additional check for untracked Auth identities; caller must not skip it.
      return { complete: banned && revoked, fixture_user_id: uid ?? undefined, banned, revoked };
    };

    if (body.action === "create") {
      if (run) return reply(410, { status: "already_used" });
      if (typeof body.password !== "string" || body.password.length < 32 || body.password.length > 256) {
        return reply(400, { status: "bad_request" });
      }
      let runId: string | undefined;
      try {
        const begun = await admin.rpc("pan_qa_begin", { p_admin: caller });
        if (begun.error || !begun.data?.[0]) return reply(403, { status: "begin_denied" });
        const { run_id, planned_user_id, email } = begun.data[0];
        runId = run_id;
        // AdminUserAttributes.id is supported by auth-js 2.64.4 (supabase-js 2.45.0).
        const created = await admin.auth.admin.createUser({
          id: planned_user_id, email, password: body.password, email_confirm: true,
          app_metadata: { pan_qa_run_id: run_id }, // server-only provenance, not user-editable metadata
        });
        body.password = undefined;
        if (created.error || !created.data?.user?.id) throw new Error("create_failed");
        const actual = created.data.user.id;
        const recorded = await admin.rpc("pan_qa_record_created", { p_admin: caller, p_run: run_id, p_created: actual });
        if (recorded.error) throw new Error("record_failed");
        if (actual !== planned_user_id) throw new Error("unexpected_created_uuid");
        const confirmed = await admin.rpc("pan_qa_confirm", { p_admin: caller, p_run: run_id });
        if (confirmed.error) throw new Error("confirm_failed");
        return reply(200, { status: "bound", run_id, fixture_user_id: actual, email });
      } catch {
        body.password = undefined;
        const result = await cleanup();
        return reply(500, { status: result.complete ? "create_failed_cleaned" : "cleanup_pending", run_id: runId, ...result });
      }
    }
    if (body.action === "disable") {
      if (!run) return reply(404, { status: "no_run" });
      const result = await cleanup();
      return reply(result.complete ? 200 : 503, { status: result.complete ? "disabled" : "cleanup_pending", ...result });
    }
    if (!run) return reply(404, { status: "no_run" });
    try {
      const closed = await admin.rpc("pan_qa_close", { p_admin: caller, p_run: run.run_id });
      return closed.error ? reply(409, { status: "not_closable" }) : reply(200, { status: "closed" });
    } catch { return reply(503, { status: "cleanup_pending" }); }
  };
}
Deno.serve(createQaHandler());

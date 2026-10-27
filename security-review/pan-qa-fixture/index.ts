// PROPOSAL ONLY. Target path if approved: supabase/functions/pan-qa-fixture/index.ts
// Not written to supabase/functions, not deployed. One-shot helper; returns only status/counts/UUID.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const H = { "Content-Type": "application/json", "Cache-Control": "no-store" };
const reply = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: H });
const BAN = "876000h"; // reversible: updateUserById(id, { ban_duration: "none" })

Deno.serve(async (req) => {
  if (req.method !== "POST") return reply(405, { status: "method_not_allowed" });
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const jwt = req.headers.get("Authorization")?.replace(/^Bearer /, "") ?? "";
  const { data: who } = await admin.auth.getUser(jwt);
  if (!who?.user) return reply(401, { status: "unauthorized" });
  const caller = who.user.id; // only identity input; SQL re-verifies standard admin

  const { data: st } = await admin.rpc("pan_qa_status");
  const run = st?.[0];
  if (run?.state === "closed") return reply(410, { status: "gone" });

  let body: { action?: string; password?: string };
  try { body = await req.json(); } catch { return reply(400, { status: "bad_request" }); }
  // Only these keys are accepted; any email/brand/user_id input is rejected.
  if (Object.keys(body).some((k) => k !== "action" && k !== "password")) return reply(400, { status: "bad_request" });

  if (body.action === "create") {
    if (run) return reply(410, { status: "already_used" });
    if (typeof body.password !== "string" || body.password.length < 32) return reply(400, { status: "bad_request" });
    const { data: b, error: be } = await admin.rpc("pan_qa_begin", { p_admin: caller });
    if (be || !b?.[0]) return reply(403, { status: "begin_denied" });
    const { run_id, planned_user_id, email } = b[0];
    const { data: cu, error: ce } = await admin.auth.admin.createUser({
      id: planned_user_id, email, password: body.password, email_confirm: true, // no email is sent
      user_metadata: { qa_fixture: true },
    } as never);
    const createdId = cu?.user?.id;
    if (ce || createdId !== planned_user_id) {
      // Ban ONLY a user that this call just created; never touch other accounts.
      if (createdId) await admin.auth.admin.updateUserById(createdId, { ban_duration: BAN });
      await admin.rpc("pan_qa_revoke", { p_admin: caller, p_run: run_id });
      return reply(500, { status: "create_failed", run_id, banned_new_user: Boolean(createdId) });
    }
    const { error: fe } = await admin.rpc("pan_qa_confirm", { p_admin: caller, p_run: run_id });
    if (fe) {
      await admin.auth.admin.updateUserById(planned_user_id, { ban_duration: BAN });
      await admin.rpc("pan_qa_mark_banned", { p_admin: caller, p_run: run_id });
      await admin.rpc("pan_qa_revoke", { p_admin: caller, p_run: run_id });
      return reply(500, { status: "bind_failed_banned", run_id, fixture_user_id: planned_user_id });
    }
    return reply(200, { status: "bound", run_id, fixture_user_id: planned_user_id, email }); // synthetic .invalid, non-secret
  }

  if (body.action === "disable") {
    if (!run) return reply(404, { status: "no_run" });
    const uid = run.planned_user_id as string; // ONLY the UUID recorded by this run
    const { error: ue } = await admin.auth.admin.updateUserById(uid, { ban_duration: BAN });
    if (ue) return reply(500, { status: "ban_failed" });
    const { error: me } = await admin.rpc("pan_qa_mark_banned", { p_admin: caller, p_run: run.run_id });
    if (me) return reply(500, { status: "ban_unverified" });
    let revoked = 0;
    if (run.state !== "revoked") {
      const { data: n, error: re } = await admin.rpc("pan_qa_revoke", { p_admin: caller, p_run: run.run_id });
      if (re) return reply(500, { status: "revoke_failed" });
      revoked = n ?? 0;
    }
    return reply(200, { status: "disabled", fixture_user_id: uid, revoked_rows: revoked });
  }

  if (body.action === "close") {
    if (!run) return reply(404, { status: "no_run" });
    const { error } = await admin.rpc("pan_qa_close", { p_admin: caller, p_run: run.run_id });
    return error ? reply(409, { status: "not_closable" }) : reply(200, { status: "closed" });
  }
  return reply(400, { status: "bad_request" });
});

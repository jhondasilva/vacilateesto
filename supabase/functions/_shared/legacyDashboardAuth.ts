import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { decideLegacyDashboardAccess } from "./legacyDashboardAccess.ts";
import { type CronRefreshTarget, verifyCronRefreshToken } from "./cronRefreshAuth.ts";

type GuardOptions = { cronTarget?: CronRefreshTarget };

/** Return a denial before existing handlers touch providers, data, or writes.
 * An authorized request carrying `x-auth-probe: 1` stops here with 204 so
 * authentication can be verified without running the handler. */
export async function guardLegacyDashboardRequest(
  req: Request,
  corsHeaders: Record<string, string>,
  options: GuardOptions = {},
): Promise<Response | null> {
  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const denyHeaders = { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "private, no-store", "Vary": "Authorization" };
  const allowed = (): Response | null =>
    req.headers.get("x-auth-probe") === "1"
      ? new Response(null, { status: 204, headers: { ...corsHeaders, "Cache-Control": "private, no-store" } })
      : null;

  const cronToken = req.headers.get("x-cron-token");
  if (options.cronTarget && cronToken !== null) {
    const ok = await verifyCronRefreshToken(cronToken, options.cronTarget, async target => {
      if (!url || !serviceKey) throw new Error("Missing server configuration");
      const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
      const { data, error } = await admin.rpc("get_cron_refresh_digests", { p_target: target });
      if (error) throw error;
      return data;
    });
    if (ok) return allowed();
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: denyHeaders });
  }

  const client = (token: string) => {
    if (!url || !anonKey) throw new Error("Missing server configuration");
    return createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
  };
  const decision = await decideLegacyDashboardAccess(req.headers.get("Authorization"), {
    // Exact server credential comparison, never a decoded/unsigned JWT role claim.
    isExistingServiceBearer: token => Boolean(serviceKey) && token === serviceKey,
    verifyUser: async token => {
      const { data, error } = await client(token).auth.getUser(token);
      return !error && Boolean(data.user?.id);
    },
    readAccessContext: async token => {
      const { data, error } = await client(token).rpc("get_pan_access_context");
      if (error) throw error;
      return data;
    },
  });
  if (decision.allowed) return allowed();
  return new Response(JSON.stringify({ error: decision.status === 403 ? "Forbidden" : decision.status === 401 ? "Unauthorized" : "Authorization unavailable" }), {
    status: decision.status,
    headers: denyHeaders,
  });
}

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { canReadPanContext, createPanReadHandler, type PanReadDependencies, type RecordData } from "./handler.ts";

const url = Deno.env.get("SUPABASE_URL");
const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
if (!url || !anonKey || !serviceKey) throw new Error("Missing server configuration");

const userClient = (token: string) => createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { headers: { Authorization: `Bearer ${token}` } },
});

// A service client is created only when an authorized request begins its fixed SELECTs.
const dataClient = () => createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const dependencies: PanReadDependencies = {
  async authenticate(token) {
    const { data, error } = await userClient(token).auth.getUser(token);
    if (error || !data.user) return null;
    return { id: data.user.id, emailConfirmed: Boolean(data.user.email_confirmed_at) };
  },
  async hasPanAccess(token) {
    const client = userClient(token);
    // This no-argument RPC uses auth.uid()/verified Auth email. Restricted mode wins
    // over any contradictory legacy links; no caller-selected identity is accepted.
    const { data, error } = await client.rpc("get_pan_access_context");
    return !error && canReadPanContext(data);
  },
  async readCache(slug, period) {
    const { data, error } = await dataClient()
      .from("brand_metricool_cache")
      .select("payload,refreshed_at")
      .eq("brand_slug", slug)
      .eq("scope", "brand")
      .eq("period_key", period)
      .maybeSingle();
    if (error) throw error;
    return data as RecordData | null;
  },
  async readStoredPage(offset, pageSize) {
    const { data, error } = await dataClient()
      .from("influencer_posts")
      .select("platform,external_id,url,text,hashtags,published_at,thumbnail,views,likes,comments,shares,synced_at")
      .eq("campaign_slug", "pelotica-de-goma")
      .order("id", { ascending: true })
      .range(offset, offset + pageSize - 1);
    if (error) throw error;
    if (!data) throw new Error("Missing stored source");
    return data as RecordData[];
  },
};

Deno.serve(createPanReadHandler(dependencies));

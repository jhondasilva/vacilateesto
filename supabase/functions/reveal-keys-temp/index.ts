// TEMPORARY — delete after use.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const PASSWORD = "Bar6mad6.!";

Deno.serve((req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const url = new URL(req.url);
  const pwd = url.searchParams.get("pwd");
  if (pwd !== PASSWORD) {
    return new Response(JSON.stringify({ error: "forbidden" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  return new Response(
    JSON.stringify({
      LOVABLE_API_KEY: Deno.env.get("LOVABLE_API_KEY") ?? null,
      SUPABASE_SERVICE_ROLE_KEY: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? null,
      SUPABASE_URL: Deno.env.get("SUPABASE_URL") ?? null,
      YOUTUBE_API_KEY: Deno.env.get("YOUTUBE_API_KEY") ?? null,
    }, null, 2),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// Envía una invitación por correo para que el usuario cree su propia contraseña.
// Solo administradores (allowed_users). El email debe existir en brand_users.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: userData, error: userErr } = await admin.auth.getUser(
      authHeader.replace("Bearer ", ""),
    );
    const callerEmail = userData?.user?.email?.toLowerCase().trim();
    if (userErr || !callerEmail) return json({ error: "Unauthorized" }, 401);

    const { data: allowed } = await admin
      .from("allowed_users").select("email").ilike("email", callerEmail).maybeSingle();
    if (!allowed) return json({ error: "Solo administradores" }, 403);

    const body = await req.json();
    const email: string | undefined = body.email?.trim().toLowerCase();
    const redirectTo: string = body.redirect_to || "https://vacilateesto.com/reset-password";
    if (!email) return json({ error: "email requerido" }, 400);

    const { data: links } = await admin
      .from("brand_users").select("id").ilike("email", email);
    if (!links?.length) return json({ error: "Email sin marcas asignadas" }, 400);

    const { data: invited, error } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo });
    if (error) throw error;

    await admin.from("brand_users").update({ user_id: invited.user.id }).ilike("email", email);

    return json({ ok: true, user_id: invited.user.id });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const admin = createClient(supabaseUrl, serviceKey);

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const callerEmail = userData.user.email?.toLowerCase().trim();
    if (!callerEmail) {
      return new Response(JSON.stringify({ error: "Sin email" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Caller debe estar en allowed_users (mismo gate que Gira)
    const { data: allowed } = await admin
      .from("allowed_users")
      .select("email")
      .ilike("email", callerEmail)
      .maybeSingle();
    if (!allowed) {
      return new Response(JSON.stringify({ error: "Solo administradores" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const brand_id: string | undefined = body.brand_id;
    const email: string | undefined = body.email?.trim();
    const display_name: string | null = body.display_name?.trim() || null;
    const password: string | undefined = body.password;

    if (!brand_id || !email || !password || password.length < 6) {
      return new Response(JSON.stringify({ error: "brand_id, email y password (min 6) requeridos" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Crear o actualizar usuario auth
    const { data: list } = await admin.auth.admin.listUsers();
    const existing = list.users.find((u) => u.email?.toLowerCase().trim() === email.toLowerCase());
    let userId: string;
    if (existing) {
      const { error } = await admin.auth.admin.updateUserById(existing.id, {
        password,
        email_confirm: true,
      });
      if (error) throw error;
      userId = existing.id;
    } else {
      const { data: created, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (error) throw error;
      userId = created.user!.id;
    }

    // Upsert brand_users
    const { error: linkErr } = await admin
      .from("brand_users")
      .upsert(
        { brand_id, user_id: userId, email: email.toLowerCase(), display_name },
        { onConflict: "brand_id,user_id" },
      );
    if (linkErr) throw linkErr;

    return new Response(JSON.stringify({ ok: true, user_id: userId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
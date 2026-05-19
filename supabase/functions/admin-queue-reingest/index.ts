// Admin-only: marca videos para re-ingesta limpiando su `indexed_at` y deja un
// log "reingest_queued". El script local `ingest.py` los retoma en la próxima corrida.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Mode = "corruption" | "videoIds";

interface Body {
  mode: Mode;
  videoIds?: string[];
  dryRun?: boolean;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "missing authorization" }, 401);
    }
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Validate admin via the caller's JWT against RLS-protected allowed_users.
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) return json({ error: "invalid session" }, 401);

    const { data: allowed } = await userClient
      .from("allowed_users")
      .select("id")
      .limit(1);
    if (!allowed || allowed.length === 0) {
      return json({ error: "forbidden: admin only" }, 403);
    }

    const body = (await req.json().catch(() => ({}))) as Body;
    const mode: Mode = body.mode === "videoIds" ? "videoIds" : "corruption";
    const dryRun = body.dryRun === true;

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Build the target video list.
    let targets: string[] = [];

    if (mode === "videoIds") {
      const ids = Array.isArray(body.videoIds)
        ? body.videoIds.filter((s): s is string => typeof s === "string" && s.length > 0).slice(0, 500)
        : [];
      if (!ids.length) return json({ error: "videoIds vacío" }, 400);
      targets = ids;
    } else {
      // Modo "corruption": videos que tienen al menos un log status='corruption_alert'
      // O cuyo último log de éxito reportó segments_dropped>0 / chunks_truncated>0.
      const { data: alerts } = await admin
        .from("yt_ingest_log")
        .select("video_id, metadata, status")
        .in("status", ["corruption_alert", "indexed"])
        .order("created_at", { ascending: false })
        .limit(2000);
      const set = new Set<string>();
      for (const r of alerts ?? []) {
        if (!r.video_id) continue;
        if (r.status === "corruption_alert") {
          set.add(r.video_id);
          continue;
        }
        const meta = (r.metadata ?? {}) as Record<string, any>;
        if (Number(meta.segments_dropped ?? 0) >= 5 || Number(meta.chunks_truncated ?? 0) >= 1) {
          set.add(r.video_id);
        }
      }
      targets = Array.from(set);
    }

    if (!targets.length) {
      return json({ queued: 0, videoIds: [], dryRun, mode });
    }

    // Pull titles for response.
    const { data: vids } = await admin
      .from("yt_videos")
      .select("video_id, title")
      .in("video_id", targets);
    const titleMap = Object.fromEntries((vids ?? []).map((v) => [v.video_id, v.title]));

    if (dryRun) {
      return json({
        queued: targets.length,
        videoIds: targets,
        titles: titleMap,
        dryRun: true,
        mode,
      });
    }

    // Clear indexed_at so the next `ingest.py` run picks them up.
    const { error: updErr } = await admin
      .from("yt_videos")
      .update({ indexed_at: null })
      .in("video_id", targets);
    if (updErr) throw updErr;

    // Log one entry per video.
    const requestedBy = userData.user.email ?? userData.user.id;
    const logRows = targets.map((video_id) => ({
      video_id,
      status: "reingest_queued",
      message: `Encolado para re-ingesta por ${requestedBy} (modo: ${mode})`,
      metadata: { requested_by: requestedBy, mode },
    }));
    // insert in batches of 200
    for (let i = 0; i < logRows.length; i += 200) {
      await admin.from("yt_ingest_log").insert(logRows.slice(i, i + 200));
    }

    return json({ queued: targets.length, videoIds: targets, titles: titleMap, dryRun: false, mode });
  } catch (e) {
    console.error("admin-queue-reingest error", e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

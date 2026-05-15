import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_FOLDERS = new Set<string>([
  "1HrGS50B---CIBSorvgRKM8NQtXMJ8-_F",
]);

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  videoMediaMetadata?: { width?: number; height?: number; durationMillis?: string };
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const url = new URL(req.url);
    const folderId = url.searchParams.get("folderId") ?? "";
    if (!ALLOWED_FOLDERS.has(folderId)) {
      return new Response(JSON.stringify({ error: "folder not allowed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("Missing LOVABLE_API_KEY");
    const driveApiKey = Deno.env.get("GOOGLE_DRIVE_API_KEY");
    if (!driveApiKey) throw new Error("Missing GOOGLE_DRIVE_API_KEY");

    const apiUrl = new URL("https://connector-gateway.lovable.dev/google_drive/drive/v3/files");
    apiUrl.searchParams.set("q", `'${folderId}' in parents and trashed = false`);
    apiUrl.searchParams.set(
      "fields",
      "files(id,name,mimeType,thumbnailLink,videoMediaMetadata,createdTime)"
    );
    apiUrl.searchParams.set("pageSize", "200");
    apiUrl.searchParams.set("orderBy", "name");
    const res = await fetch(apiUrl.toString(), {
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "X-Connection-Api-Key": driveApiKey,
      },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Drive API ${res.status}: ${text}`);
    }
    const data = await res.json();
    const files = (data.files ?? []) as DriveFile[];
    const videos = files
      .filter((f) => f.mimeType?.startsWith("video/"))
      .map((f) => ({
        id: f.id,
        name: f.name,
        mimeType: f.mimeType,
        thumbnail: `https://drive.google.com/thumbnail?id=${f.id}&sz=w800`,
        preview: `https://drive.google.com/file/d/${f.id}/preview`,
        width: f.videoMediaMetadata?.width ?? null,
        height: f.videoMediaMetadata?.height ?? null,
        durationMs: f.videoMediaMetadata?.durationMillis
          ? Number(f.videoMediaMetadata.durationMillis)
          : null,
      }));

    return new Response(JSON.stringify({ videos }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (err) {
    console.error("drive-folder-videos error", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

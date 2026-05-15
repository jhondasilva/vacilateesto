import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FOLDERS: Record<string, string> = {
  tv: "1t9E0DyPx_ex9Prw36Y4yi1FBmgFodi_h",
  meta: "1SaWMYetPO2Dm-gDkspCTl1xShcLVwevY",
};

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  videoMediaMetadata?: { width?: number; height?: number; durationMillis?: string };
};

async function listFolder(folderId: string, apiKey: string): Promise<DriveFile[]> {
  const url = new URL("https://connector-gateway.lovable.dev/google_drive/drive/v3/files");
  url.searchParams.set("q", `'${folderId}' in parents and trashed = false`);
  url.searchParams.set(
    "fields",
    "files(id,name,mimeType,thumbnailLink,videoMediaMetadata,createdTime)"
  );
  url.searchParams.set("pageSize", "200");
  url.searchParams.set("orderBy", "name");
  const res = await fetch(url.toString(), {
    headers: { "Lovable-API-Key": apiKey },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Drive API ${res.status}: ${text}`);
  }
  const data = await res.json();
  return (data.files ?? []) as DriveFile[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const [tv, meta] = await Promise.all([
      listFolder(FOLDERS.tv, apiKey),
      listFolder(FOLDERS.meta, apiKey),
    ]);

    const filterVideos = (files: DriveFile[]) =>
      files
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

    return new Response(
      JSON.stringify({ tv: filterVideos(tv), meta: filterVideos(meta) }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300",
        },
      }
    );
  } catch (err) {
    console.error("walking-ads-drive-list error", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
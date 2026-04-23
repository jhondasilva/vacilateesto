// deno-lint-ignore-file no-explicit-any
// Public endpoint that returns the current ingest.py source so the local
// script can self-update when it detects a new version.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

// Bump this whenever ingest.py changes. The local script compares its own
// SCRIPT_VERSION against this and re-downloads the source when they differ.
const SCRIPT_VERSION = "2026.04.23.2";

const SCRIPT_URL =
  "https://raw.githubusercontent.com/lovable-dev/__placeholder__/main/ingest.py";

// We embed the script directly so there's no external dependency.
// To update: edit the SCRIPT_SOURCE constant below and bump SCRIPT_VERSION.
const SCRIPT_SOURCE = await (async () => {
  // Read from a sibling file at deploy time. Deno edge functions can read
  // files bundled with the function.
  try {
    const url = new URL("./ingest.py", import.meta.url);
    return await Deno.readTextFile(url);
  } catch (_e) {
    return "# ingest.py source not bundled. See repo.";
  }
})();

Deno.serve((req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  const url = new URL(req.url);
  // ?format=raw → return just the python source as text/plain (for curl)
  if (url.searchParams.get("format") === "raw") {
    return new Response(SCRIPT_SOURCE, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/plain; charset=utf-8",
        "X-Script-Version": SCRIPT_VERSION,
      },
    });
  }
  return new Response(
    JSON.stringify({
      version: SCRIPT_VERSION,
      source: SCRIPT_SOURCE,
      url: SCRIPT_URL,
    }),
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "X-Script-Version": SCRIPT_VERSION,
      },
    },
  );
});
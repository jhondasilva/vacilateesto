/** Internal scheduler authentication for the two dashboard refresh jobs only.
 * The token lives in Vault and is injected by pg_cron at run time; this module
 * only compares its SHA-256 against server-stored digests. Never log tokens.
 */
export type CronRefreshTarget = "brand-cache-refresh" | "vem-cache-refresh";
export const CRON_REFRESH_TARGETS: readonly CronRefreshTarget[] = ["brand-cache-refresh", "vem-cache-refresh"];
const TOKEN_SHAPE = /^[0-9a-f]{64}$/;
const DIGEST_SHAPE = /^[0-9a-f]{64}$/;

export async function sha256Hex(value: string): Promise<string> {
  const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

/** Constant-time comparison for equal-length lowercase hex digests. */
export function digestsEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** True only for a well-formed token whose digest is active for this exact target. */
export async function verifyCronRefreshToken(
  token: string | null,
  target: CronRefreshTarget,
  readDigests: (target: CronRefreshTarget) => Promise<unknown>,
): Promise<boolean> {
  if (!CRON_REFRESH_TARGETS.includes(target)) return false;
  if (!token || !TOKEN_SHAPE.test(token)) return false;
  try {
    const digests = await readDigests(target);
    if (!Array.isArray(digests)) return false;
    const received = await sha256Hex(token);
    let ok = false;
    for (const d of digests) {
      if (typeof d === "string" && DIGEST_SHAPE.test(d) && digestsEqual(received, d)) ok = true;
    }
    return ok;
  } catch {
    return false;
  }
}

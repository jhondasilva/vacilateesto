/** Compatibility gate for existing privileged dashboard handlers.
 * No secret is invented: existing server-to-server calls already use the platform
 * SERVICE_ROLE bearer. Anonymous cron callers must be migrated before deployment.
 */
export type LegacyAccessDependencies = {
  isExistingServiceBearer: (token: string) => boolean;
  verifyUser: (token: string) => Promise<boolean>;
  readAccessContext: (token: string) => Promise<unknown>;
};

export type LegacyAccessDecision = { allowed: true } | { allowed: false; status: 401 | 403 | 503 };

export async function decideLegacyDashboardAccess(
  authorization: string | null,
  deps: LegacyAccessDependencies,
): Promise<LegacyAccessDecision> {
  const match = /^Bearer ([^\s]+)$/i.exec(authorization ?? "");
  if (!match) return { allowed: false, status: 401 };
  const token = match[1];
  try {
    if (deps.isExistingServiceBearer(token)) return { allowed: true };
    if (!(await deps.verifyUser(token))) return { allowed: false, status: 401 };
    const context = await deps.readAccessContext(token);
    if (!context || typeof context !== "object" || Array.isArray(context)) return { allowed: false, status: 503 };
    const mode = (context as { access_mode?: unknown }).access_mode;
    if (mode === "pan_readonly") return { allowed: false, status: 403 };
    // Preserve legitimate existing brand/admin accounts; unassigned identities have no capability.
    if (mode === "standard") return { allowed: true };
    if (mode === "none") return { allowed: false, status: 403 };
    return { allowed: false, status: 503 };
  } catch {
    return { allowed: false, status: 503 };
  }
}

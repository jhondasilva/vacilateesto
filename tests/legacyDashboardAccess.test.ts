import { test } from "node:test";
import { deepStrictEqual, strictEqual } from "node:assert";
import { decideLegacyDashboardAccess, type LegacyAccessDependencies } from "../supabase/functions/_shared/legacyDashboardAccess.ts";

function fixture(mode: unknown = "standard") {
  const calls: string[] = [];
  const deps: LegacyAccessDependencies = {
    isExistingServiceBearer: token => token === "fixture-server-only",
    verifyUser: async token => { calls.push("verify"); return token === "fixture-user"; },
    readAccessContext: async () => { calls.push("context"); return { access_mode: mode }; },
  };
  return { deps, calls };
}

test("anonymous, malformed and publishable credentials do not reach data/providers", async () => {
  for (const value of [null, "", "fixture-user", "Bearer ", "Bearer one two", "Bearer public-anon"]) {
    const { deps, calls } = fixture();
    deepStrictEqual(await decideLegacyDashboardAccess(value, deps), { allowed: false, status: 401 });
    strictEqual(calls.includes("context"), false);
  }
});
test("PAN restricted mode cannot reach legacy reads, writes or providers", async () => {
  const { deps, calls } = fixture("pan_readonly");
  deepStrictEqual(await decideLegacyDashboardAccess("Bearer fixture-user", deps), { allowed: false, status: 403 });
  deepStrictEqual(calls, ["verify", "context"]);
});
test("removing JWT cannot evade PAN restriction", async () => {
  const { deps } = fixture("pan_readonly");
  deepStrictEqual(await decideLegacyDashboardAccess(null, deps), { allowed: false, status: 401 });
});
test("standard authenticated callers retain the preexisting handler contract", async () => {
  for (const mode of ["standard"]) {
    const { deps } = fixture(mode);
    deepStrictEqual(await decideLegacyDashboardAccess("Bearer fixture-user", deps), { allowed: true });
  }
});
test("existing internal service bearer is recognized without user impersonation", async () => {
  const { deps, calls } = fixture();
  deepStrictEqual(await decideLegacyDashboardAccess("Bearer fixture-server-only", deps), { allowed: true });
  deepStrictEqual(calls, []);
});
test("context or auth failures fail closed, including unknown modes", async () => {
  for (const mode of [undefined, "admin-from-user-metadata", true]) {
    const { deps } = fixture(mode);
    if (mode === undefined) deps.readAccessContext = async () => null;
    deepStrictEqual(await decideLegacyDashboardAccess("Bearer fixture-user", deps), { allowed: false, status: 503 });
  }
  const { deps } = fixture();
  deps.readAccessContext = async () => { throw new Error("private error"); };
  deepStrictEqual(await decideLegacyDashboardAccess("Bearer fixture-user", deps), { allowed: false, status: 503 });
});

test("an authenticated identity with no assigned brand/admin capability is denied", async () => {
  const { deps } = fixture("none");
  deepStrictEqual(await decideLegacyDashboardAccess("Bearer fixture-user", deps), { allowed: false, status: 403 });
});

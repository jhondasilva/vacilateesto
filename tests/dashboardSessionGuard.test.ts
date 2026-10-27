import { test } from "node:test";
import { strictEqual } from "node:assert";
import { createDashboardSessionGuard } from "../src/lib/dashboardSessionGuard.ts";

test("new identity invalidates an older admin/brand response", () => {
  const guard = createDashboardSessionGuard();
  const admin = guard.next();
  const pan = guard.next();
  strictEqual(guard.current(admin), false);
  strictEqual(guard.current(pan), true);
});
test("logout/unmount cancels outstanding results even before next login", () => {
  const guard = createDashboardSessionGuard();
  const ticket = guard.next();
  guard.cancel();
  strictEqual(guard.current(ticket), false);
});

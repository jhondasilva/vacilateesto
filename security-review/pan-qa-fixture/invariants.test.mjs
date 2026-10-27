import { test } from "node:test"; import assert from "node:assert"; import { readFileSync } from "node:fs";
const d = new URL(".", import.meta.url); const sql = readFileSync(new URL("migration.sql", d), "utf8");
const ts = readFileSync(new URL("index.ts", d), "utf8"); const run = readFileSync(new URL("run-once.ts", d), "utf8");
test("singleton run table", () => assert.match(sql, /singleton boolean PRIMARY KEY DEFAULT true CHECK \(singleton\)/));
test("marker before auth: brand_users insert precedes run row, uuid planned in SQL", () => {
  assert.ok(sql.indexOf("INSERT INTO public.brand_users") < sql.indexOf("INSERT INTO pan_access_private.qa_fixture_run"));
  assert.match(sql, /v_uid uuid := gen_random_uuid\(\)/); assert.match(ts, /id: planned_user_id/); });
test("rpcs service_role only", () => { assert.match(sql, /REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated/);
  assert.equal((sql.match(/CREATE FUNCTION public\./g)||[]).length, 7); });
test("no delete of auth users or markers", () => { assert.doesNotMatch(sql+ts, /deleteUser|DELETE FROM auth|DELETE FROM pan_access_private\.restricted/); });
test("no email/brand/user_id inputs", () => { assert.match(ts, /k !== "action" && k !== "password"/); assert.doesNotMatch(ts, /body\.(email|brand|user_id)/); });
test("disable uses recorded uuid only", () => assert.match(ts, /const uid = r\.actual_user_id/));
test("no secret logging", () => { assert.doesNotMatch(ts+run, /console\.log\([^)]*(password|Jwt|jwt|token)/); assert.doesNotMatch(ts, /console\./); });
test("tombstone 410", () => assert.match(ts, /state === "closed"\) return reply\(410/));
test("no password reset path", () => assert.doesNotMatch(ts, /updateUserById\([^)]*password/));

# PAN QA one-shot run (sanitized)

Date: 2026-10-27 UTC. Base HEAD 1d239ee; reviewed patch SHA256 41db5fbb...f23b (index.ts/run-once.ts installed from patch content; only EOF blank-line difference).

## Pre-gates
- Local tests: 28/28 pass (13 behavior, 6 evidence validators, 9 invariants).
- deno check index.ts (supabase-js 2.45.0 pinned): OK.
- Disposable local PostgreSQL 16.13 (synthetic fixtures, rolled back, cluster stopped): migration OK; 48 PASS assertions plus expected-error checks (ACLs, unauthorized/PAN/banned/other-owner no effects, singleton, markers before Auth, provenance, deadline, different-UUID recovery, untracked-identity recovery, no-Auth close, idempotent revoke, closed state). Model only; not proof of production HTTP.

## Production
- Migration: drizzle/migrations/0001_pan_qa_fixture.sql (sha256 of reviewed SQL ceacdf22...2ccd). 7 public pan_qa_* RPCs: EXECUTE only service_role (anon/authenticated false). 2 private tables, no client grants.
- Function pan-qa-fixture deployed, verify_jwt=true, source_sha256 756ba5c3aaeb32df02523e9f1ce9f8c29352ea60b61242b0208b300ae75bbb9d.
- Unauthorized probes (none/anon/garbage JWT): 401/401/401.

## Run
- Fixture UUID: f7545df0-b625-41e4-bada-a899be308b71 (synthetic .invalid email, harina-pan pan_readonly only).
- 56 checks: 56 PASS, 0 FAIL, 0 INCONCLUSIVE.
- Storage: brand-reports existing object denied; expense-receipts had no signable object evaluated (not recorded).
- Cleanup: disable HTTP 200 (banned + grant revoked with audit snapshot), stale JWT denied (PAN + 4 raw tables), close 200, future create 410.
- brand_users after: 86 rows, 0 pan_readonly (unchanged baseline). Owner sessions not revoked; local session file discarded.
- Cron positive path: NOT tested (Vault branch closed).

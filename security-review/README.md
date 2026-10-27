# P.A.N. restricted-access SQL — review package, not deployed

Prepared against the audited database policies and Lovable HEAD `3d4d809aba9288e23732952eda00378434a4a311`. No SQL in this directory has been executed. No migration runner is pointed at this directory. No users, memberships, passwords, secrets, invitations or cron jobs were created or changed.

## Files and status

- `pan-readonly.proposal.sql`: concrete migration proposal, deliberately **outside** `supabase/migrations`.
- `pan-readonly.staging-tests.sql`: transactional fixture tests for an approved **disposable local** Supabase/PostgreSQL database. Includes mutation attempts and a simulated membership revocation; never run against production merely because it uses rollback.
- `../tests/rls-pan-readonly.test.mjs`: 14 passing local tests of proposal contracts and an independent identity model. These are **not proof that PostgreSQL executed or enforced the RLS**.
- PostgreSQL parse/execution, RLS integration, Data API/Storage negative tests and production validation: **not run**. No PostgreSQL, psql, Deno or Supabase CLI is installed in this executor.

Local check:

```sh
node --test tests/rls-pan-readonly.test.mjs
```

## Exact database operations requiring approval

1. Add `public.brand_users.access_mode`, default `standard`, constrained to `standard`/`pan_readonly`. Restricted links may reference only the two existing audited P.A.N. IDs. All existing valid users keep `standard`; no individual is added by the migration.
2. Create the non-exposed `pan_access_private` schema and an initially empty, RLS-enabled `restricted_principals` table. Revoke its table access from client roles. Add a security-definer trigger which records a restriction only when a future membership is explicitly created/updated as `pan_readonly`.
3. Create private, fixed-search-path, self-scoped authorization helpers; no caller-selected UUID/email context and no user-editable metadata is used. The helpers expose only current-user booleans/context, not registry rows or other users.
4. Update `is_allowed_user()` and `user_has_brand_access(uuid)` so a restricted principal cannot gain administration or other brands from accidental extra links. Existing valid standard identities retain their previous permissions. A deleted/nonexistent Auth identity is not granted capabilities.
5. Add nine restrictive policies: five `FOR ALL` blockers for raw cache, influencer posts, Apify metrics, generic reports and Storage objects; four policies limiting restricted users' `brand_users` SELECT/INSERT/UPDATE/DELETE. Existing permissive policies are retained for standard users. Existing finance/team policies use the updated `is_allowed_user()` and therefore deny the restricted principal.
6. Change the existing `apify_metrics_by_month(text,text)` aggregate to `SECURITY INVOKER`, preserving its entire signature, body and output. Revoke `EXECUTE` from `PUBLIC`/`anon`, keep `authenticated`/`service_role`. This closes a confirmed raw-data RLS bypass; it does **not** repair the unrelated ignored `p_handle` behavior.
7. Add `public.get_pan_access_context()` as a no-argument `SECURITY INVOKER` wrapper returning one JSON object:

```json
{"access_mode":"pan_readonly","can_read_pan":true}
```

`access_mode` is `pan_readonly`, `standard` or `none`. A confirmed user with a legitimate standard link to **any** brand, or an administrator, is `standard`; only administrators/P.A.N. members have `can_read_pan=true`. A new/unassigned or unconfirmed standard user is `none`, and the legacy provider guard must deny that mode. A restricted unconfirmed/revoked identity remains `pan_readonly`, but `can_read_pan` is false; a restricted marker always wins. The Edge Function must run the RPC with the same validated user's JWT, not a bare service client. Anonymous callers cannot execute this RPC.

## Why restriction metadata survives membership revocation

Storing restriction only on `brand_users` is unsafe in this legacy system: deleting the link would remove the restriction, while its still-valid authenticated token could regain the old wildcard `influencer_posts`/`apify_metrics` permissions. The private registry therefore preserves UUID/email restriction records when a membership is deleted, lowered to `standard` or when Auth user deletion leaves an unexpired token. It confers **no access by itself**. Restoring broader privileges would require an explicit, separately reviewed security action; there is no client-accessible deregistration function.

After invitation binds a membership UUID, that UUID is authoritative for a restricted capability. Email fallback grants a restricted capability only while `brand_users.user_id` is null and the current Auth email is confirmed. A recycled old email may remain conservatively restricted, but cannot inherit the old person's P.A.N. link. These rules do not alter standard users' legacy ID/email matching.

## Compatibility and activation blockers

- **Cron authentication is unresolved.** The parent audit found `brand-cache-refresh-daily` and `vem-cache-refresh-daily` currently call their functions without Authorization/Bearer or Vault authentication. Requiring authentication at these endpoints would break those jobs. No cron change or secret creation is part of this SQL. Activation must wait for the specific scheduler-authentication action to be approved and verified; do not invent a header secret or inspect Vault to work around a denial.
- **Edge Functions still need the prepared server guards.** Handlers using `service_role` and direct `allowed_users` queries bypass RLS. They must deny restricted principals before providers, writes or admin work, and must not allow no-JWT bypass. RLS alone does not close them.
- **Aggregate RPC anonymous behavior changes intentionally.** Standard authenticated results should be identical, but anonymous callers lose a previously broad private-metrics capability. Verify the actual callers before deployment; do not claim zero caller impact from local static tests.
- **TRUNCATE is not constrained by RLS.** Historical grants to `anon`/`authenticated` included TRUNCATE. This proposal does not globally revoke those grants. Confirm that no exposed SQL/RPC route offers arbitrary SQL or TRUNCATE. A regular Supabase user JWT is not a direct database connection. If such a route exists, it is an additional activation blocker requiring scoped correction.
- `restricted_principals` starts empty and the new restrictions are dormant until a separate approved restricted membership action. Migrations require an authorized owner with BYPASSRLS, fixed helper ownership and verification that the new private schema is not in Data API exposed schemas.
- Supabase views/RPCs should be inventoried for any remaining security-definer route to private brand data. The known `apify_metrics_by_month` route is included; public transcript/host-stat RPCs are not broadened or repurposed.
- Storage metadata and signed-URL creation are denied for the restricted user. Public logo downloads remain public, as do other genuinely public site assets. No promise can make public information private.

## Deployment and verification order

1. Confirm the target HEAD/database still match; capture baseline outputs for existing standard/admin fixtures and caller inventory. Do not auto-retry if a prior application is uncertain. The proposal intentionally fails if the new column/schema already exists.
2. In an approved disposable environment, apply the reviewed migration and seed synthetic identities. Test restricted, standard, admin, unconfirmed, revoked and unrelated users. Run the SQL fixture suite and real REST/RPC/Storage tests; compare standard fixture outputs to a before-migration capture. Tests must reject upstream providers before any external request.
3. Only after concrete security/deploy approval, apply the migration and matching endpoint/frontend changes, including resolution of cron authentication. Verify actual deployed Edge Function versions and live SELECT-only negative checks without exposing secrets.
4. In a separate approved action, create the one verified recipient's `harina-pan/pan_readonly` membership, checking for new existing users or rights first. Trigger registration is part of that action. No membership is present in this patch.
5. Only after the account's isolation is verified, send the official invitation. Do not share or generate a password and do not reset an existing account's password.

## Tests still required before claiming isolation

- Real-role direct reads of every raw table and aggregate RPC return zero/denial for the restricted identity.
- The scoped endpoint returns P.A.N. only for all three allowed views; body/query/brand/ID tampering cannot broaden results.
- Raw INSERT/UPDATE/DELETE, own-role escalation, allowed_users insertion, private Storage signing/listing, other-brand URLs and admin/finance data are denied.
- Unconfirmed restricted UUID, JWT expiry, session changes and member revocation fail closed; deleting the grant cannot restore wildcard raw access.
- Standard/admin users and authenticated service-to-service/cron flows retain their authorized behavior; all costs remain disabled in tests.
- Production account activation requires those results, not merely successful application of SQL or passing textual tests.

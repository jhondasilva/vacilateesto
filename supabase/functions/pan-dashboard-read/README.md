# Prepared P.A.N. read endpoint — not deployed

This endpoint is a local preparation only. Do not deploy or provision users before the corresponding SQL, legacy-endpoint controls, frontend changes and negative staging checks have been approved and verified.

## Contract

Authenticated `GET` without a query, or `POST` with an empty body/`{}`. Caller-selected brands, scopes, IDs, blogs, dates, networks and SQL are rejected. The caller may view the whole P.A.N. partition (Consolidado, Pelotica and Cumbre); client display filters can only reduce that already authorized dataset.

The handler verifies the actual user through `auth.getUser(token)`, requires confirmed email, then invokes the caller-scoped, no-argument `get_pan_access_context()` RPC with the **same user JWT**. It accepts only an exact `pan_readonly`/`standard` context with `can_read_pan: true`. No JWT metadata supplied by the user decides access. A malformed/failed authorization result denies access.

Only after successful authorization does the handler issue fixed SELECTs using the server-only service role. Sources:

- `brand_metricool_cache`: `harina-pan`, `scope=brand`, `period_key=cumulative-all`.
- `brand_metricool_cache`: `pelotica-de-goma`, `scope=brand`, `period_key=cumulative-2026`.
- `influencer_posts`: `campaign_slug=pelotica-de-goma`, fixed selected columns, ID-ordered pages of 500.

No refresh, write, Actor, Metricool, Apify, or other provider call exists. There is no materialized copy. The service key stays in server environment variables and is not returned or logged. The two cache sources must exist with a valid posts array. Source/query errors or an exceeded pagination ceiling return a complete error, with no partial posts/coverage or internal error details.

The reviewed classifier has been copied byte-for-byte to `../_shared/panDashboard.ts` (SHA-256 `488244ad326efca9089cca5d4db153ce37aff1d8f71c6cf407b9b46bb2b593c0`). Frontend `src/lib/panDashboard.ts` should re-export that module, not maintain another implementation. Server classification and deduplication occur before response serialization. Output fields are explicitly allowlisted. Coverage counts/date ranges/oldest update refer only to eligible P.A.N. records in each source, not to global source payloads. Per-source coverage may overlap and must not be added to derive a unique total.

Success: `{ schemaVersion: 1, authorization: { userId }, posts, coverage }`. The user ID is the verified caller, not a request parameter. The client should discard a result if it belongs to a different current session and clear all local posts on logout or account change. All responses use `Cache-Control: private, no-store, max-age=0` and vary by authorization. Do not cache this route in a service worker.

## Required integration before approval

1. Apply/verify the reviewed access-context RPC and RLS migration only when approved. This source does not apply it.
2. Prepare the frontend to call this endpoint without selectors, preserving its P.A.N. tabs. Do not fall back to raw data reads when authorization/endpoint fails.
3. Close the previously audited raw and legacy Edge Function bypasses. This endpoint alone cannot secure other endpoints.
4. Verify deployed runtime authentication. Handler authentication is mandatory independent of any gateway `verify_jwt` setting; the gateway setting itself must be explicitly reviewed before deployment.
5. Validate true HTTP/auth/RLS/Storage negatives in an authorized staging environment; unit tests are not evidence of production isolation.

## Local checks performed

`node --experimental-strip-types --test tests/panDashboardRead.test.ts`

The suite covers rejection before reads, exact access-context schema, malicious selectors, oversized bodies, both P.A.N. initiatives, sanitization, canonical deduplication, reviewed Cumbre exception, pagination, complete-source failures, no-store and a static SELECT-only adapter assertion. It requires no network or dependencies. Full Deno type-check and deployed integration checks are still required; no Deno/Supabase CLI or project dependencies were available in this local snapshot.

Result: 17 tests passed. An additional offline fixture regression using `tests/panDashboardRead.population.mjs` reproduced exactly the reviewed classifier output from 2,095 captured source records: 591 unique P.A.N. posts (436 Pelotica and 155 Cumbre), with identical metrics. Source-level authorized coverage counts are 155, 349 and 249 and overlap; they are not unique totals. This is an offline regression, not evidence of deployed API or RLS behavior.

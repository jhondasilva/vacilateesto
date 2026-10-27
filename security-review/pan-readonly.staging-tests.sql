-- NOT RUN. Requires an approved, disposable local PostgreSQL/Supabase test database.
-- Never run this fixture/mutation test against production, even though it ends in ROLLBACK.
-- Seed synthetic confirmed PAN and standard users separately; this script creates no Auth users.
-- Required psql variables: pan_user_id, pan_user_email, other_brand_id, standard_user_id,
-- standard_user_email, allow_disposable_test=true. Fixtures need at least one synthetic apify row.
\set ON_ERROR_STOP on
\if :{?allow_disposable_test}
\else
  \echo 'STOP: allow_disposable_test=true is required after confirming a disposable LOCAL database.'
  \quit 3
\endif
\if :allow_disposable_test
\else
  \quit 3
\endif
\if :{?pan_user_id}
\else
  \quit 3
\endif
\if :{?standard_user_id}
\else
  \quit 3
\endif

BEGIN;
SELECT set_config('pan_test.other_brand_id', :'other_brand_id', true);
SELECT set_config('pan_test.pan_email', :'pan_user_email', true);
SELECT set_config('pan_test.pan_user_id', :'pan_user_id', true);

DO $fixtures$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.apify_metrics) THEN
    RAISE EXCEPTION 'Seed a synthetic apify fixture first; empty datasets cannot prove insert denial';
  END IF;
END
$fixtures$;
CREATE TEMP TABLE pan_apify_insert_fixture AS SELECT * FROM public.apify_metrics LIMIT 1;
GRANT SELECT ON pan_apify_insert_fixture TO authenticated;

SELECT set_config('request.jwt.claim.sub', :'pan_user_id', true);
SELECT set_config('request.jwt.claims', json_build_object('sub', :'pan_user_id', 'role', 'authenticated', 'email', :'pan_user_email')::text, true);
SET LOCAL ROLE authenticated;

DO $restricted$
DECLARE
  changed bigint;
BEGIN
  IF public.get_pan_access_context() IS DISTINCT FROM '{"access_mode":"pan_readonly","can_read_pan":true}'::jsonb THEN
    RAISE EXCEPTION 'Restricted fixture must have confirmed scoped PAN access';
  END IF;
  IF public.is_allowed_user() THEN RAISE EXCEPTION 'Restricted user became an administrator'; END IF;
  IF public.user_has_brand_access(current_setting('pan_test.other_brand_id')::uuid) THEN
    RAISE EXCEPTION 'Restricted user gained another brand';
  END IF;
  IF EXISTS (SELECT 1 FROM public.brand_metricool_cache)
     OR EXISTS (SELECT 1 FROM public.influencer_posts)
     OR EXISTS (SELECT 1 FROM public.apify_metrics)
     OR EXISTS (SELECT 1 FROM public.brand_reports)
     OR EXISTS (SELECT 1 FROM storage.objects)
     OR EXISTS (SELECT 1 FROM public.allowed_users)
     OR EXISTS (SELECT 1 FROM public.expense_reports)
     OR EXISTS (SELECT 1 FROM public.calendar_settings)
     OR EXISTS (SELECT 1 FROM public.trip_activities)
     OR EXISTS (SELECT 1 FROM public.trip_cities)
     OR EXISTS (SELECT 1 FROM public.trip_comments)
     OR EXISTS (SELECT 1 FROM public.trip_settings)
     OR EXISTS (SELECT 1 FROM public.trip_sponsors)
     OR EXISTS (SELECT 1 FROM public.yt_ingest_log) THEN
    RAISE EXCEPTION 'Restricted identity can read a raw/private dataset';
  END IF;
  IF EXISTS (SELECT 1 FROM public.brands WHERE id NOT IN (
    '2d249115-874e-40c6-aa58-9cf66f05c651'::uuid, '58721091-bc10-4a44-bd54-a8c1c3aafd5a'::uuid)) THEN
    RAISE EXCEPTION 'Other brand metadata is exposed';
  END IF;
  IF EXISTS (SELECT 1 FROM public.apify_metrics_by_month('instagram', NULL)) THEN
    RAISE EXCEPTION 'Aggregate RPC bypasses restricted raw RLS';
  END IF;

  UPDATE public.brand_users SET access_mode = 'standard' WHERE user_id = auth.uid();
  GET DIAGNOSTICS changed = ROW_COUNT;
  IF changed <> 0 THEN RAISE EXCEPTION 'Restricted user changed its access mode'; END IF;
  UPDATE public.apify_metrics SET platform = platform;
  GET DIAGNOSTICS changed = ROW_COUNT;
  IF changed <> 0 THEN RAISE EXCEPTION 'Restricted user updated raw metrics'; END IF;
  DELETE FROM public.apify_metrics;
  GET DIAGNOSTICS changed = ROW_COUNT;
  IF changed <> 0 THEN RAISE EXCEPTION 'Restricted user deleted raw metrics'; END IF;

  BEGIN
    INSERT INTO public.apify_metrics SELECT * FROM pg_temp.pan_apify_insert_fixture;
    RAISE EXCEPTION 'Restricted user inserted raw metrics';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    INSERT INTO public.brand_users (brand_id, user_id, email, access_mode)
    VALUES ('2d249115-874e-40c6-aa58-9cf66f05c651'::uuid, auth.uid(), current_setting('pan_test.pan_email'), 'standard');
    RAISE EXCEPTION 'Restricted user inserted a standard link';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    INSERT INTO public.allowed_users (email) VALUES (current_setting('pan_test.pan_email'));
    RAISE EXCEPTION 'Restricted user inserted an administrative grant';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END
$restricted$;

RESET ROLE;
SELECT set_config('request.jwt.claim.sub', :'standard_user_id', true);
SELECT set_config('request.jwt.claims', json_build_object('sub', :'standard_user_id', 'role', 'authenticated', 'email', :'standard_user_email')::text, true);
SET LOCAL ROLE authenticated;
DO $standard$
BEGIN
  IF pan_access_private.is_pan_readonly_user() THEN RAISE EXCEPTION 'Standard fixture was restricted'; END IF;
  IF public.get_pan_access_context()->>'access_mode' IS DISTINCT FROM 'standard' THEN
    RAISE EXCEPTION 'Use a confirmed standard fixture with a legitimate brand link or admin role';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.apify_metrics) THEN RAISE EXCEPTION 'Standard raw metrics behavior regressed'; END IF;
END
$standard$;
-- Compare these counts/results to a BEFORE-migration capture for the same synthetic standard fixture.
SELECT 'standard_apify_count' AS check_name, count(*) FROM public.apify_metrics;
SELECT 'standard_influencer_count' AS check_name, count(*) FROM public.influencer_posts;
SELECT public.get_pan_access_context(), public.is_allowed_user();

RESET ROLE;
SET LOCAL ROLE anon;
DO $anonymous$
BEGIN
  BEGIN
    PERFORM public.get_pan_access_context();
    RAISE EXCEPTION 'Anonymous caller executed PAN context RPC';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    PERFORM public.apify_metrics_by_month('instagram', NULL);
    RAISE EXCEPTION 'Anonymous caller executed metrics aggregate RPC';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END
$anonymous$;
RESET ROLE;

-- Simulate an administrator revoking the synthetic PAN membership. The restriction must survive.
DELETE FROM public.brand_users
WHERE access_mode = 'pan_readonly'
  AND (user_id = current_setting('pan_test.pan_user_id')::uuid
       OR (user_id IS NULL AND lower(btrim(email)) = lower(btrim(current_setting('pan_test.pan_email')))));
SELECT set_config('request.jwt.claim.sub', :'pan_user_id', true);
SELECT set_config('request.jwt.claims', json_build_object('sub', :'pan_user_id', 'role', 'authenticated', 'email', :'pan_user_email')::text, true);
SET LOCAL ROLE authenticated;
DO $revocation$
BEGIN
  IF public.get_pan_access_context() IS DISTINCT FROM '{"access_mode":"pan_readonly","can_read_pan":false}'::jsonb THEN
    RAISE EXCEPTION 'Revocation removed the restriction or retained scoped access';
  END IF;
  IF EXISTS (SELECT 1 FROM public.apify_metrics) OR EXISTS (SELECT 1 FROM public.influencer_posts)
     OR EXISTS (SELECT 1 FROM public.brand_metricool_cache) THEN
    RAISE EXCEPTION 'Revocation restored wildcard raw access';
  END IF;
END
$revocation$;
RESET ROLE;
ROLLBACK;

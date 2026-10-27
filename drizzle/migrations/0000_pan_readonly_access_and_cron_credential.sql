-- PAN read-only access isolation and scheduler credential (owner-approved 2026-10-27). Locally verified on PostgreSQL 16 with synthetic fixtures and rollback.

DO $preflight$
DECLARE
  target text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = current_user AND (rolsuper OR rolbypassrls)) THEN
    RAISE EXCEPTION 'Run reviewed security helpers as an authorized migration owner with BYPASSRLS';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema = 'public' AND table_name = 'brand_users' AND column_name = 'access_mode')
     OR EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'pan_access_private') THEN
    RAISE EXCEPTION 'PAN access proposal was already applied or the schema changed; inspect before proceeding';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.brands WHERE id = '2d249115-874e-40c6-aa58-9cf66f05c651'::uuid AND slug = 'harina-pan')
     OR NOT EXISTS (SELECT 1 FROM public.brands WHERE id = '58721091-bc10-4a44-bd54-a8c1c3aafd5a'::uuid AND slug = 'pan-pdg') THEN
    RAISE EXCEPTION 'P.A.N. identities changed; do not infer replacement privileges';
  END IF;
  IF to_regprocedure('public.is_allowed_user()') IS NULL
     OR to_regprocedure('public.user_has_brand_access(uuid)') IS NULL
     OR to_regprocedure('public.apify_metrics_by_month(text,text)') IS NULL THEN
    RAISE EXCEPTION 'Existing authorization functions are missing';
  END IF;
  FOREACH target IN ARRAY ARRAY['public.brand_users', 'public.brands', 'public.brand_metricool_cache',
    'public.influencer_posts', 'public.apify_metrics', 'public.brand_reports', 'storage.objects'] LOOP
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE oid = to_regclass(target) AND relrowsecurity) THEN
      RAISE EXCEPTION 'Expected RLS is absent on %', target;
    END IF;
  END LOOP;
END
$preflight$;

ALTER TABLE public.brand_users
  ADD COLUMN access_mode text NOT NULL DEFAULT 'standard',
  ADD CONSTRAINT brand_users_access_mode_valid CHECK (access_mode IN ('standard', 'pan_readonly')),
  ADD CONSTRAINT brand_users_pan_readonly_brand CHECK (
    access_mode = 'standard' OR (brand_id IS NOT NULL AND brand_id IN (
      '2d249115-874e-40c6-aa58-9cf66f05c651'::uuid,
      '58721091-bc10-4a44-bd54-a8c1c3aafd5a'::uuid
    ))
  );

-- This schema must remain outside the Data API exposed schemas.
CREATE SCHEMA pan_access_private;
REVOKE ALL ON SCHEMA pan_access_private FROM PUBLIC;
GRANT USAGE ON SCHEMA pan_access_private TO authenticated, service_role;

-- A restriction must survive membership removal and JWT lifetime. This registry starts empty.
-- No FK to auth.users: deleting an Auth user must not make its still-valid JWT unrestricted.
-- Email entries also remain conservative tombstones; they never grant a brand by themselves.
CREATE TABLE pan_access_private.restricted_principals (
  subject_key text PRIMARY KEY,
  user_id uuid UNIQUE,
  email text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT restricted_principal_identity CHECK (
    (user_id IS NOT NULL AND email IS NULL AND subject_key = 'user:' || user_id::text)
    OR (user_id IS NULL AND email IS NOT NULL AND email <> ''
        AND email = pg_catalog.lower(pg_catalog.btrim(email)) AND subject_key = 'email:' || email)
  )
);
ALTER TABLE pan_access_private.restricted_principals ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE pan_access_private.restricted_principals FROM PUBLIC, anon, authenticated, service_role;

CREATE FUNCTION pan_access_private.register_pan_readonly_principal()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
BEGIN
  IF NEW.access_mode = 'pan_readonly' THEN
    IF NEW.user_id IS NOT NULL THEN
      INSERT INTO pan_access_private.restricted_principals (subject_key, user_id)
      VALUES ('user:' || NEW.user_id::text, NEW.user_id) ON CONFLICT DO NOTHING;
    END IF;
    IF NEW.email IS NOT NULL AND pg_catalog.btrim(NEW.email) <> '' THEN
      INSERT INTO pan_access_private.restricted_principals (subject_key, email)
      VALUES ('email:' || pg_catalog.lower(pg_catalog.btrim(NEW.email)), pg_catalog.lower(pg_catalog.btrim(NEW.email)))
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END
$function$;
REVOKE ALL ON FUNCTION pan_access_private.register_pan_readonly_principal() FROM PUBLIC, anon, authenticated, service_role;
CREATE TRIGGER register_pan_readonly_principal
AFTER INSERT OR UPDATE OF access_mode, user_id, email ON public.brand_users
FOR EACH ROW WHEN (NEW.access_mode = 'pan_readonly')
EXECUTE FUNCTION pan_access_private.register_pan_readonly_principal();

-- For restrictions, a matching linked UUID is sufficient even before confirmation.
-- For an email-only link, use the CURRENT confirmed Auth email, not a stale JWT email.
CREATE FUNCTION pan_access_private.matches_current_identity(link_user_id uuid, link_email text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
  SELECT EXISTS (
    SELECT 1 FROM auth.users u
    WHERE u.id = (SELECT auth.uid())
      AND (
        link_user_id = u.id
        OR (u.email_confirmed_at IS NOT NULL
            AND pg_catalog.lower(pg_catalog.btrim(link_email)) = pg_catalog.lower(pg_catalog.btrim(u.email)))
      )
  )
$function$;

-- A registered restriction wins over duplicate links, revoked links or accidental admin entries.
CREATE FUNCTION pan_access_private.is_pan_readonly_user()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
  SELECT EXISTS (
    SELECT 1 FROM pan_access_private.restricted_principals rp
    WHERE rp.user_id = (SELECT auth.uid())
       OR (rp.email IS NOT NULL AND EXISTS (
         SELECT 1 FROM auth.users u WHERE u.id = (SELECT auth.uid())
           AND u.email_confirmed_at IS NOT NULL
           AND pg_catalog.lower(pg_catalog.btrim(u.email)) = rp.email
       ))
  )
$function$;

REVOKE ALL ON FUNCTION pan_access_private.matches_current_identity(uuid, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION pan_access_private.is_pan_readonly_user() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION pan_access_private.matches_current_identity(uuid, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION pan_access_private.is_pan_readonly_user() TO authenticated, service_role;

-- Existing standard users retain the reviewed predicate exactly; limited users can never be admins.
CREATE OR REPLACE FUNCTION public.is_allowed_user()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
  SELECT NOT pan_access_private.is_pan_readonly_user() AND EXISTS (
    SELECT 1 FROM public.allowed_users au
    JOIN auth.users u ON pg_catalog.lower(pg_catalog.btrim(u.email)) = pg_catalog.lower(pg_catalog.btrim(au.email))
    WHERE u.id = (SELECT auth.uid()) AND u.email_confirmed_at IS NOT NULL
  )
$function$;

-- Keep standard behavior. A restricted identity cannot gain other brands through extra links.
CREATE OR REPLACE FUNCTION public.user_has_brand_access(_brand_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.brand_users bu
    WHERE bu.brand_id = _brand_id
      AND pan_access_private.matches_current_identity(bu.user_id, bu.email)
      AND (
        (bu.access_mode = 'standard' AND NOT pan_access_private.is_pan_readonly_user())
        OR (bu.access_mode = 'pan_readonly' AND bu.brand_id IN (
          '2d249115-874e-40c6-aa58-9cf66f05c651'::uuid,
          '58721091-bc10-4a44-bd54-a8c1c3aafd5a'::uuid
        ) AND (bu.user_id IS NULL OR bu.user_id = (SELECT auth.uid())))
      )
  )
$function$;

REVOKE ALL ON FUNCTION public.is_allowed_user() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.user_has_brand_access(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_allowed_user() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.user_has_brand_access(uuid) TO authenticated, service_role;

-- This aggregate RPC was SECURITY DEFINER and bypassed table RLS, including the new restriction.
-- Preserve its current arguments, body and results for standard callers; do not change p_handle semantics.
ALTER FUNCTION public.apify_metrics_by_month(text, text) SECURITY INVOKER;
REVOKE ALL ON FUNCTION public.apify_metrics_by_month(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.apify_metrics_by_month(text, text) TO authenticated, service_role;

-- Deny raw universes even when an existing permissive policy says authenticated => true.
CREATE POLICY pan_readonly_raw_deny ON public.brand_metricool_cache AS RESTRICTIVE
FOR ALL TO authenticated
USING (NOT (SELECT pan_access_private.is_pan_readonly_user()))
WITH CHECK (NOT (SELECT pan_access_private.is_pan_readonly_user()));

CREATE POLICY pan_readonly_raw_deny ON public.influencer_posts AS RESTRICTIVE
FOR ALL TO authenticated
USING (NOT (SELECT pan_access_private.is_pan_readonly_user()))
WITH CHECK (NOT (SELECT pan_access_private.is_pan_readonly_user()));

CREATE POLICY pan_readonly_raw_deny ON public.apify_metrics AS RESTRICTIVE
FOR ALL TO authenticated
USING (NOT (SELECT pan_access_private.is_pan_readonly_user()))
WITH CHECK (NOT (SELECT pan_access_private.is_pan_readonly_user()));

-- No generic reports/PDFs for this new mode. Future exports must use the scoped server dataset.
CREATE POLICY pan_readonly_raw_deny ON public.brand_reports AS RESTRICTIVE
FOR ALL TO authenticated
USING (NOT (SELECT pan_access_private.is_pan_readonly_user()))
WITH CHECK (NOT (SELECT pan_access_private.is_pan_readonly_user()));

CREATE POLICY pan_readonly_storage_deny ON storage.objects AS RESTRICTIVE
FOR ALL TO authenticated
USING (NOT (SELECT pan_access_private.is_pan_readonly_user()))
WITH CHECK (NOT (SELECT pan_access_private.is_pan_readonly_user()));

-- Public brand-logo downloads remain public; listing/signing Storage resources is denied.
-- Keep only the restricted user's own P.A.N. link visible, not other accidental assignments.
CREATE POLICY pan_readonly_link_select ON public.brand_users AS RESTRICTIVE
FOR SELECT TO authenticated USING (
  NOT (SELECT pan_access_private.is_pan_readonly_user())
  OR (access_mode = 'pan_readonly'
      AND brand_id IN ('2d249115-874e-40c6-aa58-9cf66f05c651'::uuid, '58721091-bc10-4a44-bd54-a8c1c3aafd5a'::uuid)
      AND pan_access_private.matches_current_identity(user_id, email)
      AND (user_id IS NULL OR user_id = (SELECT auth.uid())))
);
CREATE POLICY pan_readonly_link_insert ON public.brand_users AS RESTRICTIVE
FOR INSERT TO authenticated WITH CHECK (NOT (SELECT pan_access_private.is_pan_readonly_user()));
CREATE POLICY pan_readonly_link_update ON public.brand_users AS RESTRICTIVE
FOR UPDATE TO authenticated
USING (NOT (SELECT pan_access_private.is_pan_readonly_user()))
WITH CHECK (NOT (SELECT pan_access_private.is_pan_readonly_user()));
CREATE POLICY pan_readonly_link_delete ON public.brand_users AS RESTRICTIVE
FOR DELETE TO authenticated USING (NOT (SELECT pan_access_private.is_pan_readonly_user()));

-- A safe no-argument context RPC for caller-scoped clients. A service-only client with no user JWT
-- intentionally receives none/false. This never accepts a user ID or a caller-supplied email.
CREATE FUNCTION pan_access_private.current_pan_access_context()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
  WITH access AS (
    SELECT pan_access_private.is_pan_readonly_user() AS restricted,
      public.is_allowed_user() AS admin,
      EXISTS (SELECT 1 FROM public.brand_users bu WHERE bu.access_mode = 'standard'
              AND pan_access_private.matches_current_identity(bu.user_id, bu.email)) AS standard_link,
      (public.user_has_brand_access('2d249115-874e-40c6-aa58-9cf66f05c651'::uuid)
       OR public.user_has_brand_access('58721091-bc10-4a44-bd54-a8c1c3aafd5a'::uuid)) AS pan,
      EXISTS (SELECT 1 FROM auth.users u WHERE u.id = (SELECT auth.uid())
              AND u.email_confirmed_at IS NOT NULL) AS confirmed
  )
  SELECT pg_catalog.jsonb_build_object(
    'access_mode', CASE WHEN restricted THEN 'pan_readonly'
                       WHEN confirmed AND (admin OR standard_link) THEN 'standard' ELSE 'none' END,
    'can_read_pan', confirmed AND (admin OR pan)
  ) FROM access
$function$;
REVOKE ALL ON FUNCTION pan_access_private.current_pan_access_context() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION pan_access_private.current_pan_access_context() TO authenticated, service_role;

CREATE FUNCTION public.get_pan_access_context()
RETURNS jsonb LANGUAGE sql STABLE SECURITY INVOKER SET search_path = '' AS $function$
  SELECT pan_access_private.current_pan_access_context()
$function$;
REVOKE ALL ON FUNCTION public.get_pan_access_context() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_pan_access_context() TO authenticated, service_role;

COMMENT ON COLUMN public.brand_users.access_mode IS
  'standard preserves existing access; pan_readonly is server-scoped PAN-only read access and denies raw datasets';
COMMENT ON FUNCTION public.get_pan_access_context() IS
  'Returns only the current authenticated identity access mode and whether it can read the scoped PAN endpoint';

-- Deliberately no assignment to Daniella. Account membership and invitation are separate approved actions.

-- Internal scheduler credential for brand-cache-refresh and vem-cache-refresh only.
-- The plaintext is generated inside PostgreSQL and stored only in Vault; only its SHA-256 digest is kept here.
CREATE TABLE pan_access_private.cron_refresh_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_name text NOT NULL UNIQUE,
  digest_hex text NOT NULL CHECK (digest_hex ~ '^[0-9a-f]{64}$'),
  targets text[] NOT NULL CHECK (targets <@ ARRAY['brand-cache-refresh','vem-cache-refresh']::text[] AND cardinality(targets) > 0),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE pan_access_private.cron_refresh_credentials ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE pan_access_private.cron_refresh_credentials FROM PUBLIC, anon, authenticated, service_role;

CREATE TABLE pan_access_private.cron_command_backups (
  jobid bigint NOT NULL,
  jobname text NOT NULL,
  schedule text NOT NULL,
  command text NOT NULL,
  captured_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (jobid, captured_at)
);
ALTER TABLE pan_access_private.cron_command_backups ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE pan_access_private.cron_command_backups FROM PUBLIC, anon, authenticated, service_role;

DO $credential$
DECLARE
  plain text := encode(extensions.gen_random_bytes(32), 'hex');
BEGIN
  IF EXISTS (SELECT 1 FROM vault.secrets WHERE name = 'pan_refresh_cron_token_v1') THEN
    RAISE EXCEPTION 'Refresh credential already exists; rotate through a separate approved action';
  END IF;
  PERFORM vault.create_secret(plain, 'pan_refresh_cron_token_v1', 'Scheduler credential for brand-cache-refresh and vem-cache-refresh');
  INSERT INTO pan_access_private.cron_refresh_credentials (vault_name, digest_hex, targets)
  VALUES ('pan_refresh_cron_token_v1', encode(extensions.digest(plain, 'sha256'), 'hex'),
          ARRAY['brand-cache-refresh','vem-cache-refresh']);
  plain := NULL;
END
$credential$;

CREATE FUNCTION pan_access_private.cron_refresh_digests(p_target text)
RETURNS SETOF text
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT c.digest_hex FROM pan_access_private.cron_refresh_credentials c
  WHERE c.active AND p_target IN ('brand-cache-refresh','vem-cache-refresh') AND p_target = ANY (c.targets)
$$;
REVOKE ALL ON FUNCTION pan_access_private.cron_refresh_digests(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION pan_access_private.cron_refresh_digests(text) TO service_role;

CREATE FUNCTION public.get_cron_refresh_digests(p_target text)
RETURNS SETOF text
LANGUAGE sql STABLE SECURITY INVOKER
SET search_path = ''
AS $$ SELECT pan_access_private.cron_refresh_digests(p_target) $$;
REVOKE ALL ON FUNCTION public.get_cron_refresh_digests(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_cron_refresh_digests(text) TO service_role;
COMMENT ON FUNCTION public.get_cron_refresh_digests(text) IS 'Service-role only: active SHA-256 digests of the scheduler credential for one refresh target';
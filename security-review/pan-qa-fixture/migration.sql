-- PROPOSAL ONLY. NOT APPLIED. Requires explicit owner approval before lov_database--migration.
-- One-shot QA fixture for a single PAN-readonly identity. No arbitrary email, brand or user-id inputs
-- except the caller UUID, which the edge function takes only from a verified JWT and SQL re-verifies.

DO $preflight$
BEGIN
  IF (SELECT count(*) FROM public.brands WHERE slug = 'harina-pan') <> 1 THEN
    RAISE EXCEPTION 'harina-pan brand identity is not unique';
  END IF;
  IF to_regclass('pan_access_private.restricted_principals') IS NULL
     OR to_regprocedure('pan_access_private.register_pan_readonly_principal()') IS NULL THEN
    RAISE EXCEPTION 'PAN restriction registry missing';
  END IF;
END
$preflight$;

-- Singleton run table: the CHECK + PK on a constant makes a second run impossible.
CREATE TABLE pan_access_private.qa_fixture_run (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  run_id uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  admin_user_id uuid NOT NULL,
  planned_user_id uuid NOT NULL UNIQUE,          -- Auth UUID fixed BEFORE the Auth user exists
  actual_user_id uuid UNIQUE,                   -- recorded ONLY after strict creation provenance checks
  email text NOT NULL UNIQUE CHECK (email ~ '^pan-qa-[0-9a-f]{16}@example\.invalid$'),
  brand_user_id uuid NOT NULL,
  state text NOT NULL CHECK (state IN ('marker_set','cleanup_pending','bound','revoked','closed')),
  banned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  create_deadline timestamptz NOT NULL DEFAULT now() + interval '10 minutes',
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE pan_access_private.qa_fixture_audit (
  id bigserial PRIMARY KEY,
  run_id uuid NOT NULL,
  event text NOT NULL,
  auth_user_id uuid,
  revoked_assignment jsonb,                      -- non-secret snapshot for reversible re-grant
  at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE pan_access_private.qa_fixture_run ENABLE ROW LEVEL SECURITY;
ALTER TABLE pan_access_private.qa_fixture_audit ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON pan_access_private.qa_fixture_run, pan_access_private.qa_fixture_audit
  FROM PUBLIC, anon, authenticated, service_role;
REVOKE ALL ON SEQUENCE pan_access_private.qa_fixture_audit_id_seq FROM PUBLIC, anon, authenticated, service_role;

CREATE FUNCTION pan_access_private.qa_is_standard_admin(p uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $f$
  SELECT EXISTS (
    SELECT 1 FROM auth.users u
    JOIN public.allowed_users a ON pg_catalog.lower(pg_catalog.btrim(a.email)) = pg_catalog.lower(pg_catalog.btrim(u.email))
    WHERE u.id = p AND u.email_confirmed_at IS NOT NULL
      AND (u.banned_until IS NULL OR u.banned_until <= now())
      AND NOT EXISTS (
        SELECT 1 FROM pan_access_private.restricted_principals rp
        WHERE rp.user_id = u.id OR rp.email = pg_catalog.lower(pg_catalog.btrim(u.email))
      )
  )
$f$;
REVOKE ALL ON FUNCTION pan_access_private.qa_is_standard_admin(uuid) FROM PUBLIC, anon, authenticated, service_role;

-- 1) BEGIN: generate email + UUID server-side, insert restriction marker (via existing trigger) BEFORE Auth exists.
CREATE FUNCTION public.pan_qa_begin(p_admin uuid)
RETURNS TABLE (run_id uuid, planned_user_id uuid, email text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $f$
DECLARE v_email text; v_uid uuid := gen_random_uuid(); v_bu uuid; v_brand uuid; v_run uuid;
BEGIN
  IF NOT pan_access_private.qa_is_standard_admin(p_admin) THEN RAISE EXCEPTION 'not_admin'; END IF;
  IF EXISTS (SELECT 1 FROM pan_access_private.qa_fixture_run) THEN RAISE EXCEPTION 'already_used'; END IF;
  v_email := 'pan-qa-' || encode(extensions.gen_random_bytes(8), 'hex') || '@example.invalid';
  IF EXISTS (SELECT 1 FROM auth.users WHERE id = v_uid OR pg_catalog.lower(auth.users.email) = v_email)
     OR EXISTS (SELECT 1 FROM public.brand_users b WHERE b.user_id = v_uid OR pg_catalog.lower(b.email) = v_email)
     OR EXISTS (SELECT 1 FROM pan_access_private.restricted_principals r WHERE r.user_id = v_uid OR r.email = v_email)
  THEN RAISE EXCEPTION 'collision'; END IF;
  SELECT id INTO STRICT v_brand FROM public.brands WHERE slug = 'harina-pan';
  INSERT INTO public.brand_users (brand_id, user_id, email, access_mode)
  VALUES (v_brand, v_uid, v_email, 'pan_readonly') RETURNING id INTO v_bu;   -- trigger: user + email markers
  IF NOT EXISTS (SELECT 1 FROM pan_access_private.restricted_principals r WHERE r.user_id = v_uid) THEN
    RAISE EXCEPTION 'marker_missing';
  END IF;
  INSERT INTO pan_access_private.qa_fixture_run (admin_user_id, planned_user_id, email, brand_user_id, state)
  VALUES (p_admin, v_uid, v_email, v_bu, 'marker_set') RETURNING qa_fixture_run.run_id INTO v_run;
  INSERT INTO pan_access_private.qa_fixture_audit (run_id, event, auth_user_id) VALUES (v_run, 'marker_set', v_uid);
  RETURN QUERY SELECT v_run, v_uid, v_email;
END $f$;

-- Record only the account returned by this run's official createUser call.
-- Metadata is server-set app_metadata, never user-editable user_metadata. This also permits
-- recovery if the API unexpectedly returns a different UUID; that identity never gains a PAN grant.
CREATE FUNCTION public.pan_qa_record_created(p_admin uuid, p_run uuid, p_created uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $f$
DECLARE r pan_access_private.qa_fixture_run;
BEGIN
  IF NOT pan_access_private.qa_is_standard_admin(p_admin) THEN RAISE EXCEPTION 'not_admin'; END IF;
  SELECT * INTO r FROM pan_access_private.qa_fixture_run WHERE run_id = p_run FOR UPDATE;
  IF NOT FOUND OR r.admin_user_id <> p_admin OR r.state NOT IN ('marker_set','cleanup_pending','bound')
     OR (r.actual_user_id IS NOT NULL AND r.actual_user_id <> p_created) THEN RAISE EXCEPTION 'bad_state'; END IF;
  IF NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = p_created
      AND pg_catalog.lower(u.email) = r.email AND u.created_at >= r.created_at
      AND u.raw_app_meta_data->>'pan_qa_run_id' = r.run_id::text) THEN
    RAISE EXCEPTION 'creation_provenance_mismatch';
  END IF;
  INSERT INTO pan_access_private.restricted_principals (subject_key, user_id)
  VALUES ('user:' || p_created::text, p_created) ON CONFLICT DO NOTHING;
  UPDATE pan_access_private.qa_fixture_run SET actual_user_id = p_created,
    state = CASE WHEN state = 'bound' THEN 'bound' ELSE 'cleanup_pending' END, updated_at = now()
  WHERE run_id = p_run;
  INSERT INTO pan_access_private.qa_fixture_audit (run_id, event, auth_user_id)
  VALUES (p_run, 'created_identity_recorded', p_created);
  RETURN 'recorded';
END $f$;

-- 2) CONFIRM: Auth user must have exactly the planned UUID + email and be created after the run began.
CREATE FUNCTION public.pan_qa_confirm(p_admin uuid, p_run uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $f$
DECLARE r pan_access_private.qa_fixture_run;
BEGIN
  IF NOT pan_access_private.qa_is_standard_admin(p_admin) THEN RAISE EXCEPTION 'not_admin'; END IF;
  SELECT * INTO r FROM pan_access_private.qa_fixture_run WHERE run_id = p_run FOR UPDATE;
  IF NOT FOUND OR r.admin_user_id <> p_admin OR r.state <> 'cleanup_pending'
     OR r.actual_user_id IS DISTINCT FROM r.planned_user_id THEN RAISE EXCEPTION 'bad_state'; END IF;
  IF now() > r.create_deadline THEN RAISE EXCEPTION 'deadline'; END IF;
  IF NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = r.planned_user_id
                 AND pg_catalog.lower(u.email) = r.email AND u.created_at >= r.created_at
                 AND u.email_confirmed_at IS NOT NULL
                 AND u.raw_app_meta_data->>'pan_qa_run_id' = r.run_id::text) THEN
    RAISE EXCEPTION 'auth_mismatch';
  END IF;
  UPDATE pan_access_private.qa_fixture_run SET state = 'bound', updated_at = now() WHERE run_id = p_run;
  INSERT INTO pan_access_private.qa_fixture_audit (run_id, event, auth_user_id) VALUES (p_run, 'bound', r.planned_user_id);
  RETURN 'bound';
END $f$;

-- 3) MARK BANNED (called only after GoTrue ban succeeded for the recorded actual_user_id).
CREATE FUNCTION public.pan_qa_mark_banned(p_admin uuid, p_run uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $f$
DECLARE r pan_access_private.qa_fixture_run;
BEGIN
  IF NOT pan_access_private.qa_is_standard_admin(p_admin) THEN RAISE EXCEPTION 'not_admin'; END IF;
  SELECT * INTO r FROM pan_access_private.qa_fixture_run WHERE run_id = p_run FOR UPDATE;
  IF NOT FOUND OR r.admin_user_id <> p_admin OR r.state = 'closed' OR r.actual_user_id IS NULL THEN RAISE EXCEPTION 'bad_state'; END IF;
  IF NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = r.actual_user_id AND u.banned_until > now()) THEN
    RAISE EXCEPTION 'not_banned';
  END IF;
  UPDATE pan_access_private.qa_fixture_run SET banned = true, updated_at = now() WHERE run_id = p_run;
  INSERT INTO pan_access_private.qa_fixture_audit (run_id, event, auth_user_id) VALUES (p_run, 'banned', r.actual_user_id);
  RETURN 'banned';
END $f$;

-- 4) REVOKE: removes ONLY this run's brand_users row; markers stay; snapshot kept for reversible re-grant.
CREATE FUNCTION public.pan_qa_revoke(p_admin uuid, p_run uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $f$
DECLARE r pan_access_private.qa_fixture_run; snap jsonb; n integer;
BEGIN
  IF NOT pan_access_private.qa_is_standard_admin(p_admin) THEN RAISE EXCEPTION 'not_admin'; END IF;
  SELECT * INTO r FROM pan_access_private.qa_fixture_run WHERE run_id = p_run FOR UPDATE;
  IF NOT FOUND OR r.admin_user_id <> p_admin OR r.state = 'closed' THEN RAISE EXCEPTION 'bad_state'; END IF;
  SELECT to_jsonb(b) - 'created_at' INTO snap FROM public.brand_users b
   WHERE b.id = r.brand_user_id AND b.user_id = r.planned_user_id AND b.access_mode = 'pan_readonly';
  DELETE FROM public.brand_users b
   WHERE b.id = r.brand_user_id AND b.user_id = r.planned_user_id AND b.access_mode = 'pan_readonly';
  GET DIAGNOSTICS n = ROW_COUNT;
  UPDATE pan_access_private.qa_fixture_run SET state = CASE WHEN banned OR (actual_user_id IS NULL AND NOT EXISTS (SELECT 1 FROM auth.users u WHERE pg_catalog.lower(u.email) = r.email)) THEN 'revoked' ELSE 'cleanup_pending' END, updated_at = now() WHERE run_id = p_run;
  INSERT INTO pan_access_private.qa_fixture_audit (run_id, event, auth_user_id, revoked_assignment)
  VALUES (p_run, 'revoked', r.planned_user_id, snap);
  RETURN n;
END $f$;

-- 5) CLOSE: permanent tombstone; requires revoked and verified ban if an Auth identity exists.
CREATE FUNCTION public.pan_qa_close(p_admin uuid, p_run uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $f$
DECLARE r pan_access_private.qa_fixture_run;
BEGIN
  IF NOT pan_access_private.qa_is_standard_admin(p_admin) THEN RAISE EXCEPTION 'not_admin'; END IF;
  SELECT * INTO r FROM pan_access_private.qa_fixture_run WHERE run_id = p_run FOR UPDATE;
  IF NOT FOUND OR r.admin_user_id <> p_admin OR r.state <> 'revoked' THEN
    RAISE EXCEPTION 'not_closable';
  END IF;
  IF EXISTS (SELECT 1 FROM public.brand_users b WHERE b.id = r.brand_user_id) THEN RAISE EXCEPTION 'grant_remains'; END IF;
  IF r.actual_user_id IS NOT NULL THEN
    IF NOT r.banned OR NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = r.actual_user_id AND u.banned_until > now()) THEN
      RAISE EXCEPTION 'ban_not_verified';
    END IF;
  ELSIF EXISTS (SELECT 1 FROM auth.users u WHERE pg_catalog.lower(u.email) = r.email) THEN
    RAISE EXCEPTION 'untracked_auth_identity';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pan_access_private.restricted_principals rp WHERE rp.user_id = r.planned_user_id)
     OR (r.actual_user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM pan_access_private.restricted_principals rp WHERE rp.user_id = r.actual_user_id)) THEN
    RAISE EXCEPTION 'restriction_missing';
  END IF;
  UPDATE pan_access_private.qa_fixture_run SET state = 'closed', updated_at = now() WHERE run_id = p_run;
  INSERT INTO pan_access_private.qa_fixture_audit (run_id, event, auth_user_id) VALUES (p_run, 'closed', r.planned_user_id);
  RETURN 'closed';
END $f$;

-- Owner-scoped status; an exact app-metadata candidate supports recovery after a lost API response.
-- No secrets or unrelated identities are returned. A non-owner cannot inspect or disable this run.
CREATE FUNCTION public.pan_qa_status(p_admin uuid)
RETURNS TABLE (run_id uuid, admin_user_id uuid, planned_user_id uuid, actual_user_id uuid,
  candidate_user_id uuid, auth_user_present boolean, email text, state text, banned boolean)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $f$
BEGIN
  IF NOT pan_access_private.qa_is_standard_admin(p_admin) THEN RAISE EXCEPTION 'not_admin'; END IF;
  IF EXISTS (SELECT 1 FROM pan_access_private.qa_fixture_run r WHERE r.admin_user_id <> p_admin) THEN
    RAISE EXCEPTION 'not_run_owner';
  END IF;
  RETURN QUERY SELECT r.run_id, r.admin_user_id, r.planned_user_id, r.actual_user_id,
    (SELECT u.id FROM auth.users u WHERE pg_catalog.lower(u.email) = r.email
       AND u.created_at >= r.created_at AND u.raw_app_meta_data->>'pan_qa_run_id' = r.run_id::text),
    EXISTS (SELECT 1 FROM auth.users u WHERE pg_catalog.lower(u.email) = r.email),
    r.email, r.state, r.banned FROM pan_access_private.qa_fixture_run r WHERE r.admin_user_id = p_admin;
END $f$;

DO $grants$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['public.pan_qa_begin(uuid)','public.pan_qa_record_created(uuid,uuid,uuid)','public.pan_qa_confirm(uuid,uuid)',
    'public.pan_qa_mark_banned(uuid,uuid)','public.pan_qa_revoke(uuid,uuid)',
    'public.pan_qa_close(uuid,uuid)','public.pan_qa_status(uuid)'] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', f);
  END LOOP;
END $grants$;

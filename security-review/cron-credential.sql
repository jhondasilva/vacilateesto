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

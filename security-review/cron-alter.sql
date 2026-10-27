DO $alter$
DECLARE
  j record;
  new_cmd text;
  frag constant text := ' || jsonb_build_object(''x-cron-token'', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = ''pan_refresh_cron_token_v1''))';
  expected constant jsonb := '{"2":["brand-cache-refresh-daily","0 10 * * *","/functions/v1/brand-cache-refresh"],"4":["vem-cache-refresh-daily","0 6 * * *","/functions/v1/vem-cache-refresh"]}';
  n int;
  m text[];
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pan_access_private.cron_refresh_credentials WHERE vault_name = 'pan_refresh_cron_token_v1' AND active) THEN
    RAISE EXCEPTION 'Credential missing';
  END IF;
  FOR j IN SELECT jobid, jobname, schedule, command, active FROM cron.job WHERE jobid IN (2, 4) ORDER BY jobid LOOP
    IF j.jobname <> expected->(j.jobid::text)->>0 OR j.schedule <> expected->(j.jobid::text)->>1
       OR position(expected->(j.jobid::text)->>2 IN j.command) = 0 OR NOT j.active THEN
      RAISE EXCEPTION 'Job % does not match the reviewed identity', j.jobid;
    END IF;
    IF position('x-cron-token' IN j.command) > 0 OR position('Authorization' IN j.command) > 0 THEN
      RAISE EXCEPTION 'Job % already carries authentication', j.jobid;
    END IF;
    SELECT count(*) INTO n FROM regexp_matches(j.command, 'headers\s*:=', 'g');
    IF n <> 1 THEN RAISE EXCEPTION 'Job % has unexpected header shape', j.jobid; END IF;
    m := regexp_match(j.command, '^(.*headers\s*:=\s*)(.*?)(,\s*body\s*:=.*)$');
    IF m IS NULL OR m[2] !~ '^(jsonb_build_object\(|''\{)' THEN RAISE EXCEPTION 'Job % header expression not recognised', j.jobid; END IF;
    new_cmd := m[1] || '(' || m[2] || ')' || frag || m[3];
    IF m[1] || m[2] || m[3] <> j.command OR length(new_cmd) <> length(j.command) + length(frag) + 2 THEN
      RAISE EXCEPTION 'Job % transformation is not the exact expected change', j.jobid;
    END IF;
    INSERT INTO pan_access_private.cron_command_backups (jobid, jobname, schedule, command)
    VALUES (j.jobid, j.jobname, j.schedule, j.command);
    PERFORM cron.alter_job(job_id := j.jobid, command := new_cmd);
  END LOOP;
  SELECT count(*) INTO n FROM cron.job
  WHERE jobid IN (2, 4) AND active AND position('x-cron-token' IN command) > 0
    AND ((jobid = 2 AND schedule = '0 10 * * *') OR (jobid = 4 AND schedule = '0 6 * * *'));
  IF n <> 2 THEN RAISE EXCEPTION 'Postcheck failed'; END IF;
END
$alter$;

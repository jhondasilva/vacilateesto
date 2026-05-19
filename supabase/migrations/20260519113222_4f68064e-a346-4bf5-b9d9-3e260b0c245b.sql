ALTER TABLE public.yt_ingest_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view ingest log"
  ON public.yt_ingest_log
  FOR SELECT
  TO authenticated
  USING (public.is_allowed_user());

CREATE INDEX IF NOT EXISTS idx_yt_ingest_log_created_at
  ON public.yt_ingest_log (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_yt_ingest_log_status
  ON public.yt_ingest_log (status);
CREATE TABLE public.apify_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  metric_type text NOT NULL,
  external_id text,
  value bigint,
  unit text,
  recorded_at timestamp with time zone,
  raw_data jsonb,
  created_at timestamp with time zone DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.apify_metrics TO authenticated;
GRANT ALL ON public.apify_metrics TO service_role;

ALTER TABLE public.apify_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read apify metrics"
ON public.apify_metrics
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert apify metrics"
ON public.apify_metrics
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update apify metrics"
ON public.apify_metrics
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Users can delete apify metrics"
ON public.apify_metrics
FOR DELETE
TO authenticated
USING (true);
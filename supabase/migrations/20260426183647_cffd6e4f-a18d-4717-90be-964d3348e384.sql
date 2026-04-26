ALTER TABLE public.trip_activities
  ADD COLUMN IF NOT EXISTS cost_justification text,
  ADD COLUMN IF NOT EXISTS cost_estimate_usd numeric;
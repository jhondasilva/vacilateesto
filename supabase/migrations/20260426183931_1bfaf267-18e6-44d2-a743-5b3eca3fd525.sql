ALTER TABLE public.trip_activities
  ADD COLUMN IF NOT EXISTS cost_breakdown jsonb;
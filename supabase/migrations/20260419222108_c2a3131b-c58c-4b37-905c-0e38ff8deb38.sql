ALTER TABLE public.trip_cities 
  ADD COLUMN IF NOT EXISTS booking_url text,
  ADD COLUMN IF NOT EXISTS nightly_rate_usd numeric;
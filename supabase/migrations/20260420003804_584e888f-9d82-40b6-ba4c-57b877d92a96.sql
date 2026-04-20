ALTER TABLE public.trip_cities
  ADD COLUMN IF NOT EXISTS distance_to_stadium_km numeric,
  ADD COLUMN IF NOT EXISTS distance_to_airport_km numeric;
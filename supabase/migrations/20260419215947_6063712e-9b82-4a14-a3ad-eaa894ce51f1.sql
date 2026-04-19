
-- Enriquecer trip_cities con info de hospedaje
ALTER TABLE public.trip_cities
  ADD COLUMN IF NOT EXISTS nights integer,
  ADD COLUMN IF NOT EXISTS hotel_cost_usd numeric,
  ADD COLUMN IF NOT EXISTS hotel_price_range text;

-- Enriquecer trip_activities con info de vuelos/costos
ALTER TABLE public.trip_activities
  ADD COLUMN IF NOT EXISTS cost_usd numeric,
  ADD COLUMN IF NOT EXISTS airline text,
  ADD COLUMN IF NOT EXISTS flight_number text,
  ADD COLUMN IF NOT EXISTS departure_time text,
  ADD COLUMN IF NOT EXISTS arrival_time text,
  ADD COLUMN IF NOT EXISTS duration text,
  ADD COLUMN IF NOT EXISTS cabin_class text;

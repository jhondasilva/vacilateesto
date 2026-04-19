
CREATE TABLE IF NOT EXISTS public.trip_sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  amount_usd_bcv numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'committed',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.trip_sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allowed users can view sponsors"
ON public.trip_sponsors FOR SELECT TO authenticated USING (is_allowed_user());

CREATE POLICY "Allowed users can insert sponsors"
ON public.trip_sponsors FOR INSERT TO authenticated WITH CHECK (is_allowed_user());

CREATE POLICY "Allowed users can update sponsors"
ON public.trip_sponsors FOR UPDATE TO authenticated USING (is_allowed_user());

CREATE POLICY "Allowed users can delete sponsors"
ON public.trip_sponsors FOR DELETE TO authenticated USING (is_allowed_user());

CREATE TRIGGER update_trip_sponsors_updated_at
BEFORE UPDATE ON public.trip_sponsors
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tabla 1-fila para guardar config (tipo de cambio BCV→USD real)
CREATE TABLE IF NOT EXISTS public.trip_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bcv_to_usd_rate numeric NOT NULL DEFAULT 0.60,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.trip_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allowed users can view settings"
ON public.trip_settings FOR SELECT TO authenticated USING (is_allowed_user());

CREATE POLICY "Allowed users can insert settings"
ON public.trip_settings FOR INSERT TO authenticated WITH CHECK (is_allowed_user());

CREATE POLICY "Allowed users can update settings"
ON public.trip_settings FOR UPDATE TO authenticated USING (is_allowed_user());

INSERT INTO public.trip_settings (bcv_to_usd_rate) VALUES (0.60);

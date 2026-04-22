CREATE TABLE public.calendar_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Vacílate El Mundial',
  color TEXT NOT NULL DEFAULT '#E91E63',
  description TEXT NOT NULL DEFAULT 'Gira Vacílate El Mundial 2026 — Feed en vivo',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  singleton BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT calendar_settings_singleton_unique UNIQUE (singleton)
);

ALTER TABLE public.calendar_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allowed users can view calendar settings"
  ON public.calendar_settings FOR SELECT TO authenticated
  USING (public.is_allowed_user());

CREATE POLICY "Allowed users can update calendar settings"
  ON public.calendar_settings FOR UPDATE TO authenticated
  USING (public.is_allowed_user());

CREATE POLICY "Allowed users can insert calendar settings"
  ON public.calendar_settings FOR INSERT TO authenticated
  WITH CHECK (public.is_allowed_user());

CREATE TRIGGER update_calendar_settings_updated_at
  BEFORE UPDATE ON public.calendar_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.calendar_settings (name, color, description) VALUES
  ('Vacílate El Mundial', '#E91E63', 'Gira Vacílate El Mundial 2026 — Feed en vivo');
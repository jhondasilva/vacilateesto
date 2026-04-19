-- Whitelist de usuarios autorizados (solo Juan y Jhon)
CREATE TABLE public.allowed_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.allowed_users (email, display_name) VALUES
  ('jhondasilva@gmail.com', 'Jhon'),
  ('juancmartinez@gmail.com', 'Juan');

ALTER TABLE public.allowed_users ENABLE ROW LEVEL SECURITY;

-- Función security definer para chequear si el usuario actual está en whitelist
CREATE OR REPLACE FUNCTION public.is_allowed_user()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.allowed_users au
    JOIN auth.users u ON u.email = au.email
    WHERE u.id = auth.uid()
  )
$$;

CREATE POLICY "Allowed users can view whitelist"
  ON public.allowed_users FOR SELECT
  TO authenticated
  USING (public.is_allowed_user());

-- Trigger genérico para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Tabla de ciudades (cada parada del viaje)
CREATE TABLE public.trip_cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city TEXT NOT NULL,
  country TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  position INTEGER NOT NULL,
  accommodation_name TEXT,
  accommodation_address TEXT,
  accommodation_status TEXT NOT NULL DEFAULT 'pending',
  accommodation_notes TEXT,
  vibe TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.trip_cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allowed users can view cities"
  ON public.trip_cities FOR SELECT TO authenticated
  USING (public.is_allowed_user());
CREATE POLICY "Allowed users can insert cities"
  ON public.trip_cities FOR INSERT TO authenticated
  WITH CHECK (public.is_allowed_user());
CREATE POLICY "Allowed users can update cities"
  ON public.trip_cities FOR UPDATE TO authenticated
  USING (public.is_allowed_user());
CREATE POLICY "Allowed users can delete cities"
  ON public.trip_cities FOR DELETE TO authenticated
  USING (public.is_allowed_user());

CREATE TRIGGER update_trip_cities_updated_at
  BEFORE UPDATE ON public.trip_cities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Actividades (vuelos, partidos, comidas, producción, hitos)
CREATE TABLE public.trip_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city_id UUID NOT NULL REFERENCES public.trip_cities(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  activity_date DATE,
  activity_time TEXT,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  metadata JSONB DEFAULT '{}'::jsonb,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.trip_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allowed users can view activities"
  ON public.trip_activities FOR SELECT TO authenticated
  USING (public.is_allowed_user());
CREATE POLICY "Allowed users can insert activities"
  ON public.trip_activities FOR INSERT TO authenticated
  WITH CHECK (public.is_allowed_user());
CREATE POLICY "Allowed users can update activities"
  ON public.trip_activities FOR UPDATE TO authenticated
  USING (public.is_allowed_user());
CREATE POLICY "Allowed users can delete activities"
  ON public.trip_activities FOR DELETE TO authenticated
  USING (public.is_allowed_user());

CREATE TRIGGER update_trip_activities_updated_at
  BEFORE UPDATE ON public.trip_activities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_trip_activities_city ON public.trip_activities(city_id);

-- Comentarios entre Juan y Jhon
CREATE TABLE public.trip_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  author_email TEXT NOT NULL,
  author_name TEXT,
  city_id UUID REFERENCES public.trip_cities(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES public.trip_activities(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.trip_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allowed users can view comments"
  ON public.trip_comments FOR SELECT TO authenticated
  USING (public.is_allowed_user());
CREATE POLICY "Allowed users can insert own comments"
  ON public.trip_comments FOR INSERT TO authenticated
  WITH CHECK (public.is_allowed_user() AND auth.uid() = user_id);
CREATE POLICY "Allowed users can delete own comments"
  ON public.trip_comments FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_trip_comments_city ON public.trip_comments(city_id);
CREATE INDEX idx_trip_comments_activity ON public.trip_comments(activity_id);

-- Precarga de las ciudades del viaje (basado en el PDF)
INSERT INTO public.trip_cities (city, country, start_date, end_date, position, accommodation_name, accommodation_status, vibe) VALUES
  ('Ciudad de México', 'México', '2026-06-09', '2026-06-11', 1, 'Casa de Titi', 'confirmed', 'Inicio de cobertura • Inauguración'),
  ('New York', 'USA', '2026-06-12', '2026-06-13', 2, 'Pod Times Square', 'pending', 'Producción en Manhattan'),
  ('Atlanta', 'USA', '2026-06-14', '2026-06-14', 3, NULL, 'pending', 'Traslado técnico'),
  ('Austin', 'USA', '2026-06-15', '2026-06-15', 4, 'Hotel ARRIVE', 'pending', 'España vs Cabo Verde'),
  ('Houston', 'USA', '2026-06-16', '2026-06-18', 5, 'Hotel ZaZa Museum District', 'pending', 'Portugal • Ruta BBQ'),
  ('Cannes', 'Francia', '2026-06-19', '2026-06-26', 6, 'Hôtel Martínez (Jhon) / Airbnb (Juan)', 'pending', 'Cannes Lions Jury & Networking'),
  ('Miami', 'USA', '2026-06-26', '2026-07-01', 7, 'Wingate by Wyndham Miami Airport', 'pending', 'Portugal vs Colombia • Grabación podcasts'),
  ('Boston', 'USA', '2026-07-07', '2026-07-09', 8, NULL, 'pending', 'Cuartos de Final'),
  ('Miami', 'USA', '2026-07-10', '2026-07-11', 9, NULL, 'pending', 'Cuartos de Final'),
  ('Dallas', 'USA', '2026-07-12', '2026-07-14', 10, NULL, 'pending', 'Semifinal'),
  ('Atlanta', 'USA', '2026-07-15', '2026-07-16', 11, NULL, 'pending', 'Semifinal • Instalación Set Final'),
  ('New York', 'USA', '2026-07-17', '2026-07-19', 12, NULL, 'pending', 'Cultura Pop • LA GRAN FINAL'),
  ('Caracas', 'Venezuela', '2026-07-20', '2026-07-20', 13, NULL, 'pending', 'Retorno a casa');
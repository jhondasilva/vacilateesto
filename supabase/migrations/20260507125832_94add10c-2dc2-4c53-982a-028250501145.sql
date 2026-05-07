
-- Tablas
CREATE TABLE public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  logo_url text,
  brand_color text DEFAULT '#E91E63',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.brand_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  email text NOT NULL,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(brand_id, user_id)
);

CREATE INDEX idx_brand_users_user ON public.brand_users(user_id);
CREATE INDEX idx_brand_users_email ON public.brand_users(lower(email));

CREATE TABLE public.brand_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  title text NOT NULL,
  period_label text NOT NULL,
  period_start date,
  period_end date,
  summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  platforms jsonb NOT NULL DEFAULT '[]'::jsonb,
  top_posts jsonb NOT NULL DEFAULT '[]'::jsonb,
  pdf_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_brand_reports_brand ON public.brand_reports(brand_id, period_end DESC);

-- Helper security definer
CREATE OR REPLACE FUNCTION public.user_has_brand_access(_brand_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.brand_users
    WHERE brand_id = _brand_id AND user_id = auth.uid()
  )
$$;

-- RLS
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brands are viewable by their users"
  ON public.brands FOR SELECT TO authenticated
  USING (public.user_has_brand_access(id));

CREATE POLICY "Users can view their own brand link"
  ON public.brand_users FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view reports for their brands"
  ON public.brand_reports FOR SELECT TO authenticated
  USING (public.user_has_brand_access(brand_id));

-- Trigger updated_at
CREATE TRIGGER brands_set_updated BEFORE UPDATE ON public.brands
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER brand_reports_set_updated BEFORE UPDATE ON public.brand_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket privado para PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('brand-reports', 'brand-reports', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: solo usuarios vinculados a la marca (carpeta = brand_id) pueden leer
CREATE POLICY "Brand users can read their report PDFs"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'brand-reports'
    AND public.user_has_brand_access(((storage.foldername(name))[1])::uuid)
  );

-- Seed Coca-Cola
INSERT INTO public.brands (slug, name, brand_color)
VALUES ('coca-cola', 'Coca-Cola', '#F40009');

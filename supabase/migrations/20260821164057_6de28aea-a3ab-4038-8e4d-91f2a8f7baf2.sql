INSERT INTO public.brands (slug, name, brand_color)
VALUES ('podcast-en-la-cumbre', 'Podcast en la Cumbre', '#0EA5E9')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
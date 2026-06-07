
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  h1 text NOT NULL,
  description text NOT NULL,
  keywords text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Podcast',
  tags text[] NOT NULL DEFAULT '{}',
  hero_image text,
  body_md text NOT NULL,
  faq jsonb NOT NULL DEFAULT '[]'::jsonb,
  source_video_ids text[] NOT NULL DEFAULT '{}',
  theme_key text,
  reading_minutes integer NOT NULL DEFAULT 6,
  status text NOT NULL DEFAULT 'published',
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published posts"
  ON public.blog_posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admins can read all posts"
  ON public.blog_posts FOR SELECT
  TO authenticated
  USING (is_allowed_user());

CREATE POLICY "Admins can insert posts"
  ON public.blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (is_allowed_user());

CREATE POLICY "Admins can update posts"
  ON public.blog_posts FOR UPDATE
  TO authenticated
  USING (is_allowed_user())
  WITH CHECK (is_allowed_user());

CREATE POLICY "Admins can delete posts"
  ON public.blog_posts FOR DELETE
  TO authenticated
  USING (is_allowed_user());

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX blog_posts_published_at_idx ON public.blog_posts (published_at DESC);
CREATE INDEX blog_posts_status_idx ON public.blog_posts (status);

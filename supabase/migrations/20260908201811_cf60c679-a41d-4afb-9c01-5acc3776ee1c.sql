CREATE TABLE public.influencer_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_slug text NOT NULL DEFAULT 'pelotica-de-goma',
  platform text NOT NULL,
  external_id text NOT NULL,
  author_handle text,
  author_name text,
  author_followers integer,
  url text,
  text text,
  thumbnail text,
  published_at timestamptz,
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  comments integer DEFAULT 0,
  shares integer DEFAULT 0,
  hashtags text[] DEFAULT '{}',
  synced_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (campaign_slug, platform, external_id)
);

GRANT SELECT ON public.influencer_posts TO authenticated;
GRANT ALL ON public.influencer_posts TO service_role;

ALTER TABLE public.influencer_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view influencer posts"
ON public.influencer_posts FOR SELECT TO authenticated USING (true);

CREATE INDEX idx_influencer_posts_campaign_date ON public.influencer_posts (campaign_slug, published_at DESC);
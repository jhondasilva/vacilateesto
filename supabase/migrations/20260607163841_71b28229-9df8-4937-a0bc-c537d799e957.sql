
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS tl_dr text,
  ADD COLUMN IF NOT EXISTS speakable_summary text;

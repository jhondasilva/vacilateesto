-- Add tsvector column for Spanish full-text search
ALTER TABLE public.yt_transcript_chunks
  ADD COLUMN IF NOT EXISTS text_tsv tsvector
  GENERATED ALWAYS AS (to_tsvector('spanish', coalesce(text, ''))) STORED;

-- GIN index for fast FTS
CREATE INDEX IF NOT EXISTS yt_transcript_chunks_text_tsv_idx
  ON public.yt_transcript_chunks USING GIN (text_tsv);

-- New search function: full-text + ts_rank
CREATE OR REPLACE FUNCTION public.yt_search_chunks_fts(
  query_text text,
  filter_kind text DEFAULT NULL,
  match_count int DEFAULT 30
)
RETURNS TABLE (
  chunk_id uuid,
  video_id text,
  start_seconds numeric,
  end_seconds numeric,
  text text,
  title text,
  thumbnail_url text,
  published_at timestamptz,
  kind text,
  rank real
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.id        AS chunk_id,
    c.video_id,
    c.start_seconds,
    c.end_seconds,
    c.text,
    v.title,
    v.thumbnail_url,
    v.published_at,
    v.kind,
    ts_rank(c.text_tsv, plainto_tsquery('spanish', query_text)) AS rank
  FROM public.yt_transcript_chunks c
  JOIN public.yt_videos v ON v.video_id = c.video_id
  WHERE c.text_tsv @@ plainto_tsquery('spanish', query_text)
    AND (filter_kind IS NULL OR v.kind = filter_kind)
  ORDER BY rank DESC, v.published_at DESC NULLS LAST
  LIMIT match_count;
$$;
-- Enable pgvector for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Catalog of YouTube videos (podcasts + shorts)
CREATE TABLE public.yt_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  published_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  thumbnail_url TEXT,
  kind TEXT NOT NULL CHECK (kind IN ('podcast', 'short')),
  view_count BIGINT DEFAULT 0,
  transcript_hash TEXT,
  indexed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_yt_videos_kind ON public.yt_videos(kind);
CREATE INDEX idx_yt_videos_published ON public.yt_videos(published_at DESC);

-- Transcript chunks with embeddings
CREATE TABLE public.yt_transcript_chunks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id TEXT NOT NULL REFERENCES public.yt_videos(video_id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  start_seconds NUMERIC NOT NULL,
  end_seconds NUMERIC NOT NULL,
  text TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(video_id, chunk_index)
);

CREATE INDEX idx_yt_chunks_video ON public.yt_transcript_chunks(video_id);
CREATE INDEX idx_yt_chunks_embedding ON public.yt_transcript_chunks
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Ingest log for retries and diagnostics
CREATE TABLE public.yt_ingest_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id TEXT,
  status TEXT NOT NULL,
  message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_yt_ingest_log_video ON public.yt_ingest_log(video_id);
CREATE INDEX idx_yt_ingest_log_status ON public.yt_ingest_log(status);

-- Updated-at trigger for yt_videos
CREATE TRIGGER update_yt_videos_updated_at
BEFORE UPDATE ON public.yt_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.yt_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yt_transcript_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yt_ingest_log ENABLE ROW LEVEL SECURITY;

-- Public read access (content is public on YouTube)
CREATE POLICY "Anyone can view videos"
  ON public.yt_videos FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view chunks"
  ON public.yt_transcript_chunks FOR SELECT
  USING (true);

-- No public write policies — only service role (used by edge functions) can write,
-- and service role bypasses RLS automatically.

-- Semantic search function
CREATE OR REPLACE FUNCTION public.yt_search_chunks(
  query_embedding vector(1536),
  match_count INTEGER DEFAULT 10,
  filter_kind TEXT DEFAULT NULL
)
RETURNS TABLE (
  chunk_id UUID,
  video_id TEXT,
  title TEXT,
  kind TEXT,
  thumbnail_url TEXT,
  published_at TIMESTAMPTZ,
  start_seconds NUMERIC,
  end_seconds NUMERIC,
  text TEXT,
  similarity FLOAT
)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT
    c.id AS chunk_id,
    c.video_id,
    v.title,
    v.kind,
    v.thumbnail_url,
    v.published_at,
    c.start_seconds,
    c.end_seconds,
    c.text,
    1 - (c.embedding <=> query_embedding) AS similarity
  FROM public.yt_transcript_chunks c
  JOIN public.yt_videos v ON v.video_id = c.video_id
  WHERE c.embedding IS NOT NULL
    AND (filter_kind IS NULL OR v.kind = filter_kind)
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
$$;
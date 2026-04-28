CREATE OR REPLACE FUNCTION public.yt_search_chunks_grouped(
  query_text text,
  filter_kind text DEFAULT NULL,
  match_count integer DEFAULT 30,
  per_video_limit integer DEFAULT 8
)
RETURNS TABLE(
  video_id text,
  title text,
  kind text,
  thumbnail_url text,
  published_at timestamp with time zone,
  best_rank real,
  match_count_total integer,
  chunks jsonb
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH q AS (
    SELECT plainto_tsquery('spanish', query_text) AS tsq
  ),
  matches AS (
    SELECT
      c.id           AS chunk_id,
      c.video_id,
      c.start_seconds,
      c.end_seconds,
      c.text,
      ts_rank(c.text_tsv, (SELECT tsq FROM q)) AS rank,
      v.title,
      v.kind,
      v.thumbnail_url,
      v.published_at
    FROM public.yt_transcript_chunks c
    JOIN public.yt_videos v ON v.video_id = c.video_id
    WHERE c.text_tsv @@ (SELECT tsq FROM q)
      AND (filter_kind IS NULL OR v.kind = filter_kind)
  ),
  ranked AS (
    SELECT
      m.*,
      ROW_NUMBER() OVER (PARTITION BY m.video_id ORDER BY m.rank DESC, m.start_seconds ASC) AS rn
    FROM matches m
  ),
  top_per_video AS (
    SELECT * FROM ranked WHERE rn <= per_video_limit
  ),
  agg AS (
    SELECT
      r.video_id,
      MAX(r.title)         AS title,
      MAX(r.kind)          AS kind,
      MAX(r.thumbnail_url) AS thumbnail_url,
      MAX(r.published_at)  AS published_at,
      MAX(r.rank)          AS best_rank,
      COUNT(*)::int        AS match_count_total,
      jsonb_agg(
        jsonb_build_object(
          'chunk_id', t.chunk_id,
          'start_seconds', t.start_seconds,
          'end_seconds', t.end_seconds,
          'text', t.text,
          'rank', t.rank
        )
        ORDER BY t.rank DESC, t.start_seconds ASC
      ) AS chunks
    FROM matches r
    JOIN top_per_video t ON t.chunk_id = r.chunk_id
    GROUP BY r.video_id
  )
  SELECT
    a.video_id,
    a.title,
    a.kind,
    a.thumbnail_url,
    a.published_at,
    a.best_rank,
    a.match_count_total,
    a.chunks
  FROM agg a
  ORDER BY a.best_rank DESC, a.published_at DESC NULLS LAST
  LIMIT match_count;
$$;
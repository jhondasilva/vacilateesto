
CREATE OR REPLACE FUNCTION public.yt_episode_speaker_stats(p_video_id text DEFAULT NULL)
RETURNS TABLE(
  video_id text,
  title text,
  thumbnail_url text,
  published_at timestamptz,
  speaker text,
  seconds numeric,
  words bigint,
  turns bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.video_id,
    v.title,
    v.thumbnail_url,
    v.published_at,
    COALESCE(c.speaker, 'unknown') AS speaker,
    ROUND(SUM(GREATEST(c.end_seconds - c.start_seconds, 0))::numeric, 2) AS seconds,
    SUM(
      COALESCE(
        array_length(
          regexp_split_to_array(btrim(c.text), '\s+'),
          1
        ),
        0
      )
    )::bigint AS words,
    COUNT(*)::bigint AS turns
  FROM public.yt_transcript_chunks c
  JOIN public.yt_videos v ON v.video_id = c.video_id
  WHERE (p_video_id IS NULL OR c.video_id = p_video_id)
  GROUP BY c.video_id, v.title, v.thumbnail_url, v.published_at, COALESCE(c.speaker, 'unknown');
$$;

GRANT EXECUTE ON FUNCTION public.yt_episode_speaker_stats(text) TO anon, authenticated;

CREATE TABLE IF NOT EXISTS public.yt_speaker_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  taken_at timestamptz NOT NULL DEFAULT now(),
  label text NOT NULL,
  video_id text NOT NULL,
  speaker text NOT NULL,
  seconds numeric NOT NULL DEFAULT 0,
  words bigint NOT NULL DEFAULT 0,
  turns bigint NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_yt_speaker_snapshots_video ON public.yt_speaker_snapshots(video_id);
CREATE INDEX IF NOT EXISTS idx_yt_speaker_snapshots_label ON public.yt_speaker_snapshots(label);

ALTER TABLE public.yt_speaker_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view speaker snapshots"
  ON public.yt_speaker_snapshots FOR SELECT
  USING (true);

CREATE OR REPLACE FUNCTION public.yt_episode_speaker_compare(p_label text)
RETURNS TABLE(
  video_id text,
  title text,
  thumbnail_url text,
  published_at timestamptz,
  speaker text,
  seconds_before numeric,
  words_before bigint,
  seconds_after numeric,
  words_after bigint
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  WITH after_stats AS (
    SELECT c.video_id, c.speaker,
           SUM(GREATEST(c.end_seconds - c.start_seconds, 0))::numeric AS seconds,
           SUM(COALESCE(array_length(regexp_split_to_array(btrim(c.text), '\s+'), 1), 0))::bigint AS words
    FROM public.yt_transcript_chunks c
    WHERE c.speaker IS NOT NULL AND c.speaker <> 'unknown'
    GROUP BY c.video_id, c.speaker
  ),
  before_stats AS (
    SELECT video_id, speaker, seconds, words
    FROM public.yt_speaker_snapshots
    WHERE label = p_label
  ),
  combined AS (
    SELECT video_id, speaker FROM after_stats
    UNION
    SELECT video_id, speaker FROM before_stats
  )
  SELECT
    co.video_id,
    v.title,
    v.thumbnail_url,
    v.published_at,
    co.speaker,
    COALESCE(b.seconds, 0) AS seconds_before,
    COALESCE(b.words, 0) AS words_before,
    COALESCE(a.seconds, 0) AS seconds_after,
    COALESCE(a.words, 0) AS words_after
  FROM combined co
  LEFT JOIN before_stats b ON b.video_id = co.video_id AND b.speaker = co.speaker
  LEFT JOIN after_stats  a ON a.video_id = co.video_id AND a.speaker = co.speaker
  JOIN public.yt_videos v ON v.video_id = co.video_id;
$$;
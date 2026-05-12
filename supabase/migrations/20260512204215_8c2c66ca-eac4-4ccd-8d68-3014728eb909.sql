
-- Función para obtener status de diarización por video
CREATE OR REPLACE FUNCTION get_diarization_status(limit_count integer DEFAULT 20)
RETURNS TABLE (
  video_id text,
  title text,
  duration_seconds integer,
  total_chunks bigint,
  chunks_with_speaker bigint,
  jhon_chunks bigint,
  juan_chunks bigint,
  invitado_chunks bigint
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    v.video_id,
    v.title,
    v.duration_seconds,
    COUNT(c.id) AS total_chunks,
    COUNT(CASE WHEN c.speaker IS NOT NULL THEN 1 END) AS chunks_with_speaker,
    COUNT(CASE WHEN c.speaker = 'jhon' THEN 1 END) AS jhon_chunks,
    COUNT(CASE WHEN c.speaker = 'juan' THEN 1 END) AS juan_chunks,
    COUNT(CASE WHEN c.speaker = 'invitado' THEN 1 END) AS invitado_chunks
  FROM yt_videos v
  LEFT JOIN yt_transcript_chunks c ON c.video_id = v.video_id
  GROUP BY v.video_id, v.title, v.duration_seconds, v.published_at
  HAVING COUNT(c.id) > 0
  ORDER BY v.published_at DESC
  LIMIT limit_count;
$$;

-- Función para obtener videos sin transcripción
CREATE OR REPLACE FUNCTION get_videos_without_transcription(limit_count integer DEFAULT 10)
RETURNS TABLE (
  video_id text,
  title text,
  duration_seconds integer
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    v.video_id,
    v.title,
    v.duration_seconds
  FROM yt_videos v
  LEFT JOIN yt_transcript_chunks c ON c.video_id = v.video_id
  WHERE c.id IS NULL
  ORDER BY v.published_at DESC
  LIMIT limit_count;
$$;

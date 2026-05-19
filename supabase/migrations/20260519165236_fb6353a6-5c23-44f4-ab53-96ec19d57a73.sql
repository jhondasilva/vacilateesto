WITH s AS (
  SELECT v.video_id, v.duration_seconds,
         COUNT(c.id) AS chunks,
         COALESCE(SUM(c.end_seconds - c.start_seconds), 0) AS covered
  FROM public.yt_videos v
  LEFT JOIN public.yt_transcript_chunks c ON c.video_id = v.video_id
  WHERE v.duration_seconds IS NOT NULL AND v.duration_seconds > 0
  GROUP BY v.video_id, v.duration_seconds
),
targets AS (
  SELECT video_id FROM s
  WHERE chunks = 0 OR (covered / duration_seconds) < 0.5
)
UPDATE public.yt_videos
SET indexed_at = NULL,
    updated_at = now()
WHERE video_id IN (SELECT video_id FROM targets);

INSERT INTO public.yt_ingest_log (video_id, status, message, metadata)
SELECT v.video_id, 'reingest_queued', 'Encolado por chunks corruptos (0 chunks o cobertura <50%)', jsonb_build_object('reason','corrupted_chunks','queued_at', now())
FROM public.yt_videos v
WHERE v.indexed_at IS NULL
  AND v.updated_at >= now() - interval '10 seconds';
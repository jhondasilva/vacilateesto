UPDATE public.yt_transcript_chunks
SET speaker = 'jhon', speaker_confidence = 0.85
WHERE video_id = 'O1MNft72Ono' AND (speaker IS NULL OR speaker = 'unknown');
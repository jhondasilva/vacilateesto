ALTER TABLE public.yt_transcript_chunks
ADD COLUMN IF NOT EXISTS manual_override boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_yt_chunks_manual_override
ON public.yt_transcript_chunks(manual_override)
WHERE manual_override = true;
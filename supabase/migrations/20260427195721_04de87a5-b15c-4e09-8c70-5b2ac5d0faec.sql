-- Add speaker columns to chunks
ALTER TABLE public.yt_transcript_chunks
  ADD COLUMN IF NOT EXISTS speaker text,
  ADD COLUMN IF NOT EXISTS speaker_confidence numeric;

CREATE INDEX IF NOT EXISTS idx_yt_chunks_speaker ON public.yt_transcript_chunks(speaker);

-- Host stats cache table
CREATE TABLE IF NOT EXISTS public.host_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_key text NOT NULL UNIQUE,
  display_name text NOT NULL,
  total_seconds_spoken numeric NOT NULL DEFAULT 0,
  total_turns integer NOT NULL DEFAULT 0,
  total_words integer NOT NULL DEFAULT 0,
  unique_words integer NOT NULL DEFAULT 0,
  avg_turn_length_seconds numeric NOT NULL DEFAULT 0,
  lexical_richness numeric NOT NULL DEFAULT 0,
  top_words jsonb NOT NULL DEFAULT '[]'::jsonb,
  top_fillers jsonb NOT NULL DEFAULT '[]'::jsonb,
  top_topics jsonb NOT NULL DEFAULT '[]'::jsonb,
  videos_analyzed integer NOT NULL DEFAULT 0,
  last_computed_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.host_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view host stats"
  ON public.host_stats FOR SELECT
  USING (true);

CREATE TRIGGER update_host_stats_updated_at
  BEFORE UPDATE ON public.host_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
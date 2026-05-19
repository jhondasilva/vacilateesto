---
name: Diarization manual overrides
description: How human corrections on speaker attribution are preserved
type: feature
---
- Column `yt_transcript_chunks.manual_override` (boolean) marks chunks corrected by a human.
- Admins can reassign a chunk's speaker from `/lab/hosts` via a pencil button (requires `isAdmin`).
- The edge function `lab-set-speaker` validates admin and sets speaker + speaker_confidence=1 + manual_override=true.
- `scripts/youtube-search/diarize.py` skips chunks with `manual_override = true` so future re-runs don't overwrite human corrections.
- When diarization mislabels a chunk, prefer fixing via the UI (creates training signal) over a one-off DB update.

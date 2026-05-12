---
name: Diarization Goal
description: Objetivo final del pipeline de YouTube — identificar quién habla (Juan vs Jhon) en cada chunk
type: feature
---
El objetivo del pipeline `scripts/youtube-search/` es **identificar cuándo habla Juan (JuanSofa, Juan Carlos Martínez) y cuándo habla Jhon (JhonSnacks, Jhon Da Silva)** en cada podcast.

Flujo en dos pasos:
1. `ingest.py` (wrapper: `run-ingest.sh`) — transcribe el video con Gemini y guarda chunks en `yt_transcript_chunks`.
2. `diarize.py` (wrapper: `run-diarize.sh`) — corre pyannote/speaker-diarization-3.1 localmente, luego usa Gemini para mapear cada SPEAKER_XX a `juan`, `jhon`, `invitado` o `unknown`. Actualiza `speaker` y `speaker_confidence` en los chunks.

Sin diarización, la búsqueda no distingue voces. Siempre que el usuario hable de "transcribir" o "indexar", recordar que el objetivo final es la diarización.

Requisitos extra para diarize: `HUGGINGFACE_TOKEN` en .env + aceptar términos en https://hf.co/pyannote/speaker-diarization-3.1

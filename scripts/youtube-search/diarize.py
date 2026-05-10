#!/usr/bin/env python3
"""
Diarización local de los podcasts ya indexados → etiqueta cada chunk con
`speaker` ('juan', 'jhon', 'invitado' o 'unknown') y `speaker_confidence`.

Pipeline:
  1. Lee de Supabase los videos kind='podcast' que aún no han sido diarizados
     (sin chunks con speaker no nulo).
  2. Descarga el audio con yt-dlp.
  3. Corre pyannote.audio (speaker-diarization-3.1) → segmentos
     (start, end, SPEAKER_X).
  4. Pasa una muestra de cada SPEAKER_X a Gemini (vía Lovable AI) para
     inferir si es Juan Carlos Martínez (JuanSofa), Jhon Da Silva
     (JhonSnacks) o un invitado. Usa contexto (cómo lo nombran los demás,
     muletillas conocidas, rol).
  5. Asigna a cada chunk existente el speaker del segmento que más solapa
     con su [start_seconds, end_seconds].
  6. Update masivo a yt_transcript_chunks.

Idempotente: salta videos cuyos chunks ya tienen speaker.

Requisitos:
    pip install pyannote.audio torch torchaudio requests supabase python-dotenv
    # Aceptar términos en https://huggingface.co/pyannote/speaker-diarization-3.1
    # y exportar HUGGINGFACE_TOKEN=hf_xxx en .env

Uso:
    python diarize.py --limit 10
    python diarize.py --video-id ABC123
    python diarize.py --recompute-stats   # solo recalcula host_stats
    python diarize.py --limit 1 --dry-run # prueba sin escribir en la DB
"""

import argparse
import os
import subprocess
import sys
import tempfile
import time
from collections import defaultdict
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import platform

import requests
from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_ROLE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
LOVABLE_API_KEY = os.environ["LOVABLE_API_KEY"]
HUGGINGFACE_TOKEN = os.environ.get("HUGGINGFACE_TOKEN") or os.environ.get("HF_TOKEN")

if not HUGGINGFACE_TOKEN:
    print("❌ Falta HUGGINGFACE_TOKEN en .env. Crea uno en https://hf.co/settings/tokens")
    print("   y acepta los términos en https://hf.co/pyannote/speaker-diarization-3.1")
    sys.exit(1)

sb: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


# ---------- Audio download ----------
def download_audio(video_id: str, out_dir: Path, cookies_file: Optional[str] = None) -> Optional[Path]:
    out_path = out_dir / f"{video_id}.wav"
    if out_path.exists():
        return out_path
    url = f"https://www.youtube.com/watch?v={video_id}"
    cmd = [
        "yt-dlp", "-x", "--audio-format", "wav",
        "--audio-quality", "0",
        "--postprocessor-args", "ffmpeg:-ar 16000 -ac 1",
        "--extractor-args", "youtube:player_client=tv,web_safari,android",
        "--retries", "5",
        "--user-agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
        "-o", str(out_dir / f"{video_id}.%(ext)s"),
        url,
    ]
    if cookies_file:
        cookies_path = Path(cookies_file).expanduser()
        if cookies_path.exists():
            cmd[1:1] = ["--cookies", str(cookies_path)]
            print(f"  🍪 usando cookies: {cookies_path}")
        else:
            print(f"  ⚠️  YOUTUBE_COOKIES_FILE no existe: {cookies_path}")
    last_err = ""
    for attempt in range(1, 4):
        try:
            subprocess.run(cmd, check=True, capture_output=True, timeout=900)
            if out_path.exists():
                return out_path
            last_err = "wav no generado"
        except subprocess.CalledProcessError as e:
            last_err = e.stderr.decode()[:200]
        except subprocess.TimeoutExpired:
            last_err = "timeout"
        if attempt < 3:
            print(f"  ⏳ yt-dlp intento {attempt} falló ({last_err[:80]}), reintentando…")
            time.sleep(5 * attempt)
    print(f"  ⚠️  yt-dlp falló para {video_id}: {last_err[:200]}")
    return None


# ---------- Diarization ----------
_pipeline = None

def get_pipeline():
    global _pipeline
    if _pipeline is not None:
        return _pipeline
    print("🔧 Cargando pyannote (primera vez, puede tardar)...")
    from pyannote.audio import Pipeline
    import torch
    print(f"   → torch {torch.__version__} / Python {platform.machine()}")
    _pipeline = Pipeline.from_pretrained(
        "pyannote/speaker-diarization-3.1",
        use_auth_token=HUGGINGFACE_TOKEN,
    )
    # Use Apple Silicon MPS if available
    if hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
        _pipeline.to(torch.device("mps"))
        print("   → usando MPS (Apple Silicon)")
    elif torch.cuda.is_available():
        _pipeline.to(torch.device("cuda"))
        print("   → usando CUDA")
    else:
        print("   → usando CPU (lento). Si tu Mac es Apple Silicon, reinstala torch nativo para activar MPS.")
    return _pipeline


def clipped_audio(audio_path: Path, max_minutes: Optional[float], out_dir: Path) -> Path:
    """Return original audio or a clipped copy for quick dry-runs."""
    if not max_minutes or max_minutes <= 0:
        return audio_path
    clipped = out_dir / f"{audio_path.stem}.first-{max_minutes:g}min.wav"
    if clipped.exists():
        return clipped
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(audio_path), "-t", str(max_minutes * 60), "-ar", "16000", "-ac", "1", str(clipped)],
        check=True,
        capture_output=True,
        timeout=300,
    )
    return clipped


def diarize(audio_path: Path, max_minutes: Optional[float] = None, work_dir: Optional[Path] = None) -> List[Tuple[float, float, str]]:
    """Returns list of (start_sec, end_sec, speaker_label)."""
    pipeline = get_pipeline()
    input_audio = clipped_audio(audio_path, max_minutes, work_dir or audio_path.parent)
    if input_audio != audio_path:
        print(f"  ✂️  Prueba rápida: diarizando solo los primeros {max_minutes:g} min")
    print("  ⏱️  Diarización corriendo; en CPU puede tardar mucho y no muestra progreso...")
    diarization = pipeline(str(input_audio))
    segments = []
    for turn, _, speaker in diarization.itertracks(yield_label=True):
        segments.append((float(turn.start), float(turn.end), str(speaker)))
    return segments


# ---------- Speaker → Juan/Jhon/Invitado via AI ----------
def collect_samples(
    chunks: List[dict], segments: List[Tuple[float, float, str]]
) -> Dict[str, str]:
    """For each speaker label, gather ~600 chars of representative text
    from the chunks that overlap with that speaker's segments."""
    samples: Dict[str, List[str]] = defaultdict(list)
    for ch in chunks:
        cs, ce = float(ch["start_seconds"]), float(ch["end_seconds"])
        # find overlapping segment with the most overlap
        best_speaker, best_overlap = None, 0.0
        for s_start, s_end, spk in segments:
            ov = max(0.0, min(ce, s_end) - max(cs, s_start))
            if ov > best_overlap:
                best_overlap = ov
                best_speaker = spk
        if best_speaker:
            samples[best_speaker].append(ch["text"])
    return {spk: " ".join(texts)[:1500] for spk, texts in samples.items()}


def identify_speakers_with_ai(samples: Dict[str, str], video_title: str) -> Dict[str, Tuple[str, float]]:
    """Map SPEAKER_XX → ('juan'|'jhon'|'invitado', confidence)."""
    if not samples:
        return {}
    speakers_block = "\n\n".join(
        f"[{label}]: {text}" for label, text in samples.items()
    )
    prompt = f"""Estás analizando un episodio del podcast venezolano "Vacílate Esto".
Título del episodio: {video_title}

Los hosts son:
- JuanSofa = Juan Carlos Martínez (la voz reflexiva/estratega, suele dar contexto, hablar más pausado, menciona a "Jhon")
- JhonSnacks = Jhon Da Silva (la chispa, más enérgico, hace bromas, menciona a "Juan" o "JuanSofa")

Cualquier otro hablante es un invitado.

Para cada SPEAKER abajo, identifica si es 'juan', 'jhon' o 'invitado' basándote en:
- Cómo lo llaman los demás
- Estilo/tono
- Si dice "yo soy Juan/Jhon"
- Muletillas o frases típicas

Hablantes detectados:
{speakers_block}
"""
    body = {
        "model": "google/gemini-2.5-flash",
        "messages": [{"role": "user", "content": prompt}],
        "tools": [{
            "type": "function",
            "function": {
                "name": "assign_speakers",
                "description": "Asigna cada SPEAKER_XX a juan/jhon/invitado",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "assignments": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "speaker_label": {"type": "string"},
                                    "host": {"type": "string", "enum": ["juan", "jhon", "invitado", "unknown"]},
                                    "confidence": {"type": "number"},
                                },
                                "required": ["speaker_label", "host", "confidence"],
                            },
                        }
                    },
                    "required": ["assignments"],
                },
            },
        }],
        "tool_choice": {"type": "function", "function": {"name": "assign_speakers"}},
    }
    try:
        r = requests.post(
            "https://ai.gateway.lovable.dev/v1/chat/completions",
            headers={"Authorization": f"Bearer {LOVABLE_API_KEY}", "Content-Type": "application/json"},
            json=body, timeout=60,
        )
        r.raise_for_status()
        args = r.json()["choices"][0]["message"]["tool_calls"][0]["function"]["arguments"]
        import json as _json
        parsed = _json.loads(args)
        return {a["speaker_label"]: (a["host"], float(a["confidence"])) for a in parsed["assignments"]}
    except Exception as e:
        print(f"  ⚠️  AI identification failed: {e}")
        return {label: ("unknown", 0.0) for label in samples}


# ---------- Apply to chunks ----------
def assign_chunks(
    chunks: List[dict],
    segments: List[Tuple[float, float, str]],
    speaker_map: Dict[str, Tuple[str, float]],
) -> List[dict]:
    updates = []
    for ch in chunks:
        cs, ce = float(ch["start_seconds"]), float(ch["end_seconds"])
        best_spk, best_ov = None, 0.0
        for s_start, s_end, spk in segments:
            ov = max(0.0, min(ce, s_end) - max(cs, s_start))
            if ov > best_ov:
                best_ov, best_spk = ov, spk
        host, conf = speaker_map.get(best_spk, ("unknown", 0.0)) if best_spk else ("unknown", 0.0)
        updates.append({"id": ch["id"], "speaker": host, "speaker_confidence": conf})
    return updates


def update_chunks_speaker(updates: List[dict]) -> None:
    # Supabase doesn't have bulk update; do it in batches via upsert on id
    BATCH = 100
    for i in range(0, len(updates), BATCH):
        batch = updates[i:i + BATCH]
        for u in batch:
            sb.table("yt_transcript_chunks").update(
                {"speaker": u["speaker"], "speaker_confidence": u["speaker_confidence"]}
            ).eq("id", u["id"]).execute()


# ---------- Recompute host_stats ----------
def recompute_host_stats() -> None:
    """Calls the host-insights edge function in 'recompute' mode."""
    print("📊 Recomputando host_stats...")
    r = requests.post(
        f"{SUPABASE_URL}/functions/v1/host-insights",
        headers={"Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}", "Content-Type": "application/json"},
        json={"action": "recompute"},
        timeout=300,
    )
    if r.ok:
        print(f"   ✅ {r.json()}")
    else:
        print(f"   ⚠️  {r.status_code}: {r.text[:300]}")


# ---------- Main loop ----------
def get_videos_to_diarize(limit: int, video_id: Optional[str]) -> List[dict]:
    if video_id:
        r = sb.table("yt_videos").select("video_id,title").eq("video_id", video_id).execute()
        return r.data
    # 1) Todos los videos podcast indexados, ordenados por más recientes.
    r = sb.table("yt_videos").select("video_id,title").eq("kind", "podcast").order("published_at", desc=True).limit(1000).execute()
    podcasts = r.data or []
    # 2) IDs de videos que YA tienen al menos un chunk con speaker asignado.
    done: set[str] = set()
    page = 0
    PAGE = 1000
    while True:
        c = sb.table("yt_transcript_chunks").select("video_id").not_.is_("speaker", "null").range(page * PAGE, page * PAGE + PAGE - 1).execute()
        rows = c.data or []
        if not rows:
            break
        for row in rows:
            done.add(row["video_id"])
        if len(rows) < PAGE:
            break
        page += 1
    out = [v for v in podcasts if v["video_id"] not in done][:limit]
    print(f"   {len(podcasts)} podcasts totales, {len(done)} ya diarizados, {len(out)} pendientes en esta tanda")
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=10)
    ap.add_argument("--video-id", default=None)
    ap.add_argument("--recompute-stats", action="store_true", help="Solo recomputa host_stats sin diarizar")
    ap.add_argument("--dry-run", action="store_true", help="Diariza pero NO escribe en la DB ni recomputa stats")
    ap.add_argument("--max-minutes", type=float, default=None, help="Solo diariza los primeros N minutos (ideal para dry-run rápido)")
    ap.add_argument("--keep-audio", action="store_true", help="No borra los .wav descargados (útil para depurar)")
    ap.add_argument("--cookies-file", default=os.environ.get("YOUTUBE_COOKIES_FILE"), help="Archivo cookies.txt exportado de YouTube para evitar bloqueo anti-bot")
    args = ap.parse_args()

    if args.recompute_stats:
        recompute_host_stats()
        return

    videos = get_videos_to_diarize(args.limit, args.video_id)
    print(f"🎯 {len(videos)} videos por diarizar")
    if args.dry_run:
        print("   (modo --dry-run: no se escribirá nada en la DB)")

    work_dir = Path(tempfile.gettempdir()) / "ve_diarize"
    work_dir.mkdir(exist_ok=True)

    ok, failed, skipped = 0, 0, 0
    for i, v in enumerate(videos, 1):
        vid = v["video_id"]
        print(f"\n[{i}/{len(videos)}] {vid} — {v['title'][:60]}")
        t0 = time.time()

        chunks_r = sb.table("yt_transcript_chunks").select("id,start_seconds,end_seconds,text").eq("video_id", vid).order("chunk_index").execute()
        chunks = chunks_r.data
        if not chunks:
            print("  ⏭️  Sin chunks, salto")
            skipped += 1
            continue

        audio = download_audio(vid, work_dir, args.cookies_file)
        if not audio:
            print("  ⏭️  No pude bajar audio")
            failed += 1
            continue
        print(f"  🎧 Audio listo ({audio.stat().st_size // 1024} KB)")

        try:
            segments = diarize(audio, max_minutes=args.max_minutes, work_dir=work_dir)
        except Exception as e:
            print(f"  ❌ Diarización falló: {e}")
            failed += 1
            continue
        print(f"  🗣️  {len(segments)} segmentos, {len(set(s[2] for s in segments))} hablantes")

        samples = collect_samples(chunks, segments)
        speaker_map = identify_speakers_with_ai(samples, v["title"])
        for label, (host, conf) in speaker_map.items():
            print(f"     {label} → {host} ({conf:.2f})")

        updates = assign_chunks(chunks, segments, speaker_map)
        if args.dry_run:
            counts: Dict[str, int] = defaultdict(int)
            for u in updates:
                counts[u["speaker"]] += 1
            print(f"  🧪 dry-run: {dict(counts)} ({len(updates)} chunks) en {time.time()-t0:.1f}s")
        else:
            update_chunks_speaker(updates)
            print(f"  ✅ {len(updates)} chunks actualizados en {time.time()-t0:.1f}s")
        ok += 1

        # Free audio file
        if not args.keep_audio:
            try:
                audio.unlink()
            except Exception:
                pass

    print(f"\n📦 Resumen: ok={ok} fallidos={failed} sin_chunks={skipped}")

    # Final: recompute stats (solo si hubo cambios reales)
    if ok > 0 and not args.dry_run:
        recompute_host_stats()
    elif args.dry_run:
        print("   (saltando recomputo de stats por --dry-run)")


if __name__ == "__main__":
    main()
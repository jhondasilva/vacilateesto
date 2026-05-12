#!/usr/bin/env python3
"""
Sube a Supabase los JSON de diarización producidos por `diarize.py --save-json`.

Cada JSON describe un video y tiene este formato:
{
  "video_id": "abc123",
  "title": "...",
  "diarized_at": "2026-05-12T14:33:01",
  "max_minutes": null,
  "segments": [{"start": 0.5, "end": 12.3, "label": "SPEAKER_00"}, ...],
  "speaker_map": {"SPEAKER_00": {"host": "juan", "confidence": 0.92}, ...}
}

El script:
  1. Lee los JSON (carpeta o archivos sueltos).
  2. Para cada video, baja sus chunks (id, start_seconds, end_seconds) de la DB.
  3. Para cada chunk encuentra el segmento con mayor solape y le asigna
     speaker + speaker_confidence usando speaker_map.
  4. Update masivo a yt_transcript_chunks.
  5. Mueve el JSON a `processed/` (a menos que uses --keep).
  6. Recompute opcional de host_stats al final.

Uso:
    python upload-diarization.py path/al/folder
    python upload-diarization.py file1.json file2.json
    python upload-diarization.py folder --dry-run
    python upload-diarization.py folder --no-recompute
    python upload-diarization.py folder --overwrite   # reescribe aunque ya tenga speaker
"""

import argparse
import json
import os
import shutil
import sys
import time
from collections import defaultdict
from pathlib import Path
from typing import Dict, List, Tuple

import requests
from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_ROLE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
sb: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


def collect_files(paths: List[str]) -> List[Path]:
    out: List[Path] = []
    for p in paths:
        path = Path(p).expanduser()
        if path.is_dir():
            out.extend(sorted(path.glob("*.json")))
        elif path.is_file() and path.suffix == ".json":
            out.append(path)
        else:
            print(f"⚠️  Ignorando '{p}' (no existe o no es .json)")
    # Excluir los que ya estén en processed/
    return [p for p in out if "processed" not in p.parts]


def fetch_chunks(video_id: str) -> List[dict]:
    rows: List[dict] = []
    page = 0
    PAGE = 1000
    while True:
        r = (
            sb.table("yt_transcript_chunks")
            .select("id,start_seconds,end_seconds,speaker")
            .eq("video_id", video_id)
            .order("chunk_index")
            .range(page * PAGE, page * PAGE + PAGE - 1)
            .execute()
        )
        batch = r.data or []
        rows.extend(batch)
        if len(batch) < PAGE:
            break
        page += 1
    return rows


def assign_chunks(
    chunks: List[dict],
    segments: List[Tuple[float, float, str]],
    speaker_map: Dict[str, Tuple[str, float]],
) -> List[dict]:
    updates = []
    for ch in chunks:
        cs, ce = float(ch["start_seconds"]), float(ch["end_seconds"])
        best_label, best_ov = None, 0.0
        for s_start, s_end, lbl in segments:
            ov = max(0.0, min(ce, s_end) - max(cs, s_start))
            if ov > best_ov:
                best_ov, best_label = ov, lbl
        host, conf = speaker_map.get(best_label, ("unknown", 0.0)) if best_label else ("unknown", 0.0)
        updates.append({"id": ch["id"], "speaker": host, "speaker_confidence": conf})
    return updates


def push_updates(updates: List[dict]) -> None:
    for u in updates:
        sb.table("yt_transcript_chunks").update(
            {"speaker": u["speaker"], "speaker_confidence": u["speaker_confidence"]}
        ).eq("id", u["id"]).execute()


def recompute_host_stats() -> None:
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


def process_file(path: Path, overwrite: bool, dry_run: bool) -> str:
    """Returns 'ok' | 'skipped' | 'failed'."""
    try:
        data = json.loads(path.read_text())
    except Exception as e:
        print(f"❌ {path.name}: JSON inválido ({e})")
        return "failed"

    vid = data.get("video_id")
    segments_raw = data.get("segments") or []
    speaker_map_raw = data.get("speaker_map") or {}
    if not vid or not segments_raw or not speaker_map_raw:
        print(f"❌ {path.name}: faltan video_id/segments/speaker_map")
        return "failed"

    segments: List[Tuple[float, float, str]] = [
        (float(s["start"]), float(s["end"]), str(s["label"])) for s in segments_raw
    ]
    speaker_map: Dict[str, Tuple[str, float]] = {
        lbl: (str(v.get("host", "unknown")), float(v.get("confidence", 0.0)))
        for lbl, v in speaker_map_raw.items()
    }

    print(f"\n📄 {path.name} → video {vid}")
    for lbl, (host, conf) in speaker_map.items():
        print(f"     {lbl} → {host} ({conf:.2f})")

    chunks = fetch_chunks(vid)
    if not chunks:
        print(f"  ⏭️  Sin chunks en la DB para {vid}")
        return "skipped"

    if not overwrite and any(c.get("speaker") for c in chunks):
        print(f"  ⏭️  Ya tiene speaker asignado ({sum(1 for c in chunks if c.get('speaker'))}/{len(chunks)}). Usa --overwrite para forzar.")
        return "skipped"

    updates = assign_chunks(chunks, segments, speaker_map)
    counts: Dict[str, int] = defaultdict(int)
    for u in updates:
        counts[u["speaker"]] += 1
    print(f"  📊 {dict(counts)} ({len(updates)} chunks)")

    if dry_run:
        print("  🧪 dry-run: no escribo en la DB")
        return "ok"

    t0 = time.time()
    push_updates(updates)
    print(f"  ✅ {len(updates)} chunks actualizados en {time.time()-t0:.1f}s")
    return "ok"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("paths", nargs="+", help="Carpeta(s) o archivos .json a subir")
    ap.add_argument("--overwrite", action="store_true", help="Reescribe speaker aunque los chunks ya estén diarizados")
    ap.add_argument("--dry-run", action="store_true", help="No escribe en la DB ni mueve archivos")
    ap.add_argument("--keep", action="store_true", help="No mueve los JSON a processed/ después de subir")
    ap.add_argument("--no-recompute", action="store_true", help="No recomputar host_stats al final")
    args = ap.parse_args()

    files = collect_files(args.paths)
    if not files:
        print("⚠️  No encontré archivos .json para subir")
        sys.exit(1)
    print(f"🎯 {len(files)} JSON pendiente(s) de subir")

    ok = skipped = failed = 0
    for f in files:
        try:
            result = process_file(f, args.overwrite, args.dry_run)
        except Exception as e:
            print(f"❌ {f.name}: error inesperado {e}")
            result = "failed"

        if result == "ok":
            ok += 1
            if not args.dry_run and not args.keep:
                processed = f.parent / "processed"
                processed.mkdir(exist_ok=True)
                shutil.move(str(f), str(processed / f.name))
        elif result == "skipped":
            skipped += 1
        else:
            failed += 1

    print(f"\n📦 Resumen: ok={ok} saltados={skipped} fallidos={failed}")

    if ok > 0 and not args.dry_run and not args.no_recompute:
        recompute_host_stats()


if __name__ == "__main__":
    main()
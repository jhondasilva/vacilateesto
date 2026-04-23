#!/usr/bin/env python3
"""
Ingesta de podcasts de YouTube → transcripción con Lovable AI (Gemini)
→ embeddings → Supabase (yt_videos + yt_transcript_chunks).

Uso:
    python ingest.py --limit 20 --kind podcast
    python ingest.py --limit 1000  # todo
    python ingest.py --video-id ABC123  # un video específico

Idempotente: si lo cortas con Ctrl+C, retoma donde quedó (skip videos con indexed_at).

Requisitos:
    brew install ffmpeg
    pipx install yt-dlp           (o:  pip install yt-dlp)
    pip install requests supabase python-dotenv

Variables en .env (mismo directorio que este script):
    YOUTUBE_API_KEY=...
    LOVABLE_API_KEY=...
    SUPABASE_URL=https://dpgvanocynbrmqvgvgvd.supabase.co
    SUPABASE_SERVICE_ROLE_KEY=...
"""

import argparse
import base64
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from typing import List, Optional

import requests
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

YOUTUBE_API_KEY = os.environ["YOUTUBE_API_KEY"]
LOVABLE_API_KEY = os.environ["LOVABLE_API_KEY"]
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_ROLE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

CHANNEL_HANDLE = "Vacilateestopodcast"
TRANSCRIBE_MODEL = "google/gemini-2.5-flash"
EMBEDDING_MODEL = "google/text-embedding-004"
EMBEDDING_DIMS = 1536
CHUNK_SECONDS = 60
CHUNK_OVERLAP_SECONDS = 10
# Gemini accepts inline audio up to ~20MB. We split into 15-min slices @ 32kbps mono ≈ 3.6MB each.
AUDIO_SLICE_SECONDS = 15 * 60

sb: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# ---------- YouTube API ----------

def get_uploads_playlist_id() -> str:
    r = requests.get(
        "https://www.googleapis.com/youtube/v3/channels",
        params={"part": "contentDetails", "forHandle": f"@{CHANNEL_HANDLE}", "key": YOUTUBE_API_KEY},
        timeout=30,
    )
    r.raise_for_status()
    return r.json()["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]


def list_all_video_ids(playlist_id: str) -> List[str]:
    ids, page = [], None
    while True:
        params = {"part": "contentDetails", "maxResults": 50, "playlistId": playlist_id, "key": YOUTUBE_API_KEY}
        if page:
            params["pageToken"] = page
        r = requests.get("https://www.googleapis.com/youtube/v3/playlistItems", params=params, timeout=30)
        r.raise_for_status()
        j = r.json()
        for it in j.get("items", []):
            vid = it["contentDetails"]["videoId"]
            ids.append(vid)
        page = j.get("nextPageToken")
        if not page:
            break
    return ids


def fetch_video_details(video_ids: List[str]) -> List[dict]:
    out = []
    for i in range(0, len(video_ids), 50):
        batch = video_ids[i : i + 50]
        r = requests.get(
            "https://www.googleapis.com/youtube/v3/videos",
            params={"part": "snippet,contentDetails,statistics", "id": ",".join(batch), "key": YOUTUBE_API_KEY},
            timeout=30,
        )
        r.raise_for_status()
        out.extend(r.json().get("items", []))
    return out


ISO_DUR_RE = re.compile(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?")


def iso_to_seconds(iso: str) -> int:
    m = ISO_DUR_RE.match(iso or "")
    if not m:
        return 0
    h, mn, s = (int(x or 0) for x in m.groups())
    return h * 3600 + mn * 60 + s


# ---------- Audio download with yt-dlp ----------

def download_audio(video_id: str, out_dir: Path) -> Path:
    """Download lowest-bandwidth m4a, then re-encode mono 32kbps for cheap upload to Gemini."""
    raw = out_dir / f"{video_id}.m4a"
    final = out_dir / f"{video_id}.32k.m4a"
    if final.exists():
        return final
    print(f"  ⬇️  yt-dlp downloading {video_id}…")
    subprocess.run(
        [
            "yt-dlp",
            "-q",
            "-f",
            "bestaudio[ext=m4a]/bestaudio",
            "-o",
            str(raw),
            f"https://www.youtube.com/watch?v={video_id}",
        ],
        check=True,
    )
    print(f"  🔧 ffmpeg re-encoding to 32kbps mono…")
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-i",
            str(raw),
            "-ac",
            "1",
            "-ar",
            "16000",
            "-b:a",
            "32k",
            str(final),
        ],
        check=True,
    )
    raw.unlink(missing_ok=True)
    return final


def slice_audio(audio: Path, slice_seconds: int, out_dir: Path) -> List[tuple]:
    """Returns list of (slice_path, start_seconds)."""
    # probe duration
    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(audio)],
        capture_output=True,
        text=True,
        check=True,
    )
    total = float(probe.stdout.strip())
    slices = []
    start = 0.0
    idx = 0
    while start < total:
        out = out_dir / f"{audio.stem}.s{idx:03d}.m4a"
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-loglevel",
                "error",
                "-ss",
                str(start),
                "-t",
                str(slice_seconds),
                "-i",
                str(audio),
                "-c",
                "copy",
                str(out),
            ],
            check=True,
        )
        slices.append((out, start))
        start += slice_seconds
        idx += 1
    return slices


# ---------- Transcription with Lovable AI Gemini ----------

TRANSCRIBE_PROMPT = (
    "Transcribe este audio en español venezolano EXACTAMENTE como suena, "
    "manteniendo jerga, modismos y nombres propios. "
    "Devuelve SOLO un JSON con esta forma exacta, sin texto adicional ni markdown:\n"
    '{"segments":[{"start":0.0,"end":4.2,"text":"…"}, ...]}\n'
    "Cada segmento debe ser una oración o frase corta (3-15 segundos). "
    "Los timestamps son segundos relativos al INICIO de este audio."
)


def transcribe_slice(slice_path: Path, slice_start: float) -> List[dict]:
    """Returns list of {start, end, text} with absolute timestamps."""
    audio_b64 = base64.b64encode(slice_path.read_bytes()).decode()
    body = {
        "model": TRANSCRIBE_MODEL,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": TRANSCRIBE_PROMPT},
                    {
                        "type": "input_audio",
                        "input_audio": {"data": audio_b64, "format": "m4a"},
                    },
                ],
            }
        ],
        "response_format": {"type": "json_object"},
    }
    for attempt in range(3):
        r = requests.post(
            "https://ai.gateway.lovable.dev/v1/chat/completions",
            headers={"Authorization": f"Bearer {LOVABLE_API_KEY}", "Content-Type": "application/json"},
            json=body,
            timeout=600,
        )
        if r.status_code == 429:
            wait = 2 ** attempt * 5
            print(f"     ⏳ rate-limited, waiting {wait}s…")
            time.sleep(wait)
            continue
        if r.status_code == 402:
            raise RuntimeError("Lovable AI: créditos agotados. Recarga en Settings → Workspace → Usage.")
        r.raise_for_status()
        content = r.json()["choices"][0]["message"]["content"]
        try:
            data = json.loads(content)
        except json.JSONDecodeError:
            # try to extract JSON from text
            m = re.search(r"\{.*\}", content, re.S)
            if not m:
                raise
            data = json.loads(m.group(0))
        segs = data.get("segments", [])
        return [
            {
                "start": float(s["start"]) + slice_start,
                "end": float(s["end"]) + slice_start,
                "text": s["text"].strip(),
            }
            for s in segs
            if s.get("text", "").strip()
        ]
    raise RuntimeError(f"transcribe failed after 3 attempts for {slice_path}")


# ---------- Chunking + embeddings ----------

def chunk_segments(segments: List[dict]) -> List[dict]:
    if not segments:
        return []
    total_end = segments[-1]["end"]
    chunks = []
    win_start = 0.0
    while win_start < total_end:
        win_end = win_start + CHUNK_SECONDS
        in_win = [s for s in segments if s["end"] > win_start and s["start"] < win_end]
        if in_win:
            text = " ".join(s["text"] for s in in_win)
            text = re.sub(r"\s+", " ", text).strip()
            if len(text) > 30:
                chunks.append(
                    {
                        "start": max(win_start, in_win[0]["start"]),
                        "end": min(win_end, in_win[-1]["end"]),
                        "text": text,
                    }
                )
        win_start += CHUNK_SECONDS - CHUNK_OVERLAP_SECONDS
    return chunks


def embed_batch(texts: List[str]) -> List[List[float]]:
    r = requests.post(
        "https://ai.gateway.lovable.dev/v1/embeddings",
        headers={"Authorization": f"Bearer {LOVABLE_API_KEY}", "Content-Type": "application/json"},
        json={"model": EMBEDDING_MODEL, "input": texts, "dimensions": EMBEDDING_DIMS},
        timeout=120,
    )
    if not r.ok:
        raise RuntimeError(f"embed failed [{r.status_code}]: {r.text[:300]}")
    return [d["embedding"] for d in r.json()["data"]]


# ---------- Supabase ----------

def upsert_video(v: dict, kind: str):
    sn, cd, st = v.get("snippet", {}), v.get("contentDetails", {}), v.get("statistics", {})
    thumb = (sn.get("thumbnails", {}).get("maxres") or sn.get("thumbnails", {}).get("high") or sn.get("thumbnails", {}).get("default") or {}).get("url")
    sb.table("yt_videos").upsert(
        {
            "video_id": v["id"],
            "title": sn.get("title", "(sin título)"),
            "description": sn.get("description", ""),
            "published_at": sn.get("publishedAt"),
            "duration_seconds": iso_to_seconds(cd.get("duration", "PT0S")),
            "thumbnail_url": thumb,
            "kind": kind,
            "view_count": int(st.get("viewCount", 0)),
        },
        on_conflict="video_id",
    ).execute()


def already_indexed(video_id: str) -> bool:
    r = sb.table("yt_videos").select("indexed_at").eq("video_id", video_id).maybe_single().execute()
    return bool(r.data and r.data.get("indexed_at"))


def save_chunks(video_id: str, chunks: List[dict]):
    # replace existing
    sb.table("yt_transcript_chunks").delete().eq("video_id", video_id).execute()
    rows = []
    # embed in batches of 50
    for i in range(0, len(chunks), 50):
        batch = chunks[i : i + 50]
        embs = embed_batch([c["text"] for c in batch])
        for j, c in enumerate(batch):
            rows.append(
                {
                    "video_id": video_id,
                    "chunk_index": i + j,
                    "start_seconds": c["start"],
                    "end_seconds": c["end"],
                    "text": c["text"],
                    "embedding": embs[j],
                }
            )
    # insert in batches of 200 to avoid payload limits
    for i in range(0, len(rows), 200):
        sb.table("yt_transcript_chunks").insert(rows[i : i + 200]).execute()

    sb.table("yt_videos").update({"indexed_at": "now()"}).eq("video_id", video_id).execute()
    sb.table("yt_ingest_log").insert(
        {"video_id": video_id, "status": "indexed", "message": f"{len(rows)} chunks"}
    ).execute()


def log_error(video_id: str, msg: str):
    sb.table("yt_ingest_log").insert({"video_id": video_id, "status": "error", "message": msg[:1000]}).execute()


# ---------- Main ----------

def process_one(v: dict, tmp_root: Path) -> str:
    vid = v["id"]
    dur = iso_to_seconds(v["contentDetails"]["duration"])
    kind = "short" if 0 < dur <= 180 else "podcast"
    title = v["snippet"]["title"]

    print(f"\n▶️  {vid} [{kind}, {dur//60}min] {title[:70]}")
    upsert_video(v, kind)

    if already_indexed(vid):
        print("   ✅ already indexed, skipping")
        return "skipped"

    work = tmp_root / vid
    work.mkdir(exist_ok=True)
    try:
        audio = download_audio(vid, work)
        slices = slice_audio(audio, AUDIO_SLICE_SECONDS, work)
        print(f"   🎧 {len(slices)} audio slice(s)")
        all_segments: List[dict] = []
        for idx, (path, start) in enumerate(slices):
            print(f"   📝 transcribing slice {idx+1}/{len(slices)}…")
            segs = transcribe_slice(path, start)
            all_segments.extend(segs)
            path.unlink(missing_ok=True)
        audio.unlink(missing_ok=True)

        if not all_segments:
            log_error(vid, "no segments returned")
            return "no segments"

        chunks = chunk_segments(all_segments)
        print(f"   ✂️  {len(chunks)} chunk(s) → embeddings…")
        save_chunks(vid, chunks)
        print(f"   ✅ done — {len(chunks)} chunks indexed")
        return f"indexed {len(chunks)}"
    except Exception as e:
        log_error(vid, str(e))
        print(f"   ❌ {e}")
        return f"error: {e}"
    finally:
        shutil.rmtree(work, ignore_errors=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=20, help="Cuántos videos procesar (default 20)")
    ap.add_argument("--kind", choices=["podcast", "short", "all"], default="podcast")
    ap.add_argument("--video-id", help="Procesar solo este video (ignora limit/kind)")
    args = ap.parse_args()

    # check tools
    for tool in ("yt-dlp", "ffmpeg", "ffprobe"):
        if not shutil.which(tool):
            sys.exit(f"❌ Falta el binario '{tool}'. Instala con:\n   brew install ffmpeg\n   pipx install yt-dlp")

    tmp_root = Path(tempfile.mkdtemp(prefix="vacilate-ingest-"))
    print(f"📁 workdir: {tmp_root}")

    if args.video_id:
        details = fetch_video_details([args.video_id])
    else:
        print("🔎 Listando canal…")
        playlist = get_uploads_playlist_id()
        all_ids = list_all_video_ids(playlist)
        print(f"   {len(all_ids)} videos totales en el canal")
        details = fetch_video_details(all_ids)
        # filter
        if args.kind != "all":
            details = [
                v
                for v in details
                if (
                    iso_to_seconds(v["contentDetails"]["duration"]) > 180
                    if args.kind == "podcast"
                    else 0 < iso_to_seconds(v["contentDetails"]["duration"]) <= 180
                )
            ]
        # filter out already indexed
        already = {
            r["video_id"]
            for r in sb.table("yt_videos").select("video_id, indexed_at").execute().data or []
            if r.get("indexed_at")
        }
        details = [v for v in details if v["id"] not in already]
        details = details[: args.limit]

    print(f"🚀 Procesando {len(details)} video(s)…")
    summary = {"ok": 0, "skip": 0, "err": 0}
    for v in details:
        result = process_one(v, tmp_root)
        if result.startswith("indexed"):
            summary["ok"] += 1
        elif result == "skipped":
            summary["skip"] += 1
        else:
            summary["err"] += 1

    shutil.rmtree(tmp_root, ignore_errors=True)
    print(f"\n🎉 Listo. ok={summary['ok']}  skip={summary['skip']}  err={summary['err']}")


if __name__ == "__main__":
    main()
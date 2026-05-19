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

# ---------- Normalización de marca ----------
# Corrige errores comunes de transcripción del nombre de la marca.
_BRAND_FIXES = [
    (re.compile(r"Bacilat[oae]"), "Vacílate"),
    (re.compile(r"bacilat[oae]"), "vacílate"),
    (re.compile(r"Vasilat[oae]"), "Vacílate"),
    (re.compile(r"vasilat[oae]"), "vacílate"),
]

def normalize_brand(text: str) -> str:
    if not text:
        return text
    for pat, repl in _BRAND_FIXES:
        text = pat.sub(repl, text)
    return text

# ---------- Auto-update ----------
# Bump esto cada vez que cambie el script. La edge function `script-version`
# expone su propio número; si no coinciden, nos auto-descargamos la versión
# nueva, la escribimos sobre este archivo, y reiniciamos.
SCRIPT_VERSION = "2026.05.19.2"
VERSION_ENDPOINT = "https://dpgvanocynbrmqvgvgvd.supabase.co/functions/v1/script-version"


def self_update_check() -> None:
    """Compara versión local vs remota; si hay nueva, reemplaza el archivo y reinicia."""
    if os.environ.get("INGEST_SKIP_UPDATE") == "1":
        return
    try:
        r = requests.get(VERSION_ENDPOINT, timeout=10)
        if r.status_code != 200:
            return
        data = r.json()
        remote_version = data.get("version")
        remote_source = data.get("source")
        if not remote_version or not remote_source:
            return
        if remote_version == SCRIPT_VERSION:
            return
        print(f"⬇️  Nueva versión disponible: {SCRIPT_VERSION} → {remote_version}. Actualizando…")
        script_path = Path(__file__).resolve()
        backup = script_path.with_suffix(".py.bak")
        shutil.copy2(script_path, backup)
        script_path.write_text(remote_source, encoding="utf-8")
        print(f"✅ Script actualizado. Backup en {backup.name}. Reiniciando…")
        # Re-ejecutamos el mismo comando con la versión nueva, evitando loop infinito.
        env = os.environ.copy()
        env["INGEST_SKIP_UPDATE"] = "1"
        os.execvpe(sys.executable, [sys.executable, str(script_path), *sys.argv[1:]], env)
    except Exception as e:
        print(f"⚠️  No se pudo verificar versión ({e}). Sigo con la versión local.")


self_update_check()

YOUTUBE_API_KEY = os.environ["YOUTUBE_API_KEY"]
LOVABLE_API_KEY = os.environ["LOVABLE_API_KEY"]
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_ROLE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

CHANNEL_ID = "UC070EE8OAX9_drD-InoxTig"
CHANNEL_HANDLE = "Vacilateestopodcast"
TRANSCRIBE_MODEL = "google/gemini-2.5-flash"
CHUNK_SECONDS = 60
CHUNK_OVERLAP_SECONDS = 10
# Gemini accepts inline audio up to ~20MB. We split into 15-min slices @ 32kbps mono ≈ 3.6MB each.
AUDIO_SLICE_SECONDS = 15 * 60

sb: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# ---------- YouTube API ----------

def get_uploads_playlist_id() -> str:
    r = requests.get(
        "https://www.googleapis.com/youtube/v3/channels",
        params={"part": "contentDetails", "id": CHANNEL_ID, "key": YOUTUBE_API_KEY},
        timeout=30,
    )
    if not r.ok:
        raise RuntimeError(f"channels.list failed: {r.status_code} {r.text[:500]}")
    items = r.json().get("items", [])
    if not items:
        raise RuntimeError(f"No encontré el canal {CHANNEL_HANDLE} ({CHANNEL_ID})")
    return items[0]["contentDetails"]["relatedPlaylists"]["uploads"]


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
    # YouTube increasingly blocks unauthenticated downloads ("Sign in to confirm
    # you're not a bot"). Pass cookies from a local browser to bypass it.
    # Configure with:  YTDLP_COOKIES_FROM_BROWSER=chrome   (or safari/firefox/brave/edge)
    # Or point at a cookies.txt file: YTDLP_COOKIES_FILE=/path/to/cookies.txt
    cmd = ["yt-dlp", "-q", "-f", "bestaudio[ext=m4a]/bestaudio"]
    cookies_browser = os.environ.get("YTDLP_COOKIES_FROM_BROWSER", "").strip()
    cookies_file = os.environ.get("YTDLP_COOKIES_FILE", "").strip()
    if cookies_file:
        cmd += ["--cookies", cookies_file]
    elif cookies_browser:
        cmd += ["--cookies-from-browser", cookies_browser]
    cmd += [
        "-o",
        str(raw),
        f"https://www.youtube.com/watch?v={video_id}",
    ]
    subprocess.run(cmd, check=True)
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
    last_content = ""
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
        last_content = content
        try:
            data = json.loads(content)
        except json.JSONDecodeError:
            # try to extract JSON from markdown wrapper
            m = re.search(r"\{.*\}", content, re.S)
            if m:
                try:
                    data = json.loads(m.group(0))
                except json.JSONDecodeError:
                    print(f"     ⚠️  JSON inválido (intento {attempt+1}/3), rescatando segmentos…")
                    if attempt < 2:
                        time.sleep(2)
                        continue
                    # last attempt: salvage individual segment objects via regex
                    segs_raw = re.findall(
                        r'\{\s*"start"\s*:\s*([\d.]+)\s*,\s*"end"\s*:\s*([\d.]+)\s*,\s*"text"\s*:\s*"((?:[^"\\]|\\.)*)"\s*\}',
                        content,
                    )
                    data = {"segments": [{"start": float(s), "end": float(e), "text": t} for s, e, t in segs_raw]}
                    print(f"     🛟 rescatados {len(data['segments'])} segmento(s)")
            else:
                if attempt < 2:
                    continue
                raise
        segs = data.get("segments", [])
        cleaned: List[dict] = []
        dropped = 0
        for s in segs:
            txt = (s.get("text") or "").strip()
            if not txt:
                continue
            try:
                st = float(s["start"])
                en = float(s["end"])
            except (KeyError, TypeError, ValueError):
                dropped += 1
                continue
            dur = max(en - st, 0.0)
            # Discard "aplastados": un segmento que afirma durar 30 s pero
            # contiene 15.000 caracteres es la transcripción entera comprimida
            # en una ventana corta (bug observado de Gemini). Tope generoso:
            # 35 chars/seg ≈ 350 wpm, muy por encima del habla humana real.
            max_chars = max(int(dur * 35), 400)
            if len(txt) > max_chars:
                dropped += 1
                continue
            cleaned.append({"start": st + slice_start, "end": en + slice_start, "text": txt})
        if dropped:
            print(f"     🧹 descartados {dropped} segmento(s) aplastado(s)")
        # Expose stats for the caller without changing the return signature.
        transcribe_slice.last_stats = {  # type: ignore[attr-defined]
            "segments_returned": len(segs),
            "segments_dropped": dropped,
        }
        return cleaned
    raise RuntimeError(f"transcribe failed after 3 attempts for {slice_path}")


# ---------- Chunking + embeddings ----------

def chunk_segments(segments: List[dict]) -> List[dict]:
    chunk_segments.last_stats = {"chunks_truncated": 0}  # type: ignore[attr-defined]
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
            # Guardia anti-corrupción: si el texto excede lo plausible para la
            # ventana, recórtalo. Evita filas con la transcripción entera
            # aplastada en un chunk de 60 s.
            max_chunk_chars = CHUNK_SECONDS * 40  # ~2.400 chars
            if len(text) > max_chunk_chars:
                print(f"     ⚠️  chunk @{int(win_start)}s recortado ({len(text)}→{max_chunk_chars} chars)")
                text = text[:max_chunk_chars]
                chunk_segments.last_stats["chunks_truncated"] += 1  # type: ignore[attr-defined]
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


def save_chunks(video_id: str, chunks: List[dict], stats: Optional[dict] = None):
    # replace existing
    sb.table("yt_transcript_chunks").delete().eq("video_id", video_id).execute()
    # No embeddings: full-text search en Postgres se encarga de la búsqueda
    rows = [
        {
            "video_id": video_id,
            "chunk_index": i,
            "start_seconds": c["start"],
            "end_seconds": c["end"],
            "text": normalize_brand(c["text"]),
        }
        for i, c in enumerate(chunks)
    ]
    # insert in batches of 200 to avoid payload limits
    for i in range(0, len(rows), 200):
        sb.table("yt_transcript_chunks").insert(rows[i : i + 200]).execute()

    sb.table("yt_videos").update({"indexed_at": "now()"}).eq("video_id", video_id).execute()
    meta = dict(stats or {})
    meta["chunks_saved"] = len(rows)
    meta["script_version"] = SCRIPT_VERSION
    sb.table("yt_ingest_log").insert(
        {
            "video_id": video_id,
            "status": "indexed",
            "message": f"{len(rows)} chunks",
            "metadata": meta,
        }
    ).execute()

    # Emit a separate corruption alert if thresholds were crossed.
    seg_drop = int(meta.get("segments_dropped", 0))
    chunk_trunc = int(meta.get("chunks_truncated", 0))
    if seg_drop >= 5 or chunk_trunc >= 1:
        sb.table("yt_ingest_log").insert(
            {
                "video_id": video_id,
                "status": "corruption_alert",
                "message": f"{seg_drop} segmento(s) descartado(s), {chunk_trunc} chunk(s) recortado(s)",
                "metadata": meta,
            }
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
        total_segments_returned = 0
        total_segments_dropped = 0
        slices_failed = 0
        for idx, (path, start) in enumerate(slices):
            print(f"   📝 transcribing slice {idx+1}/{len(slices)}…")
            try:
                segs = transcribe_slice(path, start)
                stats = getattr(transcribe_slice, "last_stats", {}) or {}
                total_segments_returned += int(stats.get("segments_returned", 0))
                total_segments_dropped += int(stats.get("segments_dropped", 0))
                all_segments.extend(segs)
            except Exception as se:
                slices_failed += 1
                print(f"   ⚠️  slice {idx+1} falló ({se}) — continuando con los demás")
            path.unlink(missing_ok=True)
        audio.unlink(missing_ok=True)

        if not all_segments:
            log_error(vid, "no segments returned")
            return "no segments"

        chunks = chunk_segments(all_segments)
        chunk_stats = getattr(chunk_segments, "last_stats", {}) or {}
        print(f"   ✂️  {len(chunks)} chunk(s) → guardando…")
        run_stats = {
            "slices_total": len(slices),
            "slices_failed": slices_failed,
            "segments_returned": total_segments_returned,
            "segments_dropped": total_segments_dropped,
            "chunks_truncated": int(chunk_stats.get("chunks_truncated", 0)),
        }
        save_chunks(vid, chunks, run_stats)
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
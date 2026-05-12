#!/usr/bin/env python3
"""
status.py — Muestra el estado de diarización de la base de datos.
Uso:
    ./run-status.sh               # via wrapper
    python3 status.py             # directo (necesita .env)
"""
import os
import sys
import json

# ── deps ──────────────────────────────────────────────────────────
try:
    from dotenv import load_dotenv
except ImportError:
    print("❌ python-dotenv no instalado. Instala con: pip install python-dotenv")
    sys.exit(1)

try:
    from supabase import create_client
except ImportError:
    print("❌ supabase-py no instalado. Instala con: pip install supabase")
    sys.exit(1)

# ── colores ANSI ────────────────────────────────────────────────
class C:
    OK = "\033[32m"; WARN = "\033[33m"; ERR = "\033[31m"
    CYAN = "\033[36m"; MAG = "\033[35m"; BOLD = "\033[1m"
    DIM = "\033[2m"; RST = "\033[0m"; UNDER = "\033[4m"

# ── helpers ─────────────────────────────────────────────────────
def fmt_secs(s):
    if s is None: return "—"
    m, sec = divmod(int(s), 60)
    h, m = divmod(m, 60)
    if h: return f"{h}h{m:02d}m"
    return f"{m}m{sec:02d}s"

def bar(pct, width=20):
    filled = int(round(width * pct / 100))
    bar_str = "█" * filled + "░" * (width - filled)
    color = C.OK if pct >= 90 else (C.WARN if pct >= 50 else C.ERR)
    return f"{color}{bar_str}{C.RST}"

# ── carga .env ──────────────────────────────────────────────────
env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
if os.path.exists(env_path):
    load_dotenv(env_path)
else:
    # también buscar en cwd
    load_dotenv()

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_PUBLISHABLE_KEY") or os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print(f"{C.ERR}Error: no se encontró SUPABASE_URL ni SUPABASE_KEY en .env{C.RST}")
    print("Asegúrate de tener VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en tu .env")
    sys.exit(1)

# ── conexión ────────────────────────────────────────────────────
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print(f"\n{C.BOLD}🎙️  Status de Diarización — Vacílate El Podcast{C.RST}\n")

# ── resumen global ──────────────────────────────────────────────
print(f"{C.CYAN}┌{'─'*68}┐{C.RST}")
print(f"{C.CYAN}│{C.RST} {C.BOLD}Resumen Global{C.RST}{' '*53}{C.CYAN}│{C.RST}")
print(f"{C.CYAN}├{'─'*68}┤{C.RST}")

videos_resp = supabase.table("yt_videos").select("video_id,title,duration_seconds,published_at", count="exact").order("published_at", desc=True).limit(1).execute()
total_videos = videos_resp.count or 0

chunks_resp = supabase.table("yt_transcript_chunks").select("id,speaker", count="exact").execute()
total_chunks = chunks_resp.count or 0

spk_resp = supabase.table("yt_transcript_chunks").select("id,speaker", count="exact").not_.is_("speaker", "null").execute()
with_speaker = spk_resp.count or 0

pct = round(with_speaker / total_chunks * 100, 1) if total_chunks else 0.0

# speaker breakdown
jhon_r = supabase.table("yt_transcript_chunks").select("id", count="exact").eq("speaker", "jhon").execute()
juan_r = supabase.table("yt_transcript_chunks").select("id", count="exact").eq("speaker", "juan").execute()
inv_r = supabase.table("yt_transcript_chunks").select("id", count="exact").eq("speaker", "invitado").execute()

print(f"{C.CYAN}│{C.RST}  Total videos en canal          : {C.BOLD}{total_videos}{C.RST}")
print(f"{C.CYAN}│{C.RST}  Total chunks de transcripción  : {C.BOLD}{total_chunks:,}{C.RST}")
print(f"{C.CYAN}│{C.RST}  Chunks con speaker asignado    : {C.OK if pct>=90 else C.WARN}{with_speaker:,} ({pct}%){C.RST}")
print(f"{C.CYAN}│{C.RST}  Chunks Jhon                    : {C.BOLD}{jhon_r.count or 0:,}{C.RST}")
print(f"{C.CYAN}│{C.RST}  Chunks Juan                    : {C.BOLD}{juan_r.count or 0:,}{C.RST}")
print(f"{C.CYAN}│{C.RST}  Chunks Invitado                : {C.BOLD}{inv_r.count or 0:,}{C.RST}")
print(f"{C.CYAN}└{'─'*68}┘{C.RST}\n")

# ── videos con transcripción ───────────────────────────────────
print(f"{C.MAG}┌{'─'*68}┐{C.RST}")
print(f"{C.MAG}│{C.RST} {C.BOLD}Episodios con Transcripción (más recientes){C.RST}{' '*20}{C.MAG}│{C.RST}")
print(f"{C.MAG}├{'─'*68}┤{C.RST}")

resp = supabase.rpc("get_diarization_status", {"limit_count": 15}).execute()
if resp.data:
    for row in resp.data:
        vid = row.get("video_id", "—")
        title = row.get("title", "—")[:40]
        dur = fmt_secs(row.get("duration_seconds"))
        total = row.get("total_chunks", 0)
        ws = row.get("chunks_with_speaker", 0)
        jhon = row.get("jhon_chunks", 0)
        juan = row.get("juan_chunks", 0)
        inv = row.get("invitado_chunks", 0)
        pct_e = round(ws / total * 100, 1) if total else 0.0
        status_icon = C.OK + "✓" if pct_e >= 90 else (C.WARN + "~" if pct_e > 0 else C.ERR + "✗")
        print(f"{C.MAG}│{C.RST} {status_icon}{C.RST} {C.BOLD}{title:<40}{C.RST} | {dur:>8} | {C.DIM}{vid}{C.RST}")
        print(f"{C.MAG}│{C.RST}   {bar(pct_e)} {pct_e:>5.1f}%  {C.CYAN}Jhon:{jhon:>4}  Juan:{juan:>4}  Inv:{inv:>4}{C.RST}  ({total} chunks)")
    print(f"{C.MAG}└{'─'*68}┘{C.RST}")
else:
    print(f"{C.MAG}│{C.RST}  {C.ERR}No hay datos disponibles.{C.RST}")
    print(f"{C.MAG}└{'─'*68}┘{C.RST}")

print()

# ── videos SIN transcripción ──────────────────────────────────
print(f"{C.WARN}┌{'─'*68}┐{C.RST}")
print(f"{C.WARN}│{C.RST} {C.BOLD}Videos SIN transcripción (sin chunks){C.RST}{' '*28}{C.WARN}│{C.RST}")
print(f"{C.WARN}├{'─'*68}┤{C.RST}")

no_tx_resp = supabase.rpc("get_videos_without_transcription", {"limit_count": 10}).execute()
if no_tx_resp.data:
    for row in no_tx_resp.data:
        title = row.get("title", "—")[:50]
        dur = fmt_secs(row.get("duration_seconds"))
        print(f"{C.WARN}│{C.RST}  {C.ERR}✗{C.RST} {title:<50} | {dur:>8}")
    print(f"{C.WARN}└{'─'*68}┘{C.RST}")
else:
    print(f"{C.WARN}│{C.RST}  {C.OK}¡Todos los videos tienen transcripción!{C.RST}")
    print(f"{C.WARN}└{'─'*68}┘{C.RST}")

print()

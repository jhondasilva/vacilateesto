#!/usr/bin/env python3
"""
Lista los podcasts que aún NO han sido diarizados.
Mismo criterio que diarize.py: un video se considera "diarizado" si tiene
al menos un chunk en yt_transcript_chunks con speaker no nulo.

Uso:
    python pending-diarize.py            # lista todos los pendientes
    python pending-diarize.py --limit 50 # solo los próximos 50
    python pending-diarize.py --count    # solo imprime el conteo
"""
import argparse
import os
import sys

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://dpgvanocynbrmqvgvgvd.supabase.co")
KEY = (
    os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    or os.environ.get("SUPABASE_PUBLISHABLE_KEY")
    or os.environ.get("VITE_SUPABASE_ANON_KEY")
)
if not KEY:
    print("❌ Falta SUPABASE_SERVICE_ROLE_KEY (o anon key) en .env", file=sys.stderr)
    sys.exit(1)

sb = create_client(SUPABASE_URL, KEY)


def fetch_done_video_ids() -> set:
    done: set = set()
    page = 0
    PAGE = 1000
    while True:
        c = (
            sb.table("yt_transcript_chunks")
            .select("video_id")
            .not_.is_("speaker", "null")
            .range(page * PAGE, page * PAGE + PAGE - 1)
            .execute()
        )
        rows = c.data or []
        if not rows:
            break
        for row in rows:
            done.add(row["video_id"])
        if len(rows) < PAGE:
            break
        page += 1
    return done


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=None, help="Máximo de pendientes a listar")
    ap.add_argument("--count", action="store_true", help="Solo imprime el resumen")
    args = ap.parse_args()

    r = (
        sb.table("yt_videos")
        .select("video_id,title,published_at,duration_seconds")
        .eq("kind", "podcast")
        .order("published_at", desc=True)
        .limit(1000)
        .execute()
    )
    podcasts = r.data or []
    done = fetch_done_video_ids()
    pending = [v for v in podcasts if v["video_id"] not in done]

    print()
    print("=" * 70)
    print("  PENDIENTES DE DIARIZAR — Vacílate Esto")
    print("=" * 70)
    print(f"  Podcasts totales:    {len(podcasts)}")
    print(f"  Ya diarizados:       {len(done & {v['video_id'] for v in podcasts})}")
    print(f"  Pendientes:          {len(pending)}")
    print("=" * 70)

    if args.count:
        return

    items = pending if args.limit is None else pending[: args.limit]
    if not items:
        print("\n  ✅ Nada pendiente — todos los podcasts están diarizados.\n")
        return

    print(f"\n  Mostrando {len(items)} de {len(pending)}:\n")
    for i, v in enumerate(items, 1):
        dur = v.get("duration_seconds") or 0
        h, m = dur // 3600, (dur % 3600) // 60
        dur_str = f"{h}h{m:02d}m" if h else f"{m}min"
        pub = (v.get("published_at") or "")[:10]
        print(f"  {i:3d}. {pub} | {dur_str:>7s} | {v['video_id']} | {v['title'][:60]}")
    print()


if __name__ == "__main__":
    main()
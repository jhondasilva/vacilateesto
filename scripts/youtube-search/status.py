#!/usr/bin/env python3
"""
Resumen de estado de la ingesta del buscador semántico.
Se conecta con el anon key (solo lectura pública).
"""
import os
import sys

from supabase import create_client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://dpgvanocynbrmqvgvgvd.supabase.co")
ANON_KEY = os.environ.get("SUPABASE_PUBLISHABLE_KEY", os.environ.get("VITE_SUPABASE_ANON_KEY"))

sb = create_client(SUPABASE_URL, ANON_KEY)


def print_status():
    # Totales
    v = sb.table("yt_videos").select("kind, indexed_at", count="exact").execute()
    total = v.count or 0
    print(f"\n{'='*60}")
    print(f"  ESTADO DE INGESTA — Vacílate Esto")
    print(f"{'='*60}\n")
    print(f"  Videos totales en catálogo: {total}")

    # Por tipo
    for kind in ["podcast", "short"]:
        rows = sb.table("yt_videos").select("indexed_at").eq("kind", kind).execute().data or []
        total_kind = len(rows)
        indexed = sum(1 for r in rows if r.get("indexed_at"))
        pending = total_kind - indexed
        print(f"  {kind.upper():8s} — indexados: {indexed:4d} / totales: {total_kind:4d}  →  faltan: {pending}")

    # Pendientes
    print(f"\n{'-'*60}")
    print("  VIDEOS PENDIENTES (sin indexed_at):")
    print(f"{'-'*60}")
    pending = sb.table("yt_videos").select("video_id, title, kind, duration_seconds")\
        .is_("indexed_at", "null")\
        .order("published_at", desc=True)\
        .execute().data or []
    if not pending:
        print("  ✅ Ninguno — todo indexado!")
    else:
        for r in pending:
            dur = r.get("duration_seconds") or 0
            dur_str = f"{dur//60}min" if dur >= 60 else f"{dur}s"
            print(f"  {r['kind']:8s} | {dur_str:>6s} | {r['video_id']} | {r['title'][:55]}")

    print(f"\n{'='*60}\n")

    # Logs recientes de error
    logs = sb.table("yt_ingest_log")\
        .select("video_id, status, message, created_at")\
        .eq("status", "error")\
        .order("created_at", desc=True)\
        .limit(5)\
        .execute().data or []
    if logs:
        print("  ERRORES RECIENTES:")
        for l in logs:
            print(f"    {l['video_id']} | {l['status']} | {l['message'][:60]}")
        print()

if __name__ == "__main__":
    print_status()

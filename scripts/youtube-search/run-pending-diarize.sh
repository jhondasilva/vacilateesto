#!/usr/bin/env bash
# run-pending-diarize.sh — lista los podcasts pendientes de diarizar.
# Uso:
#   ./run-pending-diarize.sh            # lista todos los pendientes
#   ./run-pending-diarize.sh --limit 50 # solo los próximos 50
#   ./run-pending-diarize.sh --count    # solo el resumen numérico

set -euo pipefail

INGEST_DIR="/Volumes/Jhon ST5/vacilate-ingest"
RED=$'\033[0;31m'; NC=$'\033[0m'
fail() { echo "${RED}❌ $*${NC}" >&2; exit 1; }

[[ -d "$INGEST_DIR" ]] || fail "Disco 'Jhon ST5' no está montado."
cd "$INGEST_DIR"

[[ -f .env ]] || fail "Falta .env en $INGEST_DIR"
[[ -f pending-diarize.py ]] || fail "Falta pending-diarize.py en $INGEST_DIR (cópialo desde scripts/youtube-search/)"

VENV_DIR="venv"
[[ -d .venv && ! -d venv ]] && VENV_DIR=".venv"

if [[ -x "$VENV_DIR/bin/python" ]]; then
  PYTHON="$VENV_DIR/bin/python"
else
  PYTHON="python3"
fi

exec "$PYTHON" pending-diarize.py "$@"
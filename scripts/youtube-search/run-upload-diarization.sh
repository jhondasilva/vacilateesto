#!/usr/bin/env bash
# run-upload-diarization.sh — sube los .json de diarización a Supabase.
# Uso:
#   ./run-upload-diarization.sh ./diarization-out
#   ./run-upload-diarization.sh ./diarization-out --dry-run
#   ./run-upload-diarization.sh ./diarization-out --overwrite

set -euo pipefail

INGEST_DIR="/Volumes/Jhon ST5/vacilate-ingest"
GREEN=$'\033[0;32m'; RED=$'\033[0;31m'; NC=$'\033[0m'
ok()   { echo "${GREEN}✅ $*${NC}"; }
fail() { echo "${RED}❌ $*${NC}" >&2; exit 1; }

[[ -d "$INGEST_DIR" ]] || fail "Disco 'Jhon ST5' no está montado."
cd "$INGEST_DIR"

[[ -f upload-diarization.py ]] || fail "Falta upload-diarization.py en $INGEST_DIR (cópialo desde el repo)."
[[ -f .env ]] || fail "Falta .env"
for v in SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY; do
  grep -q "^${v}=" .env || fail "Falta $v en .env"
done

VENV_DIR="venv"; [[ -d .venv && ! -d venv ]] && VENV_DIR=".venv"
if [[ ! -x "$VENV_DIR/bin/python" ]]; then
  python3 -m venv "$VENV_DIR"
  "$VENV_DIR/bin/pip" install --quiet --upgrade pip
fi
"$VENV_DIR/bin/python" -c "import requests, supabase, dotenv" 2>/dev/null || \
  "$VENV_DIR/bin/pip" install --quiet requests supabase python-dotenv
ok "venv listo"

exec "$VENV_DIR/bin/python" upload-diarization.py "$@"
#!/usr/bin/env bash
# run-diarize.sh — wrapper para correr diarize.py (identifica Juan vs Jhon)
# Uso: ./run-diarize.sh --limit 5
#      ./run-diarize.sh --video-id ABC123
#      ./run-diarize.sh --limit 1 --dry-run --max-minutes 3   (prueba rápida)

set -euo pipefail

INGEST_DIR="/Volumes/Jhon ST5/vacilate-ingest"
GREEN=$'\033[0;32m'; YELLOW=$'\033[1;33m'; RED=$'\033[0;31m'; NC=$'\033[0m'
ok()   { echo "${GREEN}✅ $*${NC}"; }
warn() { echo "${YELLOW}⚠️  $*${NC}"; }
fail() { echo "${RED}❌ $*${NC}" >&2; exit 1; }

[[ -d "$INGEST_DIR" ]] || fail "Disco 'Jhon ST5' no está montado."
cd "$INGEST_DIR"
ok "Carpeta: $INGEST_DIR"

[[ -f diarize.py ]] || fail "Falta diarize.py en $INGEST_DIR. Copialo desde el repo de Lovable."

for t in ffmpeg yt-dlp python3; do
  command -v "$t" >/dev/null || fail "Falta '$t'. Instala: brew install ffmpeg && pipx install yt-dlp"
done

[[ -f .env ]] || fail "Falta .env"
for v in SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY LOVABLE_API_KEY HUGGINGFACE_TOKEN; do
  grep -q "^${v}=" .env || fail "Falta $v en .env. HUGGINGFACE_TOKEN se obtiene en https://hf.co/settings/tokens (acepta términos en https://hf.co/pyannote/speaker-diarization-3.1)"
done
ok ".env válido (incluye HUGGINGFACE_TOKEN)"

VENV_DIR="venv"
[[ -d .venv && ! -d venv ]] && VENV_DIR=".venv"

# pyannote + torch son pesados; chequeo independiente del venv del ingest
venv_diarize_ok() {
  [[ -x "$VENV_DIR/bin/python" ]] && "$VENV_DIR/bin/python" -c "import pyannote.audio, torch, requests, supabase, dotenv" 2>/dev/null
}
if ! venv_diarize_ok; then
  warn "Faltan dependencias de diarización (pyannote.audio + torch). Instalando…"
  [[ -x "$VENV_DIR/bin/python" ]] || { rm -rf "$VENV_DIR"; python3 -m venv "$VENV_DIR"; }
  "$VENV_DIR/bin/pip" install --quiet --upgrade pip
  "$VENV_DIR/bin/pip" install --quiet requests supabase python-dotenv
  # torch nativo Apple Silicon (MPS) si la Mac es M-series
  if [[ "$(uname -m)" == "arm64" ]]; then
    "$VENV_DIR/bin/pip" install --quiet torch torchaudio
  else
    "$VENV_DIR/bin/pip" install --quiet torch torchaudio
  fi
  "$VENV_DIR/bin/pip" install --quiet pyannote.audio
  ok "dependencias instaladas"
else
  ok "venv listo con pyannote + torch"
fi

sleepval="$(pmset -g 2>/dev/null | awk '/disksleep/ {print $2}')"
if [[ "${sleepval:-0}" != "0" ]]; then
  warn "disksleep=${sleepval}min. Para evitar cortes: sudo pmset -a disksleep 0"
fi

echo
echo "🚀 Ejecutando: caffeinate -i python diarize.py $*"
echo
exec caffeinate -i "$VENV_DIR/bin/python" diarize.py "$@"
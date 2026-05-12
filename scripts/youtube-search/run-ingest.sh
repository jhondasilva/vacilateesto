#!/usr/bin/env bash
# run-ingest.sh — wrapper para correr ingest.py desde el disco externo
#
# Qué hace:
#   1. Detecta discos externos montados en /Volumes
#   2. Busca la carpeta que contenga ingest.py (cachea el resultado en ~/.vacilate-ingest-path)
#   3. Verifica que el disco no esté en sleep y que ffmpeg/yt-dlp existan
#   4. Activa el venv (lo recrea si está roto)
#   5. Verifica que .env exista
#   6. Ejecuta ingest.py con caffeinate, pasándole los args que le mandes
#
# Uso:
#   ./run-ingest.sh --limit 20 --kind podcast
#   ./run-ingest.sh --video-id ABC123
#
# Forzar otra ruta:
#   VACILATE_INGEST_DIR=/Volumes/MiDisco/path/youtube-search ./run-ingest.sh ...

set -euo pipefail

CACHE_FILE="$HOME/.vacilate-ingest-path"
RED=$'\033[0;31m'; GREEN=$'\033[0;32m'; YELLOW=$'\033[1;33m'; BLUE=$'\033[0;34m'; NC=$'\033[0m'

info()  { echo "${BLUE}ℹ️  $*${NC}"; }
ok()    { echo "${GREEN}✅ $*${NC}"; }
warn()  { echo "${YELLOW}⚠️  $*${NC}"; }
fail()  { echo "${RED}❌ $*${NC}" >&2; exit 1; }

# ---------- 1. Resolver carpeta de ingest ----------
find_ingest_dir() {
  # a) override por env var
  if [[ -n "${VACILATE_INGEST_DIR:-}" ]]; then
    [[ -f "$VACILATE_INGEST_DIR/ingest.py" ]] || fail "VACILATE_INGEST_DIR no contiene ingest.py: $VACILATE_INGEST_DIR"
    echo "$VACILATE_INGEST_DIR"; return
  fi

  # b) cache previa válida
  if [[ -f "$CACHE_FILE" ]]; then
    local cached; cached="$(cat "$CACHE_FILE")"
    if [[ -f "$cached/ingest.py" ]]; then
      echo "$cached"; return
    fi
    warn "Caché de ruta inválida ($cached), buscando de nuevo…" >&2
  fi

  # c) escanear /Volumes (discos externos)
  info "Buscando ingest.py en /Volumes…" >&2
  local volumes=()
  while IFS= read -r v; do
    # ignorar el disco interno (Macintosh HD suele estar en /)
    [[ "$v" == "/Volumes/Macintosh HD" ]] && continue
    volumes+=("$v")
  done < <(ls -d /Volumes/*/ 2>/dev/null || true)

  if [[ ${#volumes[@]} -eq 0 ]]; then
    fail "No se detectó ningún disco externo en /Volumes. Conectá el disco y probá de nuevo."
  fi

  local found=""
  for vol in "${volumes[@]}"; do
    info "  escaneando $vol …" >&2
    # find con timeout para no colgarse en discos grandes
    local hit
    hit="$(find "$vol" -maxdepth 8 -type f -name "ingest.py" -path "*youtube-search*" 2>/dev/null | head -n1 || true)"
    if [[ -n "$hit" ]]; then
      found="$(dirname "$hit")"
      break
    fi
  done

  [[ -z "$found" ]] && fail "No encontré ingest.py en ningún disco externo. Pasá la ruta con: VACILATE_INGEST_DIR=/ruta ./run-ingest.sh"

  echo "$found" > "$CACHE_FILE"
  ok "Encontrado: $found (cacheado en $CACHE_FILE)" >&2
  echo "$found"
}

INGEST_DIR="$(find_ingest_dir)"
cd "$INGEST_DIR"
ok "Carpeta de ingest: $INGEST_DIR"

# ---------- 2. Verificar que el disco siga montado y accesible ----------
if ! touch "$INGEST_DIR/.write-test" 2>/dev/null; then
  fail "No puedo escribir en $INGEST_DIR — ¿el disco se desmontó o es read-only?"
fi
rm -f "$INGEST_DIR/.write-test"
ok "Disco accesible y escribible"

# ---------- 3. Herramientas requeridas ----------
for tool in ffmpeg ffprobe yt-dlp python3; do
  command -v "$tool" >/dev/null 2>&1 || fail "Falta '$tool' en el PATH. Instalá con: brew install ffmpeg && pipx install yt-dlp"
done
ok "ffmpeg, ffprobe, yt-dlp, python3 disponibles"

# ---------- 4. .env ----------
[[ -f .env ]] || fail "No existe .env en $INGEST_DIR. Creá uno con YOUTUBE_API_KEY, LOVABLE_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY."
for var in YOUTUBE_API_KEY LOVABLE_API_KEY SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY; do
  grep -q "^${var}=" .env || fail "Falta $var en .env"
done
ok ".env presente con las 4 claves"

# ---------- 5. venv ----------
venv_ok() {
  [[ -x .venv/bin/python ]] && .venv/bin/python -c "import requests, supabase, dotenv" 2>/dev/null
}
if ! venv_ok; then
  warn "venv ausente o roto (común en discos externos por paths absolutos). Recreando…"
  rm -rf .venv
  python3 -m venv .venv
  .venv/bin/pip install --quiet --upgrade pip
  .venv/bin/pip install --quiet requests supabase python-dotenv
  ok "venv recreado"
else
  ok "venv funcional"
fi

# ---------- 6. Evitar sleep del disco durante la corrida ----------
if command -v pmset >/dev/null 2>&1; then
  current_sleep="$(pmset -g | awk '/disksleep/ {print $2}')"
  if [[ "${current_sleep:-0}" != "0" ]]; then
    warn "disksleep está en ${current_sleep}min. Para evitar cortes, corré:"
    warn "    sudo pmset -a disksleep 0"
    warn "(revertí después con: sudo pmset -a disksleep 10)"
  fi
fi

# ---------- 7. Ejecutar ----------
echo
info "Lanzando: caffeinate -i python ingest.py $*"
echo
exec caffeinate -i .venv/bin/python ingest.py "$@"
#!/bin/bash
# run-status.sh — Muestra el estado de diarización desde la terminal.
# Uso: ./run-status.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
VENV="${PROJECT_ROOT}/.venv"

# Si no hay venv, usar pip global (el usuario ya lo debe tener)
if [ -d "$VENV" ]; then
    PYTHON="$VENV/bin/python3"
else
    PYTHON="python3"
fi

echo "🎙️  Status de diarización — Vacílate El Podcast"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

"$PYTHON" "$SCRIPT_DIR/status.py"

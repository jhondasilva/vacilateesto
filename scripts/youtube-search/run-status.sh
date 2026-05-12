#!/bin/bash
# run-status.sh — Muestra el estado de diarización desde la terminal.
# Uso: ./run-status.sh              # snapshot único
#      ./run-status.sh --watch      # refresca cada 30s

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

"$PYTHON" "$SCRIPT_DIR/status.py" "$@"

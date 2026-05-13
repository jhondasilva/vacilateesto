#!/usr/bin/env bash
# run-pending.sh — procesa solo los videos que aún no están indexados
# Uso:
#   cd scripts/youtube-search
#   source .venv/bin/activate
#   bash run-pending.sh

set -euo pipefail

echo "📋 Videos pendientes de indexar:"
python3 status.py

echo ""
echo "🚀 Iniciando ingesta de videos faltantes..."
echo ""

# Procesar el podcast faltante primero (si hay)
python3 ingest.py --video-id hFowPqZtFf0 || true

# Luego procesar los shorts faltantes (máximo 50)
python3 ingest.py --limit 50 --kind short || true

echo ""
echo "📋 Estado final:"
python3 status.py

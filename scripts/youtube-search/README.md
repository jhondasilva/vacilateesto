# Ingesta del buscador semántico

Este script transcribe los videos del canal **Vacílate Esto** en YouTube usando
Lovable AI (Gemini), genera embeddings y los sube a Lovable Cloud para que la
página `/buscador` los pueda consultar.

## Setup (una vez, ~10 minutos)

### 1. Instalar dependencias del sistema

En tu Mac:

```bash
brew install ffmpeg
pipx install yt-dlp        # o:  pip install yt-dlp
```

Verifica:
```bash
ffmpeg -version
yt-dlp --version
```

### 2. Crear entorno Python e instalar paquetes

```bash
cd scripts/youtube-search
python3 -m venv .venv
source .venv/bin/activate
pip install requests supabase python-dotenv
```

### 3. Crear archivo `.env`

En la misma carpeta `scripts/youtube-search/`, crea un archivo `.env` con:

```env
YOUTUBE_API_KEY=AIzaSy...        # la que generaste en Google Cloud
LOVABLE_API_KEY=lvbl_...         # te la doy yo (está en el backend)
SUPABASE_URL=https://dpgvanocynbrmqvgvgvd.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ... # te la doy yo (está en el backend)
```

> ⚠️ **No subas este archivo a Git**. Ya está en `.gitignore` por defecto.

## Uso

### Prueba inicial — 20 podcasts más recientes

```bash
source .venv/bin/activate
python ingest.py --limit 20 --kind podcast
```

Esto procesa los 20 podcasts más nuevos que **aún no están indexados**.
Tiempo estimado: 2-4 horas (depende de la duración de los episodios y de tu
conexión).

### Indexar todo el catálogo

```bash
# Solo podcasts (200 videos, ~24-36h)
python ingest.py --limit 1000 --kind podcast

# Shorts (600 videos, ~6-8h)
python ingest.py --limit 1000 --kind short

# Todo de una (≈40h)
python ingest.py --limit 1000 --kind all
```

### Procesar un video específico (debug)

```bash
python ingest.py --video-id ABC123XYZ
```

### Reanudar después de Ctrl+C

Solo vuelve a correr el mismo comando. El script salta automáticamente los
videos ya indexados (campo `indexed_at` en la tabla `yt_videos`).

## Cómo funciona

```
 1. YouTube Data API → lista todos los videos del canal
 2. yt-dlp           → baja el m4a de mejor calidad
 3. ffmpeg           → re-encodea a 32kbps mono (≈3.6 MB cada 15 min)
 4. ffmpeg           → trocea en segmentos de 15 minutos
 5. Lovable AI       → Gemini transcribe cada trozo a JSON con timestamps
 6. Python           → reagrupa en chunks de 60s con 10s de solape
 7. Lovable AI       → genera embeddings (1536 dims) de cada chunk
 8. Supabase         → guarda chunks + embedding en yt_transcript_chunks
```

## Costos estimados (Lovable AI)

- **Transcripción** (`gemini-2.5-flash` con audio): ~$0.30 por hora de audio.
  - 200 podcasts × 2.5h ≈ 500h × $0.30 = **~$150**
  - 600 shorts × 1min ≈ 10h × $0.30 = **~$3**
- **Embeddings** (`text-embedding-004`): ~$0.50 total (negligible).

Total para indexar todo: **~$155 una sola vez**.

## Re-procesar un video ya indexado

```bash
# 1. borrar la fila existente
# usa la consola SQL de Lovable Cloud:
#   DELETE FROM yt_videos WHERE video_id = 'ABC123';

# 2. correr de nuevo
python ingest.py --video-id ABC123
```

## Dónde ver el progreso

Tabla `yt_ingest_log` en la base. Cada video deja un registro con `status`
(`indexed`, `error`, `no_segments`, etc.) y `message`.

## Refresco automático (opcional, después de Fase 1)

Para indexar automáticamente los videos nuevos que vayas subiendo, podés:

- Correr `python ingest.py --limit 5` cada semana en `cron`/`launchd` de tu Mac.
- O migrar el script a un VPS pequeño ($5/mes Railway/Fly.io).
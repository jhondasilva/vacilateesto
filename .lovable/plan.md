

# Buscador semántico de episodios y shorts con timestamps

## Qué vas a tener

Una página `/buscador` (y opcionalmente embebida en Home) donde el usuario escribe algo como *"cuando hablaron de Roraima"* o *"la mejor arepa de Caracas"* y obtiene:

- Lista de resultados con miniatura, título, tipo (Podcast / Short), y un **fragmento del momento exacto** donde se menciona.
- Botón **"Ver desde el minuto 12:34"** que abre YouTube directamente en `youtu.be/VIDEO_ID?t=754s`.
- Búsqueda en español natural (no solo coincidencia exacta de palabras).

## Cómo funciona (alto nivel)

```text
YouTube (200 podcasts + 600 shorts)
        │
        ▼
[1] Ingesta automática (1 vez + diaria)
    - Lista todos los videos del canal
    - Descarga el transcript/subtítulos de cada uno
    - Corta el transcript en "chunks" de ~30-60 segundos
        │
        ▼
[2] Indexación con IA
    - Cada chunk se convierte en un "embedding" (vector)
    - Se guarda en la base con su videoId + timestamp
        │
        ▼
[3] Búsqueda
    Usuario escribe → embedding de la pregunta
    → match por similitud → top 10 chunks
    → link a YouTube con ?t=segundos
```

## Componentes a construir

### 1. Base de datos (3 tablas nuevas)

- **`yt_videos`**: `video_id`, `title`, `description`, `published_at`, `duration_seconds`, `thumbnail_url`, `kind` ('podcast' | 'short'), `view_count`.
- **`yt_transcript_chunks`**: `id`, `video_id`, `start_seconds`, `end_seconds`, `text`, `embedding` (vector 1536), `chunk_index`.
- **`yt_ingest_log`**: registro de qué se procesó y errores (para reintentos).

Se habilita la extensión `pgvector` y un índice IVFFlat sobre `embedding` para búsqueda rápida por similitud coseno.

### 2. Edge functions

- **`yt-ingest`**: lista videos del canal `@Vacilateestopodcast` vía YouTube Data API, baja transcripts (probamos `youtube-transcript` en Deno, fallback Whisper si no hay subtítulos), divide en chunks, genera embeddings con Lovable AI (`google/text-embedding-004`) y los guarda. Idempotente: solo procesa videos nuevos.
- **`yt-search`**: recibe query en español, genera su embedding, hace `SELECT ... ORDER BY embedding <=> :q LIMIT 10`, agrupa por video, devuelve resultados con timestamp y un snippet del texto.
- **`yt-cron`**: corre diariamente para ingestar videos nuevos (cron de Supabase).

### 3. Frontend

- **Página `/buscador`** con input grande tipo Spotlight, debounce 400ms, resultados en cards mostrando: thumbnail, título, badge Podcast/Short, snippet con highlight de la palabra buscada, timestamp `12:34`, botón "Ver en YouTube".
- Componente reutilizable **`<EpisodeSearch />`** opcionalmente embebido en `EpisodesSection` del Home.
- Estados: loading skeleton, vacío ("no encontramos nada"), error.

### 4. Costos y secrets necesarios

- **YouTube Data API v3**: gratis hasta 10.000 unidades/día (suficiente para listar y refrescar). Necesito que me des una `YOUTUBE_API_KEY` (te explico dónde sacarla cuando aprobemos).
- **Embeddings**: usamos Lovable AI (ya configurado, `LOVABLE_API_KEY` existe). Costo aprox: 800 videos × ~30 chunks × ~200 tokens ≈ 5M tokens iniciales, muy barato (~$0.50 una sola vez). Búsquedas en vivo: <0.001¢ cada una.
- **Whisper (fallback transcripción)**: solo si algún video no tiene subtítulos en YouTube. Opcional, lo dejamos para fase 2.

## Detalles técnicos clave

- **Chunking**: ventanas deslizantes de 60s con 10s de solape, para que la frase exacta no quede partida.
- **Timestamp link**: `https://youtu.be/${videoId}?t=${Math.floor(start_seconds)}s` (Shorts también respetan `?t=`).
- **Highlight**: marcamos la subcadena más parecida con `<mark>` en el snippet.
- **Idempotencia**: la ingesta usa `ON CONFLICT (video_id) DO NOTHING` y un hash del transcript para detectar cambios.
- **RLS**: tablas de lectura pública (es contenido público), escritura solo desde edge functions con service role.

## Fases de entrega

1. **Fase 1 (MVP)**: tablas + `yt-ingest` manual + `yt-search` + página `/buscador`. Indexamos solo los podcasts largos primero (~200 videos).
2. **Fase 2**: añadir los 600 shorts + cron diario + embed en Home.
3. **Fase 3 (opcional)**: fallback Whisper para videos sin subtítulos, filtros por host (JuanSofa/JhonSnacks), por fecha, por tipo.

## Lo que necesito de ti para empezar

1. Confirmar el handle/ID exacto del canal de YouTube (veo `@Vacilateestopodcast` en el código).
2. Una **YouTube Data API key** (gratis, te guío paso a paso en Google Cloud Console cuando apruebes).
3. ¿Avanzamos con **Fase 1** (solo podcasts) primero, o hacemos todo de una?


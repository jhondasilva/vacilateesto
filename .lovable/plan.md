# Plan: Integrar Apify para mejorar precisión de analíticas

## Objetivo
Usar Apify para obtener métricas directas de las plataformas que hoy no reportan bien (TikTok, YouTube) y cruzarlas con Metricool, evitando duplicados y ajustando el Media Kit y dashboards.

## Alcance
1. Recolectar métricas de TikTok y YouTube para las cuentas de Vacílate Esto / Vacílate El Mundial.
2. Almacenar esas métricas en tablas propias.
3. Exponer un endpoint manual y un job programado para refrescarlas.
4. Actualizar dashboards y Media Kit para usar las nuevas cifras cuando existan.

## Actores de Apify propuestos
- **TikTok**: `clockworks/tiktok-profile-scraper` para perfil + videos (impressions, views, likes, comments, shares). Requiere prueba de disponibilidad y créditos.
- **YouTube**: `pocesar/youtube-scraper` o actor oficial de Apify para extraer views de videos públicos y datos del canal.
- **Lives de TikTok**: `apify/tiktok-live-scraper` o similar si está disponible, para automatizar lo que hoy se carga a mano.

## Implementación técnica

### 1. Edge function `apify-sync`
- Ruta: `supabase/functions/apify-sync/index.ts`
- Recibe `?platform=tiktok|youtube` o `?all=true`.
- Valida JWT con `auth.uid()`.
- Llama al gateway de Apify usando `LOVABLE_API_KEY` y `APIFY_API_KEY`.
- Lanza el Actor, espera/pollea hasta terminar y lee el dataset.
- Inserta resultados en `public.apify_metrics`.

### 2. Tabla `public.apify_metrics`
```sql
CREATE TABLE public.apify_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  metric_type text NOT NULL,
  external_id text,
  value bigint,
  unit text,
  recorded_at timestamp with time zone NOT NULL,
  raw_data jsonb,
  created_at timestamp with time zone DEFAULT now()
);
```
GRANT a authenticated y service_role; enable RLS; policy de lectura por usuario autenticado.

### 3. UI de control
- Botón **"Sincronizar con Apify"** en `/dashboard/admin/mediakit-vem`.
- Sección opcional en dashboards de marca para mostrar métricas de Apify cuando existan.

### 4. Integración con métricas existentes
- `vem-cache-refresh` y `brand-cache-refresh` consultan `apify_metrics` para priorizar datos de Apify sobre estimaciones de Metricool cuando la fecha coincida.
- Media Kit y PDFs usan las cifras más recientes disponibles.

## Costos y riesgos
- Apify cobra por uso de Actors y unidades de cómputo. Cada sincronización puede costar desde pocos centavos hasta varios dólares dependiendo del actor y volumen.
- TikTok y YouTube anti-scraping pueden bloquear actores; se debe manejar errores y fallback a Metricool.

## Próximos pasos
1. Aprobar plan.
2. Probar cada actor con un dataset pequeño antes de automatizar.
3. Implementar tabla y edge function.
4. Integrar en dashboards y Media Kit.

CREATE OR REPLACE FUNCTION public.apify_metrics_by_month(p_platform text, p_handle text)
RETURNS TABLE (
  key text,
  label text,
  views bigint,
  likes bigint,
  comments bigint,
  shares bigint,
  videos bigint,
  last_sync timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH video_metrics AS (
    SELECT
      am.external_id,
      date_trunc('month', am.recorded_at) AS month,
      MAX(am.recorded_at) FILTER (WHERE am.unit = 'views') AS recorded_at,
      MAX(am.value) FILTER (WHERE am.unit = 'views') AS views,
      MAX(am.value) FILTER (WHERE am.unit = 'likes') AS likes,
      MAX(am.value) FILTER (WHERE am.unit = 'comments') AS comments,
      MAX(am.value) FILTER (WHERE am.unit = 'shares') AS shares,
      MAX(am.created_at) AS last_sync
    FROM public.apify_metrics am
    WHERE am.platform = p_platform
      AND am.metric_type = 'video'
    GROUP BY am.external_id, date_trunc('month', am.recorded_at)
  ),
  monthly AS (
    SELECT
      to_char(vm.month, 'YYYY-MM') AS key,
      to_char(vm.month, 'Mon YYYY') AS label,
      COALESCE(SUM(vm.views), 0) AS views,
      COALESCE(SUM(vm.likes), 0) AS likes,
      COALESCE(SUM(vm.comments), 0) AS comments,
      COALESCE(SUM(vm.shares), 0) AS shares,
      COUNT(DISTINCT vm.external_id) AS videos,
      MAX(vm.last_sync) AS last_sync
    FROM video_metrics vm
    GROUP BY to_char(vm.month, 'YYYY-MM'), to_char(vm.month, 'Mon YYYY')
  )
  SELECT m.key, m.label, m.views, m.likes, m.comments, m.shares, m.videos, m.last_sync
  FROM monthly m
  ORDER BY m.key DESC;
$$;

GRANT EXECUTE ON FUNCTION public.apify_metrics_by_month(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.apify_metrics_by_month(text, text) TO service_role;
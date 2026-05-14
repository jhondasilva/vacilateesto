
-- Cache table for daily Metricool snapshots per brand
create table if not exists public.brand_metricool_cache (
  id uuid primary key default gen_random_uuid(),
  brand_slug text not null,
  scope text not null check (scope in ('brand','all')),
  period_key text not null,
  period_label text,
  period_from timestamptz,
  period_to timestamptz,
  payload jsonb not null,
  refreshed_at timestamptz not null default now(),
  unique (brand_slug, scope, period_key)
);

alter table public.brand_metricool_cache enable row level security;

create policy "Brand users can read their cache"
on public.brand_metricool_cache
for select
to authenticated
using (
  is_allowed_user()
  or exists (
    select 1 from public.brands b
    where b.slug = brand_metricool_cache.brand_slug
      and public.user_has_brand_access(b.id)
  )
);

create index if not exists idx_brand_cache_lookup
  on public.brand_metricool_cache (brand_slug, scope, period_key);

-- Enable extensions for scheduled refresh
create extension if not exists pg_cron;
create extension if not exists pg_net;

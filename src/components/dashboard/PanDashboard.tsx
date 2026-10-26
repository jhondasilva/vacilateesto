import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Heart, Loader2 } from "lucide-react";
import DashboardLogo from "./DashboardLogo";
import { availableMetric, panDateBounds, selectPanPosts, sumPanMetric, type PanPost, type PanScope } from "@/lib/panDashboard";

type StoredPost = {
  platform: string; external_id: string; url: string | null; text: string | null;
  hashtags: string[] | null; published_at: string | null; thumbnail: string | null;
  views: number | null; likes: number | null; comments: number | null; shares: number | null; synced_at: string;
};
type CachedPost = {
  platform: string; id: string; url?: string; text?: string; publishedAt?: string;
  thumbnail?: string; metrics?: Record<string, unknown>;
};
type Coverage = { label: string; updated: string | null; from: string | null; to: string | null; count: number };
const formatNumber = (n: number | null) => n === null ? "No disponible" : n.toLocaleString("es-VE");
const dateLabel = (value: string | null) => value && Number.isFinite(Date.parse(value))
  ? new Intl.DateTimeFormat("es-VE", { dateStyle: "medium", timeZone: "America/Caracas" }).format(new Date(value)) : "No disponible";
const isStale = (value: string | null) => !value || !Number.isFinite(Date.parse(value)) || Date.now() - Date.parse(value) > 24 * 60 * 60 * 1000;

/** No functions, live providers or refresh controls: SELECT-only historical view. */
export default function PanDashboard({ slug }: { slug: string }) {
  const [posts, setPosts] = useState<PanPost[]>([]);
  const [coverage, setCoverage] = useState<Coverage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState<PanScope>("all");
  const [network, setNetwork] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      const collected: PanPost[] = [];
      const sources: Coverage[] = [];
      try {
        for (const [brandSlug, periodKey, label] of [
          ["harina-pan", "cumulative-all", "P.A.N. / Cumbres · acumulado histórico"],
          ["pelotica-de-goma", "cumulative-2026", "Pelotica · acumulado 2026"],
        ]) {
          const { data, error: queryError } = await supabase.from("brand_metricool_cache")
            .select("payload,refreshed_at,period_from,period_to")
            .eq("brand_slug", brandSlug).eq("scope", "brand").eq("period_key", periodKey).maybeSingle();
          if (queryError) throw queryError;
          const raw = ((data?.payload as { posts?: CachedPost[] } | null)?.posts ?? []);
          sources.push({ label, updated: data?.refreshed_at ?? null, from: data?.period_from ?? null, to: data?.period_to ?? null, count: raw.length });
          collected.push(...raw.map(p => ({
            platform: p.platform, id: String(p.id ?? ""), url: p.url ?? null, text: p.text ?? "", hashtags: [],
            publishedAt: p.publishedAt ?? null, thumbnail: p.thumbnail ?? null, source: "metricool" as const,
            updatedAt: data?.refreshed_at ?? null,
            metrics: { views: availableMetric(p.metrics?.views), impressions: availableMetric(p.metrics?.impressions),
              likes: availableMetric(p.metrics?.likes ?? p.metrics?.reactions), comments: availableMetric(p.metrics?.comments), shares: availableMetric(p.metrics?.shares) },
          })));
        }
        // Paginate already captured rows; never call the actor that produced them.
        const stored: StoredPost[] = [];
        for (let offset = 0; ; offset += 500) {
          const { data, error: queryError } = await supabase.from("influencer_posts")
            .select("platform,external_id,url,text,hashtags,published_at,thumbnail,views,likes,comments,shares,synced_at")
            .eq("campaign_slug", "pelotica-de-goma").ilike("text", "%@panvenezuela%")
            .order("id", { ascending: true }).range(offset, offset + 499);
          if (queryError) throw queryError;
          const page = (data ?? []) as StoredPost[];
          stored.push(...page);
          if (page.length < 500) break;
          if (cancelled) return;
        }
        const syncs = stored.map(p => p.synced_at).filter(Boolean).sort();
        const dates = stored.map(p => p.published_at).filter((d): d is string => Boolean(d)).sort();
        sources.push({ label: "Capturas almacenadas de Pelotica · histórico", updated: syncs[0] ?? null,
          from: dates[0] ?? null, to: dates[dates.length - 1] ?? null, count: stored.length });
        collected.push(...stored.map(p => ({
          platform: p.platform, id: p.external_id, url: p.url, text: p.text ?? "", hashtags: p.hashtags ?? [],
          publishedAt: p.published_at, thumbnail: p.thumbnail, source: "stored" as const, updatedAt: p.synced_at,
          metrics: { views: availableMetric(p.views), impressions: null, likes: availableMetric(p.likes),
            comments: availableMetric(p.comments), shares: availableMetric(p.shares) },
        })));
        if (!cancelled) { setPosts(collected); setCoverage(sources); }
      } catch {
        if (!cancelled) { setPosts([]); setCoverage([]); setError("No se pudieron leer todas las fuentes almacenadas. No se presentan totales parciales como completos."); }
      } finally { if (!cancelled) setLoading(false); }
    };
    void load();
    return () => { cancelled = true; };
  }, [slug]);

  const selected = useMemo(() => selectPanPosts(posts, scope, from, to)
    .filter(p => network === "all" || p.platform === network), [posts, scope, from, to, network]);
  const totals = useMemo(() => ({ views: sumPanMetric(selected, "views"), likes: sumPanMetric(selected, "likes"),
    comments: sumPanMetric(selected, "comments"), shares: sumPanMetric(selected, "shares") }), [selected]);
  const invalidRange = panDateBounds(from, to) === null;

  return <section className="min-w-0">
    <DashboardLogo slug={slug} name="P.A.N." size="feature" />
    <h1 className="text-2xl font-black mt-3">P.A.N. · @panvenezuela</h1>
    <p className="text-sm font-semibold mt-2">Período de medición del 4.º split por confirmar</p>
    <p className="text-xs text-muted-foreground mt-1">Histórico almacenado · menciones de patrocinio, no piezas dedicadas · sin resultados certificados del 4.º split.</p>
    <div className="border-l-4 border-primary bg-muted p-3 my-5 text-xs space-y-2" role="note">
      <p>Las fuentes pueden estar desactualizadas y tener coberturas distintas. Los totales corresponden sólo a registros disponibles.</p>
      <p>Métricas nulas: no disponibles. Los ceros de vistas en Instagram no están validados y no equivalen a vistas reales; se excluyen de la suma de vistas conocidas.</p>
      <p>Metricool tiene prioridad; las capturas almacenadas sólo completan campos ausentes. Los ceros ya normalizados por la fuente no permiten reconstruir métricas originalmente nulas.</p>
    </div>
    <div className="flex flex-wrap items-end gap-3 mb-5">
      <label className="text-xs space-y-1">Desde · Venezuela<Input aria-label="Desde · Venezuela" type="date" value={from} onChange={e => setFrom(e.target.value)} /></label>
      <label className="text-xs space-y-1">Hasta · Venezuela<Input aria-label="Hasta · Venezuela" type="date" value={to} onChange={e => setTo(e.target.value)} /></label>
      <Button variant="outline" size="sm" onClick={() => { setFrom(""); setTo(""); }}>Todo el histórico</Button>
    </div>
    <p className="text-xs text-muted-foreground mb-4">{from || to ? `Rango manual: ${from || "sin inicio"} → ${to || "sin fin"} · no es el período del split` : "Sin rango de split asignado · todo el histórico disponible"}</p>
    {invalidRange && <p role="alert" className="text-destructive text-sm mb-3">Rango de fechas inválido.</p>}
    <Tabs value={scope} onValueChange={v => setScope(v as PanScope)}>
      <TabsList className="grid grid-cols-1 sm:grid-cols-3 h-auto w-full mb-4">
        <TabsTrigger value="all">Consolidado</TabsTrigger>
        <TabsTrigger value="pelotica">Solo en Pelotica</TabsTrigger>
        <TabsTrigger value="cumbre">Solo en Cumbres</TabsTrigger>
      </TabsList>
      {(["all", "pelotica", "cumbre"] as const).map(tab => <TabsContent key={tab} value={tab}>
        <div className="flex flex-wrap gap-2 mb-5" aria-label="Red social">
          {["all", "instagram", "tiktok", "facebook", "youtube"].map(n => <Button key={n} size="sm" variant={network === n ? "default" : "outline"}
            aria-pressed={network === n} onClick={() => setNetwork(n)}>{n === "all" ? "Todas" : n === "youtube" ? "YouTube" : n === "tiktok" ? "TikTok" : n === "instagram" ? "Instagram" : "Facebook"}</Button>)}
        </div>
        {loading ? <Loader2 aria-label="Cargando datos almacenados" className="w-6 h-6 animate-spin text-primary" /> : error ? <p role="alert">{error}</p> : <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div className="bg-card border border-border rounded-lg p-3"><p className="text-xs text-muted-foreground">Menciones</p><p className="text-xl font-black" data-testid="pan-count">{selected.length}</p></div>
            {(Object.keys(totals) as (keyof typeof totals)[]).map(key => <div key={key} className="bg-card border border-border rounded-lg p-3 min-w-0">
              <p className="text-xs text-muted-foreground">{{ views: "Vistas conocidas", likes: "Likes", comments: "Comentarios", shares: "Compartidos" }[key]}</p>
              <p className="text-lg font-black break-words" data-testid={`pan-${key}`}>{formatNumber(totals[key].value)}</p>
              <p className="text-xs text-muted-foreground">{totals[key].available}/{selected.length} con dato{totals[key].missing ? " · suma parcial" : ""}</p>
            </div>)}
          </div>
          <p className="text-xs text-muted-foreground mb-4">Pelotica: @panvenezuela + (#PeloticaDeGoma o @peloticadegomave en caption/hashtags). Ser el autor o usar sólo #AmoAJuga no basta. Cumbres: @panvenezuela + #PodcastEnLaCumbre. Las menciones mixtas se asignan a Cumbres.</p>
          {selected.length === 0 ? <p className="text-muted-foreground">Sin menciones disponibles para esta selección.</p> : <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {selected.map(p => <article key={p.key} className="bg-card border border-border rounded-lg overflow-hidden min-w-0">
              {p.thumbnail && <img src={p.thumbnail} alt="" loading="lazy" referrerPolicy="no-referrer" className="w-full aspect-[4/5] object-cover bg-muted" />}
              <div className="p-3 text-xs space-y-2">
                <p className="text-muted-foreground">{p.platform} · {dateLabel(p.publishedAt)}</p>
                <p className="line-clamp-3 break-words">{p.text}</p>
                <p className="text-muted-foreground">Mención · {p.initiative === "pelotica" ? "Pelotica" : "Cumbres"}</p>
                <p className="flex items-center gap-1 flex-wrap"><Eye className="w-3 h-3" />{formatNumber(p.platform === "instagram" && p.metrics.views === 0 ? null : p.metrics.views)}<Heart className="w-3 h-3 ml-1" />{formatNumber(p.metrics.likes)}</p>
                {p.url && /^https?:\/\//i.test(p.url) && <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">Ver publicación</a>}
              </div>
            </article>)}
          </div>}
        </>}
      </TabsContent>)}
    </Tabs>
    {!loading && !error && <div className="mt-8 border-t border-border pt-4 space-y-2 text-xs text-muted-foreground">
      <h2 className="font-semibold text-foreground">Cobertura de fuentes almacenadas</h2>
      {coverage.map(c => <p key={c.label}>{c.label}: {c.count} registros de origen · {dateLabel(c.from)} a {dateLabel(c.to)} · actualización{c.label.startsWith("Capturas") ? " más antigua" : ""}: {dateLabel(c.updated)}{isStale(c.updated) ? " · datos desactualizados o no disponibles" : ""}</p>)}
    </div>}
  </section>;
}
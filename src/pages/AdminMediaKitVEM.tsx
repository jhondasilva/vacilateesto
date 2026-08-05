import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBrandAuth } from "@/hooks/useBrandAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2, RefreshCw, FileText, Copy, Check, Cloud, Database, TrendingUp } from "lucide-react";
import { toast } from "sonner";

type PlatformAgg = {
  posts: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  impressions: number;
  saved: number;
};

type CacheRow = {
  period_key: string;
  period_label: string;
  period_from: string;
  period_to: string;
  refreshed_at: string;
  payload: {
    byPlatform: Record<string, PlatformAgg>;
    totals: PlatformAgg;
  };
};

// Valores actualmente publicados en el PDF y en MediaKitVEM.tsx.
// Actualizar aquí cuando se regenere el PDF para que la comparación siga siendo útil.
const PDF_BASELINE = {
  totals: { views: 11_350_000, reachIG: 2_710_000, interactions: 700_000, posts: 1_441 },
  byPlatform: {
    instagram: { views: 3_340_000, posts: 798, likes: 193_000, reach: 2_710_000 },
    tiktok:    { views: 4_540_000, posts: 297, likes: 341_000, reach: 0 },
    youtube:   { views: 3_470_000, posts: 346, likes:  40_000, reach: 0 },
  } as Record<string, { views: number; posts: number; likes: number; reach: number }>,
  months: {
    "2026-02": { views: 2_520_000, posts: 212 },
    "2026-03": { views: 1_610_000, posts: 264 },
    "2026-04": { views: 1_980_000, posts: 259 },
    "2026-05": { views: 1_700_000, posts: 363 },
    "2026-06": { views: 1_420_000, posts: 346 },
  } as Record<string, { views: number; posts: number }>,
};

const fmt = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString("es-VE");
};

const interactionsOf = (a: PlatformAgg) => a.likes + a.comments + a.shares + a.saved;

const AdminMediaKitVEM = () => {
  const { session, loading, isAdmin } = useBrandAuth();
  const [rows, setRows] = useState<CacheRow[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingRows, setLoadingRows] = useState(false);
  const [copied, setCopied] = useState(false);
  const [apifyLoading, setApifyLoading] = useState(false);
  const [apifySyncing, setApifySyncing] = useState(false);
  const [apifyMonthly, setApifyMonthly] = useState<{ key: string; label: string; views: number; likes: number; comments: number; shares: number; videos: number; lastSync: string }[]>([]);

  const load = async () => {
    setLoadingRows(true);
    const { data, error } = await supabase
      .from("brand_metricool_cache")
      .select("period_key, period_label, period_from, period_to, refreshed_at, payload")
      .eq("brand_slug", "vacilate-el-mundial")
      .eq("scope", "all")
      .order("period_key", { ascending: true });
    if (error) toast.error(error.message);
    setRows((data ?? []) as CacheRow[]);
    setLoadingRows(false);
  };

  const loadApify = async () => {
    setApifyLoading(true);
    try {
      const { data, error } = await supabase.rpc("apify_metrics_by_month", {
        p_platform: "tiktok",
        p_handle: "vacilateesto",
      });
      if (error) throw error;
      setApifyMonthly((data ?? []) as any[]);
    } catch (e: any) {
      toast.error(e?.message || "Error cargando Apify");
    } finally {
      setApifyLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      load();
      loadApify();
    }
  }, [isAdmin]);

  const runRefresh = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke("vem-cache-refresh", { body: {} });
      if (error) throw error;
      toast.success(`Metricool refrescado · ${(data?.results ?? []).length} periodos`);
      await load();
    } catch (e: any) {
      toast.error(e?.message || "Error refrescando");
    } finally {
      setRefreshing(false);
    }
  };

  const runApifySync = async (from: string, to: string, label: string) => {
    setApifySyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("apify-sync", {
        body: { platform: "tiktok", handle: "vacilateesto", from, to },
      });
      if (error) throw error;
      toast.success(`Apify · ${label}: ${data?.videos ?? 0} videos, ${fmt(data?.totals?.views ?? 0)} vistas`);
      await loadApify();
    } catch (e: any) {
      toast.error(e?.message || "Error sincronizando Apify");
    } finally {
      setApifySyncing(false);
    }
  };

  const monthly = useMemo(
    () => rows.filter((r) => r.period_key !== "cumulative"),
    [rows],
  );
  const cumulative = useMemo(
    () => rows.find((r) => r.period_key === "cumulative"),
    [rows],
  );

  const pdfSnippet = useMemo(() => {
    if (!cumulative) return "";
    const t = cumulative.payload.totals;
    const ig = cumulative.payload.byPlatform.instagram;
    const tt = cumulative.payload.byPlatform.tiktok;
    const yt = cumulative.payload.byPlatform.youtube;
    const monthsLit = monthly
      .map((m) => {
        const abbr = m.period_label.split(" ")[0].toUpperCase().slice(0, 3);
        return `        ("${abbr}", "${fmt(m.payload.totals.views)}", "${m.payload.totals.posts} posts",  PINK),`;
      })
      .join("\n");
    return [
      "# ── Headline (página 3, generate-vem-mediakit.py)",
      "kpis = [",
      `    ("${fmt(t.views)}","VISTAS DE VIDEO",   PINK),`,
      `    ("${fmt(ig.reach)}", "ALCANCE INSTAGRAM", CYAN),`,
      `    ("${fmt(interactionsOf(t))}",  "INTERACCIONES",     INK),`,
      `    ("${t.posts.toLocaleString("en-US")}", "POSTS PUBLICADOS",  PINK),`,
      "]",
      "",
      "# ── Monthly",
      "months = [",
      monthsLit,
      "]",
      "",
      "# ── Por plataforma",
      "plats = [",
      `    ("INSTAGRAM",  "${fmt(ig.views)}", "Reels + Stories + Feed",   "${ig.posts} publicaciones · ${fmt(ig.likes)} likes",  PINK),`,
      `    ("TIKTOK",     "${fmt(tt.views)}", "Vistas acumuladas",        "${tt.posts} videos · ${fmt(tt.likes)} likes",         INK),`,
      `    ("YOUTUBE",    "${fmt(yt.views)}", "Vistas shorts + videos",   "${yt.posts} posts · ${fmt(yt.likes)} likes",          CYAN),`,
      "]",
    ].join("\n");
  }, [cumulative, monthly]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!session) return <Navigate to="/dashboard/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const diffCell = (current: number, baseline: number) => {
    if (baseline === 0) {
      if (current === 0) return <span className="text-muted-foreground text-xs">—</span>;
      return <span className="text-sky-600 text-xs font-medium">nuevo dato (+{fmt(current)})</span>;
    }
    const diff = current - baseline;
    const pct = baseline > 0 ? (diff / baseline) * 100 : 0;
    if (Math.abs(pct) < 0.5) return <span className="text-muted-foreground text-xs">sin cambio</span>;
    const positive = diff > 0;
    return (
      <span className={positive ? "text-emerald-600 text-xs font-medium" : "text-orange-600 text-xs font-medium"}>
        {positive ? "+" : ""}
        {fmt(diff)} ({pct > 0 ? "+" : ""}
        {pct.toFixed(1)}%)
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-5xl">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard/admin">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Admin
              </Link>
            </Button>
            <h1 className="text-lg font-bold">Media Kit VEM · Metricool</h1>
          </div>
          <Button onClick={runRefresh} disabled={refreshing} size="sm">
            {refreshing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refrescar Metricool
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
        <p className="text-sm text-muted-foreground">
          Datos de Metricool para <strong>Vacílate El Mundial</strong> (Instagram + TikTok + YouTube). El caché se refresca
          automáticamente vía cron; puedes forzar una corrida con el botón. Los diffs comparan con los valores actualmente
          publicados en el PDF/MediaKitVEM.
        </p>

        {cumulative && (
          <section className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Acumulado campaña</h2>
              <span className="text-xs text-muted-foreground">
                Último refresh: {new Date(cumulative.refreshed_at).toLocaleString("es-VE")}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Vistas de video", current: cumulative.payload.totals.views, baseline: PDF_BASELINE.totals.views },
                { label: "Alcance Instagram", current: cumulative.payload.byPlatform.instagram.reach, baseline: PDF_BASELINE.totals.reachIG },
                { label: "Interacciones", current: interactionsOf(cumulative.payload.totals), baseline: PDF_BASELINE.totals.interactions },
                { label: "Publicaciones", current: cumulative.payload.totals.posts, baseline: PDF_BASELINE.totals.posts },
              ].map((k) => (
                <div key={k.label} className="bg-background border border-border rounded-xl p-4">
                  <div className="text-2xl font-bold">{fmt(k.current)}</div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mt-1">{k.label}</div>
                  <div className="mt-2">
                    PDF: {fmt(k.baseline)} · {diffCell(k.current, k.baseline)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {cumulative && (
          <section className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-1">Detalle por plataforma × KPI</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Cada celda muestra el valor actual de Metricool, el valor publicado en el PDF y el delta absoluto + %.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-muted-foreground border-b border-border">
                    <th className="py-2 pr-4">Plataforma</th>
                    <th className="py-2 pr-4">Vistas</th>
                    <th className="py-2 pr-4">Alcance</th>
                    <th className="py-2 pr-4">Interacciones</th>
                    <th className="py-2 pr-4">Posts</th>
                    <th className="py-2 pr-4">Likes</th>
                  </tr>
                </thead>
                <tbody>
                  {(["instagram", "tiktok", "youtube"] as const).map((plat) => {
                    const cur = cumulative.payload.byPlatform[plat];
                    const base = PDF_BASELINE.byPlatform[plat];
                    if (!cur) return null;
                    const cell = (c: number, b: number, showBaseline = true) => (
                      <td className="py-2 pr-4 align-top">
                        <div className="font-medium">{fmt(c)}</div>
                        {showBaseline && (
                          <div className="text-[11px] text-muted-foreground">PDF: {fmt(b)}</div>
                        )}
                        <div className="mt-0.5">{diffCell(c, b)}</div>
                      </td>
                    );
                    return (
                      <tr key={plat} className="border-b border-border/50">
                        <td className="py-2 pr-4 font-bold uppercase">{plat}</td>
                        {cell(cur.views, base.views)}
                        {cell(cur.reach, base.reach)}
                        {cell(interactionsOf(cur), 0, false)}
                        {cell(cur.posts, base.posts)}
                        {cell(cur.likes, base.likes)}
                      </tr>
                    );
                  })}
                  {/* Fila TOTAL */}
                  {(() => {
                    const t = cumulative.payload.totals;
                    const ig = cumulative.payload.byPlatform.instagram;
                    return (
                      <tr className="border-b border-border bg-muted/30">
                        <td className="py-2 pr-4 font-bold uppercase">Total</td>
                        <td className="py-2 pr-4">
                          <div className="font-medium">{fmt(t.views)}</div>
                          <div className="text-[11px] text-muted-foreground">PDF: {fmt(PDF_BASELINE.totals.views)}</div>
                          <div className="mt-0.5">{diffCell(t.views, PDF_BASELINE.totals.views)}</div>
                        </td>
                        <td className="py-2 pr-4">
                          <div className="font-medium">{fmt(ig?.reach ?? 0)}</div>
                          <div className="text-[11px] text-muted-foreground">PDF: {fmt(PDF_BASELINE.totals.reachIG)} (IG)</div>
                          <div className="mt-0.5">{diffCell(ig?.reach ?? 0, PDF_BASELINE.totals.reachIG)}</div>
                        </td>
                        <td className="py-2 pr-4">
                          <div className="font-medium">{fmt(interactionsOf(t))}</div>
                          <div className="text-[11px] text-muted-foreground">PDF: {fmt(PDF_BASELINE.totals.interactions)}</div>
                          <div className="mt-0.5">{diffCell(interactionsOf(t), PDF_BASELINE.totals.interactions)}</div>
                        </td>
                        <td className="py-2 pr-4">
                          <div className="font-medium">{fmt(t.posts)}</div>
                          <div className="text-[11px] text-muted-foreground">PDF: {fmt(PDF_BASELINE.totals.posts)}</div>
                          <div className="mt-0.5">{diffCell(t.posts, PDF_BASELINE.totals.posts)}</div>
                        </td>
                        <td className="py-2 pr-4">
                          <div className="font-medium">{fmt(t.likes)}</div>
                        </td>
                      </tr>
                    );
                  })()}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">
              Nota: el PDF no publica alcance de TikTok/YouTube ni interacciones por plataforma; esas celdas muestran solo el valor
              actual (baseline 0 → Δ marcado como "nuevo dato").
            </p>
          </section>
        )}

        <section className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Evolución mensual</h2>
          {loadingRows ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-muted-foreground border-b border-border">
                    <th className="py-2 pr-4">Mes</th>
                    <th className="py-2 pr-4">Vistas</th>
                    <th className="py-2 pr-4">Δ vs PDF</th>
                    <th className="py-2 pr-4">Posts</th>
                    <th className="py-2 pr-4">Δ posts</th>
                    <th className="py-2 pr-4">Refresh</th>
                  </tr>
                </thead>
                <tbody>
                  {monthly.map((m) => {
                    const base = PDF_BASELINE.months[m.period_key];
                    return (
                      <tr key={m.period_key} className="border-b border-border/50">
                        <td className="py-2 pr-4 font-medium">{m.period_label}</td>
                        <td className="py-2 pr-4">{fmt(m.payload.totals.views)}</td>
                        <td className="py-2 pr-4">{base ? diffCell(m.payload.totals.views, base.views) : <span className="text-xs text-muted-foreground">nuevo</span>}</td>
                        <td className="py-2 pr-4">{m.payload.totals.posts}</td>
                        <td className="py-2 pr-4">{base ? diffCell(m.payload.totals.posts, base.posts) : <span className="text-xs text-muted-foreground">nuevo</span>}</td>
                        <td className="py-2 pr-4 text-xs text-muted-foreground">
                          {new Date(m.refreshed_at).toLocaleDateString("es-VE")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Cloud className="w-5 h-5" /> Apify · TikTok (precisión)
            </h2>
            <div className="flex gap-2 flex-wrap justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => runApifySync("2026-08-01", "2026-08-31", "Agosto")}
                disabled={apifySyncing}
              >
                {apifySyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                Agosto
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => runApifySync("2026-07-01", "2026-07-31", "Julio")}
                disabled={apifySyncing}
              >
                Julio
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => runApifySync("2026-01-01", "2026-07-31", "Ene-Jul")}
                disabled={apifySyncing}
              >
                Ene-Jul
              </Button>
              <Button
                size="sm"
                onClick={() => runApifySync("2026-01-01", new Date().toISOString().split("T")[0], "Todo 2026")}
                disabled={apifySyncing}
              >
                <Database className="w-4 h-4 mr-2" />
                Sync actual
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Datos de TikTok scrapeados directamente desde Apify. Úsalo para cruzar con Metricool y aumentar la precisión de vistas,
            likes y shares por video.
          </p>
          {apifyLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : apifyMonthly.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aún no hay datos de Apify. Pulsa "Sync actual" para traer TikTok.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-muted-foreground border-b border-border">
                    <th className="py-2 pr-4">Mes</th>
                    <th className="py-2 pr-4">Videos</th>
                    <th className="py-2 pr-4">Vistas</th>
                    <th className="py-2 pr-4">Likes</th>
                    <th className="py-2 pr-4">Comments</th>
                    <th className="py-2 pr-4">Shares</th>
                    <th className="py-2 pr-4">Último sync</th>
                  </tr>
                </thead>
                <tbody>
                  {apifyMonthly.map((m) => (
                    <tr key={m.key} className="border-b border-border/50">
                      <td className="py-2 pr-4 font-medium">{m.label}</td>
                      <td className="py-2 pr-4">{m.videos}</td>
                      <td className="py-2 pr-4">{fmt(Number(m.views))}</td>
                      <td className="py-2 pr-4">{fmt(Number(m.likes))}</td>
                      <td className="py-2 pr-4">{fmt(Number(m.comments))}</td>
                      <td className="py-2 pr-4">{fmt(Number(m.shares))}</td>
                      <td className="py-2 pr-4 text-xs text-muted-foreground">
                        {m.lastSync ? new Date(m.lastSync).toLocaleString("es-VE") : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {cumulative && apifyMonthly.length > 0 && (
            <div className="mt-6 bg-muted/40 border border-border rounded-xl p-4">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> TikTok · Metricool vs Apify (Ene–Jul 2026)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase text-muted-foreground border-b border-border">
                      <th className="py-2 pr-4">Periodo</th>
                      <th className="py-2 pr-4">Fuente</th>
                      <th className="py-2 pr-4">Videos/Publicaciones</th>
                      <th className="py-2 pr-4">Vistas</th>
                      <th className="py-2 pr-4">Likes</th>
                      <th className="py-2 pr-4">Interacciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const metricoolTt = cumulative.payload.byPlatform.tiktok;
                      const apifyTotal = apifyMonthly.reduce(
                        (acc, m) => ({
                          videos: acc.videos + Number(m.videos),
                          views: acc.views + Number(m.views),
                          likes: acc.likes + Number(m.likes),
                          comments: acc.comments + Number(m.comments),
                          shares: acc.shares + Number(m.shares),
                        }),
                        { videos: 0, views: 0, likes: 0, comments: 0, shares: 0 },
                      );
                      const apifyInteractions = apifyTotal.likes + apifyTotal.comments + apifyTotal.shares;
                      const metricoolInteractions = interactionsOf(metricoolTt);
                      return (
                        <>
                          <tr className="border-b border-border/50">
                            <td className="py-2 pr-4 font-medium">Ene–Jul 2026</td>
                            <td className="py-2 pr-4">Metricool</td>
                            <td className="py-2 pr-4">{fmt(metricoolTt.posts)}</td>
                            <td className="py-2 pr-4">{fmt(metricoolTt.views)}</td>
                            <td className="py-2 pr-4">{fmt(metricoolTt.likes)}</td>
                            <td className="py-2 pr-4">{fmt(metricoolInteractions)}</td>
                          </tr>
                          <tr className="border-b border-border/50">
                            <td className="py-2 pr-4 font-medium">Ene–Jul 2026</td>
                            <td className="py-2 pr-4">Apify</td>
                            <td className="py-2 pr-4">{fmt(apifyTotal.videos)}</td>
                            <td className="py-2 pr-4">{fmt(apifyTotal.views)}</td>
                            <td className="py-2 pr-4">{fmt(apifyTotal.likes)}</td>
                            <td className="py-2 pr-4">{fmt(apifyInteractions)}</td>
                          </tr>
                          <tr className="bg-muted/60">
                            <td className="py-2 pr-4 font-bold">Diferencia</td>
                            <td className="py-2 pr-4">—</td>
                            <td className="py-2 pr-4">{fmt(apifyTotal.videos - metricoolTt.posts)}</td>
                            <td className="py-2 pr-4">{fmt(apifyTotal.views - metricoolTt.views)}</td>
                            <td className="py-2 pr-4">{fmt(apifyTotal.likes - metricoolTt.likes)}</td>
                            <td className="py-2 pr-4">{fmt(apifyInteractions - metricoolInteractions)}</td>
                          </tr>
                        </>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-muted-foreground mt-3">
                Apify lee directamente los videos públicos de TikTok; Metricool puede incluir stories, duetos o clips que no aparecen
                en el perfil. Usa la fuente que mejor represente tu campaña publicada.
              </p>
            </div>
          )}
        </section>

        {pdfSnippet && (
          <section className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5" /> Snippet para regenerar el PDF
              </h2>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(pdfSnippet);
                  setCopied(true);
                  toast.success("Copiado");
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                Copiar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Copia y pégalo en <code>scripts/media-kit/generate-vem-mediakit.py</code> (bloques marcados) — luego pide "regenera el
              PDF de VEM" y actualiza <code>PDF_BASELINE</code> arriba en este archivo para que los diffs vuelvan a cero.
            </p>
            <pre className="bg-muted rounded-lg p-4 text-xs overflow-x-auto whitespace-pre">{pdfSnippet}</pre>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminMediaKitVEM;
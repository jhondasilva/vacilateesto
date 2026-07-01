import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBrandAuth } from "@/hooks/useBrandAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2, RefreshCw, FileText, Copy, Check } from "lucide-react";
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

  useEffect(() => {
    if (isAdmin) load();
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
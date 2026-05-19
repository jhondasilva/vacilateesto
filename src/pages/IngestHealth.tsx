import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Loader2, AlertTriangle, Activity, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBrandAuth } from "@/hooks/useBrandAuth";
import { toast } from "sonner";

type LogRow = {
  id: string;
  created_at: string;
  video_id: string | null;
  status: string;
  message: string | null;
  metadata: Record<string, any> | null;
  video?: { title: string | null } | null;
};

const STATUS_STYLES: Record<string, { label: string; icon: any; cls: string }> = {
  indexed: { label: "Indexado", icon: CheckCircle2, cls: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" },
  error: { label: "Error", icon: XCircle, cls: "bg-destructive/15 text-destructive border-destructive/30" },
  corruption_alert: { label: "Alerta corrupción", icon: AlertTriangle, cls: "bg-amber-500/15 text-amber-700 border-amber-500/30" },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("es-VE", { dateStyle: "short", timeStyle: "short" });
}

const IngestHealth = () => {
  const { session, loading: authLoading, isAdmin } = useBrandAuth();
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from("yt_ingest_log")
        .select("id, created_at, video_id, status, message, metadata")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      const logs = (data ?? []) as LogRow[];
      const vids = Array.from(new Set(logs.map((r) => r.video_id).filter(Boolean) as string[]));
      let titles: Record<string, string> = {};
      if (vids.length) {
        const { data: vdata } = await supabase
          .from("yt_videos")
          .select("video_id, title")
          .in("video_id", vids);
        titles = Object.fromEntries((vdata ?? []).map((v: any) => [v.video_id, v.title]));
      }
      setRows(logs.map((r) => ({ ...r, video: r.video_id ? { title: titles[r.video_id] ?? null } : null })));
    } catch (e: any) {
      toast.error(`No pude cargar el log: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const stats = useMemo(() => {
    const last7 = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = rows.filter((r) => new Date(r.created_at).getTime() >= last7);
    const segDropped = recent.reduce((a, r) => a + Number(r.metadata?.segments_dropped ?? 0), 0);
    const chunksTrunc = recent.reduce((a, r) => a + Number(r.metadata?.chunks_truncated ?? 0), 0);
    const alerts = recent.filter((r) => r.status === "corruption_alert");
    const errors = recent.filter((r) => r.status === "error");
    const indexed = recent.filter((r) => r.status === "indexed");
    const affectedVideos = new Set(alerts.map((r) => r.video_id).filter(Boolean));
    return {
      runs: recent.length,
      indexed: indexed.length,
      errors: errors.length,
      alerts: alerts.length,
      segDropped,
      chunksTrunc,
      affectedVideos: affectedVideos.size,
    };
  }, [rows]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  if (!session) return <Navigate to="/dashboard/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Salud del Ingest — Vacílate esto</title>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/dashboard/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Volver al admin
          </Link>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refrescar"}
          </Button>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-7 w-7" /> Salud del pipeline de ingest
          </h1>
          <p className="text-muted-foreground mt-1">Métricas de los últimos 7 días + historial de corridas (30 días).</p>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <KPI label="Corridas (7d)" value={stats.runs} />
          <KPI label="Indexados" value={stats.indexed} tone="ok" />
          <KPI label="Errores" value={stats.errors} tone={stats.errors > 0 ? "bad" : "neutral"} />
          <KPI label="Alertas de corrupción" value={stats.alerts} tone={stats.alerts > 0 ? "warn" : "neutral"} />
          <KPI label="Segmentos descartados" value={stats.segDropped} tone={stats.segDropped > 0 ? "warn" : "neutral"} />
          <KPI label="Chunks recortados" value={stats.chunksTrunc} tone={stats.chunksTrunc > 0 ? "warn" : "neutral"} />
          <KPI label="Videos afectados" value={stats.affectedVideos} tone={stats.affectedVideos > 0 ? "warn" : "neutral"} />
        </div>

        {/* Alerts section */}
        {stats.alerts > 0 && (
          <Card className="p-4 mb-6 border-amber-500/40 bg-amber-500/5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-amber-900 dark:text-amber-200">
                  {stats.alerts} alerta(s) de corrupción en los últimos 7 días
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Episodios donde se descartaron segmentos aplastados o se recortaron chunks. Revisa la tabla de abajo para ver el detalle.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Recent runs table */}
        <Card className="overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <h2 className="font-semibold">Historial reciente</h2>
            <span className="text-xs text-muted-foreground">{rows.length} registro(s)</span>
          </div>
          {loading && rows.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin inline" />
            </div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Sin registros aún.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="text-left px-3 py-2">Cuándo</th>
                    <th className="text-left px-3 py-2">Estado</th>
                    <th className="text-left px-3 py-2">Episodio</th>
                    <th className="text-right px-3 py-2">Seg. dropped</th>
                    <th className="text-right px-3 py-2">Chunks truncated</th>
                    <th className="text-right px-3 py-2">Chunks ok</th>
                    <th className="text-left px-3 py-2">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const st = STATUS_STYLES[r.status] ?? { label: r.status, icon: Activity, cls: "bg-muted text-foreground border-border" };
                    const Icon = st.icon;
                    const segDropped = Number(r.metadata?.segments_dropped ?? 0);
                    const chunksTrunc = Number(r.metadata?.chunks_truncated ?? 0);
                    const chunksOk = Number(r.metadata?.chunks_saved ?? 0);
                    return (
                      <tr key={r.id} className="border-t hover:bg-muted/30">
                        <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{fmtDate(r.created_at)}</td>
                        <td className="px-3 py-2">
                          <Badge variant="outline" className={`gap-1 ${st.cls}`}>
                            <Icon className="h-3 w-3" /> {st.label}
                          </Badge>
                        </td>
                        <td className="px-3 py-2">
                          {r.video_id ? (
                            <a
                              href={`https://www.youtube.com/watch?v=${r.video_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                              title={r.video_id}
                            >
                              {r.video?.title ?? r.video_id}
                            </a>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className={`px-3 py-2 text-right tabular-nums ${segDropped > 0 ? "text-amber-700 font-medium" : "text-muted-foreground"}`}>{segDropped || "·"}</td>
                        <td className={`px-3 py-2 text-right tabular-nums ${chunksTrunc > 0 ? "text-amber-700 font-medium" : "text-muted-foreground"}`}>{chunksTrunc || "·"}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{chunksOk || "·"}</td>
                        <td className="px-3 py-2 text-muted-foreground max-w-md truncate" title={r.message ?? ""}>{r.message}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <p className="text-xs text-muted-foreground mt-4">
          Una "alerta de corrupción" se genera cuando el ingest descarta ≥5 segmentos aplastados o recorta ≥1 chunk en una sola corrida.
        </p>
      </div>
    </div>
  );
};

function KPI({ label, value, tone = "neutral" }: { label: string; value: number; tone?: "neutral" | "ok" | "warn" | "bad" }) {
  const toneCls = {
    neutral: "text-foreground",
    ok: "text-emerald-600",
    warn: "text-amber-600",
    bad: "text-destructive",
  }[tone];
  return (
    <Card className="p-4">
      <div className="text-xs uppercase text-muted-foreground tracking-wide">{label}</div>
      <div className={`text-2xl font-bold mt-1 tabular-nums ${toneCls}`}>{value}</div>
    </Card>
  );
}

export default IngestHealth;

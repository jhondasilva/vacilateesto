import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBrandAuth } from "@/hooks/useBrandAuth";
import { supabase } from "@/integrations/supabase/client";
import { CommunityPost, monthlyCommunity, summarizeCommunity, topCommented } from "@/lib/communityMetrics";

const VE_BLOG_ID = 1943481;
const FROM = "2026-01-01T00:00:00";
const NAMES: Record<string, string> = { tiktok: "TikTok", instagram: "Instagram", facebook: "Facebook", youtube: "YouTube" };
const MONTHS = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
const fmt = (v: number, d = 0) => v.toLocaleString("es-VE", { maximumFractionDigits: d, minimumFractionDigits: d });

const DashboardComunidad = () => {
  const { session, loading, isAdmin } = useBrandAuth();
  const [posts, setPosts] = useState<CommunityPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    supabase.functions
      .invoke("metricool-brand-mentions", {
        body: { blogId: VE_BLOG_ID, scope: "all", from: FROM, to: new Date().toISOString().slice(0, 19) },
      })
      .then(({ data, error }) => {
        if (error || data?.error) setError("No se pudieron cargar los datos de Metricool. Intenta de nuevo más tarde.");
        else setPosts(data.posts ?? []);
      });
  }, [isAdmin]);

  const rows = useMemo(() => (posts ? summarizeCommunity(posts) : []), [posts]);
  const months = useMemo(() => (posts ? monthlyCommunity(posts) : []), [posts]);
  const top = useMemo(() => (posts ? topCommented(posts, 10) : []), [posts]);
  const maxMonth = Math.max(1, ...months.map((m) => m.conversationPer1000));

  if (!loading && !session) return <Navigate to="/dashboard/login" replace />;
  if (!loading && !isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard" aria-label="Volver"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <div>
            <h1 className="font-black text-lg leading-tight">Comunidad · Vacílate Esto</h1>
            <p className="text-[11px] text-muted-foreground">Metricool · cuenta oficial · desde el 1 de enero de 2026</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
        <p className="text-sm text-muted-foreground max-w-3xl">
          El alcance mide cuántos ven. Estos indicadores miden cuántos participan: comentan, comparten y guardan.
          La conversación por cada 1.000 vistas es la mejor señal de comunidad.
        </p>

        {error && <p className="text-destructive">{error}</p>}
        {!posts && !error && (
          <p className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Cargando publicaciones…</p>
        )}

        {posts && (
          <>
            <section className="overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-muted-foreground">
                  <tr className="text-left">
                    {["Red", "Posts", "Vistas", "Interacción", "Conversación / 1.000 vistas", "Comentarios", "Comentarios por post", "Compartidos", "Guardados", "% conversación"].map((h) => (
                      <th key={h} className="p-3 font-bold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.platform} className="border-t border-border">
                      <td className="p-3 font-bold">{NAMES[r.platform] ?? r.platform}</td>
                      <td className="p-3">{fmt(r.posts)}</td>
                      <td className="p-3">{fmt(r.views)}</td>
                      <td className="p-3 font-bold">{fmt(r.interactionRate, 2)}%</td>
                      <td className="p-3 font-bold">{fmt(r.conversationPer1000, 1)}</td>
                      <td className="p-3">{r.commentsReported ? fmt(r.comments) : "No reportado"}</td>
                      <td className="p-3">{r.commentsReported ? fmt(r.commentsPerPost, 1) : "—"}</td>
                      <td className="p-3">{fmt(r.shares)}</td>
                      <td className="p-3">{r.platform === "instagram" ? fmt(r.saves) : "—"}</td>
                      <td className="p-3">{fmt(r.conversationShare, 1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="p-3 text-xs text-muted-foreground border-t border-border">
                Facebook no entrega comentarios por la API. Solo Instagram reporta guardados. YouTube no reporta compartidos.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-bold mb-4">Conversación por cada 1.000 vistas, mes a mes</h2>
              <div className="flex items-end gap-2 h-48">
                {months.map((m) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
                    <span className="text-[10px] font-bold">{fmt(m.conversationPer1000, 1)}</span>
                    <div className="w-full rounded-t bg-primary" style={{ height: `${(m.conversationPer1000 / maxMonth) * 100}%` }} />
                    <span className="text-[10px] text-muted-foreground">{MONTHS[Number(m.month.slice(5, 7)) - 1]}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-bold mb-4">Las 10 publicaciones con más comentarios</h2>
              <ol className="space-y-3">
                {top.map((p, i) => (
                  <li key={`${p.platform}-${p.id}`} className="flex gap-3 items-start text-sm">
                    <span className="font-black w-6">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{p.text.split("\n")[0] || "(sin texto)"}</p>
                      <p className="text-xs text-muted-foreground">
                        {NAMES[p.platform]} · {fmt(p.metrics.comments ?? 0)} comentarios · {fmt(p.metrics.shares ?? 0)} compartidos
                      </p>
                    </div>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" aria-label="Abrir publicación" className="text-muted-foreground hover:text-foreground">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            </section>

            <p className="text-xs text-muted-foreground">
              Pendiente para medir comunidad completa: comentaristas recurrentes, chat de los lives y retención de YouTube; Metricool no entrega esos datos por publicación.
            </p>
          </>
        )}
      </main>
    </div>
  );
};

export default DashboardComunidad;

import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBrandAuth } from "@/hooks/useBrandAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft, Download, Eye, Heart, Users, Megaphone, TrendingUp, Loader2, LogOut,
  Youtube, Instagram, Play, ExternalLink, MessageCircle, Music2, Facebook,
} from "lucide-react";
import { toast } from "sonner";
import logoVacilateEsto from "@/assets/logo-vacilate-esto.png";
import logoVacilateFutbol from "@/assets/logo-vacilate-futbol.png";
import logoCocaCola from "@/assets/logo-coca-cola.png";

const BRAND_LOGOS: Record<string, string> = {
  "coca-cola": logoCocaCola,
};

type Report = {
  id: string;
  title: string;
  period_label: string;
  summary: Record<string, any>;
  platforms: Array<Record<string, any>>;
  top_posts: Array<Record<string, any>>;
  pdf_url: string | null;
  content_items?: Array<{
    type: "youtube_short" | "instagram_reel";
    category: string;
    id: string;
    url: string;
    thumb?: string;
  }>;
};

type Brand = { id: string; name: string; slug: string; brand_color: string | null };

const DashboardBrand = () => {
  const { slug } = useParams();
  const { session, loading: authLoading } = useBrandAuth();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!session || !slug) return;
    (async () => {
      setLoading(true);
      const { data: b } = await supabase
        .from("brands")
        .select("id, name, slug, brand_color")
        .eq("slug", slug)
        .maybeSingle();
      if (!b) {
        setBrand(null);
        setLoading(false);
        return;
      }
      setBrand(b as Brand);
      const { data: r } = await supabase
        .from("brand_reports")
        .select("id, title, period_label, summary, platforms, top_posts, pdf_url, content_items")
        .eq("brand_id", b.id)
        .order("period_end", { ascending: false });
      const list = (r ?? []) as Report[];
      setReports(list);
      setActiveId(list[0]?.id ?? null);
      setLoading(false);
    })();
  }, [session, slug]);

  if (!authLoading && !session) return <Navigate to="/dashboard/login" replace />;

  const active = reports.find((r) => r.id === activeId);
  const accent = brand?.brand_color ?? "hsl(var(--primary))";
  const brandLogo = brand ? BRAND_LOGOS[brand.slug] : null;
  const isMundialReport = (title: string) =>
    /mundial|fútbol|futbol/i.test(title);

  const handleDownload = async () => {
    if (!active?.pdf_url) return;
    setDownloading(true);
    const { data, error } = await supabase.storage
      .from("brand-reports")
      .createSignedUrl(active.pdf_url, 60);
    setDownloading(false);
    if (error || !data?.signedUrl) {
      toast.error("No se pudo generar el enlace");
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard"><ArrowLeft className="w-4 h-4" /></Link>
            </Button>
            <img
              src={logoVacilateEsto}
              alt="Vacílate Esto"
              className="h-8 w-auto hidden sm:block"
              loading="lazy"
            />
            <div className="h-6 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2 min-w-0">
              {brandLogo && (
                <img
                  src={brandLogo}
                  alt={brand?.name ?? ""}
                  className="h-8 w-auto object-contain"
                  loading="lazy"
                />
              )}
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Dashboard</p>
                <p className="font-bold truncate text-sm">{brand?.name ?? "—"}</p>
              </div>
            </div>
          </div>
          <Button onClick={() => supabase.auth.signOut()} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-1" /> Salir
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        ) : !brand ? (
          <p className="text-muted-foreground">Marca no disponible.</p>
        ) : reports.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <p className="text-muted-foreground">Aún no hay reportes publicados para {brand.name}.</p>
          </div>
        ) : (
          <>
            {/* Selector de períodos */}
            <div className="flex flex-wrap gap-2 mb-6">
              {reports.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setActiveId(r.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                    r.id === activeId
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-foreground border-border hover:border-foreground/40"
                  }`}
                >
                  {r.period_label}
                </button>
              ))}
            </div>

            {active && (
              <>
                <div
                  className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8 mb-8"
                  style={{ borderLeftColor: accent, borderLeftWidth: 4 }}
                >
                  <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{ background: `radial-gradient(circle at 100% 0%, ${accent}, transparent 60%)` }}
                  />
                  <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-center gap-5 min-w-0">
                      {brandLogo && (
                        <img
                          src={brandLogo}
                          alt={brand?.name ?? ""}
                          className="h-14 md:h-20 w-auto object-contain shrink-0"
                          loading="lazy"
                        />
                      )}
                      <span className="text-2xl md:text-3xl font-black text-muted-foreground shrink-0">×</span>
                      <img
                        src={isMundialReport(active.title) ? logoVacilateFutbol : logoVacilateEsto}
                        alt={isMundialReport(active.title) ? "Vacílate El Fútbol" : "Vacílate Esto"}
                        className="h-14 md:h-20 w-auto object-contain shrink-0"
                        loading="lazy"
                      />
                    </div>
                    <div className="md:text-right min-w-0">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{active.period_label}</p>
                      <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">{active.title}</h1>
                    </div>
                  </div>
                  {active.pdf_url && (
                    <div className="relative mt-6 flex justify-end">
                      <Button onClick={handleDownload} disabled={downloading}>
                        {downloading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        Descargar PDF
                      </Button>
                    </div>
                  )}
                </div>

                {/* Métricas resumen */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                  <SummaryCard icon={Eye} label="Impresiones" value={active.summary.impressions} accent={accent} />
                  <SummaryCard icon={Heart} label="Interacciones" value={active.summary.interactions} accent={accent} />
                  <SummaryCard icon={Users} label="Alcance" value={active.summary.reach} accent={accent} />
                  <SummaryCard icon={Megaphone} label="Publicaciones" value={active.summary.posts} accent={accent} />
                  {active.summary.engagement_growth && (
                    <SummaryCard
                      icon={TrendingUp}
                      label="Crecimiento de engagement"
                      value={active.summary.engagement_growth}
                      accent={accent}
                    />
                  )}
                  {active.summary.total_engagement && (
                    <SummaryCard
                      icon={TrendingUp}
                      label="Engagement total"
                      value={active.summary.total_engagement}
                      accent={accent}
                    />
                  )}
                </section>

                {/* Desglose por iniciativa */}
                {active.platforms?.length > 0 && (
                  <section className="mb-12">
                    <h2 className="text-2xl font-black mb-4">Aporte por iniciativa</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {active.platforms.map((p, i) => (
                        <div
                          key={i}
                          className="bg-card border border-border rounded-2xl p-6"
                          style={{ borderLeftColor: accent, borderLeftWidth: 4 }}
                        >
                          <p className="text-lg font-bold mb-4">{p.name}</p>
                          <dl className="grid grid-cols-2 gap-3 text-sm">
                            {Object.entries(p)
                              .filter(([k]) => k !== "name")
                              .map(([k, v]) => (
                                <div key={k}>
                                  <dt className="text-muted-foreground capitalize text-xs">
                                    {k.replace(/_/g, " ")}
                                  </dt>
                                  <dd className="font-bold text-base">{String(v)}</dd>
                                </div>
                              ))}
                          </dl>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Top publicaciones */}
                {active.top_posts?.length > 0 && (
                  <section className="mb-12">
                    <h2 className="text-2xl font-black mb-4">Publicaciones destacadas</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {active.top_posts.map((p, i) => (
                        <div key={i} className="bg-card border border-border rounded-2xl p-5">
                          {p.month && (
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">{p.month}</p>
                          )}
                          <p className="font-bold mt-1 mb-3 leading-tight">{p.title}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                            {p.reach && (
                              <span><span className="text-muted-foreground">Alcance:</span> <strong>{p.reach}</strong></span>
                            )}
                            {p.views && (
                              <span><span className="text-muted-foreground">Views:</span> <strong>{p.views}</strong></span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Galería de contenidos */}
                {active.content_items && active.content_items.length > 0 && (
                  <ContentGallery items={active.content_items} accent={accent} />
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

const SummaryCard = ({
  icon: Icon, label, value, accent,
}: {
  icon: any; label: string; value: any; accent: string;
}) => (
  <div className="bg-card border border-border rounded-2xl p-5">
    <Icon className="w-5 h-5 mb-3" style={{ color: accent }} />
    <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
    <p className="text-2xl md:text-3xl font-black mt-1">{value ?? "—"}</p>
  </div>
);

type ContentItem = {
  type: "youtube_short" | "instagram_reel";
  category: string;
  id: string;
  url: string;
  thumb?: string;
};

const ContentGallery = ({ items, accent }: { items: ContentItem[]; accent: string }) => {
  const order = ["Reels", "Shorts", "Promos"];
  const categories = Array.from(new Set(items.map((i) => i.category))).sort(
    (a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    },
  );
  const [active, setActive] = useState<string>(categories[0] ?? "");
  const filtered = items.filter((i) => i.category === active);
  const [ytStats, setYtStats] = useState<Record<string, { views: number; likes: number; comments: number }>>({});
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const ids = items.filter((i) => i.type === "youtube_short").map((i) => i.id);
    if (ids.length === 0) return;
    setLoadingStats(true);
    supabase.functions
      .invoke("youtube-stats", { body: { videoIds: ids } })
      .then(({ data, error }) => {
        if (!error && data?.stats) setYtStats(data.stats);
      })
      .finally(() => setLoadingStats(false));
  }, [items]);

  const ytItems = items.filter((i) => i.type === "youtube_short");
  const totals = ytItems.reduce(
    (acc, it) => {
      const s = ytStats[it.id];
      if (s) {
        acc.views += s.views;
        acc.likes += s.likes;
        acc.comments += s.comments;
      }
      return acc;
    },
    { views: 0, likes: 0, comments: 0 },
  );
  const fmt = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : `${n}`;

  return (
    <section className="mb-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-2xl font-black">Galería de contenidos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {items.length} piezas publicadas en YouTube e Instagram.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors ${
                c === active
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-foreground border-border hover:border-foreground/40"
              }`}
            >
              {c} · {items.filter((i) => i.category === c).length}
            </button>
          ))}
        </div>
      </div>

      {ytItems.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider"><Eye className="w-3.5 h-3.5" /> Views YT</div>
            <p className="text-xl md:text-2xl font-black mt-1">{loadingStats ? "…" : fmt(totals.views)}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider"><Heart className="w-3.5 h-3.5" /> Likes</div>
            <p className="text-xl md:text-2xl font-black mt-1">{loadingStats ? "…" : fmt(totals.likes)}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider"><MessageCircle className="w-3.5 h-3.5" /> Comments</div>
            <p className="text-xl md:text-2xl font-black mt-1">{loadingStats ? "…" : fmt(totals.comments)}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map((it) => {
          const isYT = it.type === "youtube_short";
          const PlatformIcon = isYT ? Youtube : Instagram;
          const s = isYT ? ytStats[it.id] : undefined;
          return (
            <a
              key={it.id + it.url}
              href={it.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-[9/16] overflow-hidden rounded-xl bg-card border border-border hover:border-foreground/40 transition-colors"
            >
              {it.thumb ? (
                <img
                  src={it.thumb}
                  alt={`${it.category} ${it.id}`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : !isYT ? (
                <iframe
                  src={`https://www.instagram.com/p/${it.id}/embed/captioned/`}
                  loading="lazy"
                  scrolling="no"
                  allow="encrypted-media"
                  className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                  style={{ background: "#000" }}
                  title={`Instagram ${it.id}`}
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${accent}22, transparent)` }}
                >
                  <PlatformIcon className="w-8 h-8 opacity-60" style={{ color: accent }} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90" />
              <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-background/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider">
                <PlatformIcon className="w-3 h-3" />
                {isYT ? "YT" : "IG"}
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-background/95 flex items-center justify-center">
                  <Play className="w-5 h-5 fill-foreground text-foreground ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 right-2 text-white">
                {s ? (
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{fmt(s.views)}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{fmt(s.likes)}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{fmt(s.comments)}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[10px] font-semibold">
                    <span className="truncate">{it.category}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </div>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default DashboardBrand;
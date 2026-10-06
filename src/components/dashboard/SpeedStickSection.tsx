import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Eye, Heart, MessageCircle, Loader2, RefreshCw, Music2, Instagram } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Post = {
  id: string;
  campaign_slug: string;
  platform: string;
  category: string | null;
  external_id: string;
  author_handle: string | null;
  author_followers: number | null;
  url: string | null;
  text: string | null;
  thumbnail: string | null;
  published_at: string | null;
  views: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  hashtags: string[] | null;
};

export const SPEED_STICK_HASHTAGS = ["#ladyspeedstick", "#speedstick"];
export const SPEED_STICK_START = Date.parse("2026-09-25T00:00:00-04:00");

const fmt = (n: number) => new Intl.NumberFormat("es-VE").format(Math.round(n || 0));

// Grupo de cada cuenta según su relación con Pelotica de Goma.
const OFICIAL = ["peloticadegomave", "peloticadegoma", "vacilateestopodcast", "vacilateesto"];
const EQUIPOS = ["diablosdelabastidas", "bombillosdepetare", "vikingosdecharallave", "torosdelavega",
  "losperrosdelosguayos", "losvipdepintoo", "coquitoysucombopdg", "losrelampagoskk"];
const CHIVOS = ["mabastidas", "luis_sojo19", "gesaria", "luchomosqueda", "azuaje.230",
  "lamentedepinto", "coquitooriginal", "diazkarate", "jhonsnacks", "juansofa"];

type Group = "oficial" | "equipo" | "chivo" | "otras";
export const groupOf = (handle: string | null): Group => {
  const h = (handle ?? "").toLowerCase().replace(/^@/, "");
  if (OFICIAL.includes(h)) return "oficial";
  if (EQUIPOS.includes(h)) return "equipo";
  if (CHIVOS.includes(h)) return "chivo";
  return "otras";
};

// Solo cuenta lo de Pelotica: #LadySpeedStick o #SpeedStick + (cuenta de Pelotica o mención a @peloticadegomave).
export const isSpeedStickPost = (p: Pick<Post, "text" | "hashtags" | "published_at" | "author_handle">) => {
  const ts = p.published_at ? Date.parse(p.published_at) : NaN;
  if (!Number.isFinite(ts) || ts < SPEED_STICK_START) return false;
  const norm = `${p.text ?? ""} ${(p.hashtags ?? []).join(" ")}`.toLowerCase().replace(/\s+/g, "");
  if (!SPEED_STICK_HASHTAGS.some((ht) => norm.includes(ht))) return false;
  return groupOf(p.author_handle) !== "otras" || norm.includes("@peloticadegomave");
};

const TABS: { k: "all" | Group; label: string }[] = [
  { k: "all", label: "Todo unificado" },
  { k: "oficial", label: "Pelotica oficial" },
  { k: "equipo", label: "Equipos" },
  { k: "chivo", label: "Chivos" },
  { k: "otras", label: "Otras con @peloticadegomave" },
];

export const SpeedStickSection = ({ accent = "hsl(var(--primary))" }: { accent?: string }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [tab, setTab] = useState<"all" | Group>("all");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("influencer_posts")
      .select("*")
      .gte("published_at", new Date(SPEED_STICK_START).toISOString())
      .or("text.ilike.%ladyspeedstick%,text.ilike.%speedstick%,hashtags.cs.{#ladyspeedstick},hashtags.cs.{#speedstick}")
      .order("published_at", { ascending: false })
      .limit(2000);
    if (error) toast.error("No se pudieron cargar las publicaciones");
    // Una publicación se cuenta una sola vez aunque esté en varias campañas.
    const seen = new Set<string>();
    const valid = ((data as Post[]) ?? []).filter((p) => {
      const k = `${p.platform}:${p.external_id}`;
      if (seen.has(k) || !isSpeedStickPost(p)) return false;
      seen.add(k);
      return true;
    });
    setPosts(valid);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const handleSync = async () => {
    setSyncing(true);
    const { data, error } = await supabase.functions.invoke("influencer-hashtag-sync", {
      body: { campaignSlug: "speed-stick", hashtags: ["ladyspeedstick", "speedstick"], skipProfiles: true, limit: 200 },
    });
    if (error || (data as { ok?: boolean })?.ok === false) {
      setSyncing(false);
      toast.error("No se pudo iniciar la actualización");
      return;
    }
    toast.success("Búsqueda en curso · los datos se actualizarán en unos minutos");
    setTimeout(() => void load(), 120_000);
    setTimeout(() => { void load(); setSyncing(false); }, 300_000);
  };

  const filtered = useMemo(
    () => (tab === "all" ? posts : posts.filter((p) => groupOf(p.author_handle) === tab)),
    [posts, tab],
  );
  const totals = useMemo(() => filtered.reduce((a, p) => {
    a.views += Math.max(0, p.views ?? 0);
    a.inter += Math.max(0, p.likes ?? 0) + Math.max(0, p.comments ?? 0) + Math.max(0, p.shares ?? 0);
    return a;
  }, { views: 0, inter: 0 }), [filtered]);

  const creators = useMemo(() => {
    const m = new Map<string, { handle: string; group: Group; posts: number; views: number; inter: number }>();
    for (const p of filtered) {
      const h = (p.author_handle ?? "—").replace(/^@?/, "@");
      const c = m.get(h.toLowerCase()) ?? { handle: h, group: groupOf(h), posts: 0, views: 0, inter: 0 };
      c.posts += 1;
      c.views += Math.max(0, p.views ?? 0);
      c.inter += Math.max(0, p.likes ?? 0) + Math.max(0, p.comments ?? 0) + Math.max(0, p.shares ?? 0);
      m.set(h.toLowerCase(), c);
    }
    return [...m.values()].sort((a, b) => b.views - a.views || b.posts - a.posts);
  }, [filtered]);

  const groupLabel: Record<Group, string> = { oficial: "Oficial", equipo: "Equipo", chivo: "Chivo", otras: "Otra cuenta" };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-black">Speed Stick · #LadySpeedStick / #SpeedStick</h2>
          <p className="text-[11px] text-muted-foreground font-mono">
            Solo Pelotica: #LadySpeedStick o #SpeedStick en cuentas de Pelotica (oficial, equipos, chivos) o con mención a @peloticadegomave · desde el 25 de septiembre de 2026 · cada publicación se cuenta una vez · Fuente: Apify
          </p>
        </div>
        <Button size="sm" variant="outline" disabled={syncing} onClick={handleSync}>
          {syncing ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-1" />}
          {syncing ? "Buscando…" : "Actualizar datos"}
        </Button>
      </div>

      <div className="mb-6 flex max-w-full overflow-x-auto sm:inline-flex rounded-full border border-border p-1 bg-card">
        {TABS.map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={cn(
              "shrink-0 whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors",
              tab === t.k ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label} · {t.k === "all" ? posts.length : posts.filter((p) => groupOf(p.author_handle) === t.k).length}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-card border border-border rounded-2xl p-8 flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-muted-foreground">Cargando publicaciones…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
          Todavía no hay publicaciones con #LadySpeedStick ni #SpeedStick en esta pestaña. Usa “Actualizar datos”.
        </div>
      ) : (
        <>
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Publicaciones", value: fmt(filtered.length) },
              { label: "Cuentas", value: fmt(creators.length) },
              { label: "Vistas", value: fmt(totals.views) },
              { label: "Interacciones", value: fmt(totals.inter) },
            ].map((c) => (
              <div key={c.label} className="bg-card border border-border rounded-2xl p-5" style={{ borderLeftColor: accent, borderLeftWidth: 4 }}>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{c.label}</p>
                <p className="text-2xl font-black">{c.value}</p>
              </div>
            ))}
          </section>

          <section className="mb-8">
            <h3 className="text-lg font-black mb-3">Cuentas</h3>
            <div className="overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                    <th className="p-3">Cuenta</th><th className="p-3">Grupo</th><th className="p-3">Piezas</th>
                    <th className="p-3">Vistas</th><th className="p-3">Interacciones</th>
                  </tr>
                </thead>
                <tbody>
                  {creators.map((c) => (
                    <tr key={c.handle} className="border-b border-border/50 last:border-0">
                      <td className="p-3 font-bold">{c.handle}</td>
                      <td className="p-3 text-muted-foreground">{groupLabel[c.group]}</td>
                      <td className="p-3">{c.posts}</td>
                      <td className="p-3">{fmt(c.views)}</td>
                      <td className="p-3">{fmt(c.inter)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12">
            <h3 className="text-lg font-black mb-3">Publicaciones · {filtered.length}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filtered.map((p) => (
                <a key={p.platform + p.external_id} href={p.url ?? "#"} target="_blank" rel="noopener noreferrer"
                  className="group relative aspect-[9/16] overflow-hidden rounded-xl bg-card border border-border hover:border-foreground/40 transition-colors">
                  {p.thumbnail ? (
                    <img src={p.thumbnail} alt="" loading="lazy" referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      {p.platform === "tiktok" ? <Music2 className="w-8 h-8 text-muted-foreground" /> : <Instagram className="w-8 h-8 text-muted-foreground" />}
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-background/85 backdrop-blur rounded-full px-2 py-0.5 text-[9px] font-bold">{p.author_handle}</div>
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/85 via-black/55 to-transparent text-white">
                    <p className="text-[10px] line-clamp-2 mb-1 opacity-90">{p.text}</p>
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{fmt(p.views ?? 0)}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{fmt(p.likes ?? 0)}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{fmt(p.comments ?? 0)}</span>
                    </div>
                    {p.published_at && <p className="text-[9px] opacity-75 mt-1">{format(new Date(p.published_at), "d MMM yyyy", { locale: es })}</p>}
                  </div>
                </a>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

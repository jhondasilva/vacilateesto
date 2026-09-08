import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Eye, Heart, MessageCircle, Loader2, RefreshCw, Users, Music2, Instagram } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type InfluencerPost = {
  id: string;
  platform: string;
  category?: string | null;
  external_id: string;
  author_handle: string | null;
  author_name: string | null;
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

const fmt = (n: number) => new Intl.NumberFormat("es-VE").format(Math.round(n || 0));

const TIER = (followers: number | null) => {
  if (!followers) return "sin dato";
  if (followers < 10000) return "nano";
  if (followers < 100000) return "micro";
  return "macro";
};

const GROUP_LABELS: Record<string, string> = {
  equipo: "Equipos",
  chivo: "Chivos",
  "super-chivo": "Super chivos",
  oficial: "Liga oficial",
};

export const InfluencersSection = ({
  campaignSlug = "pelotica-de-goma",
  accent = "#E91E63",
  mode = "influencers",
}: {
  campaignSlug?: string;
  accent?: string;
  mode?: "influencers" | "equipos";
}) => {
  const isTeams = mode === "equipos";
  const allowedCategories = isTeams ? ["equipo", "chivo"] : ["influencer"];

  const [posts, setPosts] = useState<InfluencerPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [platform, setPlatform] = useState<"all" | "tiktok" | "instagram">("all");
  const [tier, setTier] = useState<"all" | "nano" | "micro" | "macro">("all");
  const [group, setGroup] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("influencer_posts")
      .select("*")
      .eq("campaign_slug", campaignSlug)
      .in("category", allowedCategories)
      .order("published_at", { ascending: false })
      .limit(1000);
    if (error) toast.error("No se pudieron cargar las publicaciones");
    // Criterio obligatorio: #PeloticaDeGoma + #AmoAJuga, o mención a un equipo
    // de la liga / un chivo.
    const MENTIONS = [
      "@diablosdelabastidas", "@bombillosdepetare", "@vikingosdecharallave",
      "@torosdelavega", "@losperrosdelosguayos", "@losvipdepintoo",
      "@coquitoysucombopdg", "@losrelampagoskk", "@peloticadegomave",
      "@mabastidas", "@luis_sojo19", "@gesaria", "@luchomosqueda",
      "@azuaje.230", "@lamentedepinto", "@coquitooriginal", "@diazkarate",
      "@jhonsnacks", "@juansofa",
    ];
    // Publicaciones descartadas manualmente (no son de Pelotica de Goma).
    const EXCLUDED_EXTERNAL_IDS = new Set(["7550124744004078853"]);
    const valid = ((data as InfluencerPost[]) ?? []).filter((p) => {
      if (EXCLUDED_EXTERNAL_IDS.has(String((p as { external_id?: string }).external_id ?? ""))) return false;
      // Cuentas oficiales de los equipos: todos sus posts son válidos.
      if ((p.category ?? "") === "equipo") return true;
      // Cuenta principal de la liga: todos sus posts son válidos.
      if ((p.author_handle ?? "").toLowerCase() === "@peloticadegomave") return true;
      const norm = `${p.text ?? ""} ${(p.hashtags ?? []).join(" ")}`
        .toLowerCase()
        .replace(/\s+/g, "");
      // Chivos: cuentas personales, basta con uno de los hashtags oficiales.
      if ((p.category ?? "") === "chivo") {
        return norm.includes("#peloticadegoma") || norm.includes("#amoajuga");
      }
      // Cuentas oficiales de la liga y super chivos: solo #AmoAJuga o #PeloticaDeGoma.
      if ((p.category ?? "") === "oficial" || (p.category ?? "") === "super-chivo") {
        return norm.includes("#peloticadegoma") || norm.includes("#amoajuga");
      }
      // Influencers: SIEMPRE deben tener #PeloticaDeGoma y #AmoAJuga,
      // y nunca pueden ser cuentas oficiales, de equipos o de chivos.
      const handle = (p.author_handle ?? "").toLowerCase().replace(/^@?/, "@");
      if (MENTIONS.includes(handle) || handle === "@vacilateestopodcast" || handle === "@vacilateesto") {
        return false;
      }
      return norm.includes("#peloticadegoma") && norm.includes("#amoajuga");

    });
    setPosts(valid);
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignSlug, mode]);

  const handleSync = async () => {
    setSyncing(true);
    toast.info("Buscando contenido nuevo…");
    const { data, error } = await supabase.functions.invoke("influencer-hashtag-sync", {
      body: { campaignSlug, limit: 100 },
    });
    setSyncing(false);
    if (error) {
      toast.error("No se pudo actualizar");
      return;
    }
    toast.success(`Actualizado · ${(data as any)?.upserted ?? 0} piezas`);
    void load();
  };

  const filtered = useMemo(
    () =>
      posts.filter(
        (p) =>
          (platform === "all" || p.platform === platform) &&
          (!isTeams ? tier === "all" || TIER(p.author_followers) === tier : true) &&
          (group === "all" || (p.category ?? "influencer") === group),
      ),
    [posts, platform, tier, group, isTeams],
  );


  const totals = useMemo(
    () =>
      filtered.reduce(
        (acc, p) => {
          acc.views += p.views ?? 0;
          acc.likes += p.likes ?? 0;
          acc.comments += p.comments ?? 0;
          acc.shares += p.shares ?? 0;
          return acc;
        },
        { views: 0, likes: 0, comments: 0, shares: 0 },
      ),
    [filtered],
  );

  const creators = useMemo(() => {
    const map = new Map<string, { handle: string; posts: number; views: number; likes: number; followers: number }>();
    for (const p of filtered) {
      const h = p.author_handle ?? "—";
      const c = map.get(h) ?? { handle: h, posts: 0, views: 0, likes: 0, followers: p.author_followers ?? 0 };
      c.posts += 1;
      c.views += p.views ?? 0;
      c.likes += p.likes ?? 0;
      c.followers = Math.max(c.followers, p.author_followers ?? 0);
      map.set(h, c);
    }
    return [...map.values()].sort((a, b) => b.views - a.views || b.posts - a.posts);
  }, [filtered]);

  const counts = useMemo(
    () => ({
      all: posts.length,
      tiktok: posts.filter((p) => p.platform === "tiktok").length,
      instagram: posts.filter((p) => p.platform === "instagram").length,
    }),
    [posts],
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-black">
            {isTeams ? "Equipos y chivos" : "Influencers nano y micro"}
          </h2>
          <p className="text-[11px] text-muted-foreground font-mono">
            {isTeams
              ? "Equipos: todos sus posts · Chivos: solo con #PeloticaDeGoma o #AmoAJuga · Fuente: Apify + sincronización manual"
              : "#PeloticaDeGoma + #AmoAJuga obligatorios · sin cuentas oficiales, equipos ni chivos · Fuente: Apify + sincronización manual"}
          </p>
        </div>
        <Button size="sm" variant="outline" disabled={syncing} onClick={handleSync}>
          {syncing ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-1" />}
          {syncing ? "Buscando…" : "Actualizar datos"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {([
          { k: "all", label: `Todos · ${counts.all}`, Icon: Users },
          { k: "tiktok", label: `TikTok · ${counts.tiktok}`, Icon: Music2 },
          { k: "instagram", label: `Instagram · ${counts.instagram}`, Icon: Instagram },
        ] as const).map((o) => (
          <button
            key={o.k}
            onClick={() => setPlatform(o.k)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors flex items-center gap-1.5",
              platform === o.k
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-foreground border-border hover:border-foreground/40",
            )}
          >
            <o.Icon className="w-3.5 h-3.5" />
            {o.label}
          </button>
        ))}
        <span className="w-px bg-border mx-1" />
        {isTeams
          ? (["all", "equipo", "chivo"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGroup(g)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors",
                  group === g
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-foreground border-border hover:border-foreground/40",
                )}
              >
                {g === "all"
                  ? `Todas · ${posts.length}`
                  : `${GROUP_LABELS[g]} · ${posts.filter((p) => (p.category ?? "") === g).length}`}
              </button>
            ))
          : (["all", "nano", "micro", "macro"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors",
                  tier === t
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-foreground border-border hover:border-foreground/40",
                )}
              >
                {t === "all" ? "Todos los tamaños" : t}
              </button>
            ))}
      </div>


      {loading ? (
        <div className="bg-card border border-border rounded-2xl p-8 flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-muted-foreground">Cargando contenido de influencers…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
          Todavía no hay piezas de influencers con esos filtros. Usa “Actualizar influencers”.
        </div>
      ) : (
        <>
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Piezas", value: fmt(filtered.length) },
              { label: "Creadores", value: fmt(creators.length) },
              { label: "Views", value: fmt(totals.views) },
              { label: "Interacciones", value: fmt(totals.likes + totals.comments + totals.shares) },
            ].map((c) => (
              <div
                key={c.label}
                className="bg-card border border-border rounded-2xl p-5"
                style={{ borderLeftColor: accent, borderLeftWidth: 4 }}
              >
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{c.label}</p>
                <p className="text-2xl font-black">{c.value}</p>
              </div>
            ))}
          </section>

          <section className="mb-8">
            <h3 className="text-lg font-black mb-3">Top creadores</h3>
            <div className="overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                    <th className="p-3">Creador</th>
                    <th className="p-3">Tipo</th>
                    <th className="p-3">Seguidores</th>
                    <th className="p-3">Piezas</th>
                    <th className="p-3">Views</th>
                    <th className="p-3">Likes</th>
                  </tr>
                </thead>
                <tbody>
                  {creators.slice(0, 25).map((c) => (
                    <tr key={c.handle} className="border-b border-border/50 last:border-0">
                      <td className="p-3 font-bold">{c.handle}</td>
                      <td className="p-3 capitalize text-muted-foreground">{TIER(c.followers)}</td>
                      <td className="p-3">{c.followers ? fmt(c.followers) : "—"}</td>
                      <td className="p-3">{c.posts}</td>
                      <td className="p-3">{fmt(c.views)}</td>
                      <td className="p-3">{fmt(c.likes)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12">
            <h3 className="text-lg font-black mb-3">
              Publicaciones <span className="text-muted-foreground font-normal text-base">· {filtered.length}</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filtered.map((p) => (
                <a
                  key={p.platform + p.external_id}
                  href={p.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-[9/16] overflow-hidden rounded-xl bg-card border border-border hover:border-foreground/40 transition-colors"
                >
                  {p.thumbnail ? (
                    <img
                      src={p.thumbnail}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      {p.platform === "tiktok" ? (
                        <Music2 className="w-8 h-8 text-muted-foreground" />
                      ) : (
                        <Instagram className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-background/85 backdrop-blur rounded-full px-2 py-0.5 text-[9px] font-bold">
                    {p.author_handle}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/85 via-black/55 to-transparent text-white">
                    <p className="text-[10px] line-clamp-2 mb-1 opacity-90">{p.text}</p>
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{fmt(p.views ?? 0)}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{fmt(p.likes ?? 0)}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{fmt(p.comments ?? 0)}</span>
                    </div>
                    {p.published_at && (
                      <p className="text-[9px] opacity-75 mt-1">
                        {format(new Date(p.published_at), "d MMM yyyy", { locale: es })}
                      </p>
                    )}
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

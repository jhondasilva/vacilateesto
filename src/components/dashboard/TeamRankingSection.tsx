import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

// Cada equipo de la liga con su chivo (mismo orden que los rosters de Equipos y chivos).
const PAIRS = [
  { team: "@diablosdelabastidas", name: "Diablos de La Bastidas", chivo: "@mabastidas" },
  { team: "@bombillosdepetare", name: "Bombillos de Petare", chivo: "@luis_sojo19" },
  { team: "@vikingosdecharallave", name: "Vikingos de Charallave", chivo: "@gesaria" },
  { team: "@torosdelavega", name: "Toros de La Vega", chivo: "@luchomosqueda" },
  { team: "@losperrosdelosguayos", name: "Perros de Los Guayos", chivo: "@azuaje.230" },
  { team: "@losvipdepintoo", name: "Los VIP de Pinto", chivo: "@lamentedepinto" },
  { team: "@coquitoysucombopdg", name: "Coquito y su Combo", chivo: "@coquitooriginal" },
  { team: "@losrelampagoskk", name: "Relámpagos KK", chivo: "@diazkarate" },
];
const TEAM_HANDLES = PAIRS.map((p) => p.team);

type Post = {
  platform: string; external_id: string; category: string | null; author_handle: string | null;
  text: string | null; hashtags: string[] | null; published_at: string | null;
  views: number | null; likes: number | null; comments: number | null; shares: number | null;
};

const fmt = (n: number) => new Intl.NumberFormat("es-VE").format(Math.round(n || 0));
const norm = (h: string | null) => (h ?? "").toLowerCase().replace(/^@?/, "@");
const CAMPAIGN_START = Date.parse("2026-01-01T00:00:00Z");

type Side = { posts: number; views: number; interactions: number };
const empty = (): Side => ({ posts: 0, views: 0, interactions: 0 });

export const TeamRankingSection = ({ accent = "#E91E63" }: { accent?: string }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"views" | "interactions" | "posts">("views");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("influencer_posts")
        .select("platform,external_id,category,author_handle,text,hashtags,published_at,views,likes,comments,shares")
        .eq("campaign_slug", "pelotica-de-goma")
        .in("category", ["equipo", "chivo"])
        .limit(2000);
      setPosts((data as Post[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const rows = useMemo(() => {
    const seen = new Set<string>();
    const map = new Map(PAIRS.map((p) => [p.team, { ...p, teamSide: empty(), chivoSide: empty() }]));
    for (const p of posts) {
      const ts = p.published_at ? Date.parse(p.published_at) : NaN;
      if (!Number.isFinite(ts) || ts < CAMPAIGN_START) continue;
      const key = p.platform + p.external_id;
      if (seen.has(key)) continue;
      const h = norm(p.author_handle);
      const txt = `${p.text ?? ""} ${(p.hashtags ?? []).join(" ")}`.toLowerCase().replace(/\s+/g, "");
      let pair = PAIRS.find((x) => x.team === h);
      let side: "teamSide" | "chivoSide" = "teamSide";
      if (!pair) {
        pair = PAIRS.find((x) => x.chivo === h);
        side = "chivoSide";
        if (!pair) continue;
        const ok = txt.includes("#peloticadegoma") || txt.includes("#amoajuga") ||
          txt.includes("@peloticadegomave") || TEAM_HANDLES.some((t) => txt.includes(t));
        if (!ok) continue;
      }
      seen.add(key);
      const s = map.get(pair.team)![side];
      s.posts += 1;
      s.views += Math.max(0, p.views ?? 0);
      s.interactions += Math.max(0, p.likes ?? 0) + Math.max(0, p.comments ?? 0) + Math.max(0, p.shares ?? 0);
    }
    return [...map.values()]
      .map((r) => ({
        ...r,
        total: {
          posts: r.teamSide.posts + r.chivoSide.posts,
          views: r.teamSide.views + r.chivoSide.views,
          interactions: r.teamSide.interactions + r.chivoSide.interactions,
        },
      }))
      .sort((a, b) => b.total[sortBy] - a.total[sortBy]);
  }, [posts, sortBy]);

  const max = Math.max(1, ...rows.map((r) => r.total[sortBy]));

  if (loading)
    return (
      <div className="bg-card border border-border rounded-2xl p-8 flex items-center gap-3">
        <Loader2 className="w-5 h-5 animate-spin" /> <span className="text-muted-foreground">Cargando ranking…</span>
      </div>
    );

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-black">Ranking de equipos · cuenta oficial + chivo</h2>
        <p className="text-[11px] text-muted-foreground font-mono">
          Equipo: todos sus posts · Chivo: con #PeloticaDeGoma o #AmoAJuga, o mención a @peloticadegomave o a un equipo · Desde enero 2026 · Sin doble conteo
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {([["views", "Por vistas"], ["interactions", "Por interacciones"], ["posts", "Por piezas"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setSortBy(k)}
            className={cn("px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors",
              sortBy === k ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground/40")}>
            {l}
          </button>
        ))}
      </div>

      <div className="grid gap-3 mb-8">
        {rows.map((r, i) => (
          <div key={r.team} className="bg-card border border-border rounded-2xl p-4"
            style={i === 0 ? { borderLeftColor: accent, borderLeftWidth: 4 } : undefined}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-black w-8">{i + 1}</span>
              {i === 0 && <Trophy className="w-5 h-5" style={{ color: accent }} />}
              <div className="flex-1 min-w-0">
                <p className="font-black truncate">{r.name}</p>
                <p className="text-[11px] text-muted-foreground">{r.team} + {r.chivo}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black">{fmt(r.total[sortBy])}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {sortBy === "views" ? "vistas" : sortBy === "interactions" ? "interacciones" : "piezas"}
                </p>
              </div>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden mb-3">
              <div className="h-full rounded-full" style={{ width: `${(r.total[sortBy] / max) * 100}%`, background: accent }} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {([["Equipo", r.teamSide], ["Chivo", r.chivoSide], ["Total", r.total]] as const).map(([l, s]) => (
                <div key={l}>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{l}</p>
                  <p className="font-bold">{fmt(s.views)} vistas · {fmt(s.interactions)} int. · {s.posts} piezas</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

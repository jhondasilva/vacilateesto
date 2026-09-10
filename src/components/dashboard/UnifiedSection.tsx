import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Eye, Heart, MessageCircle, Loader2, Info, Instagram, Music2, Facebook, Youtube, Users,
} from "lucide-react";

type Platform = "instagram" | "tiktok" | "facebook" | "youtube";

type Row = {
  key: string;
  source: "general" | "equipos" | "influencers";
  platform: Platform;
  url: string;
  author: string | null;
  text: string;
  thumbnail: string | null;
  publishedAt: string | null;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
};

const fmt = (n: number) => new Intl.NumberFormat("es-VE").format(Math.round(n || 0));

const PLATFORM_META: Record<Platform, { label: string; Icon: any }> = {
  instagram: { label: "Instagram", Icon: Instagram },
  tiktok: { label: "TikTok", Icon: Music2 },
  facebook: { label: "Facebook", Icon: Facebook },
  youtube: { label: "YouTube", Icon: Youtube },
};

const PELOTICA_OFICIAL_BLOG_ID = 1908520;

const GENERAL_KEYWORDS = [
  "#peloticadegoma", "peloticadegoma", "@peloticadegoma", "@peloticadegomave",
  "#amoajuga", "amoajuga", "@amoajuga", "#amoajugar",
  "@diablosdelabastidas", "diablosdelabastidas",
  "@bombillosdepetare", "bombillosdepetare",
  "@vikingosdecharallave", "vikingosdecharallave",
  "@torosdelavega", "torosdelavega",
  "@losperrosdelosguayos", "losperrosdelosguayos",
  "@losvipdepintoo", "losvipdepintoo",
  "@coquitoysucombopdg", "coquitoysucombopdg",
  "@losrelampagoskk", "losrelampagoskk",
];

const PELOTICA_KEYWORDS = [
  "#peloticadegoma", "peloticadegoma", "@peloticadegoma", "@peloticadegomave",
  "#amoajuga", "amoajuga", "@amoajuga", "#amoajugar",
];

const EXCLUDED_GENERAL_IDS = new Set([
  "497bx9wbW6A",
  "3945643808420838654_11371492563",
  "7664702085916609810",
  "1589414276031681",
]);

const EXCLUDED_EXTERNAL_IDS = new Set(["7550124744004078853"]);
const INCLUDED_EXTERNAL_IDS = new Set([
  "7683301114023939348", "7682173924817358100", "7682929732656188693",
]);
const NON_INFLUENCER_HANDLES = new Set(["@vatelvenezuela", "@mykonosvzla", "@ivcnetworks"]);
const TEAM_MENTIONS = [
  "@diablosdelabastidas", "@bombillosdepetare", "@vikingosdecharallave",
  "@torosdelavega", "@losperrosdelosguayos", "@losvipdepintoo",
  "@coquitoysucombopdg", "@losrelampagoskk",
];
const OFFICIAL_OR_ROSTER = [
  ...TEAM_MENTIONS, "@peloticadegomave",
  "@mabastidas", "@luis_sojo19", "@gesaria", "@luchomosqueda",
  "@azuaje.230", "@lamentedepinto", "@coquitooriginal", "@diazkarate",
  "@jhonsnacks", "@juansofa",
];

const CAMPAIGN_START = Date.parse("2026-01-01T00:00:00Z");

const PERIODS: { key: string; label: string }[] = [
  { key: "2026-09", label: "Septiembre 2026" },
  { key: "2026-08", label: "Agosto 2026" },
  { key: "2026-07", label: "Julio 2026" },
  { key: "cumulative-2026", label: "Acumulado 2026" },
];

const periodRange = (key: string) => {
  if (key === "cumulative-2026") {
    return { from: new Date(2026, 0, 1), to: new Date() };
  }
  const [y, m] = key.split("-").map(Number);
  return { from: new Date(y, m - 1, 1, 0, 0, 0), to: new Date(y, m, 0, 23, 59, 59) };
};

const normKey = (platform: string, id: string, url?: string | null) => {
  const fromUrl = (url ?? "").match(/(?:video|reel|p|shorts)\/([\w.-]+)/i)?.[1];
  return `${platform}::${(fromUrl ?? id).toLowerCase()}`;
};

/**
 * Pestaña "Todo": une General + Equipos y chivos + Influencers sin duplicar piezas.
 */
export const UnifiedSection = ({ accent = "#E91E63" }: { accent?: string }) => {
  const [periodKey, setPeriodKey] = useState<string>("2026-09");
  const [platform, setPlatform] = useState<"all" | Platform>("all");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { from, to } = periodRange(periodKey);
      const inRange = (iso: string | null) => {
        if (!iso) return false;
        const t = Date.parse(iso);
        return Number.isFinite(t) && t >= from.getTime() && t <= to.getTime();
      };

      const [{ data: cached }, { data: influencerRows }] = await Promise.all([
        supabase
          .from("brand_metricool_cache")
          .select("payload")
          .eq("brand_slug", "pelotica-de-goma")
          .eq("scope", "brand")
          .eq("period_key", periodKey)
          .maybeSingle(),
        supabase
          .from("influencer_posts")
          .select("*")
          .eq("campaign_slug", "pelotica-de-goma")
          .order("published_at", { ascending: false })
          .limit(2000),
      ]);

      const out = new Map<string, Row>();

      // 1. General (Metricool)
      const posts = ((cached?.payload as any)?.posts ?? []) as any[];
      for (const p of posts) {
        if (EXCLUDED_GENERAL_IDS.has(p.id)) continue;
        if (!inRange(p.publishedAt)) continue;
        const t = String(p.text ?? "").toLowerCase();
        const oficial = p.blogId === PELOTICA_OFICIAL_BLOG_ID;
        if (!oficial) {
          if (!GENERAL_KEYWORDS.some((k) => t.includes(k))) continue;
          const esVacilate =
            t.includes("@vacilateestopodcast") || t.replace(/\s+/g, "").includes("#vacilateesto");
          if (esVacilate && !PELOTICA_KEYWORDS.some((k) => t.includes(k))) continue;
          if (p.platform === "youtube" && !t.replace(/\s+/g, "").includes("#peloticadegoma")) continue;
        }
        const key = normKey(p.platform, p.id, p.url);
        out.set(key, {
          key,
          source: "general",
          platform: p.platform,
          url: p.url,
          author: oficial ? "@peloticadegomave" : null,
          text: p.text ?? "",
          thumbnail: p.thumbnail ?? null,
          publishedAt: p.publishedAt ?? null,
          views: Math.max(0, p.metrics?.views ?? 0),
          likes: Math.max(0, p.metrics?.likes ?? p.metrics?.reactions ?? 0),
          comments: Math.max(0, p.metrics?.comments ?? 0),
          shares: Math.max(0, p.metrics?.shares ?? 0),
          impressions: Math.max(0, p.metrics?.impressions ?? 0),
        });
      }

      // 2. Equipos y chivos + Influencers (influencer_posts)
      for (const p of (influencerRows ?? []) as any[]) {
        const ts = p.published_at ? Date.parse(p.published_at) : NaN;
        if (!Number.isFinite(ts) || ts < CAMPAIGN_START) continue;
        if (!inRange(p.published_at)) continue;
        const external = String(p.external_id ?? "");
        if (EXCLUDED_EXTERNAL_IDS.has(external)) continue;

        const category = String(p.category ?? "influencer");
        const handle = String(p.author_handle ?? "").toLowerCase().replace(/^@?/, "@");
        const norm = `${p.text ?? ""} ${(p.hashtags ?? []).join(" ")}`.toLowerCase().replace(/\s+/g, "");
        const hasCriteria =
          norm.includes("#peloticadegoma") ||
          norm.includes("#amoajuga") ||
          norm.includes("@peloticadegomave");
        const mencionaEquipo = TEAM_MENTIONS.some((h) => norm.includes(h));

        let valid = false;
        let source: Row["source"] = "influencers";
        if (INCLUDED_EXTERNAL_IDS.has(external)) {
          valid = true;
          source = "equipos";
        } else if (category === "equipo") {
          valid = true;
          source = "equipos";
        } else if (category === "chivo") {
          valid = hasCriteria || mencionaEquipo;
          source = "equipos";
        } else {
          valid =
            hasCriteria &&
            !NON_INFLUENCER_HANDLES.has(handle) &&
            !OFFICIAL_OR_ROSTER.includes(handle) &&
            handle !== "@vacilateestopodcast" &&
            handle !== "@vacilateesto";
          source = "influencers";
        }
        if (!valid) continue;

        const key = normKey(p.platform, external, p.url);
        if (out.has(key)) continue; // ya contabilizado en General
        out.set(key, {
          key,
          source,
          platform: p.platform as Platform,
          url: p.url ?? "#",
          author: p.author_handle ?? null,
          text: p.text ?? "",
          thumbnail: p.thumbnail ?? null,
          publishedAt: p.published_at ?? null,
          views: Math.max(0, p.views ?? 0),
          likes: Math.max(0, p.likes ?? 0),
          comments: Math.max(0, p.comments ?? 0),
          shares: Math.max(0, p.shares ?? 0),
          impressions: 0,
        });
      }

      if (cancelled) return;
      setRows(
        [...out.values()].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")),
      );
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [periodKey]);

  const filtered = useMemo(
    () => rows.filter((r) => platform === "all" || r.platform === platform),
    [rows, platform],
  );

  const totals = useMemo(
    () =>
      filtered.reduce(
        (acc, r) => {
          acc.views += r.views;
          acc.likes += r.likes;
          acc.comments += r.comments;
          acc.shares += r.shares;
          acc.impressions += r.impressions;
          return acc;
        },
        { views: 0, likes: 0, comments: 0, shares: 0, impressions: 0 },
      ),
    [filtered],
  );

  const bySource = useMemo(
    () => ({
      general: rows.filter((r) => r.source === "general").length,
      equipos: rows.filter((r) => r.source === "equipos").length,
      influencers: rows.filter((r) => r.source === "influencers").length,
    }),
    [rows],
  );

  const counts = useMemo(
    () => ({
      all: rows.length,
      instagram: rows.filter((r) => r.platform === "instagram").length,
      tiktok: rows.filter((r) => r.platform === "tiktok").length,
      facebook: rows.filter((r) => r.platform === "facebook").length,
      youtube: rows.filter((r) => r.platform === "youtube").length,
    }),
    [rows],
  );

  const periodLabel = PERIODS.find((p) => p.key === periodKey)?.label ?? periodKey;

  return (
    <div>
      <div className="mb-6 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 flex gap-3">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold">Criterio de esta pestaña</p>
          <p className="text-xs text-muted-foreground mt-1">
            Une <strong>General</strong> + <strong>Equipos y chivos</strong> +{" "}
            <strong>Influencers</strong> en una sola vista, sin duplicar piezas: si una publicación
            aparece en más de una pestaña, se cuenta una sola vez. Cada pestaña conserva su criterio
            original.
          </p>
          <p className="text-[10px] text-muted-foreground mt-1.5 font-mono">
            Fuente: Metricool (IG · FB · YT · TikTok) + Apify (equipos, chivos e influencers).
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriodKey(p.key)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors",
              periodKey === p.key
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-foreground border-border hover:border-foreground/40",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {([
          { k: "all", label: `Todo · ${counts.all}`, Icon: Users },
          { k: "instagram", label: `Instagram · ${counts.instagram}`, Icon: Instagram },
          { k: "tiktok", label: `TikTok · ${counts.tiktok}`, Icon: Music2 },
          { k: "facebook", label: `Facebook · ${counts.facebook}`, Icon: Facebook },
          { k: "youtube", label: `YouTube · ${counts.youtube}`, Icon: Youtube },
        ] as const).map((o) => (
          <button
            key={o.k}
            onClick={() => setPlatform(o.k as "all" | Platform)}
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
      </div>

      {loading ? (
        <div className="bg-card border border-border rounded-2xl p-8 flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-muted-foreground">Unificando todo el ruido de Pelotica de Goma…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
          No hay piezas en {periodLabel} con esos filtros.
        </div>
      ) : (
        <>
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: `Piezas · ${periodLabel}`, value: fmt(filtered.length) },
              { label: "Views", value: fmt(totals.views) },
              { label: "Interacciones", value: fmt(totals.likes + totals.comments + totals.shares) },
              { label: "Impresiones", value: fmt(totals.impressions) },
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

          <section className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "General", value: bySource.general },
              { label: "Equipos y chivos", value: bySource.equipos },
              { label: "Influencers", value: bySource.influencers },
            ].map((c) => (
              <div key={c.label} className="bg-card border border-border rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{c.label}</p>
                <p className="text-xl font-black">{fmt(c.value)}</p>
              </div>
            ))}
          </section>

          <section className="mb-12">
            <h3 className="text-lg font-black mb-3">
              Publicaciones{" "}
              <span className="text-muted-foreground font-normal text-base">· {filtered.length}</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filtered.map((r) => {
                const Meta = PLATFORM_META[r.platform] ?? PLATFORM_META.instagram;
                return (
                  <a
                    key={r.key}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-[9/16] overflow-hidden rounded-xl bg-card border border-border hover:border-foreground/40 transition-colors"
                  >
                    {r.thumbnail ? (
                      <img
                        src={r.thumbnail}
                        alt=""
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <Meta.Icon className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-background/85 backdrop-blur rounded-full px-2 py-0.5 text-[9px] font-bold uppercase">
                      <Meta.Icon className="w-3 h-3" />
                      {r.source === "general" ? "Gen" : r.source === "equipos" ? "Eq" : "Inf"}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/85 via-black/55 to-transparent text-white">
                      {r.author && <p className="text-[9px] font-bold opacity-90">{r.author}</p>}
                      <p className="text-[10px] line-clamp-2 mb-1 opacity-90">{r.text}</p>
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{fmt(r.views)}</span>
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{fmt(r.likes)}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{fmt(r.comments)}</span>
                      </div>
                      {r.publishedAt && (
                        <p className="text-[9px] opacity-75 mt-1">
                          {format(new Date(r.publishedAt), "d MMM yyyy", { locale: es })}
                        </p>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

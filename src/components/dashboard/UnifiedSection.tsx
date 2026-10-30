import { PELOTICA_LIVES, livesInRange, sumLives, type LiveRow } from "@/components/dashboard/PeloticaLivesSection";
import { loadLiveSiteAnalytics, SITE_ANALYTICS } from "@/data/peloticaSiteAnalytics";
import {
  applyConsultationRange, EMPTY_RANGE, fetchAllPages, rangeDates, rangeLabel, validateRange, type ConsultationRange,
} from "@/lib/consultationRange";
import { ConsultationRangeControls } from "@/components/dashboard/ConsultationRangeControls";

// Total anual de impresiones de las cuentas oficiales según Metricool (1 ene – 29 sep 2026).
// Es un agregado sin fecha por pieza: solo se suma cuando no hay rango de consulta.
export const OFFICIAL_ACCOUNTS_IMPRESSIONS = 13940000;

type ImpRow = { source: string; author: string | null; impressions: number };
/**
 * Con `periodOnly` (rango activo) se excluyen los agregados estáticos que no se pueden fechar:
 * total anual de cuentas oficiales y páginas vistas del sitio. Los lives se pasan ya filtrados.
 */
export function impressionBreakdown(rows: ImpRow[], sitePageviews: number, lives: LiveRow[] = PELOTICA_LIVES, periodOnly = false) {
  const isOfficial = (r: ImpRow) => (r.author ?? "").toLowerCase().includes("peloticadegomave");
  const sum = (f: (r: ImpRow) => boolean) => rows.filter(f).reduce((a, r) => a + r.impressions, 0);
  const officialPosts = sum(isOfficial);
  const official = periodOnly ? officialPosts : Math.max(OFFICIAL_ACCOUNTS_IMPRESSIONS, officialPosts);
  const generalOther = sum((r) => r.source === "general" && !isOfficial(r));
  const equipos = sum((r) => r.source === "equipos" && !isOfficial(r));
  const influencers = sum((r) => r.source === "influencers" && !isOfficial(r)) + generalOther;
  const livesViews = sumLives(lives).views;
  const web = periodOnly ? 0 : sitePageviews;
  return { official, equipos, influencers, lives: livesViews, web, total: official + equipos + influencers + livesViews + web };
}
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { generateBrandReportPdf } from "@/utils/generateBrandReportPdf";
import logoPeloticaDeGoma from "@/assets/logo-pelotica-de-goma.png";
import {
  Eye, Heart, MessageCircle, Loader2, Info, Instagram, Music2, Facebook, Youtube, Users, Download,
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

const EXCLUDED_EXTERNAL_IDS = new Set(["7550124744004078853", "3990082622452650566"]);
const INCLUDED_EXTERNAL_IDS = new Set([
  "7683301114023939348", "7682173924817358100", "7682929732656188693",
  "7685902044862942485", "3991391175003360385", "3986879758008167609",
  "3987049638114123295", "3986162588420753795", "3986317332877413403",
  "3980566841372687701", "7685527573824015636", "7684415937629424917",
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

const normKey = (platform: string, id: string, url?: string | null) => {
  const fromUrl = (url ?? "").match(/(?:video|reel|p|shorts)\/([\w.-]+)/i)?.[1];
  return `${platform}::${(fromUrl ?? id).toLowerCase()}`;
};

/**
 * Pestaña "Todo": une General + Equipos y chivos + Influencers sin duplicar piezas.
 */
export const UnifiedSection = ({
  accent = "#E91E63",
  range = EMPTY_RANGE,
  onRangeChange,
}: {
  accent?: string;
  range?: ConsultationRange;
  onRangeChange?: (r: ConsultationRange) => void;
}) => {
  const [platform, setPlatform] = useState<"all" | Platform>("all");
  const [loading, setLoading] = useState(true);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [allRows, setAllRows] = useState<Row[]>([]);
  const [coverage, setCoverage] = useState<{ generalFrom: string | null; generalTo: string | null; refreshedAt: string | null; missingGeneral: boolean; error: string | null; truncated: boolean }>({ generalFrom: null, generalTo: null, refreshedAt: null, missingGeneral: false, error: null, truncated: false });

  /** Lee solo datos guardados (caché acumulado + publicaciones capturadas); el rango se aplica después por fecha de publicación. */
  const loadRows = async () => {
    const [{ data: cached, error: cacheError }, influencer] = await Promise.all([
      supabase
        .from("brand_metricool_cache")
        .select("payload, refreshed_at")
        .eq("brand_slug", "pelotica-de-goma")
        .eq("scope", "brand")
        .eq("period_key", "cumulative-2026")
        .maybeSingle(),
      fetchAllPages<any>((a, b) => supabase
        .from("influencer_posts")
        .select("*")
        .eq("campaign_slug", "pelotica-de-goma")
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("id", { ascending: true })
        .range(a, b)),
    ]);
    const influencerRows = influencer.rows;

    const out = new Map<string, Row>();

    // 1. General (Metricool, caché acumulado 2026)
    const payload = (cached?.payload ?? null) as any;
    const posts = (payload?.posts ?? []) as any[];
    for (const p of posts) {
      if (EXCLUDED_GENERAL_IDS.has(p.id)) continue;
      if (!p.publishedAt) continue;
      const t = String(p.text ?? "").toLowerCase();
      const oficial = p.blogId === PELOTICA_OFICIAL_BLOG_ID;
      if (!oficial) {
        if (!GENERAL_KEYWORDS.some((k) => t.includes(k))) continue;
        const esVacilate =
          t.includes("@vacilateestopodcast") || t.replace(/\s+/g, "").includes("#vacilateesto");
        if (esVacilate && !PELOTICA_KEYWORDS.some((k) => t.includes(k))) continue;
        if (p.platform === "youtube" && !t.replace(/\s+/g, "").includes("#peloticadegoma")) continue;
      }
      const key2 = normKey(p.platform, p.id, p.url);
      out.set(key2, {
        key: key2,
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
        // Si la red no reporta impresiones (TikTok, YouTube, reels), cada vista cuenta como mínimo una impresión.
        impressions: Math.max(p.metrics?.impressions ?? 0, p.metrics?.views ?? 0, 0),
      });
    }

    // 2. Equipos y chivos + Influencers (influencer_posts)
    for (const p of (influencerRows ?? []) as any[]) {
      const ts = p.published_at ? Date.parse(p.published_at) : NaN;
      if (!Number.isFinite(ts) || ts < CAMPAIGN_START) continue;
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
      } else if (category === "oficial") {
        // @peloticadegomave: todos sus posts; otras cuentas oficiales solo con criterio
        valid = handle === "@peloticadegomave" || hasCriteria;
        source = "general";
      } else if (category === "equipo") {
        valid = true;
        source = "equipos";
      } else if (category === "chivo" || category === "super-chivo") {
        valid = hasCriteria || (category === "chivo" && mencionaEquipo);
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

      const key2 = normKey(p.platform, external, p.url);
      if (out.has(key2)) continue; // ya contabilizado en General
      out.set(key2, {
        key: key2,
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
        impressions: Math.max(0, p.views ?? 0),
      });
    }

    return [...out.values()].sort((a, b) =>
      (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
    );
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const r = await loadRows(periodKey);
      if (!cancelled) {
        setRows(r);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [periodKey]);


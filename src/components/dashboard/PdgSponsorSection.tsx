import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Heart, Loader2, Music2, Instagram } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Marcas patrocinantes que solo aparecen en @peloticadegomave.
export const PDG_SPONSORS: Record<string, { name: string; handle: string }> = {
  "pilsen-pdg": { name: "Pilsen", handle: "polarpilsen" },
  "maltin-pdg": { name: "Maltín", handle: "mimaltinpolar" },
  "pan-pdg": { name: "PAN", handle: "panvenezuela" },
  "doritos-pdg": { name: "Doritos", handle: "doritosvzla" },
};

const START = "2026-01-01T00:00:00-04:00";
const fmt = (n: number) => new Intl.NumberFormat("es-VE").format(Math.round(n || 0));

type Post = {
  platform: string; external_id: string; url: string | null; text: string | null;
  thumbnail: string | null; published_at: string | null; views: number | null;
  likes: number | null; comments: number | null; shares: number | null; hashtags: string[] | null;
};

// Cuenta: publicación de @peloticadegomave que menciona a la cuenta de la marca.
export const isSponsorPost = (p: Pick<Post, "text">, handle: string) =>
  new RegExp(`@${handle.replace(/\./g, "\\.")}(?![\\w.])`, "i").test(p.text ?? "");

export const PdgSponsorSection = ({ slug }: { slug: string }) => {
  const cfg = PDG_SPONSORS[slug];
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [net, setNet] = useState<"all" | "instagram" | "tiktok">("all");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("influencer_posts")
        .select("platform,external_id,url,text,thumbnail,published_at,views,likes,comments,shares,hashtags")
        .eq("author_handle", "@peloticadegomave")
        .gte("published_at", new Date(START).toISOString())
        .ilike("text", `%@${cfg.handle}%`)
        .order("published_at", { ascending: false })
        .limit(2000);
      if (error) toast.error("No se pudieron cargar las publicaciones");
      const seen = new Set<string>();
      setPosts(((data as Post[]) ?? []).filter((p) => {
        const k = `${p.platform}:${p.external_id}`;
        if (seen.has(k) || !isSponsorPost(p, cfg.handle)) return false;
        seen.add(k);
        return true;
      }));
      setLoading(false);
    })();
  }, [cfg.handle]);

  const filtered = useMemo(() => (net === "all" ? posts : posts.filter((p) => p.platform === net)), [posts, net]);
  const t = useMemo(() => filtered.reduce((a, p) => {
    a.views += Math.max(0, p.views ?? 0);
    a.inter += Math.max(0, p.likes ?? 0) + Math.max(0, p.comments ?? 0) + Math.max(0, p.shares ?? 0);
    if (p.platform === "instagram") a.ig++; else if (p.platform === "tiktok") a.tt++;
    return a;
  }, { views: 0, inter: 0, ig: 0, tt: 0 }), [filtered]);

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-black">{cfg.name} · @{cfg.handle} en Pelotica de Goma</h2>
        <p className="text-[11px] text-muted-foreground font-mono">
          Publicaciones de @peloticadegomave que mencionan a @{cfg.handle} · desde el inicio de 2026 · cada publicación se cuenta una vez · Fuente: Apify
        </p>
      </div>
      <div className="flex gap-2 mb-5">
        {(["all", "instagram", "tiktok"] as const).map((k) => (
          <button key={k} onClick={() => setNet(k)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border ${net === k ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"}`}>
            {k === "all" ? "Todas" : k === "instagram" ? "Instagram" : "TikTok"}
          </button>
        ))}
      </div>
      {loading ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[["Publicaciones", filtered.length], ["Vistas", t.views], ["Interacciones", t.inter], ["IG / TikTok", `${t.ig} / ${t.tt}`]].map(([l, v]) => (
              <div key={l as string} className="bg-card border border-border rounded-2xl p-4">
                <p className="text-[11px] uppercase text-muted-foreground font-mono">{l}</p>
                <p className="text-2xl font-black">{typeof v === "number" ? fmt(v) : v}</p>
              </div>
            ))}
          </div>
          {filtered.length === 0 ? (
            <p className="text-muted-foreground">Aún no hay publicaciones que mencionen a @{cfg.handle}.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {filtered.map((p) => (
                <a key={`${p.platform}:${p.external_id}`} href={p.url ?? "#"} target="_blank" rel="noreferrer"
                  className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-colors">
                  {p.thumbnail && <img src={p.thumbnail} alt="" loading="lazy" referrerPolicy="no-referrer" className="w-full aspect-[4/5] object-cover bg-muted" />}
                  <div className="p-2 text-[11px]">
                    <div className="flex items-center justify-between text-muted-foreground mb-1">
                      {p.platform === "tiktok" ? <Music2 className="w-3 h-3" /> : <Instagram className="w-3 h-3" />}
                      <span>{p.published_at ? format(new Date(p.published_at), "d MMM yyyy", { locale: es }) : ""}</span>
                    </div>
                    <p className="line-clamp-2 mb-1">{p.text}</p>
                    <div className="flex gap-3 font-mono">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{fmt(p.views ?? 0)}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{fmt(p.likes ?? 0)}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

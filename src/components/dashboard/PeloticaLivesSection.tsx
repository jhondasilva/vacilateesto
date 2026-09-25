import { Radio, Clock, Eye, Users, Gift, MessageCircle, Youtube } from "lucide-react";

// Lives TikTok — capturas de TikTok Studio ("Centro LIVE"), carpeta de Drive del equipo.
// VE = @vacilateesto · PDG = @peloticadegomave. "Espectadores" = views.
export type LiveRow = {
  platform: "tiktok" | "youtube";
  account: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  minutes: number;
  views: number;
  followers: number | null;
  donors: number | null;
  comments: number | null;
  url?: string;
};

export const PELOTICA_TIKTOK_LIVES: LiveRow[] = [
  { platform: "tiktok", account: "@vacilateesto", title: "Live Pelotica de Goma", date: "2026-09-12", minutes: 219, views: 9000, followers: 73, donors: 2, comments: null },
  { platform: "tiktok", account: "@vacilateesto", title: "Live Pelotica de Goma", date: "2026-09-13", minutes: 164, views: 25000, followers: 270, donors: 3, comments: null },
  { platform: "tiktok", account: "@peloticadegomave", title: "Live Pelotica de Goma", date: "2026-09-19", minutes: 164, views: 1000, followers: 19, donors: 1, comments: null },
  { platform: "tiktok", account: "@vacilateesto", title: "Live Pelotica de Goma", date: "2026-09-19", minutes: 198, views: 18000, followers: 182, donors: 10, comments: null },
  { platform: "tiktok", account: "@peloticadegomave", title: "Live Pelotica de Goma", date: "2026-09-20", minutes: 214, views: 2000, followers: 34, donors: null, comments: 143 },
  { platform: "tiktok", account: "@vacilateesto", title: "Live Pelotica de Goma", date: "2026-09-20", minutes: 222, views: 73000, followers: 619, donors: 27, comments: null },
];

// Lives YouTube — transmisiones del 4to Split en @Vacilateestopodcast (vistas al 25 sep 2026).
const yt = (id: string, title: string, date: string, seconds: number, views: number): LiveRow => ({
  platform: "youtube", account: "@Vacilateestopodcast", title, date,
  minutes: Math.round(seconds / 60), views, followers: null, donors: null, comments: null,
  url: `https://www.youtube.com/watch?v=${id}`,
});
export const PELOTICA_YOUTUBE_LIVES: LiveRow[] = [
  yt("KNQ-7-Xwj1s", "4to Split · 3era Jornada", "2026-09-13", 6480, 1614),
  yt("mux_H2hkRFk", "4to Split · 3era Jornada", "2026-09-13", 6396, 1501),
  yt("ftjVZQhzDWU", "4to Split · 3era Jornada", "2026-09-13", 13700, 3495),
  yt("FaEN9YPHYbM", "4to Split · 3era Jornada", "2026-09-19", 2759, 842),
  yt("cIJWiz3-Uik", "4to Split · 5ta Jornada", "2026-09-19", 8063, 1823),
  yt("dUawp5IHSkE", "4to Split · 6ta Jornada", "2026-09-20", 14684, 3790),
];

export const PELOTICA_LIVES: LiveRow[] = [...PELOTICA_TIKTOK_LIVES, ...PELOTICA_YOUTUBE_LIVES].sort((a, b) =>
  a.date.localeCompare(b.date),
);

export const sumLives = (rows: LiveRow[]) =>
  rows.reduce(
    (a, l) => ({
      lives: a.lives + 1,
      minutes: a.minutes + l.minutes,
      views: a.views + l.views,
      followers: a.followers + (l.followers ?? 0),
      donors: a.donors + (l.donors ?? 0),
      comments: a.comments + (l.comments ?? 0),
    }),
    { lives: 0, minutes: 0, views: 0, followers: 0, donors: 0, comments: 0 },
  );

const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : String(n);
const hours = (m: number) => `${Math.floor(m / 60)}h ${m % 60}m`;
const fmtDate = (d: string) => {
  const [, mm, dd] = d.split("-");
  return `${dd}/${mm}`;
};

export const PeloticaLivesSection = () => {
  const tk = sumLives(PELOTICA_TIKTOK_LIVES);
  const ytT = sumLives(PELOTICA_YOUTUBE_LIVES);
  const all = sumLives(PELOTICA_LIVES);

  const Card = ({ title, icon: Icon, t, extra }: { title: string; icon: any; t: ReturnType<typeof sumLives>; extra?: boolean }) => (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-muted-foreground mb-3">
        <Icon className="w-4 h-4" /> {title}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div><div className="text-2xl font-black">{t.lives}</div><div className="text-[11px] text-muted-foreground">Lives</div></div>
        <div><div className="text-2xl font-black">{fmt(t.views)}</div><div className="text-[11px] text-muted-foreground">Vistas</div></div>
        <div><div className="text-2xl font-black">{hours(t.minutes)}</div><div className="text-[11px] text-muted-foreground">Al aire</div></div>
      </div>
      {extra && (
        <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {fmt(t.followers)} seguidores nuevos</span>
          <span className="flex items-center gap-1"><Gift className="w-3 h-3" /> {t.donors} donadores</span>
          <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {t.comments} comentarios</span>
        </div>
      )}
    </div>
  );

  return (
    <section className="mt-12 mb-12">
      <div className="flex items-center gap-2 mb-1">
        <Radio className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-black">Lives · TikTok + YouTube</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        TikTok: capturas de TikTok Studio de @vacilateesto y @peloticadegomave. YouTube: transmisiones del 4to Split en
        @Vacilateestopodcast. Los lives no se suman a las piezas de arriba.
      </p>
      <div className="grid md:grid-cols-3 gap-3 mb-6">
        <Card title="TikTok" icon={Radio} t={tk} extra />
        <Card title="YouTube" icon={Youtube} t={ytT} />
        <Card title="Total lives" icon={Eye} t={all} />
      </div>
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Fecha</th>
              <th className="text-left px-3 py-3">Red</th>
              <th className="text-left px-3 py-3">Cuenta</th>
              <th className="text-left px-3 py-3">Live</th>
              <th className="text-right px-3 py-3"><Clock className="w-3 h-3 inline" /> Duración</th>
              <th className="text-right px-3 py-3">Vistas</th>
              <th className="text-right px-3 py-3">Seg.</th>
              <th className="text-right px-4 py-3">Don.</th>
            </tr>
          </thead>
          <tbody>
            {PELOTICA_LIVES.map((l, i) => (
              <tr key={i} className="border-t border-border">
                <td className="px-4 py-2 whitespace-nowrap">{fmtDate(l.date)}</td>
                <td className="px-3 py-2">{l.platform === "tiktok" ? "TikTok" : "YouTube"}</td>
                <td className="px-3 py-2 text-muted-foreground">{l.account}</td>
                <td className="px-3 py-2 font-bold">
                  {l.url ? <a href={l.url} target="_blank" rel="noreferrer" className="hover:underline">{l.title}</a> : l.title}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{hours(l.minutes)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{fmt(l.views)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{l.followers ?? "—"}</td>
                <td className="px-4 py-2 text-right tabular-nums">{l.donors ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

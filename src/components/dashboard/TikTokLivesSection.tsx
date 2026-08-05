import { Eye, Heart, MessageCircle, Users, Gem, Gift, Radio, Clock } from "lucide-react";

// Datos manuales de TikTok Studio — cobertura Mundial / Vacílate El Fútbol
// Fuente: TikTok Studio (capturas del 11–16 jun 2026, cuenta @vacilateesto)
const LIVES = [
  { title: "Arrancó la fiesta del fútbol", date: "11 jun, 12:16 p.m.", minutes: 31, views: 26800, donors: 13, diamonds: 34, followers: 541, comments: 1200, likes: 38100 },
  { title: "Previa Brasil vs Marruecos", date: "13 jun, 4:32 p.m.", minutes: 22, views: 7600, donors: 1, diamonds: 1, followers: 73, comments: 226, likes: 6400 },
  { title: "Termino Bra 1 Mar 1", date: "13 jun, 8:32 p.m.", minutes: 21, views: 3000, donors: 1, diamonds: 2, followers: 1, comments: 38, likes: 5500 },
  { title: "Previa de Portugal en Houston", date: "16 jun, 3:26 p.m.", minutes: 15, views: 1700, donors: 1, diamonds: 1, followers: 1, comments: 23, likes: 1600 },
  { title: "Sin nombre", date: "12 jun, 5:50 p.m.", minutes: 7, views: 959, donors: 0, diamonds: 0, followers: 4, comments: 0, likes: 0 },
  { title: "Previa Brasil vs Marruecos", date: "13 jun, 4:22 p.m.", minutes: 7, views: 597, donors: 0, diamonds: 0, followers: 0, comments: 14, likes: 0 },
];

const fmtNum = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : String(n);

export const TikTokLivesSection = () => {
  const totals = LIVES.reduce(
    (a, l) => ({
      lives: a.lives + 1,
      minutes: a.minutes + l.minutes,
      views: a.views + l.views,
      donors: a.donors + l.donors,
      diamonds: a.diamonds + l.diamonds,
      followers: a.followers + l.followers,
      comments: a.comments + l.comments,
      likes: a.likes + l.likes,
    }),
    { lives: 0, minutes: 0, views: 0, donors: 0, diamonds: 0, followers: 0, comments: 0, likes: 0 },
  );

  const Stat = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider font-bold mb-2">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className="text-2xl font-black">{value}</div>
    </div>
  );

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-1">
        <Radio className="w-5 h-5 text-[hsl(346,87%,55%)]" />
        <h2 className="text-xl font-black">Lives en TikTok · Cobertura Mundial</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Acumulado de {LIVES.length} transmisiones LIVE desde @vacilateesto · Fuente: TikTok Studio
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat icon={Radio} label="Lives" value={String(totals.lives)} />
        <Stat icon={Clock} label="Minutos al aire" value={String(totals.minutes)} />
        <Stat icon={Eye} label="Visualizaciones" value={fmtNum(totals.views)} />
        <Stat icon={Heart} label="Me gusta" value={fmtNum(totals.likes)} />
        <Stat icon={MessageCircle} label="Comentarios" value={fmtNum(totals.comments)} />
        <Stat icon={Users} label="Nuevos seguidores" value={fmtNum(totals.followers)} />
        <Stat icon={Gift} label="Donadores" value={String(totals.donors)} />
        <Stat icon={Gem} label="Diamantes" value={String(totals.diamonds)} />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-bold">Live</th>
                <th className="text-left px-3 py-3 font-bold">Fecha</th>
                <th className="text-right px-3 py-3 font-bold">Min</th>
                <th className="text-right px-3 py-3 font-bold">Views</th>
                <th className="text-right px-3 py-3 font-bold">Likes</th>
                <th className="text-right px-3 py-3 font-bold">Coment.</th>
                <th className="text-right px-3 py-3 font-bold">Seg.</th>
                <th className="text-right px-3 py-3 font-bold">Don.</th>
                <th className="text-right px-4 py-3 font-bold">Diam.</th>
              </tr>
            </thead>
            <tbody>
              {LIVES.map((l, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-3 font-bold">{l.title}</td>
                  <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{l.date}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{l.minutes}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{fmtNum(l.views)}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{fmtNum(l.likes)}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{fmtNum(l.comments)}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{fmtNum(l.followers)}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{l.donors}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{l.diamonds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export const TIKTOK_LIVES_BRANDS = new Set([
  "vatel",
  "maggi",
  "bnc",
  "empire",
  "buchanans",
  "kfc",
  "coca-cola",
  "vacilate-el-mundial",
]);
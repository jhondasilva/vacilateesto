import { useState } from "react";
import {
  PELOTICA_OFFICIAL,
  OFFICIAL_PLATFORMS,
  FOLLOWER_GROWTH_YEAR,
  OFFICIAL_AUDIENCE,
  TOP_HASHTAGS,
} from "@/data/peloticaOfficialAccounts";

const f = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : `${n}`;

const PeloticaOfficialAccounts = () => {
  const [period, setPeriod] = useState<"year" | "september">("year");
  const d = PELOTICA_OFFICIAL[period];
  const metrics = [
    { k: "followers", label: "Seguidores", m: d.followers },
    { k: "impressions", label: "Impresiones", m: d.impressions },
    { k: "interactions", label: "Interacciones", m: d.interactions },
    { k: "publications", label: "Publicaciones", m: d.publications },
  ] as const;

  return (
    <section className="mb-8 rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-black">Cuentas oficiales · @peloticadegomave</h2>
          <p className="text-xs text-muted-foreground">
            Solo cuentas propias (IG · TikTok · FB · YouTube). Fuente: informes de Metricool al 29/09/2026. Bloque aparte: no se suma al total unificado.
          </p>
        </div>
        <div className="flex gap-1 rounded-full border border-border p-1">
          {([["year", "Año 2026"], ["september", "Septiembre"]] as const).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setPeriod(k)}
              className={`px-3 py-1 rounded-full text-xs font-bold ${period === k ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {metrics.map(({ k, label, m }) => (
          <div key={k} className="rounded-xl border border-border p-3">
            <p className="text-[11px] uppercase font-bold text-muted-foreground">{label}</p>
            <p className="text-2xl font-black">{f(m.total)}</p>
            <p className="text-[11px] text-primary font-bold">{m.change} vs. periodo anterior</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto mb-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="py-2 pr-3">Red</th>
              <th className="py-2 pr-3">Seguidores</th>
              <th className="py-2 pr-3">Impresiones</th>
              <th className="py-2 pr-3">Interacciones</th>
              <th className="py-2">Publicaciones</th>
            </tr>
          </thead>
          <tbody>
            {OFFICIAL_PLATFORMS.map((p) => (
              <tr key={p.key} className="border-b border-border/50">
                <td className="py-2 pr-3 font-bold">{p.label}</td>
                <td className="py-2 pr-3">
                  {f(d.followers.by[p.key])}{" "}
                  <span className="text-[11px] text-primary">{FOLLOWER_GROWTH_YEAR[p.key]} año</span>
                </td>
                <td className="py-2 pr-3">{f(d.impressions.by[p.key])}</td>
                <td className="py-2 pr-3">{f(d.interactions.by[p.key])}</td>
                <td className="py-2">{d.publications.by[p.key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { t: "Público Instagram · países", rows: OFFICIAL_AUDIENCE.instagram },
          { t: "Público Instagram · ciudades", rows: OFFICIAL_AUDIENCE.instagramCities },
          { t: "Público Facebook · países", rows: OFFICIAL_AUDIENCE.facebook },
          { t: "Público YouTube · países", rows: OFFICIAL_AUDIENCE.youtube },
        ].map((b) => (
          <div key={b.t} className="rounded-xl border border-border p-3">
            <p className="text-[11px] uppercase font-bold text-muted-foreground mb-2">{b.t}</p>
            {b.rows.map(([n, v]) => (
              <div key={n} className="mb-1.5">
                <div className="flex justify-between text-xs"><span>{n}</span><span className="font-bold">{v}%</span></div>
                <div className="h-1.5 rounded bg-muted"><div className="h-1.5 rounded bg-primary" style={{ width: `${v}%` }} /></div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-border p-3">
        <p className="text-[11px] uppercase font-bold text-muted-foreground mb-2">Hashtags con más vistas en Instagram (año)</p>
        <div className="flex flex-wrap gap-2">
          {TOP_HASHTAGS.map((h) => (
            <span key={h.tag} className="rounded-full bg-muted px-3 py-1 text-xs">
              <strong>{h.tag}</strong> · {f(h.views)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PeloticaOfficialAccounts;

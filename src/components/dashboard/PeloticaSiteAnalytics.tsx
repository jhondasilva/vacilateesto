import { useEffect, useState } from "react";
import { SITE_ANALYTICS, GOOGLE_TRENDS as G, loadLiveSiteAnalytics } from "@/data/peloticaSiteAnalytics";

const f = (n: number) => n.toLocaleString("es-VE");

const PeloticaSiteAnalytics = ({ part = "all" }: { part?: "all" | "web" | "trends" }) => {
  const [S, setS] = useState({ ...SITE_ANALYTICS });
  useEffect(() => { loadLiveSiteAnalytics().then((d) => setS({ ...d })); }, []);
  const max = Math.max(1, ...S.monthly.map(([, v]) => v));
  return (
    <section className="rounded-3xl border border-border bg-card p-6 space-y-6">
      {part !== "trends" && (<>
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Analítica del sitio · {S.label}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
          {[
            ["Visitantes", f(S.visitors)],
            ["Páginas vistas", f(S.pageviews)],
            ["Páginas por visita", S.pagesPerVisit.toLocaleString("es-VE")],
            ["Desde móviles", `${S.mobilePct.toLocaleString("es-VE")} %`],
          ].map(([l, v]) => (
            <div key={l}><p className="text-xs text-muted-foreground">{l}</p><p className="text-2xl font-black">{v}</p></div>
          ))}
        </div>
      </div>
      <div className="flex items-end gap-2 h-32">
        {S.monthly.map(([m, v]) => (
          <div key={m} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] text-muted-foreground">{f(v)}</span>
            <div className="w-full rounded-t bg-primary" style={{ height: `${(v / max) * 90}px` }} />
            <span className="text-[10px] font-bold">{m}</span>
          </div>
        ))}
      </div>
      <ul className="text-sm space-y-1 text-muted-foreground">
        <li><b className="text-foreground">Lectura clave:</b> {S.keyReading}</li>
        <li>{S.peaks}</li>
        <li><b className="text-foreground">Canales:</b> {S.channels}</li>
        <li><b className="text-foreground">Páginas:</b> {S.pages}</li>
      </ul>
      </>)}
      {part !== "web" && (
      <div className={part === "all" ? "border-t border-border pt-4" : ""}>
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{G.label}</p>
        <div className="flex gap-6 mt-2">
          <div><p className="text-xs text-muted-foreground">Interés promedio · {G.termMain} (azul)</p><p className="text-2xl font-black">{G.avgMain}</p></div>
          <div><p className="text-xs text-muted-foreground">Interés promedio · {G.termCompare} (rojo)</p><p className="text-2xl font-black">{G.avgCompare}</p></div>
          <div><p className="text-xs text-muted-foreground">Interés combinado (ambas válidas)</p><p className="text-2xl font-black">{G.avgCombined}</p></div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{G.reading}</p>
        {part === "trends" && (
          <ul className="text-sm space-y-2 text-muted-foreground mt-4 list-disc pl-5">
            <li><b className="text-foreground">Dos formas de buscarlo:</b> la gente escribe "Pelotica de Goma" (promedio {G.avgMain}) y "Pelota de Goma" (promedio {G.avgCompare}). Juntas suman un interés de {G.avgCombined}.</li>
            <li><b className="text-foreground">El máximo histórico (100) fue en 2024.</b> Todos los demás valores se miden en relación con ese pico.</li>
            <li><b className="text-foreground">Repunte en 2026:</b> el interés vuelve a subir con el Split 4 (agosto y septiembre). Coincide con el salto de visitantes del sitio web en esos mismos meses.</li>
            <li><b className="text-foreground">Qué significa:</b> la conversación en redes se convierte en búsquedas en Google. Esas búsquedas son hoy la fuente principal de tráfico del sitio.</li>
            <li className="text-xs">Google Trends da un índice relativo de 0 a 100, no un número de búsquedas. Estos datos vienen de una captura y no se actualizan solos.</li>
          </ul>
        )}
      </div>
      )}
    </section>
  );
};

export default PeloticaSiteAnalytics;

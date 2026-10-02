// Fuente: informes Metricool de Vacílate Esto (ene–sep 2026 y sep 2026).
const YEAR = [
  { label: "Impresiones", value: "47,10M" },
  { label: "Interacciones", value: "1,07M" },
  { label: "Publicaciones", value: "3.121" },
  { label: "Seguidores", value: "1,85M" },
];
const SEPT = [
  { label: "Impresiones", value: "7,64M", change: "+16,7%" },
  { label: "Interacciones", value: "49.320", change: "+59,1%" },
  { label: "Publicaciones", value: "317", change: "+0,3%" },
];
const NETWORKS = [
  ["Instagram", "15,22M"],
  ["Facebook", "14,29M"],
  ["TikTok", "8,50M"],
  ["YouTube", "8,48M"],
  ["Threads", "615K"],
];

const ImpactSection = () => (
  <section id="impacto" className="py-16 px-4 bg-background" aria-labelledby="impacto-title">
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Impacto 2026 · Metricool</p>
        <h2 id="impacto-title" className="text-3xl md:text-5xl font-black text-foreground">Nuestros contenidos y audiencias</h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6">
          <p className="text-sm font-bold text-muted-foreground">Acumulado · ene – sep 2026</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {YEAR.map((k) => (
              <div key={k.label}>
                <p className="text-3xl md:text-4xl font-black text-foreground">{k.value}</p>
                <p className="text-xs text-muted-foreground">{k.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-border pt-4">
            <p className="text-xs font-bold text-muted-foreground mb-2">Impresiones por red</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {NETWORKS.map(([n, v]) => (
                <p key={n} className="text-sm text-foreground"><b>{v}</b> <span className="text-muted-foreground">{n}</span></p>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-primary text-primary-foreground p-6">
          <p className="text-sm font-bold opacity-80">Destacado · septiembre 2026</p>
          <div className="space-y-4 mt-4">
            {SEPT.map((k) => (
              <div key={k.label} className="flex items-end justify-between gap-2">
                <div>
                  <p className="text-3xl font-black">{k.value}</p>
                  <p className="text-xs opacity-80">{k.label}</p>
                </div>
                <span className="text-sm font-bold">{k.change}</span>
              </div>
            ))}
          </div>
          <p className="text-xs opacity-80 mt-4">Cambio frente a agosto 2026.</p>
        </div>
      </div>
    </div>
  </section>
);

export default ImpactSection;

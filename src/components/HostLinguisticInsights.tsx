import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mic, Sparkles, BookOpen, Repeat, Clock, MessageSquare, AlertCircle } from "lucide-react";

type HostStat = {
  host_key: "juan" | "jhon";
  display_name: string;
  total_seconds_spoken: number;
  total_turns: number;
  total_words: number;
  unique_words: number;
  avg_turn_length_seconds: number;
  lexical_richness: number;
  top_words: { word: string; count: number }[];
  top_fillers: { word: string; count: number }[];
  videos_analyzed: number;
  last_computed_at: string;
};

function formatDuration(seconds: number) {
  if (!seconds) return "0 min";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}

const ACCENT_BY_HOST: Record<string, "primary" | "accent"> = {
  juan: "accent",
  jhon: "primary",
};

const HostLinguisticInsights = () => {
  const [hosts, setHosts] = useState<HostStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("host-insights", {
          body: {},
        });
        if (cancelled) return;
        if (error) throw error;
        setHosts((data?.hosts as HostStat[]) || []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "No pudimos cargar los insights");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalSeconds = hosts.reduce((acc, h) => acc + (h.total_seconds_spoken || 0), 0);

  return (
    <section
      id="linguistic-insights"
      className="relative py-20 md:py-28 bg-gradient-to-b from-background via-muted/30 to-background overflow-hidden"
      aria-labelledby="insights-title"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background -rotate-1 border-2 border-foreground mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="font-display font-black text-xs uppercase tracking-widest">
              Análisis lingüístico
            </span>
          </div>
          <h2
            id="insights-title"
            className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[0.95] mb-4"
          >
            ¿Quién habla <span className="text-gradient">más</span> y <span className="text-gradient">cómo</span>?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Datos curiosos extraídos automáticamente de las transcripciones indexadas: tiempo
            hablado, palabras favoritas, muletillas y riqueza léxica de cada host.
          </p>
        </div>

        {loading && (
          <div className="text-center text-muted-foreground py-12">
            Calculando estadísticas…
          </div>
        )}

        {error && !loading && (
          <div className="max-w-xl mx-auto bg-destructive/10 border-2 border-destructive/40 rounded-2xl p-6 text-center">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {!loading && !error && hosts.length === 0 && (
          <div className="max-w-xl mx-auto bg-muted/40 border-2 border-dashed border-border rounded-2xl p-8 text-center">
            <Mic className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
            <p className="font-display font-black text-lg mb-2">Aún no hay datos</p>
            <p className="text-sm text-muted-foreground">
              Tenemos que diarizar los episodios primero. Corre{" "}
              <code className="bg-foreground/10 px-1.5 py-0.5 rounded text-xs">
                python scripts/youtube-search/diarize.py
              </code>{" "}
              y vuelve a esta página.
            </p>
          </div>
        )}

        {!loading && !error && hosts.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
              {hosts.map((host) => {
                const accent = ACCENT_BY_HOST[host.host_key] || "primary";
                const sharePct =
                  totalSeconds > 0
                    ? Math.round((host.total_seconds_spoken / totalSeconds) * 100)
                    : 0;
                return (
                  <article
                    key={host.host_key}
                    className={`bg-background rounded-3xl border-2 border-foreground p-6 md:p-8 sticker-shadow-lg-${accent}`}
                  >
                    <header className="mb-6 pb-5 border-b-2 border-dashed border-border">
                      <p className="font-display font-black text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                        Host
                      </p>
                      <h3 className="font-display font-black text-2xl md:text-3xl tracking-tight leading-none">
                        {host.display_name}
                      </h3>
                      <p className={`font-display font-black text-sm uppercase tracking-widest mt-2 text-${accent}`}>
                        {sharePct}% del tiempo de palabra
                      </p>
                    </header>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <Stat
                        icon={Clock}
                        label="Tiempo hablado"
                        value={formatDuration(host.total_seconds_spoken)}
                      />
                      <Stat
                        icon={MessageSquare}
                        label="Turnos"
                        value={host.total_turns.toLocaleString("es-VE")}
                      />
                      <Stat
                        icon={BookOpen}
                        label="Palabras únicas"
                        value={host.unique_words.toLocaleString("es-VE")}
                      />
                      <Stat
                        icon={Sparkles}
                        label="Riqueza léxica"
                        value={`${(host.lexical_richness * 100).toFixed(1)}%`}
                        hint="palabras únicas / total"
                      />
                    </div>

                    {host.top_words.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-display font-black text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5" /> Palabras favoritas
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {host.top_words.slice(0, 18).map((w, i) => {
                            const max = host.top_words[0].count;
                            const scale = 0.85 + (w.count / max) * 0.6;
                            return (
                              <span
                                key={w.word}
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-foreground/5 border border-border font-display font-bold lowercase`}
                                style={{ fontSize: `${scale}rem` }}
                                title={`${w.count} veces`}
                              >
                                {w.word}
                                <span className="text-[10px] text-muted-foreground">{w.count}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {host.top_fillers.length > 0 && (
                      <div>
                        <h4 className="font-display font-black text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                          <Repeat className="w-3.5 h-3.5" /> Muletillas top
                        </h4>
                        <ul className="space-y-1.5">
                          {host.top_fillers.slice(0, 6).map((f, i) => {
                            const max = host.top_fillers[0].count;
                            const pct = (f.count / max) * 100;
                            return (
                              <li key={f.word} className="flex items-center gap-3">
                                <span className="font-display font-black text-sm w-24 truncate lowercase">
                                  {f.word}
                                </span>
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className={`h-full bg-${accent} rounded-full`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground w-12 text-right tabular-nums">
                                  {f.count}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            <p className="text-center text-xs text-muted-foreground mt-8">
              Basado en {hosts[0]?.videos_analyzed || 0} episodios diarizados · actualizado{" "}
              {hosts[0]?.last_computed_at
                ? new Date(hosts[0].last_computed_at).toLocaleDateString("es-VE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </>
        )}
      </div>
    </section>
  );
};

const Stat = ({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: any;
  label: string;
  value: string;
  hint?: string;
}) => (
  <div className="bg-foreground/5 rounded-2xl p-4 border border-border">
    <div className="flex items-center gap-2 mb-1.5 text-muted-foreground">
      <Icon className="w-3.5 h-3.5" />
      <span className="font-display font-black text-[10px] uppercase tracking-widest">
        {label}
      </span>
    </div>
    <p className="font-display font-black text-xl md:text-2xl tracking-tight leading-none">
      {value}
    </p>
    {hint && <p className="text-[10px] text-muted-foreground mt-1">{hint}</p>}
  </div>
);

export default HostLinguisticInsights;
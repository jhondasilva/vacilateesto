import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SUGGESTIONS = [
  "la mejor arepa",
  "Roraima",
  "el Silbón",
  "Salomón Rondón",
  "perro caliente",
  "ramen",
  "Diosdado",
  "llaneridad",
];

const TICKER = ["BUSCÁ", "★", "ESCUCHÁ", "✦", "VACILATÉ", "★", "DESCUBRE", "✦"];

const HomeSearchSection = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const go = (q: string) => {
    const trimmed = q.trim();
    if (trimmed.length < 2) return;
    navigate(`/buscador?q=${encodeURIComponent(trimmed)}`);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    go(query);
  };

  return (
    <section
      id="search"
      className="relative py-20 md:py-28 overflow-hidden bg-background"
      aria-labelledby="search-title"
    >
      {/* Background blobs + dot grid */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[36rem] h-[36rem] bg-primary/25 rounded-full blur-[140px] animate-float" />
        <div className="absolute -bottom-32 -right-32 w-[36rem] h-[36rem] bg-accent/25 rounded-full blur-[140px] animate-float-delayed" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      {/* Top marquee */}
      <div className="relative z-10 border-y-2 border-foreground bg-foreground text-background overflow-hidden py-2 mb-12 md:mb-16">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((item, i) => (
            <span
              key={i}
              className="font-display font-black text-sm md:text-base tracking-[0.15em] uppercase mx-6 inline-flex items-center"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center relative">
          {/* Floating sticker */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 bg-accent text-accent-foreground rounded-full px-4 py-1.5 -rotate-3 hover:rotate-0 transition-transform border-2 border-foreground shadow-[4px_4px_0_hsl(var(--foreground))]">
            <div className="flex items-center gap-1.5 font-display font-black text-[10px] uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              Buscador en vivo
            </div>
          </div>

          <h2
            id="search-title"
            className="font-display font-black text-foreground mb-2 tracking-[-0.04em] leading-[0.85] text-5xl sm:text-6xl md:text-7xl"
          >
            ¿de qué <span className="text-gradient italic">hablamos</span>
            <span className="block">sobre <span className="text-foreground">eso</span>?</span>
          </h2>

          <p className="text-muted-foreground text-base md:text-lg mt-6 mb-10 max-w-xl mx-auto leading-relaxed">
            Buscá cualquier tema dentro de todos nuestros podcasts y saltá al
            minuto exacto donde lo conversamos. ✦
          </p>

          {/* Search form — neo-brutalist */}
          <form onSubmit={onSubmit} className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center gap-2 bg-background rounded-full border-2 border-foreground p-2 pl-5 shadow-[6px_6px_0_hsl(var(--primary))] focus-within:shadow-[8px_8px_0_hsl(var(--accent))] focus-within:-translate-x-0.5 focus-within:-translate-y-0.5 transition-all">
              <Search className="w-5 h-5 text-foreground shrink-0" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ej: la leyenda del Silbón…"
                className="border-0 shadow-none focus-visible:ring-0 text-base md:text-lg bg-transparent flex-1 px-2 placeholder:text-muted-foreground"
                aria-label="Buscar contenido"
              />
              <Button
                type="submit"
                size="lg"
                className="rounded-full gap-2 shrink-0 bg-foreground text-background hover:bg-primary hover:text-primary-foreground border-2 border-foreground font-display font-black uppercase tracking-wider text-xs"
                disabled={query.trim().length < 2}
              >
                Buscar
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* Suggestions — chip stickers */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground mr-1">
              Probá con:
            </span>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => go(s)}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-background border-2 border-foreground text-foreground hover:bg-foreground hover:text-background hover:-translate-y-0.5 transition-all shadow-[3px_3px_0_hsl(var(--foreground))] hover:shadow-[4px_4px_0_hsl(var(--primary))]"
                style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 1.5}deg)` }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSearchSection;

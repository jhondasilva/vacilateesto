import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, ArrowRight } from "lucide-react";
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
      className="relative py-20 md:py-28 overflow-hidden"
      aria-labelledby="search-title"
    >
      {/* Studio neon background */}
      <div className="absolute inset-0 bg-studio" aria-hidden="true" />
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl opacity-30 bg-primary"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full blur-3xl opacity-30 bg-accent"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-soft mb-6">
            <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground">
              Buscador de conversaciones
            </span>
          </div>

          <h2
            id="search-title"
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 tracking-tight"
          >
            ¿De qué hablamos sobre{" "}
            <span className="text-gradient">eso</span>?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg mb-10 max-w-xl mx-auto">
            Buscá cualquier tema dentro de todos nuestros podcasts y saltá al
            minuto exacto donde lo conversamos.
          </p>

          <form
            onSubmit={onSubmit}
            className="relative max-w-2xl mx-auto group"
          >
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary via-accent to-primary opacity-30 blur-lg group-focus-within:opacity-60 transition-opacity duration-500" />
            <div className="relative flex items-center gap-2 bg-background rounded-2xl border border-border shadow-elevated p-2 pl-5">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ej: la leyenda del Silbón…"
                className="border-0 shadow-none focus-visible:ring-0 text-base md:text-lg bg-transparent flex-1 px-2"
                aria-label="Buscar contenido"
              />
              <Button
                type="submit"
                size="lg"
                className="rounded-xl gap-2 shrink-0"
                disabled={query.trim().length < 2}
              >
                Buscar
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground mr-1">
              Probá con:
            </span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => go(s)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-background/70 backdrop-blur-sm border border-border text-foreground hover:border-primary/40 hover:text-primary transition-all"
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

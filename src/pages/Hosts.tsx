import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Users, BarChart3, Search, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HostsSection from "@/components/HostsSection";
import HostLinguisticInsights from "@/components/HostLinguisticInsights";
import LabHosts from "./LabHosts";

type Section = "perfiles" | "insights" | "explorar";

const SECTIONS: { k: Section; label: string; icon: any; desc: string }[] = [
  { k: "perfiles", label: "Perfiles", icon: Users, desc: "Conoce a Jhon y Juan" },
  { k: "insights", label: "Insights", icon: BarChart3, desc: "Datos lingüísticos" },
  { k: "explorar", label: "Explorar contenido", icon: Search, desc: "Busca, compara y pregúntale a la IA" },
];

const Hosts = () => {
  const url = "https://www.vacilateesto.com/hosts";
  const [section, setSection] = useState<Section>("perfiles");

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Hosts de Vacílate Esto: Conoce, Explora e Interactúa con su Contenido</title>
        <meta
          name="description"
          content="Perfiles de Jhon y Juan, insights lingüísticos de sus podcasts, buscador por hablante e IA que conoce todo el contenido diarizado de YouTube."
        />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Hosts de Vacílate Esto" />
        <meta property="og:description" content="Conoce a Jhon y Juan, explora qué dice cada uno y pregúntale a la IA sobre sus podcasts y shorts." />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Header />
      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-4 pt-8 pb-6 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground text-background -rotate-1 border-2 border-foreground mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-display font-black text-[10px] uppercase tracking-widest">
              Los hosts · todo en un lugar
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight leading-[0.95] mb-4">
            Hosts de <span className="text-gradient">Vacílate Esto</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
            Conoce a <strong className="text-foreground">JhonSnacks</strong> y{" "}
            <strong className="text-foreground">JuanSofa</strong>, explora qué ha dicho cada uno en
            los podcasts y shorts de YouTube, y pregúntale a la IA cualquier cosa sobre el
            contenido diarizado.
          </p>
        </section>

        {/* Sticky section nav */}
        <div className="sticky top-20 z-30 bg-background/95 backdrop-blur-md border-y border-border">
          <div className="container mx-auto max-w-5xl px-4">
            <nav
              role="tablist"
              aria-label="Secciones de hosts"
              className="flex gap-1 sm:gap-2 overflow-x-auto py-3 scrollbar-none"
            >
              {SECTIONS.map(({ k, label, icon: Icon, desc }) => {
                const active = section === k;
                return (
                  <button
                    key={k}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSection(k)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border-2 transition-all whitespace-nowrap text-xs sm:text-sm font-semibold ${
                      active
                        ? "bg-foreground text-background border-foreground shadow-[3px_3px_0_hsl(var(--primary))]"
                        : "bg-background text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground"
                    }`}
                    title={desc}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="mt-2">
          {section === "perfiles" && (
            <div className="pt-8">
              <HostsSection />
            </div>
          )}

          {section === "insights" && <HostLinguisticInsights />}

          {section === "explorar" && (
            <section className="container mx-auto max-w-5xl px-4 py-10">
              <div className="mb-6">
                <h2 className="font-display font-black text-2xl md:text-4xl tracking-tight mb-2">
                  Explora el contenido de Jhon y Juan
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  Busca frases textuales por hablante, mira estadísticas por episodio o pregúntale
                  a la IA que conoce todo el contenido diarizado de podcasts y shorts.
                </p>
              </div>
              <LabHosts embedded />
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Hosts;
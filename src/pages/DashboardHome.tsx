import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBrandAuth } from "@/hooks/useBrandAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LogOut, ArrowRight, Settings } from "lucide-react";
import RequestAccessForm from "@/components/dashboard/RequestAccessForm";
import logoPeloticaDeGoma from "@/assets/logo-pelotica-de-goma.avif.asset.json";
import logoPodcastCumbre from "@/assets/logo-podcast-cumbre.avif";
import logoMundial from "@/assets/logo-mundial-2026.png";

/** Proyectos propios: se destacan arriba y con logo del proyecto. */
const PROJECT_LOGOS: Record<string, string> = {
  "pelotica-de-goma": logoPeloticaDeGoma.url,
  "podcast-en-la-cumbre": logoPodcastCumbre,
  "vacilate-el-mundial": logoMundial,
};
const PROJECT_SLUGS = Object.keys(PROJECT_LOGOS);


const DashboardHome = () => {
  // El hook ya devuelve marcas únicas por brand_id (incluso para admins).
  const { session, loading, brands, isAdmin } = useBrandAuth();

  if (!loading && !session) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="font-black tracking-tight text-lg">Vacílate Esto</Link>
            <Button asChild variant="outline" size="sm">
              <Link to="/dashboard/login">Iniciar sesión</Link>
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-12 max-w-md">
          <RequestAccessForm />
        </main>
      </div>
    );
  }

  if (!loading && session && brands.length === 1 && !isAdmin) {
    return <Navigate to={`/dashboard/${brands[0].brand.slug}`} replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-black tracking-tight text-lg">Vacílate Esto</Link>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard/admin"><Settings className="w-4 h-4 mr-1" /> Admin</Link>
              </Button>
            )}
            <Button onClick={() => supabase.auth.signOut()} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-1" /> Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-black mb-2">Tus dashboards</h1>
        <p className="text-muted-foreground mb-8">Selecciona un proyecto o una marca para ver sus resultados.</p>

        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        ) : brands.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <p className="text-muted-foreground">
              Aún no tienes marcas asignadas. Contáctanos en{" "}
              <a href="mailto:hola@vacilateesto.com" className="text-primary underline">
                hola@vacilateesto.com
              </a>
              .
            </p>
          </div>
        ) : (
          (() => {
            const projects = brands.filter((b) => PROJECT_SLUGS.includes(b.brand.slug));
            const clients = brands.filter((b) => !PROJECT_SLUGS.includes(b.brand.slug));
            return (
              <div className="space-y-12">
                {projects.length > 0 && (
                  <section>
                    <div className="flex items-center gap-3 mb-4">
                      <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary">
                        Proyectos Vacílate Esto
                      </h2>
                      <div className="h-px flex-1 bg-primary/30" />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      {projects.map((b) => (
                        <Link
                          key={b.brand.id}
                          to={`/dashboard/${b.brand.slug}`}
                          className="group relative overflow-hidden bg-card border-2 border-primary/40 rounded-2xl p-6 hover:border-primary hover:shadow-[0_0_0_4px_hsl(var(--primary)/0.12)] transition-all flex flex-col gap-4"
                        >
                          <div className="inline-flex bg-black rounded-xl p-2 w-fit">
                            <img
                              src={PROJECT_LOGOS[b.brand.slug]}
                              alt={`Logo de ${b.brand.name}`}
                              className="h-12 w-auto object-contain"
                              loading="lazy"
                            />
                          </div>
                          <div>
                            <p className="text-[10px] text-primary uppercase tracking-[0.18em] font-bold">
                              Proyecto propio
                            </p>
                            <p className="text-lg font-black leading-tight">{b.brand.name}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {clients.length > 0 && (
                  <section>
                    <div className="flex items-center gap-3 mb-4">
                      <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">
                        Dashboards de clientes
                      </h2>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {clients.map((b) => (
                        <Link
                          key={b.brand.id}
                          to={`/dashboard/${b.brand.slug}`}
                          className="group bg-card border border-border rounded-2xl p-5 hover:border-primary transition-colors flex items-center justify-between gap-4"
                          style={{ borderLeftColor: b.brand.brand_color ?? undefined, borderLeftWidth: 4 }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {b.brand.logo_url && (
                              <span className="inline-flex bg-black rounded-lg p-1.5 shrink-0">
                                <img
                                  src={b.brand.logo_url}
                                  alt={`Logo de ${b.brand.name}`}
                                  className="h-8 w-auto object-contain"
                                  loading="lazy"
                                />
                              </span>
                            )}
                            <div className="min-w-0">
                              <p className="text-xs text-muted-foreground uppercase tracking-wider">Marca</p>
                              <p className="text-lg font-bold truncate">{b.brand.name}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            );
          })()
        )}
      </main>

    </div>
  );
};

export default DashboardHome;
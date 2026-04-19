import { useEffect, useState, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useGiraAuth } from "@/hooks/useGiraAuth";
import { Button } from "@/components/ui/button";
import { CityCard, type City, type Activity, type Comment } from "@/components/gira/CityCard";
import { FinancialSummary } from "@/components/gira/FinancialSummary";
import { AddCityForm } from "@/components/gira/AddCityForm";
import { TripCalendar } from "@/components/gira/TripCalendar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LogOut, Loader2, MapPin, Wallet, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import logoVacilate from "@/assets/logo-vacilate-esto.png";
import logoMundial from "@/assets/logo-vacilate-mundial.svg";
import logoFifa from "@/assets/logo-mundial-2026.png";

const Gira = () => {
  const navigate = useNavigate();
  const { session, loading, isAllowed, displayName, user } = useGiraAuth();
  const [cities, setCities] = useState<City[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const loadData = useCallback(async () => {
    const [citiesRes, activitiesRes, commentsRes] = await Promise.all([
      supabase.from("trip_cities").select("*").order("position"),
      supabase.from("trip_activities").select("*").order("position"),
      supabase.from("trip_comments").select("*").order("created_at", { ascending: false }),
    ]);
    if (citiesRes.data) setCities(citiesRes.data as City[]);
    if (activitiesRes.data) setActivities(activitiesRes.data as Activity[]);
    if (commentsRes.data) setComments(commentsRes.data as Comment[]);
    setLoadingData(false);
  }, []);

  useEffect(() => {
    if (!loading && session && isAllowed) void loadData();
  }, [session, isAllowed, loading, loadData]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
    navigate("/gira/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!session || isAllowed === false) return <Navigate to="/gira/login" replace />;

  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Gira • Vacílate El Mundial</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/85 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img src={logoVacilate} alt="Vacílate Esto" className="h-9 w-auto hidden sm:block" loading="lazy" />
            <div className="hidden sm:block w-px h-8 bg-border" />
            <img src={logoMundial} alt="Vacílate El Mundial" className="h-10 w-auto" loading="lazy" />
            <div className="hidden md:block w-px h-8 bg-border" />
            <img src={logoFifa} alt="Mundial 2026" className="h-10 w-auto hidden md:block" loading="lazy" />
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-muted-foreground">Conectado como</p>
              <p className="text-sm font-medium">{displayName || user?.email}</p>
            </div>
            <Button onClick={handleSignOut} variant="ghost" size="sm">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-1">
            Producción 2026 • Acceso privado
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Plan de gira <span className="text-primary">Vacílate El Mundial</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Coordinación de viajes, hoteles, partidos y producción para la cobertura del Mundial 2026.
          </p>
        </div>
        {(() => {
          const flightsCost = activities.filter(a => a.activity_type === "flight").reduce((s, a) => s + (Number(a.cost_usd) || 0), 0);
          const hotelsCost = cities.reduce((s, c) => s + (Number(c.hotel_cost_usd) || 0), 0);
          const otherCost = activities.filter(a => a.activity_type !== "flight").reduce((s, a) => s + (Number(a.cost_usd) || 0), 0);
          const total = flightsCost + hotelsCost + otherCost;
          const fmt = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
          return (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Stat label="Ciudades" value={cities.length} />
              <Stat label="Días de gira" value={42} />
              <Stat label="Vuelos" valueText={fmt(flightsCost)} />
              <Stat label="Hospedaje" valueText={fmt(hotelsCost)} />
              <Stat label="Total estimado" valueText={fmt(total)} highlight />
            </div>
          );
        })()}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="bg-gradient-to-br from-card to-muted/30 border border-border rounded-2xl p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">Itinerario completo</h2>
            <span className="text-[11px] text-muted-foreground">Click en una ciudad para abrirla ↓</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {cities.map((c) => {
              const flag = countryFlag(c.country);
              const dateLabel = formatShortDate(c.start_date);
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    const el = document.getElementById(`city-${c.id}`);
                    window.dispatchEvent(new CustomEvent("gira:open-city", { detail: { cityId: c.id } }));
                    setTimeout(() => el?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
                  }}
                  className="group relative bg-card border border-border hover:border-primary hover:shadow-md hover:-translate-y-0.5 transition-all rounded-xl p-2.5 text-left"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="w-6 h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {c.position}
                    </span>
                    <span className="text-base leading-none">{flag}</span>
                  </div>
                  <p className="text-[12px] font-bold text-foreground leading-tight truncate" title={c.city}>
                    {c.city}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{dateLabel}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 pt-4">
        <Tabs defaultValue="ruta" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="ruta"><MapPin className="w-4 h-4 mr-1.5" /> Ruta completa</TabsTrigger>
            <TabsTrigger value="finanzas"><Wallet className="w-4 h-4 mr-1.5" /> Resumen financiero</TabsTrigger>
            <TabsTrigger value="calendario"><CalendarDays className="w-4 h-4 mr-1.5" /> Calendario</TabsTrigger>
          </TabsList>

          <TabsContent value="ruta">
            {loadingData ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {cities.map((city) => (
                  <CityCard
                    key={city.id}
                    city={city}
                    activities={activities.filter((a) => a.city_id === city.id)}
                    comments={comments}
                    currentUserId={user!.id}
                    currentUserName={displayName || user!.email!}
                    currentUserEmail={user!.email!}
                    onRefresh={loadData}
                  />
                ))}
                <AddCityForm
                  nextPosition={(cities[cities.length - 1]?.position ?? 0) + 1}
                  onCreated={loadData}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="finanzas">
            {loadingData ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : (
              <FinancialSummary cities={cities} activities={activities} />
            )}
          </TabsContent>

          <TabsContent value="calendario">
            {loadingData ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : (
              <TripCalendar cities={cities} activities={activities} />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const Stat = ({ label, value, valueText, highlight }: { label: string; value?: number; valueText?: string; highlight?: boolean }) => (
  <div className={`bg-card border rounded-xl p-4 shadow-[var(--shadow-soft)] ${highlight ? "border-primary/40 bg-primary/5" : "border-border"}`}>
    <p className={`text-2xl font-bold ${highlight ? "text-primary" : "text-foreground"}`}>{valueText ?? value}</p>
    <p className="text-xs text-muted-foreground mt-1">{label}</p>
  </div>
);

const FLAGS: Record<string, string> = {
  "México": "🇲🇽",
  "Mexico": "🇲🇽",
  "USA": "🇺🇸",
  "Estados Unidos": "🇺🇸",
  "Francia": "🇫🇷",
  "France": "🇫🇷",
  "Canadá": "🇨🇦",
  "Canada": "🇨🇦",
  "Venezuela": "🇻🇪",
};
const countryFlag = (country: string | null) => (country && FLAGS[country]) || "📍";
const formatShortDate = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  return `${d.getDate()} ${months[d.getMonth()]}`;
};

export default Gira;

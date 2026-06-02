import { useEffect, useState, useCallback, useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useGiraAuth } from "@/hooks/useGiraAuth";
import { Button } from "@/components/ui/button";
import { CityCard, type City, type Activity, type Comment } from "@/components/gira/CityCard";
import { FinancialSummary } from "@/components/gira/FinancialSummary";
import { AddCityForm } from "@/components/gira/AddCityForm";
import { TripCalendar } from "@/components/gira/TripCalendar";
import { CalendarSettings } from "@/components/gira/CalendarSettings";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogOut, Loader2, MapPin, Wallet, CalendarDays, Settings as SettingsIcon, ShieldCheck, Receipt, ListChecks } from "lucide-react";
import { toast } from "sonner";
import logoVacilate from "@/assets/logo-vacilate-esto.png";
import logoMundial from "@/assets/logo-vacilate-futbol.png";
import logoFifa from "@/assets/logo-mundial-2026.png";
import { ExpenseReporter } from "@/components/gira/ExpenseReporter";
import { ExpenseLog } from "@/components/gira/ExpenseLog";
import { StatusBoard } from "@/components/gira/StatusBoard";

const Gira = () => {
  const navigate = useNavigate();
  const { session, loading, isAllowed, displayName, user } = useGiraAuth();
  const [cities, setCities] = useState<City[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [expenseRefresh, setExpenseRefresh] = useState(0);
  const [scenario, setScenario] = useState<"alt_a" | "alt_b">("alt_a");

  const visibleCities = useMemo(() => {
    const shared = cities.filter((c) => c.position < 100);
    const altA = cities.filter((c) => c.position >= 100 && c.position < 200);
    const altB = cities.filter((c) => c.position >= 200 && c.position < 300);
    const byDate = (a: City, b: City) =>
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    const extras = scenario === "alt_a" ? altA : altB;
    return [...shared, ...extras].sort(byDate);
  }, [cities, scenario]);

  const visibleActivities = useMemo(() => {
    const ids = new Set(visibleCities.map((c) => c.id));
    return activities.filter((a) => ids.has(a.city_id));
  }, [activities, visibleCities]);

  const loadData = useCallback(async () => {
    const [citiesRes, activitiesRes, commentsRes] = await Promise.all([
      supabase.from("trip_cities").select("*").order("position"),
      supabase.from("trip_activities").select("*").order("position"),
      supabase.from("trip_comments").select("*").order("created_at", { ascending: false }),
    ]);
    if (citiesRes.data) setCities(citiesRes.data as City[]);
    if (activitiesRes.data) setActivities(activitiesRes.data as unknown as Activity[]);
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
        <title>Gira • Vacílate El Fútbol</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/85 border-b border-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img src={logoVacilate} alt="Vacílate Esto" className="h-9 w-auto hidden sm:block" loading="lazy" />
            <div className="hidden sm:block w-px h-8 bg-border" />
            <img src={logoMundial} alt="Vacílate El Fútbol" className="h-8 sm:h-10 w-auto" loading="lazy" />
            <div className="hidden md:block w-px h-8 bg-border" />
            <img src={logoFifa} alt="Mundial 2026" className="h-10 w-auto hidden md:block" loading="lazy" />
          </div>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-muted-foreground">Conectado como</p>
              <p className="text-sm font-medium">{displayName || user?.email}</p>
            </div>
            <span className="sm:hidden text-[11px] font-medium truncate max-w-[110px]">{displayName || user?.email}</span>
            <Button onClick={handleSignOut} variant="ghost" size="sm" className="shrink-0">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-3">
        <button
          onClick={() => navigate("/gira/politicas")}
          className="w-full sm:w-auto inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-xs sm:text-sm font-semibold transition-colors"
        >
          <ShieldCheck className="w-4 h-4" />
          Políticas de gastos y viajes — acuerdo Juan / Jhon / Finanzas
        </button>
      </div>

      <section className="max-w-7xl mx-auto px-3 sm:px-6 pt-5 sm:pt-8 pb-3 sm:pb-4">
        <div className="mb-4 sm:mb-6">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-1">
            Producción 2026 • Acceso privado
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
            Plan de gira <span className="text-primary">Vacílate El Fútbol</span>
          </h1>
          <p className="text-xs sm:text-base text-muted-foreground mt-2 max-w-2xl">
            Coordinación de viajes, hoteles, partidos y producción para la cobertura del Mundial 2026.
          </p>
        </div>
        {(() => {
          const flightsCost = visibleActivities.filter(a => a.activity_type === "flight").reduce((s, a) => s + (Number(a.cost_usd) || 0), 0);
          const hotelsCost = visibleCities.reduce((s, c) => s + (Number(c.hotel_cost_usd) || 0), 0);
          const otherActivitiesCost = visibleActivities
            .filter(a => a.activity_type !== "flight")
            .reduce((s, a) => s + (Number(a.cost_usd) || 0), 0);
          // Mismos supuestos que FinancialSummary para que los totales coincidan
          const perDiemFood = 6720;          // $80/día x 2 pax x 42 días
          const parseHours = (d: string | null | undefined) => {
            if (!d) return 0;
            const h = d.match(/(\d+)\s*h/i);
            const m = d.match(/(\d+)\s*m/i);
            return (h ? Number(h[1]) : 0) + (m ? Number(m[1]) / 60 : 0);
          };
          const inflightWifiCost = visibleActivities
            .filter(a => a.activity_type === "flight" && parseHours(a.duration) > 3)
            .reduce((sum, a) => sum + 40 * ((a.airline || "").toLowerCase().includes("conviasa") ? 1 : 2), 0);
          const eSimCost = 150;
          const insuranceCost = 400;
          const operationsCost = 650;
          const subtotal = flightsCost + hotelsCost + otherActivitiesCost + perDiemFood + inflightWifiCost + eSimCost + insuranceCost + operationsCost;
          const contingency = subtotal * 0.10;
          const total = subtotal + contingency;
          const matchesCount = visibleActivities.filter(a => a.activity_type === "match").length;
          const fmt = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
          return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
              <Stat label="Ciudades" value={visibleCities.length} />
              <Stat label="Días de gira" value={42} />
              <Stat label="Partidos" value={matchesCount} />
              <Stat label="Vuelos" valueText={fmt(flightsCost)} />
              <Stat label="Hospedaje" valueText={fmt(hotelsCost)} />
              <Stat label="Total estimado" valueText={`${fmt(total)} USD`} highlight />
            </div>
          );
        })()}
      </section>

      <section className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
        <div className="bg-gradient-to-br from-card to-muted/30 border border-border rounded-2xl p-3 sm:p-5 shadow-[var(--shadow-soft)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2 sm:gap-3">
            <h2 className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold shrink-0">Itinerario completo</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={scenario} onValueChange={(v) => setScenario(v as typeof scenario)}>
                <SelectTrigger className="h-8 w-full sm:w-[320px] bg-background border-primary/30 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alt_a">Alternativa A — Portugal 1° (KC → Vancouver → KC → Atlanta)</SelectItem>
                  <SelectItem value="alt_b">Alternativa B — Portugal 2° (NY → Atlanta → Boston → Dallas)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5 sm:gap-2">
            {visibleCities.map((c, idx) => {
              const flag = countryFlag(c.country);
              const dateLabel = formatShortDate(c.start_date);
              const isAlt = c.position >= 100;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    const el = document.getElementById(`city-${c.id}`);
                    window.dispatchEvent(new CustomEvent("gira:open-city", { detail: { cityId: c.id } }));
                    setTimeout(() => el?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
                  }}
                  className={`group relative bg-card border hover:shadow-md hover:-translate-y-0.5 transition-all rounded-xl p-2 sm:p-2.5 text-left active:scale-95 ${isAlt ? "border-primary/60 ring-1 ring-primary/30" : "border-border hover:border-primary"}`}
                >
                  <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {idx + 1}
                    </span>
                    <span className="text-sm sm:text-base leading-none">{flag}</span>
                  </div>
                  <p className="text-[11px] sm:text-[12px] font-bold text-foreground leading-tight truncate" title={c.city}>
                    {c.city}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5">{dateLabel}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 pb-20 pt-3 sm:pt-4">
        <Tabs defaultValue="ruta" className="w-full">
          <TabsList className="mb-4 grid grid-cols-3 sm:grid-cols-6 w-full sm:flex sm:w-auto h-auto">
            <TabsTrigger value="ruta" className="text-xs sm:text-sm py-2"><MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" /> <span className="hidden sm:inline">Ruta completa</span><span className="sm:hidden">Ruta</span></TabsTrigger>
            <TabsTrigger value="estado" className="text-xs sm:text-sm py-2"><ListChecks className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" /> Estado</TabsTrigger>
            <TabsTrigger value="finanzas" className="text-xs sm:text-sm py-2"><Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" /> <span className="hidden sm:inline">Resumen financiero</span><span className="sm:hidden">Finanzas</span></TabsTrigger>
            <TabsTrigger value="gastos" className="text-xs sm:text-sm py-2"><Receipt className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" /> Gastos</TabsTrigger>
            <TabsTrigger value="calendario" className="text-xs sm:text-sm py-2"><CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" /> Calendario</TabsTrigger>
            <TabsTrigger value="ajustes" className="text-xs sm:text-sm py-2"><SettingsIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" /> <span className="hidden sm:inline">Feed</span><span className="sm:hidden">Feed</span></TabsTrigger>
          </TabsList>

          <TabsContent value="ruta">
            {loadingData ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {visibleCities.map((city, idx) => (
                  <CityCard
                    key={city.id}
                    city={city}
                    displayIndex={idx + 1}
                    activities={visibleActivities.filter((a) => a.city_id === city.id)}
                    comments={comments}
                    currentUserId={user!.id}
                    currentUserName={displayName || user!.email!}
                    currentUserEmail={user!.email!}
                    onRefresh={loadData}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="finanzas">
            {loadingData ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : (
              <FinancialSummary cities={visibleCities} activities={visibleActivities} scenario={scenario} />
            )}
          </TabsContent>

          <TabsContent value="estado">
            {loadingData ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : (
              <StatusBoard cities={visibleCities} activities={visibleActivities} />
            )}
          </TabsContent>

          <TabsContent value="gastos">
            <ExpenseLog currentUserId={user!.id} refreshKey={expenseRefresh} />
          </TabsContent>

          <TabsContent value="calendario">
            {loadingData ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : (
              <TripCalendar cities={visibleCities} activities={visibleActivities} />
            )}
          </TabsContent>

          <TabsContent value="ajustes">
            <CalendarSettings />
          </TabsContent>
        </Tabs>
      </main>

      <ExpenseReporter
        userId={user!.id}
        userEmail={user!.email!}
        userName={displayName || user!.email!}
        onCreated={() => setExpenseRefresh((n) => n + 1)}
      />
    </div>
  );
};

const Stat = ({ label, value, valueText, highlight }: { label: string; value?: number; valueText?: string; highlight?: boolean }) => (
  <div className={`bg-card border rounded-xl p-3 sm:p-4 shadow-[var(--shadow-soft)] ${highlight ? "border-primary/40 bg-primary/5" : "border-border"}`}>
    <p className={`text-lg sm:text-2xl font-bold leading-tight ${highlight ? "text-primary" : "text-foreground"}`}>{valueText ?? value}</p>
    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">{label}</p>
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

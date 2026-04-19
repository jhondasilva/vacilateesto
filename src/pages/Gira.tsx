import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useGiraAuth } from "@/hooks/useGiraAuth";
import { Button } from "@/components/ui/button";
import { CityCard, type City, type Activity, type Comment } from "@/components/gira/CityCard";
import { LogOut, Plane, Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";

const Gira = () => {
  const navigate = useNavigate();
  const { session, loading, isAllowed, displayName, user } = useGiraAuth();
  const [cities, setCities] = useState<City[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!session || isAllowed === false) {
      navigate("/gira/login", { replace: true });
    }
  }, [session, isAllowed, loading, navigate]);

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
    if (session && isAllowed) loadData();
  }, [session, isAllowed, loadData]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
    navigate("/gira/login", { replace: true });
  };

  if (loading || !session || !isAllowed) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Helmet>
        <title>Gira • Vacílate El Mundial</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[#7DE8E8] flex items-center justify-center">
              <Plane className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Vacílate El Mundial</h1>
              <p className="text-white/40 text-xs">Plan de gira • Producción 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-white/40">Conectado como</p>
              <p className="text-sm font-medium">{displayName || user?.email}</p>
            </div>
            <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Ciudades" value={cities.length} />
          <Stat label="Días de gira" value={42} />
          <Stat label="Actividades" value={activities.length} />
          <Stat label="Comentarios" value={comments.length} />
        </div>
      </section>

      {/* Timeline preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {cities.map((c, idx) => (
              <div key={c.id} className="flex items-center gap-2">
                <div className="flex flex-col items-center text-center min-w-[80px]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-[#7DE8E8]/30 border border-primary/40 flex items-center justify-center text-xs font-bold">
                    {c.position}
                  </div>
                  <span className="text-[10px] text-white/60 mt-1 font-medium truncate max-w-[80px]">{c.city}</span>
                </div>
                {idx < cities.length - 1 && <div className="w-6 h-px bg-white/20" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 pt-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold">Ruta completa</h2>
        </div>

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
          </div>
        )}
      </main>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-xs text-white/50 mt-1">{label}</p>
  </div>
);

export default Gira;

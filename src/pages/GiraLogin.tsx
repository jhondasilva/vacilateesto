import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { lovable } from "@/integrations/lovable";
import { useGiraAuth } from "@/hooks/useGiraAuth";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import logoVacilate from "@/assets/logo-vacilate-esto.png";
import logoMundial from "@/assets/logo-vacilate-mundial.svg";
import logoFifa from "@/assets/logo-mundial-2026.png";

const GiraLogin = () => {
  const { session, isAllowed, loading } = useGiraAuth();

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/gira/login",
    });
    if (result.error) toast.error("No se pudo iniciar sesión");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
  };

  if (!loading && session && isAllowed) return <Navigate to="/gira" replace />;

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-6">
          <img src={logoVacilate} alt="Vacílate Esto" className="h-10 w-auto" loading="lazy" />
          <span className="text-muted-foreground/40 text-2xl">×</span>
          <img src={logoFifa} alt="Mundial 2026" className="h-12 w-auto" loading="lazy" />
        </div>

        <div className="text-center mb-8">
          <img src={logoMundial} alt="Vacílate El Mundial" className="h-20 w-auto mx-auto mb-4" loading="lazy" />
          <p className="text-muted-foreground text-sm">Plan de gira • Acceso privado</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-[var(--shadow-card)]">
          {loading ? (
            <div className="space-y-4 text-center">
              <Loader2 className="w-10 h-10 mx-auto text-primary animate-spin" />
              <p className="text-muted-foreground text-sm">Verificando acceso…</p>
            </div>
          ) : session && isAllowed === false ? (
            <div className="space-y-4 text-center">
              <Lock className="w-10 h-10 mx-auto text-primary" />
              <h2 className="text-xl font-bold">Acceso restringido</h2>
              <p className="text-muted-foreground text-sm">
                La cuenta <span className="text-foreground font-medium">{session.user.email}</span> no
                está autorizada para ver este plan de viaje.
              </p>
              <Button onClick={handleSignOut} variant="outline" className="w-full">
                Cerrar sesión
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-center">Inicia sesión</h2>
              <p className="text-muted-foreground text-sm text-center">
                Solo Juan y Jhon tienen acceso a este espacio.
              </p>
              <Button onClick={handleGoogle} variant="outline" className="w-full" size="lg">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar con Google
              </Button>
            </div>
          )}
        </div>

        <p className="text-center text-muted-foreground/60 text-xs mt-6">
          Vacílate Esto • Producción 2026
        </p>
      </div>
    </div>
  );
};

export default GiraLogin;

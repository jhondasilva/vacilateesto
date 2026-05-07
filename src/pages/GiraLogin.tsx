import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGiraAuth } from "@/hooks/useGiraAuth";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import logoVacilate from "@/assets/logo-vacilate-esto.png";
import logoMundial from "@/assets/logo-vacilate-futbol.png";
import logoFifa from "@/assets/logo-mundial-2026.png";

const GiraLogin = () => {
  const { session, isAllowed, loading } = useGiraAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [needsSetup, setNeedsSetup] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const trySignIn = async (mail: string, pass: string) => {
    return supabase.auth.signInWithPassword({ email: mail, password: pass });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Ingresa email y contraseña");
      return;
    }
    setSubmitting(true);
    try {
      if (needsSetup) {
        // Setear contraseña vía edge function admin (valida allowed_users server-side)
        const { data, error } = await supabase.functions.invoke("admin-set-password", {
          body: { email, password },
        });
        if (error || (data as { error?: string })?.error) {
          toast.error((data as { error?: string })?.error ?? error?.message ?? "No se pudo crear");
          return;
        }
        const { error: signInErr } = await trySignIn(email, password);
        if (signInErr) {
          toast.error(signInErr.message);
          return;
        }
        toast.success("Contraseña creada");
      } else {
        const { error } = await trySignIn(email, password);
        if (error) {
          // Credenciales inválidas → puede ser primera vez, pasar a modo "crear contraseña"
          setNeedsSetup(true);
          toast.info("Primera vez — define tu contraseña y vuelve a enviar");
          return;
        }
      }
    } finally {
      setSubmitting(false);
    }
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
          <img src={logoMundial} alt="Vacílate El Fútbol" className="h-20 w-auto mx-auto mb-4" loading="lazy" />
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-bold text-center">
                {needsSetup ? "Crear contraseña" : "Inicia sesión"}
              </h2>
              <p className="text-muted-foreground text-sm text-center">
                {needsSetup
                  ? "Define una contraseña para tu cuenta autorizada."
                  : "Solo Juan y Jhon tienen acceso a este espacio."}
              </p>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={needsSetup ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {needsSetup ? "Crear contraseña y entrar" : "Entrar"}
              </Button>

              {needsSetup && (
                <button
                  type="button"
                  onClick={() => setNeedsSetup(false)}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Ya tengo contraseña — volver a iniciar sesión
                </button>
              )}
            </form>
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

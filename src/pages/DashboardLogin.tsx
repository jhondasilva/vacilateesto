import { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useBrandAuth } from "@/hooks/useBrandAuth";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import logoVacilate from "@/assets/logo-vacilate-esto.png";
import RequestAccessForm from "@/components/dashboard/RequestAccessForm";

const DashboardLogin = () => {
  const { session, loading, brands, isAdmin } = useBrandAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Ingresa tu email y contraseña");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      toast.error("Credenciales inválidas");
      return;
    }
    toast.success("Bienvenido");
  };

  if (!loading && session && (brands.length > 0 || isAdmin)) {
    if (brands.length === 1) return <Navigate to={`/dashboard/${brands[0].brand.slug}`} replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src={logoVacilate}
            alt="Vacílate Esto"
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-black tracking-tight">Dashboard de clientes</h1>
          <p className="text-muted-foreground text-sm mt-2">
            Accede a los resultados de tus campañas con Vacílate Esto.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-[var(--shadow-card)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@empresa.com"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <button
                  type="button"
                  onClick={() => navigate("/reset-password", { state: { email } })}
                  className="text-xs text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Entrar al dashboard
            </Button>
          </form>
        </div>

        <p className="text-center text-muted-foreground/60 text-xs mt-6">
          ¿Sin acceso? Escríbenos a{" "}
          <a href="mailto:jhon@hacemosloquenosgusta.com" className="text-primary underline">
            jhon@hacemosloquenosgusta.com
          </a>
          {" · "}
          <Link to="/" className="hover:text-foreground">Volver al sitio</Link>
        </p>
      </div>
    </div>
  );
};

export default DashboardLogin;
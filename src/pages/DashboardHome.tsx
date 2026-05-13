import { useState } from "react";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBrandAuth } from "@/hooks/useBrandAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LogOut, ArrowRight, Settings, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const RequestAccessForm = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    if (!cleanEmail || !cleanName) {
      toast.error("Completa nombre y email");
      return;
    }
    if (cleanName.length > 200 || cleanEmail.length > 255) {
      toast.error("Datos demasiado largos");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase
      .from("access_requests")
      .insert({ email: cleanEmail, full_name: cleanName, status: "pending" });
    setSubmitting(false);
    if (error) {
      toast.error("No se pudo enviar la solicitud");
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-3">
        <CheckCircle2 className="w-10 h-10 text-primary mx-auto" />
        <h2 className="text-xl font-bold">Solicitud enviada</h2>
        <p className="text-muted-foreground text-sm">
          Te avisaremos al email registrado cuando tu acceso sea aprobado.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-card border border-border rounded-2xl p-8 space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-1">Solicita acceso</h2>
        <p className="text-sm text-muted-foreground">
          ¿No tienes cuenta? Envíanos tus datos y un administrador revisará tu solicitud.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="rname">Nombre completo</Label>
        <Input id="rname" value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={200} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="remail">Email</Label>
        <Input id="remail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} required />
      </div>
      <Button type="submit" className="w-full" size="lg" disabled={submitting}>
        {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
        Enviar solicitud
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        ¿Ya tienes cuenta?{" "}
        <Link to="/dashboard/login" className="text-primary underline">Inicia sesión</Link>
      </p>
    </form>
  );
};

const DashboardHome = () => {
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

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-black mb-2">Tus dashboards</h1>
        <p className="text-muted-foreground mb-8">Selecciona la marca para ver sus resultados.</p>

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
          <div className="grid sm:grid-cols-2 gap-4">
            {brands.map((b) => (
              <Link
                key={b.brand.id}
                to={`/dashboard/${b.brand.slug}`}
                className="group bg-card border border-border rounded-2xl p-6 hover:border-primary transition-colors flex items-center justify-between"
                style={{ borderLeftColor: b.brand.brand_color ?? undefined, borderLeftWidth: 4 }}
              >
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Marca</p>
                  <p className="text-xl font-bold">{b.brand.name}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardHome;
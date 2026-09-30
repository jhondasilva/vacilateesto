import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import logoVacilate from "@/assets/logo-vacilate-esto.png";

/**
 * Dos modos:
 * - Sin sesión: pide el email y envía un enlace por correo.
 * - Con sesión (llegó desde el enlace de invitación o recuperación): crea la contraseña.
 */
const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = (location.state as { email?: string } | null)?.email ?? "";
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setHasSession(!!s));
    supabase.auth.getSession().then(({ data }) => setHasSession(!!data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  const sendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Ingresa tu email");
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);
    if (error) return toast.error("No se pudo enviar el correo");
    setSent(true);
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast.error("La contraseña debe tener al menos 8 caracteres");
    if (password !== confirm) return toast.error("Las contraseñas no coinciden");
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) return toast.error("No se pudo guardar la contraseña");
    toast.success("Contraseña guardada");
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logoVacilate} alt="Vacílate Esto" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-3xl font-black tracking-tight">
            {hasSession ? "Crea tu contraseña" : "Recuperar contraseña"}
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            {hasSession
              ? "Ingresa la contraseña que usarás para acceder a tu dashboard."
              : "Te enviaremos un enlace a tu correo para crear una nueva contraseña."}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-[var(--shadow-card)]">
          {hasSession ? (
            <form onSubmit={savePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nueva contraseña</Label>
                <Input id="password" type="password" autoComplete="new-password" value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Repetir contraseña</Label>
                <Input id="confirm" type="password" autoComplete="new-password" value={confirm}
                  onChange={(e) => setConfirm(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Guardar contraseña
              </Button>
            </form>
          ) : sent ? (
            <p className="text-center text-sm text-muted-foreground">
              Si el correo tiene acceso, recibirás un enlace en unos minutos. Revisa también spam.
            </p>
          ) : (
            <form onSubmit={sendLink} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" value={email}
                  onChange={(e) => setEmail(e.target.value)} placeholder="tu@empresa.com" required />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Enviar enlace
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-muted-foreground/60 text-xs mt-6">
          <Link to="/dashboard/login" className="hover:text-foreground">Volver al inicio de sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;

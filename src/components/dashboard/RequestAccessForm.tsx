import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface RequestAccessFormProps {
  hideLoginLink?: boolean;
}

const RequestAccessForm = ({ hideLoginLink = false }: RequestAccessFormProps) => {
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
      {!hideLoginLink && (
        <p className="text-xs text-muted-foreground text-center">
          ¿Ya tienes cuenta?{" "}
          <Link to="/dashboard/login" className="text-primary underline">Inicia sesión</Link>
        </p>
      )}
    </form>
  );
};

export default RequestAccessForm;

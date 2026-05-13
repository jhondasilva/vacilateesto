import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBrandAuth } from "@/hooks/useBrandAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2, UserPlus, Inbox, Check, X, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Brand = { id: string; name: string; slug: string };
type AccessRequest = {
  id: string;
  email: string;
  full_name: string;
  status: string;
  created_at: string;
  notes: string | null;
};

const DashboardAdmin = () => {
  const { session, loading, isAdmin } = useBrandAuth();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandId, setBrandId] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loadingReqs, setLoadingReqs] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const loadRequests = async () => {
    setLoadingReqs(true);
    const { data } = await supabase
      .from("access_requests")
      .select("id, email, full_name, status, created_at, notes")
      .order("created_at", { ascending: false });
    setRequests((data ?? []) as AccessRequest[]);
    setLoadingReqs(false);
  };

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const { data } = await supabase.from("brands").select("id, name, slug").order("name");
      setBrands((data ?? []) as Brand[]);
    })();
    loadRequests();
  }, [isAdmin]);

  if (!loading && !session) return <Navigate to="/dashboard/login" replace />;
  if (!loading && !isAdmin) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandId || !email || !password) {
      toast.error("Completa marca, email y contraseña");
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke("brand-user-create", {
      body: { brand_id: brandId, email, display_name: displayName, password },
    });
    setSubmitting(false);
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error ?? error?.message ?? "Error al crear cliente");
      return;
    }
    toast.success("Cliente creado y vinculado");
    setEmail("");
    setDisplayName("");
    setPassword("");
    loadRequests();
  };

  const fillFromRequest = (r: AccessRequest) => {
    setEmail(r.email);
    setDisplayName(r.full_name);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    toast.info("Datos cargados. Selecciona marca y contraseña.");
  };

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    setActioningId(id);
    const { error } = await supabase
      .from("access_requests")
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq("id", id);
    setActioningId(null);
    if (error) {
      toast.error("No se pudo actualizar");
      return;
    }
    toast.success(status === "approved" ? "Solicitud aprobada" : "Solicitud rechazada");
    loadRequests();
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("¿Eliminar solicitud?")) return;
    setActioningId(id);
    const { error } = await supabase.from("access_requests").delete().eq("id", id);
    setActioningId(null);
    if (error) {
      toast.error("No se pudo eliminar");
      return;
    }
    loadRequests();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard"><ArrowLeft className="w-4 h-4" /></Link>
            </Button>
            <h1 className="font-black text-lg">Admin · Permisos</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-2xl space-y-8">
        <section className="bg-card border border-border rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Inbox className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Solicitudes de acceso</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={loadRequests} disabled={loadingReqs}>
              {loadingReqs && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Recargar
            </Button>
          </div>
          {loadingReqs ? (
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          ) : requests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay solicitudes.</p>
          ) : (
            <ul className="space-y-3">
              {requests.map((r) => (
                <li key={r.id} className="border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{r.full_name}</p>
                    <p className="text-sm text-muted-foreground truncate">{r.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(r.created_at).toLocaleString()} ·{" "}
                      <span
                        className={
                          r.status === "approved"
                            ? "text-emerald-500"
                            : r.status === "rejected"
                            ? "text-destructive"
                            : "text-amber-500"
                        }
                      >
                        {r.status}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {r.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => {
                            fillFromRequest(r);
                            updateStatus(r.id, "approved");
                          }}
                          disabled={actioningId === r.id}
                        >
                          <Check className="w-4 h-4 mr-1" /> Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(r.id, "rejected")}
                          disabled={actioningId === r.id}
                        >
                          <X className="w-4 h-4 mr-1" /> Rechazar
                        </Button>
                      </>
                    )}
                    {r.status !== "pending" && (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => fillFromRequest(r)}>
                          Vincular
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteRequest(r.id)}
                          disabled={actioningId === r.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-muted-foreground mt-4">
            Al aprobar, los datos se cargan abajo. Selecciona la marca y una contraseña inicial para crear el acceso.
          </p>
        </section>

        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <UserPlus className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Crear / vincular cliente</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Marca</Label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                required
              >
                <option value="">Selecciona…</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email del cliente</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nombre (opcional)</Label>
              <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pass">Contraseña inicial</Label>
              <Input
                id="pass"
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
              />
              <p className="text-xs text-muted-foreground">
                Compártela con el cliente por un canal seguro. Puede cambiarla después.
              </p>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Crear cliente
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default DashboardAdmin;
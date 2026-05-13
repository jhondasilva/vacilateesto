import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBrandAuth } from "@/hooks/useBrandAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2, UserPlus, Inbox, Check, X, Trash2, Users, Shield, Plus } from "lucide-react";
import { toast } from "sonner";

type Brand = { id: string; name: string; slug: string };
type BrandAccess = {
  id: string;
  brand_id: string;
  email: string;
  display_name: string | null;
  user_id: string | null;
  created_at: string;
  brand: { name: string; slug: string } | null;
};
type AllowedUser = { id: string; email: string; display_name: string | null; created_at: string };
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
  const [accesses, setAccesses] = useState<BrandAccess[]>([]);
  const [loadingAcc, setLoadingAcc] = useState(false);
  const [admins, setAdmins] = useState<AllowedUser[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [linkingEmail, setLinkingEmail] = useState<string | null>(null);
  const [linkBrandId, setLinkBrandId] = useState("");
  const [linkSubmitting, setLinkSubmitting] = useState(false);

  const loadRequests = async () => {
    setLoadingReqs(true);
    const { data } = await supabase
      .from("access_requests")
      .select("id, email, full_name, status, created_at, notes")
      .order("created_at", { ascending: false });
    setRequests((data ?? []) as AccessRequest[]);
    setLoadingReqs(false);
  };

  const loadAccesses = async () => {
    setLoadingAcc(true);
    const { data } = await supabase
      .from("brand_users")
      .select("id, brand_id, email, display_name, user_id, created_at, brand:brands(name, slug)")
      .order("created_at", { ascending: false });
    setAccesses((data ?? []) as any);
    setLoadingAcc(false);
  };

  const loadAdmins = async () => {
    setLoadingAdmins(true);
    const { data } = await supabase
      .from("allowed_users")
      .select("id, email, display_name, created_at")
      .order("created_at", { ascending: true });
    setAdmins((data ?? []) as AllowedUser[]);
    setLoadingAdmins(false);
  };

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const { data } = await supabase.from("brands").select("id, name, slug").order("name");
      setBrands((data ?? []) as Brand[]);
    })();
    loadRequests();
    loadAccesses();
    loadAdmins();
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
    loadAccesses();
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

  const revokeAccess = async (a: BrandAccess) => {
    if (!confirm(`¿Revocar acceso de ${a.email} a ${a.brand?.name ?? "esta marca"}?`)) return;
    const { error } = await supabase.from("brand_users").delete().eq("id", a.id);
    if (error) return toast.error("No se pudo revocar");
    toast.success("Acceso revocado");
    loadAccesses();
  };

  const linkExistingToBrand = async (targetEmail: string, displayNameValue: string | null, userIdValue: string | null) => {
    if (!linkBrandId) return toast.error("Selecciona una marca");
    setLinkSubmitting(true);
    const { error } = await supabase.from("brand_users").insert({
      brand_id: linkBrandId,
      email: targetEmail,
      display_name: displayNameValue,
      user_id: userIdValue,
    });
    setLinkSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Marca vinculada");
    setLinkingEmail(null);
    setLinkBrandId("");
    loadAccesses();
  };

  const addAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newAdminEmail.trim().toLowerCase();
    if (!cleanEmail) return toast.error("Email requerido");
    setAddingAdmin(true);
    const { error } = await supabase
      .from("allowed_users")
      .insert({ email: cleanEmail, display_name: newAdminName.trim() || null });
    setAddingAdmin(false);
    if (error) return toast.error(error.message);
    toast.success("Admin agregado");
    setNewAdminEmail("");
    setNewAdminName("");
    loadAdmins();
  };

  const removeAdmin = async (a: AllowedUser) => {
    if (!confirm(`¿Quitar permisos de admin a ${a.email}?`)) return;
    const { error } = await supabase.from("allowed_users").delete().eq("id", a.id);
    if (error) return toast.error("No se pudo eliminar");
    toast.success("Admin eliminado");
    loadAdmins();
  };

  // Agrupar accesos por email para vista "quién tiene qué"
  const accessesByUser = accesses.reduce<Record<string, BrandAccess[]>>((acc, a) => {
    const k = a.email.toLowerCase();
    (acc[k] ||= []).push(a);
    return acc;
  }, {});

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

      <main className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
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

        <section className="bg-card border border-border rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Accesos a dashboards de marca</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={loadAccesses} disabled={loadingAcc}>
              {loadingAcc && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Recargar
            </Button>
          </div>
          {loadingAcc ? (
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          ) : Object.keys(accessesByUser).length === 0 ? (
            <p className="text-sm text-muted-foreground">Aún no hay clientes vinculados.</p>
          ) : (
            <ul className="space-y-3">
              {Object.entries(accessesByUser).map(([email, list]) => (
                <li key={email} className="border border-border rounded-xl p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{list[0].display_name || email}</p>
                      <p className="text-sm text-muted-foreground truncate">{email}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {list.length} marca{list.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {list.map((a) => (
                      <span
                        key={a.id}
                        className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground rounded-full pl-3 pr-1 py-1 text-xs"
                      >
                        {a.brand?.name ?? a.brand_id}
                        <button
                          onClick={() => revokeAccess(a)}
                          className="rounded-full bg-background/40 hover:bg-destructive hover:text-destructive-foreground p-1 transition"
                          title="Revocar acceso"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {linkingEmail === email ? (
                      <div className="flex items-center gap-1 w-full mt-2">
                        <select
                          value={linkBrandId}
                          onChange={(e) => setLinkBrandId(e.target.value)}
                          className="h-8 rounded-md border border-input bg-background px-2 text-xs flex-1"
                        >
                          <option value="">Selecciona marca…</option>
                          {brands
                            .filter((b) => !list.some((a) => a.brand_id === b.id))
                            .map((b) => (
                              <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                        <Button
                          size="sm"
                          className="h-8 text-xs"
                          disabled={linkSubmitting || !linkBrandId}
                          onClick={() => linkExistingToBrand(email, list[0].display_name, list[0].user_id)}
                        >
                          {linkSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : "Vincular"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-xs"
                          onClick={() => { setLinkingEmail(null); setLinkBrandId(""); }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 rounded-full text-xs"
                        onClick={() => { setLinkingEmail(email); setLinkBrandId(""); }}
                      >
                        <Plus className="w-3 h-3 mr-1" /> Marca
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-card border border-border rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Administradores · Gira</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={loadAdmins} disabled={loadingAdmins}>
              {loadingAdmins && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Recargar
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Acceso total: dashboard de Gira, panel admin, todas las marcas y solicitudes.
          </p>
          {loadingAdmins ? (
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          ) : (
            <ul className="space-y-2 mb-4">
              {admins.map((a) => (
                <li
                  key={a.id}
                  className="border border-border rounded-xl p-3 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{a.display_name || a.email}</p>
                    {a.display_name && (
                      <p className="text-xs text-muted-foreground truncate">{a.email}</p>
                    )}
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => removeAdmin(a)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={addAdmin} className="grid sm:grid-cols-[1fr_1fr_auto] gap-2">
            <Input
              type="email"
              placeholder="email@dominio.com"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              required
            />
            <Input
              placeholder="Nombre (opcional)"
              value={newAdminName}
              onChange={(e) => setNewAdminName(e.target.value)}
            />
            <Button type="submit" disabled={addingAdmin}>
              {addingAdmin ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
              Agregar
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-3">
            Recuerda crear/establecer su contraseña con el formulario inferior si aún no tiene cuenta.
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
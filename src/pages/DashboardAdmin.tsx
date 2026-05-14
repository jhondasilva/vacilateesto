import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBrandAuth } from "@/hooks/useBrandAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft, Loader2, UserPlus, Inbox, Check, X, Trash2, Users,
  Shield, Plus, Clock, CheckCircle2, XCircle, Mail, ChevronDown, ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

type StatusFilter = "pending" | "processed" | "all";

const DashboardAdmin = () => {
  const { session, loading, isAdmin } = useBrandAuth();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [accesses, setAccesses] = useState<BrandAccess[]>([]);
  const [admins, setAdmins] = useState<AllowedUser[]>([]);
  const [loadingReqs, setLoadingReqs] = useState(false);
  const [loadingAcc, setLoadingAcc] = useState(false);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("pending");

  // Per-request approval state
  const [openReqId, setOpenReqId] = useState<string | null>(null);
  const [approveBrandId, setApproveBrandId] = useState("");
  const [approvePassword, setApprovePassword] = useState("");
  const [approveSubmitting, setApproveSubmitting] = useState(false);

  // Link existing user to a brand
  const [linkingEmail, setLinkingEmail] = useState<string | null>(null);
  const [linkBrandId, setLinkBrandId] = useState("");
  const [linkSubmitting, setLinkSubmitting] = useState(false);

  // Manual creation (collapsible)
  const [manualOpen, setManualOpen] = useState(false);
  const [manualBrandId, setManualBrandId] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualPassword, setManualPassword] = useState("");
  const [manualSubmitting, setManualSubmitting] = useState(false);

  // Add admin
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);

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

  const counts = useMemo(() => {
    const c = { pending: 0, approved: 0, rejected: 0 };
    for (const r of requests) {
      if (r.status === "pending") c.pending++;
      else if (r.status === "approved") c.approved++;
      else if (r.status === "rejected") c.rejected++;
    }
    return c;
  }, [requests]);

  const filteredRequests = useMemo(() => {
    if (filter === "pending") return requests.filter((r) => r.status === "pending");
    if (filter === "processed") return requests.filter((r) => r.status !== "pending");
    return requests;
  }, [requests, filter]);

  const openApprove = (r: AccessRequest) => {
    setOpenReqId(r.id);
    setApproveBrandId("");
    setApprovePassword("");
  };

  const closeApprove = () => {
    setOpenReqId(null);
    setApproveBrandId("");
    setApprovePassword("");
  };

  // Aprobar = crear cliente (edge function) + marcar approved en una sola acción
  const approveAndCreate = async (r: AccessRequest) => {
    if (!approveBrandId) return toast.error("Selecciona una marca");
    if (!approvePassword || approvePassword.length < 6)
      return toast.error("Contraseña mínimo 6 caracteres");
    setApproveSubmitting(true);
    const { data, error } = await supabase.functions.invoke("brand-user-create", {
      body: {
        brand_id: approveBrandId,
        email: r.email,
        display_name: r.full_name,
        password: approvePassword,
      },
    });
    if (error || (data as any)?.error) {
      setApproveSubmitting(false);
      return toast.error((data as any)?.error ?? error?.message ?? "Error al crear cliente");
    }
    await supabase
      .from("access_requests")
      .update({ status: "approved", reviewed_at: new Date().toISOString() })
      .eq("id", r.id);
    setApproveSubmitting(false);
    toast.success(`Acceso creado para ${r.email}`);
    closeApprove();
    loadRequests();
    loadAccesses();
  };

  const reject = async (id: string) => {
    setActioningId(id);
    const { error } = await supabase
      .from("access_requests")
      .update({ status: "rejected", reviewed_at: new Date().toISOString() })
      .eq("id", id);
    setActioningId(null);
    if (error) return toast.error("No se pudo actualizar");
    toast.success("Solicitud rechazada");
    loadRequests();
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("¿Eliminar solicitud?")) return;
    setActioningId(id);
    const { error } = await supabase.from("access_requests").delete().eq("id", id);
    setActioningId(null);
    if (error) return toast.error("No se pudo eliminar");
    loadRequests();
  };

  const revokeAccess = async (a: BrandAccess) => {
    if (!confirm(`¿Revocar acceso de ${a.email} a ${a.brand?.name ?? "esta marca"}?`)) return;
    const { error } = await supabase.from("brand_users").delete().eq("id", a.id);
    if (error) return toast.error("No se pudo revocar");
    toast.success("Acceso revocado");
    loadAccesses();
  };

  const linkExistingToBrand = async (
    targetEmail: string,
    displayNameValue: string | null,
    userIdValue: string | null,
  ) => {
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

  const submitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualBrandId || !manualEmail || !manualPassword)
      return toast.error("Completa marca, email y contraseña");
    setManualSubmitting(true);
    const { data, error } = await supabase.functions.invoke("brand-user-create", {
      body: {
        brand_id: manualBrandId,
        email: manualEmail,
        display_name: manualName,
        password: manualPassword,
      },
    });
    setManualSubmitting(false);
    if (error || (data as any)?.error)
      return toast.error((data as any)?.error ?? error?.message ?? "Error");
    toast.success("Cliente creado");
    setManualEmail("");
    setManualName("");
    setManualPassword("");
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

  const accessesByUser = accesses.reduce<Record<string, BrandAccess[]>>((acc, a) => {
    const k = a.email.toLowerCase();
    (acc[k] ||= []).push(a);
    return acc;
  }, {});

  const StatusBadge = ({ status }: { status: string }) => {
    const map = {
      pending: { label: "Pendiente", icon: Clock, cls: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
      approved: { label: "Aprobada", icon: CheckCircle2, cls: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
      rejected: { label: "Rechazada", icon: XCircle, cls: "bg-destructive/15 text-destructive border-destructive/30" },
    } as const;
    const m = (map as any)[status] ?? map.pending;
    const Icon = m.icon;
    return (
      <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border", m.cls)}>
        <Icon className="w-3 h-3" /> {m.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard"><ArrowLeft className="w-4 h-4" /></Link>
            </Button>
            <div>
              <h1 className="font-black text-lg leading-tight">Admin · Permisos</h1>
              <p className="text-[11px] text-muted-foreground">Gestión de accesos a dashboards</p>
            </div>
          </div>
          {counts.pending > 0 && (
            <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-600 border border-amber-500/30 rounded-full px-3 py-1 text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              {counts.pending} pendiente{counts.pending !== 1 && "s"}
            </span>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        {/* Solicitudes */}
        <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Inbox className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Solicitudes de acceso</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={loadRequests} disabled={loadingReqs}>
              {loadingReqs && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Recargar
            </Button>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2 mb-5 border-b border-border pb-4">
            {([
              ["pending", "Pendientes", counts.pending],
              ["processed", "Procesadas", counts.approved + counts.rejected],
              ["all", "Todas", requests.length],
            ] as const).map(([key, label, n]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors flex items-center gap-1.5",
                  filter === key
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent border-border hover:border-foreground/40",
                )}
              >
                {label}
                <span className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  filter === key ? "bg-background/20" : "bg-muted",
                )}>{n}</span>
              </button>
            ))}
          </div>

          {loadingReqs ? (
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <Inbox className="w-10 h-10 mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">
                {filter === "pending" ? "No hay solicitudes pendientes." : "Sin resultados."}
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {filteredRequests.map((r) => {
                const isOpen = openReqId === r.id;
                return (
                  <li key={r.id} className="border border-border rounded-xl overflow-hidden">
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold truncate">{r.full_name}</p>
                          <StatusBadge status={r.status} />
                        </div>
                        <p className="text-sm text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {r.email}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {new Date(r.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {r.status === "pending" && (
                          <>
                            <Button size="sm" onClick={() => (isOpen ? closeApprove() : openApprove(r))}>
                              {isOpen ? <ChevronUp className="w-4 h-4 mr-1" /> : <Check className="w-4 h-4 mr-1" />}
                              {isOpen ? "Cerrar" : "Aprobar"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => reject(r.id)}
                              disabled={actioningId === r.id}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {r.status !== "pending" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteRequest(r.id)}
                            disabled={actioningId === r.id}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {isOpen && r.status === "pending" && (
                      <div className="border-t border-border bg-muted/30 p-4 space-y-3">
                        <p className="text-xs text-muted-foreground">
                          Crea el acceso del cliente y la solicitud quedará marcada como aprobada automáticamente.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs">Marca</Label>
                            <select
                              value={approveBrandId}
                              onChange={(e) => setApproveBrandId(e.target.value)}
                              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                            >
                              <option value="">Selecciona…</option>
                              {brands.map((b) => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs">Contraseña inicial</Label>
                            <Input
                              type="text"
                              value={approvePassword}
                              onChange={(e) => setApprovePassword(e.target.value)}
                              placeholder="Mínimo 6 caracteres"
                              minLength={6}
                              className="h-9"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <Button variant="ghost" size="sm" onClick={closeApprove}>
                            Cancelar
                          </Button>
                          <Button
                            size="sm"
                            disabled={approveSubmitting}
                            onClick={() => approveAndCreate(r)}
                          >
                            {approveSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Crear acceso y aprobar
                          </Button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Accesos a marcas */}
        <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">
                Accesos a marcas{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  ({Object.keys(accessesByUser).length})
                </span>
              </h2>
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

        {/* Crear manual (colapsable) */}
        <section className="bg-card border border-border rounded-2xl">
          <button
            onClick={() => setManualOpen((v) => !v)}
            className="w-full p-6 sm:p-8 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              <div>
                <h2 className="text-xl font-bold">Crear acceso manualmente</h2>
                <p className="text-xs text-muted-foreground">Sin pasar por solicitud — útil para clientes internos.</p>
              </div>
            </div>
            {manualOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {manualOpen && (
            <form onSubmit={submitManual} className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-4 border-t border-border pt-6">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Marca</Label>
                  <select
                    value={manualBrandId}
                    onChange={(e) => setManualBrandId(e.target.value)}
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
                  <Label htmlFor="memail">Email</Label>
                  <Input id="memail" type="email" value={manualEmail} onChange={(e) => setManualEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mname">Nombre (opcional)</Label>
                  <Input id="mname" value={manualName} onChange={(e) => setManualName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mpass">Contraseña inicial</Label>
                  <Input
                    id="mpass"
                    type="text"
                    value={manualPassword}
                    onChange={(e) => setManualPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={manualSubmitting}>
                {manualSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Crear cliente
              </Button>
            </form>
          )}
        </section>

        {/* Admins */}
        <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">
                Administradores{" "}
                <span className="text-sm font-normal text-muted-foreground">({admins.length})</span>
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={loadAdmins} disabled={loadingAdmins}>
              {loadingAdmins && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Recargar
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Acceso total: panel admin, dashboard de Gira, todas las marcas y solicitudes.
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
            Si aún no tiene cuenta, créasela primero en "Crear acceso manualmente".
          </p>
        </section>
      </main>
    </div>
  );
};

export default DashboardAdmin;

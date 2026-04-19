import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit2, Check, X, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { toast } from "sonner";
import type { City, Activity } from "./CityCard";

type Sponsor = {
  id: string;
  name: string;
  category: string | null;
  amount_usd_bcv: number;
  status: string;
  notes: string | null;
};

type Settings = { id: string; bcv_to_usd_rate: number };

const fmt = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const SPONSOR_STATUS: Record<string, { label: string; cls: string }> = {
  committed: { label: "Comprometido", cls: "bg-amber-100 text-amber-700 border-amber-200" },
  paid: { label: "Pagado", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  proposal: { label: "Propuesta", cls: "bg-sky-100 text-sky-700 border-sky-200" },
};

interface Props {
  cities: City[];
  activities: Activity[];
}

export const FinancialSummary = ({ cities, activities }: Props) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [editingRate, setEditingRate] = useState(false);
  const [rateDraft, setRateDraft] = useState("0.60");
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ name: "", category: "", amount_usd_bcv: "", status: "committed", notes: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    const [sp, st] = await Promise.all([
      supabase.from("trip_sponsors").select("*").order("created_at", { ascending: false }),
      supabase.from("trip_settings").select("*").limit(1).maybeSingle(),
    ]);
    if (sp.data) setSponsors(sp.data as Sponsor[]);
    if (st.data) {
      setSettings(st.data as Settings);
      setRateDraft(String(st.data.bcv_to_usd_rate));
    }
  };

  useEffect(() => { void load(); }, []);

  // ===== Cálculo de gastos (USD reales) =====
  const flightsCost = activities.filter(a => a.activity_type === "flight").reduce((s, a) => s + (Number(a.cost_usd) || 0), 0);
  const hotelsCost = cities.reduce((s, c) => s + (Number(c.hotel_cost_usd) || 0), 0);
  const transportCost = activities.filter(a => a.activity_type === "expense" && /transporte|amtrak|tren/i.test(a.title)).reduce((s, a) => s + (Number(a.cost_usd) || 0), 0);
  const foodCost = activities.filter(a => a.activity_type === "expense" && /comida|bbq|banquete/i.test(a.title)).reduce((s, a) => s + (Number(a.cost_usd) || 0), 0) + 6600 + 360 + 500; // + USA/CAN comida + México arranque + content ordering (no están como actividades)
  const operationsCost = 1050; // seguro, eSims, lavandería, ETIAS
  const subtotal = flightsCost + hotelsCost + transportCost + foodCost + operationsCost;
  const contingency = subtotal * 0.10;
  const totalUsd = subtotal + contingency;

  // ===== Ingresos (USD BCV → USD reales con tasa) =====
  const rate = settings?.bcv_to_usd_rate ?? 0.60;
  const totalSponsoredBcv = sponsors.reduce((s, x) => s + Number(x.amount_usd_bcv || 0), 0);
  const totalSponsoredReal = totalSponsoredBcv * rate;
  const balance = totalSponsoredReal - totalUsd;

  const saveRate = async () => {
    if (!settings) return;
    const v = parseFloat(rateDraft);
    if (isNaN(v) || v <= 0) return toast.error("Tasa inválida");
    const { error } = await supabase.from("trip_settings").update({ bcv_to_usd_rate: v }).eq("id", settings.id);
    if (error) return toast.error("Error guardando tasa");
    toast.success("Tasa actualizada");
    setEditingRate(false);
    void load();
  };

  const saveSponsor = async () => {
    if (!draft.name.trim()) return toast.error("Falta nombre");
    const payload = {
      name: draft.name.trim(),
      category: draft.category || null,
      amount_usd_bcv: parseFloat(draft.amount_usd_bcv) || 0,
      status: draft.status,
      notes: draft.notes || null,
    };
    const { error } = editingId
      ? await supabase.from("trip_sponsors").update(payload).eq("id", editingId)
      : await supabase.from("trip_sponsors").insert(payload);
    if (error) return toast.error("Error");
    toast.success(editingId ? "Actualizado" : "Patrocinador añadido");
    setDraft({ name: "", category: "", amount_usd_bcv: "", status: "committed", notes: "" });
    setShowForm(false);
    setEditingId(null);
    void load();
  };

  const editSponsor = (s: Sponsor) => {
    setDraft({ name: s.name, category: s.category ?? "", amount_usd_bcv: String(s.amount_usd_bcv), status: s.status, notes: s.notes ?? "" });
    setEditingId(s.id);
    setShowForm(true);
  };

  const delSponsor = async (id: string) => {
    const { error } = await supabase.from("trip_sponsors").delete().eq("id", id);
    if (error) return toast.error("Error");
    toast.success("Eliminado");
    void load();
  };

  const expenseRows = [
    { concept: "Vuelos (Blindados)", detail: "Premium Economy + Regreso Business (Copa)", value: flightsCost },
    { concept: "Hospedaje (28 noches)", detail: "4 estrellas (excluyendo noches de vuelo)", value: hotelsCost },
    { concept: "Transporte Terrestre", detail: "Uber XL/Black + Tren Amtrak + Cannes Extra", value: transportCost || 3230 },
    { concept: "Alimentación & BBQ", detail: "Diarios + $600 BBQ Houston", value: foodCost || 9740 },
    { concept: "Operatividad & Seguro", detail: "Seguro ($400) + eSIMs + Laundry + ETIAS", value: operationsCost },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <KPI icon={TrendingDown} label="Gastos totales (USD real)" value={fmt(totalUsd)} tone="destructive" />
        <KPI icon={TrendingUp} label="Patrocinios (USD real)" value={fmt(totalSponsoredReal)} tone="success" sub={`${fmt(totalSponsoredBcv)} BCV × ${rate}`} />
        <KPI icon={Wallet} label="Balance" value={fmt(balance)} tone={balance >= 0 ? "success" : "destructive"} />
        <KPI icon={TrendingUp} label="Cobertura" value={`${totalUsd > 0 ? Math.round((totalSponsoredReal / totalUsd) * 100) : 0}%`} tone="primary" />
      </div>

      {/* Tasa de cambio */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-[var(--shadow-soft)] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Tipo de cambio BCV → USD real</p>
          <p className="text-sm text-foreground mt-1">1 USD BCV = <span className="font-semibold text-primary">{rate} USD real</span> · descuento del {Math.round((1 - rate) * 100)}%</p>
        </div>
        {!editingRate ? (
          <Button size="sm" variant="outline" onClick={() => setEditingRate(true)}>
            <Edit2 className="w-3 h-3 mr-1" /> Ajustar tasa
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Input type="number" step="0.01" value={rateDraft} onChange={e => setRateDraft(e.target.value)} className="w-28" />
            <Button size="sm" onClick={saveRate}><Check className="w-3 h-3" /></Button>
            <Button size="sm" variant="ghost" onClick={() => setEditingRate(false)}><X className="w-3 h-3" /></Button>
          </div>
        )}
      </div>

      {/* Tabla de gastos */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-[var(--shadow-soft)]">
        <div className="px-5 py-4 border-b border-border bg-muted/30">
          <h3 className="font-bold text-foreground">Resumen de inversión (USD reales · 2 pax)</h3>
          <p className="text-xs text-muted-foreground mt-1">Idéntico a la hoja "Resumen Total" del Excel</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">Concepto</th>
                <th className="text-left px-5 py-3 font-semibold hidden sm:table-cell">Detalle estratégico</th>
                <th className="text-right px-5 py-3 font-semibold">Inversión</th>
              </tr>
            </thead>
            <tbody>
              {expenseRows.map((r) => (
                <tr key={r.concept} className="border-t border-border">
                  <td className="px-5 py-3 text-foreground font-medium">{r.concept}</td>
                  <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">{r.detail}</td>
                  <td className="px-5 py-3 text-right text-foreground font-semibold">{fmt(r.value)}</td>
                </tr>
              ))}
              <tr className="border-t border-border bg-muted/30">
                <td className="px-5 py-3 text-foreground font-medium">Fondo de Imprevistos (10%)</td>
                <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">Margen de seguridad sobre logística</td>
                <td className="px-5 py-3 text-right text-foreground font-semibold">{fmt(contingency)}</td>
              </tr>
              <tr className="border-t-2 border-primary bg-primary/5">
                <td className="px-5 py-4 text-foreground font-black uppercase">Inversión Total Estimada</td>
                <td className="px-5 py-4 hidden sm:table-cell"></td>
                <td className="px-5 py-4 text-right text-primary font-black text-lg">{fmt(totalUsd)} USD</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Patrocinios */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-[var(--shadow-soft)]">
        <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground">Patrocinios e ingresos (USD BCV)</h3>
            <p className="text-xs text-muted-foreground mt-1">Lo que levantó el proyecto. Convertido a USD real con la tasa configurada.</p>
          </div>
          <Button size="sm" onClick={() => { setEditingId(null); setDraft({ name: "", category: "", amount_usd_bcv: "", status: "committed", notes: "" }); setShowForm(!showForm); }}>
            <Plus className="w-3 h-3 mr-1" /> Añadir
          </Button>
        </div>

        {showForm && (
          <div className="p-4 bg-primary/5 border-b border-primary/20 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input placeholder="Nombre del patrocinador" value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} />
              <Input placeholder="Categoría (ej: Bebidas, Telco)" value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })} />
              <Input type="number" placeholder="Monto en USD BCV" value={draft.amount_usd_bcv} onChange={e => setDraft({ ...draft, amount_usd_bcv: e.target.value })} />
              <select value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value })} className="bg-background border border-input rounded-md px-3 py-2 text-sm">
                <option value="proposal">Propuesta</option>
                <option value="committed">Comprometido</option>
                <option value="paid">Pagado</option>
              </select>
            </div>
            <Textarea placeholder="Notas (contacto, condiciones, contraprestaciones)" value={draft.notes} onChange={e => setDraft({ ...draft, notes: e.target.value })} />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancelar</Button>
              <Button size="sm" onClick={saveSponsor}>{editingId ? "Actualizar" : "Crear"}</Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">Patrocinador</th>
                <th className="text-left px-5 py-3 font-semibold hidden sm:table-cell">Categoría</th>
                <th className="text-left px-5 py-3 font-semibold">Estado</th>
                <th className="text-right px-5 py-3 font-semibold">USD BCV</th>
                <th className="text-right px-5 py-3 font-semibold">USD real</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {sponsors.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-muted-foreground italic">Aún no hay patrocinadores. Añade el primero.</td></tr>
              )}
              {sponsors.map((s) => {
                const st = SPONSOR_STATUS[s.status] ?? SPONSOR_STATUS.committed;
                return (
                  <tr key={s.id} className="border-t border-border group">
                    <td className="px-5 py-3 text-foreground font-medium">
                      {s.name}
                      {s.notes && <p className="text-xs text-muted-foreground italic mt-0.5">{s.notes}</p>}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">{s.category || "—"}</td>
                    <td className="px-5 py-3"><span className={`text-[10px] px-2 py-0.5 rounded-full border ${st.cls}`}>{st.label}</span></td>
                    <td className="px-5 py-3 text-right text-foreground font-semibold">{fmt(Number(s.amount_usd_bcv))}</td>
                    <td className="px-5 py-3 text-right text-primary font-semibold">{fmt(Number(s.amount_usd_bcv) * rate)}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => editSponsor(s)} className="text-muted-foreground hover:text-primary p-1"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => delSponsor(s.id)} className="text-muted-foreground hover:text-destructive p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {sponsors.length > 0 && (
                <tr className="border-t-2 border-primary bg-primary/5">
                  <td className="px-5 py-4 text-foreground font-black uppercase" colSpan={3}>Total levantado</td>
                  <td className="px-5 py-4 text-right text-foreground font-black">{fmt(totalSponsoredBcv)}</td>
                  <td className="px-5 py-4 text-right text-primary font-black text-lg">{fmt(totalSponsoredReal)}</td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const KPI = ({ icon: Icon, label, value, sub, tone }: { icon: typeof Wallet; label: string; value: string; sub?: string; tone: "primary" | "success" | "destructive" }) => {
  const tones = {
    primary: "border-primary/30 bg-primary/5 text-primary",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    destructive: "border-rose-200 bg-rose-50 text-rose-700",
  };
  return (
    <div className={`border rounded-2xl p-4 shadow-[var(--shadow-soft)] ${tones[tone]}`}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-80">
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      <p className="text-2xl font-black mt-2">{value}</p>
      {sub && <p className="text-[11px] opacity-70 mt-0.5">{sub}</p>}
    </div>
  );
};

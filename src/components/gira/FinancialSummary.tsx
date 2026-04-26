import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit2, Check, X, TrendingUp, TrendingDown, Wallet, CheckCircle2, AlertTriangle, Plane, Wifi } from "lucide-react";
import { toast } from "sonner";
import type { City, Activity } from "./CityCard";

type Sponsor = {
  id: string;
  name: string;
  category: string | null;
  amount_usd_bcv: number;
  status: string;
  notes: string | null;
  commission_pct: number;
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
  const [draft, setDraft] = useState({ name: "", category: "", amount_usd_bcv: "", status: "committed", notes: "", commission_pct: "10" });
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
  const transportCost = activities.filter(a => a.activity_type === "expense" && /transporte|amtrak|tren|uber/i.test(a.title)).reduce((s, a) => s + (Number(a.cost_usd) || 0), 0) || 3230;
  // Toma comidas reales de trip_activities (food/meal + expenses con keywords culinarios)
  const foodFromActivities = activities
    .filter(a =>
      a.activity_type === "food" ||
      a.activity_type === "meal" ||
      (a.activity_type === "expense" && /comida|bbq|banquete|alimentaci|arranque/i.test(a.title))
    )
    .reduce((s, a) => s + (Number(a.cost_usd) || 0), 0);
  // Comidas base: $80/día x 2 pax x 42 días = $6,720 (per diem) + extras reales desde activities
  const foodCost = foodFromActivities + 6720;
  // Internet: WiFi a bordo $40/vuelo x 2 pax SOLO en vuelos de más de 3 horas
  const parseDurationHours = (d: string | null | undefined): number => {
    if (!d) return 0;
    const h = d.match(/(\d+)\s*h/i);
    const m = d.match(/(\d+)\s*m/i);
    return (h ? Number(h[1]) : 0) + (m ? Number(m[1]) / 60 : 0);
  };
  const longFlightsCount = activities.filter(a => a.activity_type === "flight" && parseDurationHours(a.duration) > 3).length;
  const inflightWifiCost = 40 * 2 * longFlightsCount;
  // eSIMs/datos celular: $50/mes x 2 pax x 1.5 meses (mid-junio a fin julio) = $150
  const eSimCost = 150;
  // Seguro de viaje internacional: $200/persona x 2 = $400
  const insuranceCost = 400;
  // Operatividad: lavandería + ETIAS + propinas + tarjetas SIM físicas backup
  const operationsCost = 650;
  const subtotal = flightsCost + hotelsCost + transportCost + foodCost + inflightWifiCost + eSimCost + insuranceCost + operationsCost;
  const contingency = subtotal * 0.10;
  const totalUsd = subtotal + contingency;

  // ===== Ingresos (USD BCV → USD reales con tasa) =====
  const rate = settings?.bcv_to_usd_rate ?? 0.60;
  const totalSponsoredBcv = sponsors.reduce((s, x) => s + Number(x.amount_usd_bcv || 0), 0);
  const totalCommissionBcv = sponsors.reduce((s, x) => s + Number(x.amount_usd_bcv || 0) * (Number(x.commission_pct ?? 10) / 100), 0);
  const totalNetBcv = totalSponsoredBcv - totalCommissionBcv;
  const totalSponsoredReal = totalNetBcv * rate;
  const totalCommissionReal = totalCommissionBcv * rate;
  const balance = totalSponsoredReal - totalUsd;

  // ===== Desglose de comisiones por categoría =====
  const commissionByCategory = sponsors.reduce((acc, s) => {
    const cat = (s.category && s.category.trim()) || "Sin categoría";
    const gross = Number(s.amount_usd_bcv || 0);
    const pct = Number(s.commission_pct ?? 10);
    const commission = gross * (pct / 100);
    if (!acc[cat]) acc[cat] = { gross: 0, commission: 0, count: 0, pctSum: 0 };
    acc[cat].gross += gross;
    acc[cat].commission += commission;
    acc[cat].count += 1;
    acc[cat].pctSum += pct;
    return acc;
  }, {} as Record<string, { gross: number; commission: number; count: number; pctSum: number }>);
  const categoryRows = Object.entries(commissionByCategory)
    .map(([category, v]) => ({
      category,
      count: v.count,
      gross: v.gross,
      commission: v.commission,
      net: v.gross - v.commission,
      avgPct: v.pctSum / v.count,
    }))
    .sort((a, b) => b.commission - a.commission);

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
      commission_pct: (() => { const n = parseFloat(draft.commission_pct); return isNaN(n) ? 10 : Math.max(0, Math.min(100, n)); })(),
    };
    const { error } = editingId
      ? await supabase.from("trip_sponsors").update(payload).eq("id", editingId)
      : await supabase.from("trip_sponsors").insert(payload);
    if (error) return toast.error("Error");
    toast.success(editingId ? "Actualizado" : "Patrocinador añadido");
    setDraft({ name: "", category: "", amount_usd_bcv: "", status: "committed", notes: "", commission_pct: "10" });
    setShowForm(false);
    setEditingId(null);
    void load();
  };

  const editSponsor = (s: Sponsor) => {
    setDraft({ name: s.name, category: s.category ?? "", amount_usd_bcv: String(s.amount_usd_bcv), status: s.status, notes: s.notes ?? "", commission_pct: String(s.commission_pct ?? 10) });
    setEditingId(s.id);
    setShowForm(true);
  };

  const delSponsor = async (id: string) => {
    const { error } = await supabase.from("trip_sponsors").delete().eq("id", id);
    if (error) return toast.error("Error");
    toast.success("Eliminado");
    void load();
  };

  const totalNights = cities.reduce((s, c) => s + (Number(c.nights) || 0), 0);
  const hotelRows = [...cities]
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((c) => ({
      id: c.id,
      city: c.city,
      nights: Number(c.nights) || 0,
      cost: Number(c.hotel_cost_usd) || 0,
      nightly: Number(c.nightly_rate_usd) || 0,
      accommodation: c.accommodation_name || "",
    }));

  // ===== Filas de vuelos (orden cronológico vía posición de ciudad) =====
  const cityPosById = new Map(cities.map(c => [c.id, c.position ?? 0]));
  const cityNameById = new Map(cities.map(c => [c.id, c.city]));
  const flightRows = activities
    .filter(a => a.activity_type === "flight")
    .map(a => ({
      id: a.id,
      city: cityNameById.get(a.city_id) || "—",
      cityPos: cityPosById.get(a.city_id) ?? 999,
      route: a.title,
      airline: a.airline || "",
      flightNumber: a.flight_number || "",
      cabin: a.cabin_class || "",
      duration: a.duration || "",
      durationHours: parseDurationHours(a.duration),
      cost: Number(a.cost_usd) || 0,
    }))
    .sort((x, y) => x.cityPos - y.cityPos || x.route.localeCompare(y.route));
  const totalFlightsCost = flightRows.reduce((s, r) => s + r.cost, 0);
  const flightsCount = flightRows.length;
  const longFlightsTotal = flightRows.filter(r => r.durationHours > 3).length;
  const freeFlights = flightRows.filter(r => r.cost === 0).length;

  const expenseRows = [
    { concept: "Vuelos", detail: `${activities.filter(a => a.activity_type === "flight").length} segmentos · Conviasa directo + Premium Economy internacional`, value: flightsCost },
    { concept: "Hospedaje", detail: `${totalNights} noches · boutique 3-4★ cerca de estadios`, value: hotelsCost },
    { concept: "Transporte terrestre", detail: "Uber XL/Black + Amtrak + traslados Cannes", value: transportCost },
    { concept: "Alimentación", detail: "$80/día x 2 pax x 42 días (per diem) + extras registrados", value: foodCost },
    { concept: "WiFi a bordo (Jhon + Juan)", detail: `$40 x 2 pax x ${longFlightsCount} vuelos >3h`, value: inflightWifiCost },
    { concept: "Internet celular (eSIM)", detail: "Datos roaming 2 personas · ~6 semanas", value: eSimCost },
    { concept: "Seguro de viaje", detail: "Cobertura internacional 2 pax x 42 días", value: insuranceCost },
    { concept: "Operatividad", detail: "Lavandería + ETIAS + propinas + extras", value: operationsCost },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <KPI icon={TrendingDown} label="Gastos totales (USD real)" value={fmt(totalUsd)} tone="destructive" />
        <KPI icon={TrendingUp} label="Patrocinios netos (USD real)" value={fmt(totalSponsoredReal)} tone="success" sub={`Bruto ${fmt(totalSponsoredBcv)} BCV − comisión ${fmt(totalCommissionBcv)}`} />
        <KPI icon={Wallet} label="Balance" value={fmt(balance)} tone={balance >= 0 ? "success" : "destructive"} />
        <KPI icon={TrendingUp} label="Rentabilidad" value={`${totalUsd > 0 ? Math.round(((totalSponsoredReal - totalUsd) / totalUsd) * 100) : 0}%`} tone="info" sub={`Ingresos ${fmt(totalSponsoredReal)} / Gastos ${fmt(totalUsd)}`} />
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
                  <td className="px-5 py-3 text-right text-rose-600 font-semibold">{fmt(r.value)}</td>
                </tr>
              ))}
              <tr className="border-t border-border bg-muted/30">
                <td className="px-5 py-3 text-foreground font-medium">Fondo de Imprevistos (10%)</td>
                <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">Margen de seguridad sobre logística</td>
                <td className="px-5 py-3 text-right text-rose-600 font-semibold">{fmt(contingency)}</td>
              </tr>
              <tr className="border-t-2 border-primary bg-primary/5">
                <td className="px-5 py-4 text-foreground font-black uppercase">Inversión Total Estimada</td>
                <td className="px-5 py-4 hidden sm:table-cell"></td>
                <td className="px-5 py-4 text-right text-rose-600 font-black text-lg">{fmt(totalUsd)} USD</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Desglose de vuelos por segmento */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-[var(--shadow-soft)]">
        <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Plane className="w-5 h-5 text-primary shrink-0" />
            <div>
              <h3 className="font-bold text-foreground">Vuelos por segmento</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {flightsCount} segmentos · {longFlightsTotal} con WiFi a bordo (&gt;3h){freeFlights > 0 ? ` · ${freeFlights} sin costo (cortesía / sponsor)` : ""}.
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total vuelos</p>
            <p className="font-black text-lg text-rose-600">{fmt(totalFlightsCost)}</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">Ruta</th>
                <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">Aerolínea / Vuelo</th>
                <th className="text-left px-5 py-3 font-semibold hidden sm:table-cell">Cabina</th>
                <th className="text-right px-5 py-3 font-semibold hidden sm:table-cell">Duración</th>
                <th className="text-right px-5 py-3 font-semibold">Costo</th>
              </tr>
            </thead>
            <tbody>
              {flightRows.map((r) => {
                const isFree = r.cost === 0;
                const hasWifi = r.durationHours > 3;
                return (
                  <tr key={r.id} className={`border-t border-border ${isFree ? "bg-emerald-50/40" : ""}`}>
                    <td className="px-5 py-3 text-foreground font-medium">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>{r.route}</span>
                        {isFree && (
                          <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                            Sin costo
                          </span>
                        )}
                        {hasWifi && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-200">
                            <Wifi className="w-3 h-3" /> WiFi
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 md:hidden">
                        {r.airline} {r.flightNumber}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">
                      {r.airline ? (
                        <span>
                          {r.airline}
                          {r.flightNumber && <span className="ml-1 text-foreground/70 font-mono text-xs">{r.flightNumber}</span>}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell text-xs">
                      {r.cabin || <span className="italic text-muted-foreground/60">—</span>}
                    </td>
                    <td className="px-5 py-3 text-right text-muted-foreground hidden sm:table-cell">
                      {r.duration || "—"}
                    </td>
                    <td className={`px-5 py-3 text-right font-semibold ${isFree ? "text-emerald-600" : "text-rose-600"}`}>
                      {isFree ? "$0" : fmt(r.cost)}
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-primary bg-primary/5">
                <td className="px-5 py-4 text-foreground font-black uppercase">Total vuelos</td>
                <td className="px-5 py-4 hidden md:table-cell"></td>
                <td className="px-5 py-4 hidden sm:table-cell"></td>
                <td className="px-5 py-4 hidden sm:table-cell"></td>
                <td className="px-5 py-4 text-right text-rose-600 font-black text-lg">{fmt(totalFlightsCost)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Desglose de hospedaje por ciudad */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-[var(--shadow-soft)]">
        <div className="px-5 py-4 border-b border-border bg-muted/30">
          <h3 className="font-bold text-foreground">Hospedaje por ciudad</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Validación visual: {totalNights} noches totales · {fmt(hotelsCost)} en hoteles. Las ciudades sin costo (familia) se marcan explícitamente.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">Ciudad</th>
                <th className="text-left px-5 py-3 font-semibold hidden sm:table-cell">Alojamiento</th>
                <th className="text-right px-5 py-3 font-semibold">Noches</th>
                <th className="text-right px-5 py-3 font-semibold hidden sm:table-cell">$ / noche</th>
                <th className="text-right px-5 py-3 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {hotelRows.map((r) => {
                const isFree = r.cost === 0;
                const isSingleNight = r.nights === 1 && r.cost > 0;
                return (
                  <tr key={r.id} className={`border-t border-border ${isFree ? "bg-emerald-50/40" : ""}`}>
                    <td className="px-5 py-3 text-foreground font-medium">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>{r.city}</span>
                        {isFree && (
                          <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                            Sin hotel
                          </span>
                        )}
                        {isSingleNight && (
                          <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                            Solo 1 noche
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">
                      {r.accommodation || <span className="italic text-muted-foreground/60">Por confirmar</span>}
                    </td>
                    <td className="px-5 py-3 text-right text-foreground font-semibold">{r.nights}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground hidden sm:table-cell">
                      {r.nightly > 0 ? fmt(r.nightly) : "—"}
                    </td>
                    <td className={`px-5 py-3 text-right font-semibold ${isFree ? "text-emerald-600" : "text-rose-600"}`}>
                      {isFree ? "$0" : fmt(r.cost)}
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t-2 border-primary bg-primary/5">
                <td className="px-5 py-4 text-foreground font-black uppercase">Total hospedaje</td>
                <td className="px-5 py-4 hidden sm:table-cell"></td>
                <td className="px-5 py-4 text-right text-foreground font-black">{totalNights}</td>
                <td className="px-5 py-4 hidden sm:table-cell"></td>
                <td className="px-5 py-4 text-right text-rose-600 font-black text-lg">{fmt(hotelsCost)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Validación de consistencia: hotel_cost_usd vs nights × nightly_rate_usd */}
      {(() => {
        const validationRows = hotelRows.map(r => ({
          ...r,
          calculated: r.nights * r.nightly,
          diff: r.cost - r.nights * r.nightly,
        }));
        const totalDiff = validationRows.reduce((s, r) => s + r.diff, 0);
        // Tolerancia de $1 para absorber redondeos (ej. CDMX 3 × $86.67 = $260.01)
        const offRows = validationRows.filter(r => Math.abs(r.diff) >= 1);
        const allClean = offRows.length === 0;
        return (
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-[var(--shadow-soft)]">
            <div className={`px-5 py-4 border-b border-border flex items-center justify-between gap-3 flex-wrap ${allClean ? "bg-emerald-50" : "bg-amber-50"}`}>
              <div className="flex items-center gap-3">
                {allClean ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                )}
                <div>
                  <h3 className="font-bold text-foreground">Validación de hospedaje</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {allClean
                      ? "Todos los hoteles cuadran: hotel_cost_usd = noches × $/noche."
                      : `${offRows.length} ciudad(es) con descuadre. Mové los extras a actividades como expense.`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Suma de diferencias</p>
                <p className={`font-black text-lg ${Math.abs(totalDiff) < 1 ? "text-emerald-600" : "text-amber-600"}`}>
                  {totalDiff >= 0 ? "+" : "−"}${Math.abs(Math.round(totalDiff)).toLocaleString("en-US")}
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold">Ciudad</th>
                    <th className="text-right px-5 py-3 font-semibold">Noches</th>
                    <th className="text-right px-5 py-3 font-semibold">$/noche</th>
                    <th className="text-right px-5 py-3 font-semibold hidden sm:table-cell">Calculado</th>
                    <th className="text-right px-5 py-3 font-semibold">hotel_cost_usd</th>
                    <th className="text-right px-5 py-3 font-semibold">Δ Diferencia</th>
                    <th className="text-center px-5 py-3 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {validationRows.map((r) => {
                    const ok = Math.abs(r.diff) < 1;
                    const isFree = r.cost === 0 && r.nights === 0;
                    return (
                      <tr key={r.id} className={`border-t border-border ${!ok ? "bg-amber-50/40" : ""}`}>
                        <td className="px-5 py-3 text-foreground font-medium">{r.city}</td>
                        <td className="px-5 py-3 text-right text-foreground">{r.nights}</td>
                        <td className="px-5 py-3 text-right text-muted-foreground">
                          {r.nightly > 0 ? `$${r.nightly.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : "—"}
                        </td>
                        <td className="px-5 py-3 text-right text-muted-foreground hidden sm:table-cell">
                          {fmt(r.calculated)}
                        </td>
                        <td className="px-5 py-3 text-right text-foreground font-semibold">
                          {fmt(r.cost)}
                        </td>
                        <td className={`px-5 py-3 text-right font-bold ${ok ? "text-emerald-600" : "text-amber-600"}`}>
                          {ok ? "$0" : `${r.diff >= 0 ? "+" : "−"}$${Math.abs(Math.round(r.diff)).toLocaleString("en-US")}`}
                        </td>
                        <td className="px-5 py-3 text-center">
                          {isFree ? (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">N/A</span>
                          ) : ok ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> OK
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                              <AlertTriangle className="w-3 h-3" /> Revisar
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {!allClean && (
              <div className="px-5 py-3 bg-amber-50/60 border-t border-amber-200 text-xs text-amber-900">
                💡 Las diferencias positivas (extras del hotel: parking, resort fee, eventos) deberían moverse a <code className="bg-amber-100 px-1 rounded">trip_activities</code> como <code className="bg-amber-100 px-1 rounded">expense</code>. Las negativas indican un total guardado menor al cálculo (probable error de captura en noches o tarifa).
              </div>
            )}
          </div>
        );
      })()}

      {/* Desglose de comisiones por categoría */}
      {categoryRows.length > 0 && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-[var(--shadow-soft)]">
          <div className="px-5 py-4 border-b border-border bg-muted/30">
            <h3 className="font-bold text-foreground">Comisiones por categoría de cliente</h3>
            <p className="text-xs text-muted-foreground mt-1">Cuánto se va en comercialización por tipo de patrocinador.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Categoría</th>
                  <th className="text-right px-5 py-3 font-semibold hidden sm:table-cell">#</th>
                  <th className="text-right px-5 py-3 font-semibold">Bruto BCV</th>
                  <th className="text-right px-5 py-3 font-semibold hidden sm:table-cell">% prom.</th>
                  <th className="text-right px-5 py-3 font-semibold">Comisión</th>
                  <th className="text-right px-5 py-3 font-semibold">Neto BCV</th>
                  <th className="text-right px-5 py-3 font-semibold">Neto USD real</th>
                </tr>
              </thead>
              <tbody>
                {categoryRows.map((r) => {
                  const share = totalCommissionBcv > 0 ? (r.commission / totalCommissionBcv) * 100 : 0;
                  return (
                    <tr key={r.category} className="border-t border-border">
                      <td className="px-5 py-3 text-foreground font-medium">
                        {r.category}
                        <div className="mt-1.5 h-1 w-full max-w-[160px] bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${share}%` }} />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{share.toFixed(1)}% de la comisión total</p>
                      </td>
                      <td className="px-5 py-3 text-right text-muted-foreground hidden sm:table-cell">{r.count}</td>
                      <td className="px-5 py-3 text-right text-foreground font-semibold">{fmt(r.gross)}</td>
                      <td className="px-5 py-3 text-right text-muted-foreground hidden sm:table-cell">{r.avgPct.toFixed(1)}%</td>
                      <td className="px-5 py-3 text-right text-rose-600 font-semibold">−{fmt(r.commission)}</td>
                      <td className="px-5 py-3 text-right text-foreground font-semibold">{fmt(r.net)}</td>
                      <td className="px-5 py-3 text-right text-blue-600 font-semibold">{fmt(r.net * rate)}</td>
                    </tr>
                  );
                })}
                <tr className="border-t-2 border-primary bg-primary/5">
                  <td className="px-5 py-4 text-foreground font-black uppercase">Total</td>
                  <td className="px-5 py-4 text-right text-foreground font-black hidden sm:table-cell">{sponsors.length}</td>
                  <td className="px-5 py-4 text-right text-foreground font-black">{fmt(totalSponsoredBcv)}</td>
                  <td className="px-5 py-4 hidden sm:table-cell"></td>
                  <td className="px-5 py-4 text-right text-rose-600 font-black">−{fmt(totalCommissionBcv)}</td>
                  <td className="px-5 py-4 text-right text-foreground font-black">{fmt(totalNetBcv)}</td>
                  <td className="px-5 py-4 text-right text-blue-600 font-black text-lg">{fmt(totalSponsoredReal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Patrocinios */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-[var(--shadow-soft)]">
        <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground">Patrocinios e ingresos (USD BCV)</h3>
            <p className="text-xs text-muted-foreground mt-1">Lo que levantó el proyecto. Convertido a USD real con la tasa configurada.</p>
          </div>
          <Button size="sm" onClick={() => { setEditingId(null); setDraft({ name: "", category: "", amount_usd_bcv: "", status: "committed", notes: "", commission_pct: "10" }); setShowForm(!showForm); }}>
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
              <select value={draft.commission_pct} onChange={e => setDraft({ ...draft, commission_pct: e.target.value })} className="bg-background border border-input rounded-md px-3 py-2 text-sm">
                <option value="8">Comisión 8%</option>
                <option value="10">Comisión 10%</option>
                <option value="0">Sin comisión</option>
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
                <th className="text-right px-5 py-3 font-semibold">Comis.</th>
                <th className="text-right px-5 py-3 font-semibold">Neto BCV</th>
                <th className="text-right px-5 py-3 font-semibold">USD real</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {sponsors.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-8 text-center text-muted-foreground italic">Aún no hay patrocinadores. Añade el primero.</td></tr>
              )}
              {sponsors.map((s) => {
                const st = SPONSOR_STATUS[s.status] ?? SPONSOR_STATUS.committed;
                const pct = Number(s.commission_pct ?? 10);
                const gross = Number(s.amount_usd_bcv);
                const commission = gross * (pct / 100);
                const net = gross - commission;
                return (
                  <tr key={s.id} className="border-t border-border group">
                    <td className="px-5 py-3 text-foreground font-medium">
                      {s.name}
                      {s.notes && <p className="text-xs text-muted-foreground italic mt-0.5">{s.notes}</p>}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">{s.category || "—"}</td>
                    <td className="px-5 py-3"><span className={`text-[10px] px-2 py-0.5 rounded-full border ${st.cls}`}>{st.label}</span></td>
                    <td className="px-5 py-3 text-right text-foreground font-semibold">{fmt(gross)}</td>
                    <td className="px-5 py-3 text-right text-rose-600 text-xs">−{fmt(commission)}<span className="opacity-60"> ({pct}%)</span></td>
                    <td className="px-5 py-3 text-right text-foreground font-semibold">{fmt(net)}</td>
                    <td className="px-5 py-3 text-right text-blue-600 font-semibold">{fmt(net * rate)}</td>
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
                  <td className="px-5 py-4 text-right text-rose-600 font-black">−{fmt(totalCommissionBcv)}</td>
                  <td className="px-5 py-4 text-right text-foreground font-black">{fmt(totalNetBcv)}</td>
                  <td className="px-5 py-4 text-right text-blue-600 font-black text-lg">{fmt(totalSponsoredReal)}</td>
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

const KPI = ({ icon: Icon, label, value, sub, tone }: { icon: typeof Wallet; label: string; value: string; sub?: string; tone: "primary" | "success" | "destructive" | "info" }) => {
  const tones = {
    primary: "border-primary/30 bg-primary/5 text-primary",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    destructive: "border-rose-200 bg-rose-50 text-rose-700",
    info: "border-blue-200 bg-blue-50 text-blue-700",
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

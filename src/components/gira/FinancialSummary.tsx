import { useEffect, useState, Fragment } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit2, Check, X, TrendingUp, TrendingDown, Wallet, CheckCircle2, AlertTriangle, Plane, Wifi, ChevronDown, ChevronRight, Receipt } from "lucide-react";
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

type ExpenseRow = {
  id: string;
  paid_by: string;
  amount_usd: number;
  expense_date: string;
  category: string | null;
  merchant: string | null;
  description: string | null;
};

const fmt = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const SPONSOR_STATUS: Record<string, { label: string; cls: string }> = {
  committed: { label: "Comprometido", cls: "bg-amber-100 text-amber-700 border-amber-200" },
  paid: { label: "Pagado", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  proposal: { label: "Propuesta", cls: "bg-sky-100 text-sky-700 border-sky-200" },
};

interface Props {
  cities: City[];
  activities: Activity[];
  scenario?: "base" | "alt_a" | "alt_b";
}

export const FinancialSummary = ({ cities, activities, scenario = "base" }: Props) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [editingRate, setEditingRate] = useState(false);
  const [rateDraft, setRateDraft] = useState("0.60");
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ name: "", category: "", amount_usd_bcv: "", status: "committed", notes: "", commission_pct: "10" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedAuditRows, setExpandedAuditRows] = useState<Set<string>>(new Set());
  const toggleAuditRow = (id: string) => {
    setExpandedAuditRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const load = async () => {
    const [sp, st, ex] = await Promise.all([
      supabase.from("trip_sponsors").select("*").order("created_at", { ascending: false }),
      supabase.from("trip_settings").select("*").limit(1).maybeSingle(),
      supabase.from("expense_reports").select("id,paid_by,amount_usd,expense_date,category,merchant,description").order("expense_date", { ascending: false }),
    ]);
    if (sp.data) setSponsors(sp.data as Sponsor[]);
    if (st.data) {
      setSettings(st.data as Settings);
      setRateDraft(String(st.data.bcv_to_usd_rate));
    }
    if (ex.data) setExpenses(ex.data as ExpenseRow[]);
  };

  useEffect(() => { void load(); }, []);

  // ===== Cálculo de gastos (USD reales · todos los costos ya son TOTALES 2 pax) =====
  const flightsCost = activities.filter(a => a.activity_type === "flight").reduce((s, a) => s + (Number(a.cost_usd) || 0), 0);
  const hotelsCost = cities.reduce((s, c) => s + (Number(c.hotel_cost_usd) || 0), 0);

  // Clasificadores (mutuamente excluyentes para evitar doble conteo)
  // Incluye actividades con type='transport' y gastos con título de transporte/renta de auto.
  const isTransportExpense = (a: Activity) =>
    a.activity_type === "transport" ||
    (a.activity_type === "expense" && /transporte|amtrak|tren|uber|metrorail|alquiler|renta|carro|auto/i.test(a.title));
  const isFoodExpense = (a: Activity) =>
    a.activity_type === "food" ||
    a.activity_type === "meal" ||
    (a.activity_type === "expense" && /comida|bbq|banquete|alimentaci|arranque/i.test(a.title));

  const transportCost = activities.filter(isTransportExpense).reduce((s, a) => s + (Number(a.cost_usd) || 0), 0);
  const foodFromActivities = activities.filter(isFoodExpense).reduce((s, a) => s + (Number(a.cost_usd) || 0), 0);
  // Comidas base: $80/día x 2 pax x 42 días = $6,720 (per diem) + extras reales desde activities
  const perDiemFood = 6720;
  const foodCost = foodFromActivities + perDiemFood;

  // "Otros gastos" = expenses con costo > 0 que NO son transporte NI comida (extras hotel, content ordering, etc.)
  const otherExpensesActivities = activities.filter(a =>
    a.activity_type === "expense" &&
    Number(a.cost_usd) > 0 &&
    !isTransportExpense(a) &&
    !isFoodExpense(a)
  );
  const otherExpensesCost = otherExpensesActivities.reduce((s, a) => s + Number(a.cost_usd), 0);

  // Internet: WiFi a bordo $40/persona/vuelo SOLO en vuelos >3h
  // Conviasa CCS→MEX = 2 vuelos pero cada uno con 1 pax → contar como 1 pax
  // Resto = ambos pax viajan juntos → 2 pax por vuelo
  const parseDurationHours = (d: string | null | undefined): number => {
    if (!d) return 0;
    const h = d.match(/(\d+)\s*h/i);
    const m = d.match(/(\d+)\s*m/i);
    return (h ? Number(h[1]) : 0) + (m ? Number(m[1]) / 60 : 0);
  };
  const longFlights = activities.filter(a => a.activity_type === "flight" && parseDurationHours(a.duration) > 3);
  const longFlightsCount = longFlights.length;
  const inflightWifiCost = longFlights.reduce((sum, a) => {
    const isConviasaSolo = (a.airline || "").toLowerCase().includes("conviasa");
    const pax = isConviasaSolo ? 1 : 2;
    return sum + 40 * pax;
  }, 0);

  // ===== Detección de traslados duplicados (vuelo vs tren/bus) =====
  // Si el mismo trayecto origen→destino aparece como vuelo Y como gasto de transporte
  // terrestre (Amtrak, tren, bus), lo marcamos como duplicado para revisar.
  const ROUTE_RE = /\b([A-Z]{3})\s*(?:→|->|-|–|to|a)\s*([A-Z]{3})\b/i;
  const extractRoute = (text: string | null | undefined): string | null => {
    if (!text) return null;
    const m = text.match(ROUTE_RE);
    if (!m) return null;
    return `${m[1].toUpperCase()}→${m[2].toUpperCase()}`;
  };
  const flightRoutes = new Map<string, string>(); // route -> activity id
  activities.filter(a => a.activity_type === "flight").forEach(a => {
    const route = extractRoute(a.title) || extractRoute(a.description);
    if (route) flightRoutes.set(route, a.id);
  });
  const groundRoutes = new Map<string, string>();
  activities.filter(isTransportExpense).forEach(a => {
    const route = extractRoute(a.title) || extractRoute(a.description);
    if (route) groundRoutes.set(route, a.id);
  });
  const duplicatedActivityIds = new Set<string>();
  flightRoutes.forEach((flightId, route) => {
    const groundId = groundRoutes.get(route);
    if (groundId) {
      duplicatedActivityIds.add(flightId);
      duplicatedActivityIds.add(groundId);
    }
  });

  // eSIMs/datos celular: $50/mes x 2 pax x 1.5 meses (mid-junio a fin julio) = $150
  const eSimCost = 150;
  // Seguro de viaje internacional: $200/persona x 2 = $400
  const insuranceCost = 400;
  // Operatividad: lavandería + ETIAS + propinas + tarjetas SIM físicas backup
  const operationsCost = 650;
  const subtotal = flightsCost + hotelsCost + transportCost + foodCost + otherExpensesCost + inflightWifiCost + eSimCost + insuranceCost + operationsCost;
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

  // ===== Costo real ejecutado (basado en expense_reports) =====
  const realSpent = expenses.reduce((s, e) => s + (Number(e.amount_usd) || 0), 0);
  const realByPayer = expenses.reduce((acc, e) => {
    const k = e.paid_by || "conjunto";
    acc[k] = (acc[k] || 0) + (Number(e.amount_usd) || 0);
    return acc;
  }, {} as Record<string, number>);
  const realPctOfBudget = totalUsd > 0 ? (realSpent / totalUsd) * 100 : 0;
  const realRemaining = totalUsd - realSpent;

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
      duplicated: duplicatedActivityIds.has(a.id),
    }))
    .sort((x, y) => x.cityPos - y.cityPos || x.route.localeCompare(y.route));
  const totalFlightsCost = flightRows.reduce((s, r) => s + r.cost, 0);
  const flightsCount = flightRows.length;
  const longFlightsTotal = flightRows.filter(r => r.durationHours > 3).length;
  const freeFlights = flightRows.filter(r => r.cost === 0).length;

  // ===== Reales reportados por categoría (expense_reports) =====
  const realByCategoryRaw = expenses.reduce((acc, e) => {
    const cat = (e.category || "").toLowerCase().trim();
    acc[cat] = (acc[cat] || 0) + (Number(e.amount_usd) || 0);
    return acc;
  }, {} as Record<string, number>);
  const realByCategory: Record<string, number> = {
    vuelos: realByCategoryRaw["vuelos"] || 0,
    hospedaje: (realByCategoryRaw["hospedaje"] || 0) + (realByCategoryRaw["hotel"] || 0) + (realByCategoryRaw["alojamiento"] || 0),
    transporte: (realByCategoryRaw["transporte"] || 0) + (realByCategoryRaw["uber"] || 0) + (realByCategoryRaw["tren"] || 0),
    comida: (realByCategoryRaw["comida"] || 0) + (realByCategoryRaw["alimentacion"] || 0) + (realByCategoryRaw["alimentación"] || 0),
    wifi: (realByCategoryRaw["wifi"] || 0),
    esim: (realByCategoryRaw["esim"] || 0) + (realByCategoryRaw["internet"] || 0) + (realByCategoryRaw["datos"] || 0),
    seguro: (realByCategoryRaw["seguro"] || 0),
    operatividad: (realByCategoryRaw["operatividad"] || 0) + (realByCategoryRaw["lavanderia"] || 0) + (realByCategoryRaw["propinas"] || 0),
    otros: (realByCategoryRaw["otros"] || 0) + (realByCategoryRaw[""] || 0),
  };

  // Construcción híbrida: si hay real para la categoría → sustituye el proyectado.
  const buildRow = (concept: string, projected: number, realKey: keyof typeof realByCategory, detailProjected: string, detailReal: string) => {
    const real = realByCategory[realKey] || 0;
    const useReal = real > 0;
    return {
      concept,
      detail: useReal ? detailReal : detailProjected,
      value: useReal ? real : projected,
      projected,
      real,
      source: useReal ? "real" as const : "proyectado" as const,
    };
  };

  const expenseRows = [
    buildRow(
      "Vuelos",
      flightsCost,
      "vuelos",
      `${activities.filter(a => a.activity_type === "flight").length} segmentos · totales 2 pax · mix Economy/Premium Economy/Business`,
      `Reportado en gastos · proyectado era ${fmt(flightsCost)}`,
    ),
    buildRow(
      "Hospedaje",
      hotelsCost,
      "hospedaje",
      `${totalNights} noches · boutique 3-4★ cerca de estadios`,
      `Reportado en gastos · proyectado era ${fmt(hotelsCost)}`,
    ),
    buildRow(
      "Transporte terrestre",
      transportCost,
      "transporte",
      `Uber XL/Black + Amtrak + traslados (${activities.filter(isTransportExpense).length} registros)`,
      `Reportado en gastos · proyectado era ${fmt(transportCost)}`,
    ),
    buildRow(
      "Alimentación",
      foodCost,
      "comida",
      `$80/día x 2 pax x 42 días (per diem $${perDiemFood.toLocaleString("en-US")}) + ${activities.filter(isFoodExpense).length} extras registrados`,
      `Reportado en gastos · proyectado era ${fmt(foodCost)} (per diem $${perDiemFood.toLocaleString("en-US")} + extras)`,
    ),
    buildRow(
      "Otros gastos (extras hotel, contenido)",
      otherExpensesCost,
      "otros",
      `${otherExpensesActivities.length} ítems sin clasificar en transporte/comida`,
      `Reportado en gastos · proyectado era ${fmt(otherExpensesCost)}`,
    ),
    buildRow(
      "WiFi a bordo (Jhon + Juan)",
      inflightWifiCost,
      "wifi",
      `$40/pax · ${longFlightsCount} vuelos >3h (Conviasa solo 1 pax)`,
      `Reportado en gastos · proyectado era ${fmt(inflightWifiCost)}`,
    ),
    buildRow(
      "Internet celular (eSIM)",
      eSimCost,
      "esim",
      "Datos roaming 2 personas · ~6 semanas",
      `Reportado en gastos · proyectado era ${fmt(eSimCost)}`,
    ),
    buildRow(
      "Seguro de viaje",
      insuranceCost,
      "seguro",
      "Cobertura internacional 2 pax x 42 días",
      `Reportado en gastos · proyectado era ${fmt(insuranceCost)}`,
    ),
    buildRow(
      "Operatividad",
      operationsCost,
      "operatividad",
      "Lavandería + ETIAS + propinas + extras",
      `Reportado en gastos · proyectado era ${fmt(operationsCost)}`,
    ),
  ];

  // Recalcular subtotal/contingencia/total usando el híbrido real+proyectado
  const hybridSubtotal = expenseRows.reduce((s, r) => s + r.value, 0);
  const hybridContingency = hybridSubtotal * 0.10;
  const hybridTotal = hybridSubtotal + hybridContingency;

  return (
    <div className="space-y-6">
      {scenario !== "base" && (
        <div className="rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold text-primary">
              Vista hipotética — {scenario === "alt_a"
                ? "Alternativa A · Portugal 1° (KC → Vancouver → KC → Atlanta)"
                : "Alternativa B · Portugal 2° (NY → Atlanta → Boston → Dallas)"}
            </p>
            <p className="text-muted-foreground mt-0.5">
              Los desgloses de hoteles, vuelos y totales abajo reflejan automáticamente las ciudades y tramos de este escenario.
            </p>
          </div>
        </div>
      )}
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <KPI icon={TrendingDown} label="Gastos totales (USD real)" value={fmt(totalUsd)} tone="destructive" />
        <KPI icon={TrendingUp} label="Patrocinios netos (USD real)" value={fmt(totalSponsoredReal)} tone="success" sub={`Bruto ${fmt(totalSponsoredBcv)} BCV − comisión ${fmt(totalCommissionBcv)}`} />
        <KPI icon={Wallet} label="Balance" value={fmt(balance)} tone={balance >= 0 ? "success" : "destructive"} />
        <KPI icon={TrendingUp} label="Rentabilidad" value={`${totalUsd > 0 ? Math.round(((totalSponsoredReal - totalUsd) / totalUsd) * 100) : 0}%`} tone="info" sub={`Ingresos ${fmt(totalSponsoredReal)} / Gastos ${fmt(totalUsd)}`} />
      </div>

      {/* Costo real ejecutado (gastos reportados) */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-[var(--shadow-soft)]">
        <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Receipt className="w-5 h-5 text-primary shrink-0" />
            <div>
              <h3 className="font-bold text-foreground">Costo real ejecutado</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {expenses.length} gastos reportados · {realPctOfBudget.toFixed(1)}% del presupuesto estimado
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Gastado hasta hoy</p>
            <p className="font-black text-lg text-rose-600">{fmt(realSpent)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border">
          <MiniStat label="Conjunto (agencia)" value={fmt(realByPayer.conjunto || 0)} accent="amber" />
          <MiniStat label="Pagado por Juan" value={fmt(realByPayer.juan || 0)} accent="blue" />
          <MiniStat label="Pagado por Jhon" value={fmt(realByPayer.jhon || 0)} accent="purple" />
          <MiniStat
            label={realRemaining >= 0 ? "Disponible vs presupuesto" : "Exceso sobre presupuesto"}
            value={fmt(Math.abs(realRemaining))}
            accent={realRemaining >= 0 ? "emerald" : "rose"}
          />
        </div>
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
              <h3 className="font-bold text-foreground">Vuelos por segmento <span className="text-xs font-medium text-muted-foreground">(costos totales 2 pax)</span></h3>
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
                const isConviasaSolo = r.airline.toLowerCase().includes("conviasa");
                // Solo alerta vuelos largos (>3h) con costo sospechosamente bajo (<$400 total para 2 pax).
                // Domésticos cortos USA pueden costar legítimamente $200-300 total ×2.
                const looksUnderpriced = !isFree && !isConviasaSolo && r.cost > 0 && r.durationHours > 3 && r.cost < 400;
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
                        {isConviasaSolo && (
                          <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
                            1 pax (día distinto)
                          </span>
                        )}
                        {looksUnderpriced && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                            <AlertTriangle className="w-3 h-3" /> ¿1 pax?
                          </span>
                        )}
                        {r.duplicated && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                            <AlertTriangle className="w-3 h-3" /> Duplicado con tren
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

      {/* Auditoría de gastos: justificación + desvío vs estimado */}
      {(() => {
        const DEVIATION_THRESHOLD = 0.20; // ±20%
        const auditRows = activities
          .filter(a => a.activity_type === "expense" && Number(a.cost_usd) > 0)
          .map(a => {
            const real = Number(a.cost_usd) || 0;
            const estimate = Number(a.cost_estimate_usd) || 0;
            const hasEstimate = estimate > 0;
            const diff = hasEstimate ? real - estimate : 0;
            const pct = hasEstimate ? diff / estimate : 0;
            const overBudget = hasEstimate && pct > DEVIATION_THRESHOLD;
            const underBudget = hasEstimate && pct < -DEVIATION_THRESHOLD;
            return {
              id: a.id,
              title: a.title,
              city: cityNameById.get(a.city_id) || "—",
              cityPos: cityPosById.get(a.city_id) ?? 999,
              justification: a.cost_justification || "",
              real,
              estimate,
              hasEstimate,
              diff,
              pct,
              overBudget,
              underBudget,
              missingJustification: !a.cost_justification,
              breakdown: Array.isArray(a.cost_breakdown) ? a.cost_breakdown : [],
            };
          })
          .sort((x, y) => x.cityPos - y.cityPos || y.real - x.real);
        const flagged = auditRows.filter(r => r.overBudget || r.underBudget || r.missingJustification);
        const allClean = flagged.length === 0 && auditRows.length > 0;
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
                  <h3 className="font-bold text-foreground">Auditoría de gastos · justificación + desvío</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cada gasto debe traer su lógica (distancia, tipo de transporte, tarifa) y un estimado.
                    Se marca en rojo si el costo real se desvía más de ±{Math.round(DEVIATION_THRESHOLD * 100)}% del estimado.
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Items a revisar</p>
                <p className={`font-black text-lg ${flagged.length === 0 ? "text-emerald-600" : "text-amber-600"}`}>
                  {flagged.length} / {auditRows.length}
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold">Gasto</th>
                    <th className="text-left px-5 py-3 font-semibold hidden lg:table-cell">Justificación</th>
                    <th className="text-right px-5 py-3 font-semibold hidden sm:table-cell">Estimado</th>
                    <th className="text-right px-5 py-3 font-semibold">Real</th>
                    <th className="text-right px-5 py-3 font-semibold">Δ</th>
                    <th className="text-center px-5 py-3 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {auditRows.map((r) => {
                    const flag = r.overBudget || r.underBudget || r.missingJustification;
                    const pctLabel = r.hasEstimate ? `${r.pct >= 0 ? "+" : ""}${Math.round(r.pct * 100)}%` : "—";
                    const hasBreakdown = r.breakdown.length > 0;
                    const isExpanded = expandedAuditRows.has(r.id);
                    const breakdownSum = r.breakdown.reduce((s, b) => s + (Number(b.amount) || 0), 0);
                    const breakdownMismatch = hasBreakdown && Math.abs(breakdownSum - r.real) > 1;
                    return (
                      <Fragment key={r.id}>
                      <tr className={`border-t border-border ${flag ? "bg-amber-50/40" : ""} ${hasBreakdown ? "cursor-pointer hover:bg-muted/40" : ""}`} onClick={hasBreakdown ? () => toggleAuditRow(r.id) : undefined}>
                        <td className="px-5 py-3 align-top">
                          <div className="flex items-start gap-2">
                            {hasBreakdown ? (
                              isExpanded
                                ? <ChevronDown className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                                : <ChevronRight className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                            ) : (
                              <span className="w-4 h-4 shrink-0" />
                            )}
                            <div>
                              <p className="text-foreground font-medium">
                                {r.title}
                                {hasBreakdown && (
                                  <span className="ml-2 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-200">
                                    {r.breakdown.length} ítems
                                  </span>
                                )}
                              </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{r.city}</p>
                          {r.justification && (
                            <p className="text-[11px] text-muted-foreground mt-1 lg:hidden italic">{r.justification}</p>
                          )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-muted-foreground hidden lg:table-cell text-xs max-w-md">
                          {r.justification || <span className="italic text-amber-700">Sin justificación documentada</span>}
                        </td>
                        <td className="px-5 py-3 text-right text-muted-foreground hidden sm:table-cell">
                          {r.hasEstimate ? fmt(r.estimate) : <span className="italic text-muted-foreground/60">—</span>}
                        </td>
                        <td className="px-5 py-3 text-right text-foreground font-semibold">{fmt(r.real)}</td>
                        <td className={`px-5 py-3 text-right font-bold text-xs ${
                          !r.hasEstimate ? "text-muted-foreground" :
                          r.overBudget ? "text-rose-600" :
                          r.underBudget ? "text-emerald-600" :
                          "text-muted-foreground"
                        }`}>
                          {pctLabel}
                        </td>
                        <td className="px-5 py-3 text-center">
                          {r.missingJustification ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                              <AlertTriangle className="w-3 h-3" /> Sin lógica
                            </span>
                          ) : r.overBudget ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                              <AlertTriangle className="w-3 h-3" /> Sobrecosto
                            </span>
                          ) : r.underBudget ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                              <TrendingDown className="w-3 h-3" /> Ahorro
                            </span>
                          ) : !r.hasEstimate ? (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                              Sin estimado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> OK
                            </span>
                          )}
                        </td>
                      </tr>
                      {hasBreakdown && isExpanded && (
                        <tr className="bg-muted/20 border-t border-border">
                          <td colSpan={6} className="px-5 py-4">
                            <div className="ml-6 space-y-2">
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Desglose detallado</p>
                              <div className="rounded-lg border border-border bg-background overflow-hidden">
                                {r.breakdown.map((b, i) => (
                                  <div key={i} className="px-4 py-3 border-b border-border last:border-b-0 flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-foreground">{b.label}</p>
                                      {b.note && <p className="text-xs text-muted-foreground mt-1 italic">{b.note}</p>}
                                    </div>
                                    <p className="text-sm font-semibold text-rose-600 shrink-0 tabular-nums">{fmt(Number(b.amount) || 0)}</p>
                                  </div>
                                ))}
                                <div className={`px-4 py-2 flex items-center justify-between gap-4 ${breakdownMismatch ? "bg-amber-50" : "bg-muted/40"}`}>
                                  <p className="text-xs uppercase tracking-wider font-bold text-foreground">
                                    Suma desglose
                                    {breakdownMismatch && (
                                      <span className="ml-2 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                                        ≠ Total ({fmt(r.real)})
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-sm font-black text-foreground tabular-nums">{fmt(breakdownSum)}</p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 bg-muted/30 border-t border-border text-[11px] text-muted-foreground">
              Umbral configurado: ±{Math.round(DEVIATION_THRESHOLD * 100)}%. Vuelos y hoteles tienen tablas dedicadas arriba con sus propias validaciones.
            </div>
          </div>
        );
      })()}

      {/* Desglose de comisiones por categoría */}
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

const MiniStat = ({ label, value, accent }: { label: string; value: string; accent: "amber" | "blue" | "purple" | "emerald" | "rose" }) => {
  const accents = {
    amber: "text-amber-700",
    blue: "text-blue-700",
    purple: "text-purple-700",
    emerald: "text-emerald-700",
    rose: "text-rose-700",
  };
  return (
    <div className="px-4 py-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
      <p className={`text-base font-bold mt-1 ${accents[accent]}`}>{value}</p>
    </div>
  );
};

import { useMemo } from "react";
import { Plane, Hotel, Car, CheckCircle2, Clock, CircleDashed, User } from "lucide-react";
import type { City, Activity } from "./CityCard";

type Props = {
  cities: City[];
  activities: Activity[];
};

type StatusKind = "confirmed" | "tentative" | "projected" | "pending";

const normalizeStatus = (s: string | null | undefined): StatusKind => {
  const v = (s || "").toLowerCase();
  if (v === "confirmed" || v === "confirmado") return "confirmed";
  if (v === "tentative" || v === "tentativo") return "tentative";
  if (v === "projected" || v === "proyectado") return "projected";
  return "pending";
};

const STATUS_META: Record<StatusKind, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
  confirmed: { label: "Confirmado", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40", Icon: CheckCircle2 },
  tentative: { label: "Tentativo", cls: "bg-amber-500/15 text-amber-400 border-amber-500/40", Icon: Clock },
  projected: { label: "Proyectado", cls: "bg-sky-500/15 text-sky-400 border-sky-500/40", Icon: CircleDashed },
  pending:   { label: "Pendiente",  cls: "bg-muted text-muted-foreground border-border",      Icon: CircleDashed },
};

const StatusBadge = ({ status }: { status: StatusKind }) => {
  const m = STATUS_META[status];
  const Icon = m.Icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${m.cls}`}>
      <Icon className="w-3 h-3" /> {m.label}
    </span>
  );
};

const detectPerson = (text: string | null | undefined): "Jhon" | "Juan" | "Ambos" => {
  const t = (text || "").toLowerCase();
  const hasJhon = /\bjhon\b/.test(t);
  const hasJuan = /\bjuan\b/.test(t);
  if (hasJhon && !hasJuan) return "Jhon";
  if (hasJuan && !hasJhon) return "Juan";
  return "Ambos";
};

const PersonChip = ({ person }: { person: "Jhon" | "Juan" | "Ambos" }) => {
  const cls =
    person === "Jhon"
      ? "bg-primary/15 text-primary border-primary/40"
      : person === "Juan"
      ? "bg-violet-500/15 text-violet-300 border-violet-500/40"
      : "bg-foreground/10 text-foreground border-border";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${cls}`}>
      <User className="w-3 h-3" /> {person}
    </span>
  );
};

const FLAGS: Record<string, string> = {
  "México": "🇲🇽", "Mexico": "🇲🇽",
  "USA": "🇺🇸", "Estados Unidos": "🇺🇸",
  "Francia": "🇫🇷", "France": "🇫🇷",
  "Canadá": "🇨🇦", "Canada": "🇨🇦",
  "Venezuela": "🇻🇪",
};

const fmtDate = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  return `${d.getDate()} ${months[d.getMonth()]}`;
};

export const StatusBoard = ({ cities, activities }: Props) => {
  const sortedCities = useMemo(
    () => [...cities].sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()),
    [cities]
  );

  const totals = useMemo(() => {
    const flights = activities.filter((a) => a.activity_type === "flight");
    const vehicles = activities.filter((a) => a.activity_type === "transport" || a.activity_type === "car_rental");
    const count = (arr: Activity[] | City[], pick: (x: any) => StatusKind) => {
      const o = { confirmed: 0, tentative: 0, projected: 0, pending: 0 } as Record<StatusKind, number>;
      arr.forEach((x) => { o[pick(x)]++; });
      return o;
    };
    return {
      flights: count(flights, (a) => normalizeStatus(a.status)),
      hotels: count(cities, (c) => normalizeStatus(c.accommodation_status)),
      vehicles: count(vehicles, (a) => normalizeStatus(a.status)),
    };
  }, [cities, activities]);

  return (
    <div className="space-y-4">
      {/* Resumen global */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SummaryCard title="Vuelos" icon={Plane} counts={totals.flights} />
        <SummaryCard title="Hoteles" icon={Hotel} counts={totals.hotels} />
        <SummaryCard title="Vehículos" icon={Car} counts={totals.vehicles} />
      </div>

      {/* Por ciudad */}
      <div className="space-y-3">
        {sortedCities.map((city) => {
          const flag = (city.country && FLAGS[city.country]) || "📍";
          const cityFlights = activities.filter((a) => a.city_id === city.id && a.activity_type === "flight");
          const cityVehicles = activities.filter((a) => a.city_id === city.id && (a.activity_type === "transport" || a.activity_type === "car_rental"));
          const hotelStatus = normalizeStatus(city.accommodation_status);
          const hotelPerson = detectPerson(`${city.accommodation_name || ""} ${city.accommodation_notes || ""}`);

          return (
            <div key={city.id} className="bg-card border border-border rounded-2xl p-3 sm:p-4 shadow-[var(--shadow-soft)]">
              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-border">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg">{flag}</span>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold truncate">{city.city}</h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {fmtDate(city.start_date)} → {fmtDate(city.end_date)} · {city.nights ?? 0} noches
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Hotel */}
                <Section title="Hotel" icon={Hotel}>
                  <Row
                    title={city.accommodation_name || "Por definir"}
                    subtitle={city.hotel_cost_usd != null ? `$${Math.round(Number(city.hotel_cost_usd)).toLocaleString("en-US")}` : "—"}
                    status={hotelStatus}
                    person={hotelPerson}
                  />
                </Section>

                {/* Vuelos */}
                <Section title="Vuelos" icon={Plane}>
                  {cityFlights.length === 0 ? (
                    <Empty />
                  ) : (
                    cityFlights.map((f) => (
                      <Row
                        key={f.id}
                        title={f.title}
                        subtitle={[f.airline, f.flight_number].filter(Boolean).join(" · ") || (f.cost_usd != null ? `$${Math.round(Number(f.cost_usd)).toLocaleString("en-US")}` : "")}
                        status={normalizeStatus(f.status)}
                        person={detectPerson(`${f.title} ${f.description || ""}`)}
                      />
                    ))
                  )}
                </Section>

                {/* Vehículos */}
                <Section title="Vehículos" icon={Car}>
                  {cityVehicles.length === 0 ? (
                    <Empty hint="Sin renta" />
                  ) : (
                    cityVehicles.map((v) => (
                      <Row
                        key={v.id}
                        title={v.title}
                        subtitle={v.cost_usd != null ? `$${Math.round(Number(v.cost_usd)).toLocaleString("en-US")}` : ""}
                        status={normalizeStatus(v.status)}
                        person={detectPerson(`${v.title} ${v.description || ""}`)}
                      />
                    ))
                  )}
                </Section>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SummaryCard = ({ title, icon: Icon, counts }: { title: string; icon: typeof Plane; counts: Record<StatusKind, number> }) => (
  <div className="bg-card border border-border rounded-2xl p-3 sm:p-4 shadow-[var(--shadow-soft)]">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-primary" />
      <h3 className="text-sm font-bold">{title}</h3>
    </div>
    <div className="flex flex-wrap gap-1.5">
      {(["confirmed","tentative","projected","pending"] as StatusKind[]).map((k) => (
        counts[k] > 0 && (
          <span key={k} className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-semibold ${STATUS_META[k].cls}`}>
            {counts[k]} {STATUS_META[k].label}
          </span>
        )
      ))}
      {Object.values(counts).every((n) => n === 0) && <span className="text-xs text-muted-foreground">—</span>}
    </div>
  </div>
);

const Section = ({ title, icon: Icon, children }: { title: string; icon: typeof Plane; children: React.ReactNode }) => (
  <div className="bg-muted/30 border border-border rounded-xl p-2.5">
    <div className="flex items-center gap-1.5 mb-2 text-muted-foreground">
      <Icon className="w-3.5 h-3.5" />
      <span className="text-[10px] uppercase tracking-wider font-semibold">{title}</span>
    </div>
    <div className="space-y-1.5">{children}</div>
  </div>
);

const Row = ({ title, subtitle, status, person }: { title: string; subtitle?: string; status: StatusKind; person: "Jhon" | "Juan" | "Ambos" }) => (
  <div className="bg-background border border-border rounded-lg p-2">
    <p className="text-xs font-semibold text-foreground leading-tight line-clamp-2">{title}</p>
    {subtitle && <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{subtitle}</p>}
    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
      <StatusBadge status={status} />
      <PersonChip person={person} />
    </div>
  </div>
);

const Empty = ({ hint = "—" }: { hint?: string }) => (
  <p className="text-[11px] text-muted-foreground italic px-1">{hint}</p>
);

export default StatusBoard;
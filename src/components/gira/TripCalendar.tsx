import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plane, Trophy, Hotel, MapPin, Utensils, Calendar as CalIcon, AlertTriangle, ChevronDown, Moon, Copy, Check as CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { City, Activity } from "./CityCard";

interface Props {
  cities: City[];
  activities: Activity[];
}

type CalEvent = {
  id: string;
  title: string;
  type: string;
  startMin: number; // minutes from 00:00
  endMin: number;
  city: string;
  date: string; // YYYY-MM-DD
  subtitle?: string;
  isAllDay?: boolean;
  isContinuation?: boolean;
  overlapColumn?: number;
  overlapCount?: number;
};

const HOUR_HEIGHT = 48; // px per hour
const START_HOUR = 6;
const END_HOUR = 24;
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR);

const TYPE_STYLES: Record<string, { bg: string; border: string; text: string; icon: any; label: string }> = {
  flight:    { bg: "bg-sky-500/15",    border: "border-sky-500/40",    text: "text-sky-700 dark:text-sky-300",       icon: Plane,    label: "Vuelo" },
  match:     { bg: "bg-emerald-500/15",border: "border-emerald-500/40",text: "text-emerald-700 dark:text-emerald-300",icon: Trophy,   label: "Partido" },
  hotel:     { bg: "bg-violet-500/15", border: "border-violet-500/40", text: "text-violet-700 dark:text-violet-300", icon: Hotel,    label: "Hotel" },
  meal:      { bg: "bg-amber-500/15",  border: "border-amber-500/40",  text: "text-amber-700 dark:text-amber-300",   icon: Utensils, label: "Comida" },
  food:      { bg: "bg-amber-500/15",  border: "border-amber-500/40",  text: "text-amber-700 dark:text-amber-300",   icon: Utensils, label: "Comida" },
  activity:  { bg: "bg-rose-500/15",   border: "border-rose-500/40",   text: "text-rose-700 dark:text-rose-300",     icon: MapPin,   label: "Actividad" },
  other:     { bg: "bg-slate-500/15",  border: "border-slate-500/40",  text: "text-slate-700 dark:text-slate-300",   icon: MapPin,   label: "Otro" },
};

const styleFor = (t: string) => TYPE_STYLES[t] ?? TYPE_STYLES.other;

const parseTimeToMin = (t?: string | null): number | null => {
  if (!t) return null;
  const m = t.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return null;
  return parseInt(m[1]) * 60 + parseInt(m[2]);
};

const minToLabel = (min: number) => {
  const h = Math.floor(min / 60).toString().padStart(2, "0");
  const m = (min % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

const toISO = (d: Date) => {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const fromISO = (iso: string) => new Date(iso + "T00:00:00");

const MONTHS_FULL = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAYS_SHORT = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

export const TripCalendar = ({ cities, activities }: Props) => {
  const [overlapsOpen, setOverlapsOpen] = useState(true);
  const [lateArrivalOpen, setLateArrivalOpen] = useState(true);
  const [copiedCityId, setCopiedCityId] = useState<string | null>(null);
  // Earliest start
  const earliest = useMemo(() => {
    if (!cities.length) return new Date();
    return cities.map(c => fromISO(c.start_date)).sort((a, b) => a.getTime() - b.getTime())[0];
  }, [cities]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [weekStart, setWeekStart] = useState<Date>(() => new Date());

  // initialize once to earliest week monday
  useMemo(() => {
    const d = new Date(earliest);
    const dow = d.getDay();
    const offset = dow === 0 ? -6 : 1 - dow;
    d.setDate(d.getDate() + offset);
    setWeekStart(d);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [earliest.getTime()]);

  // On mobile align to single day = earliest
  useEffect(() => {
    if (isMobile) setWeekStart(new Date(earliest));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  const numDays = isMobile ? 1 : 7;
  const days = useMemo(() => Array.from({ length: numDays }, (_, i) => addDays(weekStart, i)), [weekStart, numDays]);

  // Build events per day
  const cityById = useMemo(() => {
    const m = new Map<string, City>();
    cities.forEach(c => m.set(c.id, c));
    return m;
  }, [cities]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalEvent[]> = {};

    // Hotels as all-day spanning each night
    cities.forEach(c => {
      if (!c.accommodation_name) return;
      const start = fromISO(c.start_date);
      const end = fromISO(c.end_date);
      let cur = new Date(start);
      while (cur < end) {
        const iso = toISO(cur);
        (map[iso] ||= []).push({
          id: `hotel-${c.id}-${iso}`,
          title: c.accommodation_name,
          type: "hotel",
          startMin: 0,
          endMin: 0,
          city: c.city,
          date: iso,
          subtitle: c.city,
          isAllDay: true,
        });
        cur = addDays(cur, 1);
      }
    });

    activities.forEach(a => {
      const city = cityById.get(a.city_id);
      const date = a.activity_date || (city ? city.start_date : null);
      if (!date) return;

      const dep = parseTimeToMin(a.departure_time);
      const arr = parseTimeToMin(a.arrival_time);
      const at = parseTimeToMin(a.activity_time);

      let startMin = dep ?? at ?? null;
      let endMin: number | null = null;
      let overnight = false;

      if (a.activity_type === "flight" && dep != null && arr != null) {
        if (arr >= dep) {
          endMin = arr;
        } else {
          endMin = arr + 24 * 60; // crosses midnight
          overnight = true;
        }
      } else if (startMin != null) {
        endMin = startMin + (a.activity_type === "match" ? 120 : 60);
      }

      const isAllDay = startMin == null;
      if (startMin == null) startMin = 0;
      if (endMin == null) endMin = 0;

      if (overnight && endMin > 24 * 60) {
        // Day 1: from departure to end of day
        (map[date] ||= []).push({
          id: a.id,
          title: a.title,
          type: a.activity_type,
          startMin,
          endMin: 24 * 60 - 1,
          city: city?.city ?? "",
          date,
          subtitle: a.location || a.airline || undefined,
          isAllDay: false,
        });
        // Day 2: from 00:00 to actual arrival
        const nextDay = toISO(addDays(fromISO(date), 1));
        (map[nextDay] ||= []).push({
          id: `${a.id}-cont`,
          title: a.title,
          type: a.activity_type,
          startMin: 0,
          endMin: endMin - 24 * 60,
          city: city?.city ?? "",
          date: nextDay,
          subtitle: a.location || a.airline || undefined,
          isAllDay: false,
          isContinuation: true,
        });
      } else {
        (map[date] ||= []).push({
          id: a.id,
          title: a.title,
          type: a.activity_type,
          startMin,
          endMin: Math.min(endMin, 24 * 60 - 1),
          city: city?.city ?? "",
          date,
          subtitle: a.location || a.airline || undefined,
          isAllDay,
        });
      }
    });

    Object.values(map).forEach(arr => {
      arr.sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);

      const timedEvents = arr.filter(e => !e.isAllDay);
      const active: CalEvent[] = [];

      timedEvents.forEach((event) => {
        for (let i = active.length - 1; i >= 0; i -= 1) {
          if (active[i].endMin <= event.startMin) active.splice(i, 1);
        }

        const usedColumns = new Set(active.map(e => e.overlapColumn ?? 0));
        let column = 0;
        while (usedColumns.has(column)) column += 1;

        event.overlapColumn = column;
        const groupSize = active.length + 1;
        event.overlapCount = groupSize;
        active.forEach(e => {
          e.overlapCount = Math.max(e.overlapCount ?? 1, groupSize);
        });
        active.push(event);
      });
    });
    return map;
  }, [activities, cities, cityById]);

  const goPrev = () => setWeekStart(addDays(weekStart, -numDays));
  const goNext = () => setWeekStart(addDays(weekStart, numDays));
  const goToday = () => {
    const d = new Date();
    if (!isMobile) {
      const dow = d.getDay();
      const offset = dow === 0 ? -6 : 1 - dow;
      d.setDate(d.getDate() + offset);
    }
    setWeekStart(d);
  };
  const goEarliest = () => {
    const d = new Date(earliest);
    if (!isMobile) {
      const dow = d.getDay();
      const offset = dow === 0 ? -6 : 1 - dow;
      d.setDate(d.getDate() + offset);
    }
    setWeekStart(d);
  };

  const lastDay = days[days.length - 1];
  const monthLabel = isMobile
    ? `${days[0].getDate()} ${MONTHS_FULL[days[0].getMonth()]} ${days[0].getFullYear()}`
    : `${MONTHS_FULL[days[0].getMonth()]} ${days[0].getFullYear()}${
        days[0].getMonth() !== lastDay.getMonth() ? ` – ${MONTHS_FULL[lastDay.getMonth()]}` : ""
      }`;

  const todayISO = toISO(new Date());
  const gridCols = isMobile ? "44px 1fr" : `60px repeat(${numDays}, minmax(0,1fr))`;

  // ===== Validación visual de superposiciones (en el rango visible) =====
  type OverlapGroup = {
    date: string;
    events: CalEvent[];
    hasContinuation: boolean;
  };
  const visibleOverlaps: OverlapGroup[] = useMemo(() => {
    const groups: OverlapGroup[] = [];
    days.forEach((d) => {
      const iso = toISO(d);
      const evs = (eventsByDate[iso] || []).filter(e => !e.isAllDay);
      // Build clusters of events that share overlap (overlapCount > 1)
      const seen = new Set<string>();
      evs.forEach((ev) => {
        if (seen.has(ev.id)) return;
        if ((ev.overlapCount ?? 1) <= 1) return;
        const cluster = evs.filter(o =>
          o.startMin < ev.endMin && o.endMin > ev.startMin
        );
        cluster.forEach(c => seen.add(c.id));
        if (cluster.length > 1) {
          groups.push({
            date: iso,
            events: cluster.sort((a, b) => a.startMin - b.startMin),
            hasContinuation: cluster.some(c => c.isContinuation),
          });
        }
      });
    });
    return groups;
  }, [days, eventsByDate]);

  // ===== Detección de hoteles con late arrival (llegada después de medianoche o muy temprano AM) =====
  type LateArrival = {
    cityId: string;
    cityName: string;
    accommodationName: string;
    checkInDate: string;
    arrivalDate: string;
    arrivalTimeLabel: string;
    flightTitle: string;
    flightNumber: string | null;
    reason: "post-midnight" | "early-am";
    message: string;
  };
  const lateArrivals: LateArrival[] = useMemo(() => {
    const out: LateArrival[] = [];
    cities.forEach(city => {
      if (!city.accommodation_name) return;
      // Vuelo que aterriza el día del check-in o la madrugada siguiente
      const checkInISO = city.start_date;
      const checkInDate = fromISO(checkInISO);
      const dayBeforeISO = toISO(addDays(checkInDate, -1));

      const inboundFlights = activities.filter(a =>
        a.activity_type === "flight" &&
        a.city_id === city.id &&
        a.activity_date &&
        (a.activity_date === checkInISO || a.activity_date === dayBeforeISO)
      );
      inboundFlights.forEach(f => {
        const dep = parseTimeToMin(f.departure_time);
        const arr = parseTimeToMin(f.arrival_time);
        if (dep == null || arr == null) return;

        // Caso 1: vuelo cruza medianoche → llegada de madrugada al día siguiente
        const crossesMidnight = arr < dep;
        const actualArrivalDate = crossesMidnight
          ? toISO(addDays(fromISO(f.activity_date!), 1))
          : f.activity_date!;

        const isPostMidnight = crossesMidnight && arr <= 6 * 60; // aterriza entre 00:00 y 06:00
        const isEarlyAm = !crossesMidnight && arr <= 7 * 60; // aterriza antes de 7 AM mismo día

        if (!isPostMidnight && !isEarlyAm) return;

        const reason: LateArrival["reason"] = isPostMidnight ? "post-midnight" : "early-am";
        const arrivalLabel = `${minToLabel(arr)} del ${actualArrivalDate}`;

        const message =
`Hello, I have reservation #[BOOKING_REF] under [GUEST_NAME] for check-in on ${checkInISO} at ${city.accommodation_name}.

I will be arriving on a guaranteed late arrival — my flight ${f.flight_number ? `(${f.flight_number}) ` : ""}lands at SFO/${city.city} airport at ${minToLabel(arr)} on ${actualArrivalDate}, so I expect to be at the hotel around ${minToLabel(Math.min(arr + 90, 23 * 60 + 59))}.

Please:
1. Hold the room as guaranteed late arrival — do NOT release it.
2. Have the room ready for early check-in upon arrival (around ${minToLabel(Math.min(arr + 90, 23 * 60 + 59))}).
3. Note that the first night (${checkInISO}) is fully paid even though physical arrival is after midnight.

Thank you!`;

        out.push({
          cityId: city.id,
          cityName: city.city,
          accommodationName: city.accommodation_name!,
          checkInDate: checkInISO,
          arrivalDate: actualArrivalDate,
          arrivalTimeLabel: arrivalLabel,
          flightTitle: f.title,
          flightNumber: f.flight_number,
          reason,
          message,
        });
      });
    });
    return out;
  }, [cities, activities]);

  const copyMessage = async (la: LateArrival) => {
    try {
      await navigator.clipboard.writeText(la.message);
      setCopiedCityId(la.cityId);
      toast.success(`Mensaje copiado para ${la.accommodationName}`);
      setTimeout(() => setCopiedCityId(null), 2500);
    } catch {
      toast.error("No se pudo copiar");
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-[var(--shadow-soft)] overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-1 sm:gap-2 order-1">
          <Button size="sm" variant="outline" onClick={goPrev} className="h-8 w-8 p-0"><ChevronLeft className="w-4 h-4" /></Button>
          <Button size="sm" variant="outline" onClick={goNext} className="h-8 w-8 p-0"><ChevronRight className="w-4 h-4" /></Button>
          <Button size="sm" variant="ghost" onClick={goToday} className="h-8 px-2 text-xs">Hoy</Button>
          <Button size="sm" variant="ghost" onClick={goEarliest} className="h-8 px-2 text-xs hidden sm:inline-flex"><CalIcon className="w-3.5 h-3.5 mr-1" /> Inicio</Button>
        </div>
        <h3 className="text-sm sm:text-lg font-bold capitalize order-2 sm:order-2 flex-1 text-center sm:flex-none sm:text-left">
          {monthLabel}
          <span className="ml-2 text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase tracking-wider">· hora local</span>
        </h3>
        <div className="hidden md:flex flex-wrap items-center gap-2 text-[11px] order-3">
          {Object.entries(TYPE_STYLES).filter(([k]) => !["food","other"].includes(k)).map(([k, s]) => {
            const Icon = s.icon;
            return (
              <span key={k} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${s.border} ${s.bg} ${s.text}`}>
                <Icon className="w-3 h-3" /> {s.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Banner de late arrivals */}
      {lateArrivals.length > 0 && (
        <div className="border-b border-sky-200 bg-sky-50 dark:bg-sky-950/30 dark:border-sky-900">
          <button
            type="button"
            onClick={() => setLateArrivalOpen(o => !o)}
            className="w-full flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 text-left hover:bg-sky-100/60 dark:hover:bg-sky-900/30 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Moon className="w-4 h-4 text-sky-600 dark:text-sky-400 flex-shrink-0" />
              <p className="text-xs sm:text-sm font-semibold text-sky-800 dark:text-sky-200 truncate">
                {lateArrivals.length} hotel{lateArrivals.length === 1 ? "" : "es"} con guaranteed late arrival
                <span className="hidden sm:inline font-normal text-sky-700 dark:text-sky-300"> · click para copiar el mensaje al hotel</span>
              </p>
            </div>
            <ChevronDown className={`w-4 h-4 text-sky-600 dark:text-sky-400 transition-transform ${lateArrivalOpen ? "rotate-180" : ""}`} />
          </button>
          {lateArrivalOpen && (
            <div className="px-3 sm:px-4 pb-3 space-y-2">
              {lateArrivals.map((la) => (
                <div key={`${la.cityId}-${la.checkInDate}`} className="bg-card border border-sky-200 dark:border-sky-900 rounded-lg p-3 text-xs">
                  <div className="flex items-start gap-2 mb-2 flex-wrap">
                    <Hotel className="w-4 h-4 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-foreground">{la.accommodationName} · {la.cityName}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Check-in: <span className="font-semibold text-foreground">{la.checkInDate}</span>
                        {" · "}
                        Llegada real: <span className="font-semibold text-foreground">{la.arrivalTimeLabel}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Vuelo: {la.flightTitle}{la.flightNumber ? ` · ${la.flightNumber}` : ""}
                      </p>
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border flex-shrink-0 ${
                      la.reason === "post-midnight"
                        ? "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/50 dark:text-violet-300 dark:border-violet-800"
                        : "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800"
                    }`}>
                      {la.reason === "post-midnight" ? "Post-medianoche" : "Madrugada AM"}
                    </span>
                  </div>
                  <details className="group">
                    <summary className="flex items-center justify-between gap-2 cursor-pointer list-none rounded-md bg-muted/50 hover:bg-muted px-2.5 py-1.5 transition-colors">
                      <span className="text-[11px] font-semibold text-foreground">Mensaje para el hotel (EN)</span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <ChevronDown className="w-3 h-3 group-open:rotate-180 transition-transform" />
                        Ver / copiar
                      </span>
                    </summary>
                    <div className="mt-2 relative">
                      <pre className="text-[11px] whitespace-pre-wrap font-mono bg-muted/30 border border-border rounded-md p-2.5 pr-12 leading-relaxed text-foreground">
{la.message}
                      </pre>
                      <Button
                        size="sm"
                        variant={copiedCityId === la.cityId ? "default" : "outline"}
                        onClick={() => copyMessage(la)}
                        className="absolute top-2 right-2 h-7 px-2"
                      >
                        {copiedCityId === la.cityId
                          ? <><CheckIcon className="w-3 h-3 mr-1" /> Copiado</>
                          : <><Copy className="w-3 h-3 mr-1" /> Copiar</>}
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      Reemplazá <code className="bg-muted px-1 rounded">[BOOKING_REF]</code> y <code className="bg-muted px-1 rounded">[GUEST_NAME]</code> antes de enviar.
                    </p>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Banner de validación de superposiciones */}
      {visibleOverlaps.length > 0 && (
        <div className="border-b border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900">
          <button
            type="button"
            onClick={() => setOverlapsOpen(o => !o)}
            className="w-full flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 text-left hover:bg-amber-100/60 dark:hover:bg-amber-900/30 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <p className="text-xs sm:text-sm font-semibold text-amber-800 dark:text-amber-200 truncate">
                {visibleOverlaps.length} superposición{visibleOverlaps.length === 1 ? "" : "es"} en el rango visible
                <span className="hidden sm:inline font-normal text-amber-700 dark:text-amber-300"> · resueltas en columnas paralelas</span>
              </p>
            </div>
            <ChevronDown className={`w-4 h-4 text-amber-600 dark:text-amber-400 transition-transform ${overlapsOpen ? "rotate-180" : ""}`} />
          </button>
          {overlapsOpen && (
            <div className="px-3 sm:px-4 pb-3 space-y-2">
              {visibleOverlaps.map((g, idx) => {
                const d = fromISO(g.date);
                const dateLabel = `${DAYS_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS_FULL[d.getMonth()].slice(0, 3).toLowerCase()}`;
                return (
                  <div key={`${g.date}-${idx}`} className="bg-card border border-amber-200 dark:border-amber-900 rounded-lg p-2.5 text-xs">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="font-bold text-foreground">{dateLabel}</span>
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        {g.events.length} eventos solapados
                      </span>
                      {g.hasContinuation && (
                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                          ↳ vuelo cruza medianoche
                        </span>
                      )}
                    </div>
                    <ul className="space-y-1">
                      {g.events.map(ev => {
                        const s = styleFor(ev.type);
                        const Icon = s.icon;
                        return (
                          <li key={ev.id} className="flex items-center gap-2">
                            <span className={`inline-flex items-center justify-center w-5 h-5 rounded ${s.bg} ${s.border} border flex-shrink-0`}>
                              <Icon className={`w-2.5 h-2.5 ${s.text}`} />
                            </span>
                            <span className="font-mono text-[10px] text-muted-foreground tabular-nums flex-shrink-0">
                              {minToLabel(ev.startMin)}–{minToLabel(ev.endMin)}
                            </span>
                            <span className="font-medium text-foreground truncate">
                              {ev.isContinuation && <span className="opacity-60 mr-1">↳</span>}
                              {ev.title}
                            </span>
                            <span className="ml-auto text-[10px] text-muted-foreground flex-shrink-0">
                              col {(ev.overlapColumn ?? 0) + 1}/{ev.overlapCount ?? 1}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Header: day columns */}
      <div className="grid border-b border-border" style={{ gridTemplateColumns: gridCols }}>
        <div className="border-r border-border bg-muted/20" />
        {days.map((d) => {
          const iso = toISO(d);
          const isToday = iso === todayISO;
          const allDayEvents = (eventsByDate[iso] || []).filter(e => e.isAllDay);
          return (
            <div key={iso} className="border-r border-border last:border-r-0 px-2 py-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{DAYS_SHORT[d.getDay()]}</span>
                <span className={`text-base font-bold ${isToday ? "text-primary" : "text-foreground"}`}>{d.getDate()}</span>
                {isToday && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-semibold">HOY</span>}
              </div>
              <div className="mt-1 space-y-1">
                {allDayEvents.map(ev => {
                  const s = styleFor(ev.type);
                  const Icon = s.icon;
                  return (
                    <div key={ev.id} className={`text-[10px] px-1.5 py-0.5 rounded border ${s.border} ${s.bg} ${s.text} truncate flex items-center gap-1`} title={ev.title}>
                      <Icon className="w-2.5 h-2.5 flex-shrink-0" />
                      <span className="truncate">{ev.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="overflow-auto max-h-[70vh]">
        <div className="grid relative" style={{ gridTemplateColumns: gridCols }}>
          {/* Hour labels */}
          <div className="border-r border-border bg-muted/10">
            {HOURS.map(h => (
              <div key={h} className="text-[10px] text-muted-foreground text-right pr-2 -mt-1.5" style={{ height: HOUR_HEIGHT }}>
                {h.toString().padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((d) => {
            const iso = toISO(d);
            const events = (eventsByDate[iso] || []).filter(e => !e.isAllDay);
            const colHeight = HOURS.length * HOUR_HEIGHT;
            return (
              <div key={iso} className="relative border-r border-border last:border-r-0" style={{ height: colHeight }}>
                {/* Hour grid lines */}
                {HOURS.map((h, i) => (
                  <div
                    key={h}
                    className={`absolute left-0 right-0 border-t ${i === 0 ? "border-transparent" : "border-border/50"}`}
                    style={{ top: i * HOUR_HEIGHT }}
                  />
                ))}

                {/* Events */}
                {events.map((ev) => {
                  const s = styleFor(ev.type);
                  const Icon = s.icon;
                  const visibleStart = Math.max(ev.startMin, START_HOUR * 60);
                  const visibleEnd = Math.min(ev.endMin, END_HOUR * 60);
                  const top = ((visibleStart - START_HOUR * 60) / 60) * HOUR_HEIGHT;
                  const heightRaw = ((Math.max(visibleEnd, visibleStart) - visibleStart) / 60) * HOUR_HEIGHT;
                  const height = Math.max(heightRaw, 26);
                  const safeTop = Math.max(top, 0);
                  const overlapCount = Math.max(ev.overlapCount ?? 1, 1);
                  const overlapColumn = ev.overlapColumn ?? 0;
                  const width = overlapCount > 1 ? `calc((100% - 8px) / ${overlapCount})` : "calc(100% - 8px)";
                  const left = overlapCount > 1 ? `calc(4px + (${overlapColumn} * ((100% - 8px) / ${overlapCount})))` : "4px";
                  return (
                    <div
                      key={ev.id}
                      className={`absolute rounded-md border ${s.border} ${s.bg} ${s.text} px-1.5 py-1 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-default ${ev.isContinuation ? "border-dashed opacity-90" : ""}`}
                      style={{ top: safeTop, height, left, width }}
                      title={`${ev.title}${ev.isContinuation ? " (continuación)" : ""}${ev.subtitle ? " • " + ev.subtitle : ""} (${minToLabel(ev.startMin)}${ev.endMin > ev.startMin ? `–${minToLabel(ev.endMin)}` : ""})`}
                    >
                      <div className="flex items-start gap-1">
                        <Icon className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold leading-tight truncate">
                            {ev.isContinuation && <span className="text-[8px] uppercase tracking-wider opacity-70 mr-1">↳ cont.</span>}
                            {ev.title}
                          </p>
                          {height > 32 && (
                            <p className="text-[9px] opacity-80 leading-tight truncate">
                              {minToLabel(ev.startMin)}{ev.endMin > ev.startMin ? `–${minToLabel(ev.endMin)}` : ""}
                              {ev.subtitle ? ` • ${ev.subtitle}` : ""}
                            </p>
                          )}
                          {height > 56 && ev.city && (
                            <p className="text-[9px] opacity-70 leading-tight truncate">📍 {ev.city}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

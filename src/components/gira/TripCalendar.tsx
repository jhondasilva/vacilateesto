import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plane, Trophy, Hotel, MapPin, Utensils, Calendar as CalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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

    Object.values(map).forEach(arr => arr.sort((a, b) => a.startMin - b.startMin));
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
                  const top = ((ev.startMin - START_HOUR * 60) / 60) * HOUR_HEIGHT;
                  const heightRaw = ((ev.endMin - ev.startMin) / 60) * HOUR_HEIGHT;
                  const height = Math.max(heightRaw, 26);
                  const safeTop = Math.max(top, 0);
                  return (
                    <div
                      key={ev.id}
                      className={`absolute left-1 right-1 rounded-md border ${s.border} ${s.bg} ${s.text} px-1.5 py-1 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-default ${ev.isContinuation ? "border-dashed opacity-90" : ""}`}
                      style={{ top: safeTop, height }}
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

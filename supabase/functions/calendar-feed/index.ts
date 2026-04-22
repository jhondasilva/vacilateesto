// Public ICS feed for "Mundial" calendar — auto-refreshed by Google Calendar via URL subscription.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const TZ_CITY: Record<string, string> = {
  "Ciudad de México": "America/Mexico_City",
  "New York": "America/New_York",
  "Austin": "America/Chicago",
  "Houston": "America/Chicago",
  "Cannes": "Europe/Paris",
  "Miami": "America/New_York",
  "San Francisco": "America/Los_Angeles",
  "Philadelphia": "America/New_York",
  "Boston": "America/New_York",
  "Dallas": "America/Chicago",
  "Atlanta": "America/New_York",
  "Caracas": "America/Caracas",
};

const EMOJI: Record<string, string> = {
  flight: "✈️", match: "⚽", meal: "🍽", food: "🍽",
  content: "🎙", expense: "🚕", other: "📍",
};

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\r?\n/g, "\\n");

const fold = (line: string) => {
  const enc = new TextEncoder();
  if (enc.encode(line).length <= 75) return line;
  const out: string[] = [];
  let rest = line;
  while (enc.encode(rest).length > 75) {
    let cut = 73;
    while (enc.encode(rest.slice(0, cut)).length > 73) cut--;
    out.push(rest.slice(0, cut));
    rest = " " + rest.slice(cut);
  }
  out.push(rest);
  return out.join("\r\n");
};

const pad = (n: number) => String(n).padStart(2, "0");
const dateOnly = (d: Date) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
const stamp = () => {
  const d = new Date();
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
};

const addDays = (iso: string, n: number) => {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return dateOnly(d);
};

const localDT = (isoDate: string, hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const [y, mo, d] = isoDate.split("-").map(Number);
  return `${y}${pad(mo)}${pad(d)}T${pad(h)}${pad(m)}00`;
};

const addMinutes = (dt: string, mins: number) => {
  const y = +dt.slice(0, 4), mo = +dt.slice(4, 6), d = +dt.slice(6, 8);
  const h = +dt.slice(9, 11), mi = +dt.slice(11, 13);
  const date = new Date(Date.UTC(y, mo - 1, d, h, mi));
  date.setUTCMinutes(date.getUTCMinutes() + mins);
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00`;
};

Deno.serve(async (_req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const [citiesRes, actsRes] = await Promise.all([
      supabase.from("trip_cities").select("*").order("position"),
      supabase.from("trip_activities").select("*").order("activity_date").order("activity_time"),
    ]);

    if (citiesRes.error) throw citiesRes.error;
    if (actsRes.error) throw actsRes.error;

    const cities = citiesRes.data ?? [];
    const acts = actsRes.data ?? [];
    const cityMap = new Map(cities.map((c: any) => [c.id, c]));

    const settingsRes = await supabase
      .from("calendar_settings")
      .select("name,color,description")
      .limit(1)
      .maybeSingle();
    const calName = settingsRes.data?.name ?? "Vacílate El Mundial";
    const calColor = settingsRes.data?.color ?? "#E91E63";
    const calDesc = settingsRes.data?.description ?? "Gira Vacílate El Mundial 2026 — Feed en vivo";

    const now = stamp();
    const lines: string[] = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Vacilate El Mundial//Gira 2026//ES",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      fold(`X-WR-CALNAME:${esc(calName)}`),
      fold(`X-WR-CALDESC:${esc(calDesc)}`),
      fold(`NAME:${esc(calName)}`),
      fold(`DESCRIPTION:${esc(calDesc)}`),
      `X-APPLE-CALENDAR-COLOR:${calColor}`,
      `COLOR:${calColor}`,
      "X-WR-TIMEZONE:America/New_York",
      "REFRESH-INTERVAL;VALUE=DURATION:PT6H",
      "X-PUBLISHED-TTL:PT6H",
    ];

    // Hotels
    for (const c of cities as any[]) {
      if (!c.accommodation_name) continue;
      const sd = c.start_date.replace(/-/g, "");
      let ed = c.end_date.replace(/-/g, "");
      if (ed <= sd) ed = addDays(c.start_date, 1);
      const summary = `🏨 ${c.accommodation_name} — ${c.city}`;
      let desc = `Hospedaje en ${c.city}, ${c.country ?? ""}`.trim();
      if (c.accommodation_address) desc += `\\n${c.accommodation_address}`;
      lines.push(
        "BEGIN:VEVENT",
        `UID:hotel-${c.id}@vacilateelmundial`,
        `DTSTAMP:${now}`,
        `DTSTART;VALUE=DATE:${sd}`,
        `DTEND;VALUE=DATE:${ed}`,
        fold(`SUMMARY:${esc(summary)}`),
        fold(`DESCRIPTION:${esc(desc)}`),
        fold(`LOCATION:${esc(c.accommodation_address ?? c.city)}`),
        "TRANSP:TRANSPARENT",
        "END:VEVENT",
      );
    }

    // Activities
    for (const a of acts as any[]) {
      if (!a.activity_date) continue;
      const cityRow: any = cityMap.get(a.city_id);
      const tz = TZ_CITY[cityRow?.city] ?? "America/New_York";
      const atype = a.activity_type ?? "other";
      const summary = `${EMOJI[atype] ?? "📍"} ${a.title ?? ""}`;
      const parts: string[] = [];
      if (a.description) parts.push(a.description);
      if (a.airline || a.flight_number) parts.push(`${a.airline ?? ""} ${a.flight_number ?? ""}`.trim());
      if (a.duration) parts.push(`Duración: ${a.duration}`);
      const description = parts.map(esc).join("\\n");

      const ev: string[] = ["BEGIN:VEVENT", `UID:act-${a.id}@vacilateelmundial`, `DTSTAMP:${now}`];

      if (atype === "flight" && a.departure_time) {
        const dep = localDT(a.activity_date, a.departure_time);
        let arr = localDT(a.activity_date, a.arrival_time ?? a.departure_time);
        if (arr <= dep) arr = addMinutes(arr, 24 * 60);
        ev.push(`DTSTART;TZID=${tz}:${dep}`, `DTEND;TZID=${tz}:${arr}`);
      } else if (a.activity_time) {
        const start = localDT(a.activity_date, a.activity_time);
        const end = addMinutes(start, atype === "match" ? 120 : 60);
        ev.push(`DTSTART;TZID=${tz}:${start}`, `DTEND;TZID=${tz}:${end}`);
      } else {
        const sd = a.activity_date.replace(/-/g, "");
        const ed = addDays(a.activity_date, 1);
        ev.push(`DTSTART;VALUE=DATE:${sd}`, `DTEND;VALUE=DATE:${ed}`);
      }

      ev.push(fold(`SUMMARY:${esc(summary)}`));
      if (description) ev.push(fold(`DESCRIPTION:${description}`));
      if (a.location) ev.push(fold(`LOCATION:${esc(a.location)}`));
      ev.push("END:VEVENT");
      lines.push(...ev);
    }

    lines.push("END:VCALENDAR");
    const body = lines.join("\r\n") + "\r\n";

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'inline; filename="mundial.ics"',
        "Cache-Control": "public, max-age=900",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("calendar-feed error:", err);
    return new Response(`ICS feed error: ${err instanceof Error ? err.message : String(err)}`, {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
});
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

// VTIMEZONE blocks — required so Apple Calendar / Outlook respect TZID and
// every event renders in the LOCAL time of its city, regardless of the
// viewer's device timezone.
const VTIMEZONE_BLOCKS: Record<string, string[]> = {
  "America/New_York": [
    "BEGIN:VTIMEZONE","TZID:America/New_York",
    "BEGIN:DAYLIGHT","TZOFFSETFROM:-0500","TZOFFSETTO:-0400","TZNAME:EDT","DTSTART:19700308T020000","RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU","END:DAYLIGHT",
    "BEGIN:STANDARD","TZOFFSETFROM:-0400","TZOFFSETTO:-0500","TZNAME:EST","DTSTART:19701101T020000","RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU","END:STANDARD",
    "END:VTIMEZONE",
  ],
  "America/Chicago": [
    "BEGIN:VTIMEZONE","TZID:America/Chicago",
    "BEGIN:DAYLIGHT","TZOFFSETFROM:-0600","TZOFFSETTO:-0500","TZNAME:CDT","DTSTART:19700308T020000","RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU","END:DAYLIGHT",
    "BEGIN:STANDARD","TZOFFSETFROM:-0500","TZOFFSETTO:-0600","TZNAME:CST","DTSTART:19701101T020000","RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU","END:STANDARD",
    "END:VTIMEZONE",
  ],
  "America/Los_Angeles": [
    "BEGIN:VTIMEZONE","TZID:America/Los_Angeles",
    "BEGIN:DAYLIGHT","TZOFFSETFROM:-0800","TZOFFSETTO:-0700","TZNAME:PDT","DTSTART:19700308T020000","RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU","END:DAYLIGHT",
    "BEGIN:STANDARD","TZOFFSETFROM:-0700","TZOFFSETTO:-0800","TZNAME:PST","DTSTART:19701101T020000","RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU","END:STANDARD",
    "END:VTIMEZONE",
  ],
  "America/Mexico_City": [
    "BEGIN:VTIMEZONE","TZID:America/Mexico_City",
    "BEGIN:STANDARD","TZOFFSETFROM:-0600","TZOFFSETTO:-0600","TZNAME:CST","DTSTART:19700101T000000","END:STANDARD",
    "END:VTIMEZONE",
  ],
  "America/Caracas": [
    "BEGIN:VTIMEZONE","TZID:America/Caracas",
    "BEGIN:STANDARD","TZOFFSETFROM:-0400","TZOFFSETTO:-0400","TZNAME:VET","DTSTART:19700101T000000","END:STANDARD",
    "END:VTIMEZONE",
  ],
  "Europe/Paris": [
    "BEGIN:VTIMEZONE","TZID:Europe/Paris",
    "BEGIN:DAYLIGHT","TZOFFSETFROM:+0100","TZOFFSETTO:+0200","TZNAME:CEST","DTSTART:19700329T020000","RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU","END:DAYLIGHT",
    "BEGIN:STANDARD","TZOFFSETFROM:+0200","TZOFFSETTO:+0100","TZNAME:CET","DTSTART:19701025T030000","RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU","END:STANDARD",
    "END:VTIMEZONE",
  ],
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

    // Sort cities chronologically to infer the destination of a flight as
    // the next city in the itinerary after the flight's origin city.
    const orderedCities = [...cities].sort((a: any, b: any) =>
      (a.start_date ?? "").localeCompare(b.start_date ?? "") || (a.position ?? 0) - (b.position ?? 0)
    );
    const cityOrderIndex = new Map<string, number>(
      orderedCities.map((c: any, i: number) => [c.id, i])
    );

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

    // Inject every VTIMEZONE used by the trip so clients render local times correctly.
    const usedTzs = new Set<string>(["America/New_York"]);
    for (const c of cities as any[]) {
      const tz = TZ_CITY[c.city];
      if (tz) usedTzs.add(tz);
    }
    for (const tz of usedTzs) {
      const block = VTIMEZONE_BLOCKS[tz];
      if (block) lines.push(...block);
    }

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
      const originTz = TZ_CITY[cityRow?.city] ?? "America/New_York";
      const atype = a.activity_type ?? "other";
      const summary = `${EMOJI[atype] ?? "📍"} ${a.title ?? ""}`;
      const parts: string[] = [];
      if (a.description) parts.push(a.description);
      if (a.airline || a.flight_number) parts.push(`${a.airline ?? ""} ${a.flight_number ?? ""}`.trim());
      if (a.duration) parts.push(`Duración: ${a.duration}`);
      const description = parts.map(esc).join("\\n");

      const ev: string[] = ["BEGIN:VEVENT", `UID:act-${a.id}@vacilateelmundial`, `DTSTAMP:${now}`];

      if (atype === "flight" && a.departure_time) {
        // For flights, departure uses origin city TZ and arrival uses destination
        // city TZ — so each leg displays in true local time on every device.
        let destTz = originTz;
        const idx = cityOrderIndex.get(a.city_id);
        if (typeof idx === "number" && idx + 1 < orderedCities.length) {
          const nextCity: any = orderedCities[idx + 1];
          destTz = TZ_CITY[nextCity?.city] ?? originTz;
        }
        // Allow explicit override via metadata.destination_city (e.g. "Cannes")
        const metaDest = (a.metadata as any)?.destination_city;
        if (metaDest && TZ_CITY[metaDest]) destTz = TZ_CITY[metaDest];

        const dep = localDT(a.activity_date, a.departure_time);
        let arr = localDT(a.activity_date, a.arrival_time ?? a.departure_time);
        // Crossing midnight LOCALLY at destination is harder to detect across TZs;
        // approximate by checking if arrival HHMM < departure HHMM in the same date.
        if (arr <= dep) arr = addMinutes(arr, 24 * 60);
        ev.push(`DTSTART;TZID=${originTz}:${dep}`, `DTEND;TZID=${destTz}:${arr}`);
      } else if (a.activity_time) {
        const start = localDT(a.activity_date, a.activity_time);
        const end = addMinutes(start, atype === "match" ? 120 : 60);
        ev.push(`DTSTART;TZID=${originTz}:${start}`, `DTEND;TZID=${originTz}:${end}`);
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
import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, ZoomIn } from "lucide-react";

export type MapStop = {
  n: number;
  city: string;
  country: "MX" | "US" | "FR" | "VE";
  date: string;
  lat: number;
  lng: number;
};

const STOPS: MapStop[] = [
  { n: 1, city: "Ciudad de México", country: "MX", date: "9 jun", lat: 19.4326, lng: -99.1332 },
  { n: 2, city: "New York", country: "US", date: "12 jun", lat: 40.7128, lng: -74.006 },
  { n: 3, city: "Houston", country: "US", date: "14 jun", lat: 29.7604, lng: -95.3698 },
  { n: 4, city: "Cannes", country: "FR", date: "19 jun", lat: 43.5528, lng: 7.0174 },
  { n: 5, city: "Miami", country: "US", date: "26 jun", lat: 25.7617, lng: -80.1918 },
  { n: 6, city: "Caracas", country: "VE", date: "28 jun", lat: 10.4806, lng: -66.9036 },
  { n: 7, city: "Kansas City", country: "US", date: "2 jul", lat: 39.0997, lng: -94.5786 },
  { n: 8, city: "Dallas", country: "US", date: "5 jul", lat: 32.7767, lng: -96.797 },
  { n: 9, city: "Boston", country: "US", date: "7 jul", lat: 42.3601, lng: -71.0589 },
  { n: 10, city: "Kansas City", country: "US", date: "10 jul", lat: 39.0997, lng: -94.5786 },
  { n: 11, city: "Dallas", country: "US", date: "13 jul", lat: 32.7767, lng: -96.797 },
  { n: 12, city: "Atlanta", country: "US", date: "15 jul", lat: 33.749, lng: -84.388 },
  { n: 13, city: "New York", country: "US", date: "17 jul", lat: 40.7128, lng: -74.006 },
  { n: 14, city: "Caracas", country: "VE", date: "20 jul", lat: 10.4806, lng: -66.9036 },
];

const FLAGS: Record<MapStop["country"], string> = { MX: "🇲🇽", US: "🇺🇸", FR: "🇫🇷", VE: "🇻🇪" };

function makeIcon(n: number, accent: boolean) {
  const bg = accent ? "hsl(186, 84%, 50%)" : "hsl(338, 84%, 56%)";
  const fg = accent ? "#0a0a0a" : "#ffffff";
  const html = `<div style="width:34px;height:34px;border-radius:9999px;background:${bg};color:${fg};border:2px solid #0a0a0a;display:flex;align-items:center;justify-content:center;font-family:'Archivo Black',system-ui,sans-serif;font-weight:900;font-size:13px;box-shadow:3px 3px 0 #0a0a0a;">${n}</div>`;
  return L.divIcon({
    html,
    className: "vem-marker",
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -16],
  });
}

function FlyTo({ target }: { target: MapStop | null }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.flyTo([target.lat, target.lng], 9, { duration: 1.2 });
  }, [target, map]);
  return null;
}

export default function RouteMap() {
  const [active, setActive] = useState<MapStop | null>(null);

  const bounds = useMemo(
    () => L.latLngBounds(STOPS.map((s) => [s.lat, s.lng] as [number, number])),
    [],
  );
  const polyline = useMemo(
    () => STOPS.map((s) => [s.lat, s.lng] as [number, number]),
    [],
  );

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-4 md:gap-6">
      <div className="relative rounded-3xl border-2 border-foreground overflow-hidden sticker-shadow-lg-primary bg-background">
        <div className="absolute top-3 left-3 z-[400] bg-foreground text-background px-3 py-1.5 rounded-full border-2 border-foreground shadow-[3px_3px_0_hsl(var(--accent))]">
          <span className="font-display font-black text-[10px] uppercase tracking-widest">
            ★ Alternativa 1 · 14 paradas
          </span>
        </div>
        <MapContainer
          bounds={bounds}
          boundsOptions={{ padding: [40, 40] }}
          scrollWheelZoom={false}
          style={{ height: "min(70vh, 560px)", width: "100%", background: "hsl(var(--background))" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <Polyline
            positions={polyline}
            pathOptions={{
              color: "hsl(338, 84%, 56%)",
              weight: 3,
              opacity: 0.85,
              dashArray: "6 8",
            }}
          />
          {STOPS.map((s, i) => (
            <Marker
              key={`${s.n}-${s.city}`}
              position={[s.lat, s.lng]}
              icon={makeIcon(s.n, i % 2 === 0)}
              eventHandlers={{ click: () => setActive(s) }}
            >
              <Popup>
                <div style={{ fontFamily: "system-ui", fontSize: 12 }}>
                  <div style={{ fontWeight: 900, textTransform: "uppercase", fontSize: 14 }}>
                    {FLAGS[s.country]} {s.city}
                  </div>
                  <div style={{ opacity: 0.7 }}>Parada #{s.n} · {s.date}</div>
                </div>
              </Popup>
            </Marker>
          ))}
          <FlyTo target={active} />
        </MapContainer>
      </div>

      <div className="bg-background rounded-3xl border-2 border-foreground p-3 sticker-shadow-lg-accent max-h-[min(70vh,560px)] overflow-y-auto">
        <div className="sticky top-0 bg-background pb-2 mb-2 border-b-2 border-foreground/10 z-10">
          <div className="font-display font-black text-xs uppercase tracking-widest text-muted-foreground px-1">
            Haz clic en una parada
          </div>
        </div>
        <ul className="space-y-1.5">
          {STOPS.map((s, i) => {
            const isActive = active?.n === s.n;
            const accent = i % 2 === 0;
            return (
              <li key={`list-${s.n}`}>
                <button
                  onClick={() => setActive(s)}
                  className={`w-full flex items-center gap-3 text-left rounded-2xl border-2 border-foreground p-2.5 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 ${
                    isActive
                      ? "bg-foreground text-background shadow-[4px_4px_0_hsl(var(--accent))]"
                      : `bg-background text-foreground ${accent ? "shadow-[3px_3px_0_hsl(var(--accent))]" : "shadow-[3px_3px_0_hsl(var(--primary))]"}`
                  }`}
                >
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full border-2 border-foreground flex items-center justify-center font-display font-black text-xs ${
                      accent ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {s.n}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display font-black text-sm uppercase tracking-tight truncate">
                      {FLAGS[s.country]} {s.city}
                    </span>
                    <span
                      className={`block text-[11px] font-bold uppercase tracking-wider ${
                        isActive ? "text-background/70" : "text-muted-foreground"
                      }`}
                    >
                      {s.date}
                    </span>
                  </span>
                  <ZoomIn className="w-4 h-4 shrink-0 opacity-60" />
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 px-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <MapPin className="w-3 h-3" />
          Zoom: rueda en el mapa o tap en una parada
        </div>
      </div>
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar, Copy, Loader2, Save, Download, Globe } from "lucide-react";

const FEED_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calendar-feed`;
const GOOGLE_ADD_URL = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(FEED_URL)}`;
const GOOGLE_SETTINGS_URL = "https://calendar.google.com/calendar/u/0/r/settings/calendars";

const PRESETS = [
  "#E91E63", "#9C27B0", "#3F51B5", "#03A9F4",
  "#009688", "#4CAF50", "#FF9800", "#F44336",
];

type Settings = { id: string; name: string; color: string; description: string };

export const CalendarSettings = () => {
  const [data, setData] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      const { data, error } = await supabase
        .from("calendar_settings")
        .select("id,name,color,description")
        .limit(1)
        .maybeSingle();
      if (error) toast.error(error.message);
      setData(data ?? null);
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    const { error } = await supabase
      .from("calendar_settings")
      .update({ name: data.name, color: data.color, description: data.description })
      .eq("id", data.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Calendario actualizado. El feed se refrescará en Google en las próximas horas.");
  };

  const copyFeed = async () => {
    await navigator.clipboard.writeText(FEED_URL);
    toast.success("URL del feed copiada");
  };

  const installCalendar = () => {
    if (platform === "ios" || platform === "ipados" || platform === "macos" || platform === "windows-outlook") {
      // Apple/Outlook respetan webcal:// y abren su cliente nativo
      window.location.href = WEBCAL_URL;
      toast.success(`Abriendo ${platformInfo.client}…`);
    } else {
      // Android / Windows / Linux / otros → Google Calendar web (la app de Android no soporta suscripción directa)
      window.open(GOOGLE_ADD_URL, "_blank", "noopener,noreferrer");
      toast.success(`Abriendo ${platformInfo.client}…`);
    }
  };

  const downloadIcs = () => {
    const a = document.createElement("a");
    a.href = FEED_URL;
    a.download = "vacilate-el-mundial.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Descargando .ics");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
      </div>
    );
  }

  if (!data) return <p className="text-sm text-muted-foreground">No hay configuración aún.</p>;

  return (
    <div className="bg-gradient-to-br from-card to-muted/30 border border-border rounded-2xl p-4 sm:p-6 shadow-[var(--shadow-soft)] space-y-5">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        <h2 className="text-base sm:text-lg font-bold">Configuración del calendario público</h2>
      </div>

      {/* Install / subscribe block */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Download className="w-4 h-4 text-primary" /> Instalar en tu calendario
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1">
            Detectamos <span className="font-semibold text-foreground">{platformInfo.label}</span> →
            te suscribiremos vía <span className="font-semibold text-foreground">{platformInfo.client}</span>.
            Cualquier cambio en la gira se sincroniza solo.
          </p>
        </div>
        <Button onClick={installCalendar} className="w-full" size="lg">
          <Download className="w-4 h-4 mr-2" />
          Suscribirme con {platformInfo.client}
        </Button>
        <p className="text-[11px] text-muted-foreground leading-relaxed">{platformInfo.steps}</p>
        <div className="grid grid-cols-3 gap-2">
          <Button asChild variant="outline" size="sm" className="text-[11px]">
            <a href={WEBCAL_URL}>
              <Apple className="w-3.5 h-3.5 mr-1" /> Apple
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="text-[11px]">
            <a href={GOOGLE_ADD_URL} target="_blank" rel="noopener noreferrer">
              <Globe className="w-3.5 h-3.5 mr-1" /> Google
            </a>
          </Button>
          <Button onClick={downloadIcs} variant="outline" size="sm" className="text-[11px]">
            <Smartphone className="w-3.5 h-3.5 mr-1" /> .ics
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cal-name">Nombre del calendario</Label>
        <Input
          id="cal-name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          maxLength={80}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cal-desc">Descripción</Label>
        <Input
          id="cal-desc"
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          maxLength={200}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cal-color">Color</Label>
        <div className="flex items-center gap-3">
          <input
            id="cal-color"
            type="color"
            value={data.color}
            onChange={(e) => setData({ ...data, color: e.target.value.toUpperCase() })}
            className="w-12 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
          />
          <Input
            value={data.color}
            onChange={(e) => setData({ ...data, color: e.target.value.toUpperCase() })}
            className="font-mono text-sm uppercase max-w-[120px]"
            maxLength={7}
          />
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((c) => (
              <button
                key={c}
                onClick={() => setData({ ...data, color: c })}
                className="w-6 h-6 rounded-md border border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: c }}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Apple Calendar respeta el color. Google Calendar lo deja escoger manualmente al suscribirse.
        </p>
      </div>

      <Button onClick={save} disabled={saving} className="w-full sm:w-auto">
        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Guardar cambios
      </Button>

      <div className="border-t border-border pt-4 space-y-2">
        <Label>URL del feed (suscripción en vivo)</Label>
        <div className="flex items-center gap-2">
          <Input value={FEED_URL} readOnly className="font-mono text-xs" />
          <Button variant="outline" size="icon" onClick={copyFeed} aria-label="Copiar URL">
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Pégala en Google Calendar → "Otros calendarios" → "Desde URL". Google refresca cada 6-24h.
        </p>
      </div>
    </div>
  );
};
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  nextPosition: number;
  onCreated: () => void;
}

export const AddCityForm = ({ nextPosition, onCreated }: Props) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({
    city: "",
    country: "",
    start_date: "",
    end_date: "",
    nights: "",
    position: String(nextPosition),
    vibe: "",
    accommodation_notes: "",
  });

  const reset = () => {
    setDraft({ city: "", country: "", start_date: "", end_date: "", nights: "", position: String(nextPosition), vibe: "", accommodation_notes: "" });
  };

  const submit = async () => {
    if (!draft.city.trim() || !draft.start_date || !draft.end_date) {
      return toast.error("Falta ciudad o fechas");
    }
    setSaving(true);
    const pos = parseInt(draft.position) || nextPosition;
    const { error } = await supabase.from("trip_cities").insert({
      city: draft.city.trim(),
      country: draft.country.trim() || null,
      start_date: draft.start_date,
      end_date: draft.end_date,
      nights: draft.nights ? parseInt(draft.nights) : null,
      position: pos,
      accommodation_status: "pending",
      vibe: draft.vibe || null,
      accommodation_notes: draft.accommodation_notes || null,
    });
    setSaving(false);
    if (error) return toast.error("No se pudo crear la ciudad");
    toast.success(`${draft.city} añadida en posición ${pos}`);
    reset();
    setOpen(false);
    onCreated();
  };

  if (!open) {
    return (
      <Button
        variant="outline"
        onClick={() => { reset(); setOpen(true); }}
        className="w-full border-dashed border-primary/40 text-primary hover:bg-primary/5 hover:text-primary py-6"
      >
        <Plus className="w-4 h-4 mr-2" /> Añadir ciudad / parada
      </Button>
    );
  }

  return (
    <div className="bg-card border border-primary/30 rounded-2xl p-5 shadow-[var(--shadow-soft)] space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground">Nueva ciudad</h3>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}><X className="w-4 h-4" /></Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Input placeholder="Ciudad (ej: Cannes)" value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} />
        <Input placeholder="País (ej: Francia)" value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} />
        <div>
          <label className="text-[11px] text-muted-foreground uppercase tracking-wider">Inicio</label>
          <Input type="date" value={draft.start_date} onChange={(e) => setDraft({ ...draft, start_date: e.target.value })} />
        </div>
        <div>
          <label className="text-[11px] text-muted-foreground uppercase tracking-wider">Fin</label>
          <Input type="date" value={draft.end_date} onChange={(e) => setDraft({ ...draft, end_date: e.target.value })} />
        </div>
        <Input type="number" placeholder="Noches" value={draft.nights} onChange={(e) => setDraft({ ...draft, nights: e.target.value })} />
        <Input type="number" placeholder={`Posición en itinerario (sugerida: ${nextPosition})`} value={draft.position} onChange={(e) => setDraft({ ...draft, position: e.target.value })} />
      </div>
      <Input placeholder="Vibe / contexto (ej: Final del Mundial)" value={draft.vibe} onChange={(e) => setDraft({ ...draft, vibe: e.target.value })} />
      <Textarea placeholder="Notas (motivo de la parada, decisiones)" value={draft.accommodation_notes} onChange={(e) => setDraft({ ...draft, accommodation_notes: e.target.value })} />
      <p className="text-[11px] text-muted-foreground">
        💡 Tip: la posición ordena las ciudades. Si insertas en medio (ej: 7), edita las posteriores manualmente para reacomodar.
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
        <Button onClick={submit} disabled={saving}>{saving ? "Creando..." : "Crear ciudad"}</Button>
      </div>
    </div>
  );
};

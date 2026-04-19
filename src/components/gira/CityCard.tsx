import { useState } from "react";
import { ChevronDown, MapPin, Calendar, Hotel, Plane, Trophy, Utensils, Camera, MessageSquare, Plus, Trash2, Edit2, Check, X, Receipt, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export type City = {
  id: string;
  city: string;
  country: string | null;
  start_date: string;
  end_date: string;
  position: number;
  accommodation_name: string | null;
  accommodation_address: string | null;
  accommodation_status: string;
  accommodation_notes: string | null;
  vibe: string | null;
  nights: number | null;
  hotel_cost_usd: number | null;
  hotel_price_range: string | null;
};

export type Activity = {
  id: string;
  city_id: string;
  activity_type: string;
  title: string;
  description: string | null;
  activity_date: string | null;
  activity_time: string | null;
  location: string | null;
  status: string;
  position: number;
  cost_usd: number | null;
  airline: string | null;
  flight_number: string | null;
  departure_time: string | null;
  arrival_time: string | null;
  duration: string | null;
  cabin_class: string | null;
};

export type Comment = {
  id: string;
  user_id: string;
  author_name: string | null;
  author_email: string;
  content: string;
  created_at: string;
  city_id: string | null;
  activity_id: string | null;
};

const ACTIVITY_ICONS: Record<string, typeof Plane> = {
  flight: Plane,
  match: Trophy,
  food: Utensils,
  production: Camera,
  milestone: MapPin,
  expense: Receipt,
};

const ACTIVITY_LABELS: Record<string, string> = {
  flight: "Vuelo",
  match: "Partido",
  food: "Gastronomía",
  production: "Producción",
  milestone: "Hito",
  expense: "Gasto",
};

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  proposal: "bg-sky-100 text-sky-700 border-sky-200",
};

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirmado",
  pending: "Pendiente",
  proposal: "Propuesta",
};

const fmtUsd = (n: number | null | undefined) =>
  n == null ? null : `$${Math.round(Number(n)).toLocaleString("en-US")}`;

interface Props {
  city: City;
  activities: Activity[];
  comments: Comment[];
  currentUserId: string;
  currentUserName: string;
  currentUserEmail: string;
  onRefresh: () => void;
}

const formatRange = (start: string, end: string) => {
  const s = parseISO(start);
  const e = parseISO(end);
  if (start === end) return format(s, "d 'de' MMM", { locale: es });
  return `${format(s, "d", { locale: es })}–${format(e, "d 'de' MMM", { locale: es })}`;
};

export const CityCard = ({ city, activities, comments, currentUserId, currentUserName, currentUserEmail, onRefresh }: Props) => {
  const [expanded, setExpanded] = useState(city.position <= 2);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(city);
  const [newComment, setNewComment] = useState("");
  const [newActivity, setNewActivity] = useState({ type: "flight", title: "", date: "", time: "", location: "" });
  const [showActivityForm, setShowActivityForm] = useState(false);

  const cityComments = comments.filter((c) => c.city_id === city.id && !c.activity_id);

  const cityCostTotal =
    (Number(city.hotel_cost_usd) || 0) +
    activities.reduce((sum, a) => sum + (Number(a.cost_usd) || 0), 0);

  const saveCity = async () => {
    const { error } = await supabase
      .from("trip_cities")
      .update({
        accommodation_name: draft.accommodation_name,
        accommodation_address: draft.accommodation_address,
        accommodation_status: draft.accommodation_status,
        accommodation_notes: draft.accommodation_notes,
        vibe: draft.vibe,
        hotel_cost_usd: draft.hotel_cost_usd,
        nights: draft.nights,
        hotel_price_range: draft.hotel_price_range,
      })
      .eq("id", city.id);
    if (error) return toast.error("No se pudo guardar");
    toast.success("Guardado");
    setEditing(false);
    onRefresh();
  };

  const cycleStatus = async (activity: Activity) => {
    const next = activity.status === "pending" ? "proposal" : activity.status === "proposal" ? "confirmed" : "pending";
    const { error } = await supabase.from("trip_activities").update({ status: next }).eq("id", activity.id);
    if (error) return toast.error("Error");
    onRefresh();
  };

  const deleteActivity = async (id: string) => {
    const { error } = await supabase.from("trip_activities").delete().eq("id", id);
    if (error) return toast.error("Error");
    toast.success("Actividad eliminada");
    onRefresh();
  };

  const addActivity = async () => {
    if (!newActivity.title.trim()) return toast.error("Falta título");
    const { error } = await supabase.from("trip_activities").insert({
      city_id: city.id,
      activity_type: newActivity.type,
      title: newActivity.title,
      activity_date: newActivity.date || null,
      activity_time: newActivity.time || null,
      location: newActivity.location || null,
      status: "pending",
      position: activities.length,
    });
    if (error) return toast.error("Error");
    toast.success("Añadida");
    setNewActivity({ type: "flight", title: "", date: "", time: "", location: "" });
    setShowActivityForm(false);
    onRefresh();
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    const { error } = await supabase.from("trip_comments").insert({
      user_id: currentUserId,
      author_email: currentUserEmail,
      author_name: currentUserName,
      city_id: city.id,
      content: newComment.trim(),
    });
    if (error) return toast.error("Error");
    setNewComment("");
    onRefresh();
  };

  const deleteComment = async (id: string) => {
    const { error } = await supabase.from("trip_comments").delete().eq("id", id);
    if (error) return toast.error("Error");
    onRefresh();
  };

  // Sort activities: flights first, then matches, then expenses, then others
  const typeOrder: Record<string, number> = { flight: 0, match: 1, production: 2, food: 3, milestone: 4, expense: 5 };
  const sortedActivities = [...activities].sort(
    (a, b) => (typeOrder[a.activity_type] ?? 9) - (typeOrder[b.activity_type] ?? 9) || a.position - b.position
  );

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all shadow-[var(--shadow-soft)]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-center justify-between text-left group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center font-bold text-primary">
            {city.position}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold text-foreground">{city.city}</h3>
              {city.country && <span className="text-muted-foreground text-sm">• {city.country}</span>}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatRange(city.start_date, city.end_date)}</span>
              {city.nights ? <span className="flex items-center gap-1"><Moon className="w-3 h-3" />{city.nights} {city.nights === 1 ? "noche" : "noches"}</span> : null}
              {cityCostTotal > 0 && <span className="text-primary font-semibold">{fmtUsd(cityCostTotal)}</span>}
            </div>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-5 border-t border-border pt-5">
          {/* Alojamiento */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Hotel className="w-4 h-4 text-primary" /> Alojamiento
                {city.hotel_cost_usd ? <span className="text-primary text-xs">{fmtUsd(city.hotel_cost_usd)}</span> : null}
              </h4>
              {!editing ? (
                <Button size="sm" variant="ghost" onClick={() => setEditing(true)} className="h-7">
                  <Edit2 className="w-3 h-3 mr-1" /> Editar
                </Button>
              ) : (
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => { setDraft(city); setEditing(false); }} className="h-7">
                    <X className="w-3 h-3" />
                  </Button>
                  <Button size="sm" onClick={saveCity} className="h-7">
                    <Check className="w-3 h-3 mr-1" /> Guardar
                  </Button>
                </div>
              )}
            </div>
            {!editing ? (
              <div className="bg-muted/40 rounded-lg p-3 space-y-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="text-foreground font-medium">{city.accommodation_name || <span className="text-muted-foreground italic">Sin asignar</span>}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_STYLES[city.accommodation_status]}`}>
                    {STATUS_LABELS[city.accommodation_status]}
                  </span>
                </div>
                {city.hotel_price_range && (
                  <p className="text-muted-foreground text-xs">{city.hotel_price_range}{city.nights ? ` · ${city.nights} noches` : ""}</p>
                )}
                {city.accommodation_address && <p className="text-muted-foreground text-xs">{city.accommodation_address}</p>}
                {city.accommodation_notes && <p className="text-muted-foreground text-xs italic mt-1">{city.accommodation_notes}</p>}
              </div>
            ) : (
              <div className="space-y-2 bg-muted/40 rounded-lg p-3">
                <Input placeholder="Hotel / Airbnb" value={draft.accommodation_name ?? ""} onChange={(e) => setDraft({ ...draft, accommodation_name: e.target.value })} />
                <Input placeholder="Dirección" value={draft.accommodation_address ?? ""} onChange={(e) => setDraft({ ...draft, accommodation_address: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <Input type="number" placeholder="Costo USD" value={draft.hotel_cost_usd ?? ""} onChange={(e) => setDraft({ ...draft, hotel_cost_usd: e.target.value ? Number(e.target.value) : null })} />
                  <Input type="number" placeholder="Noches" value={draft.nights ?? ""} onChange={(e) => setDraft({ ...draft, nights: e.target.value ? Number(e.target.value) : null })} />
                </div>
                <Input placeholder="Rango precio (ej: $200-$250)" value={draft.hotel_price_range ?? ""} onChange={(e) => setDraft({ ...draft, hotel_price_range: e.target.value })} />
                <select value={draft.accommodation_status} onChange={(e) => setDraft({ ...draft, accommodation_status: e.target.value })} className="w-full bg-background border border-input text-foreground rounded-md px-3 py-2 text-sm">
                  <option value="pending">Pendiente</option>
                  <option value="proposal">Propuesta</option>
                  <option value="confirmed">Confirmado</option>
                </select>
                <Textarea placeholder="Notas (vibe, comentarios)" value={draft.accommodation_notes ?? ""} onChange={(e) => setDraft({ ...draft, accommodation_notes: e.target.value })} />
                <Input placeholder="Vibe / contexto general" value={draft.vibe ?? ""} onChange={(e) => setDraft({ ...draft, vibe: e.target.value })} />
              </div>
            )}
          </div>

          {/* Actividades */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-foreground">Vuelos, partidos & gastos</h4>
              <Button size="sm" variant="ghost" onClick={() => setShowActivityForm(!showActivityForm)} className="h-7 text-primary hover:text-primary">
                <Plus className="w-3 h-3 mr-1" /> Añadir
              </Button>
            </div>

            {showActivityForm && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <select value={newActivity.type} onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })} className="bg-background border border-input text-foreground rounded-md px-3 py-2 text-sm">
                    <option value="flight">Vuelo</option>
                    <option value="match">Partido</option>
                    <option value="food">Gastronomía</option>
                    <option value="production">Producción</option>
                    <option value="milestone">Hito</option>
                    <option value="expense">Gasto</option>
                  </select>
                  <Input type="time" value={newActivity.time} onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })} />
                </div>
                <Input placeholder="Título" value={newActivity.title} onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })} />
                <Input type="date" value={newActivity.date} onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })} />
                <Input placeholder="Lugar / detalles" value={newActivity.location} onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })} />
                <Button size="sm" onClick={addActivity} className="w-full">Crear</Button>
              </div>
            )}

            <div className="space-y-2">
              {sortedActivities.length === 0 && <p className="text-muted-foreground text-xs italic">Sin actividades aún</p>}
              {sortedActivities.map((act) => {
                const Icon = ACTIVITY_ICONS[act.activity_type] ?? MapPin;
                const isFlight = act.activity_type === "flight";
                return (
                  <div key={act.id} className="bg-muted/40 rounded-lg p-3 flex items-start gap-3 group/act">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="text-foreground font-medium text-sm">{act.title}</p>
                        <div className="flex items-center gap-2">
                          {act.cost_usd ? <span className="text-primary font-semibold text-xs">{fmtUsd(act.cost_usd)}</span> : null}
                          <button onClick={() => cycleStatus(act)} className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_STYLES[act.status]} hover:opacity-80`}>
                            {STATUS_LABELS[act.status]}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 flex-wrap">
                        <span>{ACTIVITY_LABELS[act.activity_type]}</span>
                        {act.activity_date && <span>• {format(parseISO(act.activity_date), "d MMM", { locale: es })}</span>}
                        {act.activity_time && <span>• {act.activity_time}</span>}
                        {act.location && <span className="truncate">• {act.location}</span>}
                      </div>
                      {isFlight && (act.airline || act.flight_number || act.departure_time) && (
                        <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-background border border-border rounded-md p-2">
                          {act.airline && <div><span className="text-muted-foreground">Aerolínea</span><br/><span className="text-foreground font-medium">{act.airline}</span></div>}
                          {act.flight_number && <div><span className="text-muted-foreground">Vuelo</span><br/><span className="text-foreground font-medium">{act.flight_number}</span></div>}
                          {act.departure_time && <div><span className="text-muted-foreground">Salida</span><br/><span className="text-foreground font-medium">{act.departure_time}</span></div>}
                          {act.arrival_time && <div><span className="text-muted-foreground">Llegada</span><br/><span className="text-foreground font-medium">{act.arrival_time}</span></div>}
                          {act.duration && <div><span className="text-muted-foreground">Duración</span><br/><span className="text-foreground font-medium">{act.duration}</span></div>}
                          {act.cabin_class && <div><span className="text-muted-foreground">Clase</span><br/><span className="text-foreground font-medium">{act.cabin_class}</span></div>}
                        </div>
                      )}
                      {act.description && <p className="text-muted-foreground text-xs italic mt-1">{act.description}</p>}
                    </div>
                    <button onClick={() => deleteActivity(act.id)} className="opacity-0 group-hover/act:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comentarios */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <MessageSquare className="w-4 h-4 text-primary" /> Comentarios {cityComments.length > 0 && <span className="text-muted-foreground">({cityComments.length})</span>}
            </h4>
            <div className="space-y-2 mb-3">
              {cityComments.map((c) => (
                <div key={c.id} className="bg-muted/40 rounded-lg p-3 group/c">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-primary">{c.author_name || c.author_email}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">{format(parseISO(c.created_at), "d MMM, HH:mm", { locale: es })}</span>
                      {c.user_id === currentUserId && (
                        <button onClick={() => deleteComment(c.id)} className="opacity-0 group-hover/c:opacity-100 text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-foreground/80 text-sm">{c.content}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Deja un comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addComment()}
              />
              <Button onClick={addComment} size="sm">Enviar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

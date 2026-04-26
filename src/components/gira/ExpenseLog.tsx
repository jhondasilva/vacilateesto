import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Receipt, ImageIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ExpenseRow {
  id: string;
  user_id: string;
  reporter_name: string | null;
  reporter_email: string;
  paid_by: string;
  payment_method: string;
  expense_date: string;
  category: string | null;
  description: string | null;
  merchant: string | null;
  amount_usd: number;
  currency: string;
  receipt_url: string | null;
  created_at: string;
}

const PAID_LABEL: Record<string, string> = { juan: "Juan", jhon: "Jhon", conjunto: "Conjunto" };
const PAID_COLOR: Record<string, string> = {
  juan: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
  jhon: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
  conjunto: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
};
const PAY_LABEL: Record<string, string> = {
  tarjeta_corp: "Tarjeta corp", tarjeta_personal: "Tarjeta personal",
  efectivo: "Efectivo", transferencia: "Transferencia", otro: "Otro",
};

interface Props { currentUserId: string; refreshKey?: number; }

export const ExpenseLog = ({ currentUserId, refreshKey = 0 }: Props) => {
  const [rows, setRows] = useState<ExpenseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "juan" | "jhon" | "conjunto">("all");
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("expense_reports")
      .select("*")
      .order("expense_date", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      toast.error("Error cargando gastos");
    } else {
      setRows((data as ExpenseRow[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load, refreshKey]);

  const filtered = useMemo(
    () => filter === "all" ? rows : rows.filter((r) => r.paid_by === filter),
    [rows, filter],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, ExpenseRow[]>();
    for (const r of filtered) {
      const list = map.get(r.expense_date) || [];
      list.push(r);
      map.set(r.expense_date, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const totals = useMemo(() => {
    const t = { juan: 0, jhon: 0, conjunto: 0, all: 0 };
    for (const r of rows) {
      const v = Number(r.amount_usd) || 0;
      t.all += v;
      if (r.paid_by === "juan") t.juan += v;
      else if (r.paid_by === "jhon") t.jhon += v;
      else t.conjunto += v;
    }
    return t;
  }, [rows]);

  const handleViewReceipt = async (path: string) => {
    if (signedUrls[path]) {
      window.open(signedUrls[path], "_blank");
      return;
    }
    const { data, error } = await supabase.storage.from("expense-receipts").createSignedUrl(path, 600);
    if (error || !data) {
      toast.error("No se pudo abrir el recibo");
      return;
    }
    setSignedUrls((s) => ({ ...s, [path]: data.signedUrl }));
    window.open(data.signedUrl, "_blank");
  };

  const handleDelete = async (row: ExpenseRow) => {
    if (row.user_id !== currentUserId) {
      toast.error("Solo el autor puede borrar su gasto");
      return;
    }
    if (!confirm("¿Eliminar este gasto?")) return;
    if (row.receipt_url) await supabase.storage.from("expense-receipts").remove([row.receipt_url]);
    const { error } = await supabase.from("expense_reports").delete().eq("id", row.id);
    if (error) toast.error("Error al eliminar");
    else { toast.success("Gasto eliminado"); void load(); }
  };

  const fmt = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

  if (loading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      {/* Totales */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <TotalCard label="Total" value={fmt(totals.all)} active={filter === "all"} onClick={() => setFilter("all")} />
        <TotalCard label="Juan" value={fmt(totals.juan)} active={filter === "juan"} onClick={() => setFilter("juan")} accent="blue" />
        <TotalCard label="Jhon" value={fmt(totals.jhon)} active={filter === "jhon"} onClick={() => setFilter("jhon")} accent="purple" />
        <TotalCard label="Conjunto" value={fmt(totals.conjunto)} active={filter === "conjunto"} onClick={() => setFilter("conjunto")} accent="amber" />
      </div>

      {grouped.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <Receipt className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Aún no hay gastos reportados.</p>
          <p className="text-xs text-muted-foreground mt-1">Tocá <strong>Reportar gasto</strong> abajo a la derecha.</p>
        </div>
      ) : (
        grouped.map(([date, items]) => {
          const dayTotal = items.reduce((s, r) => s + Number(r.amount_usd), 0);
          return (
            <div key={date} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b border-border">
                <p className="text-xs font-bold uppercase tracking-wider">{formatDay(date)}</p>
                <p className="text-xs font-bold text-primary">{fmt(dayTotal)}</p>
              </div>
              <div className="divide-y divide-border">
                {items.map((r) => (
                  <div key={r.id} className="px-4 py-3 flex items-start gap-3 hover:bg-muted/30">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${PAID_COLOR[r.paid_by]}`}>{PAID_LABEL[r.paid_by] || r.paid_by}</span>
                        <span className="text-[10px] text-muted-foreground">{PAY_LABEL[r.payment_method] || r.payment_method}</span>
                        {r.category && <span className="text-[10px] text-muted-foreground capitalize">· {r.category}</span>}
                      </div>
                      <p className="text-sm font-medium truncate">{r.merchant || r.description || "Sin descripción"}</p>
                      {r.merchant && r.description && r.description !== r.merchant && (
                        <p className="text-xs text-muted-foreground truncate">{r.description}</p>
                      )}
                      <p className="text-[10px] text-muted-foreground mt-0.5">por {r.reporter_name || r.reporter_email}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <p className="font-bold text-sm">{fmt(Number(r.amount_usd))}</p>
                      <div className="flex items-center gap-1">
                        {r.receipt_url && (
                          <button onClick={() => handleViewReceipt(r.receipt_url!)} className="p-1 text-muted-foreground hover:text-primary" aria-label="Ver recibo">
                            <ImageIcon className="w-4 h-4" />
                          </button>
                        )}
                        {r.user_id === currentUserId && (
                          <button onClick={() => handleDelete(r)} className="p-1 text-muted-foreground hover:text-destructive" aria-label="Eliminar">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

const TotalCard = ({ label, value, active, onClick, accent }: {
  label: string; value: string; active: boolean; onClick: () => void; accent?: "blue" | "purple" | "amber";
}) => {
  const accentMap = {
    blue: "data-[active=true]:border-blue-500 data-[active=true]:bg-blue-500/10",
    purple: "data-[active=true]:border-purple-500 data-[active=true]:bg-purple-500/10",
    amber: "data-[active=true]:border-amber-500 data-[active=true]:bg-amber-500/10",
  };
  return (
    <button
      onClick={onClick}
      data-active={active}
      className={`text-left bg-card border border-border rounded-xl p-3 transition-colors hover:border-primary/40 data-[active=true]:border-primary data-[active=true]:bg-primary/5 ${accent ? accentMap[accent] : ""}`}
    >
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
      <p className="text-lg font-bold mt-0.5">{value}</p>
    </button>
  );
};

const formatDay = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

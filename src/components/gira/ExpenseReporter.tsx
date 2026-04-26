import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Camera, Plus, Check, Sparkles, Trash2, Receipt } from "lucide-react";
import { toast } from "sonner";

type PaidBy = "juan" | "jhon" | "conjunto";
type PaymentMethod = "tarjeta_corp" | "tarjeta_personal" | "efectivo" | "transferencia" | "otro";

interface Props {
  userId: string;
  userEmail: string;
  userName: string;
  onCreated?: () => void;
}

interface Extracted {
  merchant?: string | null;
  expense_date?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  amount_usd?: number | null;
  category?: string | null;
  payment_method?: string | null;
  description?: string | null;
  confidence?: string | null;
}

export const ExpenseReporter = ({ userId, userEmail, userName, onCreated }: Props) => {
  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form
  const [paidBy, setPaidBy] = useState<PaidBy>(
    userEmail.toLowerCase().includes("juan") ? "juan" :
    userEmail.toLowerCase().includes("jhon") || userEmail.toLowerCase().includes("john") ? "jhon" :
    "conjunto"
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("tarjeta_corp");
  const [merchant, setMerchant] = useState("");
  const [description, setDescription] = useState("");
  const [amountUsd, setAmountUsd] = useState("");
  const [amountOriginal, setAmountOriginal] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState("comida");
  const [notes, setNotes] = useState("");
  const [aiExtracted, setAiExtracted] = useState<Extracted | null>(null);

  const reset = () => {
    setImageDataUrl(null);
    setImageFile(null);
    setMerchant("");
    setDescription("");
    setAmountUsd("");
    setAmountOriginal("");
    setCurrency("USD");
    setExpenseDate(new Date().toISOString().slice(0, 10));
    setCategory("comida");
    setNotes("");
    setAiExtracted(null);
  };

  const handlePickImage = () => fileRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error("La foto pesa más de 8MB. Tomá otra más liviana.");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setImageDataUrl(dataUrl);
      await analyzeWithAI(dataUrl, file.type);
    };
    reader.readAsDataURL(file);
  };

  const analyzeWithAI = async (dataUrl: string, mimeType: string) => {
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("extract-receipt", {
        body: { imageBase64: dataUrl, mimeType },
      });
      if (error) throw error;
      const extracted: Extracted = data?.data ?? {};
      setAiExtracted(extracted);
      // Pre-llenar campos
      if (extracted.merchant) setMerchant(extracted.merchant);
      if (extracted.description) setDescription(extracted.description);
      if (extracted.expense_date) setExpenseDate(extracted.expense_date);
      if (extracted.currency) setCurrency(extracted.currency);
      if (typeof extracted.amount_total === "number") setAmountOriginal(String(extracted.amount_total));
      if (typeof extracted.amount_usd === "number") setAmountUsd(String(extracted.amount_usd));
      else if (extracted.currency === "USD" && typeof extracted.amount_total === "number") {
        setAmountUsd(String(extracted.amount_total));
      }
      if (extracted.category) setCategory(extracted.category);
      if (extracted.payment_method) setPaymentMethod(extracted.payment_method as PaymentMethod);
      toast.success("Recibo analizado. Revisá y guardá.");
    } catch (err) {
      console.error(err);
      toast.error("No pude leer el recibo. Llená los campos a mano.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!amountUsd || Number(amountUsd) <= 0) {
      toast.error("Ingresá el monto en USD.");
      return;
    }
    setSubmitting(true);
    try {
      let receiptUrl: string | null = null;
      if (imageFile) {
        const ext = imageFile.name.split(".").pop() || "jpg";
        const path = `${userId}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("expense-receipts")
          .upload(path, imageFile, { upsert: false, contentType: imageFile.type });
        if (upErr) throw upErr;
        receiptUrl = path;
      }

      const { error } = await supabase.from("expense_reports").insert({
        user_id: userId,
        reporter_email: userEmail,
        reporter_name: userName,
        paid_by: paidBy,
        payment_method: paymentMethod,
        expense_date: expenseDate,
        category,
        description: description || merchant || "Sin descripción",
        merchant: merchant || null,
        amount_usd: Number(amountUsd),
        currency,
        amount_original: amountOriginal ? Number(amountOriginal) : null,
        receipt_url: receiptUrl,
        ai_extracted: aiExtracted as any,
        status: "submitted",
        notes: notes || null,
      });
      if (error) throw error;
      toast.success("Gasto registrado ✅");
      reset();
      setOpen(false);
      onCreated?.();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "No se pudo guardar el gasto.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="fixed bottom-5 right-5 z-50 h-14 w-14 sm:w-auto sm:h-12 sm:px-5 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2 font-bold"
          aria-label="Reportar gasto"
        >
          <Plus className="w-6 h-6 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Reportar gasto</span>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[92vh] overflow-y-auto rounded-t-2xl">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" /> Nuevo gasto
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-5 pt-4 pb-8">
          {/* Paso 1: foto */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">1. Foto del recibo</Label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />
            {imageDataUrl ? (
              <div className="relative">
                <img src={imageDataUrl} alt="Recibo" className="w-full max-h-64 object-contain rounded-lg border border-border bg-muted/30" />
                <button
                  onClick={() => { setImageDataUrl(null); setImageFile(null); setAiExtracted(null); }}
                  className="absolute top-2 right-2 bg-background/90 border border-border rounded-full p-1.5 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  aria-label="Quitar foto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {analyzing && (
                  <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center rounded-lg">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                      La IA está leyendo el recibo…
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handlePickImage}
                className="w-full border-2 border-dashed border-border rounded-xl p-6 hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground"
              >
                <Camera className="w-8 h-8" />
                <span className="text-sm font-medium">Tomar foto del recibo</span>
                <span className="text-[11px]">La IA llena los datos automáticamente</span>
              </button>
            )}
          </div>

          {/* Paso 2: Quién pagó */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">2. ¿Quién pagó?</Label>
            <Tabs value={paidBy} onValueChange={(v) => setPaidBy(v as PaidBy)}>
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="juan">Juan</TabsTrigger>
                <TabsTrigger value="jhon">Jhon</TabsTrigger>
                <TabsTrigger value="conjunto">Conjunto</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Paso 3: Forma de pago */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">3. Forma de pago</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {([
                { v: "tarjeta_corp", l: "Tarjeta corp" },
                { v: "tarjeta_personal", l: "Tarjeta personal" },
                { v: "efectivo", l: "Efectivo" },
                { v: "transferencia", l: "Transferencia" },
                { v: "otro", l: "Otro" },
              ] as const).map((o) => (
                <button
                  key={o.v}
                  onClick={() => setPaymentMethod(o.v)}
                  className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                    paymentMethod === o.v
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  {o.l}
                </button>
              ))}
            </div>
          </div>

          {/* Paso 4: Datos */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="merchant" className="text-xs">Comercio / lugar</Label>
              <Input id="merchant" value={merchant} onChange={(e) => setMerchant(e.target.value)} placeholder="Ej: Flanigan's, Uber, Marriott…" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="amountUsd" className="text-xs">Monto USD *</Label>
              <Input id="amountUsd" type="number" inputMode="decimal" step="0.01" value={amountUsd} onChange={(e) => setAmountUsd(e.target.value)} placeholder="0.00" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date" className="text-xs">Fecha</Label>
              <Input id="date" type="date" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="amountOrig" className="text-xs">Monto original</Label>
              <Input id="amountOrig" type="number" inputMode="decimal" step="0.01" value={amountOriginal} onChange={(e) => setAmountOriginal(e.target.value)} placeholder="opcional" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="currency" className="text-xs">Moneda</Label>
              <Input id="currency" value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} maxLength={3} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label className="text-xs">Categoría</Label>
              <div className="flex flex-wrap gap-1.5">
                {["comida", "transporte", "hospedaje", "produccion", "otros"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-medium border capitalize transition-colors ${
                      category === c ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="desc" className="text-xs">Descripción</Label>
              <Input id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Almuerzo en Miami con Jero…" />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="notes" className="text-xs">Notas (opcional)</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Aclaración o justificación si excede el estimado" />
            </div>
          </div>

          {aiExtracted && (
            <div className="text-[11px] text-muted-foreground bg-muted/40 rounded-lg p-2 border border-border">
              <Sparkles className="w-3 h-3 inline mr-1 text-primary" />
              Datos sugeridos por IA · confianza: <strong>{aiExtracted.confidence || "media"}</strong>. Revisá antes de guardar.
            </div>
          )}

          <Button onClick={handleSubmit} disabled={submitting || analyzing} className="w-full h-12 text-base font-bold">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
            Guardar gasto
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

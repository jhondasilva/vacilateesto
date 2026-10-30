import { useId } from "react";
import { cn } from "@/lib/utils";
import { CONSULTATION_PRESETS, presetKeyFor, rangeLabel, validateRange, type ConsultationRange } from "@/lib/consultationRange";

/** Desde/Hasta accesible (días America/Caracas, fin inclusivo) + atajos que actualizan el mismo estado. */
export const ConsultationRangeControls = ({
  value,
  onChange,
  presets = CONSULTATION_PRESETS,
  note,
}: {
  value: ConsultationRange;
  onChange: (r: ConsultationRange) => void;
  presets?: typeof CONSULTATION_PRESETS;
  note?: string;
}) => {
  const id = useId();
  const v = validateRange(value);
  const active = presetKeyFor(value);
  return (
    <fieldset className="mb-6 rounded-2xl border border-border bg-card p-4" aria-describedby={`${id}-status`}>
      <legend className="px-1 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Fechas de consulta</legend>
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs font-bold" htmlFor={`${id}-from`}>
          Desde
          <input id={`${id}-from`} type="date" value={value.from} aria-invalid={!v.ok}
            onChange={(e) => onChange({ ...value, from: e.target.value })}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm font-normal" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-bold" htmlFor={`${id}-to`}>
          Hasta (inclusive)
          <input id={`${id}-to`} type="date" value={value.to} aria-invalid={!v.ok}
            onChange={(e) => onChange({ ...value, to: e.target.value })}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm font-normal" />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Atajos de período">
        {presets.map((p) => (
          <button key={p.key} type="button" aria-pressed={active === p.key}
            onClick={() => onChange({ from: p.from, to: p.to })}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-bold border transition-colors",
              active === p.key ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground/40",
            )}>
            {p.label}
          </button>
        ))}
      </div>
      <p id={`${id}-status`} role="status" aria-live="polite"
        className={cn("mt-3 text-xs", v.ok ? "text-muted-foreground" : "text-destructive font-bold")}>
        {v.ok
          ? `Período: ${rangeLabel(value)} · días de Caracas · por fecha de publicación.${note ? ` ${note}` : ""}`
          : `${v.message} No se muestran totales hasta que el rango sea válido.`}
      </p>
    </fieldset>
  );
};

export default ConsultationRangeControls;

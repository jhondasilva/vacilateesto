/**
 * Trazabilidad por publicación para conciliar dashboard vs. testigos.
 * Solo DESCRIBE por qué una publicación ya incluida por el criterio actual está ahí;
 * nunca decide inclusión, reclasifica ni persiste nada.
 */
import { publicationTimestamp } from "@/lib/consultationRange";

/** Exclusiones / inclusiones manuales vigentes (mismos IDs que usaba InfluencersSection). */
export const PDG_EXCLUDED_EXTERNAL_IDS = new Set(["7550124744004078853", "3990082622452650566"]);
export const PDG_INCLUDED_EXTERNAL_IDS = new Set([
  "7683301114023939348", "7682173924817358100", "7682929732656188693",
  "7685902044862942485", "3991391175003360385", "3986879758008167609",
  "3987049638114123295", "3986162588420753795", "3986317332877413403",
  "3980566841372687701", "7685527573824015636", "7684415937629424917",
]);

export const PDG_TEAM_HANDLES = [
  "@diablosdelabastidas", "@bombillosdepetare", "@vikingosdecharallave",
  "@torosdelavega", "@losperrosdelosguayos", "@losvipdepintoo",
  "@coquitoysucombopdg", "@losrelampagoskk",
];
export const PDG_CHIVO_HANDLES = [
  "@mabastidas", "@luis_sojo19", "@gesaria", "@luchomosqueda",
  "@azuaje.230", "@lamentedepinto", "@coquitooriginal", "@diazkarate",
];

export type AuditablePost = {
  id?: string | null;
  platform: string | null;
  external_id: string | null;
  category?: string | null;
  author_handle: string | null;
  url?: string | null;
  text: string | null;
  hashtags: string[] | null;
  published_at: string | null;
  views: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  synced_at?: string | null;
};

const normHandle = (h: string | null | undefined) => (h ?? "").trim().toLowerCase().replace(/^@?/, "@");

export type Evidence = {
  reasons: string[];
  verified: boolean;
  doubts: string[];
};

/** Motivos sustentados solo en datos guardados (roster, texto, hashtags) y avisos de dudas. */
export function explainInclusion(p: AuditablePost): Evidence {
  const reasons: string[] = [];
  const doubts: string[] = [];
  let verified = false;
  const handle = normHandle(p.author_handle);
  const blob = `${p.text ?? ""} ${(p.hashtags ?? []).join(" ")}`.toLowerCase().replace(/\s+/g, "");

  if (PDG_TEAM_HANDLES.includes(handle)) { reasons.push(`Cuenta de equipo del roster (${handle})`); verified = true; }
  if (PDG_CHIVO_HANDLES.includes(handle)) reasons.push(`Cuenta de chivo del roster (${handle})`);
  if (blob.includes("#peloticadegoma")) { reasons.push("Hashtag #PeloticaDeGoma en texto/hashtags"); verified = true; }
  if (blob.includes("#amoajuga")) { reasons.push("Hashtag #AmoAJuga en texto/hashtags"); verified = true; }
  if (blob.includes("@peloticadegomave")) { reasons.push("Mención @peloticadegomave en texto"); verified = true; }
  const teamMentions = PDG_TEAM_HANDLES.filter((t) => t !== handle && blob.includes(t));
  if (teamMentions.length) { reasons.push(`Mención a equipo en texto (${teamMentions.join(" ")})`); verified = true; }

  if (PDG_INCLUDED_EXTERNAL_IDS.has(String(p.external_id ?? ""))) {
    reasons.push("Inclusión manual (excepción registrada)");
    if (!verified) doubts.push("Solo excepción manual: evidencia no verificada en datos guardados");
  }
  if (!verified) {
    if (p.category) reasons.push(`Categoría histórica guardada: ${p.category}`);
    if (!doubts.length) doubts.push("Sin evidencia textual ni de roster: incluida solo por categoría histórica");
  }
  if (p.category === "equipo" && !PDG_TEAM_HANDLES.includes(handle)) doubts.push("Categoría equipo con cuenta fuera del roster");
  if (p.category === "chivo" && !PDG_CHIVO_HANDLES.includes(handle)) doubts.push("Categoría chivo con cuenta fuera del roster");
  if (!p.url) doubts.push("Falta URL");
  if (!Number.isFinite(publicationTimestamp(p.published_at))) doubts.push("Falta fecha de publicación");
  if (!p.author_handle) doubts.push("Falta cuenta");
  if (!p.platform) doubts.push("Falta plataforma");
  if (p.platform === "instagram") doubts.push("Instagram: 'views' guardado puede ser plays o views según la fuente");
  return { reasons, verified, doubts };
}

/** Fecha/hora de publicación en America/Caracas (UTC-4 fijo), independiente del navegador. */
export function caracasDateTime(value: string | null | undefined): string {
  const ts = publicationTimestamp(value);
  if (!Number.isFinite(ts)) return "";
  return new Date(ts - 4 * 3600_000).toISOString().replace("T", " ").slice(0, 19);
}

/** Celda CSV segura: escapa comillas/separadores/saltos y neutraliza fórmulas. */
export function csvCell(value: unknown, { trusted = false }: { trusted?: boolean } = {}): string {
  if (value === null || value === undefined) return "";
  let s = String(value);
  if (!trusted && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  if (/[",;\n\r\t]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
}

const safeUrl = (u: string | null | undefined) => (u && /^https?:\/\/[^\s"]+$/i.test(u) ? u : "");
const metric = (n: number | null | undefined) => (n === null || n === undefined ? "" : String(n));

export const AUDIT_HEADERS = [
  "id_registro", "plataforma", "id_externo", "url", "fecha_publicacion_caracas", "cuenta", "categoria_guardada",
  "grupo_ranking", "formato", "views_fuente", "likes", "comments", "shares", "alcance", "impresiones",
  "motivos_inclusion", "evidencia_verificada", "dudas", "sincronizado_registro_utc",
];

export type AuditMeta = { section: string; period: string; filters: string; partial: boolean; generatedAt?: Date };

export function buildAuditRows(posts: AuditablePost[], sideOf?: (p: AuditablePost) => string) {
  return posts.map((p) => {
    const e = explainInclusion(p);
    return [
      csvCell(p.id), csvCell(p.platform), csvCell(p.external_id), csvCell(safeUrl(p.url), { trusted: true }),
      csvCell(caracasDateTime(p.published_at)), csvCell(p.author_handle), csvCell(p.category),
      csvCell(sideOf ? sideOf(p) : ""), "no disponible",
      metric(p.views), metric(p.likes), metric(p.comments), metric(p.shares), "no disponible", "no disponible",
      csvCell(e.reasons.join(" | ")), e.verified ? "si" : "no", csvCell(e.doubts.join(" | ")),
      csvCell(p.synced_at ?? ""),
    ].join(",");
  });
}

export function buildAuditCsv(posts: AuditablePost[], meta: AuditMeta, sideOf?: (p: AuditablePost) => string): string {
  const notes = [
    `# Seccion: ${meta.section}`,
    `# Periodo: ${meta.period} (fecha de publicacion, America/Caracas, fin inclusivo)`,
    `# Filtros: ${meta.filters}`,
    `# Filas: ${posts.length}`,
    `# Cobertura: ${meta.partial ? "PARCIAL - no se pudieron leer todas las publicaciones guardadas" : "completa sobre los datos guardados"}`,
    "# Metricas vacias = sin dato (no es cero). views_fuente conserva el nombre de la fuente; no es alcance ni impresiones.",
    "# formato/alcance/impresiones no existen en la fuente. sincronizado_registro_utc es la sincronizacion del registro, no de cada metrica.",
    "# Publicaciones descartadas por el criterio no se incluyen.",
    `# Generado: ${(meta.generatedAt ?? new Date()).toISOString()}`,
  ].map((l) => csvCell(l, { trusted: true }));
  return "\uFEFF" + [...notes, AUDIT_HEADERS.join(","), ...buildAuditRows(posts, sideOf)].join("\r\n") + "\r\n";
}

export function downloadCsv(csv: string, filename: string) {
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

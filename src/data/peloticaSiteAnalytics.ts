// Analítica del sitio web de Pelotica de Goma. Valores iniciales = respaldo (captura al 30/09/2026);
// loadLiveSiteAnalytics() los reemplaza con el contador real del sitio (función site-analytics-summary).
export const SITE_ANALYTICS_URL = "https://ondsdpljrnqhaosknxct.supabase.co/functions/v1/site-analytics-summary";

const MES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const fmt = (n: number) => n.toLocaleString("es-VE");
const fecha = (iso: string, withYear = false) => {
  const [y, m, d] = iso.split("-").map(Number);
  const s = `${d} de ${["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"][m - 1]}`;
  return withYear ? `${s} de ${y}` : s;
};

let pending: Promise<typeof SITE_ANALYTICS> | null = null;
let loadedAt = 0;

export function loadLiveSiteAnalytics(): Promise<typeof SITE_ANALYTICS> {
  if (pending && Date.now() - loadedAt < 10 * 60 * 1000) return pending;
  loadedAt = Date.now();
  pending = (async () => {
    try {
      const r = await fetch(SITE_ANALYTICS_URL);
      if (!r.ok) throw new Error(String(r.status));
      const d = await r.json();
      const monthly: [string, number][] = (d.visitantes_por_mes || []).map((x: any) => [MES[Number(x.mes.slice(5, 7)) - 1], x.visitantes]);
      const sorted = [...monthly].sort((a, b) => b[1] - a[1]);
      const top2 = sorted.slice(0, 2);
      const top2sum = top2.reduce((s, x) => s + x[1], 0);
      const totalMonthly = monthly.reduce((s, x) => s + x[1], 0) || 1;
      const dias = (d.top_dias || []).slice(0, 5).map((x: any) => `${fecha(x.fecha)} (${fmt(x.visitantes)})`);
      const orig = (d.top_origenes || []).map((x: any) => `${x.origen} ${fmt(x.visitas)}`);
      const pags = (d.top_paginas || []).slice(0, 8).map((x: any) => (x.pagina === "/" ? "Inicio" : x.pagina) + ` (${fmt(x.vistas)})`);
      Object.assign(SITE_ANALYTICS, {
        label: `${fecha(d.rango.from, true)} al ${fecha(d.rango.to, true)} · en vivo`,
        visitors: d.visitantes_unicos,
        pageviews: d.paginas_vistas,
        pagesPerVisit: d.paginas_por_visita,
        mobilePct: d.porcentaje_movil,
        monthly,
        keyReading: top2.length === 2
          ? `${top2[0][0]} y ${top2[1][0]} concentraron ${fmt(top2sum)} visitantes, el ${((top2sum / totalMonthly) * 100).toLocaleString("es-VE", { maximumFractionDigits: 1 })}% del tráfico del periodo.`
          : SITE_ANALYTICS.keyReading,
        peaks: dias.length ? `Días con más visitantes: ${dias.join(", ")}.` : SITE_ANALYTICS.peaks,
        channels: orig.length ? `Visitas por origen: ${orig.join(" · ")}.` : SITE_ANALYTICS.channels,
        pages: pags.length ? `Más vistas: ${pags.join(", ")}.` : SITE_ANALYTICS.pages,
        live: true,
      });
    } catch (e) {
      console.warn("Analítica del sitio: usando datos de respaldo", e);
    }
    return SITE_ANALYTICS;
  })();
  return pending;
}

export const SITE_ANALYTICS = {
  live: false,
  label: "1 de enero al 30 de septiembre de 2026",
  visitors: 12498,
  pageviews: 23795,
  pagesPerVisit: 1.9,
  mobilePct: 82.7,
  monthly: [
    ["Ene", 761], ["Feb", 1185], ["Mar", 552], ["Abr", 565], ["May", 585],
    ["Jun", 556], ["Jul", 238], ["Ago", 4560], ["Sep", 3496],
  ] as [string, number][],
  keyReading:
    "Agosto y septiembre concentraron 8.056 visitantes, el 64,5% de todo el tráfico del año. El sitio explotó con la antesala y el desarrollo del Split 4.",
  peaks:
    "Picos: 28 de agosto (613 visitantes), 29 de agosto (520) y 23 de agosto (445). En septiembre destacaron el día 1 (344) y el 5 (320).",
  channels:
    "Google lidera el acumulado; Facebook e Instagram impulsaron el crecimiento de agosto y septiembre. TikTok tomó fuerza en septiembre.",
  pages:
    "Inicio fue la más visitada. Durante el Split 4 crecieron Calendario, Reglas, Los Numeritos, Prensa y las páginas de los equipos.",
};

export const GOOGLE_TRENDS = {
  label: "Google Trends · Venezuela · 2004 a la fecha · Búsqueda web",
  termMain: "Pelotica de Goma",
  termCompare: "Pelota de Goma",
  avgMain: 8,
  avgCompare: 3,
  avgCombined: 11,
  reading:
    "Ambos términos son válidos: la gente busca la marca como \"Pelotica de Goma\" (azul, promedio 8) y como \"Pelota de Goma\" (rojo, promedio 3). Sumados, el interés promedio es 11. La marca tocó su máximo histórico (100) en 2024 y en 2026 volvió a repuntar hasta ~64 con el Split 4, muy por encima de su nivel previo a 2019.",
};

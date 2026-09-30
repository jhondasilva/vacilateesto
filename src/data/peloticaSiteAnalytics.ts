// Analítica del sitio web de Pelotica de Goma y Google Trends (datos entregados por el equipo, al 30/09/2026).
export const SITE_ANALYTICS = {
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

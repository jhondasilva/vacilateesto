import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import logoVacilate from "@/assets/logo-vacilate-esto.png";
import { TIKTOK_LIVES } from "@/components/dashboard/TikTokLivesSection";

type MentionPost = {
  platform: "instagram" | "tiktok" | "facebook" | "youtube";
  id: string;
  url: string;
  publishedAt: string | null;
  text: string;
  thumbnail: string | null;
  metrics: Record<string, number>;
};

type MentionsResponse = {
  matchedCount: number;
  byPlatform: Record<string, number>;
  totals: { views: number; likes: number; comments: number; impressions: number };
  posts: MentionPost[];
};

type Args = {
  brandName: string;
  brandColor: string; // hex
  scopeLabel: string;
  periodLabel: string;
  from: Date;
  to: Date;
  data: MentionsResponse;
  includeTikTokLives?: boolean;
};

/* ───────── Identidad gráfica compartida con los Media Kits ───────── */
const INK: [number, number, number] = [10, 10, 10];
const PINK: [number, number, number] = [233, 30, 99];
const CYAN: [number, number, number] = [34, 211, 238];
const MUT: [number, number, number] = [115, 115, 115];
const WHITE: [number, number, number] = [255, 255, 255];

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(v, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const fmtNum = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `${(n / 1_000).toFixed(1)}K`
      : `${n}`;

// jsPDF (Helvetica) sólo soporta latin-1: limpiamos emojis para evitar mojibake
const clean = (t: string) =>
  (t || "")
    .replace(/[^\u0000-\u00FF]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const PLATFORM_LABEL: Record<MentionPost["platform"], string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  youtube: "YouTube",
};

const loadImageAsBase64 = (src: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("no canvas ctx"));
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = src;
  });

export const generateBrandReportPdf = async ({
  brandName,
  brandColor,
  scopeLabel,
  periodLabel,
  from,
  to,
  data,
  includeTikTokLives = false,
}: Args) => {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 36;
  const ACCENT = hexToRgb(brandColor);
  const PAGES = includeTikTokLives ? 5 : 4;

  let logo: string | null = null;
  try {
    logo = await loadImageAsBase64(logoVacilate);
  } catch {
    logo = null;
  }

  /* ───────── helpers sticker ───────── */
  const stickerCard = (
    x: number,
    y: number,
    w: number,
    h: number,
    shadow: [number, number, number] = PINK,
    fill: [number, number, number] = WHITE,
  ) => {
    doc.setDrawColor(...INK);
    doc.setLineWidth(1.2);
    doc.setFillColor(...shadow);
    doc.roundedRect(x + 4, y + 4, w, h, 12, 12, "FD");
    doc.setFillColor(...fill);
    doc.roundedRect(x, y, w, h, 12, 12, "FD");
  };

  const stickerPill = (
    x: number,
    y: number,
    w: number,
    h: number,
    text: string,
    fill: [number, number, number] = INK,
    fg: [number, number, number] = WHITE,
    fs = 8,
  ) => {
    doc.setDrawColor(...INK);
    doc.setLineWidth(1);
    doc.setFillColor(...fill);
    doc.roundedRect(x, y, w, h, h / 2, h / 2, "FD");
    doc.setTextColor(...fg);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(fs);
    doc.text(text, x + w / 2, y + h / 2 + fs * 0.35, { align: "center" });
  };

  const drawLogo = (x: number, y: number, maxW: number, maxH: number) => {
    if (!logo) return;
    const props = doc.getImageProperties(logo);
    const s = Math.min(maxW / props.width, maxH / props.height);
    doc.addImage(logo, "PNG", x, y, props.width * s, props.height * s);
  };

  const logoBadge = (x: number, y: number, w: number, h: number, shadow: [number, number, number]) => {
    doc.setDrawColor(...INK);
    doc.setLineWidth(1.2);
    doc.setFillColor(...shadow);
    doc.roundedRect(x + 3, y + 3, w, h, 10, 10, "FD");
    doc.setFillColor(...WHITE);
    doc.roundedRect(x, y, w, h, 10, 10, "FD");
    drawLogo(x + 10, y + 10, w - 20, h - 20);
  };

  const header = (page: number) => {
    drawLogo(M, 14, 24, 22);
    doc.setTextColor(...INK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(
      `VACÍLATE ESTO · INFORME ANALÍTICO  ·  ${brandName.toUpperCase()}  ·  ${periodLabel.toUpperCase()}`,
      M + 32,
      28,
    );
    doc.text(`INFORME · ${page} / ${PAGES}`, W - M, 28, { align: "right" });
    doc.setDrawColor(...INK);
    doc.setLineWidth(0.6);
    doc.line(M, 40, W - M, 40);
  };

  const footer = (page: number) => {
    drawLogo(M, H - 34, 20, 18);
    doc.setTextColor(...MUT);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text("vacilateesto.com  ·  elpatio@hacemosloquenosgusta.com", M + 26, H - 22);
    doc.text(`${page}/${PAGES}`, W - M, H - 22, { align: "right" });
  };

  /* ───────── PÁGINA 1 · PORTADA ───────── */
  doc.setFillColor(...PINK);
  doc.circle(60, 220, 100, "F");
  doc.setFillColor(...CYAN);
  doc.circle(W - 60, 150, 75, "F");
  header(1);

  const cx = 50;
  const cy = 150;
  const cw = W - 100;
  const ch = 330;
  doc.setDrawColor(...INK);
  doc.setLineWidth(1.5);
  doc.setFillColor(...INK);
  doc.roundedRect(cx, cy, cw, ch, 16, 16, "FD");

  logoBadge(cx + cw - 142, cy + 22, 120, 120, ACCENT);
  stickerPill(cx + 22, cy + 24, 130, 22, "INFORME DE MARCA", CYAN, INK);

  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`${periodLabel.toUpperCase()}  ·  VACÍLATE ESTO 2026`, cx + 22, cy + 68);

  doc.setFontSize(40);
  doc.text(brandName.toUpperCase().slice(0, 18), cx + 22, cy + 120);
  doc.setTextColor(...ACCENT);
  doc.setFontSize(28);
  doc.text("× VACÍLATE ESTO", cx + 22, cy + 156);

  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(
    `${format(from, "d MMM yyyy", { locale: es })} — ${format(to, "d MMM yyyy", { locale: es })}  ·  TODAS LAS REDES`,
    cx + 22,
    cy + 184,
  );

  // KPIs sticker sobre la tarjeta oscura
  const kpis = [
    { label: "PUBLICACIONES", value: String(data.matchedCount), shadow: PINK },
    { label: "VIEWS", value: fmtNum(data.totals.views), shadow: CYAN },
    { label: "LIKES", value: fmtNum(data.totals.likes), shadow: ACCENT },
    { label: "COMENTARIOS", value: fmtNum(data.totals.comments), shadow: PINK },
  ];
  const kw = (cw - 44 - 3 * 12) / 4;
  kpis.forEach((k, i) => {
    const x = cx + 22 + i * (kw + 12);
    const y = cy + 210;
    stickerCard(x, y, kw, 92, k.shadow);
    doc.setTextColor(...MUT);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(k.label, x + 12, y + 22);
    doc.setTextColor(...INK);
    doc.setFontSize(22);
    doc.text(k.value, x + 12, y + 58);
  });

  doc.setTextColor(...MUT);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Filtros: ${clean(scopeLabel)}`, M, H - 76, { maxWidth: W - M * 2 });
  doc.text(
    `Generado el ${format(new Date(), "d 'de' MMMM yyyy 'a las' HH:mm", { locale: es })}`,
    M,
    H - 58,
  );
  footer(1);

  /* filas por plataforma */
  const platformOrder: MentionPost["platform"][] = ["instagram", "tiktok", "facebook", "youtube"];
  const platformRows = platformOrder.map((p) => {
    const posts = data.posts.filter((x) => x.platform === p);
    const totals = posts.reduce(
      (acc, q) => {
        acc.views += q.metrics.views ?? 0;
        acc.likes += q.metrics.likes ?? q.metrics.reactions ?? 0;
        acc.comments += q.metrics.comments ?? 0;
        return acc;
      },
      { views: 0, likes: 0, comments: 0 },
    );
    return [
      PLATFORM_LABEL[p],
      String(posts.length),
      fmtNum(totals.views),
      fmtNum(totals.likes),
      fmtNum(totals.comments),
    ];
  });

  const tableStyles = {
    theme: "grid" as const,
    margin: { left: M, right: M },
    styles: { lineColor: INK, lineWidth: 0.8, font: "helvetica" },
    headStyles: { fillColor: INK, textColor: WHITE, fontStyle: "bold" as const, fontSize: 9 },
    bodyStyles: { fontSize: 10, cellPadding: 7, textColor: INK },
    alternateRowStyles: { fillColor: [245, 245, 244] as [number, number, number] },
  };

  /* ───────── PÁGINA 2 · RESUMEN GENERAL ───────── */
  doc.addPage();
  header(2);
  stickerPill(M, 56, 130, 20, "RESUMEN GENERAL", PINK, WHITE);
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("TODAS LAS REDES", M, 112);
  doc.setTextColor(...MUT);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Datos totales acumulados del período seleccionado", M, 130);

  const sumKpis = [
    {
      label: "PUBLICACIONES TOTALES",
      value: String(data.matchedCount),
      sub: `${Object.keys(data.byPlatform).filter((k) => data.byPlatform[k] > 0).length} redes con actividad`,
      shadow: PINK,
    },
    { label: "VIEWS TOTALES", value: fmtNum(data.totals.views), sub: "Todas las plataformas", shadow: CYAN },
    { label: "LIKES TOTALES", value: fmtNum(data.totals.likes), sub: "Reacciones acumuladas", shadow: ACCENT },
    { label: "COMENTARIOS", value: fmtNum(data.totals.comments), sub: "Interacciones totales", shadow: PINK },
  ];
  const sw = (W - M * 2 - 16) / 2;
  const sh = 100;
  sumKpis.forEach((k, i) => {
    const x = M + (i % 2) * (sw + 16);
    const y = 150 + Math.floor(i / 2) * (sh + 18);
    stickerCard(x, y, sw, sh, k.shadow);
    doc.setTextColor(...MUT);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text(k.label, x + 14, y + 24);
    doc.setTextColor(...INK);
    doc.setFontSize(30);
    doc.text(k.value, x + 14, y + 64);
    doc.setTextColor(...MUT);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(k.sub, x + 14, y + 84);
  });

  const distY = 150 + 2 * (sh + 18) + 24;
  stickerPill(M, distY - 16, 140, 20, "DISTRIBUCIÓN POR RED", CYAN, INK);
  autoTable(doc, { ...tableStyles, startY: distY + 20, head: [["Red", "Publicaciones", "Views", "Likes", "Comentarios"]], body: platformRows });
  footer(2);

  /* ───────── PÁGINA 3 · APORTE POR RED ───────── */
  doc.addPage();
  header(3);
  stickerPill(M, 56, 120, 20, "APORTE POR RED", PINK, WHITE);
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("DESGLOSE DE REDES", M, 112);
  autoTable(doc, {
    ...tableStyles,
    startY: 132,
    head: [["Red", "Publicaciones", "Views", "Likes", "Comentarios"]],
    body: platformRows,
    headStyles: { ...tableStyles.headStyles, fillColor: ACCENT },
  });

  const netY = ((doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 200) + 30;
  stickerCard(M, netY, W - M * 2, 78, CYAN, INK);
  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("ALCANCE DE LA ALIANZA", M + 18, netY + 28);
  doc.setTextColor(...CYAN);
  doc.setFontSize(9);
  doc.text(
    `${data.matchedCount} piezas  ·  ${fmtNum(data.totals.views)} views  ·  ${fmtNum(data.totals.likes)} likes  ·  ${fmtNum(data.totals.comments)} comentarios`,
    M + 18,
    netY + 50,
  );
  footer(3);

  /* ───────── PÁGINA 4 · TOP PUBLICACIONES ───────── */
  const topPosts = [...data.posts]
    .map((p) => ({
      ...p,
      score:
        (p.metrics.views ?? 0) +
        (p.metrics.likes ?? p.metrics.reactions ?? 0) * 5 +
        (p.metrics.comments ?? 0) * 10,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

  doc.addPage();
  header(4);
  stickerPill(M, 56, 130, 20, "TOP PUBLICACIONES", PINK, WHITE);
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("LO QUE MÁS PEGÓ", M, 112);

  autoTable(doc, {
    ...tableStyles,
    startY: 132,
    head: [["#", "Red", "Fecha", "Views", "Likes", "Com.", "Texto"]],
    body: topPosts.map((p, i) => [
      String(i + 1),
      PLATFORM_LABEL[p.platform],
      p.publishedAt ? format(new Date(p.publishedAt), "d MMM yy", { locale: es }) : "—",
      fmtNum(p.metrics.views ?? 0),
      fmtNum(p.metrics.likes ?? p.metrics.reactions ?? 0),
      fmtNum(p.metrics.comments ?? 0),
      clean(p.text).slice(0, 95),
    ]),
    bodyStyles: { fontSize: 8, cellPadding: 5, valign: "top", textColor: INK },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 52 },
      2: { cellWidth: 48 },
      3: { cellWidth: 42, halign: "right" },
      4: { cellWidth: 42, halign: "right" },
      5: { cellWidth: 40, halign: "right" },
      6: { cellWidth: "auto" },
    },
  });

  // Panel de cierre — mismo bloque HABLEMOS de los media kits
  const endY = Math.min(
    ((doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 400) + 24,
    H - 170,
  );
  doc.setDrawColor(...INK);
  doc.setLineWidth(1.2);
  doc.setFillColor(...INK);
  doc.roundedRect(M, endY, W - M * 2, 110, 14, 14, "FD");
  logoBadge(W - M - 118, endY + 12, 100, 86, ACCENT);
  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("HABLEMOS", M + 20, endY + 34);
  doc.setTextColor(...CYAN);
  doc.setFontSize(9);
  doc.text("CONTACTO COMERCIAL", M + 20, endY + 56);
  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("elpatio@hacemosloquenosgusta.com", M + 20, endY + 72);
  doc.text("vacilateesto.com  ·  @vacilateestopodcast", M + 20, endY + 88);
  footer(4);

  const safeBrand = brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const safePeriod = periodLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  doc.save(`informe-${safeBrand}-${safePeriod}.pdf`);
};

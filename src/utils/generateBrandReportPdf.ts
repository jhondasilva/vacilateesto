import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
  scopeLabel: string; // p.ej. keywords activos
  periodLabel: string; // "Acumulado 2026" / "May 26"
  from: Date;
  to: Date;
  data: MentionsResponse;
};

const fmtNum = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `${(n / 1_000).toFixed(1)}K`
      : `${n}`;

const PLATFORM_LABEL: Record<MentionPost["platform"], string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  youtube: "YouTube",
};

// Convierte hex (#RRGGBB) a [r,g,b]
const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(v, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export const generateBrandReportPdf = ({
  brandName,
  brandColor,
  scopeLabel,
  periodLabel,
  from,
  to,
  data,
}: Args) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;
  const [r, g, b] = hexToRgb(brandColor);

  // ============ Portada ============
  doc.setFillColor(15, 15, 18);
  doc.rect(0, 0, pageW, pageH, "F");

  // Banda de color de marca
  doc.setFillColor(r, g, b);
  doc.rect(0, 0, pageW, 6, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("VACÍLATE ESTO · INFORME ANALÍTICO", margin, 80);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(42);
  doc.text(brandName, margin, 160);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.setTextColor(180, 180, 185);
  doc.text(`× Vacílate Esto`, margin, 188);

  // Periodo
  doc.setDrawColor(r, g, b);
  doc.setLineWidth(2);
  doc.line(margin, 230, margin + 60, 230);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text(periodLabel, margin, 270);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(180, 180, 185);
  const fromStr = format(from, "d MMM yyyy", { locale: es });
  const toStr = format(to, "d MMM yyyy", { locale: es });
  doc.text(`${fromStr} — ${toStr}`, margin, 290);

  // KPIs grandes en portada — Totales generales de todas las redes acumulado
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("Resumen General · Todas las redes acumulado", margin, 330);

  const kpis = [
    { label: "Publicaciones", value: String(data.matchedCount) },
    { label: "Views", value: fmtNum(data.totals.views) },
    { label: "Likes", value: fmtNum(data.totals.likes) },
    { label: "Comentarios", value: fmtNum(data.totals.comments) },
  ];
  const kpiBoxW = (pageW - margin * 2 - 30) / 2;
  const kpiBoxH = 90;
  const kpiTop = 360;
  kpis.forEach((k, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = margin + col * (kpiBoxW + 10);
    const y = kpiTop + row * (kpiBoxH + 10);
    doc.setFillColor(28, 28, 32);
    doc.roundedRect(x, y, kpiBoxW, kpiBoxH, 8, 8, "F");
    doc.setFillColor(r, g, b);
    doc.rect(x, y, 4, kpiBoxH, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(170, 170, 175);
    doc.text(k.label.toUpperCase(), x + 18, y + 28);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text(k.value, x + 18, y + 65);
  });

  // Footer portada
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 145);
  doc.text(`Filtros: ${scopeLabel}`, margin, pageH - 60, {
    maxWidth: pageW - margin * 2,
  });
  doc.text(
    `Generado el ${format(new Date(), "d 'de' MMMM yyyy 'a las' HH:mm", { locale: es })}`,
    margin,
    pageH - 40,
  );

  // ============ Página 2: Desglose por red ============
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageW, pageH, "F");

  doc.setFillColor(r, g, b);
  doc.rect(0, 0, pageW, 6, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 125);
  doc.text(`${brandName.toUpperCase()} · ${periodLabel.toUpperCase()}`, margin, 50);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(20, 20, 25);
  doc.text("Aporte por red", margin, 90);

  // Tabla por plataforma
  const platformOrder: MentionPost["platform"][] = [
    "instagram",
    "tiktok",
    "facebook",
    "youtube",
  ];
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

  autoTable(doc, {
    startY: 110,
    head: [["Red", "Publicaciones", "Views", "Likes", "Comentarios"]],
    body: platformRows,
    theme: "grid",
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: [r, g, b],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 10,
    },
    bodyStyles: { fontSize: 11, cellPadding: 8 },
    alternateRowStyles: { fillColor: [248, 248, 250] },
  });

  // ============ Top publicaciones ============
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

  if (topPosts.length > 0) {
    const lastY = (doc as any).lastAutoTable?.finalY ?? 200;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(20, 20, 25);
    doc.text("Top publicaciones", margin, lastY + 50);

    autoTable(doc, {
      startY: lastY + 70,
      head: [["#", "Red", "Fecha", "Views", "Likes", "Coment.", "Texto"]],
      body: topPosts.map((p, i) => [
        String(i + 1),
        PLATFORM_LABEL[p.platform],
        p.publishedAt
          ? format(new Date(p.publishedAt), "d MMM yy", { locale: es })
          : "—",
        fmtNum(p.metrics.views ?? 0),
        fmtNum(p.metrics.likes ?? p.metrics.reactions ?? 0),
        fmtNum(p.metrics.comments ?? 0),
        (p.text || "").slice(0, 90).replace(/\s+/g, " "),
      ]),
      theme: "striped",
      margin: { left: margin, right: margin },
      headStyles: {
        fillColor: [20, 20, 25],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: { fontSize: 8.5, cellPadding: 5, valign: "top" },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 55 },
        2: { cellWidth: 50 },
        3: { cellWidth: 45, halign: "right" },
        4: { cellWidth: 45, halign: "right" },
        5: { cellWidth: 45, halign: "right" },
        6: { cellWidth: "auto" },
      },
      didDrawPage: () => {
        // Footer en cada página
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(140, 140, 145);
        doc.text(
          `${brandName} × Vacílate Esto · ${periodLabel}`,
          margin,
          pageH - 20,
        );
        doc.text(
          `Página ${doc.getCurrentPageInfo().pageNumber}`,
          pageW - margin,
          pageH - 20,
          { align: "right" },
        );
      },
    });
  }

  const safeBrand = brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const safePeriod = periodLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  doc.save(`informe-${safeBrand}-${safePeriod}.pdf`);
};
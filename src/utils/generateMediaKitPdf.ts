import jsPDF from "jspdf";
import logoVacilate from "@/assets/logo-vacilate-esto.png";

// Datos de audiencia
const audienceData = {
  totalFollowers: "3.5M+",
  totalImpressions: "89.6M",
  totalInteractions: "5.2M",
  totalPublications: "6,705",
  platforms: [
    { name: "TikTok", followers: "1.82M", growth: "+7.18%" },
    { name: "Instagram", followers: "278.19K", growth: "+20.66%" },
    { name: "Facebook", followers: "210.68K", growth: "+11.8%" },
    { name: "YouTube", followers: "113K", growth: "+1.8%" },
    { name: "Threads", followers: "58.06K", growth: "+13.69%" },
  ],
  impressions: {
    facebook: "44.79M",
    facebookGrowth: "+64.94%",
    instagram: "22.74M",
    instagramGrowth: "+88.36%",
    tiktok: "19.88M",
    tiktokGrowth: "+336.6%",
    youtube: "1.95M",
    linkedin: "224.69K",
    linkedinGrowth: "+486.67%",
  },
  interactions: {
    facebook: "3.4M",
    instagram: "427.99K",
    threads: "1.32M",
    youtube: "71.44K",
    linkedin: "6,456",
  },
  demographics: {
    countries: [
      { name: "Venezuela", percentage: "47.80%" },
      { name: "España", percentage: "10.82%" },
      { name: "Estados Unidos", percentage: "10.59%" },
      { name: "México", percentage: "5.46%" },
      { name: "Colombia", percentage: "4.69%" },
      { name: "Chile", percentage: "3.79%" },
      { name: "Argentina", percentage: "2.71%" },
      { name: "Perú", percentage: "2.63%" },
      { name: "Ecuador", percentage: "1.18%" },
      { name: "Rep. Dominicana", percentage: "1.14%" },
    ],
    regions: [
      { name: "Distrito Federal", percentage: "16.59%" },
      { name: "Carabobo", percentage: "3.98%" },
      { name: "Madrid", percentage: "3.57%" },
      { name: "Lara", percentage: "3.33%" },
      { name: "Miranda", percentage: "2.77%" },
      { name: "Zulia", percentage: "2.67%" },
    ],
  },
};

const contentFormats = [
  { title: "Vacílate Esto Cuentos", subtitle: "Shorts Diarios", stats: "Diario · ~1 min" },
  { title: "Podcast Vacílate Esto", subtitle: "Formato Estrella", stats: "Semanal · ~45 min" },
  { title: "Vacílate Esto Comiendo", subtitle: "Serie Gastronómica", stats: "Ruta del Ramen" },
  { title: "Metraje", subtitle: "Documental", stats: "Formato aventura" },
  { title: "Lives", subtitle: "En Vivo", stats: "Shows en vivo" },
  { title: "Rutas", subtitle: "Exploraciones Temáticas", stats: "Series temáticas" },
  { title: "Newsletter", subtitle: "Semanal", stats: "Contenido curado" },
  { title: "Caminado", subtitle: "Formato Aventura", stats: "Exploraciones a pie" },
  { title: "Canales de Difusión", subtitle: "Comunidad VIP", stats: "Instagram y WhatsApp" },
  { title: "Proyectos Especiales", subtitle: "Producciones Únicas", stats: "3 proyectos realizados" },
  { title: "Vacílate El Mundial", subtitle: "Cobertura Especial 2026", stats: "Feb - Jul 2026" },
];

const sponsorshipPlans = [
  {
    name: "Plan 1 - Brand Placement Intensivo",
    features: [
      "30 Brand Placement Shorts en TikTok e Instagram",
      "4 Long Podcast en YouTube - Mención de 30 seg",
      "4 Historias en Instagram - 1 semanal",
      "4 Presencia en Newsletters - 1 semanal",
      "1 Short mensual con historia de marca",
    ],
  },
  {
    name: "Plan 2 - Content Integration",
    features: [
      "15 Content Shorts en TikTok e Instagram",
      "4 Long Podcast en YouTube",
      "2 Historias en Instagram",
      "4 Presencia en Newsletters",
      "1 Short mensual con historia de marca",
    ],
  },
];

const topPosts = [
  { date: "21 Feb 2025", description: "¿Sabías la existencia de este pozo?", impressions: "2.48M", interactions: "186.25K" },
  { date: "07 Ago 2025", description: "Algunos aseguran haber sentido su presencia…", impressions: "1.04M", interactions: "80.55K" },
  { date: "22 Mar 2025", description: "¿Qué opinas sobre estos 2 artistas?", impressions: "919.49K", interactions: "56.97K" },
  { date: "24 Abr 2025", description: "Teorías sobre la desaparición…", impressions: "880.3K", interactions: "59.85K" },
  { date: "11 Feb 2025", description: "¿Crees esta leyenda? ¿Qué opinas?", impressions: "743.38K", interactions: "103.98K" },
  { date: "07 May 2025", description: "La historia de constancia y éxito...", impressions: "685.74K", interactions: "88.78K" },
];

// Colors
const PRIMARY_COLOR: [number, number, number] = [239, 68, 68]; // Coral red
const DARK_COLOR: [number, number, number] = [20, 20, 20];
const GRAY_COLOR: [number, number, number] = [100, 100, 100];
const LIGHT_GRAY: [number, number, number] = [245, 245, 245];
const ACCENT_COLOR: [number, number, number] = [125, 232, 232]; // Turquoise

// Helper function to load image as base64
const loadImageAsBase64 = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } else {
        reject(new Error("Could not get canvas context"));
      }
    };
    img.onerror = reject;
    img.src = src;
  });
};

export const generateMediaKitPdf = async () => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = 0;

  // Load logo
  let logoBase64: string | null = null;
  try {
    logoBase64 = await loadImageAsBase64(logoVacilate);
  } catch (e) {
    console.warn("Could not load logo:", e);
  }

  const addNewPage = () => {
    doc.addPage();
    y = margin;
  };

  const drawHeader = (title: string, subtitle?: string) => {
    doc.setFillColor(...PRIMARY_COLOR);
    doc.rect(0, 0, pageWidth, 45, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin, 25);
    
    if (subtitle) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(subtitle, margin, 35);
    }
    
    y = 60;
  };

  const drawSectionTitle = (title: string) => {
    if (y > pageHeight - 40) addNewPage();
    
    doc.setFillColor(...PRIMARY_COLOR);
    doc.rect(margin, y - 2, 4, 10, "F");
    
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin + 8, y + 5);
    y += 15;
  };

  const drawText = (text: string, size: number = 10, color: [number, number, number] = GRAY_COLOR, bold: boolean = false) => {
    if (y > pageHeight - 20) addNewPage();
    
    doc.setTextColor(...color);
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    
    const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
    doc.text(lines, margin, y);
    y += lines.length * (size * 0.4) + 3;
  };

  // ==================== PAGE 1: COVER ====================
  // Full page hero background
  doc.setFillColor(...DARK_COLOR);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Decorative circles
  doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2], 0.2);
  doc.circle(pageWidth - 30, 50, 60, "F");
  doc.setFillColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2], 0.15);
  doc.circle(30, pageHeight - 60, 80, "F");

  // MediaKit 2026 badge
  doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2], 0.3);
  doc.roundedRect(pageWidth / 2 - 30, 35, 60, 12, 6, 6, "F");
  doc.setTextColor(...PRIMARY_COLOR);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("MEDIAKIT 2026", pageWidth / 2, 43, { align: "center" });

  // Logo image
  if (logoBase64) {
    const logoWidth = 80;
    const logoHeight = 25;
    doc.addImage(logoBase64, "PNG", (pageWidth - logoWidth) / 2, 55, logoWidth, logoHeight);
  } else {
    // Fallback text if logo doesn't load
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(40);
    doc.setFont("helvetica", "bold");
    doc.text("VACÍLATE ESTO", pageWidth / 2, 75, { align: "center" });
  }

  // Subtitle
  doc.setTextColor(...PRIMARY_COLOR);
  doc.setFontSize(18);
  doc.text("El Ecosistema de Contenido", pageWidth / 2, 92, { align: "center" });
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Fun Educaitment", pageWidth / 2, 105, { align: "center" });

  // Description
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const desc = "Conectamos marcas con una audiencia apasionada de más de 3.5 millones de seguidores a través de contenido auténtico y entretenido.";
  const descLines = doc.splitTextToSize(desc, pageWidth - 60);
  doc.text(descLines, pageWidth / 2, 125, { align: "center" });

  // Stats boxes
  const stats = [
    { value: "3.5M+", label: "Seguidores" },
    { value: "89.6M", label: "Impresiones" },
    { value: "5.2M", label: "Interacciones" },
    { value: "6,705", label: "Publicaciones" },
  ];
  
  const boxWidth = 38;
  const boxGap = 8;
  const totalBoxWidth = (boxWidth * 4) + (boxGap * 3);
  let boxX = (pageWidth - totalBoxWidth) / 2;
  const boxY = 155;

  stats.forEach((stat) => {
    doc.setFillColor(40, 40, 40);
    doc.roundedRect(boxX, boxY, boxWidth, 35, 4, 4, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(stat.value, boxX + boxWidth / 2, boxY + 15, { align: "center" });
    
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(stat.label, boxX + boxWidth / 2, boxY + 25, { align: "center" });
    
    boxX += boxWidth + boxGap;
  });

  // Footer
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text("Datos: 01 enero - 30 noviembre 2025 · Fuente: Metricool", pageWidth / 2, pageHeight - 20, { align: "center" });

  // ==================== PAGE 2: PLATFORM METRICS ====================
  addNewPage();
  drawHeader("MÉTRICAS POR PLATAFORMA", "Nuestra Presencia Digital");

  // Platform cards with visual progress circles
  const platforms = audienceData.platforms;
  const cardWidth = (pageWidth - margin * 2 - 16) / 3;
  let cardX = margin;
  let cardY = y;

  // Helper to draw a circular progress indicator
  const drawCircularProgress = (cx: number, cy: number, radius: number, percentage: number, color: [number, number, number]) => {
    // Background circle
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(2);
    doc.circle(cx, cy, radius, "S");
    
    // Progress arc - simplified as filled wedge
    doc.setFillColor(...color);
    const segments = Math.floor((percentage / 100) * 12);
    for (let i = 0; i < segments; i++) {
      const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
      const nextAngle = ((i + 1) / 12) * 2 * Math.PI - Math.PI / 2;
      const x1 = cx + Math.cos(angle) * radius;
      const y1 = cy + Math.sin(angle) * radius;
      const x2 = cx + Math.cos(nextAngle) * radius;
      const y2 = cy + Math.sin(nextAngle) * radius;
      doc.setDrawColor(...color);
      doc.setLineWidth(2.5);
      doc.line(x1, y1, x2, y2);
    }
  };

  // Platform data with numeric values for visualization
  const platformsWithValues = [
    { name: "TikTok", followers: "1.82M", growth: "+7.18%", value: 1820000, icon: "▶" },
    { name: "Instagram", followers: "278.19K", growth: "+20.66%", value: 278190, icon: "📷" },
    { name: "Facebook", followers: "210.68K", growth: "+11.8%", value: 210680, icon: "f" },
    { name: "YouTube", followers: "113K", growth: "+1.8%", value: 113000, icon: "▶" },
    { name: "Threads", followers: "58.06K", growth: "+13.69%", value: 58060, icon: "@" },
  ];

  const maxFollowers = 1820000;

  platformsWithValues.forEach((platform, index) => {
    if (index === 3) {
      cardX = margin + cardWidth / 2 + 4;
      cardY = y + 45;
    }
    if (index === 4) {
      cardX = margin + cardWidth * 1.5 + 12;
    }

    // Card with gradient effect
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(cardX, cardY, cardWidth, 40, 4, 4, "F");
    
    // Top accent line
    doc.setFillColor(...PRIMARY_COLOR);
    doc.rect(cardX, cardY, cardWidth, 3, "F");
    
    // Platform icon circle
    doc.setFillColor(...DARK_COLOR);
    doc.circle(cardX + 12, cardY + 18, 6, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(platform.icon, cardX + 12, cardY + 20, { align: "center" });
    
    // Platform name
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(platform.name, cardX + 22, cardY + 14);
    
    // Followers
    doc.setFontSize(14);
    doc.text(platform.followers, cardX + 22, cardY + 24);
    
    // Growth badge
    doc.setFillColor(220, 252, 231);
    doc.roundedRect(cardX + 22, cardY + 28, 25, 8, 2, 2, "F");
    doc.setTextColor(22, 163, 74);
    doc.setFontSize(7);
    doc.text(platform.growth, cardX + 34.5, cardY + 33, { align: "center" });
    
    // Mini progress bar
    const barWidth = cardWidth - 10;
    const progressPercent = (platform.value / maxFollowers) * 100;
    doc.setFillColor(230, 230, 230);
    doc.roundedRect(cardX + 5, cardY + 38, barWidth, 2, 1, 1, "F");
    doc.setFillColor(...PRIMARY_COLOR);
    doc.roundedRect(cardX + 5, cardY + 38, (barWidth * progressPercent) / 100, 2, 1, 1, "F");
    
    cardX += cardWidth + 8;
  });

  y = cardY + 60;

  // Impressions section with visual bars
  drawSectionTitle("Impresiones Totales");
  
  const impressionData = [
    { platform: "Facebook", value: "44.79M", growth: "+64.94%", numValue: 44.79, color: [66, 103, 178] as [number, number, number] },
    { platform: "Instagram", value: "22.74M", growth: "+88.36%", numValue: 22.74, color: [225, 48, 108] as [number, number, number] },
    { platform: "TikTok", value: "19.88M", growth: "+336.6%", numValue: 19.88, color: [0, 0, 0] as [number, number, number] },
    { platform: "YouTube", value: "1.95M", growth: "", numValue: 1.95, color: [255, 0, 0] as [number, number, number] },
    { platform: "LinkedIn", value: "224.69K", growth: "+486.67%", numValue: 0.22, color: [0, 119, 181] as [number, number, number] },
  ];

  const maxImpressions = 44.79;
  const barMaxWidth = 80;

  impressionData.forEach((item) => {
    // Platform name
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(item.platform, margin, y + 2);
    
    // Progress bar background
    const barX = margin + 35;
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(barX, y - 2, barMaxWidth, 6, 3, 3, "F");
    
    // Progress bar fill with platform color
    const fillWidth = (item.numValue / maxImpressions) * barMaxWidth;
    doc.setFillColor(...item.color);
    doc.roundedRect(barX, y - 2, fillWidth, 6, 3, 3, "F");
    
    // Value
    doc.setTextColor(...DARK_COLOR);
    doc.setFont("helvetica", "bold");
    doc.text(item.value, barX + barMaxWidth + 5, y + 2);
    
    // Growth badge
    if (item.growth) {
      doc.setFillColor(220, 252, 231);
      doc.roundedRect(pageWidth - margin - 28, y - 3, 28, 8, 2, 2, "F");
      doc.setTextColor(22, 163, 74);
      doc.setFontSize(7);
      doc.text(item.growth, pageWidth - margin - 14, y + 2, { align: "center" });
    }
    
    y += 12;
  });

  y += 8;

  // Interactions section with visual bars
  drawSectionTitle("Interacciones Totales");
  
  const interactionData = [
    { platform: "Facebook", value: "3.4M", numValue: 3.4, color: [66, 103, 178] as [number, number, number] },
    { platform: "Threads", value: "1.32M", numValue: 1.32, color: [0, 0, 0] as [number, number, number] },
    { platform: "Instagram", value: "427.99K", numValue: 0.43, color: [225, 48, 108] as [number, number, number] },
    { platform: "YouTube", value: "71.44K", numValue: 0.07, color: [255, 0, 0] as [number, number, number] },
    { platform: "LinkedIn", value: "6,456", numValue: 0.006, color: [0, 119, 181] as [number, number, number] },
  ];

  const maxInteractions = 3.4;

  interactionData.forEach((item) => {
    // Platform name
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(item.platform, margin, y + 2);
    
    // Progress bar background
    const barX = margin + 35;
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(barX, y - 2, barMaxWidth, 6, 3, 3, "F");
    
    // Progress bar fill
    const fillWidth = Math.max((item.numValue / maxInteractions) * barMaxWidth, 2);
    doc.setFillColor(...item.color);
    doc.roundedRect(barX, y - 2, fillWidth, 6, 3, 3, "F");
    
    // Value
    doc.setTextColor(...DARK_COLOR);
    doc.setFont("helvetica", "bold");
    doc.text(item.value, barX + barMaxWidth + 5, y + 2);
    
    y += 12;
  });

  // ==================== PAGE 3: DEMOGRAPHICS ====================
  addNewPage();
  drawHeader("DEMOGRAFÍA", "¿De Dónde Es Nuestra Audiencia?");

  // Countries with enhanced visual bars
  drawSectionTitle("Top 10 Países");
  
  const countryColors: [number, number, number][] = [
    [239, 68, 68],   // Venezuela - Primary red
    [234, 88, 12],   // Spain - Orange
    [59, 130, 246],  // USA - Blue
    [34, 197, 94],   // Mexico - Green
    [168, 85, 247],  // Colombia - Purple
    [236, 72, 153],  // Chile - Pink
    [6, 182, 212],   // Argentina - Cyan
    [245, 158, 11],  // Peru - Amber
    [139, 92, 246],  // Ecuador - Violet
    [20, 184, 166],  // Dom Rep - Teal
  ];
  
  audienceData.demographics.countries.forEach((country, index) => {
    // Rank badge
    doc.setFillColor(...(index === 0 ? PRIMARY_COLOR : LIGHT_GRAY));
    doc.circle(margin + 5, y, 5, "F");
    doc.setTextColor(index === 0 ? 255 : 60, index === 0 ? 255 : 60, index === 0 ? 255 : 60);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text((index + 1).toString(), margin + 5, y + 1.5, { align: "center" });
    
    // Country name
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(country.name, margin + 14, y + 1);
    
    // Enhanced progress bar
    const barWidth = 70;
    const barX = pageWidth / 2 - 10;
    const barHeight = 8;
    
    // Bar background with rounded ends
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(barX, y - 4, barWidth, barHeight, 4, 4, "F");
    
    // Filled portion with gradient effect
    const fillWidth = Math.max((parseFloat(country.percentage) / 50) * barWidth, 3);
    doc.setFillColor(...countryColors[index]);
    doc.roundedRect(barX, y - 4, fillWidth, barHeight, 4, 4, "F");
    
    // Highlight on bar
    doc.setFillColor(255, 255, 255, 0.3);
    doc.roundedRect(barX + 1, y - 3, fillWidth - 2, 2, 1, 1, "F");
    
    // Percentage value
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(country.percentage, pageWidth - margin - 5, y + 1, { align: "right" });
    
    y += 12;
  });

  y += 8;

  // Regions with enhanced visuals
  drawSectionTitle("Top Regiones");
  
  audienceData.demographics.regions.forEach((region, index) => {
    // Rank badge with accent color
    doc.setFillColor(...(index === 0 ? ACCENT_COLOR : LIGHT_GRAY));
    doc.circle(margin + 5, y, 5, "F");
    doc.setTextColor(index === 0 ? 20 : 60, index === 0 ? 20 : 60, index === 0 ? 20 : 60);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text((index + 1).toString(), margin + 5, y + 1.5, { align: "center" });
    
    // Region name
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(region.name, margin + 14, y + 1);
    
    // Progress bar
    const barWidth = 70;
    const barX = pageWidth / 2 - 10;
    
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(barX, y - 4, barWidth, 8, 4, 4, "F");
    
    const fillWidth = Math.max((parseFloat(region.percentage) / 20) * barWidth, 3);
    doc.setFillColor(...ACCENT_COLOR);
    doc.roundedRect(barX, y - 4, fillWidth, 8, 4, 4, "F");
    
    // Percentage value
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(region.percentage, pageWidth - margin - 5, y + 1, { align: "right" });
    
    y += 12;
  });

  // ==================== PAGE 4: CONTENT FORMATS ====================
  addNewPage();
  drawHeader("FORMATOS DE CONTENIDO", "Nuestro Ecosistema de Contenido");

  contentFormats.forEach((format, index) => {
    if (y > pageHeight - 30) addNewPage();
    
    // Card background
    doc.setFillColor(...LIGHT_GRAY);
    doc.roundedRect(margin, y - 3, pageWidth - margin * 2, 18, 3, 3, "F");
    
    // Accent bar
    const accentColor = index % 2 === 0 ? ACCENT_COLOR : PRIMARY_COLOR;
    doc.setFillColor(...accentColor);
    doc.rect(margin, y - 3, 4, 18, "F");
    
    // Content
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(format.title, margin + 8, y + 4);
    
    doc.setTextColor(...GRAY_COLOR);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(format.subtitle, margin + 8, y + 11);
    
    doc.setTextColor(...PRIMARY_COLOR);
    doc.setFontSize(8);
    doc.text(format.stats, pageWidth - margin - 5, y + 7, { align: "right" });
    
    y += 22;
  });

  // ==================== PAGE 5: TOP POSTS ====================
  addNewPage();
  drawHeader("TOP PUBLICACIONES", "Contenido que Genera Impacto");

  // Table header
  doc.setFillColor(...LIGHT_GRAY);
  doc.rect(margin, y, pageWidth - margin * 2, 10, "F");
  
  doc.setTextColor(...DARK_COLOR);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Fecha", margin + 3, y + 7);
  doc.text("Descripción", margin + 35, y + 7);
  doc.text("Impresiones", pageWidth - margin - 55, y + 7);
  doc.text("Interacciones", pageWidth - margin - 25, y + 7);
  
  y += 12;

  topPosts.forEach((post) => {
    doc.setTextColor(...GRAY_COLOR);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(post.date, margin + 3, y + 4);
    
    doc.setTextColor(...DARK_COLOR);
    const descText = doc.splitTextToSize(post.description, 60);
    doc.text(descText[0], margin + 35, y + 4);
    
    doc.setFont("helvetica", "bold");
    doc.text(post.impressions, pageWidth - margin - 55, y + 4);
    
    doc.setTextColor(...PRIMARY_COLOR);
    doc.text(post.interactions, pageWidth - margin - 25, y + 4);
    
    // Separator line
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, y + 8, pageWidth - margin, y + 8);
    
    y += 12;
  });

  // ==================== PAGE 6: SPONSORSHIP PLANS ====================
  addNewPage();
  drawHeader("PLANES DE PATROCINIO", "Trabaja Con Nosotros");

  sponsorshipPlans.forEach((plan, planIndex) => {
    if (y > pageHeight - 80) addNewPage();
    
    // Plan card
    const isHighlighted = planIndex === 0;
    
    if (isHighlighted) {
      doc.setFillColor(...PRIMARY_COLOR);
    } else {
      doc.setFillColor(...LIGHT_GRAY);
    }
    doc.roundedRect(margin, y, pageWidth - margin * 2, 60, 5, 5, "F");
    
    // Plan name
    if (isHighlighted) {
      doc.setTextColor(255, 255, 255);
    } else {
      doc.setTextColor(...PRIMARY_COLOR);
    }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(plan.name, margin + 10, y + 12);
    
    // Features
    let featureY = y + 22;
    plan.features.forEach((feature) => {
      if (isHighlighted) {
        doc.setTextColor(255, 255, 255);
      } else {
        doc.setTextColor(...DARK_COLOR);
      }
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("✓ " + feature, margin + 10, featureY);
      featureY += 7;
    });
    
    y += 70;
  });

  // ==================== PAGE 7: CONTACT ====================
  addNewPage();
  
  // Full page dark background
  doc.setFillColor(...DARK_COLOR);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  
  // Decorative elements
  doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2], 0.2);
  doc.circle(pageWidth - 20, 40, 50, "F");
  doc.setFillColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2], 0.15);
  doc.circle(20, pageHeight - 50, 60, "F");

  // Contact section
  doc.setTextColor(...PRIMARY_COLOR);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("CONTACTO", pageWidth / 2, 60, { align: "center" });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.text("¿Listo para Conectar", pageWidth / 2, 85, { align: "center" });
  doc.text("con Nuestra Audiencia?", pageWidth / 2, 100, { align: "center" });

  doc.setTextColor(180, 180, 180);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Contáctanos para crear una estrategia personalizada", pageWidth / 2, 125, { align: "center" });

  // Contact info box
  doc.setFillColor(40, 40, 40);
  doc.roundedRect(pageWidth / 2 - 60, 145, 120, 40, 5, 5, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Email:", pageWidth / 2, 160, { align: "center" });
  
  doc.setTextColor(...PRIMARY_COLOR);
  doc.setFontSize(12);
  doc.text("jhon@hacemosloquenosgusta.com", pageWidth / 2, 175, { align: "center" });

  // Website
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("www.vacilateesto.com", pageWidth / 2, 210, { align: "center" });

  // Footer
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text("© 2026 Vacílate Esto - Todos los derechos reservados", pageWidth / 2, pageHeight - 20, { align: "center" });

  // Save the PDF
  doc.save("Media Kit Vacilate Esto 2026.pdf");
};

// Function to get PDF as base64 for email sending
export const generateMediaKitPdfBase64 = async (): Promise<string> => {
  const jsPDF = (await import("jspdf")).default;
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = 0;

  // Load logo
  let logoBase64: string | null = null;
  try {
    logoBase64 = await loadImageAsBase64(logoVacilate);
  } catch (e) {
    console.warn("Could not load logo:", e);
  }

  const addNewPage = () => {
    doc.addPage();
    y = margin;
  };

  // Helper colors
  const PRIMARY: [number, number, number] = [239, 68, 68];
  const DARK: [number, number, number] = [20, 20, 20];
  const ACCENT: [number, number, number] = [125, 232, 232];

  // ==================== SIMPLIFIED PDF FOR EMAIL ====================
  // Cover page
  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setFillColor(PRIMARY[0], PRIMARY[1], PRIMARY[2], 0.3);
  doc.roundedRect(pageWidth / 2 - 30, 35, 60, 12, 6, 6, "F");
  doc.setTextColor(...PRIMARY);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("MEDIAKIT 2026", pageWidth / 2, 43, { align: "center" });

  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", (pageWidth - 80) / 2, 55, 80, 25);
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(36);
    doc.text("VACÍLATE ESTO", pageWidth / 2, 75, { align: "center" });
  }

  doc.setTextColor(...PRIMARY);
  doc.setFontSize(18);
  doc.text("El Ecosistema de Contenido", pageWidth / 2, 92, { align: "center" });
  doc.setFontSize(24);
  doc.text("Fun Educaitment", pageWidth / 2, 105, { align: "center" });

  doc.setTextColor(200, 200, 200);
  doc.setFontSize(11);
  const desc = "Conectamos marcas con una audiencia apasionada de más de 3.5 millones de seguidores.";
  doc.text(desc, pageWidth / 2, 125, { align: "center", maxWidth: pageWidth - 60 });

  // Stats
  const stats = [
    { value: "3.5M+", label: "Seguidores" },
    { value: "89.6M", label: "Impresiones" },
    { value: "5.2M", label: "Interacciones" },
    { value: "6,705", label: "Publicaciones" },
  ];
  
  let boxX = (pageWidth - 184) / 2;
  stats.forEach((stat) => {
    doc.setFillColor(40, 40, 40);
    doc.roundedRect(boxX, 155, 38, 35, 4, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(stat.value, boxX + 19, 170, { align: "center" });
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(7);
    doc.text(stat.label, boxX + 19, 180, { align: "center" });
    boxX += 46;
  });

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text("Datos: 01 enero - 30 noviembre 2025 · Fuente: Metricool", pageWidth / 2, pageHeight - 20, { align: "center" });

  // Page 2: Contact
  addNewPage();
  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setTextColor(...PRIMARY);
  doc.setFontSize(12);
  doc.text("CONTACTO", pageWidth / 2, 60, { align: "center" });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.text("¿Listo para Conectar", pageWidth / 2, 85, { align: "center" });
  doc.text("con Nuestra Audiencia?", pageWidth / 2, 100, { align: "center" });

  doc.setFillColor(40, 40, 40);
  doc.roundedRect(pageWidth / 2 - 60, 120, 120, 40, 5, 5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("Email:", pageWidth / 2, 135, { align: "center" });
  doc.setTextColor(...PRIMARY);
  doc.setFontSize(12);
  doc.text("jhon@hacemosloquenosgusta.com", pageWidth / 2, 150, { align: "center" });

  doc.setTextColor(150, 150, 150);
  doc.setFontSize(10);
  doc.text("www.vacilateesto.com", pageWidth / 2, 180, { align: "center" });

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text("© 2026 Vacílate Esto - Todos los derechos reservados", pageWidth / 2, pageHeight - 20, { align: "center" });

  // Return as base64
  return doc.output("datauristring").split(",")[1];
};

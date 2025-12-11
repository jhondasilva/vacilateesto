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

  // Platform cards
  const platforms = audienceData.platforms;
  const cardWidth = (pageWidth - margin * 2 - 20) / 3;
  let cardX = margin;
  let cardY = y;

  platforms.forEach((platform, index) => {
    if (index === 3) {
      cardX = margin + cardWidth / 2 + 5;
      cardY = y + 35;
    }
    if (index === 4) {
      cardX = margin + cardWidth * 1.5 + 15;
    }

    doc.setFillColor(...LIGHT_GRAY);
    doc.roundedRect(cardX, cardY, cardWidth, 30, 3, 3, "F");
    
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(platform.name, cardX + 5, cardY + 8);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(platform.followers, cardX + 5, cardY + 18);
    
    doc.setTextColor(34, 197, 94);
    doc.setFontSize(9);
    doc.text(platform.growth, cardX + 5, cardY + 25);
    
    cardX += cardWidth + 10;
  });

  y = cardY + 50;

  // Impressions section
  drawSectionTitle("Impresiones Totales");
  
  const impressionData = [
    { platform: "Facebook", value: audienceData.impressions.facebook, growth: audienceData.impressions.facebookGrowth },
    { platform: "Instagram", value: audienceData.impressions.instagram, growth: audienceData.impressions.instagramGrowth },
    { platform: "TikTok", value: audienceData.impressions.tiktok, growth: audienceData.impressions.tiktokGrowth },
    { platform: "YouTube", value: audienceData.impressions.youtube, growth: "" },
    { platform: "LinkedIn", value: audienceData.impressions.linkedin, growth: audienceData.impressions.linkedinGrowth },
  ];

  impressionData.forEach((item) => {
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(item.platform, margin, y);
    
    doc.setFont("helvetica", "bold");
    doc.text(item.value, pageWidth / 2, y);
    
    if (item.growth) {
      doc.setTextColor(34, 197, 94);
      doc.text(item.growth, pageWidth / 2 + 30, y);
    }
    
    y += 8;
  });

  y += 10;

  // Interactions section
  drawSectionTitle("Interacciones Totales");
  
  const interactionData = [
    { platform: "Facebook", value: audienceData.interactions.facebook },
    { platform: "Threads", value: audienceData.interactions.threads },
    { platform: "Instagram", value: audienceData.interactions.instagram },
    { platform: "YouTube", value: audienceData.interactions.youtube },
    { platform: "LinkedIn", value: audienceData.interactions.linkedin },
  ];

  interactionData.forEach((item) => {
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(item.platform, margin, y);
    
    doc.setFont("helvetica", "bold");
    doc.text(item.value, pageWidth / 2, y);
    
    y += 8;
  });

  // ==================== PAGE 3: DEMOGRAPHICS ====================
  addNewPage();
  drawHeader("DEMOGRAFÍA", "¿De Dónde Es Nuestra Audiencia?");

  // Countries
  drawSectionTitle("Top 10 Países");
  
  audienceData.demographics.countries.forEach((country, index) => {
    const num = (index + 1).toString();
    doc.setTextColor(...PRIMARY_COLOR);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(num, margin, y);
    
    doc.setTextColor(...DARK_COLOR);
    doc.setFont("helvetica", "normal");
    doc.text(country.name, margin + 10, y);
    
    doc.setFont("helvetica", "bold");
    doc.text(country.percentage, pageWidth - margin - 20, y);
    
    // Progress bar
    const barWidth = 60;
    const barX = pageWidth / 2;
    doc.setFillColor(...LIGHT_GRAY);
    doc.roundedRect(barX, y - 3, barWidth, 4, 2, 2, "F");
    
    const fillWidth = (parseFloat(country.percentage) / 50) * barWidth;
    doc.setFillColor(...PRIMARY_COLOR);
    doc.roundedRect(barX, y - 3, fillWidth, 4, 2, 2, "F");
    
    y += 9;
  });

  y += 10;

  // Regions
  drawSectionTitle("Top Regiones");
  
  audienceData.demographics.regions.forEach((region, index) => {
    const num = (index + 1).toString();
    doc.setTextColor(...ACCENT_COLOR);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(num, margin, y);
    
    doc.setTextColor(...DARK_COLOR);
    doc.setFont("helvetica", "normal");
    doc.text(region.name, margin + 10, y);
    
    doc.setFont("helvetica", "bold");
    doc.text(region.percentage, pageWidth - margin - 20, y);
    
    y += 9;
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
  doc.save("VacilateEsto-MediaKit-2026.pdf");
};

import jsPDF from "jspdf";
import logoVacilate from "@/assets/logo-vacilate-esto.png";

// Datos de audiencia
const audienceData = {
  totalFollowers: "1.84M",
  totalImpressions: "89.6M",
  totalInteractions: "5.2M",
  totalPublications: "6,705",
  platforms: [
    { name: "TikTok", followers: "1.16M", growth: "+3.88%" },
    { name: "Instagram", followers: "284.94K", growth: "+23.59%" },
    { name: "Facebook", followers: "214.03K", growth: "+13.58%" },
    { name: "YouTube", followers: "119K", growth: "+7.21%" },
    { name: "Threads", followers: "61.23K", growth: "+19.88%" },
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
  { 
    title: "Vacílate Esto Cuentos", 
    subtitle: "Shorts Diarios", 
    stats: "Diario · ~1 min",
    description: "Cuentos y anécdotas de aproximadamente un minuto que salen todos los días. Contenido viral que conecta con la audiencia.",
    platforms: "Facebook, Instagram, TikTok, YouTube Shorts"
  },
  { 
    title: "Podcast Vacílate Esto", 
    subtitle: "Formato Estrella", 
    stats: "Semanal · ~45 min",
    description: "Análisis y reflexiones profundas sobre historias, leyendas, datos curiosos y cultura venezolana.",
    platforms: "Radio Circuito Líder, Televen TV, YouTube, Spotify"
  },
  { 
    title: "Vacílate Esto Comiendo", 
    subtitle: "Serie Gastronómica", 
    stats: "Ruta del Ramen",
    description: "Juan y Jhon prueban distintas propuestas gastronómicas, desde lugares sencillos hasta restaurantes sofisticados.",
    platforms: "TikTok, Instagram, YouTube"
  },
  { 
    title: "Metraje", 
    subtitle: "Documental", 
    stats: "Formato aventura",
    description: "Jhon lleva a Juan o Juan lleva a Jhon a un lugar fuera del estudio y le explica por qué le lleva a ese lugar. Sirve de excusa para mostrarle a la comunidad lugares insólitos y sus historias.",
    platforms: "YouTube, Facebook"
  },
  { 
    title: "Lives", 
    subtitle: "En Vivo", 
    stats: "Shows en vivo",
    description: "Transformamos nuestro formato de estudio a una experiencia totalmente en vivo con la audiencia.",
    platforms: "Instagram, YouTube, TikTok"
  },
  { 
    title: "Streaming", 
    subtitle: "TikTok Live", 
    stats: "En directo",
    description: "Transmisiones en vivo en TikTok desde la grabación del podcast, fútbol en vivo o proyectos especiales como Roraima.",
    platforms: "TikTok"
  },
  { 
    title: "Guerra de Comerciales", 
    subtitle: "Campeonato Nacional", 
    stats: "40K+ votos",
    description: "Torneo estilo Mundial de Fútbol con los comerciales más icónicos de Venezuela. Covencaucho campeón.",
    platforms: "Instagram, TikTok"
  },
  { 
    title: "Rutas", 
    subtitle: "Exploraciones Temáticas", 
    stats: "Series temáticas",
    description: "Series de exploración donde recorremos lugares con un tema específico, como la Ruta del Ramen.",
    platforms: "TikTok, Instagram, YouTube"
  },
  { 
    title: "Newsletter", 
    subtitle: "Semanal", 
    stats: "Contenido curado",
    description: "Boletín informativo semanal con contenido curado y lo más visto del ecosistema.",
    platforms: "Email"
  },
  { 
    title: "Caminado", 
    subtitle: "Formato Aventura", 
    stats: "Exploraciones a pie",
    description: "Un formato más aventurero donde nos atrevemos a caminar partes de nuestro país.",
    platforms: "YouTube, TikTok"
  },
  { 
    title: "Canales de Difusión", 
    subtitle: "Comunidad VIP", 
    stats: "Instagram y WhatsApp",
    description: "Canales exclusivos con contenidos especiales para nuestras comunidades más fieles.",
    platforms: "Instagram, WhatsApp"
  },
  { 
    title: "Proyectos Especiales", 
    subtitle: "Producciones Únicas", 
    stats: "3 proyectos realizados",
    description: "Proyectos con identidad propia: Podcast Eterno, Podcast en la Cumbre y Pelotica de Goma.",
    platforms: "Multiplataforma"
  },
  { 
    title: "Vacílate El Mundial", 
    subtitle: "Cobertura Especial 2026", 
    stats: "Feb - Jul 2026",
    description: "El Mundial de Fútbol 2026 visto desde los ojos de Vacílate Esto con nuestro estilo único.",
    platforms: "Multiplataforma"
  },
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

// Colors - Brand colors matching the website
const PRIMARY_COLOR: [number, number, number] = [144, 0, 255]; // #9000ff - Purple
const SECONDARY_COLOR: [number, number, number] = [238, 80, 111]; // #ee506f - Pink/Rose
const DARK_COLOR: [number, number, number] = [20, 20, 20];
const GRAY_COLOR: [number, number, number] = [100, 100, 100];
const LIGHT_GRAY: [number, number, number] = [245, 245, 245];
const ACCENT_COLOR: [number, number, number] = [0, 217, 255]; // #00d9ff - Cyan accent

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

// Shared PDF generation logic
const generatePdfContent = async (doc: jsPDF, logoBase64: string | null) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = 0;

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
    
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 45, pageWidth, pageHeight - 45, "F");
    
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

  // ==================== PAGE 1: COVER ====================
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2], 0.1);
  doc.circle(pageWidth - 30, 50, 60, "F");
  doc.setFillColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2], 0.1);
  doc.circle(30, pageHeight - 60, 80, "F");

  doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2], 0.15);
  doc.roundedRect(pageWidth / 2 - 30, 35, 60, 12, 6, 6, "F");
  doc.setTextColor(...PRIMARY_COLOR);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("MEDIAKIT 2026", pageWidth / 2, 43, { align: "center" });

  if (logoBase64) {
    // Logo with proper aspect ratio (taller, not landscape)
    const logoWidth = 70;
    const logoHeight = 70;
    doc.addImage(logoBase64, "PNG", (pageWidth - logoWidth) / 2, 50, logoWidth, logoHeight);
  } else {
    doc.setTextColor(...PRIMARY_COLOR);
    doc.setFontSize(40);
    doc.setFont("helvetica", "bold");
    doc.text("VACÍLATE ESTO", pageWidth / 2, 80, { align: "center" });
  }

  doc.setTextColor(...PRIMARY_COLOR);
  doc.setFontSize(18);
  doc.text("El Ecosistema de Contenido", pageWidth / 2, 130, { align: "center" });
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Fun Educaitment", pageWidth / 2, 145, { align: "center" });

  doc.setTextColor(...GRAY_COLOR);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const desc = "Conectamos marcas con una audiencia apasionada de más de 1.84 millones de seguidores a través de contenido auténtico y entretenido.";
  const descLines = doc.splitTextToSize(desc, pageWidth - 60);
  doc.text(descLines, pageWidth / 2, 160, { align: "center" });

  const stats = [
    { value: "1.84M", label: "Comunidad" },
    { value: "89.6M", label: "Impresiones" },
    { value: "5.2M", label: "Interacciones" },
    { value: "6,705", label: "Publicaciones" },
  ];
  
  const boxWidth = 38;
  const boxGap = 8;
  const totalBoxWidth = (boxWidth * 4) + (boxGap * 3);
  let boxX = (pageWidth - totalBoxWidth) / 2;
  const boxY = 175;

  stats.forEach((stat) => {
    doc.setFillColor(...LIGHT_GRAY);
    doc.roundedRect(boxX, boxY, boxWidth, 35, 4, 4, "F");
    
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(stat.value, boxX + boxWidth / 2, boxY + 15, { align: "center" });
    
    doc.setTextColor(...GRAY_COLOR);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(stat.label, boxX + boxWidth / 2, boxY + 25, { align: "center" });
    
    boxX += boxWidth + boxGap;
  });

  doc.setTextColor(...GRAY_COLOR);
  doc.setFontSize(8);
  doc.text("Datos: 01 enero 2025 - 24 abril 2026 · Fuente: Metricool", pageWidth / 2, pageHeight - 20, { align: "center" });

  // ==================== PAGE 2: PLATFORM METRICS ====================
  addNewPage();
  drawHeader("NUESTRA PRESENCIA DIGITAL", "Métricas por Plataforma");

  const platformsWithValues = [
    { name: "TikTok", followers: "1.16M", growth: "+3.88%", value: 1160000, icon: "▶" },
    { name: "Instagram", followers: "284.94K", growth: "+23.59%", value: 284940, icon: "📷" },
    { name: "Facebook", followers: "214.03K", growth: "+13.58%", value: 214030, icon: "f" },
    { name: "YouTube", followers: "119K", growth: "+7.21%", value: 119000, icon: "▶" },
    { name: "Threads", followers: "61.23K", growth: "+19.88%", value: 61230, icon: "@" },
  ];

  const maxFollowers = 1820000;
  const cardWidth = (pageWidth - margin * 2 - 16) / 3;
  let cardX = margin;
  let cardY = y;

  platformsWithValues.forEach((platform, index) => {
    if (index === 3) {
      cardX = margin + cardWidth / 2 + 4;
      cardY = y + 45;
    }
    if (index === 4) {
      cardX = margin + cardWidth * 1.5 + 12;
    }

    doc.setFillColor(250, 250, 250);
    doc.roundedRect(cardX, cardY, cardWidth, 40, 4, 4, "F");
    
    doc.setFillColor(...PRIMARY_COLOR);
    doc.rect(cardX, cardY, cardWidth, 3, "F");
    
    doc.setFillColor(...DARK_COLOR);
    doc.circle(cardX + 12, cardY + 18, 6, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(platform.icon, cardX + 12, cardY + 20, { align: "center" });
    
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(platform.name, cardX + 22, cardY + 14);
    
    doc.setFontSize(14);
    doc.text(platform.followers, cardX + 22, cardY + 24);
    
    doc.setFillColor(220, 252, 231);
    doc.roundedRect(cardX + 22, cardY + 28, 25, 8, 2, 2, "F");
    doc.setTextColor(22, 163, 74);
    doc.setFontSize(7);
    doc.text(platform.growth, cardX + 34.5, cardY + 33, { align: "center" });
    
    const barWidth = cardWidth - 10;
    const progressPercent = (platform.value / maxFollowers) * 100;
    doc.setFillColor(230, 230, 230);
    doc.roundedRect(cardX + 5, cardY + 38, barWidth, 2, 1, 1, "F");
    doc.setFillColor(...PRIMARY_COLOR);
    doc.roundedRect(cardX + 5, cardY + 38, (barWidth * progressPercent) / 100, 2, 1, 1, "F");
    
    cardX += cardWidth + 8;
  });

  y = cardY + 60;

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
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(item.platform, margin, y + 2);
    
    const barX = margin + 35;
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(barX, y - 2, barMaxWidth, 6, 3, 3, "F");
    
    const fillWidth = (item.numValue / maxImpressions) * barMaxWidth;
    doc.setFillColor(...item.color);
    doc.roundedRect(barX, y - 2, fillWidth, 6, 3, 3, "F");
    
    doc.setTextColor(...DARK_COLOR);
    doc.setFont("helvetica", "bold");
    doc.text(item.value, barX + barMaxWidth + 5, y + 2);
    
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
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(item.platform, margin, y + 2);
    
    const barX = margin + 35;
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(barX, y - 2, barMaxWidth, 6, 3, 3, "F");
    
    const fillWidth = Math.max((item.numValue / maxInteractions) * barMaxWidth, 2);
    doc.setFillColor(...item.color);
    doc.roundedRect(barX, y - 2, fillWidth, 6, 3, 3, "F");
    
    doc.setTextColor(...DARK_COLOR);
    doc.setFont("helvetica", "bold");
    doc.text(item.value, barX + barMaxWidth + 5, y + 2);
    
    y += 12;
  });

  // ==================== PAGE 3: DEMOGRAPHICS ====================
  addNewPage();
  drawHeader("¿DE DÓNDE ES NUESTRA AUDIENCIA?", "Demografía y Distribución Geográfica");

  drawSectionTitle("Top 10 Países");
  
  const countryColors: [number, number, number][] = [
    [239, 68, 68],
    [234, 88, 12],
    [59, 130, 246],
    [34, 197, 94],
    [168, 85, 247],
    [236, 72, 153],
    [6, 182, 212],
    [245, 158, 11],
    [139, 92, 246],
    [20, 184, 166],
  ];
  
  audienceData.demographics.countries.forEach((country, index) => {
    doc.setFillColor(...(index === 0 ? PRIMARY_COLOR : LIGHT_GRAY));
    doc.circle(margin + 5, y, 5, "F");
    doc.setTextColor(index === 0 ? 255 : 60, index === 0 ? 255 : 60, index === 0 ? 255 : 60);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text((index + 1).toString(), margin + 5, y + 1.5, { align: "center" });
    
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(country.name, margin + 14, y + 1);
    
    const barWidth = 70;
    const barX = pageWidth / 2 - 10;
    const barHeight = 8;
    
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(barX, y - 4, barWidth, barHeight, 4, 4, "F");
    
    const fillWidth = Math.max((parseFloat(country.percentage) / 50) * barWidth, 3);
    doc.setFillColor(...countryColors[index]);
    doc.roundedRect(barX, y - 4, fillWidth, barHeight, 4, 4, "F");
    
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(country.percentage, pageWidth - margin - 5, y + 1, { align: "right" });
    
    y += 12;
  });

  y += 8;

  drawSectionTitle("Top Regiones");
  
  audienceData.demographics.regions.forEach((region, index) => {
    doc.setFillColor(...(index === 0 ? ACCENT_COLOR : LIGHT_GRAY));
    doc.circle(margin + 5, y, 5, "F");
    doc.setTextColor(index === 0 ? 20 : 60, index === 0 ? 20 : 60, index === 0 ? 20 : 60);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text((index + 1).toString(), margin + 5, y + 1.5, { align: "center" });
    
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(region.name, margin + 14, y + 1);
    
    const barWidth = 70;
    const barX = pageWidth / 2 - 10;
    
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(barX, y - 4, barWidth, 8, 4, 4, "F");
    
    const fillWidth = Math.max((parseFloat(region.percentage) / 20) * barWidth, 3);
    doc.setFillColor(...ACCENT_COLOR);
    doc.roundedRect(barX, y - 4, fillWidth, 8, 4, 4, "F");
    
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(region.percentage, pageWidth - margin - 5, y + 1, { align: "right" });
    
    y += 12;
  });

  // ==================== PAGE 4: CONTENT FORMATS ====================
  addNewPage();
  drawHeader("NUESTRO ECOSISTEMA DE CONTENIDO", "Formatos que Conectan");

  contentFormats.forEach((format, index) => {
    if (y > pageHeight - 45) {
      addNewPage();
      drawHeader("NUESTRO ECOSISTEMA DE CONTENIDO", "Formatos que Conectan");
    }
    
    doc.setFillColor(...LIGHT_GRAY);
    doc.roundedRect(margin, y - 3, pageWidth - margin * 2, 32, 3, 3, "F");
    
    const accentColor = index % 2 === 0 ? ACCENT_COLOR : PRIMARY_COLOR;
    doc.setFillColor(...accentColor);
    doc.rect(margin, y - 3, 4, 32, "F");
    
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(format.title, margin + 8, y + 4);
    
    doc.setTextColor(...GRAY_COLOR);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(format.subtitle, margin + 8, y + 11);
    
    // Description
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(8);
    const descLines = doc.splitTextToSize(format.description, pageWidth - margin * 2 - 60);
    doc.text(descLines[0] || "", margin + 8, y + 19);
    
    // Platforms
    if (format.platforms) {
      doc.setTextColor(...GRAY_COLOR);
      doc.setFontSize(7);
      doc.text(format.platforms, margin + 8, y + 26);
    }
    
    doc.setTextColor(...PRIMARY_COLOR);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(format.stats, pageWidth - margin - 5, y + 7, { align: "right" });
    
    y += 36;
  });

  // ==================== PAGE 5: TOP POSTS ====================
  addNewPage();
  drawHeader("CONTENIDO QUE GENERA IMPACTO", "Top Publicaciones del Período");

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
    
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, y + 8, pageWidth - margin, y + 8);
    
    y += 12;
  });

  y += 15;

  // Summary stats
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 30, 4, 4, "F");
  
  doc.setTextColor(...DARK_COLOR);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Resumen del Top 6", margin + 10, y + 12);
  
  doc.setTextColor(...GRAY_COLOR);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Total Impresiones: 6.75M+", margin + 10, y + 22);
  doc.text("Total Interacciones: 576K+", pageWidth / 2, y + 22);

  // ==================== PAGE 6: VACÍLATE EL MUNDIAL 2026 ====================
  addNewPage();
  drawHeader("VACÍLATE EL MUNDIAL 2026", "Proyecto Especial · Febrero - Julio 2026");

  // Intro
  doc.setTextColor(...DARK_COLOR);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const vemIntro = "El Mundial de Fútbol 2026 visto desde los ojos de Vacílate Esto. Contenido multiplataforma que combina Fun Educaitment, gastronomía y cobertura en vivo desde México, USA y Canadá.";
  const vemIntroLines = doc.splitTextToSize(vemIntro, pageWidth - margin * 2);
  doc.text(vemIntroLines, margin, y);
  y += 20;

  // Stats
  const vemStats = [
    { value: "2M+", label: "Audiencia Lista" },
    { value: "5", label: "Plataformas" },
    { value: "6", label: "Meses Cobertura" },
    { value: "3", label: "Países" },
  ];
  
  const vemBoxWidth = 38;
  const vemBoxGap = 8;
  const vemTotalBoxWidth = (vemBoxWidth * 4) + (vemBoxGap * 3);
  let vemBoxX = (pageWidth - vemTotalBoxWidth) / 2;

  vemStats.forEach((stat) => {
    doc.setFillColor(...LIGHT_GRAY);
    doc.roundedRect(vemBoxX, y, vemBoxWidth, 28, 4, 4, "F");
    
    doc.setTextColor(...PRIMARY_COLOR);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(stat.value, vemBoxX + vemBoxWidth / 2, y + 12, { align: "center" });
    
    doc.setTextColor(...GRAY_COLOR);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(stat.label, vemBoxX + vemBoxWidth / 2, y + 20, { align: "center" });
    
    vemBoxX += vemBoxWidth + vemBoxGap;
  });
  y += 38;

  drawSectionTitle("La Gran Expedición");
  
  const expeditionStops = [
    { city: "Houston", subtitle: "Base USA", desc: "Centro de operaciones en Estados Unidos" },
    { city: "Costa Este", subtitle: "Hub Fútbol", desc: "Nueva York, Miami - Pasión futbolera" },
    { city: "México", subtitle: "Inauguración + Final", desc: "El epicentro del Mundial 2026" },
  ];

  const stopWidth = (pageWidth - margin * 2 - 16) / 3;
  let stopX = margin;

  expeditionStops.forEach((stop, index) => {
    doc.setFillColor(...LIGHT_GRAY);
    doc.roundedRect(stopX, y, stopWidth, 35, 4, 4, "F");
    
    const stopColor = index === 0 ? PRIMARY_COLOR : (index === 1 ? ACCENT_COLOR : [34, 197, 94] as [number, number, number]);
    doc.setFillColor(...stopColor);
    doc.rect(stopX, y, stopWidth, 3, "F");
    
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(stop.city, stopX + 8, y + 14);
    
    doc.setTextColor(...PRIMARY_COLOR);
    doc.setFontSize(8);
    doc.text(stop.subtitle, stopX + 8, y + 21);
    
    doc.setTextColor(...GRAY_COLOR);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(stop.desc, stopX + 8, y + 28);
    
    stopX += stopWidth + 8;
  });
  y += 45;

  drawSectionTitle("Formatos de Contenido VEM");
  
  const vemFormats = [
    { title: "El Gol y la Comida", desc: "Gastronomía de México, USA y Canadá celebrando cada gol" },
    { title: "Vacílalo News", desc: "Noticias del Mundial con ironía y data insólita" },
    { title: "Desde el Estadio", desc: "Cobertura en vivo, zonas de hinchas y cánticos" },
    { title: "La Quiniela", desc: "App de predicciones deportivas en tiempo real" },
  ];

  vemFormats.forEach((format, index) => {
    const isEven = index % 2 === 0;
    const formatColor = isEven ? PRIMARY_COLOR : ACCENT_COLOR;
    doc.setFillColor(...formatColor);
    doc.circle(margin + 4, y + 2, 3, "F");
    
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(format.title, margin + 12, y + 4);
    
    doc.setTextColor(...GRAY_COLOR);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(format.desc, margin + 60, y + 4);
    
    y += 12;
  });

  y += 10;

  // Timeline
  drawSectionTitle("Cronograma 2026");
  
  const timeline = [
    { month: "Feb", event: "Inicio cobertura pre-Mundial" },
    { month: "Mar", event: "Contenido equipos e historias" },
    { month: "Abr", event: "Historias de sedes + gastronomía" },
    { month: "May", event: "Houston: Base de operaciones" },
    { month: "Jun", event: "Costa Este + México: En vivo" },
    { month: "Jul", event: "Final y cierre épico" },
  ];

  const timelineWidth = (pageWidth - margin * 2) / 6;
  let timeX = margin;

  timeline.forEach((item, index) => {
    const isHighlight = index >= 4;
    const timelineColor = isHighlight ? PRIMARY_COLOR : LIGHT_GRAY;
    doc.setFillColor(...timelineColor);
    doc.roundedRect(timeX, y, timelineWidth - 3, 25, 3, 3, "F");
    
    doc.setTextColor(isHighlight ? 255 : DARK_COLOR[0], isHighlight ? 255 : DARK_COLOR[1], isHighlight ? 255 : DARK_COLOR[2]);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(item.month, timeX + (timelineWidth - 3) / 2, y + 9, { align: "center" });
    
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    const eventLines = doc.splitTextToSize(item.event, timelineWidth - 6);
    doc.text(eventLines[0] || "", timeX + (timelineWidth - 3) / 2, y + 17, { align: "center" });
    
    timeX += timelineWidth;
  });

  // ==================== PAGE 7: SPONSORSHIP PLANS ====================
  addNewPage();
  drawHeader("TRABAJA CON NOSOTROS", "Planes de Patrocinio");

  sponsorshipPlans.forEach((plan, planIndex) => {
    if (y > pageHeight - 80) addNewPage();
    
    const isHighlighted = planIndex === 0;
    
    if (isHighlighted) {
      doc.setFillColor(...PRIMARY_COLOR);
    } else {
      doc.setFillColor(...LIGHT_GRAY);
    }
    doc.roundedRect(margin, y, pageWidth - margin * 2, 65, 5, 5, "F");
    
    if (isHighlighted) {
      doc.setTextColor(255, 255, 255);
    } else {
      doc.setTextColor(...PRIMARY_COLOR);
    }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(plan.name, margin + 10, y + 15);
    
    let featureY = y + 28;
    plan.features.forEach((feature) => {
      if (isHighlighted) {
        doc.setTextColor(255, 255, 255);
      } else {
        doc.setTextColor(...DARK_COLOR);
      }
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("✓ " + feature, margin + 10, featureY);
      featureY += 8;
    });
    
    y += 75;
  });

  // Custom solutions note
  y += 10;
  doc.setFillColor(...ACCENT_COLOR);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 25, 4, 4, "F");
  
  doc.setTextColor(...DARK_COLOR);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("¿Necesitas algo personalizado?", margin + 10, y + 10);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Creamos planes a medida según los objetivos de tu marca.", margin + 10, y + 18);

  // ==================== PAGE 7: CONTACT ====================
  addNewPage();
  
  doc.setFillColor(...DARK_COLOR);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  
  doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2], 0.2);
  doc.circle(pageWidth - 20, 40, 50, "F");
  doc.setFillColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2], 0.15);
  doc.circle(20, pageHeight - 50, 60, "F");

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

  doc.setFillColor(40, 40, 40);
  doc.roundedRect(pageWidth / 2 - 85, 145, 170, 65, 5, 5, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Email de contacto:", pageWidth / 2, 168, { align: "center" });
  
  doc.setTextColor(...PRIMARY_COLOR);
  doc.setFontSize(11);
  doc.text("elpatio@hacemosloquenosgusta.com", pageWidth / 2, 188, { align: "center" });

  doc.setTextColor(150, 150, 150);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("www.vacilateesto.com", pageWidth / 2, 220, { align: "center" });

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text("© 2026 Vacílate Esto - Todos los derechos reservados", pageWidth / 2, pageHeight - 20, { align: "center" });
};

export const generateMediaKitPdf = async () => {
  const doc = new jsPDF("p", "mm", "a4");

  let logoBase64: string | null = null;
  try {
    logoBase64 = await loadImageAsBase64(logoVacilate);
  } catch (e) {
    console.warn("Could not load logo:", e);
  }

  await generatePdfContent(doc, logoBase64);
  doc.save("Media Kit Vacilate Esto 2026.pdf");
};

export const generateMediaKitPdfBase64 = async (): Promise<string> => {
  const jsPDF = (await import("jspdf")).default;
  const doc = new jsPDF("p", "mm", "a4");

  let logoBase64: string | null = null;
  try {
    logoBase64 = await loadImageAsBase64(logoVacilate);
  } catch (e) {
    console.warn("Could not load logo:", e);
  }

  await generatePdfContent(doc, logoBase64);
  return doc.output("datauristring").split(",")[1];
};

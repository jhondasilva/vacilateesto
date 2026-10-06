import harinaPan from "@/assets/brand-logos-logo-harina-pan.png.asset.json";
import empire from "@/assets/brand-logos-logo-empire-keeway.png.asset.json";
import vatel from "@/assets/brand-logos-logo-vatel.png.asset.json";
import diablitos from "@/assets/brand-logos-logo-diablitos.png.asset.json";
import maggi from "@/assets/brand-logos-logo-maggi.png.asset.json";
import doritos from "@/assets/dashboard-doritos.png.asset.json";
import maltin from "@/assets/dashboard-maltin.png.asset.json";
import speedStick from "@/assets/dashboard-speed-stick.png.asset.json";
import planetaSport from "@/assets/dashboard-planeta-sport.png.asset.json";
import planB from "@/assets/dashboard-plan-b.png.asset.json";
import bancoVenezuela from "@/assets/dashboard-banco-de-venezuela.png.asset.json";
import clubSocial from "@/assets/dashboard-club-social.png.asset.json";
import ronco from "@/assets/dashboard-ronco.png.asset.json";
import quimicolor from "@/assets/dashboard-quimicolor.png.asset.json";
import solera from "@/assets/dashboard-solera.png.asset.json";
import pilsen from "@/assets/dashboard-pilsen-polar-color.png.asset.json";
import peloticaDashboard from "@/assets/pelotica-texto-negro-oficial.png.asset.json";
import podcast from "@/assets/logo-podcast-cumbre.avif";
import mundial from "@/assets/logo-mundial-2026.png";
import cocaCola from "@/assets/logo-coca-cola.png";
import kfc from "@/assets/logo-kfc.png";

/** "dark" is retained for compatibility and adds no background. */
export type LogoBg = "dark" | "light";
export type BrandLogo = { src: string; bg: LogoBg; viewport?: { imageWidth: number; imageHeight: number; x: number; y: number; width: number; height: number } };

export const PROJECT_SLUGS = ["pelotica-de-goma", "podcast-en-la-cumbre", "vacilate-el-mundial"];

/** Logos originales de marcas (Marcas Pelotica de Goma, sept 2026). Tienen prioridad sobre logo_url. */
export const BRAND_LOGO_MAP: Record<string, BrandLogo> = {
  "harina-pan": { src: harinaPan.url, bg: "dark" },
  "pan-pdg": { src: harinaPan.url, bg: "dark" },
  "doritos-pdg": { src: doritos.url, bg: "dark", viewport: { imageWidth: 1080, imageHeight: 1080, x: 113, y: 170, width: 880, height: 740 } },
  "maltin-pdg": { src: maltin.url, bg: "dark", viewport: { imageWidth: 1000, imageHeight: 1000, x: 3, y: 384, width: 994, height: 233 } },
  "speed-stick": { src: speedStick.url, bg: "dark", viewport: { imageWidth: 1080, imageHeight: 1080, x: 204, y: 256, width: 673, height: 569 } },
  "planeta-sport": { src: planetaSport.url, bg: "light", viewport: { imageWidth: 378, imageHeight: 150, x: 16, y: 40, width: 347, height: 74 } },
  "plan-b": { src: planB.url, bg: "dark", viewport: { imageWidth: 2048, imageHeight: 918, x: 18, y: 159, width: 2012, height: 600 } },
  "banco-de-venezuela": { src: bancoVenezuela.url, bg: "light", viewport: { imageWidth: 320, imageHeight: 320, x: 16, y: 136, width: 288, height: 48 } },
  "club-social": { src: clubSocial.url, bg: "dark" },
  ronco: { src: ronco.url, bg: "dark", viewport: { imageWidth: 1000, imageHeight: 1000, x: 127, y: 337, width: 770, height: 444 } },
  quimicolor: { src: quimicolor.url, bg: "light", viewport: { imageWidth: 682, imageHeight: 137, x: 0, y: 1, width: 682, height: 135 } },
  solera: { src: solera.url, bg: "dark", viewport: { imageWidth: 374, imageHeight: 283, x: 42, y: 31, width: 290, height: 207 } },
  "pilsen-pdg": { src: pilsen.url, bg: "dark", viewport: { imageWidth: 756, imageHeight: 632, x: 54, y: 62, width: 678, height: 536 } },
  "pelotica-de-goma": { src: peloticaDashboard.url, bg: "light", viewport: { imageWidth: 2000, imageHeight: 2000, x: 638, y: 278, width: 807, height: 1466 } },
  "podcast-en-la-cumbre": { src: podcast, bg: "dark" },
  "vacilate-el-mundial": { src: mundial, bg: "dark" },
  "coca-cola": { src: cocaCola, bg: "dark" },
  kfc: { src: kfc, bg: "dark" },
  empire: { src: empire.url, bg: "dark" },
  vatel: { src: vatel.url, bg: "dark" },
  maggi: { src: maggi.url, bg: "dark" },
  diablitos: { src: diablitos.url, bg: "light" },
  cashea: { src: "/images/brands/cashea.png", bg: "light" },
};

export const resolveBrandLogo = (
  slug: string | undefined | null,
  fallback?: string | null,
): BrandLogo | null => {
  if ((slug === "coca-cola" || slug === "kfc") && fallback) return { src: fallback, bg: "dark" };
  if (slug && BRAND_LOGO_MAP[slug]) return BRAND_LOGO_MAP[slug];
  return fallback ? { src: fallback, bg: "dark" } : null;
};

export const logoBoxClass = (bg: LogoBg) => (bg === "light" ? "dashboard-logo--light" : "");

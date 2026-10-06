import harinaPan from "@/assets/brand-logos-logo-harina-pan.png.asset.json";
import empire from "@/assets/brand-logos-logo-empire-keeway.png.asset.json";
import vatel from "@/assets/brand-logos-logo-vatel.png.asset.json";
import diablitos from "@/assets/brand-logos-logo-diablitos.png.asset.json";
import maggi from "@/assets/brand-logos-logo-maggi.png.asset.json";
import doritos from "@/assets/dashboard-doritos.png.asset.json";
import maltin from "@/assets/dashboard-maltin.png.asset.json";
import speedStick from "@/assets/dashboard-speed-stick.png.asset.json";
import pelotica from "@/assets/logo-pelotica-de-goma.png";
import podcast from "@/assets/logo-podcast-cumbre.avif";
import mundial from "@/assets/logo-mundial-2026.png";
import cocaCola from "@/assets/logo-coca-cola.png";
import kfc from "@/assets/logo-kfc.png";

/** "dark" is retained for compatibility and adds no background. */
export type LogoBg = "dark" | "light";
export type BrandLogo = { src: string; bg: LogoBg; viewport?: { size: number; x: number; y: number; width: number; height: number } };

export const PROJECT_SLUGS = ["pelotica-de-goma", "podcast-en-la-cumbre", "vacilate-el-mundial"];
const UNCONFIRMED_SLUGS = new Set(["banco-de-venezuela", "club-social", "pilsen-pdg", "plan-b", "planeta-sport", "quimicolor", "ronco", "solera"]);

/** Logos originales de marcas (Marcas Pelotica de Goma, sept 2026). Tienen prioridad sobre logo_url. */
export const BRAND_LOGO_MAP: Record<string, BrandLogo> = {
  "harina-pan": { src: harinaPan.url, bg: "dark" },
  "pan-pdg": { src: harinaPan.url, bg: "dark" },
  "doritos-pdg": { src: doritos.url, bg: "dark", viewport: { size: 1080, x: 113, y: 170, width: 880, height: 740 } },
  "maltin-pdg": { src: maltin.url, bg: "dark", viewport: { size: 1000, x: 3, y: 384, width: 994, height: 233 } },
  "speed-stick": { src: speedStick.url, bg: "dark", viewport: { size: 1080, x: 204, y: 256, width: 673, height: 569 } },
  "pelotica-de-goma": { src: pelotica, bg: "dark" },
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
  if (slug && UNCONFIRMED_SLUGS.has(slug)) return null;
  if (slug && BRAND_LOGO_MAP[slug]) return BRAND_LOGO_MAP[slug];
  return fallback ? { src: fallback, bg: "dark" } : null;
};

export const logoBoxClass = (bg: LogoBg) => (bg === "light" ? "bg-card" : "");

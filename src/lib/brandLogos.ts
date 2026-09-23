import harinaPan from "@/assets/brand-logos-logo-harina-pan.png.asset.json";
import empire from "@/assets/brand-logos-logo-empire-keeway.png.asset.json";
import vatel from "@/assets/brand-logos-logo-vatel.png.asset.json";
import diablitos from "@/assets/brand-logos-logo-diablitos.png.asset.json";
import maggi from "@/assets/brand-logos-logo-maggi.png.asset.json";

/** Fondo de la caja del logo: "dark" = caja negra, "light" = caja blanca (logos con tinta negra). */
export type LogoBg = "dark" | "light";
export type BrandLogo = { src: string; bg: LogoBg };

/** Logos originales de marcas (Marcas Pelotica de Goma, sept 2026). Tienen prioridad sobre logo_url. */
export const BRAND_LOGO_MAP: Record<string, BrandLogo> = {
  "harina-pan": { src: harinaPan.url, bg: "dark" },
  empire: { src: empire.url, bg: "dark" },
  vatel: { src: vatel.url, bg: "dark" },
  maggi: { src: maggi.url, bg: "dark" },
  diablitos: { src: diablitos.url, bg: "light" },
};

export const resolveBrandLogo = (
  slug: string | undefined | null,
  fallback?: string | null,
): BrandLogo | null => {
  if (slug && BRAND_LOGO_MAP[slug]) return BRAND_LOGO_MAP[slug];
  return fallback ? { src: fallback, bg: "dark" } : null;
};

export const logoBoxClass = (bg: LogoBg) => (bg === "light" ? "bg-white" : "bg-black");

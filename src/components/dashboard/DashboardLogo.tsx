import { useState } from "react";
import { resolveBrandLogo, logoBoxClass } from "@/lib/brandLogos";
import { cn } from "@/lib/utils";
import "./DashboardLogo.css";

type Props = { slug: string; name: string; fallback?: string | null; size?: "compact" | "card" | "feature" };

/** Shared, bounded logo viewport; only transparent margins are clipped. */
export default function DashboardLogo({ slug, name, fallback, size = "card" }: Props) {
  const logo = resolveBrandLogo(slug, fallback);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!logo || failedSrc === logo.src) return null; // Adjacent brand name remains visible.
  const viewport = logo.viewport;
  return (
    <span className={cn("dashboard-logo inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md", `dashboard-logo--${size}`, logoBoxClass(logo.bg))}>
      {viewport ? (
        <span className="relative block overflow-hidden" style={{ width: `min(100%, calc(var(--logo-height) * ${viewport.width / viewport.height}))`, aspectRatio: `${viewport.width} / ${viewport.height}` }}>
          <img src={logo.src} alt={`Logo de ${name}`} loading="lazy" onError={() => setFailedSrc(logo.src)} className="absolute max-w-none" style={{ width: `${viewport.imageWidth / viewport.width * 100}%`, height: `${viewport.imageHeight / viewport.height * 100}%`, left: `${-viewport.x / viewport.width * 100}%`, top: `${-viewport.y / viewport.height * 100}%` }} />
        </span>
      ) : (
        <img src={logo.src} alt={`Logo de ${name}`} loading="lazy" onError={() => setFailedSrc(logo.src)} className="h-full w-full object-contain" />
      )}
    </span>
  );
}
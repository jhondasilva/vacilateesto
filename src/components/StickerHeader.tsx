import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StickerHeaderProps {
  badge: string;
  badgeIcon?: LucideIcon;
  badgeVariant?: "dark" | "primary" | "accent" | "outline";
  title: string;
  highlight?: string;
  highlightPosition?: "before" | "after" | "middle";
  description?: string;
  align?: "left" | "center";
  className?: string;
  onDark?: boolean;
}

const BADGE_VARIANTS = {
  dark: "bg-foreground text-background border-foreground",
  primary: "bg-primary text-primary-foreground border-foreground",
  accent: "bg-accent text-accent-foreground border-foreground",
  outline: "bg-background text-foreground border-foreground",
};

/**
 * Section header with sticker badge + massive italic-gradient title.
 * Use across all home/internal sections for visual unity.
 */
const StickerHeader = ({
  badge,
  badgeIcon: Icon,
  badgeVariant = "dark",
  title,
  highlight,
  description,
  align = "center",
  className,
  onDark = false,
}: StickerHeaderProps) => {
  const alignClasses = align === "center" ? "text-center mx-auto items-center" : "text-left items-start";
  return (
    <header className={cn("flex flex-col mb-10 md:mb-16", alignClasses, className)}>
      <div
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 mb-5 self-start",
          align === "center" && "self-center",
          BADGE_VARIANTS[badgeVariant]
        )}
      >
        {Icon && <Icon className="w-3.5 h-3.5" aria-hidden="true" />}
        <span className="font-display font-black text-[10px] uppercase tracking-widest">{badge}</span>
      </div>
      <h2
        className={cn(
          "font-display font-black tracking-[-0.04em] leading-[0.88] text-[2.25rem] sm:text-5xl md:text-6xl lg:text-7xl",
          onDark ? "text-background" : "text-foreground"
        )}
      >
        {title}{" "}
        {highlight && <span className="text-gradient italic">{highlight}</span>}
        <span className={onDark ? "text-background" : "text-foreground"}>.</span>
      </h2>
      {description && (
        <p
          className={cn(
            "font-body text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mt-4 sm:mt-5",
            align === "center" && "mx-auto",
            onDark ? "text-background/70" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      )}
    </header>
  );
};

export default StickerHeader;

import { cn } from "@/lib/utils";

interface StickerMarqueeProps {
  items: string[];
  variant?: "dark" | "primary" | "accent";
  className?: string;
  reverse?: boolean;
  speed?: "slow" | "fast";
}

const VARIANTS = {
  dark: "bg-foreground text-background",
  primary: "bg-primary text-primary-foreground",
  accent: "bg-accent text-accent-foreground",
};

const StickerMarquee = ({ items, variant = "dark", className, reverse = false, speed = "slow" }: StickerMarqueeProps) => {
  const repeated = [...items, ...items, ...items, ...items];
  return (
    <div
      className={cn(
        "relative z-10 border-y-2 border-foreground overflow-hidden py-2",
        VARIANTS[variant],
        className
      )}
    >
      <div
        className={cn("flex whitespace-nowrap", speed === "fast" ? "animate-marquee-fast" : "animate-marquee")}
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className="font-display font-black text-sm md:text-base tracking-[0.15em] uppercase mx-6 inline-flex items-center"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default StickerMarquee;

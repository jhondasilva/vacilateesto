import { Link } from "react-router-dom";
import { Trophy, ArrowRight } from "lucide-react";

const AwardsBanner = () => {
  return (
    <section className="relative mt-20 bg-primary text-primary-foreground border-y-2 border-foreground overflow-hidden">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <Link
          to="/premios"
          className="flex items-center justify-center gap-3 sm:gap-4 group hover:opacity-95 transition-opacity"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-background text-primary rounded-full border-2 border-foreground shrink-0">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
          <span className="font-display font-black text-xs sm:text-sm md:text-base uppercase tracking-widest text-center leading-tight">
            ★ 5 finalistas FIAP 2026 · 8 shortlist Premios CIMA 2026
          </span>
          <span className="inline-flex items-center gap-1 font-display font-black text-[10px] uppercase tracking-widest border-b-2 border-background group-hover:border-primary-foreground transition-colors shrink-0">
            Ver más <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>
    </section>
  );
};

export default AwardsBanner;

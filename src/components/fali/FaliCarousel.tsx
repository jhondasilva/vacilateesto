import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { FaliCarouselText } from "./FaliArtworkText";
import "./Fali.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import slide01 from "@/assets/fali-carousel-01.jpg.asset.json";
import slide02 from "@/assets/fali-carousel-02.jpg.asset.json";
import slide03 from "@/assets/fali-carousel-03.jpg.asset.json";
import slide04 from "@/assets/fali-carousel-04.jpg.asset.json";
import slide05 from "@/assets/fali-carousel-05.jpg.asset.json";
import slide06 from "@/assets/fali-carousel-06.jpg.asset.json";
import slide07 from "@/assets/fali-carousel-07.jpg.asset.json";
import slide08 from "@/assets/fali-carousel-08.jpg.asset.json";
import slide09 from "@/assets/fali-carousel-09.jpg.asset.json";
import slide10 from "@/assets/fali-carousel-10.jpg.asset.json";
import slide11 from "@/assets/fali-carousel-11.jpg.asset.json";
import slide12 from "@/assets/fali-carousel-12.jpg.asset.json";

const slides = [
  slide01, slide02, slide03, slide04, slide05, slide06,
  slide07, slide08, slide09, slide10, slide11, slide12,
];

const FaliCarousel = ({ locale = "es" }: { locale?: "es" | "en" }) => {
  const english = locale === "en";
  const [viewportRef, carousel] = useEmblaCarousel({ loop: false, containScroll: false });
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!carousel) return;
    const update = () => setActive(carousel.selectedScrollSnap());
    update();
    carousel.on("select", update).on("reInit", update);
    return () => { carousel.off("select", update).off("reInit", update); };
  }, [carousel]);
  const goTo = (index: number) => carousel?.scrollTo(Math.max(0, Math.min(slides.length - 1, index)), window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  return (
    <div className="fali-carousel" role="region" aria-label={english ? "FALI editorial carousel — Spanish original artwork" : "Carrusel editorial de FALI"}>
      <div ref={viewportRef} className="overflow-hidden">
        <div className="fali-carousel-items">
          {slides.map((slide, index) => (
            <figure key={slide.url} className="fali-slide">
              <img src={slide.url} alt={english ? `Slide ${index + 1}: Spanish original. English equivalent below.` : `Lámina ${index + 1} del carrusel FALI`} loading={index < 2 ? "eager" : "lazy"} width="384" height="384" aria-describedby={english ? `fali-art-text-${index + 1}` : undefined} />
            </figure>
          ))}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="fali-carousel-pager flex-1" aria-label={english ? "Choose a slide" : "Elegir lámina"}>
          {slides.map((slide, index) => (
            <Button variant="ghost" key={slide.asset_id} type="button" aria-label={english ? `Go to slide ${index + 1}` : `Ir a la lámina ${index + 1}`} aria-current={active === index ? "true" : undefined} onClick={() => goTo(index)} className={`fali-carousel-dot ${active === index ? "is-active" : ""}`} />
          ))}
        </div>
        <span className="sr-only" aria-live="polite">{english ? `Slide ${active + 1} of ${slides.length}` : `Lámina ${active + 1} de ${slides.length}`}</span>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="icon" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label={english ? "Previous slide" : "Lámina anterior"}><ChevronLeft /></Button>
          <Button variant="outline" size="icon" onClick={() => goTo(active + 1)} disabled={active === slides.length - 1} aria-label={english ? "Next slide" : "Lámina siguiente"}><ChevronRight /></Button>
        </div>
      </div>
      {english && <FaliCarouselText />}
    </div>
  );
};
export default FaliCarousel;

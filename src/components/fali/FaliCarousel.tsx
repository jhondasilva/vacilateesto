import { useRef, useState } from "react";
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

const FaliCarousel = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(slides.length - 1, index));
    const track = trackRef.current;
    const child = track?.children.item(next) as HTMLElement | null;
    child?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    setActive(next);
  };

  return (
    <div className="fali-carousel" aria-label="Carrusel editorial de FALI">
      <div
        ref={trackRef}
        className="fali-carousel-track scrollbar-hide"
        onScroll={(event) => {
          const track = event.currentTarget;
          const first = track.firstElementChild as HTMLElement | null;
          if (!first) return;
          const gap = 16;
          setActive(Math.round(track.scrollLeft / (first.offsetWidth + gap)));
        }}
      >
        {slides.map((slide, index) => (
          <figure key={slide.url} className="fali-slide">
            <img
              src={slide.url}
              alt={`Lámina ${index + 1} del carrusel FALI`}
              loading={index < 2 ? "eager" : "lazy"}
              width="384"
              height="384"
            />
          </figure>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex gap-1.5" aria-label={`Lámina ${active + 1} de ${slides.length}`}>
          {slides.map((slide, index) => (
            <button
              key={slide.asset_id}
              type="button"
              aria-label={`Ir a la lámina ${index + 1}`}
              onClick={() => goTo(index)}
              className={`fali-carousel-dot ${active === index ? "is-active" : ""}`}
            />
          ))}
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="icon" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Lámina anterior">
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon" onClick={() => goTo(active + 1)} disabled={active === slides.length - 1} aria-label="Lámina siguiente">
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FaliCarousel;
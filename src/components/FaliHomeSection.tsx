import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import faliCover from "@/assets/fali-carousel-01.jpg.asset.json";

const FaliHomeSection = () => (
  <section id="fali" className="fali-home-section" aria-labelledby="fali-home-title">
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="fali-home-grid">
        <div className="fali-home-copy">
          <span className="fali-kicker">Ideas en movimiento · 2026</span>
          <h2 id="fali-home-title" className="fali-home-title">FALI</h2>
          <p className="fali-hand-note">Frustración de atención por latencia inútil</p>
          <p className="mt-7 max-w-xl text-lg font-semibold leading-relaxed md:text-xl">
            ¿Qué ocurre con una idea cuando la tecnología nos hace esperar?
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-fali-paper/75 md:text-lg">
            Una exploración de cómo la espera tecnológica puede desviar, debilitar, enriquecer o transformar el pensamiento creativo.
          </p>
          <Button asChild size="lg" className="fali-cta mt-8">
            <Link to="/fali">Explorar FALI <ArrowRight /></Link>
          </Button>
        </div>
        <Link to="/fali" className="fali-home-image" aria-label="Abrir la experiencia FALI">
          <img src={faliCover.url} alt="Portada editorial de FALI" loading="lazy" width="640" height="640" />
        </Link>
      </div>
    </div>
  </section>
);

export default FaliHomeSection;
import { ArrowDown, ArrowRight, Clock3, ExternalLink, Sparkles } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FaliCarousel from "@/components/fali/FaliCarousel";
import { Button } from "@/components/ui/button";
import infographic from "@/assets/fali-infografia.png.asset.json";
import cover from "@/assets/fali-carousel-01.jpg.asset.json";

const cycle = [
  ["01", "Idea inicial", "El usuario tiene un pensamiento, pregunta o intención creativa."],
  ["02", "Delegación a la IA", "La intención se convierte en una solicitud para la tecnología."],
  ["03", "Latencia", "El sistema procesa. El usuario espera."],
  ["04", "Atención en movimiento", "La mente se desplaza hacia otros estímulos y asociaciones."],
  ["05", "Respuesta", "La tecnología responde a la intención original."],
  ["06", "Un usuario diferente", "La respuesta llega a un estado mental que ya pudo cambiar."],
];

const outcomes = [
  ["Abandono", "La idea pierde relevancia y el usuario ya no la retoma.", "pink"],
  ["Debilitamiento", "La idea regresa con menos interés o profundidad.", "yellow"],
  ["Enriquecimiento", "La distracción introduce estímulos que aportan elementos útiles.", "green"],
  ["Transformación creativa", "La respuesta se combina con una idea emergente y genera un resultado distinto.", "violet"],
];

const hypotheses = [
  ["01", "Deriva creativa por latencia", "A mayor latencia, aumenta la probabilidad de que la atención se desplace hacia otros estímulos y cambie la dirección creativa."],
  ["02", "Deriva de interés", "La espera puede cambiar el nivel o la dirección del interés respecto de la intención original."],
  ["03", "Serendipia por interrupción", "Los estímulos encontrados durante la espera pueden introducir asociaciones inesperadas que enriquecen el resultado."],
  ["04", "Desincronización cognitiva", "La respuesta conserva la intención original, mientras el pensamiento humano continúa evolucionando."],
  ["05", "Efecto acumulativo", "Muchos ciclos de delegación, espera y retorno pueden producir una trayectoria creativa sustancialmente distinta."],
];

const Fali = () => (
  <div className="fali-page min-h-screen">
    <Helmet>
      <title>FALI | ¿Qué le hace la espera tecnológica a una idea?</title>
      <meta name="description" content="FALI explora cómo la latencia de la inteligencia artificial desplaza la atención y puede transformar la trayectoria creativa de una idea." />
      <link rel="canonical" href="https://www.vacilateesto.com/fali" />
      <meta property="og:type" content="article" />
      <meta property="og:title" content="FALI | Frustración de atención por latencia inútil" />
      <meta property="og:description" content="¿Qué ocurre con una idea cuando la tecnología nos hace esperar?" />
      <meta property="og:url" content="https://www.vacilateesto.com/fali" />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "FALI: ¿qué le hace la espera tecnológica a una idea?",
        description: "Una exploración sobre latencia, atención y creatividad.",
        datePublished: "2026-09-24",
        dateModified: "2026-09-24",
        inLanguage: "es-VE",
        mainEntityOfPage: "https://www.vacilateesto.com/fali",
        publisher: { "@type": "Organization", name: "Vacílate Esto", url: "https://www.vacilateesto.com" },
      })}</script>
    </Helmet>
    <Header />

    <main>
      <section className="fali-hero">
        <div className="container mx-auto grid min-h-[calc(100svh-5rem)] items-center gap-10 px-4 pb-12 pt-28 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div className="relative z-10">
            <span className="fali-kicker">Una idea de Vacílate Esto · 2026</span>
            <h1 className="fali-display mt-4">FALI</h1>
            <p className="fali-hand-note max-w-lg">Frustración de atención por latencia inútil</p>
            <h2 className="mt-8 max-w-2xl text-3xl font-black uppercase leading-[1.02] md:text-5xl">
              ¿Qué ocurre con una idea cuando la tecnología nos hace esperar?
            </h2>
            <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-fali-paper/75 md:text-lg">
              Entre la pregunta y la respuesta, la tecnología procesa. La atención humana no se detiene: se desplaza, asocia, cambia de interés y puede transformar la idea original.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="fali-cta"><a href="#explorar">Explorar la idea <ArrowDown /></a></Button>
              <Button asChild size="lg" variant="outline" className="fali-outline-button"><a href="https://www.youtube.com/watch?v=4t6r4ys5O58&t=1201s" target="_blank" rel="noopener noreferrer">Ver episodio <ExternalLink /></a></Button>
            </div>
          </div>
          <figure className="fali-hero-art">
            <img src={cover.url} alt="FALI, frustración de atención por latencia inútil" width="720" height="720" />
          </figure>
        </div>
      </section>

      <section id="explorar" className="fali-paper-band py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
            <div>
              <span className="fali-section-number">00 / La observación</span>
              <h2 className="fali-section-title mt-4">La espera también piensa</h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed md:text-xl">
              <p>FALI parte de una observación: cuando delegamos a la tecnología —especialmente a una IA— una parte de un proceso de pensamiento, aparece un intervalo entre la pregunta y la respuesta.</p>
              <p className="fali-highlight">Ese intervalo no es necesariamente tiempo vacío.</p>
              <p>Mientras la tecnología procesa, la atención humana continúa operando. Puede desplazarse hacia otros estímulos, generar nuevas asociaciones, cambiar de interés o abandonar la línea de pensamiento original.</p>
              <p>La IA responde a la intención que recibió en un momento determinado. Cuando llega la respuesta, el usuario puede encontrarse en un estado mental diferente al que tenía cuando formuló la pregunta.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="fali-ink-band py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div><span className="fali-section-number is-light">01 / El ciclo</span><h2 className="fali-section-title mt-4">Una idea con latencia</h2></div>
            <p className="max-w-md text-fali-paper/65">La tecnología pausa la respuesta. La mente sigue avanzando.</p>
          </div>
          <div className="fali-cycle-grid">
            {cycle.map(([number, title, text], index) => (
              <article key={number} className="fali-cycle-step">
                <div className="flex items-center justify-between"><span>{number}</span>{index < cycle.length - 1 && <ArrowRight aria-hidden="true" />}</div>
                <h3>{title}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="fali-paper-band py-20 md:py-28">
        <div className="container mx-auto px-4">
          <span className="fali-section-number">02 / Posibles resultados</span>
          <h2 className="fali-section-title mt-4 max-w-4xl">La idea puede tomar cuatro caminos</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {outcomes.map(([title, text, tone]) => <article key={title} className={`fali-outcome fali-outcome-${tone}`}><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="fali-ink-band py-20 md:py-28">
        <div className="container mx-auto px-4">
          <span className="fali-section-number is-light">03 / Hipótesis FALI</span>
          <h2 className="fali-section-title mt-4 max-w-4xl">Cinco mecanismos para observar</h2>
          <div className="mt-12 grid gap-px bg-fali-paper/20 md:grid-cols-2 lg:grid-cols-5">
            {hypotheses.map(([number, title, text]) => <article key={number} className="fali-hypothesis"><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="fali-paper-band py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><span className="fali-section-number">04 / Carrusel</span><h2 className="fali-section-title mt-4">La idea, lámina por lámina</h2></div>
            <p className="max-w-md text-fali-ink/65">Desliza para recorrer el concepto en su lenguaje visual original.</p>
          </div>
          <FaliCarousel />
        </div>
      </section>

      <section className="fali-infographic-band py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center"><span className="fali-kicker">El mapa completo</span><h2 className="fali-section-title mt-4">La infografía FALI</h2></div>
          <figure className="mx-auto max-w-5xl overflow-hidden border-4 border-fali-paper shadow-[12px_12px_0_hsl(var(--fali-pink))]">
            <img src={infographic.url} alt="Infografía completa sobre el ciclo, las trayectorias y las hipótesis de FALI" loading="lazy" width="1536" height="2304" />
          </figure>
        </div>
      </section>

      <section className="fali-paper-band py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><span className="fali-section-number">05 / El episodio</span><h2 className="fali-section-title mt-4">Escucha la conversación completa</h2></div>
            <p className="max-w-md text-fali-ink/65">El episodio que dio origen a esta página, directamente desde el canal de Vacílate Esto en YouTube.</p>
          </div>
          <div className="mx-auto aspect-video max-w-5xl overflow-hidden border-4 border-fali-ink shadow-[12px_12px_0_hsl(var(--fali-yellow))]">
            <iframe
              src="https://www.youtube-nocookie.com/embed/4t6r4ys5O58?start=1201&rel=0"
              title="FALI: el nuevo tiempo muerto de la era digital — Vacílate Esto"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="h-full w-full"
            />
          </div>
        </div>
      </section>

      <section className="fali-paper-band py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="fali-thesis">
            <Sparkles aria-hidden="true" />
            <span className="fali-section-number">Tesis provisional</span>
            <h2>La latencia tecnológica puede actuar como un agente de transformación creativa.</h2>
            <p>Comprender FALI nos permite diseñar mejores experiencias y aprovechar el potencial creativo que emerge durante la espera. La hipótesis más interesante es que la latencia puede alterar la creatividad en múltiples direcciones.</p>
          </div>
        </div>
      </section>

      <section className="fali-final-band py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <Clock3 className="mx-auto h-10 w-10" aria-hidden="true" />
          <p className="mt-6 text-sm font-black uppercase">Una pregunta para la comunidad</p>
          <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-black uppercase leading-none md:text-7xl">¿Cómo crees que la latencia ha cambiado tu proceso creativo?</h2>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="fali-dark-button"><a href="https://www.youtube.com/watch?v=4t6r4ys5O58&t=1201s" target="_blank" rel="noopener noreferrer">Ver el podcast <ExternalLink /></a></Button>
            <Button asChild size="lg" variant="outline" className="fali-dark-outline"><Link to="/blog/fali-frustracion-latencia-inutil">Leer el artículo <ArrowRight /></Link></Button>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Fali;
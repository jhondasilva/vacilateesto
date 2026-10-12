import { ArrowDown, ArrowRight, Clock3, ExternalLink, Sparkles } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FaliCarousel from "@/components/fali/FaliCarousel";
import { Button } from "@/components/ui/button";
import infographic from "@/assets/fali-infografia.png.asset.json";
import cover from "@/assets/fali-carousel-01.jpg.asset.json";
import { FaliInfographicText } from "@/components/fali/FaliArtworkText";
import FaliManifesto from "@/components/fali/FaliManifesto";
import { FaliLanguageLinks, FaliLocaleMetadata } from "@/components/fali/FaliLocale";

const cycle = [
  ["01", "Initial idea", "The user has a thought, question or creative intention."],
  ["02", "Delegation to AI", "The intention becomes a request to technology."],
  ["03", "Latency", "The system processes. The user waits."],
  ["04", "Attention in motion", "The mind moves towards other stimuli and associations."],
  ["05", "Answer", "Technology responds to the original intention."],
  ["06", "A different user", "The answer reaches a state of mind that may already have changed."],
];

const outcomes = [
  ["Abandonment", "The idea loses relevance and the user no longer returns to it.", "pink"],
  ["Weakening", "The idea returns with less interest or depth.", "yellow"],
  ["Enrichment", "Distraction introduces stimuli that bring useful elements.", "green"],
  ["Creative transformation", "The answer combines with an emerging idea and produces a different result.", "violet"],
];

const hypotheses = [
  ["01", "Latency-driven creative drift", "The hypothesis is that longer latency may make attention more likely to shift towards other stimuli and change creative direction."],
  ["02", "Interest drift", "Waiting may change the level or direction of interest in the original intention."],
  ["03", "Serendipity through interruption", "Stimuli encountered while waiting may introduce unexpected associations that enrich the result."],
  ["04", "Cognitive desynchronization", "The answer retains the original intention while human thinking continues to evolve."],
  ["05", "Cumulative effect", "Many cycles of delegation, waiting and return may produce a substantially different creative trajectory."],
];

const FaliEnglish = () => (
  <div className="fali-page fali-page-en min-h-screen">
    <FaliLocaleMetadata locale="en" />
    <Helmet>
      <title>FALI | What does technological waiting do to an idea?</title>
      <meta name="description" content="FALI is an editorial observation and five open hypotheses about how technological waiting may shift attention and transform an idea." />
      <link rel="canonical" href="https://www.vacilateesto.com/en/fali" />
      <meta property="og:type" content="article" />
      <meta property="og:title" content="FALI | Attention Frustration from Useless Latency" />
      <meta property="og:description" content="What does technological waiting do to an idea?" />
      <meta property="og:url" content="https://www.vacilateesto.com/en/fali" />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "FALI: what does technological waiting do to an idea?",
        description: "An editorial exploration of latency, attention and creativity.",
        datePublished: "2026-09-24",
        dateModified: "2026-09-24",
        inLanguage: "en",
        mainEntityOfPage: "https://www.vacilateesto.com/en/fali",
        publisher: { "@type": "Organization", name: "Vacílate Esto", url: "https://www.vacilateesto.com" },
      })}</script>
    </Helmet>
    <Header locale="en" />

    <main>
      <section className="fali-hero">
        <div className="container mx-auto grid min-h-[calc(100svh-5rem)] items-center gap-10 px-4 pb-12 pt-28 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div className="relative z-10">
            <FaliLanguageLinks locale="en" />
            <span className="fali-kicker">An idea from Vacílate Esto · 2026</span>
            <h1 className="fali-display mt-4">FALI</h1>
            <p className="fali-hand-note max-w-lg">Attention Frustration from Useless Latency</p>
            <h2 className="mt-8 max-w-2xl text-3xl font-black uppercase leading-[1.02] md:text-5xl">
              What does technological waiting do to an idea?
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed">FALI is the Spanish acronym <span lang="es">“Frustración de Atención por Latencia Inútil”</span>, roughly “Attention Frustration from Useless Latency”. This editorial observation and manifesto proposes five open hypotheses, not an established diagnosis, a proven study or a productivity method.</p>
            <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-fali-paper/75 md:text-lg">
              Between the question and the answer, technology processes. Human attention does not stop: it shifts, makes associations, changes interests and may transform the original idea.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="fali-cta"><a href="#explorar">Explore the idea <ArrowDown /></a></Button>
              <Button asChild size="lg" variant="outline" className="fali-outline-button"><a href="https://www.youtube.com/watch?v=4t6r4ys5O58&t=1201s" target="_blank" rel="noopener noreferrer">Watch episode (Spanish) <ExternalLink /></a></Button>
            </div>
          </div>
          <figure className="fali-hero-art">
            <img src={cover.url} alt="FALI cover artwork with the original Spanish acronym" width="720" height="720" />
            <figcaption className="px-3 py-2 text-sm">Spanish original: FALI — Attention Frustration from Useless Latency.</figcaption>
          </figure>
        </div>
      </section>

      <section id="explorar" className="fali-paper-band py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
            <div>
              <span className="fali-section-number">00 / The observation</span>
              <h2 className="fali-section-title mt-4">Waiting thinks, too</h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed md:text-xl">
              <p>FALI begins with an observation: when we delegate part of a thinking process to technology — especially AI — an interval appears between question and answer.</p>
              <p className="fali-highlight">That interval is not necessarily empty time.</p>
              <p>While technology processes, human attention keeps working. It may move towards other stimuli, form new associations, change interests or abandon the original line of thought.</p>
              <p>AI responds to the intention it received at a particular moment. When the answer arrives, the user may be in a different state of mind from the one they were in when they asked the question.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="fali-ink-band py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div><span className="fali-section-number is-light">01 / The cycle</span><h2 className="fali-section-title mt-4">An idea with latency</h2></div>
            <p className="max-w-md text-fali-paper/65">Technology pauses the answer. The mind keeps moving.</p>
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
          <span className="fali-section-number">02 / Possible outcomes</span>
          <h2 className="fali-section-title mt-4 max-w-4xl">An idea may take four paths</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {outcomes.map(([title, text, tone]) => <article key={title} className={`fali-outcome fali-outcome-${tone}`}><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="fali-ink-band py-20 md:py-28">
        <div className="container mx-auto px-4">
          <span className="fali-section-number is-light">03 / FALI hypotheses</span>
          <h2 className="fali-section-title mt-4 max-w-4xl">Five open hypotheses to observe</h2>
          <div className="mt-12 grid gap-px bg-fali-paper/20 md:grid-cols-2 lg:grid-cols-5">
            {hypotheses.map(([number, title, text]) => <article key={number} className="fali-hypothesis"><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="fali-paper-band py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><span className="fali-section-number">04 / Carousel</span><h2 className="fali-section-title mt-4">The idea, slide by slide</h2></div>
            <p className="max-w-md text-fali-ink/65">Original Spanish artwork. English text equivalents appear below; the lettering in the images remains Spanish.</p>
          </div>
          <FaliCarousel locale="en" />
        </div>
      </section>

      <section className="fali-infographic-band py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center"><span className="fali-kicker">The complete map</span><h2 className="fali-section-title mt-4">The FALI infographic</h2></div>
          <figure className="mx-auto max-w-5xl overflow-hidden border-4 border-fali-paper shadow-[12px_12px_0_hsl(var(--fali-pink))]">
            <img src={infographic.url} alt="Original Spanish infographic showing the FALI cycle, trajectories and hypotheses" loading="lazy" width="1536" height="2304" />
          </figure>
          <p className="mt-8 text-center text-base leading-relaxed">Spanish original artwork. The cycle, four possible outcomes and five hypotheses are explained in English above. A complete English text equivalent of the infographic follows.</p>
          <FaliInfographicText />
        </div>
      </section>

      <section className="fali-paper-band py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><span className="fali-section-number">05 / The episode</span><h2 className="fali-section-title mt-4">Hear the full conversation</h2></div>
            <p className="max-w-md text-fali-ink/65">The Spanish-language episode that inspired this page, from the Vacílate Esto YouTube channel.</p>
          </div>
          <div className="mx-auto aspect-video max-w-5xl overflow-hidden border-4 border-fali-ink shadow-[12px_12px_0_hsl(var(--fali-yellow))]">
            <iframe
              src="https://www.youtube-nocookie.com/embed/4t6r4ys5O58?start=1201&rel=0"
              title="FALI: the new downtime of the digital age — Vacílate Esto (Spanish audio)"
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
            <span className="fali-section-number">Provisional thesis</span>
            <h2>Technological latency may act as an agent of creative transformation.</h2>
            <p>Exploring FALI might help us think about better experiences and the creative potential that may emerge while waiting. The intriguing hypothesis is that latency may alter creativity in several directions.</p>
          </div>
        </div>
      </section>

      <FaliManifesto />

      <section className="fali-final-band py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <Clock3 className="mx-auto h-10 w-10" aria-hidden="true" />
          <p className="mt-6 text-sm font-black uppercase">A question for the community</p>
          <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-black uppercase leading-none md:text-7xl">How do you think latency has changed your creative process?</h2>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="fali-dark-button"><a href="https://www.youtube.com/watch?v=4t6r4ys5O58&t=1201s" target="_blank" rel="noopener noreferrer">Watch the episode (Spanish) <ExternalLink /></a></Button>
            <Button asChild size="lg" variant="outline" className="fali-dark-outline"><Link to="/blog/fali-frustracion-latencia-inutil">Read the article (Spanish) <ArrowRight /></Link></Button>
          </div>
        </div>
      </section>
    </main>
    <Footer locale="en" />
  </div>
);

export default FaliEnglish;
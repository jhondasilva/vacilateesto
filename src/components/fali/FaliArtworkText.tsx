import { carouselEnglish } from "@/content/fali/artwork.en";

export const FaliCarouselText = () => (
  <details className="mt-8 border-t border-fali-ink/25 pt-6">
    <summary className="cursor-pointer text-lg font-bold">English text equivalents — all 12 Spanish slides</summary>
    <p className="mt-4 max-w-3xl leading-relaxed">These translations follow the original artwork. The proposed mechanisms are open hypotheses, not verified findings. The images retain their original Spanish lettering and printed numbering.</p>
    <ol className="mt-6 grid gap-6 md:grid-cols-2">
      {carouselEnglish.map(([title, text], index) => <li id={`fali-art-text-${index + 1}`} key={title} className="border-t border-fali-ink/20 pt-4"><h3 className="font-bold">{index + 1}. {title}</h3><p className="mt-2 leading-relaxed">{text}</p></li>)}
    </ol>
  </details>
);

export const FaliInfographicText = () => (
  <details className="mx-auto mt-8 max-w-5xl border-t border-fali-paper/40 pt-6">
    <summary className="cursor-pointer text-lg font-bold">Read the infographic in English</summary>
    <div className="mt-6 space-y-6 text-base leading-relaxed">
      <p><strong>FALI — Frustración de Atención por Latencia Inútil.</strong> Roughly, Attention Frustration from Unnecessary Latency. What happens to an idea when technology makes us wait? FALI describes the experience that arises when a person is temporarily suspended, waiting for a technological response. During that latency, attention shifts, interests and associations change, and the creative trajectory of thinking may be transformed.</p>
      <h3 className="text-xl font-bold">The cycle of an idea with latency</h3>
      <p>{carouselEnglish[2][1]} The illustration says: “I want to explore this idea…”; “Processing…”; “Idea A? Idea B? Idea C?” Its timeline reads 1 second, 5 seconds, 10 seconds, 30 seconds, 2 minutes: illustrative intervals, not measured findings.</p>
      <h3 className="text-xl font-bold">Possible trajectories of an idea</h3>
      <p>During latency, attention may follow different paths. The AI response interacts with a mental state that may have changed. Idea A is the original intention.</p>
      <ul className="list-disc space-y-3 pl-6">
        <li><strong>Abandonment:</strong> the original idea loses relevance and the user no longer returns to it. The idea is set aside.</li>
        <li><strong>Weakening:</strong> the idea is resumed, but with less interest or depth. The answer has less impact.</li>
        <li><strong>Enrichment:</strong> distraction introduces new stimuli that bring useful elements. The answer is integrated with new ideas.</li>
        <li><strong>Creative transformation (serendipity):</strong> a new direction of thought emerges during the wait. The answer combines with an emerging idea, generating a different and potentially more creative result.</li>
      </ul>
      <h3 className="text-xl font-bold">FALI's main hypotheses</h3>
      <p>Possible mechanisms through which latency influences the creative trajectory of thinking. These remain hypotheses.</p>
      {carouselEnglish.slice(5, 10).map(([title, text]) => <p key={title}><strong>{title}:</strong> {text}</p>)}
      <p><strong>Key idea:</strong> technological latency is not merely empty time. It is an interval in which attention keeps operating and may modify the direction, interest and creative result of the thinking that initiated the interaction.</p>
      <p><strong>Original artwork conclusion:</strong> technological latency may act as an agent of creative transformation, not just a source of frustration. Understanding FALI allows us to design better experiences and harness the creative potential that emerges while waiting.</p>
      <p>The conclusion above translates the original artwork's stronger wording; on this page it is a provisional proposition, not a demonstrated benefit or a productivity method.</p>
      <p>Vacílate Esto · Ideas in motion · FALI / 2026.</p>
    </div>
  </details>
);

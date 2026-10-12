import ReactMarkdown from "react-markdown";
import { manifestoEnglish } from "@/content/fali/manifesto.en";

const FaliManifesto = () => (
  <section className="fali-ink-band py-20 md:py-28" id="manifesto">
    <div className="container mx-auto px-4">
      <span className="fali-section-number is-light">The manifesto</span>
      <h2 className="fali-section-title mt-4 max-w-4xl">Downtime is no longer idle.</h2>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed">An idea born from a conversation between Jhon and Juan on Vacílate Esto. An editorial invitation to observe, with five open hypotheses.</p>
      <details className="mt-8 border-t border-fali-paper/30 pt-6">
        <summary className="cursor-pointer text-lg font-bold">Read the full English manifesto</summary>
        <div className="fali-manifesto mt-10 max-w-3xl space-y-5 text-lg leading-relaxed">
          <ReactMarkdown>{manifestoEnglish}</ReactMarkdown>
        </div>
      </details>
    </div>
  </section>
);
export default FaliManifesto;

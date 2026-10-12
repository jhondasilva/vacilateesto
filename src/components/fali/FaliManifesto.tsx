import ReactMarkdown from "react-markdown";
import { manifestoEnglish } from "@/content/fali/manifesto.en";
import { manifestoSpanish } from "@/content/fali/manifesto.es";

const copy = {
  en: {
    id: "manifesto",
    label: "The manifesto",
    title: "Downtime is no longer idle.",
    intro: "An idea born from a conversation between Jhon and Juan on Vacílate Esto. An editorial invitation to observe, with five open hypotheses.",
    summary: "Read the full English manifesto",
    body: manifestoEnglish,
  },
  es: {
    id: "manifiesto",
    label: "El manifiesto",
    title: "El tiempo muerto ya no está muerto.",
    intro: "Una idea nacida de una conversación entre Jhon y Juan en Vacílate Esto. Una invitación editorial a observar, con cinco hipótesis abiertas.",
    summary: "Leer el manifiesto completo",
    body: manifestoSpanish,
  },
} as const;

const FaliManifesto = ({ locale = "en" }: { locale?: "es" | "en" }) => {
  const t = copy[locale];
  return (
    <section className="fali-ink-band py-20 md:py-28" id={t.id}>
      <div className="container mx-auto px-4">
        <span className="fali-section-number is-light">{t.label}</span>
        <h2 className="fali-section-title mt-4 max-w-4xl">{t.title}</h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed">{t.intro}</p>
        <details className="mt-8 border-t border-fali-paper/30 pt-6">
          <summary className="cursor-pointer text-lg font-bold">{t.summary}</summary>
          <div className="fali-manifesto mt-10 max-w-3xl space-y-5 text-lg leading-relaxed">
            <ReactMarkdown>{t.body}</ReactMarkdown>
          </div>
        </details>
      </div>
    </section>
  );
};
export default FaliManifesto;

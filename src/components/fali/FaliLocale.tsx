import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLayoutEffect } from "react";

export const FaliLanguageLinks = ({ locale = "es" }: { locale?: "es" | "en" }) => (
  <nav aria-label={locale === "en" ? "Page language" : "Idioma de la página"} className="mb-6 flex gap-2">
    <Button asChild variant="outline" size="sm" className="fali-outline-button"><Link to="/fali" lang="es" hrefLang="es" aria-current={locale === "es" ? "page" : undefined}>ES<span className="sr-only"> — Español</span></Link></Button>
    <Button asChild variant="outline" size="sm" className="fali-outline-button"><Link to="/en/fali" lang="en" hrefLang="en" aria-current={locale === "en" ? "page" : undefined}>EN<span className="sr-only"> — English</span></Link></Button>
  </nav>
);

export const FaliLocaleMetadata = ({ locale = "es" }: { locale?: "es" | "en" }) => {
  useLayoutEffect(() => {
    // The static home metadata is not owned by Helmet. Suspend it only on FALI,
    // then restore the exact nodes when leaving this bilingual experience.
    const selectors = ['link[rel="canonical"]', 'meta[name="description"]', 'meta[property^="og:"]', 'meta[name^="twitter:"]', 'script[type="application/ld+json"]'];
    const originals = Array.from(document.head.querySelectorAll(selectors.join(","))).filter(node => !node.hasAttribute("data-rh"));
    originals.forEach(node => node.remove());
    return () => { originals.forEach(node => document.head.appendChild(node)); };
  }, []);
  return (
  <Helmet htmlAttributes={{ lang: locale === "en" ? "en" : "es-VE" }}>
    <link rel="alternate" hrefLang="es" href="https://www.vacilateesto.com/fali" />
    <link rel="alternate" hrefLang="en" href="https://www.vacilateesto.com/en/fali" />
    <link rel="alternate" hrefLang="x-default" href="https://www.vacilateesto.com/fali" />
    <meta property="og:locale" content={locale === "en" ? "en_US" : "es_VE"} />
    <meta property="og:locale:alternate" content={locale === "en" ? "es_VE" : "en_US"} />
    <meta name="twitter:title" content={locale === "en" ? "FALI | What does technological waiting do to an idea?" : "FALI | ¿Qué le hace la espera tecnológica a una idea?"} />
    <meta name="twitter:description" content={locale === "en" ? "An editorial observation and five open hypotheses about waiting, attention and creativity." : "¿Qué ocurre con una idea cuando la tecnología nos hace esperar?"} />
  </Helmet>
  );
};
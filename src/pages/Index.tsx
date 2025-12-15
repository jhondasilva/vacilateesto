import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import HeroSection from "@/components/HeroSection";
import EpisodesSection from "@/components/EpisodesSection";
import HostsSection from "@/components/HostsSection";
import EcosystemSection from "@/components/EcosystemSection";
import PeloticaSection from "@/components/PeloticaSection";
import RutaRamenSection from "@/components/RutaRamenSection";
import AgendaSection from "@/components/AgendaSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Vacílate Esto | El Mejor Podcast de Venezuela 🇻🇪 Humor y Entretenimiento</title>
        <meta name="description" content="El podcast venezolano #1 en entretenimiento. Vacílate Esto es el mejor podcast hecho en Venezuela con humor, cultura pop, historias increíbles y conversaciones sin filtro. Escúchanos en Spotify y YouTube." />
        <link rel="canonical" href="https://www.vacilateesto.com" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main role="main" aria-label="Contenido principal del podcast Vacílate Esto">
          <article itemScope itemType="https://schema.org/PodcastSeries">
            <meta itemProp="name" content="Vacílate Esto" />
            <meta itemProp="description" content="El mejor podcast de Venezuela. Humor, cultura y entretenimiento hecho en Venezuela." />
            <meta itemProp="inLanguage" content="es-VE" />
            <HeroBanner />
            <HeroSection />
            <EpisodesSection />
            <HostsSection />
            <EcosystemSection />
            <AgendaSection />
            <PeloticaSection />
            <RutaRamenSection />
            <NewsletterSection />
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;

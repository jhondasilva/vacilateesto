import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import HeroSection from "@/components/HeroSection";
import EpisodesSection from "@/components/EpisodesSection";
import HostsSection from "@/components/HostsSection";
import EcosystemSection from "@/components/EcosystemSection";
import PlatformsSection from "@/components/PlatformsSection";
import AgendaSection from "@/components/AgendaSection";
import PeloticaSection from "@/components/PeloticaSection";
import GuerraComercialesSection from "@/components/GuerraComercialesSection";
import VacilateElMundialSection from "@/components/VacilateElMundialSection";
import RutaRamenSection from "@/components/RutaRamenSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Vacílate Esto | El Mejor Podcast de Venezuela 🇻🇪 Humor, Entretenimiento y Mundial 2026</title>
        <meta name="description" content="El podcast venezolano #1 en entretenimiento. Vacílate Esto combina humor, cultura pop e historias increíbles. Descubre Vacílate El Mundial 2026, Campeonato de Comerciales, Podcast en la Cumbre y más. Escúchanos en Spotify y YouTube." />
        <meta name="keywords" content="podcast venezuela, vacilate esto, mundial 2026, podcast español, entretenimiento venezolano, humor venezuela, campeonato comerciales, podcast cumbre, fun educaitment" />
        <link rel="canonical" href="https://www.vacilateesto.com" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Vacílate Esto | El Mejor Podcast de Venezuela" />
        <meta property="og:description" content="El podcast venezolano #1. Humor, cultura pop, Mundial 2026, Campeonato de Comerciales y más. 2M+ seguidores." />
        <meta property="og:url" content="https://www.vacilateesto.com" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vacílate Esto | El Mejor Podcast de Venezuela" />
        <meta name="twitter:description" content="El podcast venezolano #1. Humor, cultura pop, Mundial 2026 y más. 2M+ seguidores." />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "PodcastSeries",
            "name": "Vacílate Esto",
            "description": "El podcast venezolano #1 en entretenimiento. Fun Educaitment que combina humor, cultura pop e historias increíbles.",
            "url": "https://www.vacilateesto.com",
            "inLanguage": "es-VE",
            "author": [
              {
                "@type": "Person",
                "name": "Juan Carlos Martínez",
                "alternateName": "JuanSofa"
              },
              {
                "@type": "Person", 
                "name": "Jhon Da Silva",
                "alternateName": "JhonSnacks"
              }
            ],
            "publisher": {
              "@type": "Organization",
              "name": "El Patio Content Studio"
            },
            "genre": ["Entertainment", "Comedy", "Culture"],
            "hasPart": [
              {
                "@type": "CreativeWork",
                "name": "Vacílate El Mundial 2026",
                "description": "Contenido multiplataforma sobre el Mundial de Fútbol 2026 en México, USA y Canadá. Fun Educaitment aplicado al fútbol.",
                "startDate": "2026-02",
                "endDate": "2026-07"
              },
              {
                "@type": "CreativeWork",
                "name": "Campeonato de Comerciales",
                "description": "Torneo que celebra los comerciales más icónicos de Venezuela con votación de la comunidad."
              },
              {
                "@type": "CreativeWork",
                "name": "Podcast en la Cumbre",
                "description": "Podcast grabado en las cumbres más emblemáticas de Venezuela."
              }
            ]
          })}
        </script>
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
            <PlatformsSection />
            <AgendaSection />
            <PeloticaSection />
            <GuerraComercialesSection />
            <VacilateElMundialSection />
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

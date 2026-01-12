import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import HeroSection from "@/components/HeroSection";
import MediaHoldingSection from "@/components/MediaHoldingSection";
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
        <title>Vacílate Esto | Ecosistema de Entretenimiento #1 de Venezuela 🇻🇪 Fútbol, Gastronomía, Historia</title>
        <meta name="description" content="Vacílate Esto es la marca de entretenimiento y contenidos #1 de Venezuela. Un ecosistema completo de Fun Educaitment: podcast, shorts, lives, docuseries. Fútbol, gastronomía, historia, leyendas y mitos urbanos. Vacílate El Mundial 2026 y más." />
        <meta name="keywords" content="vacilate esto, entretenimiento venezuela, contenido venezolano, mundial 2026, fun educaitment, futbol, gastronomia, historia, leyendas, mitos urbanos, podcast venezuela" />
        <link rel="canonical" href="https://www.vacilateesto.com" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Vacílate Esto | Ecosistema de Entretenimiento #1 de Venezuela" />
        <meta property="og:description" content="La marca de entretenimiento venezolana #1. Ecosistema de Fun Educaitment: fútbol, gastronomía, historia, leyendas y mitos urbanos. 2M+ seguidores." />
        <meta property="og:url" content="https://www.vacilateesto.com" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vacílate Esto | Ecosistema de Entretenimiento de Venezuela" />
        <meta name="twitter:description" content="La marca de entretenimiento venezolana #1. Fun Educaitment: fútbol, gastronomía, historia y mitos urbanos. 2M+ seguidores." />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Vacílate Esto",
            "description": "Ecosistema de entretenimiento y contenidos venezolano #1. Fun Educaitment que combina fútbol, gastronomía e historia con leyendas, datos insólitos y mitos urbanos.",
            "url": "https://www.vacilateesto.com",
            "inLanguage": "es-VE",
            "founder": [
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
            "parentOrganization": {
              "@type": "Organization",
              "name": "El Patio Content Studio"
            },
            "knowsAbout": ["Entertainment", "Sports", "Food", "History", "Culture", "Venezuelan Content"],
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
          <article itemScope itemType="https://schema.org/Organization">
            <meta itemProp="name" content="Vacílate Esto" />
            <meta itemProp="description" content="Ecosistema de entretenimiento y contenidos #1 de Venezuela. Fun Educaitment: fútbol, gastronomía, historia, leyendas y mitos urbanos." />
            <meta itemProp="inLanguage" content="es-VE" />
            <HeroBanner />
            <HeroSection />
            <MediaHoldingSection />
            <VacilateElMundialSection />
            <EpisodesSection />
            <HostsSection />
            <EcosystemSection />
            <PlatformsSection />
            <AgendaSection />
            <PeloticaSection />
            <GuerraComercialesSection />
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

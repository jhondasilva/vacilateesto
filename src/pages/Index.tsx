import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import HeroSection from "@/components/HeroSection";
import MediaHoldingSection from "@/components/MediaHoldingSection";
import EpisodesSection from "@/components/EpisodesSection";
import ShortsSection from "@/components/ShortsSection";
import HomeSearchSection from "@/components/HomeSearchSection";
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
        <title>Vacílate Esto | Uno de los Podcasts Favoritos de Venezuela 🇻🇪 Entretenimiento, Fútbol, Gastronomía e Historia</title>
        <meta name="description" content="Vacílate Esto: uno de los podcasts favoritos de Venezuela y ecosistema de entretenimiento #1. Fun Educaitment con fútbol, gastronomía, historia, leyendas y mitos urbanos. 2M+ seguidores. Escúchanos en Spotify, YouTube y todas las plataformas. Vacílate El Mundial 2026." />
        <meta name="keywords" content="podcast venezuela, mejor podcast venezolano, vacilate esto, podcast español, entretenimiento venezuela, mundial 2026, fun educaitment, podcast futbol, podcast gastronomia, podcast historia, leyendas venezuela, mitos urbanos, juansofa, jhonsnacks" />
        <link rel="canonical" href="https://www.vacilateesto.com" />
        
        {/* Robots */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Geo tags */}
        <meta name="geo.region" content="VE" />
        <meta name="geo.placename" content="Venezuela" />
        <meta name="content-language" content="es-VE" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Vacílate Esto" />
        <meta property="og:title" content="Vacílate Esto | Uno de los Podcasts Favoritos de Venezuela" />
        <meta property="og:description" content="Uno de los podcasts favoritos de Venezuela y ecosistema de entretenimiento. Fun Educaitment: fútbol, gastronomía, historia, leyendas y mitos urbanos. 2M+ seguidores." />
        <meta property="og:url" content="https://www.vacilateesto.com" />
        <meta property="og:locale" content="es_VE" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vacilateesto" />
        <meta name="twitter:title" content="Vacílate Esto | Uno de los Podcasts Favoritos de Venezuela" />
        <meta name="twitter:description" content="Uno de los podcasts favoritos de Venezuela. Fun Educaitment: fútbol, gastronomía, historia y mitos urbanos. 2M+ seguidores." />
        
        {/* JSON-LD Structured Data - Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "https://www.vacilateesto.com/#organization",
            "name": "Vacílate Esto",
            "alternateName": ["Vacilate Esto", "Vacílate Esto Podcast", "VE Podcast"],
            "description": "Uno de los podcasts favoritos de Venezuela y ecosistema de entretenimiento #1. Fun Educaitment que combina fútbol, gastronomía e historia con leyendas, datos insólitos y mitos urbanos.",
            "url": "https://www.vacilateesto.com",
            "logo": "https://www.vacilateesto.com/favicon.png",
            "image": "https://www.vacilateesto.com/favicon.png",
            "foundingDate": "2020",
            "foundingLocation": {
              "@type": "Place",
              "name": "Caracas, Venezuela"
            },
            "areaServed": {
              "@type": "Country",
              "name": "Venezuela"
            },
            "inLanguage": "es-VE",
            "founder": [
              {
                "@type": "Person",
                "name": "Juan Carlos Martínez",
                "alternateName": "JuanSofa",
                "sameAs": "https://www.instagram.com/juansofa"
              },
              {
                "@type": "Person", 
                "name": "Jhon Da Silva",
                "alternateName": "JhonSnacks",
                "sameAs": "https://www.instagram.com/jhonsnacks"
              }
            ],
            "sameAs": [
              "https://www.youtube.com/@Vacilateestopodcast",
              "https://www.instagram.com/vacilateestopodcast",
              "https://www.tiktok.com/@vacilateesto",
              "https://open.spotify.com/show/2b2AeZVRxEFkNy1KKYkQG1",
              "https://www.twitch.tv/vacilateesto"
            ],
            "parentOrganization": {
              "@type": "Organization",
              "name": "El Patio Content Studio"
            },
            "knowsAbout": ["Podcast", "Entertainment", "Sports", "Football", "Food", "Gastronomy", "History", "Venezuelan Culture", "Urban Legends"]
          })}
        </script>
        
        {/* JSON-LD Structured Data - PodcastSeries */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "PodcastSeries",
            "@id": "https://www.vacilateesto.com/#podcast",
            "name": "Vacílate Esto Podcast",
            "description": "Uno de los podcasts favoritos de Venezuela. Entretenimiento divertido sobre fútbol, gastronomía, historia, leyendas y mitos urbanos. Fun Educaitment hecho en Venezuela.",
            "url": "https://www.vacilateesto.com",
            "webFeed": "https://open.spotify.com/show/2b2AeZVRxEFkNy1KKYkQG1",
            "inLanguage": "es-VE",
            "author": {
              "@id": "https://www.vacilateesto.com/#organization"
            },
            "genre": ["Entertainment", "Sports", "Food", "History", "Culture"],
            "keywords": "podcast venezuela, entretenimiento, futbol, gastronomia, historia, leyendas, mitos urbanos",
            "countryOfOrigin": {
              "@type": "Country",
              "name": "Venezuela"
            },
            "potentialAction": {
              "@type": "ListenAction",
              "target": [
                {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://open.spotify.com/show/2b2AeZVRxEFkNy1KKYkQG1",
                  "actionPlatform": "https://schema.org/DesktopWebPlatform"
                },
                {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://www.youtube.com/@Vacilateestopodcast",
                  "actionPlatform": "https://schema.org/DesktopWebPlatform"
                }
              ]
            }
          })}
        </script>
        
        {/* JSON-LD Structured Data - WebSite with SearchAction */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Vacílate Esto",
            "alternateName": "Uno de los Podcasts Favoritos de Venezuela",
            "url": "https://www.vacilateesto.com",
            "description": "Sitio oficial de Vacílate Esto, uno de los podcasts favoritos de Venezuela y ecosistema de entretenimiento #1.",
            "inLanguage": "es-VE",
            "publisher": {
              "@id": "https://www.vacilateesto.com/#organization"
            }
          })}
        </script>
        
        {/* JSON-LD Structured Data - FAQPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "¿Cuál es el mejor podcast de Venezuela?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Vacílate Esto es considerado el mejor podcast de Venezuela, liderando en entretenimiento con más de 2 millones de seguidores. Es un ecosistema completo de Fun Educaitment que combina fútbol, gastronomía, historia, leyendas y mitos urbanos."
                }
              },
              {
                "@type": "Question",
                "name": "¿De qué trata el podcast Vacílate Esto?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Vacílate Esto es un ecosistema de entretenimiento venezolano que incluye podcast, shorts, lives y docuseries. Combina fútbol, gastronomía e historia con leyendas, datos insólitos y mitos urbanos bajo el concepto Fun Educaitment."
                }
              },
              {
                "@type": "Question",
                "name": "¿Dónde puedo escuchar Vacílate Esto?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Vacílate Esto está disponible gratis en Spotify, YouTube, Apple Podcasts, TikTok, Twitch y todas las plataformas principales de podcast. También se transmite en FM Center en Venezuela."
                }
              },
              {
                "@type": "Question",
                "name": "¿Quiénes son los hosts de Vacílate Esto?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Los hosts son Juan Carlos Martínez (JuanSofa) y Jhon Da Silva (JhonSnacks), dos creadores de contenido venezolanos que fundaron Vacílate Esto para combinar entretenimiento y educación."
                }
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
            <HomeSearchSection />
            <MediaHoldingSection />
            <VacilateElMundialSection />
            <EpisodesSection />
            <ShortsSection />
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

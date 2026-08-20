import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import AwardsBanner from "@/components/AwardsBanner";
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
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Vacílate Esto | Podcast favorito de Venezuela 🇻🇪</title>
        <meta name="description" content="Ecosistema de Fun Educaitment con fútbol, gastronomía e historia. 2M+ seguidores. Escúchanos en Spotify, YouTube y todas las plataformas." />
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
            "description": "Una de las marcas de entretenimiento digital más relevantes de Venezuela, hecha en Venezuela. Combina podcast, social media, contenidos para redes y eventos como Pelotica de Goma, Podcast en la Cumbre y el Podcast Eterno. Fun Educaitment que combina fútbol, gastronomía e historia con leyendas, datos insólitos y mitos urbanos.",
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
            "description": "Sitio oficial de Vacílate Esto, una de las marcas de entretenimiento digital más relevantes de Venezuela, hecha en Venezuela. Combina podcast, social media, contenidos para redes y eventos como Pelotica de Goma, Podcast en la Cumbre y el Podcast Eterno.",
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
                  "text": "Vacílate Esto está disponible gratis en Spotify, YouTube, Apple Podcasts, TikTok, Twitch y todas las plataformas principales de podcast."
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

        {/* JSON-LD Structured Data - ItemList of Home sections (sitelinks + AI navigation) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Secciones de Vacílate Esto",
            "description": "Mapa de las secciones, proyectos y plataformas del ecosistema Vacílate Esto.",
            "itemListOrder": "https://schema.org/ItemListOrderAscending",
            "numberOfItems": 15,
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "url": "https://www.vacilateesto.com/#hero" },
              { "@type": "ListItem", "position": 2, "name": "Buscador del podcast", "url": "https://www.vacilateesto.com/#search" },
              { "@type": "ListItem", "position": 3, "name": "Blog de Vacílate Esto", "url": "https://www.vacilateesto.com/#blog" },
              { "@type": "ListItem", "position": 4, "name": "Media Holding · Ecosistema", "url": "https://www.vacilateesto.com/#media-holding" },
              { "@type": "ListItem", "position": 5, "name": "Vacílate El Fútbol 2026", "url": "https://www.vacilateesto.com/#vacilate-el-futbol" },
              { "@type": "ListItem", "position": 6, "name": "Episodios recientes", "url": "https://www.vacilateesto.com/#episodes" },
              { "@type": "ListItem", "position": 7, "name": "Shorts y Cuentos", "url": "https://www.vacilateesto.com/#shorts" },
              { "@type": "ListItem", "position": 8, "name": "Hosts: JuanSofa & JhonSnacks", "url": "https://www.vacilateesto.com/#hosts" },
              { "@type": "ListItem", "position": 9, "name": "Ecosistema de contenido", "url": "https://www.vacilateesto.com/#ecosistema" },
              { "@type": "ListItem", "position": 10, "name": "Plataformas (Spotify, YouTube, Apple Podcasts)", "url": "https://www.vacilateesto.com/#plataformas" },
              { "@type": "ListItem", "position": 11, "name": "Agenda y eventos", "url": "https://www.vacilateesto.com/#agenda" },
              { "@type": "ListItem", "position": 12, "name": "Pelotica de Goma · Béisbol", "url": "https://www.vacilateesto.com/#pelotica-de-goma" },
              { "@type": "ListItem", "position": 13, "name": "Guerra de Comerciales", "url": "https://www.vacilateesto.com/#guerra-comerciales" },
              { "@type": "ListItem", "position": 14, "name": "Ruta Ramen", "url": "https://www.vacilateesto.com/#ruta-ramen" },
              { "@type": "ListItem", "position": 15, "name": "Newsletter", "url": "https://www.vacilateesto.com/#newsletter" }
            ]
          })}
        </script>

        {/* JSON-LD - SiteNavigationElement (sub-pages and projects for Google + AI crawlers) */}
        <script type="application/ld+json">
          {JSON.stringify([
            { "@context": "https://schema.org", "@type": "SiteNavigationElement", "position": 1, "name": "Inicio", "url": "https://www.vacilateesto.com/" },
            { "@context": "https://schema.org", "@type": "SiteNavigationElement", "position": 2, "name": "Blog", "url": "https://www.vacilateesto.com/blog" },
            { "@context": "https://schema.org", "@type": "SiteNavigationElement", "position": 3, "name": "Vacílate El Fútbol 2026", "url": "https://www.vacilateesto.com/vacilate-el-futbol" },
            { "@context": "https://schema.org", "@type": "SiteNavigationElement", "position": 4, "name": "Media Kit", "url": "https://www.vacilateesto.com/media-kit" },
            { "@context": "https://schema.org", "@type": "SiteNavigationElement", "position": 5, "name": "Podcast en la Cumbre", "url": "https://www.vacilateesto.com/podcast-en-la-cumbre" },
            { "@context": "https://schema.org", "@type": "SiteNavigationElement", "position": 6, "name": "Podcast Eterno", "url": "https://www.vacilateesto.com/podcast-eterno" },
            { "@context": "https://schema.org", "@type": "SiteNavigationElement", "position": 7, "name": "Buscador del podcast", "url": "https://www.vacilateesto.com/buscador" }
          ])}
        </script>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <AwardsBanner />
        <main role="main" aria-label="Contenido principal del podcast Vacílate Esto">
          <article itemScope itemType="https://schema.org/Organization">
            <meta itemProp="name" content="Vacílate Esto" />
            <meta itemProp="description" content="Una de las marcas de entretenimiento digital más relevantes de Venezuela, hecha en Venezuela: podcast, social media, contenidos para redes y eventos. Fun Educaitment: fútbol, gastronomía, historia, leyendas y mitos urbanos." />
            <meta itemProp="inLanguage" content="es-VE" />
            <HeroBanner />
            <HeroSection />
            <HomeSearchSection />
            <BlogSection />
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

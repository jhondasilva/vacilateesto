import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import HeroSection from "@/components/HeroSection";
import SpotifySection from "@/components/SpotifySection";
import SocialReelsSection from "@/components/SocialReelsSection";
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
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroBanner />
        <HeroSection />
        <EpisodesSection />
        <HostsSection />
        <EcosystemSection />
        <PeloticaSection />
        <RutaRamenSection />
        <AgendaSection />
        <SocialReelsSection />
        <SpotifySection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

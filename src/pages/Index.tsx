import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SocialReelsSection from "@/components/SocialReelsSection";
import EpisodesSection from "@/components/EpisodesSection";
import HostsSection from "@/components/HostsSection";
import EcosystemSection from "@/components/EcosystemSection";
import AgendaSection from "@/components/AgendaSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <EpisodesSection />
        <HostsSection />
        <EcosystemSection />
        <AgendaSection />
        <SocialReelsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

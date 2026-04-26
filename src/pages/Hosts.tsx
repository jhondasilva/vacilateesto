import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HostsSection from "@/components/HostsSection";

const Hosts = () => {
  const url = "https://www.vacilateesto.com/hosts";
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Hosts de Vacílate Esto: Conoce a los Conductores del Podcast</title>
        <meta
          name="description"
          content="Conoce a los hosts de Vacílate Esto, el podcast venezolano que graba donde nadie más se atreve. Biografías, redes y trayectoria."
        />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Hosts de Vacílate Esto" />
        <meta property="og:description" content="Conoce a los conductores del podcast venezolano Vacílate Esto." />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Header />
      <main className="pt-24">
        <section className="container mx-auto px-4 py-12 max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Hosts de <span className="text-gradient">Vacílate Esto</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            Los conductores detrás del podcast venezolano que graba en la cima del Roraima, en pleno Mundial y donde haga falta.
          </p>
        </section>
        <HostsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Hosts;
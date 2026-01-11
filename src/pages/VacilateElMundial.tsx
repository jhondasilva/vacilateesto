import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Tv,
  UtensilsCrossed,
  Newspaper,
  MapPin,
  Users,
  Clock,
  Zap,
  Instagram,
  Youtube,
  Radio,
  Calendar,
  Trophy,
  Target,
  TrendingUp,
  Play,
  ArrowRight,
  Smartphone,
  Eye,
  Heart,
  Star,
  Flag,
} from "lucide-react";
import logoVacilateElMundial from "@/assets/logo-vacilate-mundial.svg";
import jhonDaSilva from "@/assets/jhon-da-silva.jpg";
import juanCarlosMartinez from "@/assets/juan-carlos-martinez.jpg";

const stats = [
  { value: "2M+", label: "Seguidores Activos", icon: Users },
  { value: "24/7", label: "Presencia Digital", icon: Clock },
  { value: "100%", label: "Engagement", icon: Heart },
  { value: "5", label: "Plataformas", icon: Globe },
];

const platforms = [
  { name: "Instagram", icon: Instagram, color: "bg-gradient-to-br from-purple-500 to-pink-500" },
  { name: "YouTube", icon: Youtube, color: "bg-red-600" },
  { name: "TikTok", icon: Play, color: "bg-black" },
  { name: "TikTok Live", icon: Tv, color: "bg-[#00f2ea]" },
  { name: "FM Center", icon: Radio, color: "bg-primary" },
];

const contentFormats = [
  {
    title: "El Gol y el Taco",
    description: "Probamos la comida típica de las sedes (México, USA, Canadá). El contexto perfecto para el maridaje natural con la cultura. Cada platillo, una historia. Cada historia, una experiencia.",
    icon: UtensilsCrossed,
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "Vacílalo News",
    description: "Noticias del Mundial con ironía y data insólita para cortar la sed de información. Los mejores momentos, las polémicas, las curiosidades... todo con nuestro toque único.",
    icon: Newspaper,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Desde el Estadio",
    description: "Cobertura en ruta, zonas de hinchas y cánticos, donde la marea de fanáticos está presente. Sentir la energía del Mundial en vivo.",
    icon: MapPin,
    gradient: "from-green-500 to-emerald-500",
  },
];

const timeline = [
  { month: "Febrero 2026", event: "Inicio de la cobertura pre-Mundial", status: "upcoming" },
  { month: "Marzo 2026", event: "Contenido de equipos y jugadores", status: "upcoming" },
  { month: "Abril 2026", event: "Historias de las sedes", status: "upcoming" },
  { month: "Mayo 2026", event: "Gastronomía mundialista", status: "upcoming" },
  { month: "Junio 2026", event: "Cobertura del Mundial en vivo", status: "highlight" },
  { month: "Julio 2026", event: "Final y cierre épico", status: "highlight" },
];

const hosts = [
  {
    name: "Jhon Da Silva",
    role: "El Fiebruo",
    description: "Aporta la data dura, la historia y la pasión que todo fanático del fútbol respeta. Su conocimiento profundo del juego retiene al núcleo duro futbolero.",
    image: jhonDaSilva,
    instagram: "@jhonsnacks",
  },
  {
    name: "Juan Carlos Martínez",
    role: "El Escéptico",
    description: "Sigue la vibra, el humor y la calle que hace el contenido viral. Su enfoque fresco expande la audiencia hacia el 80% del mercado que disfruta el Mundial sin ser futbolero.",
    image: juanCarlosMartinez,
    instagram: "@juansofa",
  },
];

const sponsorBenefits = [
  { icon: Eye, title: "Visibilidad 24/7", description: "Presencia constante durante 6 meses de cobertura" },
  { icon: Target, title: "Audiencia Segmentada", description: "Fans del fútbol y audiencia generalista" },
  { icon: TrendingUp, title: "Engagement Alto", description: "Contenido que genera conversación y viralidad" },
  { icon: Star, title: "Branded Content", description: "Integración natural de marca en el contenido" },
];

const VacilateElMundial = () => {
  return (
    <>
      <Helmet>
        <title>Vacílate El Mundial 2026 | Cobertura del Mundial FIFA México, USA y Canadá</title>
        <meta name="description" content="Vacílate El Mundial 2026: Contenido multiplataforma sobre el Mundial de Fútbol FIFA 2026. Fun Educaitment con datos insólitos, gastronomía y cobertura en vivo desde México, USA y Canadá. Por Vacílate Esto." />
        <meta name="keywords" content="mundial 2026, fifa world cup 2026, mundial mexico usa canada, podcast mundial, cobertura mundial 2026, vacilate esto mundial, contenido mundial futbol" />
        <link rel="canonical" href="https://www.vacilateesto.com/vacilate-el-mundial" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Vacílate El Mundial 2026 | La Magia del Mundial en el Feed" />
        <meta property="og:description" content="Contenido multiplataforma sobre el Mundial 2026. Fun Educaitment, gastronomía y cobertura en vivo. 2M+ seguidores listos para vivir el Mundial." />
        <meta property="og:url" content="https://www.vacilateesto.com/vacilate-el-mundial" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vacílate El Mundial 2026" />
        <meta name="twitter:description" content="El Mundial 2026 visto desde ángulos inesperados. Fun Educaitment por Vacílate Esto." />
        
        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "name": "Vacílate El Mundial 2026",
            "description": "Proyecto de contenido multiplataforma sobre el Mundial de Fútbol FIFA 2026. Fun Educaitment que combina datos insólitos, gastronomía y cobertura en vivo desde México, USA y Canadá.",
            "startDate": "2026-02-01",
            "endDate": "2026-07-31",
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
            "location": {
              "@type": "VirtualLocation",
              "url": "https://www.vacilateesto.com/vacilate-el-mundial"
            },
            "organizer": {
              "@type": "Organization",
              "name": "Vacílate Esto",
              "url": "https://www.vacilateesto.com"
            },
            "performer": [
              { "@type": "Person", "name": "Jhon Da Silva" },
              { "@type": "Person", "name": "Juan Carlos Martínez" }
            ],
            "about": {
              "@type": "SportsEvent",
              "name": "FIFA World Cup 2026",
              "location": ["Mexico", "United States", "Canada"]
            },
            "offers": {
              "@type": "Offer",
              "name": "Patrocinio Vacílate El Mundial",
              "description": "Oportunidades de patrocinio para el proyecto de cobertura del Mundial 2026"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main>
          {/* Hero Section */}
          <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-[#9000ff] via-[#9000ff]/90 to-[#ee506f]">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#ee506f] rounded-full blur-3xl" />
            </div>
            
            {/* Decorative flags */}
            <div className="absolute top-32 right-20 hidden lg:flex gap-4 opacity-30">
              <span className="text-6xl">🇲🇽</span>
              <span className="text-6xl">🇺🇸</span>
              <span className="text-6xl">🇨🇦</span>
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 border border-white/30 mb-8 backdrop-blur-sm">
                  <Calendar className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white">Febrero - Julio 2026</span>
                </div>
                
                <img 
                  src={logoVacilateElMundial} 
                  alt="Vacílate El Mundial 2026" 
                  className="h-40 md:h-56 w-auto mx-auto mb-8 drop-shadow-2xl"
                />
                
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  La Magia del Mundial se vive en el Feed
                </h1>
                
                <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
                  Contenido multiplataforma presente en Instagram, YouTube, TikTok y radio. 
                  Hablamos del Mundial pero desde ángulos inesperados, al más puro estilo Vacílate Esto.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/media-kit">
                    <Button size="lg" className="bg-white text-[#9000ff] hover:bg-white/90">
                      <Trophy className="w-5 h-5 mr-2" />
                      Quiero Patrocinar
                    </Button>
                  </Link>
                  <a href="https://www.instagram.com/vacilateestopodcast" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                      <Instagram className="w-5 h-5 mr-2" />
                      Síguenos
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 bg-card border-b border-border">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9000ff]/20 to-[#ee506f]/20 flex items-center justify-center mx-auto mb-3">
                      <stat.icon className="w-7 h-7 text-[#9000ff]" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#9000ff] to-[#ee506f] bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* What is VEM */}
          <section className="py-20 md:py-28">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#9000ff]/10 text-sm font-medium mb-6 border border-[#9000ff]/30">
                  <Zap className="w-4 h-4 text-[#ee506f]" />
                  Fun Educaitment
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  ¿Qué es Vacílate El Mundial?
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  No somos creadores buscando audiencia desde cero. Somos una 
                  <span className="text-[#9000ff] font-semibold"> comunidad masiva de seguidores </span> 
                  listos para amplificar tu marca desde el día uno.
                </p>
                <p className="text-lg text-muted-foreground">
                  Nuestro enfoque es el <strong>Fun Educaitment</strong>: mezclamos diversión, educación y entretenimiento. 
                  Traemos datos insólitos, anécdotas legendarias e historias de los mundiales, jugadores, países y equipos 
                  que te harán ver el fútbol con otros ojos.
                </p>
              </div>

              {/* Platforms */}
              <div className="flex flex-wrap justify-center gap-4 mb-16">
                {platforms.map((platform, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 px-5 py-3 rounded-full bg-card border border-border"
                  >
                    <div className={`w-8 h-8 rounded-full ${platform.color} flex items-center justify-center`}>
                      <platform.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">{platform.name}</span>
                  </div>
                ))}
              </div>

              {/* The Challenge */}
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <div className="bg-card rounded-3xl p-8 border border-border">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-4">
                    <Tv className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">La Pantalla Grande</h3>
                  <p className="text-muted-foreground">
                    La audiencia verá los 90 minutos del partido oficial en la TV. 
                    El momento del gol, la emoción del juego, la transmisión tradicional.
                  </p>
                </div>
                <div className="bg-card rounded-3xl p-8 border border-border">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9000ff]/20 to-[#ee506f]/20 flex items-center justify-center mb-4">
                    <Smartphone className="w-6 h-6 text-[#9000ff]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">La Pantalla Chica</h3>
                  <p className="text-muted-foreground">
                    La conversación real vivirá 24/7 en el móvil. Antes, durante y después del partido. 
                    TikTok, Instagram, memes, debates... el fútbol nunca para.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Hosts */}
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Dos Voces, Un Universo
                </h2>
                <p className="text-xl text-muted-foreground">
                  El equilibrio perfecto entre credibilidad y entretenimiento
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {hosts.map((host, index) => (
                  <article 
                    key={index}
                    className="bg-card rounded-3xl p-8 border border-border text-center"
                  >
                    <img 
                      src={host.image} 
                      alt={host.name}
                      className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-[#9000ff]/30"
                    />
                    <h3 className="text-2xl font-bold mb-1">{host.name}</h3>
                    <div className="text-[#ee506f] font-semibold mb-4">{host.role}</div>
                    <p className="text-muted-foreground mb-4">{host.description}</p>
                    <a 
                      href={`https://instagram.com/${host.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#9000ff] hover:underline"
                    >
                      <Instagram className="w-4 h-4" />
                      {host.instagram}
                    </a>
                  </article>
                ))}
              </div>
              
              <p className="text-center text-muted-foreground max-w-2xl mx-auto mt-8">
                Juntos crean el equilibrio perfecto entre credibilidad y entretenimiento, 
                alcanzando desde el hincha más apasionado hasta el espectador casual que se suma a la fiesta del fútbol.
              </p>
            </div>
          </section>

          {/* Content Formats */}
          <section className="py-20 md:py-28">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Estrategia de Contenido
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Acompañamos al fanático en todo el viaje del Mundial, integrando contenido 
                  de forma orgánica en la cultura del viaje, la comida y la celebración.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {contentFormats.map((format, index) => (
                  <article 
                    key={index}
                    className="group bg-card rounded-3xl p-8 border border-border hover:border-[#9000ff]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#9000ff]/10"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${format.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <format.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{format.title}</h3>
                    <p className="text-muted-foreground">{format.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="py-20 bg-gradient-to-br from-[#9000ff]/5 to-[#ee506f]/5">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Calendario 2026
                </h2>
                <p className="text-xl text-muted-foreground">
                  6 meses de contenido continuo
                </p>
              </div>
              
              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#9000ff] to-[#ee506f]" />
                  
                  {timeline.map((item, index) => (
                    <div 
                      key={index}
                      className={`relative flex items-center gap-6 mb-8 ${
                        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                      }`}
                    >
                      <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} hidden md:block`}>
                        {index % 2 === 0 && (
                          <div className={`p-4 rounded-2xl ${item.status === 'highlight' ? 'bg-[#9000ff]/10 border border-[#9000ff]/30' : 'bg-card border border-border'}`}>
                            <div className="font-bold text-[#9000ff]">{item.month}</div>
                            <div className="text-muted-foreground">{item.event}</div>
                          </div>
                        )}
                      </div>
                      
                      <div className={`absolute left-4 md:left-1/2 w-4 h-4 rounded-full -translate-x-1/2 ${
                        item.status === 'highlight' 
                          ? 'bg-[#ee506f] ring-4 ring-[#ee506f]/30' 
                          : 'bg-[#9000ff]'
                      }`} />
                      
                      <div className={`flex-1 ${index % 2 === 1 ? 'md:text-right' : 'md:text-left'} ml-10 md:ml-0`}>
                        {(index % 2 === 1 || true) && (
                          <div className={`p-4 rounded-2xl md:hidden ${item.status === 'highlight' ? 'bg-[#9000ff]/10 border border-[#9000ff]/30' : 'bg-card border border-border'}`}>
                            <div className="font-bold text-[#9000ff]">{item.month}</div>
                            <div className="text-muted-foreground">{item.event}</div>
                          </div>
                        )}
                        <div className={`hidden md:block p-4 rounded-2xl ${item.status === 'highlight' ? 'bg-[#9000ff]/10 border border-[#9000ff]/30' : 'bg-card border border-border'}`}>
                          {index % 2 === 1 && (
                            <>
                              <div className="font-bold text-[#9000ff]">{item.month}</div>
                              <div className="text-muted-foreground">{item.event}</div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Sponsor Benefits */}
          <section className="py-20 md:py-28">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ee506f]/10 text-sm font-medium mb-6 border border-[#ee506f]/30">
                  <Trophy className="w-4 h-4 text-[#ee506f]" />
                  Oportunidades de Patrocinio
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  ¿Por qué patrocinar Vacílate El Mundial?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  No interrumpimos la experiencia, la potenciamos. Tu marca integrada de forma 
                  natural en el contenido que la audiencia ama.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
                {sponsorBenefits.map((benefit, index) => (
                  <div key={index} className="text-center p-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9000ff] to-[#ee506f] flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Link to="/media-kit">
                  <Button size="lg" className="bg-gradient-to-r from-[#9000ff] to-[#ee506f] hover:opacity-90">
                    Ver Media Kit Completo
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 bg-gradient-to-r from-[#9000ff] to-[#ee506f]">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                ¿Listo para el Mundial 2026?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                Únete a nuestra comunidad y vive el Mundial desde ángulos que nunca imaginaste. 
                La magia del fútbol está en el feed.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="https://www.instagram.com/vacilateestopodcast" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-white text-[#9000ff] hover:bg-white/90">
                    <Instagram className="w-5 h-5 mr-2" />
                    Seguir en Instagram
                  </Button>
                </a>
                <a href="https://www.tiktok.com/@vacilateesto" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                    <Play className="w-5 h-5 mr-2" />
                    Seguir en TikTok
                  </Button>
                </a>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default VacilateElMundial;

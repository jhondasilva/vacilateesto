import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WorldCupCountdown from "@/components/WorldCupCountdown";
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
  Gamepad2,
  BarChart3,
  Award,
  Flame,
  ExternalLink,
  CheckCircle,
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
  { month: "Febrero 2026", event: "Inicio cobertura pre-Mundial desde Venezuela", status: "upcoming" },
  { month: "Marzo 2026", event: "Contenido equipos, jugadores e historias", status: "upcoming" },
  { month: "Abril 2026", event: "Historias de las sedes + gastronomía", status: "upcoming" },
  { month: "Mayo 2026", event: "Houston: Hub Diáspora Venezolana", status: "upcoming" },
  { month: "Junio 2026", event: "Costa Este + México: Mundial en vivo", status: "highlight" },
  { month: "Julio 2026", event: "México: Final y cierre épico", status: "highlight" },
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
    description: "Sigue la vibra, la calle y el entretenimiento que hace el contenido viral. Su enfoque fresco expande la audiencia hacia el 80% del mercado que disfruta el Mundial sin ser futbolero.",
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

const quinielaStats = [
  { value: "10K+", label: "Participantes", icon: Users },
  { value: "50K+", label: "Predicciones", icon: BarChart3 },
  { value: "95%", label: "Precisión Top", icon: Target },
  { value: "🔥", label: "En Vivo", icon: Flame },
];

const topPredictions = [
  { 
    match: "Argentina vs Francia", 
    prediction: "Argentina 2-1", 
    accuracy: "87%",
    participants: "2.3K",
    hot: true 
  },
  { 
    match: "Brasil vs Alemania", 
    prediction: "Brasil 3-2", 
    accuracy: "72%",
    participants: "1.8K",
    hot: false 
  },
  { 
    match: "México vs España", 
    prediction: "Empate 1-1", 
    accuracy: "65%",
    participants: "3.1K",
    hot: true 
  },
];

const quinielaFeatures = [
  { icon: Gamepad2, title: "Predicciones en Tiempo Real", description: "Haz tus pronósticos antes y durante los partidos" },
  { icon: Award, title: "Rankings y Premios", description: "Compite con otros fans y gana premios exclusivos" },
  { icon: BarChart3, title: "Estadísticas Avanzadas", description: "Analiza tendencias y mejora tus predicciones" },
  { icon: Users, title: "Comunidad Activa", description: "Debate y comparte con miles de fanáticos" },
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
            
            {/* Decorative country icons */}
            <div className="absolute top-32 right-20 hidden lg:flex gap-6 opacity-40">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-600 via-white to-red-600 flex items-center justify-center shadow-lg">
                <span className="text-xs font-bold text-green-800">MX</span>
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-b from-blue-700 via-white to-red-600 flex items-center justify-center shadow-lg">
                <Star className="w-5 h-5 text-blue-700" />
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-b from-red-600 via-white to-red-600 flex items-center justify-center shadow-lg">
                <span className="text-xs font-bold text-red-700">CA</span>
              </div>
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
                
                <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10">
                  Contenido multiplataforma presente en Instagram, YouTube, TikTok y radio. 
                  Hablamos del Mundial pero desde ángulos inesperados, al más puro estilo Vacílate Esto.
                </p>

                {/* Countdown Timer */}
                <div className="mb-10">
                  <WorldCupCountdown />
                </div>
                
                {/* CTA Principal - La Quiniela */}
                <a 
                  href="https://laquiniela.vacilateesto.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#00d9ff] via-[#00f5d4] to-[#00d9ff] rounded-2xl text-black font-bold text-lg shadow-2xl shadow-[#00d9ff]/40 hover:shadow-[#00d9ff]/60 hover:scale-105 transition-all duration-300 mb-6 animate-pulse hover:animate-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00d9ff] via-[#00f5d4] to-[#00d9ff] rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
                  <span className="relative flex items-center gap-3">
                    <Gamepad2 className="w-6 h-6" />
                    <span>🔥 ¡Juega La Quiniela GRATIS!</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>

                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/media-kit#contacto">
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

          {/* Audiovisuales Section */}
          <section className="py-20 md:py-28 bg-gradient-to-b from-background to-card/50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ee506f]/10 text-sm font-medium mb-6 border border-[#ee506f]/30">
                  <Play className="w-4 h-4 text-[#ee506f]" />
                  Contenido Audiovisual
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Mira el Proyecto en Acción
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Videos, reels y contenido exclusivo de Vacílate El Mundial 2026
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {/* Video 1 */}
                <a 
                  href="https://www.instagram.com/p/DTdyOqAiT-F/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative bg-card rounded-3xl overflow-hidden border border-border hover:border-[#ee506f]/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#ee506f]/10"
                >
                  <div className="aspect-[9/16] bg-gradient-to-br from-[#9000ff]/20 via-[#ee506f]/20 to-[#00d9ff]/20 flex items-center justify-center relative">
                    {/* Play overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-[#ee506f] ml-1" fill="currentColor" />
                    </div>
                    
                    {/* Instagram badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white text-xs font-bold">
                      <Instagram className="w-3.5 h-3.5" />
                      Reel
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-bold text-lg mb-1">Vacílate El Mundial</p>
                      <p className="text-white/70 text-sm">Contenido exclusivo del proyecto</p>
                    </div>
                  </div>
                </a>

                {/* Placeholder for more videos */}
                <div className="hidden md:flex aspect-[9/16] bg-card rounded-3xl border-2 border-dashed border-border items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Play className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium">Próximamente</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Más contenido en camino</p>
                  </div>
                </div>

                <div className="hidden lg:flex aspect-[9/16] bg-card rounded-3xl border-2 border-dashed border-border items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Play className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium">Próximamente</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Más contenido en camino</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center mt-10">
                <a 
                  href="https://www.instagram.com/vacilateestopodcast" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                >
                  <Instagram className="w-5 h-5" />
                  Ver más en Instagram
                  <ExternalLink className="w-4 h-4" />
                </a>
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

              {/* The Roadtrip */}
              <div className="mb-16">
                <h3 className="text-2xl font-bold text-center mb-8">
                  La Gran Expedición 2026
                </h3>
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  <div className="bg-card rounded-3xl p-6 border border-border text-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-b from-blue-700 via-white to-red-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Star className="w-6 h-6 text-blue-700" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">Houston</h4>
                    <div className="text-sm text-[#9000ff] font-medium mb-2">Hub Diáspora</div>
                    <p className="text-sm text-muted-foreground">
                      El corazón de la comunidad venezolana en USA. Conexión directa con nuestra audiencia.
                    </p>
                  </div>
                  <div className="bg-card rounded-3xl p-6 border border-border text-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#9000ff] to-[#ee506f] flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">Costa Este</h4>
                    <div className="text-sm text-[#ee506f] font-medium mb-2">Hub Fútbol</div>
                    <p className="text-sm text-muted-foreground">
                      Nueva York, Miami. La pasión del fútbol europeo y latinoamericano se encuentra.
                    </p>
                  </div>
                  <div className="bg-card rounded-3xl p-6 border border-border text-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-600 via-white to-red-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <MapPin className="w-6 h-6 text-green-700" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">México</h4>
                    <div className="text-sm text-[#9000ff] font-medium mb-2">Inauguración + Final</div>
                    <p className="text-sm text-muted-foreground">
                      El epicentro del caos latino. Gastronomía, cultura y fútbol en estado puro.
                    </p>
                  </div>
                </div>
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
              
              {/* Integration Box */}
              <div className="mt-16 bg-gradient-to-r from-[#9000ff]/10 to-[#ee506f]/10 rounded-3xl p-8 border border-[#9000ff]/20 max-w-4xl mx-auto">
                <h3 className="text-xl font-bold text-center mb-6">Integración Total del Ecosistema</h3>
                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <a 
                    href="https://laquiniela.vacilateesto.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group bg-gradient-to-br from-[#00d9ff]/10 to-[#00a8cc]/10 rounded-2xl p-6 border border-[#00d9ff]/30 hover:border-[#00d9ff]/60 transition-all duration-300 hover:scale-105 text-center"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00d9ff] to-[#00a8cc] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Gamepad2 className="w-7 h-7 text-white" />
                    </div>
                    <div className="font-bold text-lg mb-2 flex items-center justify-center gap-2">
                      La Quiniela
                      <ExternalLink className="w-4 h-4 text-[#00d9ff] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Predice resultados en tiempo real y compite con miles de fanáticos
                    </p>
                    <div className="inline-flex items-center gap-2 text-xs font-medium text-[#00d9ff]">
                      <Trophy className="w-3.5 h-3.5" />
                      ¡Juega ahora gratis!
                    </div>
                  </a>
                  <Link 
                    to="/media-kit#contacto"
                    className="bg-card/50 rounded-2xl p-6 border border-border text-center hover:border-[#9000ff]/50 transition-all duration-300 hover:scale-[1.02] block"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#9000ff]/20 to-[#ee506f]/20 flex items-center justify-center mx-auto mb-4">
                      <Users className="w-7 h-7 text-[#9000ff]" />
                    </div>
                    <div className="font-bold text-lg mb-2">B2B & Marcas</div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Activaciones con marcas conectando con la diáspora venezolana
                    </p>
                    <div className="inline-flex items-center gap-2 text-xs font-medium text-[#9000ff]">
                      <Target className="w-3.5 h-3.5" />
                      Quiero Patrocinar
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* La Quiniela Section */}
          <section className="py-20 md:py-28 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-64 h-64 bg-[#00d9ff] rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#9000ff] rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ee506f] rounded-full blur-3xl opacity-30" />
            </div>
            
            {/* Soccer ball pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-20 right-20 text-8xl">⚽</div>
              <div className="absolute bottom-40 left-20 text-6xl">⚽</div>
              <div className="absolute top-1/3 right-1/4 text-5xl">⚽</div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00d9ff]/20 border border-[#00d9ff]/40 mb-6 backdrop-blur-sm">
                  <Gamepad2 className="w-5 h-5 text-[#00d9ff]" />
                  <span className="text-sm font-bold text-[#00d9ff] uppercase tracking-wider">Juego Interactivo</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                  La Quiniela del Mundial
                </h2>
                <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
                  Predice los resultados, compite con la comunidad y demuestra que sabes más de fútbol que nadie. 
                  ¡Miles de fanáticos ya están jugando!
                </p>
                
                {/* CTA Principal */}
                <a 
                  href="https://laquiniela.vacilateesto.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-[#00d9ff] to-[#00a8cc] hover:opacity-90 text-black font-bold text-lg px-8 py-6 h-auto shadow-lg shadow-[#00d9ff]/30 hover:shadow-xl hover:shadow-[#00d9ff]/40 transition-all duration-300 hover:scale-105"
                  >
                    <Trophy className="w-6 h-6 mr-2" />
                    Jugar La Quiniela
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </div>

              {/* Stats de la Quiniela */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto">
                {quinielaStats.map((stat, index) => (
                  <div 
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:border-[#00d9ff]/50 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00d9ff]/30 to-[#00a8cc]/30 flex items-center justify-center mx-auto mb-3">
                      {stat.value === "🔥" ? (
                        <span className="text-2xl">{stat.value}</span>
                      ) : (
                        <stat.icon className="w-6 h-6 text-[#00d9ff]" />
                      )}
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Top Predictions */}
              <div className="mb-16">
                <h3 className="text-2xl font-bold text-white text-center mb-8 flex items-center justify-center gap-3">
                  <Flame className="w-6 h-6 text-orange-400" />
                  Predicciones Más Populares
                  <Flame className="w-6 h-6 text-orange-400" />
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {topPredictions.map((pred, index) => (
                    <div 
                      key={index}
                      className={`relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border ${pred.hot ? 'border-orange-400/50' : 'border-white/20'} hover:border-[#00d9ff]/50 transition-all duration-300`}
                    >
                      {pred.hot && (
                        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          HOT
                        </div>
                      )}
                      
                      <div className="text-white/60 text-sm mb-2">{pred.match}</div>
                      <div className="text-2xl font-bold text-white mb-4">{pred.prediction}</div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>{pred.accuracy} precisión</span>
                        </div>
                        <div className="flex items-center gap-1 text-white/60">
                          <Users className="w-4 h-4" />
                          <span>{pred.participants}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
                {quinielaFeatures.map((feature, index) => (
                  <div 
                    key={index}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:border-white/30 transition-all duration-300"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9000ff]/30 to-[#ee506f]/30 flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="font-bold text-white mb-2">{feature.title}</h4>
                    <p className="text-sm text-white/60">{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* Secondary CTA */}
              <div className="text-center">
                <p className="text-white/70 mb-6">
                  ¿Crees que puedes predecir el futuro del fútbol? Únete y demuéstralo.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a 
                    href="https://laquiniela.vacilateesto.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button 
                      size="lg" 
                      className="bg-white text-[#1a1a2e] hover:bg-white/90 font-bold"
                    >
                      <Gamepad2 className="w-5 h-5 mr-2" />
                      Crear Mi Cuenta Gratis
                    </Button>
                  </a>
                  <a 
                    href="https://laquiniela.vacilateesto.com/rankings" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-white/40 text-white hover:bg-white/10"
                    >
                      <Award className="w-5 h-5 mr-2" />
                      Ver Rankings
                    </Button>
                  </a>
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
                <Link to="/media-kit#contacto">
                  <Button size="lg" className="bg-gradient-to-r from-[#9000ff] to-[#ee506f] hover:opacity-90">
                    Quiero Patrocinar
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

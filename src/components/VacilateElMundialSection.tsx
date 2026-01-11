import { Globe, Tv, UtensilsCrossed, Newspaper, MapPin, Users, Clock, Zap } from "lucide-react";
import logoVacilateElMundial from "@/assets/logo-vacilate-mundial.svg";

const VacilateElMundialSection = () => {
  const features = [
    {
      icon: Globe,
      title: "Multiplataforma",
      description: "Instagram, YouTube, TikTok (incluyendo TikTok Live) y Radio FM Center"
    },
    {
      icon: Zap,
      title: "Fun Educaitment",
      description: "Diversión, educación y entretenimiento en cada contenido"
    },
    {
      icon: UtensilsCrossed,
      title: "El Gol y el Taco",
      description: "Exploramos los sabores de México, USA y Canadá mientras celebramos cada gol"
    },
    {
      icon: Newspaper,
      title: "Vacílalo News",
      description: "Noticias del Mundial con ironía y data insólita"
    }
  ];

  const stats = [
    { value: "2M+", label: "Seguidores Activos" },
    { value: "24/7", label: "Presencia Digital" },
    { value: "100%", label: "Engagement" }
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-[#9000ff]/10 via-background to-[#ee506f]/10">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#9000ff]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ee506f]/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#9000ff]/20 to-[#ee506f]/20 text-sm font-medium mb-6 border border-[#9000ff]/30">
            <Globe className="w-4 h-4 text-[#ee506f]" />
            Proyecto Especial 2026
          </div>
          
          <div className="flex justify-center mb-8">
            <img 
              src={logoVacilateElMundial} 
              alt="Vacílate El Mundial 2026" 
              className="h-32 md:h-44 w-auto drop-shadow-2xl"
            />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#9000ff] via-[#ee506f] to-[#9000ff] bg-clip-text text-transparent">
            La Magia del Mundial se vive en el Feed
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Hablamos del Mundial pero desde ángulos inesperados, al más puro estilo Vacílate Esto. 
            Datos insólitos, anécdotas legendarias e historias que te harán ver el fútbol con otros ojos.
          </p>
          
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">
            <span className="text-[#ee506f] font-semibold">Febrero - Julio 2026</span> • México, USA y Canadá
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-4 md:p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50"
            >
              <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#9000ff] to-[#ee506f] bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <article
              key={index}
              className="group p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-[#9000ff]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#9000ff]/10"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9000ff]/20 to-[#ee506f]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-[#ee506f]" />
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </article>
          ))}
        </div>

        {/* Content Types */}
        <div className="bg-card/40 backdrop-blur-sm rounded-3xl border border-border/50 p-8 md:p-12">
          <h3 className="text-2xl font-bold text-center mb-8">
            Contenido que conecta
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9000ff] to-[#ee506f] flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold mb-2">El Gol y el Taco</h4>
              <p className="text-sm text-muted-foreground">
                Probamos la comida típica de las sedes. Cada platillo, una historia.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ee506f] to-[#9000ff] flex items-center justify-center mx-auto mb-4">
                <Newspaper className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold mb-2">Vacílalo News</h4>
              <p className="text-sm text-muted-foreground">
                Noticias del Mundial con ironía y data insólita para cortar la sed de información.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9000ff] to-[#ee506f] flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold mb-2">Desde el Estadio</h4>
              <p className="text-sm text-muted-foreground">
                Cobertura en ruta, zonas de hinchas y cánticos. La energía del Mundial en vivo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VacilateElMundialSection;

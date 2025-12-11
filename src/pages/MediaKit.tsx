import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Users, 
  Eye, 
  Heart, 
  FileText, 
  TrendingUp, 
  Youtube, 
  Instagram, 
  Facebook,
  Globe,
  Mail,
  Play,
  Mic,
  Utensils,
  Film,
  Radio,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Download,
  Tv,
  Smartphone,
  MapPin,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logoVacilate from "@/assets/logo-vacilate-esto.png";

// Datos de audiencia - Fuente: Metricool (01 ene - 30 nov 2025)
const audienceData = {
  totalFollowers: "3.5M+",
  totalImpressions: "89.6M",
  totalInteractions: "5.2M",
  totalPublications: "6,705",
  platforms: [
    { name: "TikTok", followers: "1.82M", growth: "+7.18%", icon: Play },
    { name: "Instagram", followers: "278.19K", growth: "+20.66%", icon: Instagram },
    { name: "Facebook", followers: "210.68K", growth: "+11.8%", icon: Facebook },
    { name: "YouTube", followers: "113K", growth: "+1.8%", icon: Youtube },
    { name: "Threads", followers: "58.06K", growth: "+13.69%", icon: FileText },
  ],
  impressions: {
    facebook: "44.79M",
    facebookGrowth: "+64.94%",
    instagram: "22.74M",
    instagramGrowth: "+88.36%",
    tiktok: "19.88M",
    tiktokGrowth: "+336.6%",
    youtube: "1.95M",
    linkedin: "224.69K",
    linkedinGrowth: "+486.67%",
  },
  interactions: {
    facebook: "3.4M",
    instagram: "427.99K",
    threads: "1.32M",
    youtube: "71.44K",
    linkedin: "6,456",
  },
  demographics: {
    countries: [
      { name: "Venezuela", percentage: "47.80%" },
      { name: "España", percentage: "10.82%" },
      { name: "Estados Unidos", percentage: "10.59%" },
      { name: "México", percentage: "5.46%" },
      { name: "Colombia", percentage: "4.69%" },
      { name: "Chile", percentage: "3.79%" },
      { name: "Argentina", percentage: "2.71%" },
      { name: "Perú", percentage: "2.63%" },
      { name: "Ecuador", percentage: "1.18%" },
      { name: "Rep. Dominicana", percentage: "1.14%" },
    ],
    regions: [
      { name: "Distrito Federal", percentage: "16.59%" },
      { name: "Carabobo", percentage: "3.98%" },
      { name: "Madrid", percentage: "3.57%" },
      { name: "Lara", percentage: "3.33%" },
      { name: "Miranda", percentage: "2.77%" },
      { name: "Zulia", percentage: "2.67%" },
    ],
  },
};

const contentFormats = [
  {
    title: "Vacílate Esto Cuentos",
    subtitle: "Shorts Diarios",
    description: "Cuentos y anécdotas de aproximadamente un minuto que salen todos los días. Contenido viral que conecta con la audiencia a través de historias cortas y entretenidas.",
    icon: Smartphone,
    color: "bg-[#7DE8E8]",
    stats: "Diario · ~1 min",
    platforms: "Facebook, Instagram, TikTok, YouTube Shorts",
  },
  {
    title: "Podcast",
    subtitle: "Vacílate Esto",
    description: "Nuestro formato estrella de análisis y reflexiones profundas sobre historias, leyendas, datos curiosos y cultura venezolana. Episodios semanales de ~45 minutos que generan conversación.",
    icon: Mic,
    color: "bg-primary",
    stats: "Semanal · ~45 min",
    platforms: "Radio Circuito Líder, Televen TV, YouTube, Spotify",
  },
  {
    title: "Vacílate Esto Comiendo",
    subtitle: "Serie Gastronómica",
    description: "Juan y Jhon se lanzan a probar distintas propuestas gastronómicas, explorando cada detalle, las comidas y las experiencias desde lugares sencillos hasta restaurantes sofisticados.",
    icon: Utensils,
    color: "bg-[#7DE8E8]",
    stats: "Ruta del Ramen",
  },
  {
    title: "Metraje",
    subtitle: "Documental",
    description: "Nos traemos a expertos y lugareños que nos hablen de experiencias, anécdotas, mitos y leyendas de distintos lugares. Podemos dar una vuelta por la ciudad, una aventura en carretera o una exploración inesperada.",
    icon: Film,
    color: "bg-primary",
    stats: "Formato aventura",
  },
  {
    title: "Lives",
    subtitle: "En Vivo",
    description: "Hacer un podcast es divertido, pero con público es mejor. Transformamos nuestro formato de estudio a una experiencia totalmente en vivo, donde nos relajamos y compartimos con la audiencia.",
    icon: Radio,
    color: "bg-[#7DE8E8]",
    stats: "Shows en vivo",
  },
  {
    title: "Rutas",
    subtitle: "Exploraciones Temáticas",
    description: "Series de exploración donde recorremos lugares con un tema específico. Como la Ruta del Ramen, donde probamos y evaluamos los mejores restaurantes de ramen en la ciudad.",
    icon: MapPin,
    color: "bg-[#7DE8E8]",
    stats: "Series temáticas",
    platforms: "TikTok, Instagram, YouTube",
  },
  {
    title: "Newsletter",
    subtitle: "Semanal",
    description: "Semanalmente enviamos un boletín informativo donde compartimos contenido curado y lo más visto del ecosistema esa semana.",
    icon: Mail,
    color: "bg-primary",
    stats: "Contenido curado",
  },
  {
    title: "Proyectos Especiales",
    subtitle: "Producciones Únicas",
    description: "Proyectos con identidad propia que nacen del ecosistema Vacílate Esto: Podcast Eterno, Podcast en la Cumbre y Pelotica de Goma. Cada uno con su audiencia y comunidad.",
    icon: Star,
    color: "bg-[#7DE8E8]",
    stats: "3 proyectos activos",
  },
];

const sponsorshipPlans = [
  {
    name: "Plan 1",
    subtitle: "Brand Placement Intensivo",
    features: [
      { quantity: "30", description: "Brand Placement Shorts en TikTok e Instagram" },
      { quantity: "4", description: "Long Podcast en YouTube - Mención de 30 seg" },
      { quantity: "4", description: "Historias en Instagram - 1 semanal" },
      { quantity: "4", description: "Presencia en Newsletters - 1 semanal" },
      { quantity: "1", description: "Short mensual en TikTok e Instagram con historia de marca" },
    ],
    highlighted: true,
  },
  {
    name: "Plan 2",
    subtitle: "Content Integration",
    features: [
      { quantity: "15", description: "Content Shorts en TikTok e Instagram" },
      { quantity: "4", description: "Long Podcast en YouTube" },
      { quantity: "2", description: "Historias en Instagram" },
      { quantity: "4", description: "Presencia en Newsletters" },
      { quantity: "1", description: "Short mensual con historia de marca" },
    ],
    highlighted: false,
  },
];

const topPosts = [
  { date: "21 Feb 2025", description: "¿Sabías la existencia de este pozo?", impressions: "2.48M", interactions: "186.25K" },
  { date: "07 Ago 2025", description: "Algunos aseguran haber sentido su presencia…", impressions: "1.04M", interactions: "80.55K" },
  { date: "22 Mar 2025", description: "¿Qué opinas sobre estos 2 artistas venezolanos?", impressions: "919.49K", interactions: "56.97K" },
  { date: "24 Abr 2025", description: "Teorías sobre la desaparición…", impressions: "880.3K", interactions: "59.85K" },
  { date: "11 Feb 2025", description: "¿Crees esta leyenda? ¿Qué opinas?", impressions: "743.38K", interactions: "103.98K" },
  { date: "07 May 2025", description: "La historia de constancia y éxito...", impressions: "685.74K", interactions: "88.78K" },
];

const MediaKit = () => {
  return (
    <>
      <Helmet>
        <title>Media Kit | Vacílate Esto Podcast</title>
        <meta name="description" content="Conoce las métricas y oportunidades de colaboración con Vacílate Esto, el ecosistema de contenido más grande de Venezuela con más de 3.5 millones de seguidores." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main>
          {/* Hero Section */}
          <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-foreground via-foreground to-foreground/90">
            {/* Background decorations */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#7DE8E8] rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/20 border border-primary/30 mb-8">
                  <span className="text-sm font-semibold text-primary">MediaKit 2026</span>
                </div>
                
                <img 
                  src={logoVacilate} 
                  alt="Vacílate Esto" 
                  className="h-24 md:h-32 mx-auto mb-8 drop-shadow-2xl brightness-0 invert"
                />
                
                <h1 className="text-4xl md:text-6xl font-black text-background mb-6">
                  El Ecosistema de Contenido
                  <span className="block text-primary mt-2">Fun Educaitment</span>
                </h1>
                
                <p className="text-xl text-background/70 mb-10 max-w-2xl mx-auto">
                  Conectamos marcas con una audiencia apasionada de más de 3.5 millones de seguidores 
                  a través de contenido auténtico y entretenido.
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12">
                  {[
                    { value: "3.5M+", label: "Seguidores Totales", icon: Users },
                    { value: "89.6M", label: "Impresiones Anuales", icon: Eye },
                    { value: "5.2M", label: "Interacciones", icon: Heart },
                    { value: "6,705", label: "Publicaciones", icon: FileText },
                  ].map((stat, index) => (
                    <div key={index} className="bg-background/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-background/20">
                      <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl md:text-3xl font-bold text-background">{stat.value}</div>
                      <div className="text-xs md:text-sm text-background/60">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Platform Stats Section */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Métricas por Plataforma</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Nuestra Presencia Digital
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Datos: 01 enero - 30 noviembre 2025 · <span className="font-semibold">Fuente: Metricool</span>
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {audienceData.platforms.map((platform, index) => (
                  <div 
                    key={index} 
                    className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-elevated transition-all duration-300 group"
                  >
                    <platform.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                    <div className="text-xs text-muted-foreground mb-1">{platform.name}</div>
                    <div className="text-2xl font-bold text-foreground">{platform.followers}</div>
                    <div className="text-xs text-muted-foreground mb-1">Seguidores</div>
                    <div className="text-sm font-semibold text-green-500">{platform.growth}</div>
                  </div>
                ))}
              </div>

              {/* Impressions Grid */}
              <div className="mt-16 grid md:grid-cols-2 gap-8">
                {/* Impresiones */}
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 border border-primary/20">
                  <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <Eye className="w-6 h-6 text-primary" />
                    Impresiones Totales
                  </h3>
                  <div className="space-y-4">
                    {[
                      { platform: "Facebook", value: audienceData.impressions.facebook, growth: audienceData.impressions.facebookGrowth },
                      { platform: "Instagram", value: audienceData.impressions.instagram, growth: audienceData.impressions.instagramGrowth },
                      { platform: "TikTok", value: audienceData.impressions.tiktok, growth: audienceData.impressions.tiktokGrowth },
                      { platform: "YouTube", value: audienceData.impressions.youtube, growth: "" },
                      { platform: "LinkedIn", value: audienceData.impressions.linkedin, growth: audienceData.impressions.linkedinGrowth },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
                        <span className="text-foreground font-medium">{item.platform}</span>
                        <div className="text-right">
                          <span className="text-xl font-bold text-foreground">{item.value}</span>
                          {item.growth && <span className={`text-sm ml-2 ${item.growth.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>{item.growth}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interacciones */}
                <div className="bg-gradient-to-br from-[#7DE8E8]/10 to-[#7DE8E8]/5 rounded-3xl p-8 border border-[#7DE8E8]/20">
                  <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <Heart className="w-6 h-6 text-[#7DE8E8]" />
                    Interacciones Totales
                  </h3>
                  <div className="space-y-4">
                    {[
                      { platform: "Facebook", value: audienceData.interactions.facebook },
                      { platform: "Threads", value: audienceData.interactions.threads },
                      { platform: "Instagram", value: audienceData.interactions.instagram },
                      { platform: "YouTube", value: audienceData.interactions.youtube },
                      { platform: "LinkedIn", value: audienceData.interactions.linkedin },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
                        <span className="text-foreground font-medium">{item.platform}</span>
                        <span className="text-xl font-bold text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Demographics Section */}
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Demografía</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  ¿De Dónde Es Nuestra Audiencia?
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Una comunidad global con fuerte presencia en Venezuela y la diáspora · <span className="font-semibold">Fuente: Metricool</span>
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Países */}
                <div className="bg-card rounded-3xl p-8 shadow-card border border-border">
                  <h3 className="text-xl font-bold text-foreground mb-6">Top 10 Países</h3>
                  <div className="space-y-3">
                    {audienceData.demographics.countries.map((country, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <span className="w-6 text-center text-sm font-bold text-primary">{idx + 1}</span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-foreground font-medium">{country.name}</span>
                            <span className="text-foreground font-bold">{country.percentage}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                              style={{ width: country.percentage }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Regiones */}
                <div className="bg-card rounded-3xl p-8 shadow-card border border-border">
                  <h3 className="text-xl font-bold text-foreground mb-6">Top Regiones</h3>
                  <div className="space-y-3">
                    {audienceData.demographics.regions.map((region, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <span className="w-6 text-center text-sm font-bold text-[#7DE8E8]">{idx + 1}</span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-foreground font-medium capitalize">{region.name}</span>
                            <span className="text-foreground font-bold">{region.percentage}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#7DE8E8] to-[#7DE8E8]/60 rounded-full"
                              style={{ width: `${parseFloat(region.percentage) * 3}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Content Formats Section */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <Play className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Formatos de Contenido</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Nuestro Ecosistema de Contenido
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Múltiples formatos para conectar con nuestra audiencia de diferentes maneras
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contentFormats.map((format, index) => (
                  <div 
                    key={index}
                    className="group bg-card rounded-3xl p-8 border border-border shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className={`w-14 h-14 ${format.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <format.icon className="w-7 h-7 text-background" />
                    </div>
                    <div className="text-sm font-medium text-primary mb-1">{format.subtitle}</div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{format.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {format.description}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-xs font-medium text-foreground mb-3">
                      {format.stats}
                    </div>
                    {format.platforms && (
                      <p className="text-xs text-muted-foreground mt-2">
                        <span className="font-semibold text-foreground/70">Plataformas:</span> {format.platforms}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Top Posts Section */}
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Top Publicaciones</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Contenido que Genera Impacto
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Nuestras publicaciones con mejor rendimiento · <span className="font-semibold">Fuente: Metricool</span>
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full bg-card rounded-2xl shadow-card border border-border overflow-hidden">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Fecha</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Descripción</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Impresiones</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Interacciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPosts.map((post, idx) => (
                      <tr key={idx} className="border-t border-border hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">{post.date}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{post.description}</td>
                        <td className="px-6 py-4 text-sm font-bold text-foreground text-right">{post.impressions}</td>
                        <td className="px-6 py-4 text-sm font-bold text-primary text-right">{post.interactions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Sponsorship Plans Section */}
          <section className="py-20 bg-gradient-to-br from-foreground via-foreground to-foreground/90 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 right-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
              <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#7DE8E8] rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-4">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Planes de Patrocinio</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-background mb-4">
                  Trabaja Con Nosotros
                </h2>
                <p className="text-background/70 text-lg max-w-2xl mx-auto">
                  Planes diseñados para maximizar el impacto de tu marca
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {sponsorshipPlans.map((plan, index) => (
                  <div 
                    key={index}
                    className={`rounded-3xl p-8 ${
                      plan.highlighted 
                        ? 'bg-primary text-background ring-4 ring-primary/30' 
                        : 'bg-background/10 backdrop-blur-sm text-background border border-background/20'
                    }`}
                  >
                    <h3 className={`text-3xl font-black mb-2 ${plan.highlighted ? 'text-background' : 'text-primary'}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm mb-6 ${plan.highlighted ? 'text-background/80' : 'text-background/60'}`}>
                      {plan.subtitle}
                    </p>
                    <ul className="space-y-4">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-background' : 'text-primary'}`} />
                          <span className={plan.highlighted ? 'text-background/90' : 'text-background/80'}>
                            <strong className={plan.highlighted ? 'text-background' : 'text-[#7DE8E8]'}>{feature.quantity}</strong> {feature.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  ¿Listo para Conectar con Nuestra Audiencia?
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Contáctanos para crear una estrategia personalizada que conecte tu marca 
                  con más de 3.5 millones de seguidores apasionados.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="mailto:hola@vacilateesto.com"
                    className="inline-flex"
                  >
                    <Button size="lg" className="group w-full sm:w-auto">
                      <Mail className="w-5 h-5 mr-2" />
                      Contáctanos
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                  <Button variant="outline" size="lg" className="group">
                    <Download className="w-5 h-5 mr-2" />
                    Descargar Media Kit PDF
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MediaKit;

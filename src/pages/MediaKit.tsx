import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
// PDF estático servido desde /public/media-kit/
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Send,
  Tv,
  Smartphone,
  MapPin,
  Star,
  MessageCircle,
  Trophy,
  Video,
  Info
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import logoVacilate from "@/assets/logo-vacilate-esto-dark.png";
import StickerHeader from "@/components/StickerHeader";
import StickerMarquee from "@/components/StickerMarquee";

// Datos de audiencia - Fuente: Metricool (01 ene – 31 jul 2026)
// Métricas calculadas desde el edge function metricool-brand-mentions sobre
// las publicaciones reales del período. No incluye seguidores ni crecimiento
// (esos datos no los expone la API que tenemos conectada).
const audienceData = {
  totalViews: "16.66M",
  totalImpressions: "23.14M",
  totalInteractions: "874.7K",
  totalPublications: "2,086",
  platforms: [
    { name: "TikTok", views: "5.44M", publications: "360", icon: Play },
    { name: "YouTube", views: "5.06M", publications: "417", icon: Youtube },
    { name: "Instagram", views: "4.23M", publications: "923", icon: Instagram },
    { name: "Facebook", views: "1.94M", publications: "386", icon: Facebook },
  ],
  views: {
    tiktok: "5.44M",
    instagram: "4.23M",
    facebook: "1.94M",
    youtube: "5.06M",
  },
  interactions: {
    tiktok: "466.3K",
    instagram: "353.7K",
    facebook: "n/d",
    youtube: "54.7K",
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
    platforms: "Televen TV, YouTube, Spotify, Radio FM Center",
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
    description: "Jhon lleva a Juan o Juan lleva a Jhon a un lugar fuera del estudio y le explica por qué le lleva a ese lugar. Sirve de excusa para mostrarle a la comunidad de Vacílate Esto lugares insólitos y sus historias.",
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
    title: "Streaming",
    subtitle: "TikTok Live",
    description: "Transmisiones en vivo en TikTok desde la grabación de nuestro podcast, fútbol en vivo o proyectos especiales como Roraima. Contenido interactivo que conecta en tiempo real con nuestra comunidad.",
    icon: Video,
    color: "bg-primary",
    stats: "En directo",
  },
  {
    title: "Guerra de Comerciales",
    subtitle: "Campeonato Nacional",
    description: "Torneo estilo Mundial de Fútbol donde enfrentamos los comerciales más icónicos de Venezuela. 40,773 votos, 1.35M impresiones y Covencaucho como campeón absoluto.",
    icon: Trophy,
    color: "bg-primary",
    stats: "40K+ votos",
    platforms: "Instagram, TikTok",
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
    title: "Canales de Difusión",
    subtitle: "Comunidad VIP",
    description: "Canales exclusivos en Instagram y WhatsApp con contenidos especiales para nuestras comunidades más fieles. Acceso directo y cercano con nuestra audiencia.",
    icon: MessageCircle,
    color: "bg-[#7DE8E8]",
    stats: "Instagram y WhatsApp",
  },
  {
    title: "Proyectos Especiales",
    subtitle: "Producciones Únicas",
    description: "Proyectos con identidad propia que nacen del ecosistema Vacílate Esto: Podcast Eterno, Podcast en la Cumbre y Pelotica de Goma. Cada uno con su audiencia y comunidad.",
    icon: Star,
    color: "bg-primary",
    stats: "3 proyectos realizados",
  },
  {
    title: "Vacílate El Fútbol",
    subtitle: "Cobertura Especial 2026",
    description: "El Mundial de Fútbol 2026 visto desde los ojos de Vacílate Esto. Una cobertura única con nuestro estilo, análisis y entretenimiento de febrero a julio 2026.",
    icon: Trophy,
    color: "bg-[#7DE8E8]",
    stats: "Feb - Jul 2026",
  },
];

const sponsorshipPlans = [
  {
    name: "Plan Mensual",
    subtitle: "Content Integration",
    features: [
      { quantity: "15", description: "Content Shorts en TikTok e Instagram" },
      { quantity: "4", description: "Long Podcast en YouTube" },
      { quantity: "2", description: "Historias en Instagram" },
      { quantity: "4", description: "Presencia en Newsletters" },
      { quantity: "1", description: "Short mensual con historia de marca" },
    ],
    highlighted: true,
  },
];

const topPosts = [
  { date: "09 May 2026", description: "YouTube · El portero que jugó con el cuello roto", impressions: "1.30M", interactions: "5.6K" },
  { date: "04 Feb 2026", description: "TikTok · Tito Rojas vivió en Caracas a principios de los 80…", impressions: "613.3K", interactions: "34.8K" },
  { date: "08 May 2026", description: "YouTube · El último país sin TV: vivir sin internet hasta 1999", impressions: "580.6K", interactions: "3.9K" },
  { date: "05 Abr 2026", description: "TikTok · La tonada, el vínculo sagrado entre el llanero y su tierra…", impressions: "421.7K", interactions: "39.1K" },
  { date: "26 May 2026", description: "Instagram · La mega autopista con túneles que termina en la nada", impressions: "360.5K", interactions: "142" },
  { date: "18 Mar 2026", description: "Instagram · Maracay no solo nos dio a Canserbero y a Miguel Cabrera…", impressions: "302.1K", interactions: "23.4K" },
];

// Marcas que trabajan con nosotros — activaciones 2026
const partnerBrands = [
  {
    name: "Plumrose",
    logo: "https://dpgvanocynbrmqvgvgvd.supabase.co/storage/v1/object/public/brand-logos/plumrose.png",
    detail: "Integraciones en podcast, shorts y activaciones gastronómicas.",
  },
  {
    name: "Nestea",
    logo: "https://dpgvanocynbrmqvgvgvd.supabase.co/storage/v1/object/public/brand-logos/nestea.png",
    detail: "Branded content en reels, stories y contenido de calle.",
  },
  {
    name: "Empire Keeway",
    logo: "https://dpgvanocynbrmqvgvgvd.supabase.co/storage/v1/object/public/brand-logos/empire.png",
    detail: "Presencia en rutas, metrajes y cobertura Vacílate El Fútbol.",
  },
  {
    name: "Vatel",
    logo: "https://dpgvanocynbrmqvgvgvd.supabase.co/storage/v1/object/public/brand-logos/vatel.webp",
    detail: "Branded content, lives de TikTok y activaciones en calle.",
  },
  {
    name: "Maggi",
    logo: "https://dpgvanocynbrmqvgvgvd.supabase.co/storage/v1/object/public/brand-logos/maggi.png",
    detail: "Integraciones en podcast, recetas y lives de TikTok.",
  },
];

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Por favor completa los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: formData,
      });

      if (error) throw error;

      toast({
        title: "¡Mensaje enviado!",
        description: "Nos pondremos en contacto contigo pronto.",
      });

      setFormData({ name: "", email: "", company: "", message: "" });
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al enviar el mensaje. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-3xl p-6 sm:p-8 border-2 border-foreground sticker-shadow-primary space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre *</Label>
          <Input
            id="name"
            placeholder="Tu nombre"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="company">Empresa / Marca</Label>
        <Input
          id="company"
          placeholder="Nombre de tu empresa o marca"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Mensaje *</Label>
        <Textarea
          id="message"
          placeholder="Cuéntanos sobre tu proyecto y cómo podemos colaborar..."
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
        />
      </div>
      <Button type="submit" size="lg" className="w-full border-2 border-foreground sticker-shadow-foreground font-display font-black uppercase tracking-widest" disabled={isSubmitting}>
        {isSubmitting ? (
          "Enviando..."
        ) : (
          <>
            <Mail className="w-5 h-5 mr-2" />
            Enviar Mensaje
          </>
        )}
      </Button>
    </form>
  );
};

const PdfActions = () => {
  const { toast } = useToast();
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [sendEmail, setSendEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async () => {
    if (!sendEmail) {
      toast({
        title: "Error",
        description: "Por favor ingresa un email válido.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sendEmail)) {
      toast({
        title: "Error",
        description: "Por favor ingresa un email válido.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      // Fetch static PDF and convert to base64
      const res = await fetch("/downloads/VacilateEsto-MediaKit-2026.pdf?v=20260805d");
      const blob = await res.blob();
      const pdfBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const { data, error } = await supabase.functions.invoke("send-mediakit-email", {
        body: { email: sendEmail, pdfBase64 },
      });

      if (error) throw error;

      toast({
        title: "¡Media Kit enviado!",
        description: `El PDF ha sido enviado a ${sendEmail}`,
      });

      setSendEmail("");
      setShowEmailInput(false);
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al enviar el email. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          variant="outline" 
          size="lg" 
          className="group"
          asChild
        >
          <a
            href="/downloads/VacilateEsto-MediaKit-2026.pdf?v=20260805d"
            download="Media Kit Vacilate Esto 2026.pdf"
          >
            <Download className="w-5 h-5 mr-2" />
            Descargar Media Kit PDF
          </a>
        </Button>
        
        <Button 
          size="lg" 
          className="group"
          onClick={() => setShowEmailInput(!showEmailInput)}
        >
          <Send className="w-5 h-5 mr-2" />
          Enviar Media Kit por Mail
        </Button>
      </div>

      {showEmailInput && (
        <div className="bg-muted/50 rounded-2xl p-6 max-w-md mx-auto animate-fade-in">
          <Label htmlFor="send-email" className="text-sm font-medium mb-2 block">
            Ingresa el email donde quieres recibir el Media Kit
          </Label>
          <div className="flex gap-2">
            <Input
              id="send-email"
              type="email"
              placeholder="tu@email.com"
              value={sendEmail}
              onChange={(e) => setSendEmail(e.target.value)}
              className="flex-1"
              disabled={isSending}
            />
            <Button 
              onClick={handleSendEmail} 
              disabled={isSending}
              className="shrink-0"
            >
              {isSending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enviando...
                </span>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Recibirás el Media Kit Vacílate Esto 2026 en tu bandeja de entrada.
          </p>
        </div>
      )}
    </div>
  );
};

const MediaKit = () => {
  return (
    <>
      <Helmet>
        <title>Media Kit 2026 | Vacílate Esto</title>
        <meta name="description" content="Media Kit oficial de Vacílate Esto. 1.84M+ seguidores, 93.15M impresiones. Descubre oportunidades de patrocinio: Vacílate El Fútbol 2026, Campeonato de Comerciales, Podcast en la Cumbre y más formatos." />
        <meta name="keywords" content="media kit venezuela, patrocinio podcast, publicidad podcast, vacilate esto sponsors, mundial 2026 patrocinio, influencer marketing venezuela" />
        <link rel="canonical" href="https://www.vacilateesto.com/media-kit" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Media Kit 2026 | Vacílate Esto Podcast" />
        <meta property="og:description" content="Colabora con el ecosistema de contenido más grande de Venezuela. 1.84M+ seguidores. Vacílate El Fútbol 2026, Campeonato de Comerciales y más." />
        <meta property="og:url" content="https://www.vacilateesto.com/media-kit" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Media Kit 2026 | Vacílate Esto" />
        <meta name="twitter:description" content="Colabora con el una de las marcas de entretenimiento digital más relevantes de Venezuela. 1.84M+ seguidores. Vacílate El Fútbol 2026 y más proyectos." />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Media Kit Vacílate Esto 2026",
            "description": "Media Kit oficial con métricas, formatos de contenido y oportunidades de patrocinio del una de las marcas de entretenimiento digital más relevantes de Venezuela.",
            "url": "https://www.vacilateesto.com/media-kit",
            "mainEntity": {
              "@type": "Organization",
              "name": "Vacílate Esto",
              "description": "Ecosistema de Fun Educaitment venezolano con más de 1.84 millones de seguidores.",
              "numberOfEmployees": "2",
              "founder": [
                { "@type": "Person", "name": "Juan Carlos Martínez" },
                { "@type": "Person", "name": "Jhon Da Silva" }
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "1300"
              }
            },
            "offers": [
              {
                "@type": "Offer",
                "name": "Vacílate El Fútbol 2026",
                "description": "Patrocinio para cobertura multiplataforma del Mundial de Fútbol 2026 en México, USA y Canadá. Contenido de febrero a julio 2026.",
                "category": "Patrocinio Especial"
              },
              {
                "@type": "Offer",
                "name": "Campeonato de Comerciales",
                "description": "Torneo interactivo de comerciales icónicos venezolanos. 40K+ votos, 1.35M impresiones.",
                "category": "Branded Content"
              },
              {
                "@type": "Offer",
                "name": "Brand Placement Intensivo",
                "description": "30 shorts con brand placement, 4 podcasts largos, historias y newsletters semanales.",
                "category": "Plan de Patrocinio"
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main>
          {/* Hero Section — Sticker Pack Y2K */}
          <section className="relative pt-32 pb-20 overflow-hidden bg-foreground border-b-4 border-foreground">
            {/* Background decorations */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
            </div>
            {/* Floating stickers */}
            <div aria-hidden className="absolute top-28 left-6 hidden md:block rotate-[-10deg] bg-primary text-primary-foreground border-2 border-background px-3 py-1 font-display font-black text-xs uppercase tracking-widest shadow-[6px_6px_0_hsl(var(--background))]">
              ★ 1.84M
            </div>
            <div aria-hidden className="absolute top-40 right-8 hidden md:block rotate-[10deg] bg-accent text-accent-foreground border-2 border-background px-3 py-1 font-display font-black text-xs uppercase tracking-widest shadow-[6px_6px_0_hsl(var(--background))]">
              ◆ Media Kit
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground border-2 border-background mb-8 shadow-[4px_4px_0_hsl(var(--background))] rotate-[-2deg]">
                  <span className="font-display font-black text-xs uppercase tracking-widest">MediaKit 2026</span>
                </div>
                
                <img 
                  src={logoVacilate} 
                  alt="Vacílate Esto" 
                  className="h-24 md:h-32 mx-auto mb-8 drop-shadow-[8px_8px_0_hsl(var(--primary))] brightness-0 invert"
                />
                
                <h1 className="font-display font-black tracking-[-0.04em] leading-[0.9] text-[10vw] sm:text-5xl md:text-7xl text-background mb-6">
                  El Ecosistema de Contenido{" "}
                  <span className="italic bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Fun Educaitment</span>
                  .
                </h1>
                
                <p className="font-body text-base md:text-xl text-background/70 mb-10 max-w-2xl mx-auto">
                  Entre enero y julio de 2026 generamos <strong>23.14M de impresiones</strong>, <strong>16.66M de views</strong> y{" "}
                  <strong>874.7K interacciones</strong> con 2,086 publicaciones en TikTok, Instagram, Facebook y YouTube.
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12">
                  {[
                    { value: "16.66M", label: "Views ene–jul 2026", icon: Eye },
                    { value: "23.14M", label: "Impresiones (4 redes)", icon: TrendingUp },
                    { value: "874.7K", label: "Interacciones", icon: Heart },
                    { value: "2,086", label: "Publicaciones", icon: FileText },
                  ].map((stat, index) => (
                    <div key={index} className="bg-background/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-background/20">
                      <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl md:text-3xl font-bold text-background">{stat.value}</div>
                      <div className="text-xs md:text-sm text-background/60">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Nota de fuente de datos */}
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="mt-6 inline-flex items-center gap-2 rounded-full border border-background/25 bg-background/10 px-4 py-2 text-[11px] md:text-xs text-background/70 backdrop-blur-sm hover:bg-background/20 transition-colors"
                      >
                        <Info className="w-3.5 h-3.5" />
                        Fuente principal: Metricool · Apify solo como verificación
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs leading-relaxed">
                      Todas las cifras publicadas provienen de Metricool (Instagram, Facebook, TikTok y YouTube),
                      nuestra fuente oficial de medición. Apify se usa únicamente como verificación complementaria
                      video por video en TikTok cuando aplica, y nunca reemplaza ni suma a los datos de Metricool.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </section>

          {/* Platform Stats Section */}
          <section className="py-16 md:py-24 bg-background">
            <StickerMarquee
              items={["★ 16.66M VIEWS", "◆ 23.14M IMPRESIONES", "▲ 874.7K INTERACCIONES", "● 2,086 PUBLICACIONES", "★ FUENTE: METRICOOL · ENE–JUL 2026"]}
              variant="primary"
              className="mb-12 sm:mb-16"
            />
            <div className="container mx-auto px-4">
              <StickerHeader
                badge="Métricas por plataforma"
                badgeIcon={TrendingUp}
                badgeVariant="primary"
                title="Nuestra"
                highlight="presencia digital"
                description="Datos: 01 enero – 31 julio 2026 · Fuente: Metricool"
              />

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
                {audienceData.platforms.map((platform, index) => (
                  <div 
                    key={index} 
                    className={`bg-card rounded-2xl p-5 sm:p-6 border-2 border-foreground sticker-card-rotate ${index % 2 === 0 ? "sticker-shadow-primary sticker-tilt-l-sm" : "sticker-shadow-accent sticker-tilt-r-sm"} sticker-no-hover-mobile hover:-translate-y-1 transition-transform group`}
                  >
                    <platform.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                    <div className="text-[10px] uppercase tracking-widest font-display font-black text-muted-foreground mb-1">{platform.name}</div>
                    <div className="font-display text-2xl sm:text-3xl font-black text-foreground tracking-tight">{platform.views}</div>
                    <div className="text-xs text-muted-foreground mb-1">Views ene–jul</div>
                    <div className="inline-block mt-1 px-2 py-0.5 bg-foreground text-background text-xs font-display font-black">{platform.publications} pubs</div>
                  </div>
                ))}
              </div>

              {/* Impressions Grid */}
              <div className="mt-16 grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Impresiones */}
                <div className="bg-card rounded-3xl p-6 sm:p-8 border-2 border-foreground sticker-shadow-primary">
                  <h3 className="font-display text-2xl sm:text-3xl font-black text-foreground mb-6 flex items-center gap-3 tracking-tight">
                    <span className="inline-flex items-center justify-center w-9 h-9 bg-primary text-primary-foreground border-2 border-foreground rounded-full">
                      <Eye className="w-4 h-4" />
                    </span>
                    Views <span className="italic text-gradient">por plataforma</span>
                  </h3>
                  <div className="space-y-4">
                    {[
                      { platform: "TikTok", value: audienceData.views.tiktok, growth: "" },
                      { platform: "Instagram", value: audienceData.views.instagram, growth: "" },
                      { platform: "Facebook", value: audienceData.views.facebook, growth: "" },
                      { platform: "YouTube", value: audienceData.views.youtube, growth: "" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
                        <span className="text-foreground font-medium">{item.platform}</span>
                        <div className="text-right">
                          <span className="font-display text-xl font-black text-foreground">{item.value}</span>
                          {item.growth && <span className={`text-xs ml-2 px-1.5 py-0.5 font-display font-black border-2 border-foreground ${item.growth.startsWith('-') ? 'bg-destructive text-destructive-foreground' : 'bg-accent text-accent-foreground'}`}>{item.growth}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interacciones */}
                <div className="bg-card rounded-3xl p-6 sm:p-8 border-2 border-foreground sticker-shadow-accent">
                  <h3 className="font-display text-2xl sm:text-3xl font-black text-foreground mb-6 flex items-center gap-3 tracking-tight">
                    <span className="inline-flex items-center justify-center w-9 h-9 bg-accent text-accent-foreground border-2 border-foreground rounded-full">
                      <Heart className="w-4 h-4" />
                    </span>
                    Interacciones <span className="italic text-gradient">totales</span>
                  </h3>
                  <div className="space-y-4">
                    {[
                      { platform: "TikTok", value: audienceData.interactions.tiktok },
                      { platform: "Instagram", value: audienceData.interactions.instagram },
                      { platform: "Facebook", value: audienceData.interactions.facebook },
                      { platform: "YouTube", value: audienceData.interactions.youtube },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
                        <span className="text-foreground font-medium">{item.platform}</span>
                        <span className="font-display text-xl font-black text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Demographics Section */}
          <section className="py-16 md:py-24 bg-muted/30 border-y-2 border-foreground">
            <div className="container mx-auto px-4">
              <StickerHeader
                badge="Demografía"
                badgeIcon={Globe}
                badgeVariant="accent"
                title="¿De dónde es"
                highlight="nuestra audiencia"
                description="Una comunidad global con fuerte presencia en Venezuela y la diáspora · Fuente: Metricool (acumulado histórico)"
              />

              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Países */}
                <div className="bg-card rounded-3xl p-6 sm:p-8 border-2 border-foreground sticker-shadow-primary">
                  <div className="inline-block mb-6 px-3 py-1 bg-foreground text-background border-2 border-foreground font-display font-black text-xs uppercase tracking-widest -rotate-1">★ Top 10 Países</div>
                  <div className="space-y-3">
                    {audienceData.demographics.countries.map((country, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <span className="w-7 h-7 flex items-center justify-center text-xs font-display font-black bg-primary text-primary-foreground border-2 border-foreground rounded-full">{idx + 1}</span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-foreground font-medium">{country.name}</span>
                            <span className="font-display text-foreground font-black">{country.percentage}</span>
                          </div>
                          <div className="h-2.5 bg-muted rounded-full overflow-hidden border border-foreground">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: country.percentage }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Regiones */}
                <div className="bg-card rounded-3xl p-6 sm:p-8 border-2 border-foreground sticker-shadow-accent">
                  <div className="inline-block mb-6 px-3 py-1 bg-accent text-accent-foreground border-2 border-foreground font-display font-black text-xs uppercase tracking-widest rotate-1">◆ Top Regiones</div>
                  <div className="space-y-3">
                    {audienceData.demographics.regions.map((region, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <span className="w-7 h-7 flex items-center justify-center text-xs font-display font-black bg-accent text-accent-foreground border-2 border-foreground rounded-full">{idx + 1}</span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-foreground font-medium capitalize">{region.name}</span>
                            <span className="font-display text-foreground font-black">{region.percentage}</span>
                          </div>
                          <div className="h-2.5 bg-muted rounded-full overflow-hidden border border-foreground">
                            <div 
                              className="h-full bg-accent rounded-full"
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
          <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
              <StickerHeader
                badge="Formatos de contenido"
                badgeIcon={Play}
                badgeVariant="dark"
                title="Nuestro ecosistema de"
                highlight="contenido"
                description="Múltiples formatos para conectar con nuestra audiencia de diferentes maneras."
              />

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 sticker-grid-safe">
                {contentFormats.map((format, index) => (
                  <div 
                    key={index}
                    className={`group bg-card rounded-3xl p-6 sm:p-7 border-2 border-foreground sticker-card-rotate ${index % 3 === 0 ? "sticker-shadow-primary sticker-tilt-l-sm" : index % 3 === 1 ? "sticker-shadow-accent sticker-tilt-r-sm" : "sticker-shadow-foreground"} sticker-no-hover-mobile hover:-translate-y-1 transition-transform`}
                  >
                    <div className={`w-14 h-14 ${format.color} border-2 border-foreground rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:-rotate-6 transition-transform shadow-[3px_3px_0_hsl(var(--foreground))]`}>
                      <format.icon className="w-7 h-7 text-foreground" />
                    </div>
                    <div className="text-[10px] font-display font-black uppercase tracking-widest text-primary mb-1">{format.subtitle}</div>
                    <h3 className="font-display text-xl sm:text-2xl font-black text-foreground mb-3 leading-tight tracking-tight">{format.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {format.description}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-foreground text-background text-[10px] font-display font-black uppercase tracking-widest mb-3">
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
          <section className="py-16 md:py-24 bg-muted/30 border-y-2 border-foreground">
            <div className="container mx-auto px-4">
              <StickerHeader
                badge="Top publicaciones"
                badgeIcon={TrendingUp}
                badgeVariant="primary"
                title="Contenido que"
                highlight="genera impacto"
                description="Top 6 publicaciones ene–jul 2026 · Fuente: Metricool"
              />

              <div className="overflow-x-auto">
                <table className="w-full bg-card rounded-2xl border-2 border-foreground sticker-shadow-foreground overflow-hidden">
                  <thead className="bg-foreground text-background">
                    <tr>
                      <th className="px-4 sm:px-6 py-4 text-left text-[10px] sm:text-xs font-display font-black uppercase tracking-widest">Fecha</th>
                      <th className="px-4 sm:px-6 py-4 text-left text-[10px] sm:text-xs font-display font-black uppercase tracking-widest">Descripción</th>
                      <th className="px-4 sm:px-6 py-4 text-right text-[10px] sm:text-xs font-display font-black uppercase tracking-widest">Impresiones</th>
                      <th className="px-4 sm:px-6 py-4 text-right text-[10px] sm:text-xs font-display font-black uppercase tracking-widest">Interacciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPosts.map((post, idx) => (
                      <tr key={idx} className="border-t-2 border-foreground hover:bg-primary/10 transition-colors">
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-muted-foreground whitespace-nowrap font-medium">{post.date}</td>
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-foreground">{post.description}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm font-display font-black text-foreground text-right">{post.impressions}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm font-display font-black text-primary text-right">{post.interactions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Partner Brands Section */}
          <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
              <StickerHeader
                badge="Marcas aliadas"
                badgeIcon={Star}
                badgeVariant="accent"
                title="Marcas que"
                highlight="trabajan con nosotros"
                description="Activaciones vigentes 2026 con marcas líderes en Venezuela."
              />

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 sticker-grid-safe max-w-5xl mx-auto">
                {partnerBrands.map((brand, index) => (
                  <div
                    key={brand.name}
                    className={`bg-card rounded-3xl p-6 border-2 border-foreground sticker-card-rotate ${index % 2 === 0 ? "sticker-shadow-primary sticker-tilt-l-sm" : "sticker-shadow-accent sticker-tilt-r-sm"} sticker-no-hover-mobile hover:-translate-y-1 transition-transform text-center`}
                  >
                    <div className="h-24 flex items-center justify-center mb-4 bg-white rounded-2xl border-2 border-foreground p-3">
                      <img
                        src={brand.logo}
                        alt={`Logo de ${brand.name}`}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <h3 className="font-display text-xl font-black text-foreground tracking-tight">{brand.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{brand.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Sponsorship Plans Section */}
          <section className="py-16 md:py-24 bg-foreground relative overflow-hidden border-b-4 border-foreground">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 right-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
              <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
            </div>
            {/* Floating stickers */}
            <div aria-hidden className="absolute top-16 left-6 hidden md:block rotate-[-8deg] bg-primary text-primary-foreground border-2 border-background px-3 py-1 font-display font-black text-xs uppercase tracking-widest shadow-[5px_5px_0_hsl(var(--background))]">
              ★ Sponsors
            </div>
            <div aria-hidden className="absolute top-24 right-8 hidden md:block rotate-[8deg] bg-accent text-accent-foreground border-2 border-background px-3 py-1 font-display font-black text-xs uppercase tracking-widest shadow-[5px_5px_0_hsl(var(--background))]">
              ◆ 2026
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <StickerHeader
                badge="Planes de patrocinio"
                badgeIcon={Calendar}
                badgeVariant="primary"
                title="Trabaja"
                highlight="con nosotros"
                description="Planes diseñados para maximizar el impacto de tu marca."
                onDark
              />

              <div className="grid gap-6 sm:gap-8 max-w-md mx-auto sticker-grid-safe">
                {sponsorshipPlans.map((plan, index) => (
                  <div 
                    key={index}
                    className={`relative rounded-3xl p-6 sm:p-8 border-2 border-background sticker-card-rotate sticker-tilt-r-sm ${
                      plan.highlighted 
                        ? 'bg-primary text-primary-foreground shadow-[6px_6px_0_hsl(var(--background))] sm:shadow-[10px_10px_0_hsl(var(--background))]' 
                        : 'bg-background text-foreground shadow-[6px_6px_0_hsl(var(--accent))] sm:shadow-[10px_10px_0_hsl(var(--accent))]'
                    }`}
                  >
                    {plan.highlighted && (
                      <div className="absolute -top-3 -right-3 rotate-[10deg] bg-accent text-accent-foreground border-2 border-foreground px-3 py-1 font-display font-black text-[10px] uppercase tracking-widest shadow-[3px_3px_0_hsl(var(--foreground))]">
                        ★ Recomendado
                      </div>
                    )}
                    <h3 className={`font-display text-3xl sm:text-4xl font-black mb-2 tracking-tight ${plan.highlighted ? 'text-primary-foreground' : 'text-foreground'}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-xs uppercase tracking-widest font-display font-black mb-6 ${plan.highlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {plan.subtitle}
                    </p>
                    <ul className="space-y-4">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-primary-foreground' : 'text-primary'}`} />
                          <span className={plan.highlighted ? 'text-primary-foreground/90' : 'text-foreground/80'}>
                            <strong className={`font-display font-black ${plan.highlighted ? 'text-primary-foreground' : 'text-accent-foreground bg-accent px-1.5 border-2 border-foreground'}`}>{feature.quantity}</strong> {feature.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Form Section */}
          <section className="py-16 md:py-24 bg-background" id="contacto">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <StickerHeader
                  badge="Contacto"
                  badgeIcon={Mail}
                  badgeVariant="accent"
                  title="¿Listo para conectar con"
                  highlight="nuestra audiencia"
                  description="Completa el formulario y te contactaremos para crear una estrategia personalizada."
                />

                <ContactForm />

                <PdfActions />
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

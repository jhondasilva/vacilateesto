import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickerHeader from "@/components/StickerHeader";
import StickerMarquee from "@/components/StickerMarquee";
import { Mountain, Users, MapPin, Newspaper, TrendingUp, Eye, Heart, Instagram, Youtube, Facebook, Quote, Sparkles, Trophy, ArrowRight, CalendarDays, CheckCircle2, Handshake } from "lucide-react";
import logoCumbre from "@/assets/logo-podcast-cumbre.avif";

// Custom TikTok icon
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const PodcastEnLaCumbre = () => {
  // Function to download both press releases
  const handleDownloadPressReleases = () => {
    const files = [
      '/press/Podcast_en_la_Cumbre_NOTA_DE_PRENSA.pdf',
      '/press/Nota_de_Prensa_Vacilate_Esto_conquista_la_cima.pdf'
    ];
    
    files.forEach((file, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = file;
        link.download = file.split('/').pop() || 'nota-de-prensa.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 500);
    });
  };

  // Enhanced structured data for SEO and AI
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "PodcastSeries",
        "@id": "https://www.vacilateesto.com/podcast-en-la-cumbre#podcast",
        "name": "Podcast en la Cumbre",
        "alternateName": ["Podcast En La Cumbre Venezuela", "Vacílate Esto En La Cumbre"],
        "description": "Podcast en la Cumbre es una travesía audiovisual de siete meses grabando podcasts en las cumbres más emblemáticas de Venezuela: Pico Naiguatá (2.765m), Monte Roraima (2.810m) y Pico Bolívar (4.978m). Un proyecto de Vacílate Esto que combina aventura, humor y reflexión para mostrar a Venezuela desde sus alturas.",
        "url": "https://www.vacilateesto.com/podcast-en-la-cumbre",
        "image": "https://www.vacilateesto.com/og-image.png",
        "inLanguage": "es-VE",
        "genre": ["Aventura", "Documental", "Entretenimiento", "Viajes", "Montañismo", "Cultura Venezolana"],
        "keywords": "podcast venezuela, podcast montaña, pico naiguata, monte roraima, pico bolivar, aventura venezuela, montañismo venezuela, podcast latinoamerica, mejor podcast venezuela",
        "author": [
          {
            "@type": "Person",
            "name": "Juan Carlos Martínez",
            "alternateName": "JuanSofa",
            "url": "https://www.instagram.com/juansofa/",
            "jobTitle": "Co-Host y Creador de Contenido"
          },
          {
            "@type": "Person",
            "name": "Jhon Da Silva",
            "alternateName": "JhonSnacks",
            "url": "https://www.instagram.com/jhonsnacks/",
            "jobTitle": "Co-Host y Creador de Contenido"
          }
        ],
        "publisher": {
          "@type": "Organization",
          "name": "Vacílate Esto",
          "url": "https://www.vacilateesto.com",
          "parentOrganization": {
            "@type": "Organization",
            "name": "El Patio Content Studio"
          }
        },
        "producer": {
          "@type": "Organization",
          "name": "El Patio Content Studio"
        },
        "contentLocation": [
          {
            "@type": "Place",
            "name": "Pico Naiguatá",
            "description": "El techo de Caracas a 2.765 metros de altura",
            "geo": { "@type": "GeoCoordinates", "latitude": "10.5333", "longitude": "-66.8833", "elevation": "2765" },
            "containedInPlace": { "@type": "Country", "name": "Venezuela" }
          },
          {
            "@type": "Place",
            "name": "Monte Roraima",
            "description": "Tepuy ancestral de 2.000 millones de años a 2.810 metros",
            "geo": { "@type": "GeoCoordinates", "latitude": "5.1436", "longitude": "-60.7625", "elevation": "2810" },
            "containedInPlace": { "@type": "Country", "name": "Venezuela" }
          },
          {
            "@type": "Place",
            "name": "Pico Bolívar",
            "description": "La montaña más alta de Venezuela a 4.978 metros",
            "geo": { "@type": "GeoCoordinates", "latitude": "8.5419", "longitude": "-71.0469", "elevation": "4978" },
            "containedInPlace": { "@type": "Country", "name": "Venezuela" }
          }
        ],
        "season": {
          "@type": "PodcastSeason",
          "seasonNumber": 1,
          "numberOfEpisodes": 3,
          "startDate": "2025-08",
          "endDate": "2026-02",
          "episode": [
            {
              "@type": "PodcastEpisode",
              "name": "Podcast en Naiguatá - El Techo de Caracas",
              "episodeNumber": 1,
              "description": "Primer episodio grabado en la cima del Pico Naiguatá a 2.765 metros, el techo de Caracas. Una expedición de 20 personas subiendo con micrófonos, cámaras y humor venezolano.",
              "inLanguage": "es-VE",
              "duration": "PT1H30M",
              "datePublished": "2025-09",
              "url": "https://www.youtube.com/watch?v=NdrcKpsD0UU",
              "associatedMedia": {
                "@type": "VideoObject",
                "name": "Podcast en Naiguatá - El Techo de Caracas",
                "embedUrl": "https://www.youtube.com/embed/NdrcKpsD0UU",
                "uploadDate": "2025-09-01"
              },
              "partOfSeries": { "@id": "https://www.vacilateesto.com/podcast-en-la-cumbre#podcast" }
            },
            {
              "@type": "PodcastEpisode",
              "name": "Podcast en Roraima - 2.000 Millones de Años de Ancestralidad",
              "episodeNumber": 2,
              "description": "Expedición al Monte Roraima, el tepuy más emblemático de Venezuela a 2.810 metros. Un viaje al origen del tiempo geológico y la cultura Pemón.",
              "inLanguage": "es-VE",
              "duration": "PT1H1M29S",
              "datePublished": "2025-11",
              "url": "https://www.youtube.com/watch?v=NZWSKJvOdXg",
              "associatedMedia": {
                "@type": "VideoObject",
                "name": "Podcast en Roraima - 2.000 Millones de Años de Ancestralidad",
                "embedUrl": "https://www.youtube.com/embed/NZWSKJvOdXg",
                "uploadDate": "2025-11-01"
              },
              "partOfSeries": { "@id": "https://www.vacilateesto.com/podcast-en-la-cumbre#podcast" }
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "137000",
          "bestRating": "5"
        },
        "interactionStatistic": [
          { "@type": "InteractionCounter", "interactionType": "https://schema.org/WatchAction", "userInteractionCount": "2600000" },
          { "@type": "InteractionCounter", "interactionType": "https://schema.org/LikeAction", "userInteractionCount": "137000" }
        ]
      },
      {
        "@type": "WebPage",
        "@id": "https://www.vacilateesto.com/podcast-en-la-cumbre",
        "url": "https://www.vacilateesto.com/podcast-en-la-cumbre",
        "name": "Podcast en la Cumbre | El Mejor Podcast de Aventura de Venezuela",
        "description": "Travesía audiovisual grabando podcasts en las montañas más emblemáticas de Venezuela: Naiguatá, Roraima y Pico Bolívar. Aventura, humor y reflexión desde las alturas con JuanSofa y JhonSnacks.",
        "inLanguage": "es-VE",
        "isPartOf": {
          "@type": "WebSite",
          "name": "Vacílate Esto",
          "url": "https://www.vacilateesto.com"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.vacilateesto.com" },
            { "@type": "ListItem", "position": 2, "name": "Podcast en la Cumbre", "item": "https://www.vacilateesto.com/podcast-en-la-cumbre" }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Qué es Podcast en la Cumbre?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Podcast en la Cumbre es una travesía audiovisual de siete meses para grabar podcasts en las cumbres más emblemáticas de Venezuela: Pico Naiguatá (2.765m), Monte Roraima (2.810m) y Pico Bolívar (4.978m). Es un proyecto de Vacílate Esto producido por El Patio Content Studio que combina aventura, humor y reflexión para mostrar a Venezuela desde sus alturas."
            }
          },
          {
            "@type": "Question",
            "name": "¿Quiénes son los hosts de Podcast en la Cumbre?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "JuanSofa (Juan Carlos Martínez) y JhonSnacks (Jhon Da Silva) son los co-hosts del proyecto. Son creadores de contenido venezolanos que lideran Vacílate Esto, combinando aventura, humor y reflexión en cada episodio desde las montañas más altas de Venezuela."
            }
          },
          {
            "@type": "Question",
            "name": "¿Cuáles son las montañas del proyecto Podcast en la Cumbre?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "El proyecto incluye tres cumbres icónicas de Venezuela: Pico Naiguatá (2.765m) conocido como el techo de Caracas, Monte Roraima (2.810m) el tepuy más emblemático con 2.000 millones de años de antigüedad, y Pico Bolívar (4.978m) la montaña más alta de Venezuela."
            }
          },
          {
            "@type": "Question",
            "name": "¿Dónde puedo ver los episodios de Podcast en la Cumbre?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Los episodios completos de Podcast en la Cumbre están disponibles en YouTube en el canal de Vacílate Esto. También puedes encontrar contenido adicional en Instagram, TikTok y Facebook bajo @vacilateestopodcast."
            }
          },
          {
            "@type": "Question",
            "name": "¿Cuál es el manifiesto de Podcast en la Cumbre?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "El manifiesto del proyecto afirma que 'Altura no es solo un destino, es una manera de vivir'. Es un recordatorio de que Venezuela tiene historias, paisajes y gente 'a la altura', sin envidiarle nada a nadie. El mantra es: 'Desde arriba, todo tiene sentido'."
            }
          },
          {
            "@type": "Question",
            "name": "¿Cuántas visualizaciones tiene Podcast en la Cumbre?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Podcast en la Cumbre ha generado más de 2.6 millones de visualizaciones y 137,000 interacciones en todas las plataformas, con una tasa de engagement del 6.6% entre agosto y noviembre de 2025."
            }
          }
        ]
      },
      {
        "@type": "VideoObject",
        "name": "Podcast en la Cumbre - Episodio Naiguatá",
        "description": "Primer episodio de Podcast en la Cumbre grabado en el Pico Naiguatá a 2.765 metros, el techo de Caracas, Venezuela.",
        "thumbnailUrl": "https://img.youtube.com/vi/NZWSKJvOdXg/maxresdefault.jpg",
        "uploadDate": "2025-09-01",
        "duration": "PT1H30M",
        "contentUrl": "https://www.youtube.com/watch?v=NZWSKJvOdXg",
        "embedUrl": "https://www.youtube.com/embed/NZWSKJvOdXg",
        "interactionStatistic": { "@type": "InteractionCounter", "interactionType": "https://schema.org/WatchAction", "userInteractionCount": "50000" }
      },
      {
        "@type": "VideoObject",
        "name": "Podcast en la Cumbre - Episodio Roraima",
        "description": "Expedición al Monte Roraima grabando podcast a 2.810 metros. 2.000 millones de años de ancestralidad venezolana.",
        "thumbnailUrl": "https://img.youtube.com/vi/NdrcKpsD0UU/maxresdefault.jpg",
        "uploadDate": "2025-11-01",
        "duration": "PT1H1M29S",
        "contentUrl": "https://www.youtube.com/watch?v=NdrcKpsD0UU",
        "embedUrl": "https://www.youtube.com/embed/NdrcKpsD0UU",
        "interactionStatistic": { "@type": "InteractionCounter", "interactionType": "https://schema.org/WatchAction", "userInteractionCount": "30000" }
      }
    ]
  };

  const platformStats = [
    { platform: "Instagram", icon: Instagram, posts: 79, views: "1.6M", interactions: "75.8K", rate: "8.5%" },
    { platform: "Facebook", icon: Facebook, posts: 73, views: "603K", interactions: "32.3K", rate: "4.7%" },
    { platform: "TikTok", icon: TikTokIcon, posts: 35, views: "257K", interactions: "29K", rate: "10.1%" },
    { platform: "YouTube", icon: Youtube, posts: 25, views: "119K", interactions: "2.3K", rate: "2.0%" },
  ];

  return (
    <>
      <Helmet>
        <title>Podcast en la Cumbre | Aventura Venezuela 🇻🇪</title>
        <meta name="title" content="Podcast en la Cumbre | Aventura Venezuela" />
        <meta name="description" content="Travesía audiovisual de Vacílate Esto grabando podcasts en las montañas más altas de Venezuela: Naiguatá, Roraima y Pico Bolívar." />
        <meta name="keywords" content="podcast en la cumbre, podcast venezuela, podcast montaña venezuela, pico naiguata podcast, monte roraima podcast, pico bolivar, aventura venezuela, JuanSofa, JhonSnacks, vacilate esto, montañismo venezuela, mejor podcast aventura, podcast latinoamerica, podcasts venezolanos, tepuy roraima" />
        <meta name="author" content="Vacílate Esto - JuanSofa y JhonSnacks" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="language" content="Spanish" />
        <meta name="geo.region" content="VE" />
        <meta name="geo.country" content="Venezuela" />
        <meta name="geo.placename" content="Caracas, Venezuela" />
        <link rel="canonical" href="https://www.vacilateesto.com/podcast-en-la-cumbre" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Vacílate Esto" />
        <meta property="og:title" content="Podcast en la Cumbre | Aventura en las Montañas de Venezuela 🇻🇪" />
        <meta property="og:description" content="Travesía audiovisual de 7 meses grabando podcasts en Naiguatá, Roraima y Pico Bolívar. Tres cumbres, tres historias, un mismo mensaje: Aquí hay altura, aquí hay país." />
        <meta property="og:url" content="https://www.vacilateesto.com/podcast-en-la-cumbre" />
        <meta property="og:image" content="https://www.vacilateesto.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="es_VE" />
        <meta property="og:locale:alternate" content="es_ES" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vacilateesto" />
        <meta name="twitter:creator" content="@vacilateesto" />
        <meta name="twitter:title" content="Podcast en la Cumbre | Aventura en Venezuela 🏔️" />
        <meta name="twitter:description" content="Grabando podcasts en las cumbres más emblemáticas de Venezuela: Naiguatá, Roraima y Pico Bolívar. Por JuanSofa y JhonSnacks." />
        <meta property="twitter:image" content="https://www.vacilateesto.com/og-image.png" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main itemScope itemType="https://schema.org/Article">
          {/* Hero Section — Sticker Pack Y2K */}
          <section className="relative pt-28 pb-12 bg-background overflow-hidden border-b-4 border-foreground" aria-label="Introducción">
            {/* Decorative floating stickers */}
            <div aria-hidden className="absolute top-28 left-6 hidden md:block rotate-[-10deg] bg-foreground text-background border-2 border-foreground px-3 py-1 font-display font-black text-xs uppercase tracking-widest shadow-[6px_6px_0_hsl(var(--primary))]">
              ▲ 4.978m
            </div>
            <div aria-hidden className="absolute top-40 right-8 hidden md:block rotate-[12deg] bg-accent text-accent-foreground border-2 border-foreground px-3 py-1 font-display font-black text-xs uppercase tracking-widest shadow-[6px_6px_0_hsl(var(--foreground))]">
              ★ Aventura
            </div>
            <div className="container mx-auto px-4 relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground border-2 border-foreground rounded-full mb-6 shadow-[4px_4px_0_hsl(var(--foreground))] rotate-[-2deg]">
                <Mountain className="w-4 h-4" />
                <span className="font-display font-black text-xs uppercase tracking-widest">Travesía 2025-2026</span>
              </div>
              <div className="flex justify-center mb-6">
                <img 
                  src={logoCumbre} 
                  alt="Podcast en la Cumbre - Logo del proyecto de podcasts en montañas de Venezuela" 
                  className="w-full max-w-2xl h-auto"
                  loading="eager"
                />
              </div>
              
              <p className="font-body text-foreground/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed" itemProp="description">
                Una travesía audiovisual de siete meses para mostrar a Venezuela desde sus alturas 
                —Naiguatá, Roraima y Pico Bolívar— en un viaje que mezcla{" "}
                <span className="italic font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">aventura, humor y reflexión.</span>
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#pico-bolivar"
                  className="inline-flex items-center gap-2 px-6 py-4 bg-primary text-primary-foreground border-2 border-foreground rounded-2xl font-display font-black text-sm uppercase tracking-widest shadow-[6px_6px_0_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_hsl(var(--foreground))] transition-all"
                >
                  <Trophy className="w-4 h-4" />
                  Pico Bolívar · Récord Mundial · Nov 2026
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#marcas-bolivar"
                  className="inline-flex items-center gap-2 px-6 py-4 bg-background text-foreground border-2 border-foreground rounded-2xl font-display font-black text-sm uppercase tracking-widest shadow-[6px_6px_0_hsl(var(--primary))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_hsl(var(--primary))] transition-all"
                >
                  <Handshake className="w-4 h-4" />
                  Propuesta para marcas
                </a>
              </div>
            </div>
          </section>

          {/* Manifiesto Section */}
          <StickerMarquee items={["★ Naiguatá 2.765m", "▲ Roraima 2.810m", "● Pico Bolívar 4.978m", "✦ Aquí hay altura"]} variant="primary" />
          <section className="py-16 sm:py-24 bg-foreground text-background border-b-4 border-foreground" aria-labelledby="manifiesto-heading">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <StickerHeader
                  badge="Manifiesto"
                  badgeIcon={Quote}
                  badgeVariant="primary"
                  title="Altura no es solo un"
                  highlight="destino"
                  align="center"
                  onDark
                />
                <div className="bg-background/5 border-2 border-background/30 rounded-2xl p-8 sm:p-10 space-y-6 text-background/90 text-base sm:text-lg leading-relaxed text-center">
                  <p className="text-2xl font-bold text-primary">
                    Altura no es solo un destino. Es una manera de vivir.
                  </p>
                  
                  <p>
                    Queremos recordarle al mundo de qué estamos hechos. Porque mientras algunos dudan 
                    de lo que somos, nosotros seguimos subiendo la barra.
                  </p>
                  
                  <p>
                    No con arrogancia, sino con la certeza de que <strong className="text-primary">¡tenemos con qué!</strong> Porque 
                    este país tiene historias, paisajes, marcas y, sobre todo, gente a la altura, 
                    sin envidiarle nada a nadie.
                  </p>
                  
                  <p>
                    Desde Vacílate Esto, hoy decidimos subir. Porque creemos que el camino cambia la mirada. 
                    Y porque contar lo que somos, desde lo alto, es un acto de orgullo.
                  </p>
                  
                  <p className="text-xl font-semibold">
                    Venezuela no es solo un territorio. Es carácter. Es talento. Es dignidad.
                  </p>
                  
                  <div className="pt-6 border-t border-background/20">
                    <p className="font-display font-black text-xs uppercase tracking-widest text-primary mb-5">Una afirmación</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <span className="px-4 py-2 bg-primary text-primary-foreground border-2 border-background font-display font-black text-xs uppercase tracking-widest rotate-[-3deg]">🏔️ Aquí hay altura</span>
                      <span className="px-4 py-2 bg-accent text-accent-foreground border-2 border-background font-display font-black text-xs uppercase tracking-widest rotate-[2deg]">📖 Aquí hay historias</span>
                      <span className="px-4 py-2 bg-background text-foreground border-2 border-background font-display font-black text-xs uppercase tracking-widest rotate-[-2deg]">🇻🇪 Aquí hay país</span>
                    </div>
                  </div>
                </div>

                <div className="mt-10 bg-primary text-primary-foreground border-2 border-background rounded-2xl p-8 text-center sticker-tilt-r-sm sticker-card-rotate shadow-[8px_8px_0_hsl(var(--background))]">
                  <p className="font-display font-black text-[10px] uppercase tracking-widest mb-3">Mantra</p>
                  <p className="font-display font-black text-2xl sm:text-3xl italic tracking-[-0.02em]">
                    "Desde arriba, todo tiene sentido."
                  </p>
                  <p className="text-primary-foreground/80 mt-4 font-body text-sm sm:text-base">
                    Desde arriba entendemos por qué seguimos. Desde arriba vemos lo que nos une. 
                    Desde arriba, recordamos que Venezuela no se rinde: respira hondo, y sigue.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Resultados Section */}
          <section className="py-16 sm:py-24 bg-background border-b-4 border-foreground" aria-labelledby="resultados-heading">
            <div className="container mx-auto px-4">
              <StickerHeader
                badge="Agosto - Noviembre 2025"
                badgeIcon={TrendingUp}
                badgeVariant="dark"
                title="Resultados del"
                highlight="proyecto"
                description="Orgánico + Pago. Cifras consolidadas en todas las plataformas."
                align="center"
              />

              {/* Global Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6 max-w-5xl mx-auto mb-12">
                {[
                  { value: "212", label: "Publicaciones", tilt: "sticker-tilt-l-sm", shadow: "sticker-shadow-primary" },
                  { value: "2.6M", label: "Vistas Totales", tilt: "sticker-tilt-r-sm", shadow: "sticker-shadow-accent" },
                  { value: "137K", label: "Interacciones", tilt: "sticker-tilt-r-sm", shadow: "sticker-shadow-primary" },
                  { value: "6.6%", label: "Engagement", tilt: "sticker-tilt-l-sm", shadow: "sticker-shadow-accent" },
                ].map((s) => (
                  <div key={s.label} className={`bg-background border-2 border-foreground rounded-2xl p-5 sm:p-7 text-center sticker-card-rotate ${s.tilt} ${s.shadow}`}>
                    <div className="font-display font-black text-3xl md:text-5xl tracking-[-0.04em] text-foreground leading-none mb-3">{s.value}</div>
                    <div className="font-display font-black text-[10px] uppercase tracking-widest text-foreground/70">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Platform Stats */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 max-w-6xl mx-auto">
                {platformStats.map((stat, i) => (
                  <div
                    key={stat.platform}
                    className={`bg-background border-2 border-foreground rounded-2xl p-5 sm:p-6 sticker-card-rotate ${i % 2 === 0 ? "sticker-tilt-l-sm sticker-shadow-primary" : "sticker-tilt-r-sm sticker-shadow-accent"}`}
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-11 h-11 rounded-xl bg-foreground text-background border-2 border-foreground flex items-center justify-center rotate-[-4deg]">
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-display font-black text-base uppercase tracking-tight text-foreground">{stat.platform}</h3>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="font-display font-black text-[10px] uppercase tracking-widest text-foreground/60">Posts</span>
                        <span className="font-display font-black text-foreground">{stat.posts}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-display font-black text-[10px] uppercase tracking-widest text-foreground/60 flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Vistas
                        </span>
                        <span className="font-display font-black text-foreground">{stat.views}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-display font-black text-[10px] uppercase tracking-widest text-foreground/60 flex items-center gap-1">
                          <Heart className="w-3 h-3" /> Interacciones
                        </span>
                        <span className="font-display font-black text-foreground">{stat.interactions}</span>
                      </div>
                      <div className="pt-3 mt-2 border-t-2 border-foreground/20 flex justify-between items-center">
                        <span className="font-display font-black text-[10px] uppercase tracking-widest text-foreground/60">Engagement</span>
                        <span className="font-display font-black text-primary text-lg">{stat.rate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Community Stats */}
              <div className="mt-12 max-w-2xl mx-auto">
                <div className="bg-foreground text-background border-2 border-foreground rounded-2xl p-8 sm:p-10 text-center sticker-shadow-primary">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground border-2 border-background mb-5 rotate-[-6deg]">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-black text-xs uppercase tracking-widest mb-6">Comunidad Total</h3>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="font-display font-black text-4xl md:text-5xl tracking-[-0.04em] mb-2">277.9K</div>
                      <div className="font-display font-black text-[10px] uppercase tracking-widest text-background/70">Seguidores</div>
                    </div>
                    <div>
                      <div className="font-display font-black text-4xl md:text-5xl tracking-[-0.04em] text-primary mb-2">+9.1K</div>
                      <div className="font-display font-black text-[10px] uppercase tracking-widest text-background/70">Nuevos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Episodios Section */}
          <section className="py-16 sm:py-24 bg-muted/30 border-b-4 border-foreground" aria-labelledby="episodios-heading">
            <div className="container mx-auto px-4">
              <StickerHeader
                badge="Episodios"
                badgeIcon={Mountain}
                badgeVariant="primary"
                title="Capítulos en"
                highlight="altura"
                align="center"
              />
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <article className="space-y-4 sticker-card-rotate sticker-tilt-l-sm" itemProp="name">
                  <div className="aspect-video rounded-2xl overflow-hidden border-2 border-foreground sticker-shadow-primary">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/NdrcKpsD0UU"
                      title="Podcast en la Cumbre Episodio 1 - Pico Naiguatá Venezuela"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-display font-black text-xl sm:text-2xl tracking-[-0.02em] text-foreground">Episodio 1: Pico Naiguatá</h3>
                  <p className="text-foreground/70 text-sm font-body leading-relaxed">
                    El techo de Caracas a 2.765 metros. Una expedición de 20 personas subiendo con 
                    micrófonos, cámaras y el humor que no se enfría ni con neblina.
                  </p>
                </article>
                <article className="space-y-4 sticker-card-rotate sticker-tilt-r-sm">
                  <div className="aspect-video rounded-2xl overflow-hidden border-2 border-foreground sticker-shadow-accent">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/NZWSKJvOdXg"
                      title="Podcast en la Cumbre Episodio 2 - Monte Roraima Venezuela"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-display font-black text-xl sm:text-2xl tracking-[-0.02em] text-foreground">Episodio 2: Monte Roraima</h3>
                  <p className="text-foreground/70 text-sm font-body leading-relaxed">
                    2.000 millones de años de ancestralidad. El tepuy más emblemático de Venezuela 
                    a 2.810 metros donde el tiempo parece detenerse.
                  </p>
                </article>
              </div>
            </div>
          </section>

          {/* Naiguata Deep Dive */}
          <article className="py-16 sm:py-24 bg-background border-b-4 border-foreground" aria-labelledby="naiguata-heading">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground border-2 border-foreground flex items-center justify-center rotate-[-6deg] sticker-shadow-accent">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 id="naiguata-heading" className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-[-0.03em] text-foreground leading-none">
                      Pico <span className="italic text-gradient">Naiguatá</span>
                    </h2>
                    <p className="font-display font-black text-xs uppercase tracking-widest text-primary mt-2">2.765 m · El Techo de Caracas</p>
                  </div>
                </div>
                
                <div className="bg-muted/30 border-2 border-foreground rounded-2xl p-6 sm:p-8 sticker-shadow-primary space-y-4">
                  <p className="text-foreground/80 font-body leading-relaxed">
                    Grabar un podcast en el Naiguatá... subir y ganárselo. Nos fuimos 20 personas —equipo central, 
                    guías, porteadores, producción— con mochilas llenas de micrófonos, cámaras, comida, capas 
                    térmicas y ese humor que no se enfría ni con neblina.
                  </p>
                  <p className="text-foreground/80 font-body leading-relaxed">
                    Subimos por La Julia, cruzamos miradores, peñones y subidas que parecían castigos de gimnasio. 
                    Llegamos a la cima de Caracas a <strong className="text-foreground">2.765 metros sobre el nivel del mar</strong>, 
                    donde la ciudad se ve como un mapa y el mar asoma tímido detrás de la cordillera.
                  </p>
                </div>

                <blockquote className="my-8 bg-primary text-primary-foreground border-2 border-foreground rounded-2xl p-6 sm:p-8 font-display font-black text-xl sm:text-2xl tracking-[-0.02em] leading-tight italic sticker-shadow-accent sticker-tilt-l-sm sticker-card-rotate">
                  "Aquí estamos… más cerca del cielo y de quiénes somos como venezolanos."
                </blockquote>

                <p className="text-foreground/70 font-body leading-relaxed">
                  Ese día entendimos que subir una montaña es fácil… lo difícil es bajarse después de ver todo desde arriba.
                </p>
              </div>
            </div>
          </article>

          {/* Roraima Deep Dive */}
          <article className="py-16 sm:py-24 bg-muted/30 border-b-4 border-foreground" aria-labelledby="roraima-heading">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-accent text-accent-foreground border-2 border-foreground flex items-center justify-center rotate-[6deg] sticker-shadow-primary">
                    <Mountain className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 id="roraima-heading" className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-[-0.03em] text-foreground leading-none">
                      Monte <span className="italic text-gradient">Roraima</span>
                    </h2>
                    <p className="font-display font-black text-xs uppercase tracking-widest text-primary mt-2">2.810 m · 2.000M Años de Ancestralidad</p>
                  </div>
                </div>

                <div className="bg-background border-2 border-foreground rounded-2xl p-6 sm:p-8 mb-8 sticker-shadow-accent">
                  <h3 className="font-display font-black text-base uppercase tracking-tight text-foreground mb-5 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    La Escala del Tiempo
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { label: "Macizo Guayanés", value: "1.700 - 2.000 millones de años" },
                      { label: "Vida Multicelular", value: "600 millones de años" },
                      { label: "Los Dinosaurios", value: "240 - 66 millones de años" },
                      { label: "Historia de Venezuela", value: "Apenas 200 años" },
                    ].map((row, i) => (
                      <div key={row.label} className="flex items-center gap-3 p-3 bg-muted/50 border-2 border-foreground rounded-xl">
                        <div className="w-7 h-7 flex-shrink-0 rounded-lg bg-foreground text-background border-2 border-foreground font-display font-black text-[10px] flex items-center justify-center">
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <div>
                          <div className="font-display font-black text-sm text-foreground">{row.label}</div>
                          <div className="text-xs text-foreground/60 font-body">{row.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-foreground/80 font-body leading-relaxed">
                    El tepuy más emblemático de Venezuela representa un reto único: una meseta ancestral 
                    donde el tiempo parece detenerse. La expedición hacia la cima es una travesía de varios 
                    días atravesando la Gran Sabana, cruzando ríos y ascendiendo por la famosa rampa natural.
                  </p>
                  <p className="text-foreground/80 font-body leading-relaxed">
                    Al abordar temas de geología, biología y cultura Pemón, el podcast se aleja del humor 
                    ligero para tocar fibras educativas. El Roraima nos recordó que frente a la eternidad 
                    de la piedra, los problemas actuales son un parpadeo.
                  </p>
                </div>

                <blockquote className="my-8 bg-foreground text-background border-2 border-foreground rounded-2xl p-6 sm:p-8 font-display font-black text-xl sm:text-2xl tracking-[-0.02em] leading-tight italic sticker-shadow-primary sticker-tilt-r-sm sticker-card-rotate">
                  "El mundo diciéndole a los seres humanos: ustedes son los que están de paso."
                </blockquote>

                <p className="text-foreground/70 font-body leading-relaxed">
                  En la cima, entre formaciones rocosas milenarias y paisajes de otro mundo, 
                  capturamos la esencia mística de este lugar sagrado para los Pemón. El territorio permanece, 
                  y por ende, la identidad que emana de él es indestructible.
                </p>
              </div>
            </div>
          </article>

          {/* Aprendizajes / resultados de las dos primeras cumbres */}
          {/* Frases de la cumbre — extraídas de las transcripciones */}
          <section className="py-16 sm:py-24 bg-background border-b-4 border-foreground" aria-labelledby="frases-heading">
            <div className="container mx-auto px-4">
              <StickerHeader
                badge="En sus palabras"
                badgeIcon={Quote}
                badgeVariant="dark"
                title="Frases desde la"
                highlight="cumbre"
                description="Extractos textuales de las transcripciones de Naiguatá y Roraima."
                align="center"
              />
              <div id="frases-heading" className="sr-only">Frases de Jhon y Juan en Naiguatá y Roraima</div>

              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
                {[
                  {
                    speaker: "JhonSnacks",
                    ep: "Naiguatá · Ep. 1",
                    text: "La perspectiva que yo tenía del Ávila, este viaje la transformó por completo.",
                    tilt: "sticker-tilt-l-sm sticker-shadow-primary",
                  },
                  {
                    speaker: "JuanSofa",
                    ep: "Naiguatá · Ep. 1",
                    text: "Esta mañana cuando hicimos cumbre me salieron dos lagrimitas. Por eso ya puedo decir: caraqueño soy.",
                    tilt: "sticker-tilt-r-sm sticker-shadow-secondary",
                  },
                  {
                    speaker: "JhonSnacks",
                    ep: "Naiguatá · Ep. 1",
                    text: "Me conmueve la cantidad de gente que dice: gracias por darnos esta ventana, yo ya no puedo subir, pero ahí estamos con ustedes.",
                    tilt: "sticker-tilt-r-sm sticker-shadow-secondary",
                  },
                  {
                    speaker: "JuanSofa",
                    ep: "Naiguatá · Ep. 1",
                    text: "Hay dos formas de verlo: lo que Caracas ve del Ávila y lo que el Ávila ve de Caracas.",
                    tilt: "sticker-tilt-l-sm sticker-shadow-primary",
                  },
                  {
                    speaker: "JhonSnacks",
                    ep: "Roraima · Ep. 2",
                    text: "Altura no es solo un destino. Es una manera de vivir.",
                    tilt: "sticker-tilt-r-sm sticker-shadow-primary",
                  },
                  {
                    speaker: "JuanSofa",
                    ep: "Roraima · Ep. 2",
                    text: "Es literalmente el mundo diciéndole a los seres humanos: ustedes son los que están de paso.",
                    tilt: "sticker-tilt-l-sm sticker-shadow-secondary",
                  },
                  {
                    speaker: "JhonSnacks",
                    ep: "Roraima · Ep. 2",
                    text: "Sentí el síndrome de Stendhal: la belleza te sobrecoge de una manera tan profunda que no entiendes lo que estás viendo.",
                    tilt: "sticker-tilt-l-sm sticker-shadow-secondary",
                  },
                  {
                    speaker: "JuanSofa",
                    ep: "Roraima · Ep. 2",
                    text: "Los Himalayas no existían cuando esta formación ya existía.",
                    tilt: "sticker-tilt-r-sm sticker-shadow-primary",
                  },
                ].map((q) => (
                  <figure
                    key={`${q.speaker}-${q.text}`}
                    className={`bg-card border-2 border-foreground rounded-2xl p-6 sm:p-8 sticker-card-rotate ${q.tilt}`}
                  >
                    <Quote className="w-6 h-6 text-foreground/40 mb-3" aria-hidden="true" />
                    <blockquote className="font-display font-black text-lg sm:text-xl tracking-[-0.02em] leading-tight italic text-foreground">
                      “{q.text}”
                    </blockquote>
                    <figcaption className="mt-4 font-body text-sm text-foreground/60">
                      <span className="font-bold text-foreground">{q.speaker}</span> · {q.ep}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          {/* Comentarios reales de YouTube */}
          <section className="py-16 sm:py-24 bg-foreground text-background border-b-4 border-foreground" aria-labelledby="comentarios-heading">
            <div className="container mx-auto px-4">
              <StickerHeader
                badge="Comentarios reales"
                badgeIcon={Heart}
                badgeVariant="light"
                title="Lo que dice la"
                highlight="gente"
                description="Comentarios publicados por la audiencia en YouTube en los episodios de Naiguatá y Roraima."
                align="center"
                inverted
              />
              <div id="comentarios-heading" className="sr-only">Comentarios de la audiencia en YouTube</div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">
                {[
                  { author: "@RaimerLuisQ", ep: "Naiguatá", text: "Gracias por regalarnos cultura, historia, tecnología, por no dejar que se pierda la identidad del venezolano. Estoy lejos de mi país y reconecto cada vez que los veo." },
                  { author: "@danieljosegonzaleztineo2924", ep: "Naiguatá", text: "Mis amigos de montaña, qué orgulloso de ustedes. Qué bonita labor, me alegra siempre verlos subiendo la montaña." },
                  { author: "@caromartinezleon", ep: "Naiguatá", text: "¡Bellísimo! Me gustó mucho el episodio. Qué esfuerzo y calidad de todo ese equipo." },
                  { author: "@LeonardoJCaballeroG", ep: "Naiguatá", text: "Qué genial episodio, lo disfruté mucho 🎉❤" },
                  { author: "@jesusbenitez5262", ep: "Roraima", text: "Wow, qué increíble. Definitivamente están a otro nivel. Me imagino que esto es un récord, nadie ha hecho un podcast en ese lugar tan maravilloso 🎉" },
                  { author: "@magdalenapinto5125", ep: "Roraima", text: "Gracias por su valentía y su arduo trabajo... han hecho historia. Una manera de decirle al mundo que estamos en alto." },
                  { author: "@navarromendiri", ep: "Roraima", text: "Tuve la oportunidad de ascender el Roraima tres veces. La belleza y la inmensidad es abrumadora. Fueron unas aventuras alucinantes." },
                  { author: "@MariaGonzalez-xf1hl", ep: "Roraima", text: "Increíble muchachos, gracias por tremendo lugar y programa 🤗👍🙌" },
                  { author: "@MayExplora", ep: "Naiguatá", text: "Solo quien ha estado ahí sabe lo que estoy sintiendo en este momento, y lo que deseo volver. Quien no lo haya hecho debe vivir la experiencia." },
                ].map((c) => (
                  <figure
                    key={c.author + c.text.slice(0, 12)}
                    className="bg-background text-foreground border-2 border-background rounded-2xl p-5 sm:p-6"
                  >
                    <blockquote className="font-body text-sm sm:text-base leading-relaxed text-foreground/85">
                      “{c.text}”
                    </blockquote>
                    <figcaption className="mt-4 font-body text-xs sm:text-sm text-foreground/60 flex items-center gap-2">
                      <Youtube className="w-4 h-4" aria-hidden="true" />
                      <span className="font-bold text-foreground">{c.author}</span>
                      <span>· {c.ep}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 sm:py-24 bg-background border-b-4 border-foreground" aria-labelledby="aprendizajes-heading">
            <div className="container mx-auto px-4">
              <StickerHeader
                badge="Lo que ya hicimos"
                badgeIcon={TrendingUp}
                badgeVariant="dark"
                title="Dos cumbres, dos"
                highlight="resultados"
                description="Naiguatá y Roraima: la data que sostiene la apuesta por el Pico Bolívar."
                align="center"
              />
              <div id="aprendizajes-heading" className="sr-only">Resultados de Naiguatá y Roraima</div>

              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
                {[
                  {
                    title: "Pico Naiguatá",
                    meta: "2.765 m · Episodio 1",
                    tilt: "sticker-tilt-l-sm sticker-shadow-primary",
                    stats: [
                      { k: "Expedición", v: "20 personas" },
                      { k: "Formato", v: "Podcast completo en cima" },
                      { k: "Lectura", v: "Prueba de concepto" },
                    ],
                    text: "El techo de Caracas validó el formato: se puede producir un podcast íntegro, con audio y cámara, por encima de las nubes.",
                  },
                  {
                    title: "Monte Roraima",
                    meta: "2.810 m · Episodio 2",
                    tilt: "sticker-tilt-r-sm sticker-shadow-accent",
                    stats: [
                      { k: "Duración", v: "1h 01m en cima" },
                      { k: "Formato", v: "Podcast + microdocumental" },
                      { k: "Lectura", v: "Escala y narrativa" },
                    ],
                    text: "El tepuy elevó la producción: logística de varios días, cultura Pemón y una narrativa que trascendió el humor para tocar lo educativo.",
                  },
                ].map((c) => (
                  <article key={c.title} className={`bg-background border-2 border-foreground rounded-2xl p-6 sm:p-8 sticker-card-rotate ${c.tilt}`}>
                    <h3 className="font-display font-black text-2xl sm:text-3xl tracking-[-0.02em] text-foreground">{c.title}</h3>
                    <p className="font-display font-black text-[10px] uppercase tracking-widest text-primary mt-2 mb-5">{c.meta}</p>
                    <div className="space-y-2 mb-5">
                      {c.stats.map((s) => (
                        <div key={s.k} className="flex items-center justify-between gap-3 p-3 bg-muted/40 border-2 border-foreground rounded-xl">
                          <span className="font-display font-black text-[10px] uppercase tracking-widest text-foreground/70">{s.k}</span>
                          <span className="font-body text-sm font-semibold text-foreground text-right">{s.v}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-foreground/70 font-body text-sm leading-relaxed">{c.text}</p>
                  </article>
                ))}
              </div>

              <div className="max-w-5xl mx-auto mt-10 bg-foreground text-background border-2 border-foreground rounded-2xl p-6 sm:p-8 sticker-shadow-primary">
                <p className="font-display font-black text-[10px] uppercase tracking-widest text-primary mb-4">Consolidado del proyecto</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { v: "212", l: "Publicaciones" },
                    { v: "2.6M", l: "Vistas" },
                    { v: "137K", l: "Interacciones" },
                    { v: "6.6%", l: "Engagement" },
                  ].map((s) => (
                    <div key={s.l} className="text-center">
                      <div className="font-display font-black text-3xl md:text-4xl tracking-[-0.04em] text-primary leading-none mb-2">{s.v}</div>
                      <div className="font-display font-black text-[10px] uppercase tracking-widest text-background/70">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Pico Bolívar — Récord Mundial */}
          <section id="pico-bolivar" className="scroll-mt-24 py-16 sm:py-24 bg-foreground text-background border-b-4 border-foreground" aria-labelledby="bolivar-heading">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground border-2 border-background rounded-full mb-6 rotate-[-2deg]">
                    <Trophy className="w-4 h-4" />
                    <span className="font-display font-black text-xs uppercase tracking-widest">Noviembre 2026 · Gran Final</span>
                  </div>
                  <h2 id="bolivar-heading" className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-[-0.04em] leading-[0.9]">
                    Pico <span className="italic text-primary">Bolívar</span>
                  </h2>
                  <p className="font-display font-black text-xs uppercase tracking-widest text-primary mt-4">
                    4.978 m · La cumbre más alta de Venezuela
                  </p>
                  <p className="font-body text-background/80 max-w-3xl mx-auto mt-5 leading-relaxed">
                    El cierre de la trilogía y el intento más ambicioso: grabar el{" "}
                    <strong className="text-primary">podcast completo más alto del mundo</strong>, un episodio íntegro
                    producido en la cima del Pico Bolívar, buscando el reconocimiento como récord mundial.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                  {[
                    { v: "4.978 m", l: "Altitud objetivo" },
                    { v: "Nov 2026", l: "Fecha de expedición" },
                    { v: "60 min+", l: "Podcast íntegro en cima" },
                    { v: "Mérida", l: "Base de operaciones" },
                  ].map((s) => (
                    <div key={s.l} className="bg-background/5 border-2 border-background/30 rounded-2xl p-5 text-center">
                      <div className="font-display font-black text-2xl md:text-3xl tracking-[-0.03em] text-primary leading-none mb-2">{s.v}</div>
                      <div className="font-display font-black text-[10px] uppercase tracking-widest text-background/70">{s.l}</div>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-background/5 border-2 border-background/30 rounded-2xl p-6 sm:p-8">
                    <h3 className="font-display font-black text-xl sm:text-2xl tracking-[-0.02em] mb-4">El reto</h3>
                    <ul className="space-y-3 text-background/85 font-body text-sm leading-relaxed">
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Aclimatación por etapas en la Sierra Nevada de Mérida.</li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Equipo de audio y cámara resistente a frío extremo y viento.</li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Energía autónoma para grabar más de 60 minutos continuos.</li>
                      <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Registro certificable: testigos, GPS, timecode y material bruto.</li>
                    </ul>
                  </div>
                  <div className="bg-primary text-primary-foreground border-2 border-background rounded-2xl p-6 sm:p-8 sticker-shadow-accent">
                    <h3 className="font-display font-black text-xl sm:text-2xl tracking-[-0.02em] mb-4">La ruta de contenido</h3>
                    <ul className="space-y-3 font-body text-sm leading-relaxed">
                      <li className="flex gap-2"><CalendarDays className="w-4 h-4 shrink-0 mt-0.5" /> Semana 1 · Mérida: comida, historias y personajes de la ciudad.</li>
                      <li className="flex gap-2"><CalendarDays className="w-4 h-4 shrink-0 mt-0.5" /> Semana 2 · Podcast en Mérida con invitados locales.</li>
                      <li className="flex gap-2"><CalendarDays className="w-4 h-4 shrink-0 mt-0.5" /> Semana 3 · Ascenso: ruta, campamento y aclimatación en vivo.</li>
                      <li className="flex gap-2"><CalendarDays className="w-4 h-4 shrink-0 mt-0.5" /> Semana 4 · Cumbre: podcast completo a 4.978 m y cierre.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Propuesta para marcas */}
          <section id="marcas-bolivar" className="scroll-mt-24 py-16 sm:py-24 bg-background border-b-4 border-foreground" aria-labelledby="marcas-heading">
            <div className="container mx-auto px-4">
              <StickerHeader
                badge="Para marcas"
                badgeIcon={Handshake}
                badgeVariant="primary"
                title="Sé parte de la"
                highlight="cumbre"
                description="Un mes completo de actividades alrededor de Podcast en la Cumbre · Pico Bolívar."
                align="center"
              />
              <div id="marcas-heading" className="sr-only">Propuesta para marcas</div>

              <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.4fr_1fr] gap-6 sm:gap-8">
                <div className="bg-background border-2 border-foreground rounded-2xl p-6 sm:p-8 sticker-shadow-primary">
                  <h3 className="font-display font-black text-xl sm:text-2xl tracking-[-0.02em] text-foreground mb-6">Qué incluye</h3>
                  <ul className="space-y-3">
                    {[
                      "2 podcasts con presencia de marca: uno grabado en Mérida y uno en la cima del Pico Bolívar.",
                      "Posts en Instagram, Facebook y TikTok sobre la ruta, la comida y las historias de Mérida.",
                      "Historias de Instagram dedicadas durante todo el mes de actividades.",
                      "Posts dedicados a la marca dentro del contenido de los podcasts.",
                      "2 reels dedicados exclusivamente a la marca.",
                      "Mención de marca en todos los posts relacionados a Podcast en la Cumbre · Pico Bolívar.",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 p-3 bg-muted/40 border-2 border-foreground rounded-xl">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="font-body text-sm text-foreground/85 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <aside className="bg-foreground text-background border-2 border-foreground rounded-2xl p-6 sm:p-8 sticker-shadow-accent sticker-tilt-r-sm sticker-card-rotate h-fit">
                  <p className="font-display font-black text-[10px] uppercase tracking-widest text-primary mb-3">Inversión</p>
                  <div className="font-display font-black text-5xl sm:text-6xl tracking-[-0.05em] leading-none mb-2">$3.500</div>
                  <p className="font-display font-black text-xs uppercase tracking-widest text-background/70 mb-6">USD · 1 mes de actividades</p>
                  <p className="font-body text-sm text-background/80 leading-relaxed mb-6">
                    Incluye producción, cobertura editorial y distribución en todas nuestras plataformas
                    durante el mes de la expedición al Pico Bolívar.
                  </p>
                  <a
                    href="mailto:samira.rivas@hacemosloquenosgusta.com?subject=Propuesta%20de%20marca%20-%20Podcast%20en%20la%20Cumbre%20Pico%20Bol%C3%ADvar"
                    className="inline-flex w-full items-center justify-center gap-2 px-5 py-4 bg-primary text-primary-foreground border-2 border-background rounded-xl font-display font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
                  >
                    Quiero sumarme
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </aside>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="py-16 sm:py-24 bg-background border-b-4 border-foreground" aria-labelledby="about-heading">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-foreground text-background border-2 border-foreground rounded-full mb-5">
                    <Mountain className="w-3.5 h-3.5" />
                    <span className="font-display font-black text-[10px] uppercase tracking-widest">El proyecto</span>
                  </div>
                  <h2 id="about-heading" className="font-display font-black tracking-[-0.04em] leading-[0.9] text-3xl sm:text-4xl md:text-5xl text-foreground mb-6">
                    ¿Qué es Podcast en la <span className="italic text-gradient">Cumbre</span>?
                  </h2>
                  <p className="text-foreground/70 font-body leading-relaxed mb-4">
                    Podcast en la Cumbre es una travesía audiovisual de siete meses para mostrar a Venezuela 
                    desde sus alturas —Naiguatá, Roraima y Pico Bolívar— en un viaje que mezcla aventura, 
                    humor y reflexión.
                  </p>
                  <p className="text-foreground/70 font-body leading-relaxed mb-4">
                    Liderado por <strong>JuanSofa</strong> y <strong>JhonSnacks</strong>, el proyecto documenta 
                    cada paso con streaming en vivo, podcast, reels, microdocumentales y fotografía editorial.
                  </p>
                  <p className="text-foreground/70 font-body leading-relaxed">
                    <strong className="text-foreground">Tres cumbres, tres historias, un mismo mensaje:</strong> 
                    {" "}Aquí hay país, aquí hay historias, aquí hay altura.
                  </p>
                </div>
                <aside className="bg-foreground text-background border-2 border-foreground rounded-2xl p-8 sticker-shadow-primary sticker-tilt-r-sm sticker-card-rotate">
                  <p className="font-display font-black text-[10px] uppercase tracking-widest text-primary mb-3">Propósito</p>
                  <h3 className="font-display font-black text-2xl sm:text-3xl tracking-[-0.02em] mb-5">
                    Contar que seguimos aquí. Y que seguimos subiendo.
                  </h3>
                  <p className="text-background/80 font-body leading-relaxed mb-4">
                    Este proyecto existe para recordarnos —a nosotros y al mundo— que Venezuela no se rinde, 
                    se reinventa. Que tenemos montañas, sí, pero también caminos.
                  </p>
                  <p className="font-display font-black text-lg italic text-primary">
                    La altura venezolana no se mide en metros, sino en alma.
                  </p>
                </aside>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-16 sm:py-24 bg-muted/30 border-b-4 border-foreground" aria-labelledby="team-heading">
            <div className="container mx-auto px-4">
              <div id="team-heading" className="sr-only">Equipo de Producción</div>
              <StickerHeader
                badge="Quiénes somos"
                badgeIcon={Users}
                badgeVariant="dark"
                title="Equipo de"
                highlight="producción"
                align="center"
              />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto" role="list">
                {[
                  {
                    name: "JuanSofa",
                    fullName: "Juan Carlos Martínez",
                    role: "Co Host",
                    description: "El que arranca las conversaciones profundas, mete reflexiones entre chistes."
                  },
                  {
                    name: "JhonSnacks",
                    fullName: "Jhon Da Silva",
                    role: "Co Host - Improvisador creativo nato",
                    description: "Improvisador nato, el que suelta la frase que rompe la tensión cuando el cansancio aprieta."
                  },
                  {
                    name: "Darwins",
                    role: "Sonido y video",
                    description: "Protege micrófonos como si fueran recién nacidos y corre para captar cada toma limpia."
                  },
                  {
                    name: "Daniel",
                    role: "Equipo audiovisual",
                    description: "Cámara en mano, ojo entrenado para encontrar encuadres que cuentan historias."
                  },
                  {
                    name: "Andreina",
                    role: "Dirección de producción",
                    description: "Tiene la visión completa del proyecto y orquesta cada pieza para que todo llegue a la cima."
                  },
                  {
                    name: "Samira",
                    role: "Logística",
                    description: "Coordina traslados, equipos y tiempos para que la expedición funcione sin contratiempos."
                  },
                  {
                    name: "Estrella",
                    role: "Pauta y equipos",
                    description: "Organiza la pauta de contenido y cuida que cada equipo esté listo para rodar en altura."
                  },
                ].map((member) => (
                  <article
                    key={member.name}
                    className="bg-background border-2 border-foreground rounded-2xl p-6 sticker-shadow-primary hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
                    role="listitem"
                    itemScope
                    itemType="https://schema.org/Person"
                  >
                    <h3 className="font-display font-black text-2xl tracking-[-0.02em] text-foreground mb-1" itemProp="name">{member.name}</h3>
                    {member.fullName && (
                      <p className="text-sm text-foreground/60 mb-3 font-body" itemProp="alternateName">{member.fullName}</p>
                    )}
                    <p className="font-display font-black text-[10px] uppercase tracking-widest text-primary mb-3" itemProp="jobTitle">{member.role}</p>
                    <p className="text-sm text-foreground/70 font-body leading-relaxed" itemProp="description">{member.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Nota de Prensa Section */}
          <section className="py-16 sm:py-24 bg-background" aria-labelledby="nota-prensa-heading">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div id="nota-prensa-heading" className="sr-only">Nota de Prensa</div>
                <StickerHeader
                  badge="Para medios"
                  badgeIcon={Newspaper}
                  badgeVariant="primary"
                  title="Nota de"
                  highlight="prensa"
                  description="Podcast en la Cumbre: una travesía venezolana hacia lo más alto del país."
                  align="center"
                />

                <div className="prose prose-lg max-w-none space-y-6">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    En tiempos donde el ruido abunda, solo las voces con verdadero propósito hacen cumbre. 
                    Así que vacílate esto: <strong className="text-foreground">JuanSofa y JhonSnacks</strong> junto 
                    a El Patio Content Studio apuestan, una vez más, por crear marca país ahora desde lo más 
                    alto con "Podcast en la Cumbre".
                  </p>

                  <p className="text-muted-foreground leading-relaxed">
                    Un viaje para demostrar que Venezuela tiene historias de altura que merecen contarse con 
                    orgullo, ya que reflejan lo que nos define como venezolanos: <strong className="text-primary">¡estamos 
                    a la altura de cada desafío!</strong>
                  </p>

                  <div className="bg-muted/30 border-2 border-foreground rounded-2xl p-8 my-8 sticker-shadow-primary">
                    <h3 className="font-display font-black text-2xl tracking-[-0.02em] text-foreground mb-4">Una narrativa de altura</h3>
                    <p className="text-muted-foreground mb-4">
                      El proyecto, que abarca las tres cumbres más altas y simbólicas de Venezuela — Naiguatá, 
                      Roraima y Pico Bolívar — estará protagonizado por gente de altura. Personas que inspiran, 
                      construyen y transforman nuestro camino hasta llegar a la cumbre, y no por la distancia, 
                      sino por su ADN de altitud Made in Venezuela.
                    </p>
                    <p className="text-muted-foreground">
                      Vamos en busca de voces que han hecho de la altura su forma de vida, porque entendemos 
                      que <strong className="text-foreground">estar a la altura no es llegar, es sostenerse</strong>. 
                      Este es un podcast que enaltece a todos los que creen que siempre se puede subir un poco más.
                    </p>
                  </div>

                  <h3 className="font-display font-black text-2xl sm:text-3xl tracking-[-0.02em] text-foreground mb-6">Tres cumbres que enaltecen nuestra historia</h3>
                  
                  <div className="grid md:grid-cols-3 gap-6 my-8">
                    <div className="bg-background border-2 border-foreground rounded-2xl p-6 sticker-shadow-primary sticker-tilt-l-sm sticker-card-rotate">
                      <h4 className="font-display font-black text-lg tracking-[-0.02em] text-foreground mb-2">Pico Naiguatá</h4>
                      <p className="text-sm text-foreground/70 font-body leading-relaxed">
                        Desde el techo de Caracas, el primer podcast será un homenaje a una ciudad con 
                        historias y gente de altura.
                      </p>
                    </div>
                    <div className="bg-background border-2 border-foreground rounded-2xl p-6 sticker-shadow-accent">
                      <h4 className="font-display font-black text-lg tracking-[-0.02em] text-foreground mb-2">Monte Roraima</h4>
                      <p className="text-sm text-foreground/70 font-body leading-relaxed">
                        Considerado uno de los paisajes más místicos del continente, será escenario de 
                        una transmisión sin precedentes: el primer podcast grabado y transmitido desde su punto más alto.
                      </p>
                    </div>
                    <div className="bg-background border-2 border-foreground rounded-2xl p-6 sticker-shadow-primary sticker-tilt-r-sm sticker-card-rotate">
                      <h4 className="font-display font-black text-lg tracking-[-0.02em] text-foreground mb-2">Pico Bolívar</h4>
                      <p className="text-sm text-foreground/70 font-body leading-relaxed">
                        El cierre del ciclo. La cumbre más alta del país donde culmina esta trilogía con 
                        una visión épica de los venezolanos de altura.
                      </p>
                    </div>
                  </div>

                  <div className="bg-foreground text-background border-2 border-foreground rounded-2xl p-8 my-8 sticker-shadow-accent">
                    <h3 className="font-display font-black text-2xl tracking-[-0.02em] mb-4">Mucho más que un podcast</h3>
                    <p className="text-background/80 mb-6">
                      Además de los episodios grabados en cada cumbre, Podcast en la Cumbre generará una 
                      experiencia audiovisual con marcas de altura:
                    </p>
                    <ul className="grid md:grid-cols-2 gap-3 text-background/90">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">✦</span>
                        Streaming en vivo durante los ascensos
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">✦</span>
                        Historias previas y contenido desde el campamento
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">✦</span>
                        Reels, shorts y microdocumentales
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">✦</span>
                        Fotografía de altura con calidad editorial
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">✦</span>
                        Encuentros con comunidades originarias
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">✦</span>
                        Anécdotas, reflexiones y humor con conciencia
                      </li>
                    </ul>
                  </div>

                  <blockquote className="my-8 bg-primary text-primary-foreground border-2 border-foreground rounded-2xl p-6 sm:p-8 font-display font-black text-xl sm:text-2xl tracking-[-0.02em] leading-tight italic sticker-shadow-accent sticker-tilt-l-sm sticker-card-rotate">
                    "En la cima no hay likes ni etiquetas. Solo hay aire y en ella reconocemos lo lejos 
                    que hemos llegado, siempre con la frente en alto."
                  </blockquote>
                </div>

                {/* Contact Info */}
                <div className="mt-12 text-center bg-foreground text-background border-2 border-foreground rounded-2xl p-8 sticker-shadow-primary">
                  <p className="font-display font-black text-[10px] uppercase tracking-widest text-primary mb-2">Contacto</p>
                  <h3 className="font-display font-black text-2xl sm:text-3xl tracking-[-0.02em] mb-6">Para solicitudes de prensa</h3>
                  <div className="flex flex-col items-center justify-center gap-4">
                    <a 
                      href="mailto:samira.rivas@hacemosloquenosgusta.com" 
                      className="flex items-center gap-2 text-background hover:text-primary transition-colors font-body"
                    >
                      <span className="text-xl">📩</span>
                      samira.rivas@hacemosloquenosgusta.com
                    </a>
                    <a 
                      href="mailto:andreina.ascension@hacemosloquenosgusta.com" 
                      className="flex items-center gap-2 text-background hover:text-primary transition-colors font-body"
                    >
                      <span className="text-xl">📩</span>
                      andreina.ascension@hacemosloquenosgusta.com
                    </a>
                    <a 
                      href="mailto:estrella.rodriguez@hacemosloquenosgusta.com" 
                      className="flex items-center gap-2 text-background hover:text-primary transition-colors font-body"
                    >
                      <span className="text-xl">📩</span>
                      estrella.rodriguez@hacemosloquenosgusta.com
                    </a>
                  </div>
                  <div className="mt-8">
                    <button
                      onClick={handleDownloadPressReleases}
                      className="inline-flex items-center gap-2 px-7 py-4 bg-primary text-primary-foreground border-2 border-background font-display font-black text-xs uppercase tracking-widest hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform shadow-[6px_6px_0_hsl(var(--background))] rotate-[-1deg]"
                    >
                      Descargar Notas de Prensa
                    </button>
                  </div>
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

export default PodcastEnLaCumbre;
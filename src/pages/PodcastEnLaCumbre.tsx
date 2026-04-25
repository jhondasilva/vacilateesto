import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickerHeader from "@/components/StickerHeader";
import StickerMarquee from "@/components/StickerMarquee";
import { Mountain, Users, MapPin, Newspaper, TrendingUp, Eye, Heart, Instagram, Youtube, Facebook, Quote, Sparkles } from "lucide-react";
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
        "productionCompany": {
          "@type": "Organization",
          "name": "El Patio Content Studio",
          "parentOrganization": {
            "@type": "Organization",
            "name": "La Web Figital Agency",
            "url": "https://www.lawebfigitalagency.com"
          }
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
        "containsSeason": {
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
              "duration": "PT1H30M",
              "datePublished": "2025-09",
              "url": "https://www.youtube.com/watch?v=NZWSKJvOdXg"
            },
            {
              "@type": "PodcastEpisode",
              "name": "Podcast en Roraima - 2.000 Millones de Años de Ancestralidad",
              "episodeNumber": 2,
              "description": "Expedición al Monte Roraima, el tepuy más emblemático de Venezuela a 2.810 metros. Un viaje al origen del tiempo geológico y la cultura Pemón.",
              "duration": "PT1H1M29S",
              "datePublished": "2025-11",
              "url": "https://www.youtube.com/watch?v=NdrcKpsD0UU"
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
        <title>Podcast en la Cumbre | El Mejor Podcast de Aventura de Venezuela 🇻🇪</title>
        <meta name="title" content="Podcast en la Cumbre | El Mejor Podcast de Aventura de Venezuela" />
        <meta name="description" content="Podcast en la Cumbre es la travesía audiovisual de Vacílate Esto grabando podcasts en las montañas más emblemáticas de Venezuela: Naiguatá (2.765m), Roraima (2.810m) y Pico Bolívar (4.978m). Aventura, humor y reflexión con JuanSofa y JhonSnacks." />
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
                  className="w-full max-w-2xl h-auto drop-shadow-[8px_8px_0_hsl(var(--foreground))]"
                  loading="eager"
                />
              </div>
              
              <p className="font-body text-foreground/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed" itemProp="description">
                Una travesía audiovisual de siete meses para mostrar a Venezuela desde sus alturas 
                —Naiguatá, Roraima y Pico Bolívar— en un viaje que mezcla{" "}
                <span className="italic font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">aventura, humor y reflexión.</span>
              </p>
            </div>
          </section>

          {/* Manifiesto Section */}
          <section className="py-16 bg-foreground text-background" aria-labelledby="manifiesto-heading">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Quote className="w-12 h-12 text-primary mx-auto mb-6" aria-hidden="true" />
                <h2 id="manifiesto-heading" className="text-3xl md:text-4xl font-bold mb-8">Manifiesto</h2>
                
                <div className="space-y-6 text-background/90 text-lg leading-relaxed">
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
                    <p className="text-xl font-bold text-primary mb-4">Una afirmación:</p>
                    <div className="flex flex-wrap justify-center gap-4 text-lg">
                      <span className="px-4 py-2 bg-background/10 rounded-full">🏔️ Aquí hay altura</span>
                      <span className="px-4 py-2 bg-background/10 rounded-full">📖 Aquí hay historias</span>
                      <span className="px-4 py-2 bg-background/10 rounded-full">🇻🇪 Aquí hay país</span>
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-6 bg-background/5 rounded-2xl border border-background/10">
                  <h3 className="text-xl font-bold text-primary mb-3">Mantra</h3>
                  <p className="text-2xl font-bold italic">
                    "Desde arriba, todo tiene sentido."
                  </p>
                  <p className="text-background/70 mt-4">
                    Desde arriba entendemos por qué seguimos. Desde arriba vemos lo que nos une. 
                    Desde arriba, recordamos que Venezuela no se rinde: respira hondo, y sigue.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Resultados Section */}
          <section className="py-16 bg-primary/5" aria-labelledby="resultados-heading">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" aria-hidden="true" />
                <h2 id="resultados-heading" className="text-3xl font-bold text-foreground mb-4">
                  Resultados del Proyecto
                </h2>
                <p className="text-muted-foreground">Agosto - Noviembre 2025 | Orgánico + Pago</p>
              </div>

              {/* Global Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
                <div className="bg-background rounded-2xl p-6 shadow-card text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">212</div>
                  <div className="text-sm text-muted-foreground">Publicaciones</div>
                </div>
                <div className="bg-background rounded-2xl p-6 shadow-card text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">2.6M</div>
                  <div className="text-sm text-muted-foreground">Vistas Totales</div>
                </div>
                <div className="bg-background rounded-2xl p-6 shadow-card text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">137K</div>
                  <div className="text-sm text-muted-foreground">Interacciones</div>
                </div>
                <div className="bg-background rounded-2xl p-6 shadow-card text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">6.6%</div>
                  <div className="text-sm text-muted-foreground">Tasa de Engagement</div>
                </div>
              </div>

              {/* Platform Stats */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {platformStats.map((stat) => (
                  <div key={stat.platform} className="bg-background rounded-2xl p-6 shadow-card">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <stat.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-bold text-foreground">{stat.platform}</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Posts</span>
                        <span className="font-semibold text-foreground">{stat.posts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Vistas
                        </span>
                        <span className="font-semibold text-foreground">{stat.views}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Heart className="w-3 h-3" /> Interacciones
                        </span>
                        <span className="font-semibold text-foreground">{stat.interactions}</span>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Engagement</span>
                          <span className="font-bold text-primary">{stat.rate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Community Stats */}
              <div className="mt-12 max-w-2xl mx-auto">
                <div className="bg-background rounded-2xl p-8 shadow-card text-center">
                  <Users className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-6">Comunidad Total</h3>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-4xl font-bold text-foreground mb-2">277.9K</div>
                      <div className="text-sm text-muted-foreground">Seguidores Totales</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-primary mb-2">+9.1K</div>
                      <div className="text-sm text-muted-foreground">Nuevos Seguidores</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Episodios Section */}
          <section className="py-16 bg-muted/30" aria-labelledby="episodios-heading">
            <div className="container mx-auto px-4">
              <h2 id="episodios-heading" className="text-3xl font-bold text-foreground text-center mb-12" itemProp="name">
                Episodios de Podcast en la Cumbre
              </h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <article className="space-y-4">
                  <div className="aspect-video rounded-2xl overflow-hidden shadow-elevated">
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
                  <h3 className="text-xl font-bold text-foreground">Episodio 1: Pico Naiguatá</h3>
                  <p className="text-muted-foreground text-sm">
                    El techo de Caracas a 2.765 metros. Una expedición de 20 personas subiendo con 
                    micrófonos, cámaras y el humor que no se enfría ni con neblina.
                  </p>
                </article>
                <article className="space-y-4">
                  <div className="aspect-video rounded-2xl overflow-hidden shadow-elevated">
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
                  <h3 className="text-xl font-bold text-foreground">Episodio 2: Monte Roraima</h3>
                  <p className="text-muted-foreground text-sm">
                    2.000 millones de años de ancestralidad. El tepuy más emblemático de Venezuela 
                    a 2.810 metros donde el tiempo parece detenerse.
                  </p>
                </article>
              </div>
            </div>
          </section>

          {/* Naiguata Deep Dive */}
          <article className="py-16 bg-background" aria-labelledby="naiguata-heading">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 id="naiguata-heading" className="text-3xl font-bold text-foreground">
                      Pico Naiguatá
                    </h2>
                    <p className="text-primary font-semibold">2.765 metros | El Techo de Caracas</p>
                  </div>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground mb-4">
                    Grabar un podcast en el Naiguatá... subir y ganárselo. Nos fuimos 20 personas —equipo central, 
                    guías, porteadores, producción— con mochilas llenas de micrófonos, cámaras, comida, capas 
                    térmicas y ese humor que no se enfría ni con neblina.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Subimos por La Julia, cruzamos miradores, peñones y subidas que parecían castigos de gimnasio. 
                    Llegamos a la cima de Caracas a <strong className="text-foreground">2.765 metros sobre el nivel del mar</strong>, 
                    donde la ciudad se ve como un mapa y el mar asoma tímido detrás de la cordillera.
                  </p>
                </div>

                <blockquote className="border-l-4 border-primary pl-6 my-8 italic text-foreground text-xl bg-primary/5 py-4 pr-4 rounded-r-lg">
                  "Aquí estamos… más cerca del cielo y de quiénes somos como venezolanos."
                </blockquote>

                <p className="text-muted-foreground">
                  Ese día entendimos que subir una montaña es fácil… lo difícil es bajarse después de ver todo desde arriba.
                </p>
              </div>
            </div>
          </article>

          {/* Roraima Deep Dive */}
          <article className="py-16 bg-muted/30" aria-labelledby="roraima-heading">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mountain className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 id="roraima-heading" className="text-3xl font-bold text-foreground">
                      Monte Roraima
                    </h2>
                    <p className="text-primary font-semibold">2.810 metros | 2.000 Millones de Años de Ancestralidad</p>
                  </div>
                </div>

                <div className="bg-background rounded-2xl p-6 mb-8 shadow-card">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    La Escala del Tiempo
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <div className="font-semibold text-foreground">Macizo Guayanés</div>
                        <div className="text-sm text-muted-foreground">1.700 - 2.000 millones de años</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-3 h-3 rounded-full bg-primary/70"></div>
                      <div>
                        <div className="font-semibold text-foreground">Vida Multicelular</div>
                        <div className="text-sm text-muted-foreground">600 millones de años</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-3 h-3 rounded-full bg-primary/50"></div>
                      <div>
                        <div className="font-semibold text-foreground">Los Dinosaurios</div>
                        <div className="text-sm text-muted-foreground">240 - 66 millones de años</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-3 h-3 rounded-full bg-primary/30"></div>
                      <div>
                        <div className="font-semibold text-foreground">Historia de Venezuela</div>
                        <div className="text-sm text-muted-foreground">Apenas 200 años</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground mb-4">
                    El tepuy más emblemático de Venezuela representa un reto único: una meseta ancestral 
                    donde el tiempo parece detenerse. La expedición hacia la cima es una travesía de varios 
                    días atravesando la Gran Sabana, cruzando ríos y ascendiendo por la famosa rampa natural.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Al abordar temas de geología, biología y cultura Pemón, el podcast se aleja del humor 
                    ligero para tocar fibras educativas. El Roraima nos recordó que frente a la eternidad 
                    de la piedra, los problemas actuales son un parpadeo.
                  </p>
                </div>

                <blockquote className="border-l-4 border-primary pl-6 my-8 italic text-foreground text-xl bg-primary/5 py-4 pr-4 rounded-r-lg">
                  "El mundo diciéndole a los seres humanos: ustedes son los que están de paso."
                </blockquote>

                <p className="text-muted-foreground">
                  En la cima, entre formaciones rocosas milenarias y paisajes de otro mundo, 
                  capturamos la esencia mística de este lugar sagrado para los Pemón. El territorio permanece, 
                  y por ende, la identidad que emana de él es indestructible.
                </p>
              </div>
            </div>
          </article>

          {/* About Section */}
          <section className="py-16 bg-background" aria-labelledby="about-heading">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                <div>
                  <h2 id="about-heading" className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <Mountain className="w-8 h-8 text-primary" aria-hidden="true" />
                    ¿Qué es Podcast En La Cumbre?
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Podcast en la Cumbre es una travesía audiovisual de siete meses para mostrar a Venezuela 
                    desde sus alturas —Naiguatá, Roraima y Pico Bolívar— en un viaje que mezcla aventura, 
                    humor y reflexión.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Liderado por <strong>JuanSofa</strong> y <strong>JhonSnacks</strong>, el proyecto documenta 
                    cada paso con streaming en vivo, podcast, reels, microdocumentales y fotografía editorial.
                  </p>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Tres cumbres, tres historias, un mismo mensaje:</strong> 
                    {" "}Aquí hay país, aquí hay historias, aquí hay altura.
                  </p>
                </div>
                <aside className="bg-muted/30 rounded-2xl p-8 border border-border">
                  <h3 className="text-xl font-bold text-foreground mb-4">Propósito</h3>
                  <p className="text-muted-foreground mb-4">
                    Contar que seguimos aquí. Y que seguimos subiendo.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Este proyecto existe para recordarnos —a nosotros y al mundo— que Venezuela no se rinde, 
                    se reinventa. Que tenemos montañas, sí, pero también caminos.
                  </p>
                  <p className="text-foreground font-semibold">
                    La altura venezolana no se mide en metros, sino en alma.
                  </p>
                </aside>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-16 bg-muted/30" aria-labelledby="team-heading">
            <div className="container mx-auto px-4">
              <h2 id="team-heading" className="text-3xl font-bold text-foreground text-center mb-12 flex items-center justify-center gap-3">
                <Users className="w-8 h-8 text-primary" aria-hidden="true" />
                Equipo de Producción
              </h2>
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
                    name: "Joel",
                    role: "Equipo audiovisual",
                    description: "Cámara en mano, responsable del documental."
                  },
                ].map((member) => (
                  <article
                    key={member.name}
                    className="bg-background rounded-xl p-6 border border-border hover:border-primary/50 transition-colors shadow-card"
                    role="listitem"
                    itemScope
                    itemType="https://schema.org/Person"
                  >
                    <h3 className="text-xl font-bold text-primary mb-1" itemProp="name">{member.name}</h3>
                    {member.fullName && (
                      <p className="text-sm text-muted-foreground mb-2" itemProp="alternateName">{member.fullName}</p>
                    )}
                    <p className="text-sm font-semibold text-foreground mb-2" itemProp="jobTitle">{member.role}</p>
                    <p className="text-sm text-muted-foreground" itemProp="description">{member.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Nota de Prensa Section */}
          <section className="py-16 bg-background" aria-labelledby="nota-prensa-heading">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <Newspaper className="w-12 h-12 text-primary mx-auto mb-4" aria-hidden="true" />
                  <h2 id="nota-prensa-heading" className="text-3xl font-bold text-foreground mb-4">
                    Nota de Prensa
                  </h2>
                  <p className="text-xl text-primary font-semibold">
                    Podcast en la Cumbre: una travesía venezolana hacia lo más alto del país
                  </p>
                </div>

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

                  <div className="bg-muted/30 rounded-2xl p-8 my-8">
                    <h3 className="text-xl font-bold text-foreground mb-4">Una narrativa de altura</h3>
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

                  <h3 className="text-xl font-bold text-foreground mb-6">Tres cumbres que enaltecen nuestra historia</h3>
                  
                  <div className="grid md:grid-cols-3 gap-6 my-8">
                    <div className="bg-primary/5 rounded-xl p-6 border-l-4 border-primary">
                      <h4 className="font-bold text-foreground mb-2">Pico Naiguatá</h4>
                      <p className="text-sm text-muted-foreground">
                        Desde el techo de Caracas, el primer podcast será un homenaje a una ciudad con 
                        historias y gente de altura.
                      </p>
                    </div>
                    <div className="bg-primary/5 rounded-xl p-6 border-l-4 border-primary">
                      <h4 className="font-bold text-foreground mb-2">Monte Roraima</h4>
                      <p className="text-sm text-muted-foreground">
                        Considerado uno de los paisajes más místicos del continente, será escenario de 
                        una transmisión sin precedentes: el primer podcast grabado y transmitido desde su punto más alto.
                      </p>
                    </div>
                    <div className="bg-primary/5 rounded-xl p-6 border-l-4 border-primary">
                      <h4 className="font-bold text-foreground mb-2">Pico Bolívar</h4>
                      <p className="text-sm text-muted-foreground">
                        El cierre del ciclo. La cumbre más alta del país donde culmina esta trilogía con 
                        una visión épica de los venezolanos de altura.
                      </p>
                    </div>
                  </div>

                  <div className="bg-foreground text-background rounded-2xl p-8 my-8">
                    <h3 className="text-xl font-bold mb-4">Mucho más que un podcast</h3>
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

                  <blockquote className="border-l-4 border-primary pl-6 my-8 italic text-foreground text-xl">
                    "En la cima no hay likes ni etiquetas. Solo hay aire y en ella reconocemos lo lejos 
                    que hemos llegado, siempre con la frente en alto."
                  </blockquote>
                </div>

                {/* Contact Info */}
                <div className="mt-12 text-center bg-primary/10 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-foreground mb-6">Para solicitudes de prensa</h3>
                  <div className="flex flex-col items-center justify-center gap-4">
                    <a 
                      href="mailto:samira.rivas@hacemosloquenosgusta.com" 
                      className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                    >
                      <span className="text-xl">📩</span>
                      samira.rivas@hacemosloquenosgusta.com
                    </a>
                    <a 
                      href="mailto:andreina.ascension@hacemosloquenosgusta.com" 
                      className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                    >
                      <span className="text-xl">📩</span>
                      andreina.ascension@hacemosloquenosgusta.com
                    </a>
                    <a 
                      href="mailto:estrella.rodriguez@hacemosloquenosgusta.com" 
                      className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                    >
                      <span className="text-xl">📩</span>
                      estrella.rodriguez@hacemosloquenosgusta.com
                    </a>
                  </div>
                  <div className="mt-8">
                    <button
                      onClick={handleDownloadPressReleases}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-colors"
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
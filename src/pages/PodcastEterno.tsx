import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickerHeader from "@/components/StickerHeader";
import StickerMarquee from "@/components/StickerMarquee";
import { Clock, Users, Trophy, Mic, Play, Calendar, Quote } from "lucide-react";

const PodcastEterno = () => {
  const episodes = [
    {
      id: "w03pnnz_IM4",
      title: "El Podcast Eterno - Parte 1",
      description: "El inicio de la hazaña: 40 horas de transmisión en vivo para romper el récord mundial del podcast más largo.",
    },
    {
      id: "nU4O-Ex5tqs",
      title: "El Podcast Eterno - Parte 2",
      description: "Continuamos la travesía con invitados de lujo y conversaciones épicas.",
    },
    {
      id: "QQ0PHDE-rYs",
      title: "El Podcast Eterno - Parte 3",
      description: "La madrugada más larga: reflexiones, humor y contenido que marcó historia.",
    },
    {
      id: "_zzvpXLJryE",
      title: "El Podcast Eterno - Parte 4",
      description: "El cierre épico: superamos las 40 horas y logramos el récord mundial.",
    },
  ];

  const stats = [
    { icon: Clock, value: "40", label: "Horas de transmisión", suffix: "hrs" },
    { icon: Users, value: "35", label: "Invitados especiales", suffix: "+" },
    { icon: Mic, value: "100", label: "Personas en el equipo", suffix: "+" },
    { icon: Trophy, value: "1", label: "Récord mundial", suffix: "º" },
  ];


  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "PodcastSeries",
        "@id": "https://www.vacilateesto.com/podcast-eterno#podcast",
        "name": "El Podcast Eterno",
        "alternateName": ["Podcast Eterno", "El Podcast Más Largo del Mundo", "40 Horas de Podcast", "Récord Mundial Podcast Venezuela"],
        "description": "El Podcast Eterno es una hazaña histórica de 40 horas de transmisión en vivo que rompió el récord mundial del podcast más largo del mundo el 30 de julio de 2022, superando las 36 horas del británico Mike Russel. Conducido por los creadores digitales venezolanos Juan Carlos Martínez (JuanSofa) y Jhon Da Silva (JhonSnacks) de Vacílate Esto, con 35 invitados y un equipo de más de 100 personas.",
        "url": "https://www.vacilateesto.com/podcast-eterno",
        "image": "https://img.youtube.com/vi/w03pnnz_IM4/maxresdefault.jpg",
        "inLanguage": "es-VE",
        "genre": ["Entretenimiento", "Tecnología", "Cultura Pop", "Récords Mundiales", "Streaming", "Podcast Venezolano"],
        "keywords": "podcast eterno, récord mundial podcast, podcast más largo del mundo, 40 horas streaming, Juan Carlos Martínez, Jhon Da Silva, Vacílate Esto, podcast venezuela, récord guinness, streaming venezuela",
        "author": [
          {
            "@type": "Person",
            "name": "Juan Carlos Martínez",
            "alternateName": "JuanSofa",
            "url": "https://www.instagram.com/juansofa/",
            "jobTitle": "Co-Host y Creador de Contenido",
            "nationality": { "@type": "Country", "name": "Venezuela" }
          },
          {
            "@type": "Person",
            "name": "Jhon Da Silva",
            "alternateName": "JhonSnacks",
            "url": "https://www.instagram.com/jhonsnacks/",
            "jobTitle": "Co-Host y Creador de Contenido",
            "nationality": { "@type": "Country", "name": "Venezuela" }
          }
        ],
        "publisher": {
          "@type": "Organization",
          "name": "Vacílate Esto",
          "url": "https://www.vacilateesto.com",
          "logo": "https://www.vacilateesto.com/og-image.png"
        },
        "producer": {
          "@type": "Organization",
          "name": "El Patio Content Studio",
          "parentOrganization": {
            "@type": "Organization",
            "name": "La Web Figital Agency",
            "url": "https://www.lawebfigitalagency.com"
          }
        },
        "datePublished": "2022-07-28",
        "dateCreated": "2022-07-28",
        "duration": "PT40H",
        "award": "Récord Mundial - Podcast más largo del mundo (40 horas continuas)",
        "recordedAt": {
          "@type": "Place",
          "name": "Caracas, Venezuela",
          "address": { "@type": "PostalAddress", "addressCountry": "VE", "addressLocality": "Caracas" }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5",
          "ratingCount": "1000",
          "bestRating": "5"
        },
        "interactionStatistic": [
          { "@type": "InteractionCounter", "interactionType": "https://schema.org/WatchAction", "userInteractionCount": "500000" },
          { "@type": "InteractionCounter", "interactionType": "https://schema.org/LikeAction", "userInteractionCount": "25000" }
        ]
      },
      {
        "@type": "Event",
        "@id": "https://www.vacilateesto.com/podcast-eterno#event",
        "name": "El Podcast Eterno - Récord Mundial",
        "description": "Transmisión en vivo de 40 horas continuas para romper el récord mundial del podcast más largo del mundo",
        "startDate": "2022-07-28T08:00:00-04:00",
        "endDate": "2022-07-30T00:01:00-04:00",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
        "location": {
          "@type": "VirtualLocation",
          "url": "https://www.youtube.com/watch?v=w03pnnz_IM4"
        },
        "organizer": {
          "@type": "Organization",
          "name": "Vacílate Esto",
          "url": "https://www.vacilateesto.com"
        },
        "performer": [
          { "@type": "Person", "name": "Juan Carlos Martínez" },
          { "@type": "Person", "name": "Jhon Da Silva" }
        ],
        "recordedIn": {
          "@type": "CreativeWork",
          "name": "El Podcast Eterno - Grabación Completa"
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://www.vacilateesto.com/podcast-eterno",
        "url": "https://www.vacilateesto.com/podcast-eterno",
        "name": "El Podcast Eterno | Récord Mundial del Podcast Más Largo del Mundo",
        "description": "Revive la hazaña de 40 horas de transmisión en vivo que rompieron el récord mundial del podcast más largo del mundo, conducido por Juan Carlos Martínez y Jhon Da Silva.",
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
            { "@type": "ListItem", "position": 2, "name": "El Podcast Eterno", "item": "https://www.vacilateesto.com/podcast-eterno" }
          ]
        },
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["h1", "h2", "blockquote"]
        }
      },
      {
        "@type": "VideoObject",
        "name": "El Podcast Eterno - Parte 1: El Inicio de la Hazaña",
        "description": "Primera parte de la transmisión del podcast más largo del mundo. 40 horas de streaming en vivo para romper el récord mundial.",
        "thumbnailUrl": "https://img.youtube.com/vi/w03pnnz_IM4/maxresdefault.jpg",
        "uploadDate": "2022-07-28",
        "duration": "PT10H",
        "contentUrl": "https://www.youtube.com/watch?v=w03pnnz_IM4",
        "embedUrl": "https://www.youtube.com/embed/w03pnnz_IM4",
        "interactionStatistic": { "@type": "InteractionCounter", "interactionType": "https://schema.org/WatchAction", "userInteractionCount": "150000" }
      },
      {
        "@type": "VideoObject",
        "name": "El Podcast Eterno - Parte 2: Invitados de Lujo",
        "description": "Segunda parte con invitados especiales incluyendo Danny Ocean, Luis Carlos Díaz y más.",
        "thumbnailUrl": "https://img.youtube.com/vi/nU4O-Ex5tqs/maxresdefault.jpg",
        "uploadDate": "2022-07-28",
        "duration": "PT10H",
        "contentUrl": "https://www.youtube.com/watch?v=nU4O-Ex5tqs",
        "embedUrl": "https://www.youtube.com/embed/nU4O-Ex5tqs",
        "interactionStatistic": { "@type": "InteractionCounter", "interactionType": "https://schema.org/WatchAction", "userInteractionCount": "120000" }
      },
      {
        "@type": "VideoObject",
        "name": "El Podcast Eterno - Parte 3: La Madrugada Más Larga",
        "description": "Tercera parte: reflexiones, humor y contenido que marcó historia durante la madrugada.",
        "thumbnailUrl": "https://img.youtube.com/vi/QQ0PHDE-rYs/maxresdefault.jpg",
        "uploadDate": "2022-07-29",
        "duration": "PT10H",
        "contentUrl": "https://www.youtube.com/watch?v=QQ0PHDE-rYs",
        "embedUrl": "https://www.youtube.com/embed/QQ0PHDE-rYs",
        "interactionStatistic": { "@type": "InteractionCounter", "interactionType": "https://schema.org/WatchAction", "userInteractionCount": "100000" }
      },
      {
        "@type": "VideoObject",
        "name": "El Podcast Eterno - Parte 4: El Cierre Épico",
        "description": "Cuarta y última parte: superamos las 40 horas y logramos el récord mundial del podcast más largo del mundo.",
        "thumbnailUrl": "https://img.youtube.com/vi/_zzvpXLJryE/maxresdefault.jpg",
        "uploadDate": "2022-07-30",
        "duration": "PT10H",
        "contentUrl": "https://www.youtube.com/watch?v=_zzvpXLJryE",
        "embedUrl": "https://www.youtube.com/embed/_zzvpXLJryE",
        "interactionStatistic": { "@type": "InteractionCounter", "interactionType": "https://schema.org/WatchAction", "userInteractionCount": "130000" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Qué es El Podcast Eterno?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "El Podcast Eterno fue una transmisión en vivo de 40 horas continuas realizada el 28-30 de julio de 2022, que rompió el récord mundial del podcast más largo del mundo, superando las 36 horas del británico Mike Russel. Fue conducido por Juan Carlos Martínez y Jhon Da Silva de Vacílate Esto."
            }
          },
          {
            "@type": "Question",
            "name": "¿Quiénes condujeron El Podcast Eterno?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "El Podcast Eterno fue conducido por los creadores digitales venezolanos Juan Carlos Martínez (JuanSofa) y Jhon Da Silva (JhonSnacks), fundadores de Vacílate Esto y co-fundadores de La Web Figital Agency y El Patio Content Studio."
            }
          },
          {
            "@type": "Question",
            "name": "¿Por qué 40 horas de transmisión?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Se eligieron 40 horas de transmisión para conmemorar los 40 años de la creación del origen del Internet, abordando temáticas como tecnología, tendencias de consumo, redes sociales, cultura pop, música y datos curiosos."
            }
          },
          {
            "@type": "Question",
            "name": "¿Cuántos invitados participaron en El Podcast Eterno?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Participaron 35 invitados especiales de Venezuela, Colombia, México y España, incluyendo Danny Ocean (cantante), Luis Carlos Díaz (periodista de tecnología), Leonardo Padrón (escritor) y Edcar Caro (creador español). El equipo de producción superó las 100 personas."
            }
          },
          {
            "@type": "Question",
            "name": "¿Dónde puedo ver El Podcast Eterno completo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Las 40 horas de El Podcast Eterno están disponibles en YouTube divididas en 4 partes en el canal de Vacílate Esto. También puedes ver los episodios en la página oficial www.vacilateesto.com/podcast-eterno."
            }
          },
          {
            "@type": "Question",
            "name": "¿El Podcast Eterno tiene certificación Guinness?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "El Podcast Eterno superó el récord existente del británico Mike Russel de 36 horas. La transmisión completa de 40 horas quedó grabada como evidencia para la certificación formal del Récord Guinness."
            }
          }
        ]
      },
      {
        "@type": "Article",
        "headline": "El Podcast Eterno: Dos venezolanos lograron la hazaña de hacer el podcast más largo del mundo",
        "description": "40 horas de transmisión en vivo que rompieron el récord mundial del podcast más largo del mundo",
        "image": "https://img.youtube.com/vi/w03pnnz_IM4/maxresdefault.jpg",
        "datePublished": "2022-07-30",
        "dateModified": "2022-07-30",
        "author": [
          { "@type": "Person", "name": "Juan Carlos Martínez" },
          { "@type": "Person", "name": "Jhon Da Silva" }
        ],
        "publisher": {
          "@type": "Organization",
          "name": "Vacílate Esto",
          "logo": { "@type": "ImageObject", "url": "https://www.vacilateesto.com/og-image.png" }
        },
        "mainEntityOfPage": "https://www.vacilateesto.com/podcast-eterno"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>El Podcast Eterno | Récord Mundial del Podcast Más Largo del Mundo 🏆</title>
        <meta name="title" content="El Podcast Eterno | Récord Mundial del Podcast Más Largo del Mundo" />
        <meta name="description" content="El Podcast Eterno: 40 horas de transmisión en vivo que rompieron el récord mundial del podcast más largo del mundo el 30 de julio de 2022. Conducido por Juan Carlos Martínez (JuanSofa) y Jhon Da Silva (JhonSnacks) de Vacílate Esto, con 35 invitados y más de 100 personas en el equipo." />
        <meta name="keywords" content="podcast eterno, podcast más largo del mundo, récord mundial podcast, 40 horas podcast, Juan Carlos Martínez, JuanSofa, Jhon Da Silva, JhonSnacks, Vacílate Esto, récord guinness podcast, venezuela podcast, streaming venezuela, podcast latinoamerica, Danny Ocean, Luis Carlos Díaz, Leonardo Padrón, El Patio Content Studio, La Web Figital Agency" />
        <meta name="author" content="Vacílate Esto - Juan Carlos Martínez y Jhon Da Silva" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="language" content="Spanish" />
        <meta name="geo.region" content="VE" />
        <meta name="geo.country" content="Venezuela" />
        <meta name="geo.placename" content="Caracas, Venezuela" />
        <link rel="canonical" href="https://www.vacilateesto.com/podcast-eterno" />
        
        {/* Open Graph */}
        <meta property="og:type" content="video.other" />
        <meta property="og:site_name" content="Vacílate Esto" />
        <meta property="og:title" content="El Podcast Eterno | 40 Horas de Récord Mundial 🏆" />
        <meta property="og:description" content="Dos venezolanos lograron la hazaña de hacer el podcast más largo del mundo: 40 horas de transmisión continua con 35 invitados y más de 100 personas en el equipo." />
        <meta property="og:url" content="https://www.vacilateesto.com/podcast-eterno" />
        <meta property="og:image" content="https://img.youtube.com/vi/w03pnnz_IM4/maxresdefault.jpg" />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="720" />
        <meta property="og:image:alt" content="El Podcast Eterno - Récord Mundial del Podcast Más Largo del Mundo" />
        <meta property="og:locale" content="es_VE" />
        <meta property="og:locale:alternate" content="es_ES" />
        <meta property="og:video" content="https://www.youtube.com/watch?v=w03pnnz_IM4" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vacilateesto" />
        <meta name="twitter:creator" content="@vacilateesto" />
        <meta name="twitter:title" content="El Podcast Eterno | 40 Horas de Récord Mundial 🏆" />
        <meta name="twitter:description" content="Dos venezolanos lograron la hazaña de hacer el podcast más largo del mundo: 40 horas de transmisión continua." />
        <meta property="twitter:image" content="https://img.youtube.com/vi/w03pnnz_IM4/maxresdefault.jpg" />
        <meta name="twitter:player" content="https://www.youtube.com/embed/w03pnnz_IM4" />
        <meta name="twitter:player:width" content="1280" />
        <meta name="twitter:player:height" content="720" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Hero Section — Sticker Pack Y2K */}
          <section className="relative pt-28 pb-20 bg-foreground text-background overflow-hidden border-b-4 border-foreground">
            {/* Decorative stickers */}
            <div aria-hidden className="absolute top-24 left-8 hidden md:block rotate-[-12deg] bg-primary text-primary-foreground border-2 border-background px-3 py-1 font-display font-black text-xs uppercase tracking-widest shadow-[6px_6px_0_hsl(var(--background))]">
              ★ 40 horas
            </div>
            <div aria-hidden className="absolute top-32 right-10 hidden md:block rotate-[8deg] bg-accent text-accent-foreground border-2 border-background px-3 py-1 font-display font-black text-xs uppercase tracking-widest shadow-[6px_6px_0_hsl(var(--background))]">
              ▲ Récord Mundial 2022-2025
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-5xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground border-2 border-background rounded-full mb-6 shadow-[4px_4px_0_hsl(var(--background))] rotate-[-2deg]">
                  <Trophy className="w-4 h-4" />
                  <span className="font-display font-black text-xs uppercase tracking-widest">Récord Mundial · 2022 — Jun 2025</span>
                </div>
                
                <h1 className="font-display font-black tracking-[-0.05em] leading-[0.85] text-[18vw] sm:text-[12vw] md:text-[10rem] lg:text-[12rem] mb-8">
                  El Podcast{" "}
                  <span className="italic bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Eterno</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-background/80 mb-8 max-w-2xl mx-auto">
                  40 horas de transmisión en vivo que rompieron el récord mundial del podcast más largo del mundo en 2022.
                </p>

                {/* Récord destronado por Juancito en Miami — Junio 2025 */}
                <div className="max-w-2xl mx-auto mb-6 bg-background/10 border-2 border-background/40 rounded-2xl p-5 sm:p-6 backdrop-blur-sm rotate-[-1deg] shadow-[6px_6px_0_hsl(var(--primary))]">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="inline-block bg-accent text-accent-foreground border-2 border-background px-2.5 py-0.5 rounded-full font-display font-black text-[10px] uppercase tracking-widest">
                      Actualización · Junio 2025
                    </span>
                  </div>
                  <p className="text-base sm:text-lg text-background/90 leading-relaxed">
                    Fuimos récord mundial hasta que el comediante venezolano{" "}
                    <a
                      href="https://www.instagram.com/byjuancito/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-primary underline-offset-4 hover:underline"
                    >
                      Juancito (@byjuancito)
                    </a>{" "}
                    nos lo tumbó desde Miami con{" "}
                    <strong className="text-background">43 horas continuas</strong>{" "}
                    de transmisión desde <em>La Industria Bakery &amp; Café</em>, con más de{" "}
                    <strong className="text-background">50 invitados</strong> y aprobación para Récord Guinness.{" "}
                    <span className="italic text-background/70">¡Salud, hermano! 🇻🇪🏆</span>
                  </p>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-background/60">
                  <Calendar className="w-5 h-5" />
                  <span>28-30 de Julio, 2022</span>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <StickerMarquee items={["★ 40 horas continuas", "▲ 35 invitados", "● 100+ producción", "✦ Récord mundial"]} variant="primary" />
          <section className="py-16 sm:py-20 bg-background border-b-4 border-foreground">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6 max-w-5xl mx-auto">
                {stats.map((stat, index) => {
                  const tilts = ["sticker-tilt-l-sm", "sticker-tilt-r-sm", "sticker-tilt-r-sm", "sticker-tilt-l-sm"];
                  const accents = [
                    "sticker-shadow-primary",
                    "sticker-shadow-accent",
                    "sticker-shadow-primary",
                    "sticker-shadow-accent",
                  ];
                  return (
                    <div
                      key={index}
                      className={`relative bg-background border-2 border-foreground rounded-2xl p-5 sm:p-7 text-center sticker-card-rotate ${tilts[index]} ${accents[index]}`}
                    >
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-foreground text-background border-2 border-foreground mb-3">
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div className="font-display font-black text-4xl md:text-5xl tracking-[-0.04em] text-foreground leading-none">
                        {stat.value}
                        <span className="text-primary">{stat.suffix}</span>
                      </div>
                      <p className="font-display font-black text-[10px] uppercase tracking-widest text-foreground/70 mt-3">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section className="py-16 sm:py-24 bg-muted/30 border-b-4 border-foreground">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <StickerHeader
                  badge="La Historia"
                  badgeIcon={Clock}
                  badgeVariant="dark"
                  title="La"
                  highlight="hazaña"
                  align="center"
                />
                <div className="bg-background border-2 border-foreground rounded-2xl p-6 sm:p-10 sticker-shadow-primary space-y-5 text-foreground/80 text-base sm:text-lg leading-relaxed">
                  <p>
                    Los creadores digitales venezolanos <strong className="text-foreground">Juan Carlos Martínez</strong> y <strong className="text-foreground">Jhon Da Silva</strong> se propusieron transmitir en vivo el podcast más largo del mundo, y lo lograron pasadas las 12:01 am del 30 de julio de 2022.
                  </p>
                  
                  <p>
                    Con <strong className="text-primary">40 horas de streaming continuas</strong>, superaron el récord existente del británico Mike Russel (36 horas). Se eligieron 40 horas para conmemorar los 40 años de la creación del Internet.
                  </p>
                  
                  <p>
                    Participaron <strong className="text-foreground">35 invitados</strong> y un equipo de más de <strong className="text-foreground">100 personas</strong>, hablando sobre tecnología, tendencias de consumo, redes sociales, cultura pop, música y datos curiosos.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Quote Section */}
          <section className="py-16 sm:py-24 bg-primary border-b-4 border-foreground">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <div className="bg-background border-2 border-foreground rounded-3xl p-8 sm:p-12 sticker-shadow-accent text-center sticker-tilt-l-sm sticker-card-rotate">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-foreground text-background border-2 border-foreground mb-5 rotate-[-6deg]">
                    <Quote className="w-6 h-6" />
                  </div>
                  <blockquote className="font-display font-black tracking-[-0.03em] text-2xl sm:text-3xl md:text-4xl text-foreground leading-tight">
                  "Es como sentarse a hablar en una mesa entre panas venezolanos y que les ayudemos a descubrir cosas que luego refieren en una reunión con familiares o amigos. Al final lo que queremos es pasarla bien y reflexionar."
                </blockquote>
                  <cite className="not-italic block mt-6 font-display font-black text-xs uppercase tracking-widest text-foreground/60">— Jhon Da Silva</cite>
                </div>
              </div>
            </div>
          </section>


          {/* Episodes Section */}
          <section className="py-16 sm:py-24 bg-foreground text-background border-b-4 border-foreground">
            <div className="container mx-auto px-4">
              <StickerHeader
                badge="Episodios"
                badgeIcon={Play}
                badgeVariant="primary"
                title="Revive la"
                highlight="hazaña"
                align="center"
                onDark
              />
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {episodes.map((episode, index) => (
                  <article key={episode.id} className={`group sticker-card-rotate ${index % 2 === 0 ? "sticker-tilt-l-sm" : "sticker-tilt-r-sm"}`}>
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-background/10 border-2 border-background sticker-shadow-primary">
                      <iframe
                        src={`https://www.youtube.com/embed/${episode.id}`}
                        title={episode.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground border-2 border-background flex items-center justify-center flex-shrink-0 rotate-[-4deg]">
                        <Play className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-display font-black text-lg sm:text-xl tracking-[-0.02em] text-background group-hover:text-primary transition-colors">
                          {episode.title}
                        </h3>
                        <p className="text-background/70 text-sm mt-1 font-body leading-relaxed">
                          {episode.description}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Legacy Section */}
          <section className="py-16 sm:py-24 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <StickerHeader
                  badge="Para la historia"
                  badgeIcon={Trophy}
                  badgeVariant="accent"
                  title="El"
                  highlight="legado"
                  align="center"
                />
                <div className="bg-foreground text-background border-2 border-foreground rounded-2xl p-8 sm:p-12 sticker-shadow-primary text-center">
                  <p className="text-lg text-background/80 mb-8 font-body leading-relaxed">
                  El Podcast Eterno marcó un hito en la historia del podcasting venezolano y latinoamericano. 
                  Demostró que con pasión, constancia y trabajo en equipo, se pueden lograr hazañas que trascienden fronteras.
                </p>
                  <div className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground border-2 border-background rounded-full rotate-[-2deg]">
                    <Trophy className="w-5 h-5" />
                    <span className="font-display font-black text-xs uppercase tracking-widest">Récord Mundial del Podcast Más Largo</span>
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

export default PodcastEterno;

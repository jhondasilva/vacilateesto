import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Clock, Users, Trophy, Mic, Play, Star, Calendar, Quote } from "lucide-react";

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

  const highlights = [
    "Danny Ocean - Cantante venezolano",
    "Luis Carlos Díaz - Periodista de tecnología",
    "Leonardo Padrón - Escritor",
    "Edcar Caro - Creador español",
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "PodcastSeries",
        "@id": "https://www.vacilateesto.com/podcast-eterno#podcast",
        "name": "El Podcast Eterno",
        "alternateName": ["Podcast Eterno", "El Podcast Más Largo del Mundo"],
        "description": "El Podcast Eterno es una hazaña de 40 horas de transmisión en vivo que rompió el récord mundial del podcast más largo del mundo, superando las 36 horas del británico Mike Russel. Conducido por Juan Carlos Martínez y Jhon Da Silva de Vacílate Esto.",
        "url": "https://www.vacilateesto.com/podcast-eterno",
        "inLanguage": "es-VE",
        "genre": ["Entretenimiento", "Tecnología", "Cultura Pop", "Récords Mundiales"],
        "author": [
          { "@type": "Person", "name": "Juan Carlos Martínez", "alternateName": "JuanSofa" },
          { "@type": "Person", "name": "Jhon Da Silva", "alternateName": "JhonSnacks" }
        ],
        "publisher": {
          "@type": "Organization",
          "name": "Vacílate Esto",
          "url": "https://www.vacilateesto.com"
        },
        "datePublished": "2022-07-28",
        "duration": "PT40H",
        "award": "Récord Mundial - Podcast más largo del mundo"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Qué es El Podcast Eterno?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "El Podcast Eterno fue una transmisión en vivo de 40 horas continuas realizada el 28-30 de julio de 2022, que rompió el récord mundial del podcast más largo del mundo, superando las 36 horas del británico Mike Russel."
            }
          },
          {
            "@type": "Question",
            "name": "¿Quiénes condujeron El Podcast Eterno?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "El Podcast Eterno fue conducido por los creadores digitales venezolanos Juan Carlos Martínez (JuanSofa) y Jhon Da Silva (JhonSnacks), creadores de Vacílate Esto."
            }
          },
          {
            "@type": "Question",
            "name": "¿Por qué 40 horas?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Se eligieron 40 horas de transmisión para conmemorar los 40 años de la creación del origen del Internet, abordando temáticas como tecnología, tendencias de consumo, redes sociales, cultura pop y música."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>El Podcast Eterno | Récord Mundial del Podcast Más Largo del Mundo</title>
        <meta name="description" content="El Podcast Eterno: 40 horas de transmisión en vivo que rompieron el récord mundial del podcast más largo del mundo. Conducido por Juan Carlos Martínez y Jhon Da Silva de Vacílate Esto." />
        <meta name="keywords" content="podcast eterno, podcast más largo del mundo, récord mundial podcast, 40 horas podcast, Juan Carlos Martínez, Jhon Da Silva, Vacílate Esto, récord guinness podcast, venezuela podcast" />
        <meta name="author" content="Vacílate Esto" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.vacilateesto.com/podcast-eterno" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="El Podcast Eterno | Récord Mundial 40 Horas" />
        <meta property="og:description" content="La hazaña de 40 horas de transmisión en vivo que rompió el récord mundial del podcast más largo del mundo." />
        <meta property="og:url" content="https://www.vacilateesto.com/podcast-eterno" />
        <meta property="og:image" content="https://img.youtube.com/vi/w03pnnz_IM4/maxresdefault.jpg" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="El Podcast Eterno | 40 Horas de Récord Mundial" />
        <meta name="twitter:description" content="Dos venezolanos lograron la hazaña de hacer el podcast más largo del mundo: 40 horas de transmisión continua." />
        
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Hero Section */}
          <section className="relative pt-24 pb-16 bg-foreground text-background overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full mb-6">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Récord Mundial 2022</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                  El Podcast <span className="text-primary">Eterno</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-background/80 mb-8 max-w-2xl mx-auto">
                  40 horas de transmisión en vivo que rompieron el récord mundial del podcast más largo del mundo.
                </p>
                
                <div className="flex items-center justify-center gap-2 text-background/60">
                  <Calendar className="w-5 h-5" />
                  <span>28-30 de Julio, 2022</span>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-6 bg-muted/30 rounded-2xl border border-border">
                    <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <div className="text-3xl md:text-4xl font-bold text-foreground">
                      {stat.value}<span className="text-primary">{stat.suffix}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground">
                  La Hazaña
                </h2>
                
                <div className="space-y-6 text-foreground/80 text-lg leading-relaxed">
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
          <section className="py-16 bg-primary/5">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <Quote className="w-12 h-12 text-primary mx-auto mb-6" />
                <blockquote className="text-xl md:text-2xl text-foreground italic mb-6">
                  "Es como sentarse a hablar en una mesa entre panas venezolanos y que les ayudemos a descubrir cosas que luego refieren en una reunión con familiares o amigos. Al final lo que queremos es pasarla bien y reflexionar."
                </blockquote>
                <cite className="text-muted-foreground">— Jhon Da Silva</cite>
              </div>
            </div>
          </section>

          {/* Highlights Section */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground">
                  Invitados de Lujo
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {highlights.map((guest, index) => (
                    <div key={index} className="p-4 bg-muted/30 rounded-xl border border-border text-center">
                      <Star className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">{guest}</p>
                    </div>
                  ))}
                </div>
                
                <p className="text-center text-muted-foreground mt-6">
                  Y más de 30 invitados adicionales de Venezuela, Colombia, México y España.
                </p>
              </div>
            </div>
          </section>

          {/* Episodes Section */}
          <section className="py-16 bg-foreground text-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Revive la <span className="text-primary">Hazaña</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {episodes.map((episode, index) => (
                  <div key={episode.id} className="group">
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-background/10">
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
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Play className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-background group-hover:text-primary transition-colors">
                          {episode.title}
                        </h3>
                        <p className="text-background/70 text-sm mt-1">
                          {episode.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Legacy Section */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                  El Legado
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  El Podcast Eterno marcó un hito en la historia del podcasting venezolano y latinoamericano. 
                  Demostró que con pasión, constancia y trabajo en equipo, se pueden lograr hazañas que trascienden fronteras.
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">Récord Mundial del Podcast Más Largo</span>
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

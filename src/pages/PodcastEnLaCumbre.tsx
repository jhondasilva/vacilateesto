import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mountain, Users, MapPin, Newspaper } from "lucide-react";
import logoCumbre from "@/assets/logo-podcast-cumbre.avif";

const PodcastEnLaCumbre = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "PodcastSeries",
        "@id": "https://www.vacilateesto.com/podcast-en-la-cumbre#podcast",
        "name": "Podcast en la Cumbre",
        "description": "Travesía audiovisual de siete meses grabando podcasts en las cumbres más emblemáticas de Venezuela: Pico Naiguatá, Monte Roraima y Pico Bolívar.",
        "url": "https://www.vacilateesto.com/podcast-en-la-cumbre",
        "inLanguage": "es",
        "genre": ["Aventura", "Documental", "Entretenimiento", "Viajes"],
        "author": [
          {
            "@type": "Person",
            "name": "Juan Carlos Martínez",
            "alternateName": "JuanSofa"
          },
          {
            "@type": "Person",
            "name": "Jhon Da Silva",
            "alternateName": "JhonSnacks"
          }
        ],
        "publisher": {
          "@type": "Organization",
          "name": "Vacílate Esto"
        },
        "containsSeason": {
          "@type": "PodcastSeason",
          "seasonNumber": 1,
          "numberOfEpisodes": 3,
          "episode": [
            {
              "@type": "PodcastEpisode",
              "name": "Podcast en Naiguatá",
              "episodeNumber": 1,
              "description": "Grabación en la cima del Pico Naiguatá a 2.765 metros, el techo de Caracas."
            },
            {
              "@type": "PodcastEpisode",
              "name": "Podcast en Roraima",
              "episodeNumber": 2,
              "description": "Expedición al tepuy más emblemático de Venezuela a 2.810 metros de altura."
            }
          ]
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://www.vacilateesto.com/podcast-en-la-cumbre",
        "url": "https://www.vacilateesto.com/podcast-en-la-cumbre",
        "name": "Podcast en la Cumbre | Aventura en las Montañas de Venezuela",
        "description": "Travesía audiovisual grabando podcasts en Naiguatá, Roraima y Pico Bolívar. Aventura, humor y reflexión desde las alturas de Venezuela.",
        "isPartOf": {
          "@type": "WebSite",
          "name": "Vacílate Esto",
          "url": "https://www.vacilateesto.com"
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
              "text": "Es una travesía audiovisual de siete meses para grabar podcasts en las cumbres más emblemáticas de Venezuela: Pico Naiguatá (2.765m), Monte Roraima (2.810m) y Pico Bolívar (4.978m)."
            }
          },
          {
            "@type": "Question",
            "name": "¿Quiénes son los hosts de Podcast en la Cumbre?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "JuanSofa (Juan Carlos Martínez) y JhonSnacks (Jhon Da Silva) lideran el proyecto como co-hosts, combinando aventura, humor y reflexión en cada episodio."
            }
          },
          {
            "@type": "Question",
            "name": "¿Cuáles son las montañas del proyecto?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "El proyecto incluye tres cumbres icónicas de Venezuela: Pico Naiguatá (2.765m) el techo de Caracas, Monte Roraima (2.810m) el tepuy más emblemático, y Pico Bolívar (4.978m) la montaña más alta del país."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Podcast en la Cumbre | Aventura en las Montañas de Venezuela</title>
        <meta name="description" content="Travesía audiovisual grabando podcasts en Naiguatá (2.765m), Roraima (2.810m) y Pico Bolívar. Aventura, humor y reflexión desde las alturas de Venezuela con JuanSofa y JhonSnacks." />
        <meta name="keywords" content="podcast venezuela, podcast montaña, pico naiguata, monte roraima, pico bolivar, aventura venezuela, JuanSofa, JhonSnacks, podcast en la cumbre, vacilate esto, montañismo venezuela" />
        <link rel="canonical" href="https://www.vacilateesto.com/podcast-en-la-cumbre" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Podcast en la Cumbre | Aventura en las Montañas de Venezuela" />
        <meta property="og:description" content="Travesía audiovisual de 7 meses grabando podcasts en Naiguatá, Roraima y Pico Bolívar. Tres cumbres, tres historias, un mismo mensaje." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.vacilateesto.com/podcast-en-la-cumbre" />
        <meta property="og:locale" content="es_VE" />
        <meta property="og:site_name" content="Vacílate Esto" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Podcast en la Cumbre | Aventura en Venezuela" />
        <meta name="twitter:description" content="Grabando podcasts en las cumbres más emblemáticas de Venezuela: Naiguatá, Roraima y Pico Bolívar." />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="author" content="Vacílate Esto" />
        <meta name="geo.region" content="VE" />
        <meta name="geo.placename" content="Venezuela" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main itemScope itemType="https://schema.org/Article">
          {/* Hero Section */}
          <section className="relative pt-24 pb-8 bg-background overflow-hidden" aria-label="Introducción">
            <div className="container mx-auto px-4 relative z-10 text-center">
              <div className="flex justify-center mb-4">
                <img 
                  src={logoCumbre} 
                  alt="Podcast en la Cumbre - Logo del proyecto de podcasts en montañas de Venezuela" 
                  className="w-full max-w-sm h-auto"
                  loading="eager"
                />
              </div>
              
              <p className="text-foreground/70 text-base max-w-2xl mx-auto" itemProp="description">
                Una travesía audiovisual de siete meses para mostrar a Venezuela desde sus alturas 
                —Naiguatá, Roraima y Pico Bolívar— en un viaje que mezcla aventura, humor y reflexión.
              </p>
            </div>
          </section>

          {/* Episodios Section */}
          <section className="py-16 bg-muted/30" aria-labelledby="episodios-heading">
            <div className="container mx-auto px-4">
              <h1 id="episodios-heading" className="text-3xl font-bold text-foreground text-center mb-12" itemProp="name">
                Episodios de Podcast en la Cumbre
              </h1>
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <article className="aspect-video rounded-2xl overflow-hidden shadow-elevated">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/NZWSKJvOdXg"
                    title="Podcast en la Cumbre Episodio 1 - Pico Naiguatá Venezuela"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    loading="lazy"
                  />
                </article>
                <article className="aspect-video rounded-2xl overflow-hidden shadow-elevated">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/NdrcKpsD0UU"
                    title="Podcast en la Cumbre Episodio 2 - Detrás de cámaras Naiguatá"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    loading="lazy"
                  />
                </article>
              </div>
            </div>
          </section>

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
                    Liderado por <strong>JuanSofa</strong> y <strong>JhonSnacks</strong>, el proyecto documenta cada paso con streaming en vivo, 
                    podcast, reels, microdocumentales y fotografía editorial.
                  </p>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Tres cumbres, tres historias, un mismo mensaje:</strong> 
                    {" "}Aquí hay país, aquí hay historias, aquí hay altura.
                  </p>
                </div>
                <aside className="bg-muted/30 rounded-2xl p-8 border border-border">
                  <h3 className="text-xl font-bold text-foreground mb-4">Manifiesto del Proyecto</h3>
                  <p className="text-muted-foreground mb-4">
                    El manifiesto de Podcast en la Cumbre afirma que la altura es una forma de vivir y mirar el mundo.
                  </p>
                  <p className="text-muted-foreground">
                    Es un recordatorio de que Venezuela tiene historias, paisajes y gente "a la altura", 
                    y que subir —física y simbólicamente— es un acto de orgullo y carácter.
                  </p>
                </aside>
              </div>
            </div>
          </section>

          {/* Naiguata Section */}
          <article className="py-16 bg-background" aria-labelledby="naiguata-heading">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 id="naiguata-heading" className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <MapPin className="w-8 h-8 text-primary" aria-hidden="true" />
                  Podcast en Pico Naiguatá (2.765m)
                </h2>
                <p className="text-muted-foreground mb-4">
                  Grabar un podcast en el Naiguatá… subir y ganárselo. Nos fuimos 20 personas —equipo central, 
                  guías, porteadores, producción— con mochilas llenas de micrófonos, cámaras, comida, capas 
                  térmicas y ese humor que no se enfría ni con neblina.
                </p>
                <p className="text-muted-foreground mb-4">
                  Subimos por La Julia, cruzamos miradores, peñones y subidas que parecían castigos de gimnasio. 
                  Llegamos a la cima de Caracas a <strong>2.765 metros sobre el nivel del mar</strong>, donde la ciudad se ve como un mapa y el mar 
                  asoma tímido detrás de la cordillera.
                </p>
                <blockquote className="border-l-4 border-primary pl-6 my-8 italic text-foreground text-xl">
                  "Aquí estamos… más cerca del cielo y de quiénes somos como venezolanos."
                </blockquote>
                <p className="text-muted-foreground">
                  Ese día entendimos que subir una montaña es fácil… lo difícil es bajarse después de ver todo desde arriba.
                </p>
              </div>
            </div>
          </article>

          {/* Roraima Section */}
          <article className="py-16 bg-muted/30" aria-labelledby="roraima-heading">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 id="roraima-heading" className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <MapPin className="w-8 h-8 text-primary" aria-hidden="true" />
                  Podcast en Monte Roraima (2.810m)
                </h2>
                <p className="text-muted-foreground mb-4">
                  Roraima es la segunda cumbre del proyecto. El tepuy más emblemático de Venezuela, 
                  con sus <strong className="text-primary">2.810 metros</strong> de altura, representa 
                  un reto único: una meseta ancestral donde el tiempo parece detenerse.
                </p>
                <p className="text-muted-foreground mb-4">
                  La expedición hacia la cima del Roraima es una travesía de varios días atravesando 
                  la Gran Sabana, cruzando ríos y ascendiendo por la famosa rampa natural que conecta 
                  con la cima del tepuy.
                </p>
                <blockquote className="border-l-4 border-primary pl-6 my-8 italic text-foreground text-xl">
                  "Roraima es donde el cielo toca la tierra y las historias se vuelven leyenda."
                </blockquote>
                <p className="text-muted-foreground">
                  En la cima, entre formaciones rocosas milenarias y paisajes de otro mundo, 
                  grabaremos un episodio que captura la esencia mística de este lugar sagrado para los Pemón.
                </p>
              </div>
            </div>
          </article>

          {/* Team Section */}
          <section className="py-16 bg-background" aria-labelledby="team-heading">
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
                    className="bg-muted/30 rounded-xl p-6 border border-border hover:border-primary/50 transition-colors"
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

          {/* Press Section */}
          <section className="py-16 bg-primary/10" aria-labelledby="press-heading">
            <div className="container mx-auto px-4 text-center">
              <Newspaper className="w-12 h-12 text-primary mx-auto mb-4" aria-hidden="true" />
              <h2 id="press-heading" className="text-3xl font-bold text-foreground mb-4">Prensa y Medios</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Descubre la historia detrás de Podcast en la Cumbre, el reto de JuanSofa y JhonSnacks 
                para llevar identidad, humor y aventura a las cimas más emblemáticas del país.
              </p>
              <a
                href="https://podcastenlacumbre.zapier.app/formulario"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-colors"
              >
                Descargar Nota de Prensa
              </a>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PodcastEnLaCumbre;

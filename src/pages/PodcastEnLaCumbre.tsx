import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mountain, Users, MapPin, Newspaper } from "lucide-react";

const PodcastEnLaCumbre = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-foreground overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 border-2 border-background rounded-full" />
            <div className="absolute bottom-20 right-20 w-60 h-60 border-2 border-background rounded-full" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            {/* Mountain Icon */}
            <div className="flex justify-center mb-6">
              <svg viewBox="0 0 200 80" className="w-64 h-24 text-background" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="10,70 40,30 60,50 90,15 120,45 150,20 180,70" />
              </svg>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-background mb-4">
              PODCAST EN
            </h1>
            <h2 className="text-5xl md:text-7xl font-black text-primary mb-8">
              LA CUMBRE
            </h2>
            <p className="text-background/80 text-lg max-w-3xl mx-auto">
              Una travesía audiovisual de siete meses para mostrar a Venezuela desde sus alturas 
              —Naiguatá, Roraima y Pico Bolívar— en un viaje que mezcla aventura, humor y reflexión.
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
              <h3 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Mountain className="w-8 h-8 text-primary" />
                Podcast En La Cumbre
              </h3>
              <p className="text-muted-foreground mb-4">
                Podcast en la Cumbre es una travesía audiovisual de siete meses para mostrar a Venezuela 
                desde sus alturas —Naiguatá, Roraima y Pico Bolívar— en un viaje que mezcla aventura, 
                humor y reflexión.
              </p>
              <p className="text-muted-foreground mb-4">
                Liderado por JuanSofa y JhonSnacks, el proyecto documenta cada paso con streaming en vivo, 
                podcast, reels, microdocumentales y fotografía editorial.
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Tres cumbres, tres historias, un mismo mensaje:</strong> 
                {" "}Aquí hay país, aquí hay historias, aquí hay altura.
              </p>
            </div>
              <div className="bg-muted/30 rounded-2xl p-8 border border-border">
                <h4 className="text-xl font-bold text-foreground mb-4">Manifiesto</h4>
                <p className="text-muted-foreground mb-4">
                  El manifiesto de Podcast en la Cumbre afirma que la altura es una forma de vivir y mirar el mundo.
                </p>
                <p className="text-muted-foreground">
                  Es un recordatorio de que Venezuela tiene historias, paisajes y gente "a la altura", 
                  y que subir —física y simbólicamente— es un acto de orgullo y carácter.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Videos Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-foreground text-center mb-12">
              Videos del Proyecto
            </h3>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Video 1 */}
              <div className="aspect-video rounded-2xl overflow-hidden shadow-elevated">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/NZWSKJvOdXg"
                  title="Podcast en la Cumbre - Video 1"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              {/* Video 2 */}
              <div className="aspect-video rounded-2xl overflow-hidden shadow-elevated">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/NdrcKpsD0UU"
                  title="Podcast en la Cumbre - Video 2"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Naiguata Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <MapPin className="w-8 h-8 text-primary" />
                Podcast en Naiguatá
              </h3>
              <p className="text-muted-foreground mb-4">
                Grabar un podcast en el Naiguatá… subir y ganárselo. Nos fuimos 20 personas —equipo central, 
                guías, porteadores, producción— con mochilas llenas de micrófonos, cámaras, comida, capas 
                térmicas y ese humor que no se enfría ni con neblina.
              </p>
              <p className="text-muted-foreground mb-4">
                Subimos por La Julia, cruzamos miradores, peñones y subidas que parecían castigos de gimnasio. 
                Llegamos a la cima de Caracas a 2.765 metros, donde la ciudad se ve como un mapa y el mar 
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
        </section>

        {/* Ruta Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-foreground mb-6">
                Ruta hacia el Pico Naiguatá
              </h3>
              <p className="text-muted-foreground mb-4">
                La ruta al Pico Naiguatá arranca en el Puesto de Guardaparques La Julia y sube por trece 
                hitos naturales e históricos: Mirador del Edén, Piedra del Muñeco, Dos Banderas, Rancho Grande, 
                Las Toyotas y La Explanada, hasta alcanzar el Anfiteatro y las formaciones finales antes de la cima.
              </p>
              <p className="text-muted-foreground mb-4">
                Desde allí se continúa hacia las Piedras del Diablo y La Arepa para llegar a los 
                <strong className="text-primary"> 2.765 msnm</strong> del techo de Caracas.
              </p>
              <p className="text-muted-foreground">
                Es una travesía de tres días que combina bosque nublado, pendientes exigentes, vistas al 
                Caribe y a Caracas, y un final cargado de altura y simbolismo.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-foreground text-center mb-12 flex items-center justify-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              El Equipo
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  name: "JuanSofa",
                  fullName: "Juan Carlos Martínez",
                  role: "Co-host, narrador y motor creativo",
                  description: "El que arranca las conversaciones profundas, mete reflexiones entre chistes."
                },
                {
                  name: "JhonSnacks",
                  fullName: "Jhon Da Silva",
                  role: "Co-host",
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
                <div
                  key={member.name}
                  className="bg-muted/30 rounded-xl p-6 border border-border hover:border-primary/50 transition-colors"
                >
                  <h4 className="text-xl font-bold text-primary mb-1">{member.name}</h4>
                  {member.fullName && (
                    <p className="text-sm text-muted-foreground mb-2">{member.fullName}</p>
                  )}
                  <p className="text-sm font-semibold text-foreground mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Press Section */}
        <section className="py-16 bg-primary/10">
          <div className="container mx-auto px-4 text-center">
            <Newspaper className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-foreground mb-4">Prensa</h3>
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
  );
};

export default PodcastEnLaCumbre;

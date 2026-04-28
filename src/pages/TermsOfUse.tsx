import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfUse = () => {
  return (
    <>
      <Helmet>
        <title>Términos de Uso | Vacílate Esto</title>
        <meta name="description" content="Términos y condiciones de uso del sitio web y contenido de Vacílate Esto." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-foreground mb-4">
                Legal
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6">
                Términos de Uso
              </h1>
              <p className="text-muted-foreground">
                Última actualización: Abril 2026
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="bg-card rounded-3xl p-8 md:p-12 shadow-card border border-border space-y-8">
                
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">1. Aceptación de los Términos</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Al acceder y utilizar el sitio web de Vacílate Esto y su contenido, aceptas estar sujeto a estos términos de uso. Si no estás de acuerdo con alguno de estos términos, te pedimos que no utilices nuestro sitio web ni nuestros servicios.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">2. Descripción del Servicio</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Vacílate Esto es un ecosistema de entretenimiento educativo ("Fun Educaitment") que incluye:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Podcasts (Vacílate Esto, Podcast en la Cumbre, Pelotica, Ruta Ramen, entre otros)</li>
                    <li>Videos, shorts y formatos como Guerra de Comerciales</li>
                    <li>Buscador de episodios con transcripciones e inteligencia artificial</li>
                    <li>App PWA, blog editorial y newsletter</li>
                    <li>Proyecto especial Vacílate El Mundial 2026</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">3. Propiedad Intelectual</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Todo el contenido publicado en Vacílate Esto, incluyendo pero no limitado a:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
                    <li>Episodios de podcast</li>
                    <li>Videos y shorts</li>
                    <li>Transcripciones generadas con asistencia de IA</li>
                    <li>Textos y artículos</li>
                    <li>Imágenes y gráficos</li>
                    <li>Logos y marcas</li>
                    <li>Diseño del sitio web</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed">
                    Son propiedad de Vacílate Esto, El Patio Content Studio y La Web Figital Agency, o se utilizan con permiso de sus respectivos propietarios. Queda prohibida la reproducción, distribución o modificación sin autorización previa por escrito.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">4. Uso Permitido</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Puedes utilizar nuestro contenido para:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
                    <li>Visualización y escucha personal no comercial</li>
                    <li>Compartir enlaces a nuestro contenido en redes sociales</li>
                    <li>Citar fragmentos breves de episodios o transcripciones con atribución adecuada y enlace de regreso</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed">
                    Para cualquier otro uso, incluyendo uso comercial, republicación, entrenamiento de modelos de IA o scraping automatizado, debes obtener nuestro permiso previo por escrito.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">5. Conducta del Usuario</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Al interactuar con nuestro contenido y comunidad, te comprometes a:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>No publicar contenido ofensivo, difamatorio o ilegal</li>
                    <li>Respetar a otros miembros de la comunidad</li>
                    <li>No utilizar nuestras plataformas para spam o publicidad no autorizada</li>
                    <li>No intentar acceder a sistemas o datos no autorizados</li>
                    <li>No suplantar la identidad de otras personas o entidades</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">6. Colaboraciones y Patrocinios</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Las colaboraciones comerciales y patrocinios están sujetos a acuerdos específicos. Nos reservamos el derecho de aceptar o rechazar propuestas de colaboración según nuestros criterios editoriales y valores de marca. Cualquier acuerdo comercial requerirá un contrato por escrito.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">7. Buscador, Transcripciones e IA</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Las transcripciones disponibles en nuestro buscador son generadas automáticamente con asistencia de inteligencia artificial. Pueden contener errores, omisiones o interpretaciones imprecisas y se ofrecen únicamente como referencia para descubrir contenido. La fuente oficial siempre es el episodio original publicado en nuestros canales. Las búsquedas pueden enviarse a proveedores de IA conforme a nuestra <a href="/privacidad" className="text-primary hover:underline">Política de Privacidad</a>.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">8. Limitación de Responsabilidad</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    El contenido de Vacílate Esto se proporciona "tal cual" con fines de entretenimiento e información general. No garantizamos la exactitud, integridad o actualidad de toda la información presentada, incluyendo transcripciones automáticas. No somos responsables por decisiones tomadas basadas en nuestro contenido.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">9. Enlaces a Terceros</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Nuestro sitio puede contener enlaces a sitios web de terceros. No somos responsables del contenido, políticas de privacidad o prácticas de estos sitios externos. Te recomendamos revisar los términos y políticas de cualquier sitio que visites.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">10. Modificaciones</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Nos reservamos el derecho de modificar estos términos de uso en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en este sitio. El uso continuado del sitio después de cualquier modificación constituye tu aceptación de los nuevos términos.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">11. Ley Aplicable</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Estos términos se rigen por las leyes de la República Bolivariana de Venezuela. Cualquier disputa relacionada con estos términos será sometida a la jurisdicción de los tribunales competentes de Venezuela.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">12. Contacto</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Para cualquier pregunta sobre estos términos de uso, puedes contactarnos en:{" "}
                    <a href="mailto:jhon@hacemosloquenosgusta.com" className="text-primary hover:underline">
                      jhon@hacemosloquenosgusta.com
                    </a>
                  </p>
                </section>

              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TermsOfUse;

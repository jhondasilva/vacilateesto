import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Política de Privacidad | Vacílate Esto</title>
        <meta name="description" content="Política de privacidad de Vacílate Esto. Conoce cómo protegemos y manejamos tu información personal." />
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
                Política de Privacidad
              </h1>
              <p className="text-muted-foreground">
                Última actualización: Diciembre 2024
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="bg-card rounded-3xl p-8 md:p-12 shadow-card border border-border space-y-8">
                
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">1. Información que Recopilamos</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    En Vacílate Esto, recopilamos información que nos proporcionas directamente cuando:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Te suscribes a nuestro newsletter</li>
                    <li>Nos contactas a través de nuestros formularios</li>
                    <li>Interactúas con nuestro contenido en redes sociales</li>
                    <li>Solicitas información sobre colaboraciones o patrocinios</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">2. Uso de la Información</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Utilizamos la información recopilada para:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Enviarte nuestro newsletter semanal con contenido curado</li>
                    <li>Responder a tus consultas y solicitudes</li>
                    <li>Mejorar nuestro contenido y servicios</li>
                    <li>Comunicarte sobre nuevos episodios y proyectos especiales</li>
                    <li>Procesar solicitudes de colaboración y patrocinio</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">3. Protección de Datos</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción. Tus datos se almacenan en servidores seguros y solo el personal autorizado tiene acceso a ellos.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">4. Compartir Información</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    No vendemos, alquilamos ni compartimos tu información personal con terceros para fines de marketing. Podemos compartir información con proveedores de servicios que nos ayudan a operar nuestro sitio web y servicios, siempre bajo estrictos acuerdos de confidencialidad.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">5. Cookies y Tecnologías Similares</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestro sitio, analizar el tráfico y personalizar el contenido. Puedes configurar tu navegador para rechazar cookies, aunque esto puede afectar algunas funcionalidades del sitio.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">6. Tus Derechos</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Tienes derecho a:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Acceder a tu información personal</li>
                    <li>Rectificar datos inexactos</li>
                    <li>Solicitar la eliminación de tus datos</li>
                    <li>Oponerte al procesamiento de tu información</li>
                    <li>Darte de baja de nuestras comunicaciones en cualquier momento</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">7. Menores de Edad</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Nuestro contenido está dirigido a un público general. No recopilamos intencionalmente información de menores de 13 años. Si eres padre o tutor y crees que tu hijo nos ha proporcionado información personal, contáctanos para que podamos tomar las medidas necesarias.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">8. Cambios a esta Política</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre cambios significativos publicando la nueva política en esta página con una fecha de actualización revisada.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">9. Contacto</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos tu información, puedes contactarnos en:{" "}
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

export default PrivacyPolicy;

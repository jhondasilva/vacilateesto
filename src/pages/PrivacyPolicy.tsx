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
                Última actualización: Abril 2026
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="bg-card rounded-3xl p-8 md:p-12 shadow-card border border-border space-y-8">
                
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">1. Información que Recopilamos</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    En Vacílate Esto recopilamos información que nos proporcionas directamente cuando:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
                    <li>Te suscribes a nuestro newsletter</li>
                    <li>Nos contactas a través de nuestros formularios o correo</li>
                    <li>Solicitas nuestro Media Kit o información de patrocinio</li>
                    <li>Interactúas con nuestras plataformas (web, app, redes sociales)</li>
                    <li>Usas nuestro buscador de episodios (registramos consultas anonimizadas para mejorar resultados)</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed">
                    También recopilamos automáticamente datos técnicos básicos: dirección IP, tipo de dispositivo y navegador, páginas visitadas y tiempo de permanencia, con fines analíticos y de seguridad.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">2. Uso de la Información</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Utilizamos la información recopilada para:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Enviarte nuestro newsletter con contenido curado y novedades</li>
                    <li>Responder consultas, propuestas y solicitudes de patrocinio</li>
                    <li>Mejorar el buscador semántico y la calidad de los resultados</li>
                    <li>Comunicarte sobre nuevos episodios, proyectos especiales y la gira Vacílate El Fútbol</li>
                    <li>Operar y mejorar nuestra app, web y herramientas internas</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">3. Buscador de Episodios e Inteligencia Artificial</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Nuestro buscador <a href="/buscador" className="text-primary hover:underline">/buscador</a> usa inteligencia artificial (modelos de Google Gemini a través de Lovable AI) para transcribir nuestros episodios y mejorar la relevancia de los resultados. Cuando haces una búsqueda:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
                    <li>Tu consulta se procesa para encontrar fragmentos relevantes en nuestras transcripciones.</li>
                    <li>El texto de la consulta puede enviarse a proveedores de IA para expandirla y reordenar resultados.</li>
                    <li>No vinculamos consultas con tu identidad personal.</li>
                    <li>Las transcripciones provienen exclusivamente de contenido público publicado por nosotros en YouTube.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">4. Servicios de Terceros</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Para operar el ecosistema utilizamos proveedores de confianza, cada uno con su propia política de privacidad:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li><strong>Lovable Cloud / Supabase:</strong> base de datos, autenticación y almacenamiento.</li>
                    <li><strong>Google (YouTube, Gemini):</strong> distribución de contenido y procesamiento de IA.</li>
                    <li><strong>Resend:</strong> envío de correos transaccionales y newsletter.</li>
                    <li><strong>Spotify, Apple Podcasts, redes sociales:</strong> distribución de podcast y contenido.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">5. Protección de Datos</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción. Tus datos se almacenan en servidores seguros y solo el personal autorizado tiene acceso a ellos.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">6. Compartir Información</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    No vendemos, alquilamos ni compartimos tu información personal con terceros para fines de marketing. Podemos compartir información con proveedores de servicios que nos ayudan a operar nuestro sitio web y servicios, siempre bajo estrictos acuerdos de confidencialidad.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">7. Cookies y Almacenamiento Local</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Utilizamos cookies y almacenamiento local del navegador para mantener tu sesión, recordar preferencias, instalar la app PWA y analizar el tráfico de forma agregada. Puedes configurar tu navegador para rechazar cookies, aunque esto puede afectar algunas funcionalidades.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">8. Tus Derechos</h2>
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
                  <h2 className="text-2xl font-bold text-foreground mb-4">9. Menores de Edad</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Nuestro contenido está dirigido a un público general. No recopilamos intencionalmente información de menores de 13 años. Si eres padre o tutor y crees que tu hijo nos ha proporcionado información personal, contáctanos para que podamos tomar las medidas necesarias.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">10. Cambios a esta Política</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre cambios significativos publicando la nueva política en esta página con una fecha de actualización revisada.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">11. Contacto</h2>
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

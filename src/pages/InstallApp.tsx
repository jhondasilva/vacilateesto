import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, Check, Share, MoreVertical, Plus } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallApp = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      <Helmet>
        <title>Instalar App | Vacílate Esto - El Mejor Podcast de Venezuela</title>
        <meta name="description" content="Instala la app de Vacílate Esto en tu teléfono. Accede al mejor podcast de Venezuela desde tu pantalla de inicio." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-24 pb-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              {/* Hero — Sticker Pack Y2K */}
              <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background border-2 border-foreground rounded-full mb-6 shadow-[4px_4px_0_hsl(var(--primary))] rotate-[-2deg]">
                  <Smartphone className="w-4 h-4" />
                  <span className="font-display font-black text-xs uppercase tracking-widest">Instalar app</span>
                </div>
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-primary border-4 border-foreground flex items-center justify-center shadow-[8px_8px_0_hsl(var(--foreground))] rotate-[-3deg]">
                  <Smartphone className="w-12 h-12 text-primary-foreground" />
                </div>
                <h1 className="font-display font-black tracking-[-0.04em] leading-[0.9] text-[12vw] sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-4">
                  Instala{" "}
                  <span className="italic bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Vacílate Esto</span>
                  .
                </h1>
                <p className="font-body text-base md:text-xl text-muted-foreground">
                  Accede al mejor podcast de Venezuela directamente desde tu pantalla de inicio.
                </p>
              </div>

              {/* Install Status */}
              {isInstalled ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 mb-8">
                  <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">¡Ya está instalada!</h2>
                  <p className="text-muted-foreground">
                    La app de Vacílate Esto ya está en tu dispositivo. ¡Disfruta del contenido!
                  </p>
                </div>
              ) : (
                <>
                  {/* Android Install Button */}
                  {deferredPrompt && (
                    <div className="mb-8">
                      <Button 
                        onClick={handleInstallClick}
                        variant="hero"
                        size="xl"
                        className="w-full sm:w-auto"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Instalar App Ahora
                      </Button>
                    </div>
                  )}

                  {/* iOS Instructions */}
                  {isIOS && (
                    <div className="bg-card rounded-2xl p-8 mb-8 text-left">
                      <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                        Cómo instalar en iPhone/iPad
                      </h2>
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Share className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">1. Toca el botón Compartir</h3>
                            <p className="text-muted-foreground text-sm">
                              En Safari, toca el ícono de compartir en la barra inferior
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Plus className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">2. Selecciona "Añadir a inicio"</h3>
                            <p className="text-muted-foreground text-sm">
                              Desliza hacia abajo y selecciona "Añadir a pantalla de inicio"
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Check className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">3. Confirma la instalación</h3>
                            <p className="text-muted-foreground text-sm">
                              Toca "Añadir" en la esquina superior derecha
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Android Instructions (when no prompt available) */}
                  {isAndroid && !deferredPrompt && (
                    <div className="bg-card rounded-2xl p-8 mb-8 text-left">
                      <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                        Cómo instalar en Android
                      </h2>
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <MoreVertical className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">1. Abre el menú del navegador</h3>
                            <p className="text-muted-foreground text-sm">
                              Toca los tres puntos en la esquina superior derecha de Chrome
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Download className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">2. Selecciona "Instalar app"</h3>
                            <p className="text-muted-foreground text-sm">
                              O "Añadir a pantalla de inicio" si no ves la opción
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Check className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">3. Confirma la instalación</h3>
                            <p className="text-muted-foreground text-sm">
                              Toca "Instalar" en el diálogo que aparece
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Desktop Instructions */}
                  {!isIOS && !isAndroid && !deferredPrompt && (
                    <div className="bg-card rounded-2xl p-8 mb-8 text-left">
                      <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                        Cómo instalar en tu computadora
                      </h2>
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Download className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">1. Busca el ícono de instalación</h3>
                            <p className="text-muted-foreground text-sm">
                              En Chrome, busca el ícono de instalación en la barra de direcciones
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Check className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">2. Haz clic en "Instalar"</h3>
                            <p className="text-muted-foreground text-sm">
                              Confirma la instalación en el diálogo
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Benefits */}
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="bg-card rounded-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Acceso Rápido</h3>
                  <p className="text-sm text-muted-foreground">
                    Abre la app directamente desde tu pantalla de inicio
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Download className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Funciona Offline</h3>
                  <p className="text-sm text-muted-foreground">
                    Accede al contenido incluso sin conexión a internet
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Experiencia Nativa</h3>
                  <p className="text-sm text-muted-foreground">
                    Se siente como una app nativa en tu dispositivo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default InstallApp;

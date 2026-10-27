import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";

import { useDomainRedirect } from "./hooks/useDomainRedirect";
import AnalyticsPageViews from "./components/AnalyticsPageViews";
import RouteSeo from "./components/RouteSeo";
import DashboardSessionBoundary from "./components/DashboardSessionBoundary";
import { lazyPage, PageBoundary } from "./components/PageBoundary";

const PodcastEnLaCumbre = lazyPage(() => import("./pages/PodcastEnLaCumbre"));
const PrensaPicoBolivar = lazyPage(() => import("./pages/PrensaPicoBolivar"));
const PressKit = lazyPage(() => import("./pages/PressKit"));
const CoberturaPrensa = lazyPage(() => import("./pages/CoberturaPrensa"));
const PodcastEterno = lazyPage(() => import("./pages/PodcastEterno"));
const Premios = lazyPage(() => import("./pages/Premios"));
const PrensaFIAP2026 = lazyPage(() => import("./pages/PrensaFIAP2026"));
const VacilateElMundial = lazyPage(() => import("./pages/VacilateElMundial"));
const MediaKit = lazyPage(() => import("./pages/MediaKit"));
const MediaKitVEM = lazyPage(() => import("./pages/MediaKitVEM"));
const PrivacyPolicy = lazyPage(() => import("./pages/PrivacyPolicy"));
const TermsOfUse = lazyPage(() => import("./pages/TermsOfUse"));
const InstallApp = lazyPage(() => import("./pages/InstallApp"));
const NotFound = lazyPage(() => import("./pages/NotFound"));
const Gira = lazyPage(() => import("./pages/Gira"));
const GiraLogin = lazyPage(() => import("./pages/GiraLogin"));
const GiraPoliticas = lazyPage(() => import("./pages/GiraPoliticas"));
const Buscador = lazyPage(() => import("./pages/Buscador"));
const Hosts = lazyPage(() => import("./pages/Hosts"));
const DashboardLogin = lazyPage(() => import("./pages/DashboardLogin"));
const DashboardHome = lazyPage(() => import("./pages/DashboardHome"));
const DashboardBrand = lazyPage(() => import("./pages/DashboardBrand"));
const DashboardAdmin = lazyPage(() => import("./pages/DashboardAdmin"));
const AdminMediaKitVEM = lazyPage(() => import("./pages/AdminMediaKitVEM"));
const DashboardComunidad = lazyPage(() => import("./pages/DashboardComunidad"));
const IngestHealth = lazyPage(() => import("./pages/IngestHealth"));
const ResetPassword = lazyPage(() => import("./pages/ResetPassword"));
const MejoresPodcastsVenezuela = lazyPage(() => import("./pages/MejoresPodcastsVenezuela"));
const PodcastsVenezolanosComedia = lazyPage(() => import("./pages/PodcastsVenezolanosComedia"));
const PodcastsVenezolanosFutbol = lazyPage(() => import("./pages/PodcastsVenezolanosFutbol"));
const PodcastsVenezolanosSpotify = lazyPage(() => import("./pages/PodcastsVenezolanosSpotify"));
const HechoEnVenezuela = lazyPage(() => import("./pages/HechoEnVenezuela"));
const Fali = lazyPage(() => import("./pages/Fali"));
const FaliEnglish = lazyPage(() => import("./pages/FaliEnglish"));
const WalkingAds = lazyPage(() => import("./pages/WalkingAds"));
const StreamingFromTheLostWorld = lazyPage(() => import("./pages/StreamingFromTheLostWorld"));
const Cannes = lazyPage(() => import("./pages/Cannes"));
const BlogIndex = lazyPage(() => import("./pages/blog/BlogIndex"));
const MejoresPodcastsVenezolanos = lazyPage(() => import("./pages/blog/MejoresPodcastsVenezolanos"));
const ComoSubirRoraima = lazyPage(() => import("./pages/blog/ComoSubirRoraima"));
const ComoSubirPicoNaiguata = lazyPage(() => import("./pages/blog/ComoSubirPicoNaiguata"));
const LeyendasUrbanasVenezuela = lazyPage(() => import("./pages/blog/LeyendasUrbanasVenezuela"));
const HistoriaArepa = lazyPage(() => import("./pages/blog/HistoriaArepa"));
const MundialDesdeVenezuela = lazyPage(() => import("./pages/blog/MundialDesdeVenezuela"));
const PodcastMasLargo = lazyPage(() => import("./pages/blog/PodcastMasLargo"));
const RutaRamenCaracas = lazyPage(() => import("./pages/blog/RutaRamenCaracas"));
const TioSimonTributoFrases = lazyPage(() => import("./pages/blog/TioSimonTributoFrases"));
const MejorPerroCalienteCaracas = lazyPage(() => import("./pages/blog/MejorPerroCalienteCaracas"));
const QueEsLlaneridad = lazyPage(() => import("./pages/blog/QueEsLlaneridad"));
const MarcasVenezolanasNostalgicas = lazyPage(() => import("./pages/blog/MarcasVenezolanasNostalgicas"));
const PeloticaSplit4 = lazyPage(() => import("./pages/blog/PeloticaSplit4"));
const QueEsPeloticaDeGoma = lazyPage(() => import("./pages/blog/QueEsPeloticaDeGoma"));
const FaliFrustracionLatencia = lazyPage(() => import("./pages/blog/FaliFrustracionLatencia"));
const FiapPremios = lazyPage(() => import("./pages/blog/FiapPremios"));
const NumerosVacilateEsto2026 = lazyPage(() => import("./pages/blog/NumerosVacilateEsto2026"));
const BlogPostDynamic = lazyPage(() => import("./pages/blog/BlogPostDynamic"));
const EpisodePage = lazyPage(() => import("./pages/EpisodePage"));

const queryClient = new QueryClient();

// Component that handles domain-based redirections
const DomainRedirectHandler = ({ children }: { children: React.ReactNode }) => {
  useDomainRedirect();
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DomainRedirectHandler>
          <RouteSeo />
          <AnalyticsPageViews />
          <PageBoundary>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/podcast-en-la-cumbre" element={<PodcastEnLaCumbre />} />
            <Route path="/prensa/pico-bolivar" element={<PrensaPicoBolivar />} />
            <Route path="/press-kit" element={<PressKit />} />
            <Route path="/prensa/cobertura" element={<CoberturaPrensa />} />
            <Route path="/prensa" element={<Navigate to="/press-kit" replace />} />
            <Route path="/podcast-eterno" element={<PodcastEterno />} />
            <Route path="/premios" element={<Premios />} />
            <Route path="/prensa/fiap-2026" element={<PrensaFIAP2026 />} />
            <Route path="/vacilate-el-futbol" element={<VacilateElMundial />} />
            <Route path="/vacilate-el-mundial" element={<Navigate to="/vacilate-el-futbol" replace />} />
            <Route path="/media-kit" element={<MediaKit />} />
            <Route path="/media-kit-vem" element={<MediaKitVEM />} />
            <Route path="/privacidad" element={<PrivacyPolicy />} />
            <Route path="/terminos" element={<TermsOfUse />} />
            <Route path="/instalar" element={<InstallApp />} />
            <Route path="/gira/login" element={<GiraLogin />} />
            <Route path="/gira" element={<DashboardSessionBoundary><Gira /></DashboardSessionBoundary>} />
            <Route path="/gira/politicas" element={<GiraPoliticas />} />
            <Route path="/buscador" element={<Buscador />} />
            <Route path="/episodios/:videoId" element={<EpisodePage />} />
            <Route path="/hosts" element={<Hosts />} />
            <Route path="/lab/hosts" element={<Navigate to="/hosts" replace />} />
            <Route path="/lab/host" element={<Navigate to="/hosts" replace />} />
            <Route path="/dashboard/login" element={<DashboardLogin />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<DashboardSessionBoundary><DashboardHome /></DashboardSessionBoundary>} />
            <Route path="/dashboard/admin" element={<DashboardSessionBoundary><DashboardAdmin /></DashboardSessionBoundary>} />
            <Route path="/dashboard/admin/ingest-health" element={<DashboardSessionBoundary><IngestHealth /></DashboardSessionBoundary>} />
            <Route path="/dashboard/admin/mediakit-vem" element={<DashboardSessionBoundary><AdminMediaKitVEM /></DashboardSessionBoundary>} />
            <Route path="/dashboard/comunidad" element={<DashboardSessionBoundary><DashboardComunidad /></DashboardSessionBoundary>} />
            <Route path="/dashboard/:slug" element={<DashboardSessionBoundary><DashboardBrand /></DashboardSessionBoundary>} />
            <Route path="/mejores-podcasts-venezuela" element={<MejoresPodcastsVenezuela />} />
            <Route path="/podcasts-venezolanos-comedia" element={<PodcastsVenezolanosComedia />} />
            <Route path="/podcasts-venezolanos-futbol" element={<PodcastsVenezolanosFutbol />} />
            <Route path="/podcasts-venezolanos-spotify" element={<PodcastsVenezolanosSpotify />} />
            <Route path="/hecho-en-venezuela" element={<HechoEnVenezuela />} />
            <Route path="/fali" element={<Fali />} />
            <Route path="/en/fali" element={<FaliEnglish />} />
            
            <Route path="/walking-ads" element={<WalkingAds />} />
            <Route path="/streaming-from-the-lost-world" element={<StreamingFromTheLostWorld />} />
            <Route path="/cannes" element={<Cannes />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/mejores-podcasts-venezolanos-2026" element={<MejoresPodcastsVenezolanos />} />
            <Route path="/blog/como-subir-roraima-guia-completa" element={<ComoSubirRoraima />} />
            <Route path="/blog/como-subir-pico-naiguata" element={<ComoSubirPicoNaiguata />} />
            <Route path="/blog/leyendas-urbanas-venezuela" element={<LeyendasUrbanasVenezuela />} />
            <Route path="/blog/historia-de-la-arepa" element={<HistoriaArepa />} />
            <Route path="/blog/donde-ver-mundial-2026-desde-venezuela" element={<MundialDesdeVenezuela />} />
            <Route path="/blog/podcast-mas-largo-historia" element={<PodcastMasLargo />} />
            <Route path="/blog/ruta-del-ramen-caracas" element={<RutaRamenCaracas />} />
            <Route path="/blog/tio-simon-frases-tributo" element={<TioSimonTributoFrases />} />
            <Route path="/blog/mejor-perro-caliente-caracas" element={<MejorPerroCalienteCaracas />} />
            <Route path="/blog/que-es-la-llaneridad" element={<QueEsLlaneridad />} />
            <Route path="/blog/marcas-venezolanas-nostalgicas" element={<MarcasVenezolanasNostalgicas />} />
            <Route path="/blog/pelotica-de-goma-split-4" element={<PeloticaSplit4 />} />
            <Route path="/blog/que-es-pelotica-de-goma" element={<QueEsPeloticaDeGoma />} />
            <Route path="/blog/fali-frustracion-latencia-inutil" element={<FaliFrustracionLatencia />} />
            <Route path="/blog/fiap-2026-4-soles-de-bronce" element={<FiapPremios />} />
            <Route path="/blog/numeros-vacilate-esto-2026" element={<NumerosVacilateEsto2026 />} />
            {/* Dynamic AI-generated blog posts (must be last among /blog/* routes) */}
            <Route path="/blog/:slug" element={<BlogPostDynamic />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </PageBoundary>
        </DomainRedirectHandler>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

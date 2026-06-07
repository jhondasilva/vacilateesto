import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import PodcastEnLaCumbre from "./pages/PodcastEnLaCumbre";
import PodcastEterno from "./pages/PodcastEterno";
import VacilateElMundial from "./pages/VacilateElMundial";
import MediaKit from "./pages/MediaKit";
import MediaKitVEM from "./pages/MediaKitVEM";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import InstallApp from "./pages/InstallApp";
import NotFound from "./pages/NotFound";
import Gira from "./pages/Gira";
import GiraLogin from "./pages/GiraLogin";
import GiraPoliticas from "./pages/GiraPoliticas";
import Buscador from "./pages/Buscador";
import LabHosts from "./pages/LabHosts";
import Hosts from "./pages/Hosts";
import DashboardLogin from "./pages/DashboardLogin";
import DashboardHome from "./pages/DashboardHome";
import DashboardBrand from "./pages/DashboardBrand";
import DashboardAdmin from "./pages/DashboardAdmin";
import IngestHealth from "./pages/IngestHealth";
import ResetPassword from "./pages/ResetPassword";
import MejoresPodcastsVenezuela from "./pages/MejoresPodcastsVenezuela";
import PodcastsVenezolanosComedia from "./pages/PodcastsVenezolanosComedia";
import PodcastsVenezolanosFutbol from "./pages/PodcastsVenezolanosFutbol";
import PodcastsVenezolanosSpotify from "./pages/PodcastsVenezolanosSpotify";
import HechoEnVenezuela from "./pages/HechoEnVenezuela";

import WalkingAds from "./pages/WalkingAds";
import StreamingFromTheLostWorld from "./pages/StreamingFromTheLostWorld";
import Cannes from "./pages/Cannes";
import BlogIndex from "./pages/blog/BlogIndex";
import MejoresPodcastsVenezolanos from "./pages/blog/MejoresPodcastsVenezolanos";
import ComoSubirRoraima from "./pages/blog/ComoSubirRoraima";
import ComoSubirPicoNaiguata from "./pages/blog/ComoSubirPicoNaiguata";
import LeyendasUrbanasVenezuela from "./pages/blog/LeyendasUrbanasVenezuela";
import HistoriaArepa from "./pages/blog/HistoriaArepa";
import MundialDesdeVenezuela from "./pages/blog/MundialDesdeVenezuela";
import PodcastMasLargo from "./pages/blog/PodcastMasLargo";
import RutaRamenCaracas from "./pages/blog/RutaRamenCaracas";
import TioSimonTributoFrases from "./pages/blog/TioSimonTributoFrases";
import MejorPerroCalienteCaracas from "./pages/blog/MejorPerroCalienteCaracas";
import QueEsLlaneridad from "./pages/blog/QueEsLlaneridad";
import MarcasVenezolanasNostalgicas from "./pages/blog/MarcasVenezolanasNostalgicas";
import BlogPostDynamic from "./pages/blog/BlogPostDynamic";
import { useDomainRedirect } from "./hooks/useDomainRedirect";

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
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/podcast-en-la-cumbre" element={<PodcastEnLaCumbre />} />
            <Route path="/podcast-eterno" element={<PodcastEterno />} />
            <Route path="/vacilate-el-futbol" element={<VacilateElMundial />} />
            <Route path="/vacilate-el-mundial" element={<Navigate to="/vacilate-el-futbol" replace />} />
            <Route path="/media-kit" element={<MediaKit />} />
            <Route path="/media-kit-vem" element={<MediaKitVEM />} />
            <Route path="/privacidad" element={<PrivacyPolicy />} />
            <Route path="/terminos" element={<TermsOfUse />} />
            <Route path="/instalar" element={<InstallApp />} />
            <Route path="/gira/login" element={<GiraLogin />} />
            <Route path="/gira" element={<Gira />} />
            <Route path="/gira/politicas" element={<GiraPoliticas />} />
            <Route path="/buscador" element={<Buscador />} />
            <Route path="/hosts" element={<Hosts />} />
            <Route path="/lab/hosts" element={<LabHosts />} />
            <Route path="/lab/host" element={<LabHosts />} />
            <Route path="/dashboard/login" element={<DashboardLogin />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/admin" element={<DashboardAdmin />} />
            <Route path="/dashboard/admin/ingest-health" element={<IngestHealth />} />
            <Route path="/dashboard/:slug" element={<DashboardBrand />} />
            <Route path="/mejores-podcasts-venezuela" element={<MejoresPodcastsVenezuela />} />
            <Route path="/podcasts-venezolanos-comedia" element={<PodcastsVenezolanosComedia />} />
            <Route path="/podcasts-venezolanos-futbol" element={<PodcastsVenezolanosFutbol />} />
            <Route path="/podcasts-venezolanos-spotify" element={<PodcastsVenezolanosSpotify />} />
            <Route path="/hecho-en-venezuela" element={<HechoEnVenezuela />} />
            
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
            {/* Dynamic AI-generated blog posts (must be last among /blog/* routes) */}
            <Route path="/blog/:slug" element={<BlogPostDynamic />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DomainRedirectHandler>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

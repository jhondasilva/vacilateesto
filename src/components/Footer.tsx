import { Instagram, Youtube, MapPin, Facebook, Globe, Twitch, Linkedin } from "lucide-react";
import { useEffect } from "react";
import Logo from "@/components/Logo";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Custom TikTok icon since lucide doesn't have one
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

// Custom Threads icon
const ThreadsIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    <path d="M15.5 8.5c-1.5-1-3.5-1-5 0s-2 3-1 5c.5 1 1.5 2 3 2.5s3 0 4-1" />
    <path d="M12 8v8" />
  </svg>
);

// Custom Spotify icon
const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 15c3-1 6-1 8 1" />
    <path d="M7 12c4-1 7-1 10 1" />
    <path d="M6 9c5-1 9-1 12 1" />
  </svg>
);

const Footer = ({ locale = "es" }: { locale?: "es" | "en" }) => {
  const english = locale === "en";
  const labels: Record<string, string> = {
    "Todos los artículos": "All articles", "Mejores podcasts de Venezuela": "Top podcasts in Venezuela", "Podcasts hechos en Venezuela ": "Podcasts made in Venezuela", "Podcasts venezolanos de comedia": "Venezuelan comedy podcasts", "Podcasts venezolanos de fútbol": "Venezuelan football podcasts", "Podcasts venezolanos en Spotify": "Venezuelan podcasts on Spotify", "Mejores podcasts venezolanos": "Top Venezuelan podcasts", "Cómo subir el Roraima": "Climbing Mount Roraima", "Cómo subir el Pico Naiguatá": "Climbing Pico Naiguatá", "Leyendas urbanas de Venezuela": "Venezuelan urban legends", "Historia de la arepa": "The history of the arepa", "Mundial 2026 desde Venezuela": "World Cup 2026 from Venezuela", "El podcast más largo": "The longest podcast", "Ruta del ramen en Caracas": "Caracas ramen trail", "Media Kit VEF 2026": "VEF 2026 Media Kit", Privacidad: "Privacy", Términos: "Terms", Recursos: "Resources"
  };
  const currentYear = new Date().getFullYear();

  // Metricool (Google Analytics is loaded in index.html)
  useEffect(() => {


    // Metricool
    const metricoolScript = document.createElement("script");
    metricoolScript.type = "text/javascript";
    metricoolScript.src = "https://tracker.metricool.com/resources/be.js";
    metricoolScript.onload = () => {
      if ((window as any).beTracker) {
        (window as any).beTracker.t({ hash: "ea27a283da270adea7c04cfa40488e8e" });
      }
    };
    document.head.appendChild(metricoolScript);
  }, []);

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/vacilateestopodcast/", label: "Instagram" },
    { icon: ThreadsIcon, href: "https://www.threads.com/@vacilateestopodcast", label: "Threads" },
    { icon: Youtube, href: "https://www.youtube.com/@Vacilateestopodcast", label: "YouTube" },
    { icon: TikTokIcon, href: "https://www.tiktok.com/@vacilateesto/", label: "TikTok" },
    { icon: SpotifyIcon, href: "https://open.spotify.com/show/2b2AeZVRxEFkNy1KKYkQG1?si=f0ce3d6e27a241a1", label: "Spotify" },
    { icon: Facebook, href: "https://www.facebook.com/vacilatestopodcast/", label: "Facebook" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/vacílate-esto/?originalSubdomain=ve", label: "LinkedIn" },
    { icon: Twitch, href: "https://www.twitch.tv/vacilateesto", label: "Twitch" },
    { icon: Globe, href: "https://www.vacilateesto.com", label: "Website" },
  ];

  const footerLinks = [
    {
      title: "Blog",
      links: [
        { label: "Todos los artículos", href: "/blog" },
        { label: "Mejores podcasts de Venezuela", href: "/mejores-podcasts-venezuela" },
      { label: "Podcasts hechos en Venezuela ", href: "/hecho-en-venezuela" },
        { label: "Podcasts venezolanos de comedia", href: "/podcasts-venezolanos-comedia" },
        { label: "Podcasts venezolanos de fútbol", href: "/podcasts-venezolanos-futbol" },
        { label: "Podcasts venezolanos en Spotify", href: "/podcasts-venezolanos-spotify" },
        { label: "Mejores podcasts venezolanos", href: "/blog/mejores-podcasts-venezolanos-2026" },
        { label: "Cómo subir el Roraima", href: "/blog/como-subir-roraima-guia-completa" },
        { label: "Cómo subir el Pico Naiguatá", href: "/blog/como-subir-pico-naiguata" },
        { label: "Leyendas urbanas de Venezuela", href: "/blog/leyendas-urbanas-venezuela" },
        { label: "Historia de la arepa", href: "/blog/historia-de-la-arepa" },
        { label: "Mundial 2026 desde Venezuela", href: "/blog/donde-ver-mundial-2026-desde-venezuela" },
        { label: "El podcast más largo", href: "/blog/podcast-mas-largo-historia" },
        { label: "Ruta del ramen en Caracas", href: "/blog/ruta-del-ramen-caracas" },
      ],
    },
    {
      title: "Recursos",
      links: [
        { label: "Media Kit", href: "/media-kit" },
        { label: "Hosts", href: "/hosts" },
        { label: "Media Kit VEF 2026", href: "/media-kit-vem" },
        { label: "Dashboards", href: "/dashboard" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacidad", href: "/privacidad" },
        { label: "Términos", href: "/terminos" },
      ],
    },
  ];

  return (
    <footer id="contact" className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        {/* Logo Section - Full Width */}
        <div className="text-center mb-12">
          <a href={english ? "/en/fali" : "#hero"} className="inline-block">
            <Logo size="xl" className="brightness-0 invert" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <p className="text-background/70 text-sm mb-4 max-w-lg leading-relaxed">
              {english ? "Vacílate Esto is a Venezuelan Fun Educaitment content system, created by JuanSofa and JhonSnacks in 2020 and produced by " : "Vacílate Esto es un sistema de contenidos venezolano de Fun Educaitment creado por JuanSofa y JhonSnacks en 2020 y producido por "}
              <a
                href="https://elpatiocontent.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                El Patio Content Studio
              </a>
              {english ? ". From Caracas, with street smarts and data." : ". Desde Caracas, con calle y con data."}
            </p>
            
            <div className="flex items-center gap-2 text-background/60 text-sm mb-6">
              <MapPin className="w-4 h-4" />
              Venezuela
            </div>
            
            {/* Social Links */}
            <TooltipProvider delayDuration={100}>
              <div className="flex items-center gap-3 flex-wrap">
                {socialLinks.map((social) => (
                  <Tooltip key={social.label}>
                    <TooltipTrigger asChild>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background/70 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-foreground text-background border-none">
                      <p className="font-medium">{social.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>

          {/* Links */}
          {english && <p className="text-background/60 text-sm">Linked pages are in Spanish.</p>}
          {footerLinks.map((section) => (
            <div key={english ? (labels[section.title] ?? section.title) : section.title}>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-background">{english ? (labels[section.title] ?? section.title) : section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => {
                  const isPdf = link.href.toLowerCase().endsWith(".pdf");
                  const isExternal = link.href.startsWith("http") || isPdf;
                  return (
                    <li key={english ? (labels[link.label] ?? link.label) : link.label}>
                      <a
                        href={link.href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        {...(isPdf ? { download: "" } : {})}
                        className="text-background/60 hover:text-primary transition-colors text-sm"
                      >
                        {english ? (labels[link.label] ?? link.label) : link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-background/50 text-sm">
            © {currentYear} Vacílate Esto. {english ? "All rights reserved." : "Todos los derechos reservados."}
          </p>
          <p className="text-background/50 text-sm">
            {english ? "Made in Venezuela" : "Hecho con  en Venezuela"}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

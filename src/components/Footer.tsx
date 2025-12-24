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

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Analytics Scripts (Google Analytics + Metricool)
  useEffect(() => {
    // Google Analytics 4
    const gtagScript = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-8C1W3N2FBE";
    document.head.appendChild(gtagScript);

    gtagScript.onload = () => {
      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) {
        (window as any).dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', 'G-8C1W3N2FBE');
    };

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
      title: "Recursos",
      links: [
        { label: "Media Kit", href: "/media-kit" },
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
          <a href="#hero" className="inline-block">
            <Logo size="xl" className="brightness-0 invert" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <p className="text-background/70 text-sm mb-4 max-w-lg leading-relaxed">
              Vacílate Esto es una marca de{" "}
              <a 
                href="https://www.lawebfigitalagency.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                La Web Figital Agency
              </a>
              {" "}producido por su unidad{" "}
              <a 
                href="https://www.elpatiocontentstudio.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                El Patio Content Studio
              </a>
              . Ecosistema de Fun Educaitment 🇻🇪 que nunca se queda quieto. ✨👋
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
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-background">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-background/60 hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-background/50 text-sm">
            © {currentYear} Vacílate Esto. Todos los derechos reservados.
          </p>
          <p className="text-background/50 text-sm">
            Hecho con ❤️ en Venezuela
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Instagram, Youtube, MapPin, Facebook, Globe } from "lucide-react";
import Logo from "@/components/Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/vacilateestopodcast/", label: "Instagram" },
    { icon: Youtube, href: "https://www.youtube.com/@Vacilateestopodcast", label: "YouTube" },
    { icon: Facebook, href: "https://www.facebook.com/vacilatestopodcast/", label: "Facebook" },
    { icon: Globe, href: "https://www.vacilateesto.com", label: "Website" },
  ];

  const footerLinks = [
    {
      title: "Contenido",
      links: [
        { label: "Podcast", href: "#episodes" },
        { label: "Shorts", href: "https://www.youtube.com/@Vacilateestopodcast/shorts" },
        { label: "Live", href: "https://www.youtube.com/@Vacilateestopodcast/streams" },
        { label: "Playlists", href: "https://www.youtube.com/@Vacilateestopodcast/playlists" },
      ],
    },
    {
      title: "Comunidad",
      links: [
        { label: "Sobre Nosotros", href: "#hosts" },
        { label: "Instagram", href: "https://www.instagram.com/vacilateestopodcast/" },
        { label: "Facebook", href: "https://www.facebook.com/vacilatestopodcast/" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacidad", href: "#" },
        { label: "Términos", href: "#" },
      ],
    },
  ];

  return (
    <footer id="contact" className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#hero" className="inline-block mb-4">
              <Logo size="default" className="brightness-0 invert" />
            </a>
            <p className="text-background/70 text-sm mb-4 max-w-sm leading-relaxed">
              El podcast más viral de Venezuela 🇻🇪 que nunca se queda quieto. 
              Conversaciones sin filtro, historias increíbles y el contenido más auténtico. 
              ¡Estamos en todo! ✨👋
            </p>
            
            <div className="flex items-center gap-2 text-background/60 text-sm mb-6">
              <MapPin className="w-4 h-4" />
              Venezuela
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background/70 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
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
            Hecho con ❤️ para nuestra comunidad
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

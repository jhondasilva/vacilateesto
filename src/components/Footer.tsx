import { Instagram, Youtube, MapPin } from "lucide-react";
import Logo from "@/components/Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/vacilateesto", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com/@Vacilateestopodcast", label: "YouTube" },
  ];

  const footerLinks = [
    {
      title: "Contenido",
      links: [
        { label: "Podcast", href: "#episodes" },
        { label: "Shorts", href: "#" },
        { label: "Live", href: "#" },
        { label: "Playlists", href: "#" },
      ],
    },
    {
      title: "Comunidad",
      links: [
        { label: "Sobre Nosotros", href: "#hosts" },
        { label: "Contacto", href: "#contact" },
        { label: "WhatsApp", href: "#" },
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
            <a href="#hero" className="flex items-center gap-3 mb-4">
              <Logo size="sm" />
              <span className="font-bold text-xl text-background">
                Vacílate Esto
              </span>
            </a>
            <p className="text-background/70 text-sm mb-4 max-w-sm leading-relaxed">
              El podcast más viral de Venezuela 🇻🇪 Que nunca se queda quieto, ¡estamos en todo! ✨👋
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

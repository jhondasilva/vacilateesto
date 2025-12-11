import { Instagram, Twitter, Youtube, Facebook } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Facebook, href: "#", label: "Facebook" },
  ];

  const footerLinks = [
    {
      title: "Contenido",
      links: [
        { label: "Podcast", href: "#" },
        { label: "Short Podcast", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Series", href: "#" },
      ],
    },
    {
      title: "Recursos",
      links: [
        { label: "Tienda", href: "#" },
        { label: "Playlist", href: "#" },
        { label: "En La Cumbre", href: "#" },
        { label: "PDG", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacidad", href: "#" },
        { label: "Términos", href: "#" },
        { label: "Cookies", href: "#" },
      ],
    },
  ];

  return (
    <footer id="contact" className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#hero" className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="font-display text-2xl text-primary-foreground">V</span>
              </div>
              <span className="font-display text-2xl tracking-wide">
                VACÍLATE<span className="text-primary"> ESTO</span>
              </span>
            </a>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm">
              El podcast que te hace reír, pensar y disfrutar. Únete a nuestra comunidad 
              y no te pierdas ningún episodio.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-display text-lg mb-4 text-foreground">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
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
        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Vacílate Esto. Todos los derechos reservados.
          </p>
          <p className="text-muted-foreground text-sm">
            Hecho con ❤️ para nuestra comunidad
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

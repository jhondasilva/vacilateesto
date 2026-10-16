import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "FALI", href: "/fali" },
  { label: "Hosts", href: "/hosts" },
  { label: "Media Kit", href: "/media-kit" },
  { label: "Podcast en la Cumbre", href: "/podcast-en-la-cumbre" },
  { label: "Pelotica de Goma", href: "https://www.peloticadegoma.com", external: true },
  { label: "VEF 2026", href: "/vacilate-el-futbol" },
  { label: "Podcast Eterno", href: "/podcast-eterno" },
  { label: "Guerra de Comerciales", href: "/#guerra-comerciales" },
  { label: "Creative Hub", href: "https://creativehub.vacilateesto.com", external: true },
  
  { label: "Dashboard", href: "https://www.vacilateesto.com/dashboard/login", external: true },
  { label: "Contacto", href: "/#contact" },
];

const Header = ({ locale = "es" }: { locale?: "es" | "en" }) => {
  const english = locale === "en";
  const labels: Record<string, string> = { Inicio: "Home", Blog: "Blog", FALI: "FALI", Hosts: "Hosts", "Media Kit": "Media Kit", "Podcast en la Cumbre": "Podcast en la Cumbre", "Pelotica de Goma": "Pelotica de Goma", "VEF 2026": "VEF 2026", "Podcast Eterno": "Podcast Eterno", "Guerra de Comerciales": "Guerra de Comerciales", "Creative Hub": "Creative Hub", Dashboard: "Dashboard", Contacto: "Contact" };
  const links = english ? navLinks.map(link => ({ ...link, label: labels[link.label] ?? link.label, href: link.href === "/fali" ? "/en/fali" : link.href })) : navLinks;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-background border-b border-border ${
        isScrolled ? "shadow-soft" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <Logo size="sm" className="group-hover:scale-105 transition-transform duration-300" />
          </Link>

          {/* Desktop Nav */}
          <nav aria-label={english ? "Main navigation — other pages in Spanish" : undefined} className="hidden xl:flex items-center gap-4">
            {links.map((link) => {
              const isHashLink = link.href.includes('#') && !link.external;
              
              if (link.external) {
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium text-xs whitespace-nowrap"
                  >
                    {link.label}
                  </a>
                );
              }
              
              if (isHashLink) {
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium text-xs whitespace-nowrap"
                  >
                    {link.label}
                  </a>
                );
              }
              
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium text-xs whitespace-nowrap"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>


          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            aria-label={english ? (isMobileMenuOpen ? "Close menu" : "Open menu") : (isMobileMenuOpen ? "Cerrar menú" : "Abrir menú")}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          aria-hidden={!isMobileMenuOpen}
          {...(!isMobileMenuOpen ? { inert: "" } : {})}
          className={`xl:hidden transition-all duration-500 ${
            isMobileMenuOpen ? "visible max-h-[80vh] opacity-100 overflow-y-auto" : "invisible max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <nav aria-label={english ? "Main navigation — other pages in Spanish" : undefined} className="flex flex-col gap-3 py-4 px-2 border-t border-border bg-background/95 backdrop-blur-lg rounded-b-xl">
            {links.map((link) => {
              const isHashLink = link.href.includes('#') && !link.external;
              
              if (link.external) {
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                );
              }
              
              if (isHashLink) {
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                );
              }
              
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

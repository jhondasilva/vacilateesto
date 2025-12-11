import { Instagram, Twitter } from "lucide-react";

const hosts = [
  {
    name: "Marcelo",
    role: "Co-Host & Fundador",
    description: "El alma del podcast. Con su humor irreverente y capacidad para conectar con cualquier invitado, Marcelo transforma cada episodio en una experiencia única.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    socials: {
      instagram: "#",
      twitter: "#",
    },
  },
  {
    name: "Javier",
    role: "Co-Host & Productor",
    description: "El cerebro detrás de las preguntas incómodas. Javier aporta profundidad y perspectiva única a cada conversación que tenemos.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80",
    socials: {
      instagram: "#",
      twitter: "#",
    },
  },
];

const HostsSection = () => {
  return (
    <section id="hosts" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Conoce al Equipo</span>
          <h2 className="font-display text-5xl md:text-6xl mt-3 mb-4">
            LOS HOSTS
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Las voces detrás del micrófono que te acompañan cada semana.
          </p>
        </div>

        {/* Hosts Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {hosts.map((host, index) => (
            <div
              key={host.name}
              className="group relative"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="bg-card-gradient rounded-3xl p-8 border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {/* Image */}
                  <div className="relative shrink-0">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors duration-300">
                      <img
                        src={host.image}
                        alt={host.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    {/* Glow Effect */}
                    <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                  </div>

                  {/* Content */}
                  <div className="text-center sm:text-left flex-1">
                    <h3 className="font-display text-3xl mb-1 group-hover:text-primary transition-colors">
                      {host.name}
                    </h3>
                    <p className="text-primary text-sm font-medium mb-3">
                      {host.role}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {host.description}
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center justify-center sm:justify-start gap-3">
                      <a
                        href={host.socials.instagram}
                        className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                      <a
                        href={host.socials.twitter}
                        className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HostsSection;

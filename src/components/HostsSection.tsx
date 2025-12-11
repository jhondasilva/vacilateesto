import { Instagram, Youtube, MapPin } from "lucide-react";

const hosts = [
  {
    name: "El Equipo",
    role: "Creadores de Contenido",
    description: "Somos el podcast más viral de Venezuela 🇻🇪 Que nunca se queda quieto, ¡estamos en todo! Viajamos, exploramos y compartimos las historias más increíbles contigo.",
    image: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=600&q=80",
    location: "Venezuela",
    socials: {
      instagram: "https://instagram.com/vacilateesto",
      youtube: "https://youtube.com/@Vacilateestopodcast",
    },
  },
];

const HostsSection = () => {
  return (
    <section id="hosts" className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-0 w-1/2 h-[500px] bg-gradient-to-r from-primary/5 to-transparent rounded-r-full" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Conoce al Equipo</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 text-foreground">
            Quiénes Somos
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Las voces y rostros detrás de las aventuras que te compartimos cada semana.
          </p>
        </div>

        {/* Team Card */}
        <div className="max-w-4xl mx-auto">
          {hosts.map((host) => (
            <div
              key={host.name}
              className="group bg-card rounded-3xl overflow-hidden border border-border shadow-card hover:shadow-elevated transition-all duration-500"
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative aspect-square md:aspect-auto overflow-hidden">
                  <img
                    src={host.image}
                    alt={host.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-card" />
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                    <MapPin className="w-4 h-4 text-primary" />
                    {host.location}
                  </div>
                  
                  <h3 className="font-handwritten text-4xl md:text-5xl mb-2 text-foreground">
                    {host.name}
                  </h3>
                  <p className="text-primary font-semibold text-sm mb-4">
                    {host.role}
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {host.description}
                  </p>

                  {/* Social Links */}
                  <div className="flex items-center gap-3">
                    <a
                      href={host.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a
                      href={host.socials.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      <Youtube className="w-5 h-5" />
                    </a>
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

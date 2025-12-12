import { Instagram, Youtube, Facebook } from "lucide-react";
import jhonDaSilva from "@/assets/jhon-da-silva.jpg";
import juanCarlosMartinez from "@/assets/juan-carlos-martinez.jpg";

const hosts = [
  {
    name: "Jhon Da Silva",
    role: "Co-Host & Co-Fundador",
    description: "Con su estilo único, energía inconfundible y visión creativa, Jhon aporta la chispa que hace de cada contenido una experiencia memorable. Su pasión por contar historias auténticas ha conectado a Vacílate Esto con miles de personas en toda Venezuela y el mundo.",
    image: jhonDaSilva,
    socials: {
      instagram: "https://www.instagram.com/vacilateestopodcast/",
      youtube: "https://www.youtube.com/@Vacilateestopodcast",
      facebook: "https://www.facebook.com/vacilatestopodcast/",
    },
  },
  {
    name: "Juan Carlos Martínez",
    role: "Co-Host & Co-Fundador",
    description: "La mente estratégica y la voz reflexiva de la marca. Juan Carlos combina profundidad, humor e inteligencia en cada contenido, creando el equilibrio perfecto que define el estilo único de Vacílate Esto. Juntos, no se quedan quietos.",
    image: juanCarlosMartinez,
    socials: {
      instagram: "https://www.instagram.com/vacilateestopodcast/",
      youtube: "https://www.youtube.com/@Vacilateestopodcast",
      facebook: "https://www.facebook.com/vacilatestopodcast/",
    },
  },
];

const HostsSection = () => {
  return (
    <section id="hosts" className="py-16 md:py-24 bg-background relative overflow-hidden" aria-labelledby="hosts-title">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent to-transparent pointer-events-none" aria-hidden="true" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <header className="text-center mb-10 md:mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Conoce al Equipo</span>
          <h2 id="hosts-title" className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 mb-4 text-foreground">
            Los Hosts
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto px-2">
            Las voces y rostros detrás de las aventuras que te compartimos cada semana. 
            ¡La marca de Fun Educaitment que nunca se queda quieta!
          </p>
        </header>

        {/* Hosts Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {hosts.map((host, index) => (
            <div
              key={host.name}
              className="group"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-card hover:shadow-elevated transition-all duration-500">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-foreground">
                  <img
                    src={host.image}
                    alt={`${host.name} - ${host.role} de Vacílate Esto Podcast`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                  
                  {/* Name on image */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="font-bold text-3xl text-background mb-1">
                      {host.name}
                    </h3>
                    <p className="text-primary font-semibold text-sm">
                      {host.role}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {host.description}
                  </p>

                  {/* Social Links */}
                  <div className="flex items-center gap-3">
                    <a
                      href={host.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a
                      href={host.socials.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                    <a
                      href={host.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      <Facebook className="w-4 h-4" />
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

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
    <section id="hosts" className="py-20 md:py-28 bg-background relative overflow-hidden" aria-labelledby="hosts-title">
      {/* Studio neon background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-accent/10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <header className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">Conoce al Equipo</span>
          </div>
          <h2 id="hosts-title" className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-foreground tracking-tight">
            Los <span className="text-gradient">Hosts</span>
          </h2>
          <div className="neon-divider w-32 mx-auto mb-5" />
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto px-2 leading-relaxed">
            Las voces y rostros detrás de las aventuras que te compartimos cada semana. 
            ¡La marca de Fun Educaitment que nunca se queda quieta!
          </p>
        </header>

        {/* Hosts Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {hosts.map((host, index) => (
            <div
              key={host.name}
              className="group"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-card hover:shadow-elevated transition-all duration-500 hover:-translate-y-1">
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
                  {/* Neon corner accent */}
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent shadow-[0_0_20px_hsl(var(--accent))]" />

                  {/* Name on image */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="font-bold text-3xl md:text-4xl text-background mb-1 tracking-tight">
                      {host.name}
                    </h3>
                    <p className="text-primary font-semibold text-sm uppercase tracking-wider">
                      {host.role}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
                    {host.description}
                  </p>

                  {/* Social Links */}
                  <div className="flex items-center gap-2.5 pt-4 border-t border-border">
                    <a
                      href={host.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a
                      href={host.socials.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                    <a
                      href={host.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
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

import { Instagram, Youtube, Facebook, Sparkles } from "lucide-react";
import jhonDaSilva from "@/assets/jhon-da-silva.jpg";
import juanCarlosMartinez from "@/assets/juan-carlos-martinez.jpg";
import StickerMarquee from "@/components/StickerMarquee";
import StickerHeader from "@/components/StickerHeader";

const hosts = [
  {
    name: "Jhon Da Silva",
    nickname: "JhonSnacks",
    role: "Co-Host & Co-Fundador",
    description: "Con su estilo único, energía inconfundible y visión creativa, Jhon aporta la chispa que hace de cada contenido una experiencia memorable. Su pasión por contar historias auténticas ha conectado a Vacílate Esto con miles de personas en toda Venezuela y el mundo.",
    image: jhonDaSilva,
    sticker: "★ La Chispa",
    accent: "primary" as const,
    rotate: -1.5,
    socials: {
      instagram: "https://www.instagram.com/vacilateestopodcast/",
      youtube: "https://www.youtube.com/@Vacilateestopodcast",
      facebook: "https://www.facebook.com/vacilatestopodcast/",
    },
  },
  {
    name: "Juan Carlos Martínez",
    nickname: "JuanSofa",
    role: "Co-Host & Co-Fundador",
    description: "La mente estratégica y la voz reflexiva de la marca. Juan Carlos combina profundidad, humor e inteligencia en cada contenido, creando el equilibrio perfecto que define el estilo único de Vacílate Esto. Juntos, no se quedan quietos.",
    image: juanCarlosMartinez,
    sticker: "★ El Estratega",
    accent: "accent" as const,
    rotate: 1.5,
    socials: {
      instagram: "https://www.instagram.com/vacilateestopodcast/",
      youtube: "https://www.youtube.com/@Vacilateestopodcast",
      facebook: "https://www.facebook.com/vacilatestopodcast/",
    },
  },
];

const TICKER = ["LOS HOSTS", "★", "JUANSOFA + JHONSNACKS", "✦", "DESDE 2020", "★", "FUN EDUCAITMENT", "✦"];

const HostsSection = () => {
  return (
    <section id="hosts" className="relative overflow-hidden bg-background pt-0 pb-20 md:pb-28" aria-labelledby="hosts-title" itemScope itemType="https://schema.org/WebPageElement">
      <meta itemProp="name" content="Hosts: JuanSofa y JhonSnacks" />
      <meta itemProp="description" content="Conoce a Juan Carlos Martínez (JuanSofa) y Jhon Da Silva (JhonSnacks), co-fundadores y hosts de Vacílate Esto, el ecosistema de Fun Educaitment más grande de Venezuela." />
      <meta itemProp="url" content="https://www.vacilateesto.com/#hosts" />
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 w-[36rem] h-[36rem] bg-primary/15 rounded-full blur-[140px] -translate-x-1/3 -translate-y-1/3 animate-float" />
        <div className="absolute bottom-0 right-0 w-[36rem] h-[36rem] bg-accent/15 rounded-full blur-[140px] translate-x-1/3 translate-y-1/3 animate-float-delayed" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      <StickerMarquee items={TICKER} variant="dark" className="mb-16 md:mb-20" />

      <div className="container mx-auto px-4 relative z-10">
        <StickerHeader
          badge="Conoce al equipo"
          badgeIcon={Sparkles}
          title="los"
          highlight="hosts"
          description="Las voces y rostros detrás de las aventuras que te compartimos cada semana. ¡La marca de Fun Educaitment que nunca se queda quieta!"
        />

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 max-w-5xl mx-auto">
          {hosts.map((host) => (
            <article
              key={host.name}
              className={`group relative bg-background rounded-3xl overflow-hidden border-2 border-foreground transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 sticker-card-rotate sticker-shadow-lg-${host.accent}`}
              style={{
                transform: `rotate(${host.rotate}deg)`,
              }}
            >
              {/* Sticker badge */}
              <div className="absolute -top-3 left-4 sm:left-6 z-20 bg-foreground text-background rounded-full px-3 py-1.5 -rotate-2 border-2 border-foreground">
                <span className="font-display font-black text-[10px] uppercase tracking-widest">{host.sticker}</span>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden bg-foreground border-b-2 border-foreground">
                <img
                  src={host.image}
                  alt={`${host.name} - ${host.role} de Vacílate Esto Podcast`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
                  <p className="font-display font-black text-[10px] uppercase tracking-widest text-background/70 mb-1">{host.role}</p>
                  <h3 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-background tracking-tight leading-none">
                    {host.name}
                  </h3>
                  <p className="text-accent font-display font-black text-sm uppercase tracking-widest mt-1">@{host.nickname}</p>
                </div>
              </div>

              <div className="p-5 sm:p-6 md:p-8">
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
                  {host.description}
                </p>

                <div className="flex items-center gap-2 pt-5 border-t-2 border-dashed border-border">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mr-1">Sigue:</span>
                  {[
                    { Icon: Instagram, href: host.socials.instagram, label: "Instagram" },
                    { Icon: Youtube, href: host.socials.youtube, label: "YouTube" },
                    { Icon: Facebook, href: host.socials.facebook, label: "Facebook" },
                  ].map(({ Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-10 h-10 rounded-full bg-background border-2 border-foreground flex items-center justify-center text-foreground hover:bg-foreground hover:text-background hover:-translate-y-0.5 transition-all shadow-[3px_3px_0_hsl(var(--foreground))] hover:shadow-[4px_4px_0_hsl(var(--primary))]"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HostsSection;

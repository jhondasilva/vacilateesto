import Logo from "@/components/Logo";
import StickerMarquee from "@/components/StickerMarquee";
import StickerHeader from "@/components/StickerHeader";

const platformsData = [
  { name: "Podcast", platforms: [
    { name: "Spotify", icon: "spotify" }, { name: "YouTube", icon: "youtube" },
    { name: "Pocket Casts", icon: "pocket" }, { name: "Radio", icon: "radio" },
  ]},
  { name: "Short Podcast", platforms: [
    { name: "YouTube", icon: "youtube" }, { name: "Pocket Casts", icon: "pocket" },
    { name: "TikTok", icon: "tiktok" }, { name: "Instagram", icon: "instagram" },
    { name: "Facebook", icon: "facebook" }, { name: "Radio", icon: "radio" },
  ]},
  { name: "Cuentos", platforms: [
    { name: "WhatsApp", icon: "whatsapp" }, { name: "Instagram", icon: "instagram" },
  ]},
  { name: "Newsletter", platforms: [{ name: "Email", icon: "email" }] },
  { name: "Streaming", platforms: [
    { name: "TikTok", icon: "tiktok" }, { name: "Twitch", icon: "twitch" },
  ]},
  { name: "Comiendo", platforms: [
    { name: "TikTok", icon: "tiktok" }, { name: "Instagram", icon: "instagram" },
  ]},
  { name: "Me Traje", platforms: [
    { name: "TikTok", icon: "tiktok" }, { name: "Instagram", icon: "instagram" },
  ]},
  { name: "Eventos", platforms: [{ name: "Eventos", icon: "events" }] },
  { name: "Radio", platforms: [{ name: "Radio", icon: "radio" }] },
  { name: "Juegos", platforms: [
    { name: "App Store", icon: "appstore" }, { name: "Play Store", icon: "playstore" },
  ]},
];

const PlatformIcon = ({ icon, size = "md" }: { icon: string; size?: "sm" | "md" }) => {
  const sizeClass = size === "sm" ? "w-5 h-5" : "w-6 h-6";
  const icons: Record<string, JSX.Element> = {
    spotify: (<svg viewBox="0 0 24 24" className={sizeClass} fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>),
    youtube: (<svg viewBox="0 0 24 24" className={sizeClass} fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>),
    tiktok: (<svg viewBox="0 0 24 24" className={sizeClass} fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>),
    instagram: (<svg viewBox="0 0 24 24" className={sizeClass} fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>),
    facebook: (<svg viewBox="0 0 24 24" className={sizeClass} fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>),
    email: (<svg viewBox="0 0 24 24" className={sizeClass} fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>),
    twitch: (<svg viewBox="0 0 24 24" className={sizeClass} fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>),
    pocket: (<svg viewBox="0 0 24 24" className={sizeClass} fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>),
    events: (<svg viewBox="0 0 24 24" className={sizeClass} fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>),
    radio: (<svg viewBox="0 0 24 24" className={sizeClass} fill="currentColor"><path d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h-2v2H4V8h16v4z"/></svg>),
    appstore: (<svg viewBox="0 0 24 24" className={sizeClass} fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>),
    playstore: (<svg viewBox="0 0 24 24" className={sizeClass} fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>),
    whatsapp: (<svg viewBox="0 0 24 24" className={sizeClass} fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>),
  };
  return icons[icon] || <div className={`${sizeClass} rounded-full bg-muted`} />;
};

const TICKER = ["DISTRIBUCIÓN", "★", "10 CANALES", "✦", "MULTIPLATAFORMA", "★", "GLOBAL", "✦"];

const PlatformsSection = () => {
  return (
    <section id="plataformas" className="relative overflow-hidden bg-foreground text-background pt-0 pb-20 md:pb-28" aria-labelledby="platforms-title" itemScope itemType="https://schema.org/WebPageElement">
      <meta itemProp="name" content="Plataformas donde escuchar Vacílate Esto" />
      <meta itemProp="description" content="Escucha y mira Vacílate Esto gratis en Spotify, YouTube, Apple Podcasts, TikTok, Twitch, Instagram y FM Center (radio en Venezuela)." />
      <meta itemProp="url" content="https://www.vacilateesto.com/#plataformas" />
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-[36rem] h-[36rem] bg-primary/25 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[36rem] h-[36rem] bg-accent/25 rounded-full blur-[140px]" />
      </div>

      <StickerMarquee items={TICKER} variant="primary" className="mb-16 md:mb-20" />

      <div className="container mx-auto px-4 relative z-10">
        <StickerHeader
        titleId="platforms-title"
          badge="Plataformas"
          badgeVariant="outline"
          title="dónde nos"
          highlight="encontrás"
          description="Una marca de Fun Educaitment presente en múltiples plataformas."
          onDark
        />

        {/* Logo center */}
        <div className="flex justify-center mb-4">
          <div className="flex flex-col items-center">
            <div className="bg-background border-2 border-background rounded-3xl p-6 shadow-[8px_8px_0_hsl(var(--primary))]">
              <Logo size="lg" />
            </div>
            <div className="w-1 h-10 bg-gradient-to-b from-primary to-accent" />
          </div>
        </div>

        {/* Desktop tree */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-10 gap-2">
            {platformsData.map((item, idx) => (
              <div key={item.name} className="flex flex-col items-center">
                <div
                  className={`rounded-full px-3 py-1.5 mb-0 border-2 border-background ${idx % 2 === 0 ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}
                  style={{ transform: `rotate(${(idx % 2 === 0 ? -1 : 1) * 2}deg)` }}
                >
                  <span className="font-display font-black text-[9px] uppercase tracking-widest whitespace-nowrap">
                    {item.name}
                  </span>
                </div>
                <div className="w-2 h-2 rounded-full bg-accent my-2 shadow-[0_0_10px_hsl(var(--accent))]" />
                <div
                  className="w-0.5 bg-background/30"
                  style={{ height: `${item.platforms.length * 48 + 8}px` }}
                />
                <div className="flex flex-col items-center gap-2 mt-2">
                  {item.platforms.map((platform) => (
                    <div
                      key={platform.name}
                      className="w-10 h-10 rounded-full bg-background text-foreground flex items-center justify-center hover:scale-110 hover:rotate-6 transition-all duration-300 cursor-pointer border-2 border-background shadow-[3px_3px_0_hsl(var(--primary))]"
                      title={platform.name}
                    >
                      <PlatformIcon icon={platform.icon} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tablet */}
        <div className="hidden md:block lg:hidden">
          <div className="grid grid-cols-5 gap-4">
            {platformsData.map((item, idx) => (
              <div key={item.name} className="flex flex-col items-center">
                <div
                  className={`rounded-full px-2 py-1 mb-2 border-2 border-background ${idx % 2 === 0 ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}
                >
                  <span className="font-display font-black text-[8px] uppercase tracking-widest whitespace-nowrap">
                    {item.name}
                  </span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-accent mb-1" />
                <div className="w-0.5 h-8 bg-background/30 mb-2" />
                <div className="flex flex-col items-center gap-1.5">
                  {item.platforms.map((platform) => (
                    <div key={platform.name} className="w-8 h-8 rounded-full bg-background text-foreground flex items-center justify-center border-2 border-background" title={platform.name}>
                      <PlatformIcon icon={platform.icon} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden mt-8">
          <div className="grid grid-cols-2 gap-3">
            {platformsData.map((item, idx) => (
              <div
                key={item.name}
                className="flex flex-col items-center bg-background text-foreground rounded-2xl p-3 border-2 border-background shadow-[4px_4px_0_hsl(var(--primary))]"
                style={{ transform: `rotate(${(idx % 2 === 0 ? -1 : 1) * 1}deg)` }}
              >
                <div className={`flex items-center gap-1 mb-2 px-2 py-0.5 rounded-full border-2 border-foreground ${idx % 2 === 0 ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
                  <span className="font-display font-black text-[9px] uppercase tracking-widest">{item.name}</span>
                </div>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {item.platforms.map((platform) => (
                    <div key={platform.name} className="w-7 h-7 rounded-full bg-background text-foreground flex items-center justify-center border-2 border-foreground" title={platform.name}>
                      <PlatformIcon icon={platform.icon} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformsSection;

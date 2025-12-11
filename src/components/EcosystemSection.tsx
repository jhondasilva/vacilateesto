import Logo from "@/components/Logo";

const ecosystemItems = [
  {
    name: "Podcast",
    platforms: [
      { name: "Spotify", icon: "spotify", color: "#1DB954" },
      { name: "Apple Podcasts", icon: "apple", color: "#9933CC" },
      { name: "YouTube", icon: "youtube", color: "#FF0000" },
      { name: "Pocket Casts", icon: "pocket", color: "#F43E37" },
    ],
  },
  {
    name: "Short Podcast",
    platforms: [
      { name: "TikTok", icon: "tiktok", color: "#000000" },
      { name: "Instagram", icon: "instagram", color: "#E4405F" },
      { name: "Facebook", icon: "facebook", color: "#1877F2" },
      { name: "Spotify", icon: "spotify", color: "#1DB954" },
      { name: "Apple Podcasts", icon: "apple", color: "#9933CC" },
      { name: "YouTube", icon: "youtube", color: "#FF0000" },
    ],
  },
  {
    name: "Cuentos",
    platforms: [
      { name: "Telegram", icon: "telegram", color: "#0088CC" },
    ],
  },
  {
    name: "Newsletter",
    platforms: [
      { name: "Email", icon: "email", color: "#6366F1" },
    ],
  },
  {
    name: "Streaming",
    platforms: [
      { name: "TikTok", icon: "tiktok", color: "#000000" },
      { name: "Facebook", icon: "facebook", color: "#1877F2" },
      { name: "YouTube", icon: "youtube", color: "#FF0000" },
      { name: "Twitch", icon: "twitch", color: "#9146FF" },
    ],
  },
  {
    name: "Comiendo",
    platforms: [
      { name: "TikTok", icon: "tiktok", color: "#000000" },
      { name: "Instagram", icon: "instagram", color: "#E4405F" },
    ],
  },
  {
    name: "Eventos",
    platforms: [
      { name: "Eventos", icon: "events", color: "#FF6B6B" },
    ],
  },
  {
    name: "Radio",
    platforms: [
      { name: "Radio", icon: "radio", color: "#7DE8E8" },
    ],
  },
  {
    name: "Juegos",
    platforms: [
      { name: "App Store", icon: "appstore", color: "#0D96F6" },
      { name: "Play Store", icon: "playstore", color: "#34A853" },
    ],
  },
];

const PlatformIcon = ({ icon, color }: { icon: string; color: string }) => {
  const icons: Record<string, JSX.Element> = {
    spotify: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill={color}>
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
    apple: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill={color}>
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
    youtube: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill={color}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    tiktok: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    ),
    instagram: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill={color}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
    facebook: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill={color}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    telegram: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill={color}>
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
    email: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill={color}>
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    ),
    twitch: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill={color}>
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
      </svg>
    ),
    pocket: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill={color}>
        <circle cx="12" cy="12" r="10"/>
      </svg>
    ),
    events: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill={color}>
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
      </svg>
    ),
    radio: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill={color}>
        <path d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h-2v2H4V8h16v4z"/>
      </svg>
    ),
    appstore: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill={color}>
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
    playstore: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill={color}>
        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
      </svg>
    ),
  };

  return icons[icon] || <div className="w-8 h-8 rounded-full bg-muted" />;
};

const EcosystemSection = () => {
  return (
    <section className="py-24 bg-foreground relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Descubre Nuestro Ecosistema
          </h2>
          <p className="text-background/70 text-lg max-w-xl mx-auto">
            Una marca de Fun Educaitment presente en múltiples plataformas
          </p>
        </div>

        {/* Logo Center */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-col items-center">
            <Logo size="lg" className="brightness-0 invert" />
            <div className="w-0.5 h-12 bg-primary mt-4" />
          </div>
        </div>

        {/* Ecosystem Bar */}
        <div className="relative">
          {/* Main Bar */}
          <div className="bg-primary rounded-full py-4 px-6 flex items-center justify-center overflow-x-auto">
            <div className="flex items-center gap-4 md:gap-8 min-w-max">
              {ecosystemItems.map((item) => (
                <div key={item.name} className="text-center">
                  <span className="text-primary-foreground font-bold text-xs md:text-sm uppercase tracking-wide whitespace-nowrap">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Connection Lines and Platforms */}
          <div className="mt-8 grid grid-cols-3 md:grid-cols-9 gap-4">
            {ecosystemItems.map((item) => (
              <div key={item.name} className="flex flex-col items-center">
                {/* Connection dot */}
                <div className="w-2 h-2 rounded-full bg-[#7DE8E8] mb-2" />
                <div className="w-0.5 h-6 bg-background/30 mb-4" />
                
                {/* Platforms */}
                <div className="flex flex-col items-center gap-3">
                  {item.platforms.map((platform) => (
                    <div
                      key={platform.name}
                      className="w-12 h-12 rounded-full bg-background flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg"
                      title={platform.name}
                    >
                      <PlatformIcon icon={platform.icon} color={platform.color} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Simplified View */}
        <div className="mt-16 md:hidden">
          <div className="grid grid-cols-2 gap-4">
            {ecosystemItems.map((item) => (
              <div key={item.name} className="bg-background/10 rounded-2xl p-4">
                <h4 className="text-primary font-bold text-sm mb-3 text-center">{item.name}</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {item.platforms.map((platform) => (
                    <div
                      key={platform.name}
                      className="w-10 h-10 rounded-full bg-background flex items-center justify-center"
                      title={platform.name}
                    >
                      <div className="scale-75">
                        <PlatformIcon icon={platform.icon} color={platform.color} />
                      </div>
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

export default EcosystemSection;

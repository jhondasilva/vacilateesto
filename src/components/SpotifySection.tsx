const SpotifySection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Escúchanos en Spotify
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Todos nuestros episodios disponibles en tu plataforma favorita
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto px-2">
          <div className="rounded-xl overflow-hidden shadow-elevated bg-card">
            <iframe
              src="https://open.spotify.com/embed/show/2b2AeZVRxEFkNy1KKYkQG1?utm_source=generator"
              width="100%"
              height="352"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Player - Podcast"
              className="w-full border-0"
              style={{ minHeight: "352px" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpotifySection;

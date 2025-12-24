import { Trophy, Users, Eye, Heart, Share2, MessageCircle, Bookmark, TrendingUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoGuerraComerciales from "@/assets/logo-guerra-comerciales.png";

const GuerraComercialesSection = () => {
  const stats = [
    { icon: Eye, value: "1.35M", label: "Impresiones totales" },
    { icon: Users, value: "618K", label: "Cuentas alcanzadas" },
    { icon: Heart, value: "40,773", label: "Votos totales" },
    { icon: TrendingUp, value: "27.95%", label: "Engagement máximo" },
  ];

  const instagramStats = [
    { icon: Heart, value: "18.4K", label: "Likes" },
    { icon: Share2, value: "6.1K", label: "Compartidos" },
    { icon: Bookmark, value: "2.4K", label: "Guardados" },
    { icon: MessageCircle, value: "4.3K", label: "Comentarios" },
  ];

  const tiktokStats = [
    { icon: Heart, value: "11.4K", label: "Likes" },
    { icon: Share2, value: "1.4K", label: "Compartidos" },
    { icon: Bookmark, value: "1.5K", label: "Guardados" },
    { icon: MessageCircle, value: "1.3K", label: "Comentarios" },
  ];

  return (
    <section id="guerra-comerciales" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header con Logo */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Trophy className="w-4 h-4" />
            Proyecto Especial 2025
          </div>
          <img 
            src={logoGuerraComerciales} 
            alt="Campeonato de Comerciales de Venezuela" 
            className="max-w-md md:max-w-lg mx-auto mb-6"
          />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            El campeonato nacional que enfrentó a los comerciales más icónicos de Venezuela 
            en un torneo estilo Mundial de Fútbol durante un mes completo.
          </p>
        </div>

        {/* Los Finalistas - Videos */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Campeón - Covencaucho */}
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl p-6 border-2 border-primary relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              Campeón
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">🏆 Covencaucho</h3>
            <div className="aspect-video rounded-xl overflow-hidden mb-4">
              <iframe
                src="https://www.youtube.com/embed/bP3VsF2LUyg"
                title="Comercial Covencaucho - Campeón Guerra de Comerciales"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              El comercial que conquistó a Venezuela con su jingle icónico y la movilización masiva de su comunidad.
            </p>
          </div>

          {/* Subcampeón - Plumrose */}
          <div className="bg-gradient-to-br from-muted/50 to-muted/20 rounded-3xl p-6 border border-border/50 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-muted-foreground/20 text-muted-foreground px-3 py-1 rounded-full text-sm font-bold">
              🥈 Subcampeón
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Plumrose</h3>
            <div className="aspect-video rounded-xl overflow-hidden mb-4">
              <iframe
                src="https://www.youtube.com/embed/WkNxe8ClC5s"
                title="Comercial Plumrose - Subcampeón Guerra de Comerciales"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              El emotivo comercial navideño que llegó a la Gran Final representando la nostalgia venezolana.
            </p>
          </div>
        </div>

        {/* Resultado Final */}
        <div className="bg-card rounded-2xl p-6 mb-12 text-center border border-border/50">
          <p className="text-muted-foreground mb-2">La Gran Final</p>
          <p className="text-2xl md:text-3xl font-bold text-foreground">
            <span className="text-primary">Covencaucho</span> venció a <span className="text-muted-foreground">Plumrose</span>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Superando a gigantes como Polar Ice, Harina P.A.N., Nestlé y M.A.S.
          </p>
        </div>

        {/* Stats principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl p-6 text-center border border-border/50 hover:border-primary/50 transition-colors"
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Cronología */}
        <div className="bg-card rounded-3xl p-8 mb-12 border border-border/50">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Cronología del Torneo</h3>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { date: "21 Nov", phase: "Lanzamiento", desc: "Cuadro de competencia" },
              { date: "22 Nov - 5 Dic", phase: "Rondas Iniciales", desc: "Duelos grupales" },
              { date: "6 - 15 Dic", phase: "Octavos y Cuartos", desc: "Mayor debate" },
              { date: "16 - 18 Dic", phase: "Semifinales", desc: "Duelos de alto perfil" },
              { date: "21 Dic", phase: "Gran Final", desc: "Coven vs Plumrose" },
            ].map((item, index) => (
              <div key={index} className="text-center p-4 bg-muted/50 rounded-xl">
                <p className="text-xs text-primary font-medium mb-1">{item.date}</p>
                <p className="font-bold text-foreground text-sm mb-1">{item.phase}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Resultados por plataforma */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Instagram */}
          <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-3xl p-8 border border-pink-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-bold text-foreground">Instagram</h4>
                <p className="text-sm text-muted-foreground">31.2K interacciones totales</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {instagramStats.map((stat, index) => (
                <div key={index} className="bg-background/50 rounded-xl p-4 text-center">
                  <stat.icon className="w-5 h-5 text-pink-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* TikTok */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-pink-500/10 rounded-3xl p-8 border border-cyan-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-pink-500 to-red-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-bold text-foreground">TikTok</h4>
                <p className="text-sm text-muted-foreground">11.4K interacciones totales</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {tiktokStats.map((stat, index) => (
                <div key={index} className="bg-background/50 rounded-xl p-4 text-center">
                  <stat.icon className="w-5 h-5 text-cyan-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conclusiones y Descarga */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground max-w-3xl mx-auto mb-8">
            El torneo logró una visibilidad sin precedentes para Vacílate Esto, alcanzando a más de 
            <span className="text-primary font-bold"> 800,000 personas únicas</span> entre ambas plataformas. 
            TikTok funcionó como el "pulmón de alcance" mientras Instagram fue la "cancha de juego" 
            donde se consolidó la comunidad.
          </p>
          <Button asChild size="lg" className="gap-2">
            <a 
              href="/press/Reporte_Guerra_de_Comerciales_2025.pdf" 
              download="Reporte_Guerra_de_Comerciales_2025.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="w-5 h-5" />
              Descargar Reporte Completo
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GuerraComercialesSection;
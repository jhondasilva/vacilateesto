import { Crown, Medal, Mic2, Radio, Clock, Calendar, Target, Sparkles } from "lucide-react";

const planes = [
  {
    nombre: "Bombo de Oro",
    icon: Crown,
    color: "bg-primary",
    textColor: "text-primary-foreground",
    shadow: "sticker-shadow-lg-primary",
    items: [
      "10 Piezas con Product Placement",
      "6 piezas personalizadas",
      "7 historias (Stories IG)",
      "1 show en vivo semanal",
      "1 podcast",
      "Presencia de logo en comunicaciones oficiales",
    ],
  },
  {
    nombre: "Bombo de Plata",
    icon: Medal,
    color: "bg-accent",
    textColor: "text-accent-foreground",
    shadow: "sticker-shadow-lg-accent",
    items: [
      "6 Piezas con Product Placement",
      "2 piezas personalizadas",
      "2 historias (Stories IG)",
      "1 show en vivo semanal",
      "1 podcast",
      "Presencia de logo en comunicaciones oficiales",
    ],
  },
];

const incluyeTodos = [
  {
    icon: Clock,
    title: "Duración de la mención",
    desc: "20 segundos aproximadamente por mención integrada al contenido.",
  },
  {
    icon: Calendar,
    title: "Fases de publicación",
    desc: "Fase pre-mundial (mayo) y fase mundial (junio, modo cobertura). Coordinamos contigo el día de publicación.",
  },
  {
    icon: Target,
    title: "Visibilidad estratégica",
    desc: "Menciones en momentos épicos de celebración y cobertura de eventos relevantes. Ajustamos el contenido a tu rubro y objetivos.",
  },
  {
    icon: Radio,
    title: "Radio Hot Sport · FM Center",
    desc: "6 cuentos diarios en radio como presentación y despedida en Hot Sport (FM Center).",
  },
];

const PlanesParticipacion = () => {
  return (
    <section
      id="planes"
      className="bg-secondary/40 border-y-2 border-foreground scroll-mt-24"
      aria-labelledby="planes-title"
    >
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <span className="inline-block bg-foreground text-background px-3 py-1 rounded-full text-xs font-display font-black uppercase tracking-widest border-2 border-foreground">
          <Sparkles className="w-3.5 h-3.5 inline mr-1" /> Planes de Participación
        </span>
        <h2
          id="planes-title"
          className="mt-4 font-display font-black text-3xl sm:text-5xl uppercase leading-tight"
        >
          ¿Qué incluye tu marca?
        </h2>
        <p className="mt-3 text-muted-foreground max-w-3xl">
          Dos planes pensados para activar tu marca dentro del ecosistema Vacílate El Fútbol 2026.
          Cada uno combina piezas en redes, historias, show en vivo, podcast y radio FM.
        </p>

        {/* Planes */}
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          {planes.map((p) => (
            <div
              key={p.nombre}
              className={`bg-card rounded-3xl p-6 sm:p-8 border-2 border-foreground ${p.shadow}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl ${p.color} ${p.textColor} flex items-center justify-center border-2 border-foreground`}
                >
                  <p.icon className="w-7 h-7" />
                </div>
                <div>
                  <span className="block text-xs font-display font-black uppercase tracking-widest text-muted-foreground">
                    Plan
                  </span>
                  <h3 className="font-display font-black text-2xl sm:text-3xl uppercase leading-none">
                    {p.nombre}
                  </h3>
                </div>
              </div>

              <ul className="mt-6 space-y-3">
                {p.items.map((it) => (
                  <li key={it} className="flex items-start gap-3">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-foreground shrink-0" />
                    <span className="text-sm sm:text-base text-foreground leading-snug">{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Incluye en todos los planes */}
        <div className="mt-10">
          <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight mb-5">
            Incluido en ambos planes
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {incluyeTodos.map((b) => (
              <div
                key={b.title}
                className="bg-card rounded-3xl p-6 border-2 border-foreground sticker-shadow-foreground"
              >
                <div className="w-12 h-12 rounded-2xl bg-foreground text-background flex items-center justify-center border-2 border-foreground">
                  <b.icon className="w-6 h-6" />
                </div>
                <h4 className="mt-4 font-display font-black text-base uppercase leading-tight">
                  {b.title}
                </h4>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ejemplo de mención */}
        <div className="mt-10 bg-foreground text-background rounded-3xl p-6 sm:p-8 border-2 border-foreground">
          <div className="flex items-center gap-2 text-xs font-display font-black uppercase tracking-widest text-background/70">
            <Mic2 className="w-4 h-4" /> Ejemplo de mención
          </div>
          <p className="mt-3 font-display text-lg sm:text-xl md:text-2xl leading-snug italic">
            "Porque estamos fuera de casa, pero nada mejor que celebrarlo con [tu marca]…"
          </p>
          <p className="mt-3 text-sm text-background/70">
            Adaptamos el guión a tu rubro y al momento del partido para que la mención se sienta
            natural y memorable.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlanesParticipacion;
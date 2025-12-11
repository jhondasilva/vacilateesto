const scheduleData = [
  {
    day: "Lunes",
    events: [
      { time: "8:00 AM", title: "Short Podcast", platform: "Varios" },
      { time: "12:00 PM", title: "Cuentos", platform: "WS/Insta/Threads" },
    ],
  },
  {
    day: "Martes",
    events: [
      { time: "8:00 AM", title: "Short Podcast", platform: "Varios" },
      { time: "10:00 AM", title: "Streaming", platform: "Twitch" },
      { time: "12:00 PM", title: "Cuentos", platform: "WS/Insta/Threads" },
      { time: "6:00 PM", title: "Comiendo", platform: "TikTok/Instagram" },
    ],
  },
  {
    day: "Miércoles",
    events: [
      { time: "8:00 AM", title: "Short Podcast", platform: "Varios" },
      { time: "12:00 PM", title: "Cuentos", platform: "WS/Insta/Threads" },
      { time: "12:00 PM", title: "Newsletter", platform: "Email" },
    ],
  },
  {
    day: "Jueves",
    events: [
      { time: "8:00 AM", title: "Short Podcast", platform: "Varios" },
      { time: "12:00 PM", title: "Cuentos", platform: "WS/Insta/Threads" },
      { time: "8:00 PM", title: "Podcast", platform: "YouTube/Spotify" },
    ],
  },
  {
    day: "Viernes",
    events: [
      { time: "8:00 AM", title: "Short Podcast", platform: "Varios" },
      { time: "12:00 PM", title: "Cuentos", platform: "WS/Insta/Threads" },
      { time: "6:00 PM", title: "Me Traje", platform: "TikTok/Instagram" },
    ],
  },
  {
    day: "Sábado",
    events: [
      { time: "8:00 AM", title: "Short Podcast", platform: "Varios" },
      { time: "12:00 PM", title: "Cuentos", platform: "WS/Insta/Threads" },
      { time: "6:00 PM", title: "Podcast Radio", platform: "Circuito Líder" },
      { time: "8:00 PM", title: "Eventos", platform: "Eventos" },
    ],
  },
  {
    day: "Domingo",
    events: [
      { time: "10:00 AM", title: "Short Podcast", platform: "Varios" },
      { time: "12:00 PM", title: "Cuentos", platform: "WS/Insta/Threads" },
      { time: "6:00 PM", title: "Podcast Radio", platform: "Circuito Líder" },
      { time: "10:00 PM", title: "Podcast TV", platform: "Televen" },
    ],
  },
];

const AgendaSection = () => {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#7DE8E8] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Nuestra <span className="text-primary">Agenda</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">
            Programa semanal de contenido en todas las plataformas
          </p>
        </div>

        {/* Weekly Schedule Grid */}
        <div className="max-w-6xl mx-auto">
          {/* Desktop/Tablet View */}
          <div className="hidden md:grid grid-cols-7 gap-3">
            {scheduleData.map((dayData) => (
              <div
                key={dayData.day}
                className="bg-muted/30 rounded-xl p-4 border border-border/50 hover:border-primary/50 transition-all duration-300"
              >
                <h3 className="text-center font-bold mb-4 text-sm text-primary bg-primary/10 rounded-full py-2">
                  {dayData.day}
                </h3>
                <div className="space-y-3 min-h-[120px]">
                  {dayData.events.map((event, idx) => (
                    <div
                      key={idx}
                      className="bg-background rounded-lg p-3 shadow-sm border border-border/30"
                    >
                      <p className="text-[10px] text-primary font-semibold">
                        {event.time}
                      </p>
                      <p className="text-xs font-bold text-foreground leading-tight mt-1">
                        {event.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {event.platform}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View - Horizontal Scroll */}
          <div className="md:hidden overflow-x-auto pb-4">
            <div className="flex gap-3 min-w-max px-2">
              {scheduleData.map((dayData) => (
                <div
                  key={dayData.day}
                  className="bg-muted/30 rounded-xl p-4 border border-border/50 w-36 flex-shrink-0"
                >
                  <h3 className="text-center font-bold mb-3 text-xs text-primary bg-primary/10 rounded-full py-1.5">
                    {dayData.day}
                  </h3>
                  <div className="space-y-2">
                    {dayData.events.map((event, idx) => (
                      <div
                        key={idx}
                        className="bg-background rounded-lg p-2.5 shadow-sm border border-border/30"
                      >
                        <p className="text-[9px] text-primary font-semibold">
                          {event.time}
                        </p>
                        <p className="text-[11px] font-bold text-foreground leading-tight mt-0.5">
                          {event.title}
                        </p>
                        <p className="text-[9px] text-muted-foreground mt-0.5">
                          {event.platform}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Note */}
        <p className="text-center text-muted-foreground text-sm mt-8">
          * Los horarios están en hora Venezuela (VET)
        </p>
      </div>
    </section>
  );
};

export default AgendaSection;

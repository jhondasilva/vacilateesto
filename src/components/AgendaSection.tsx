import { useState } from "react";

const scheduleData = [
  {
    day: "Lunes",
    events: [
      { time: "8:00 PM", title: "Podcast en Vivo", platform: "YouTube" },
    ],
  },
  {
    day: "Martes",
    events: [
      { time: "7:00 PM", title: "Streaming", platform: "Twitch" },
    ],
  },
  {
    day: "Miércoles",
    events: [
      { time: "8:00 PM", title: "Podcast en Vivo", platform: "YouTube" },
    ],
  },
  {
    day: "Jueves",
    events: [
      { time: "7:00 PM", title: "Comiendo", platform: "TikTok" },
    ],
  },
  {
    day: "Viernes",
    events: [
      { time: "8:00 PM", title: "Streaming", platform: "Twitch" },
    ],
  },
  {
    day: "Sábado",
    events: [
      { time: "12:00 PM", title: "Me Traje", platform: "Instagram" },
    ],
  },
  {
    day: "Domingo",
    events: [
      { time: "6:00 PM", title: "Cuentos", platform: "WhatsApp" },
    ],
  },
];

const AgendaSection = () => {
  const [activeDay, setActiveDay] = useState("Lunes");

  const activeEvents = scheduleData.find((d) => d.day === activeDay)?.events || [];

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

        {/* Days Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {scheduleData.map((item) => (
            <button
              key={item.day}
              onClick={() => setActiveDay(item.day)}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                activeDay === item.day
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {item.day}
            </button>
          ))}
        </div>

        {/* Schedule Display */}
        <div className="max-w-4xl mx-auto">
          {/* Desktop View - Full Week */}
          <div className="hidden lg:grid grid-cols-7 gap-3">
            {scheduleData.map((dayData) => (
              <div
                key={dayData.day}
                className={`rounded-xl p-4 transition-all duration-300 ${
                  activeDay === dayData.day
                    ? "bg-primary/10 border-2 border-primary"
                    : "bg-muted/50 border-2 border-transparent"
                }`}
              >
                <h3
                  className={`text-center font-bold mb-3 text-sm ${
                    activeDay === dayData.day ? "text-primary" : "text-foreground"
                  }`}
                >
                  {dayData.day}
                </h3>
                <div className="space-y-2">
                  {dayData.events.map((event, idx) => (
                    <div
                      key={idx}
                      className="bg-background rounded-lg p-3 shadow-sm"
                    >
                      <p className="text-[10px] text-muted-foreground font-medium">
                        {event.time}
                      </p>
                      <p className="text-xs font-bold text-foreground leading-tight">
                        {event.title}
                      </p>
                      <p className="text-[10px] text-primary mt-1">
                        {event.platform}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile/Tablet View - Active Day */}
          <div className="lg:hidden">
            <div className="bg-primary/10 rounded-2xl p-6 border-2 border-primary">
              <h3 className="text-center font-bold text-xl text-primary mb-6">
                {activeDay}
              </h3>
              <div className="space-y-4">
                {activeEvents.map((event, idx) => (
                  <div
                    key={idx}
                    className="bg-background rounded-xl p-5 shadow-md flex items-center gap-4"
                  >
                    <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center">
                      <span className="text-primary font-bold text-sm text-center leading-tight">
                        {event.time}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-lg">
                        {event.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        En {event.platform}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
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

import { Calendar } from "lucide-react";
import StickerMarquee from "@/components/StickerMarquee";
import StickerHeader from "@/components/StickerHeader";

const scheduleData = [
  { day: "Lun", events: [
    { time: "8:00 AM", title: "Short Podcast", platform: "Varios" },
    { time: "12:00 PM", title: "Cuentos", platform: "Varios" },
    { time: "3:00 PM", title: "Radio", platform: "Circuito Líder" },
  ]},
  { day: "Mar", events: [
    { time: "8:00 AM", title: "Short Podcast", platform: "Varios" },
    { time: "10:00 AM", title: "Streaming", platform: "Twitch" },
    { time: "12:00 PM", title: "Cuentos", platform: "Varios" },
    { time: "3:00 PM", title: "Radio", platform: "Circuito Líder" },
  ]},
  { day: "Mié", events: [
    { time: "8:00 AM", title: "Short Podcast", platform: "Varios" },
    { time: "12:00 PM", title: "Cuentos", platform: "Varios" },
    { time: "12:00 PM", title: "Newsletter", platform: "Email" },
    { time: "3:00 PM", title: "Radio", platform: "Circuito Líder" },
  ]},
  { day: "Jue", events: [
    { time: "8:00 AM", title: "Short Podcast", platform: "Varios" },
    { time: "12:00 PM", title: "Cuentos", platform: "Varios" },
    { time: "3:00 PM", title: "Radio", platform: "Circuito Líder" },
    { time: "8:00 PM", title: "Podcast", platform: "YouTube/Spotify" },
  ]},
  { day: "Vie", events: [
    { time: "8:00 AM", title: "Short Podcast", platform: "Varios" },
    { time: "12:00 PM", title: "Cuentos", platform: "Varios" },
    { time: "3:00 PM", title: "Radio", platform: "Circuito Líder" },
  ]},
  { day: "Sáb", events: [
    { time: "8:00 AM", title: "Short Podcast", platform: "Varios" },
    { time: "12:00 PM", title: "Cuentos", platform: "Varios" },
    { time: "6:00 PM", title: "Podcast Radio", platform: "Circuito Líder" },
  ]},
  { day: "Dom", events: [
    { time: "10:00 AM", title: "Short Podcast", platform: "Varios" },
    { time: "12:00 PM", title: "Cuentos", platform: "Varios" },
    { time: "6:00 PM", title: "Podcast Radio", platform: "Circuito Líder" },
    { time: "10:00 PM", title: "Podcast TV", platform: "Televen" },
  ]},
];

const TICKER = ["PROGRAMACIÓN SEMANAL", "★", "7 DÍAS", "✦", "MULTIPLATAFORMA", "★", "NUNCA PARAMOS", "✦"];

const AgendaSection = () => {
  return (
    <section className="relative overflow-hidden bg-background pt-0 pb-20 md:pb-28" aria-labelledby="agenda-title">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 w-[28rem] h-[28rem] bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-20 right-10 w-[32rem] h-[32rem] bg-accent/10 rounded-full blur-[140px]" />
      </div>

      <StickerMarquee items={TICKER} variant="dark" className="mb-16 md:mb-20" />

      <div className="container mx-auto px-4 relative z-10">
        <StickerHeader
          badge="Calendario"
          badgeIcon={Calendar}
          title="nuestra"
          highlight="agenda"
          description="Programación semanal de contenido en todas las plataformas."
        />

        <div className="max-w-6xl mx-auto">
          {/* Desktop */}
          <div className="hidden md:grid grid-cols-7 gap-3">
            {scheduleData.map((dayData, idx) => (
              <div
                key={dayData.day}
                className="bg-background rounded-2xl p-4 border-2 border-foreground"
                style={{
                  boxShadow: `4px 4px 0 hsl(var(--${idx % 2 === 0 ? "primary" : "accent"}))`,
                  transform: `rotate(${(idx % 3 === 0 ? -1 : idx % 3 === 1 ? 0 : 1) * 0.8}deg)`,
                }}
              >
                <h3 className={`text-center font-display font-black mb-4 text-xs uppercase tracking-widest rounded-full py-2 border-2 border-foreground ${idx % 2 === 0 ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
                  {dayData.day}
                </h3>
                <div className="space-y-2 min-h-[120px]">
                  {dayData.events.map((event, eIdx) => (
                    <div key={eIdx} className="bg-background rounded-xl p-2.5 border-2 border-foreground">
                      <p className="text-[9px] text-foreground font-display font-black uppercase tracking-widest">{event.time}</p>
                      <p className="text-xs font-bold text-foreground leading-tight mt-1">{event.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">{event.platform}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile horizontal scroll */}
          <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-3 min-w-max">
              {scheduleData.map((dayData, idx) => (
                <article
                  key={dayData.day}
                  className="bg-background rounded-2xl p-4 border-2 border-foreground w-40 flex-shrink-0"
                  style={{ boxShadow: `4px 4px 0 hsl(var(--${idx % 2 === 0 ? "primary" : "accent"}))` }}
                >
                  <h3 className={`text-center font-display font-black mb-3 text-xs uppercase tracking-widest rounded-full py-1.5 border-2 border-foreground ${idx % 2 === 0 ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
                    {dayData.day}
                  </h3>
                  <ul className="space-y-2">
                    {dayData.events.map((event, eIdx) => (
                      <li key={eIdx} className="bg-background rounded-xl p-2.5 border-2 border-foreground">
                        <p className="text-[9px] text-foreground font-display font-black uppercase tracking-widest">{event.time}</p>
                        <p className="text-[11px] font-bold text-foreground leading-tight mt-0.5">{event.title}</p>
                        <p className="text-[9px] text-muted-foreground mt-0.5">{event.platform}</p>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-muted-foreground text-xs mt-10 font-bold uppercase tracking-widest">
          ★ Hora Venezuela (VET) ★
        </p>
      </div>
    </section>
  );
};

export default AgendaSection;

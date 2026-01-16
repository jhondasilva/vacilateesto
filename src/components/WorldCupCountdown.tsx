import { useState, useEffect } from "react";
import { Clock, Calendar, Flame } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const WorldCupCountdown = () => {
  // FIFA World Cup 2026 starts June 11, 2026
  const targetDate = new Date("2026-06-11T00:00:00-05:00").getTime();

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { value: timeLeft.days, label: "Días" },
    { value: timeLeft.hours, label: "Horas" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Seg" },
  ];

  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00d9ff]/20 via-[#9000ff]/20 to-[#ee506f]/20 rounded-xl blur-lg" />
      
      <div className="relative bg-black/30 backdrop-blur-md rounded-xl border border-white/20 px-5 py-4 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-[#ee506f] animate-pulse" />
          <span className="text-xs font-bold text-white/90 uppercase tracking-wider">
            Cuenta Regresiva
          </span>
          <Flame className="w-4 h-4 text-[#ee506f] animate-pulse" />
        </div>

        {/* Countdown Grid */}
        <div className="grid grid-cols-4 gap-2">
          {timeUnits.map((unit, index) => (
            <div key={index} className="text-center">
              <div className="relative">
                {/* Number box */}
                <div className="bg-gradient-to-br from-white/20 to-white/5 rounded-lg px-2 py-1.5 border border-white/10">
                  <span className="text-xl md:text-2xl font-bold text-white tabular-nums">
                    {String(unit.value).padStart(2, "0")}
                  </span>
                </div>
                {/* Decorative dot */}
                {index < 3 && (
                  <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 text-white/50 text-lg hidden md:block">
                    :
                  </span>
                )}
              </div>
              <span className="text-[10px] text-white/70 mt-1 block font-medium uppercase tracking-wide">
                {unit.label}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-1.5 mt-3 text-white/60">
          <Calendar className="w-3 h-3" />
          <span className="text-[10px] font-medium">11 Jun 2026 • Partido Inaugural</span>
        </div>
      </div>
    </div>
  );
};

export default WorldCupCountdown;

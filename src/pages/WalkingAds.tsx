import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  Mountain,
  Tv,
  Zap,
  TrendingUp,
  DollarSign,
  Users,
  Leaf,
  Heart,
  ShieldCheck,
  Play,
  ExternalLink,
  ArrowUpRight,
  Clock,
  Target,
  Radio,
} from "lucide-react";

const SITE = "https://www.vacilateesto.com";
const URL = `${SITE}/walking-ads`;
const CASE_VIDEO_ID = "ZLT5xYa_BvM";
const EPISODE_VIDEO_ID = "NZWSKJvOdXg";

const SECTIONS = [
  { id: "insight", num: "01", title: "Insight" },
  { id: "strategy", num: "02", title: "Strategy" },
  { id: "execution", num: "03", title: "Execution" },
  { id: "results", num: "04", title: "Results" },
  { id: "shift", num: "05", title: "Shift" },
  { id: "community", num: "06", title: "Community" },
  { id: "placements", num: "07", title: "Placements" },
];

const TIMELINE = [
  { time: "8:00 AM", label: "Launch — First injection deployed across Meta" },
  { time: "9:00 AM", label: "Injection #2 — Base camp footage" },
  { time: "10:00 AM", label: "Injection #3 — Trail begins" },
  { time: "11:00 AM", label: "Injection #4 — Jungle crossing" },
  { time: "12:00 PM", label: "Injection #5 — River passage" },
  { time: "1:00 PM", label: "Injection #6 — Altitude checkpoint" },
  { time: "2:00 PM", label: "Injection #7 — Rocky ascent" },
  { time: "3:00 PM", label: "Injection #8 — Cloud layer entry" },
  { time: "4:00 PM", label: "Injection #9 — Vertical climb" },
  { time: "5:00 PM", label: "Injection #10 — Final approach" },
  { time: "6:00 PM", label: "Injection #11 — Summit ridge" },
  { time: "7:00 PM", label: "Injection #12 — Sunset at top" },
  { time: "8:00 PM", label: "Injection #13 — Summit celebration" },
  { time: "9–10 PM", label: "Injection #14 — TV Premiere on Televen" },
];

const COMMENTS = [
  { user: "@magdalenepinto5125", text: "Thank you for exalting our country… putting our Roraima on high ❤️🎉" },
  { user: "@magdalenepinto5125", text: "Thanks to our indigenous brothers and sisters… so valuable, and we must honor them ❤️" },
  { user: "@navarromendiri", text: "I had the opportunity to climb Roraima Tepuy 3 times in 1990-91-92. The beauty and immensity is overwhelming. Venezuela 🇻🇪 is the most beautiful country in the world." },
  { user: "@jesusbenitez5262", text: "Wow, incredible — you're definitely on another level. I imagine this is a Guinness Record since no one has ever done a podcast in such a place. Marvelous 🎉" },
  { user: "@magdalenepinto5125", text: "What I love most is that they're Venezuelan… and they give value to what's ours ❤️🎉" },
  { user: "@magdalenepinto5125", text: "I wish from the heart that this is the beginning of new expeditions — to care for, not destroy — and to honor all the expeditioners ❤️" },
];

/* ---------- Reveal on scroll ---------- */
const Reveal = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
};

/* ---------- Page ---------- */
const WalkingAds = () => {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>("hero");

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? (h.scrollTop / total) * 100 : 0);
      setScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="min-h-screen bg-[#05080f] text-white overflow-x-hidden selection:bg-amber-400/30 selection:text-white">
      <Helmet>
        <title>Walking Ads Above the Algorithm — Vacílate Esto · Cannes Lions 2026</title>
        <meta
          name="description"
          content="14 hours, 14 injections, $44 total. A masterclass in human-centric media integration that turned a $44 hack into a national milestone."
        />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content="Walking Ads Above the Algorithm" />
        <meta property="og:description" content="A masterclass in human-centric media integration." />
        <meta property="og:url" content={URL} />
      </Helmet>

      {/* Scroll progress */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[60] bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Backgrounds */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 75% 30%, rgba(245,158,11,0.22), transparent 55%), radial-gradient(ellipse at 15% 85%, rgba(244,63,94,0.12), transparent 55%)",
        }}
      />

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-5 sm:px-10 py-4 sm:py-5 flex items-center justify-between transition-all duration-300 ${
          scrolled ? "bg-[#05080f]/80 backdrop-blur-md border-b border-white/5" : ""
        }`}
      >
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back</span>
        </Link>
        <div className="hidden sm:block text-[10px] sm:text-xs tracking-[0.3em] text-white/45 uppercase">
          Cannes Lions 2026 — Case Study
        </div>
      </header>

      {/* Side dot nav (desktop) */}
      <nav
        aria-label="Section navigation"
        className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3"
      >
        {SECTIONS.map((s) => {
          const active = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="group relative flex items-center gap-3"
              aria-label={`Go to ${s.title}`}
            >
              <span
                className={`absolute right-6 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-widest font-semibold whitespace-nowrap transition-all duration-300 bg-white text-black ${
                  active
                    ? "opacity-0"
                    : "opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0"
                }`}
              >
                {s.num} · {s.title}
              </span>
              <span
                className={`block rounded-full transition-all duration-300 ${
                  active
                    ? "w-3 h-3 bg-amber-400 ring-4 ring-amber-400/15"
                    : "w-2 h-2 bg-white/30 group-hover:bg-white/70"
                }`}
              />
            </button>
          );
        })}
      </nav>

      <main className="relative">
        {/* HERO */}
        <section
          id="hero"
          className="relative min-h-[100svh] flex items-center px-5 sm:px-10 lg:px-20 pt-28 pb-24"
        >
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-10 items-center w-full max-w-7xl mx-auto">
            <div>
              <Reveal>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[10px] tracking-[0.25em] uppercase text-white/60 mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Mount Roraima × Vacílate Esto
                </div>
              </Reveal>

              <h1 className="font-black leading-[1.02] tracking-tight">
                <Reveal delay={50}>
                  <span className="block text-[2.6rem] sm:text-5xl md:text-6xl lg:text-7xl text-white">
                    Walking Ads
                  </span>
                </Reveal>
                <Reveal delay={150}>
                  <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white/85 mt-3">
                    Above the
                  </span>
                </Reveal>
                <Reveal delay={250}>
                  <span className="block text-[2.6rem] sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent mt-1">
                    Algorithm
                  </span>
                </Reveal>
              </h1>

              <Reveal delay={450}>
                <p className="mt-8 max-w-md text-base sm:text-lg text-white/65 leading-relaxed">
                  A masterclass in human-centric media integration. <strong className="text-white">14 hours. 14 injections. $44 total.</strong> One nation watching.
                </p>
              </Reveal>

              <Reveal delay={550}>
                <div className="flex flex-wrap gap-3 mt-8">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 text-xs font-semibold tracking-wider uppercase">
                    <Clock className="w-3.5 h-3.5" /> 14h Manual Sync
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-400/40 bg-rose-400/10 text-rose-300 text-xs font-semibold tracking-wider uppercase">
                    <DollarSign className="w-3.5 h-3.5" /> $0.10 CPM
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 text-emerald-300 text-xs font-semibold tracking-wider uppercase">
                    <Leaf className="w-3.5 h-3.5" /> Zero Footprint
                  </span>
                </div>
              </Reveal>

              <Reveal delay={600}>
                <div className="flex flex-wrap gap-3 mt-6">
                  <a
                    href={`https://www.youtube.com/watch?v=${CASE_VIDEO_ID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    Watch the case film
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <button
                    onClick={() => scrollTo("execution")}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 hover:bg-white/5 text-sm font-semibold transition-colors"
                  >
                    See the 59-min protocol
                  </button>
                </div>
              </Reveal>

              <Reveal delay={650}>
                <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] tracking-[0.2em] uppercase text-white/40">
                  <span>
                    <span className="text-white/30">Agency</span>{" "}
                    <span className="text-white/70">La Web Figital Agency</span>
                  </span>
                  <span className="text-white/15">|</span>
                  <span>
                    <span className="text-white/30">Client</span>{" "}
                    <span className="text-white/70">Vacílate Esto</span>
                  </span>
                  <span className="text-white/15">|</span>
                  <span className="text-white/70">Cannes Lions 2026</span>
                </div>
              </Reveal>
            </div>

            {/* Stat poster */}
            <Reveal delay={300} className="flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                <div className="absolute inset-0 m-auto w-[80%] h-[80%] rounded-full bg-amber-400/15 blur-[80px] animate-pulse" />
                <div className="absolute inset-0 m-auto w-[60%] h-[60%] rounded-full bg-rose-400/10 blur-[60px]" />
                <svg
                  viewBox="0 0 400 400"
                  className="absolute inset-0 w-full h-full text-white/70"
                  style={{ animation: "spin 40s linear infinite" }}
                >
                  <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
                  <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 8" />
                </svg>
                <div className="relative text-center px-6">
                  <div className="text-[0.65rem] sm:text-xs tracking-[0.5em] text-white/60 font-semibold">
                    TOTAL INVESTMENT
                  </div>
                  <div className="text-6xl sm:text-8xl font-black bg-gradient-to-br from-amber-300 to-rose-400 bg-clip-text text-transparent mt-3">
                    $44
                  </div>
                  <div className="text-[0.65rem] sm:text-xs tracking-[0.4em] text-white/55 mt-3">
                    +470K REACH · +177% RATING
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <button
            onClick={() => scrollTo("insight")}
            aria-label="Scroll down"
            className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 hover:text-white/90 transition-colors group"
          >
            <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </button>
        </section>

        {/* Case Video */}
        <section className="px-5 sm:px-10 lg:px-20 pb-12">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="flex items-center gap-3 mb-5 text-[11px] tracking-[0.3em] uppercase text-white/45">
                <span className="w-8 h-px bg-white/30" />
                Case Film
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video shadow-[0_20px_80px_-20px_rgba(245,158,11,0.4)]">
                <iframe
                  src={`https://www.youtube.com/embed/${CASE_VIDEO_ID}?rel=0&modestbranding=1`}
                  title="Walking Ads Above the Algorithm — Case Film"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Stats banner */}
        <section className="px-5 sm:px-10 lg:px-20 py-16">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
            {[
              { big: "+177%", label: "Rating Increase", sub: "On Emission Day" },
              { big: "+470K", label: "Reach", sub: "Organic + Ads" },
              { big: "$44", label: "Total Investment", sub: "Walking Ad" },
              { big: "$0.10", label: "CPM", sub: "Cost per Mille" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div className="bg-[#070b14] p-6 sm:p-8 hover:bg-[#0a1020] transition-colors h-full">
                  <div className="text-3xl sm:text-4xl font-black bg-gradient-to-br from-amber-300 to-rose-400 bg-clip-text text-transparent">
                    {s.big}
                  </div>
                  <div className="text-sm font-semibold text-white mt-2">{s.label}</div>
                  <div className="text-xs text-white/50 mt-1">{s.sub}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 01 Insight */}
        <SectionWrap id="insight" num="01" title="Cultural Insight">
          <p>
            In Venezuela, a country marked by years of social and economic crisis, the digital algorithm has become a <strong>mirror of despair</strong>. The 'Learning Phase' of social platforms consistently favors high-engagement negative news, creating a <em>'doomscrolling' cycle</em> that traps national identity in a loop of pessimism.
          </p>
          <p>
            Venezuelans had stopped looking at their own wonders because the noise of the crisis was louder. We identified that to change the narrative, we couldn't just post content; we had to physically and technically <strong>'climb' above the noise</strong>.
          </p>
          <p>
            The summit of Mount Roraima wasn't just a location; it was a strategic standpoint to prove that when <strong>human purpose outpaces algorithmic lag</strong>, a whole nation can switch from cynicism to pride.
          </p>
        </SectionWrap>

        {/* 02 Strategy */}
        <SectionWrap id="strategy" num="02" title="Media Strategy">
          <div className="not-prose grid sm:grid-cols-3 gap-4 mb-10">
            {[
              { icon: Clock, title: "59-min cycles", text: "Manual hourly injection protocol resets the freshness window every 59 minutes." },
              { icon: Target, title: "Manual Injection", text: "Bypassed automated lag with surgical real-time synchronization." },
              { icon: Tv, title: "Broadcast Sync", text: "Mobile became a real-time GPS, building tension toward TV premiere." },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <div className="group h-full p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:border-amber-400/40 hover:bg-white/[0.04] hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-4 group-hover:bg-amber-400/20 transition-colors">
                    <c.icon className="w-5 h-5 text-amber-300" />
                  </div>
                  <div className="font-semibold text-white">{c.title}</div>
                  <div className="text-sm text-white/60 mt-1 leading-relaxed">{c.text}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <p>
            In a digital landscape where Meta's algorithms prioritize negative narratives through a 24-hour 'learning phase,' our strategy was to reclaim the national conversation through a <strong>Surgical Real-Time Synchronization</strong>.
          </p>
          <p>
            We identified a critical technical gap: automated media buying is too slow for live, high-stakes storytelling. To solve this, we bypassed the algorithm's automated lag by implementing a <strong>Manual Hourly Injection Protocol</strong>. Every 59 minutes, for 14 consecutive hours, we triggered unique Meta Reels that mirrored the physical progress of an expedition to the summit of Mount Roraima.
          </p>
          <p>
            This created a <em>'Companion Screen'</em> effect: the mobile phone became a real-time GPS for the audience, building unbearable tension that culminated in a massive migration to Broadcast TV (Televen) for the premiere. We didn't just buy ads; we engineered a <strong>14-hour digital appointment</strong> that forced the algorithm to follow a human-led, positive narrative.
          </p>
        </SectionWrap>

        {/* 03 Execution */}
        <SectionWrap id="execution" num="03" title="The Execution">
          <p>
            <strong>14-Hour Synchronized Deployment — November 30th, 2025.</strong> A feat of manual precision: 14 live content 'injections' across Meta (Reels/Stories) and Broadcast TV (Televen).
          </p>

          <div className="not-prose mt-12 relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-amber-400/40 via-amber-400/20 to-transparent" />
            <ol className="space-y-5">
              {TIMELINE.map((t, i) => (
                <Reveal key={t.time} delay={i * 30}>
                  <li className="relative pl-8">
                    <span className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-amber-400 ring-4 ring-amber-400/15" />
                    <div className="text-[11px] tracking-[0.3em] uppercase text-amber-300/80 font-semibold">
                      {t.time}
                    </div>
                    <div className="text-white/80 text-sm sm:text-base mt-0.5">{t.label}</div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>

          <h3 className="!mt-16">The 59-Minute Protocol</h3>
          <p>
            To beat the platform's delivery cooling, we avoided the standard 'set and forget' campaign structure. Instead, we manually refreshed the ad sets every hour, resetting the <em>'Freshness Window'</em> to ensure immediate delivery to 100% of our active audience.
          </p>
          <p>
            While the team climbed the ancient tepuy under extreme conditions — zero signal, rain, and mud — the media team in the city acted as the <strong>'algorithm's pilot,'</strong> manually adjusting bids and placements every 59 minutes. The execution culminated at 10:00 PM with a nationwide TV premiere on Televen.
          </p>
        </SectionWrap>

        {/* 04 Results */}
        <SectionWrap id="results" num="04" title="Results">
          <div className="not-prose grid sm:grid-cols-2 gap-4 mb-10">
            {[
              { icon: TrendingUp, title: "Audience Surge", text: "+177% rating increase for the premiere on Televen vs. previous month — certified by BB Media." },
              { icon: DollarSign, title: "Efficiency Record", text: "$44 total media spend reaching 427,979 unique users — record-breaking $0.10 CPM." },
              { icon: Heart, title: "Engagement", text: "14h sustained digital appointment, 470% increase in social mentions and a clear positive sentiment shift." },
              { icon: Leaf, title: "Social Impact", text: "14-member multi-generational Pemón team — 'Zero-Footprint' production certified by Eco Aventura." },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <div className="group h-full p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:border-amber-400/40 hover:bg-white/[0.04] hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-4 group-hover:bg-amber-400/20 transition-colors">
                    <c.icon className="w-5 h-5 text-amber-300" />
                  </div>
                  <div className="font-semibold text-white">{c.title}</div>
                  <div className="text-sm text-white/60 mt-1 leading-relaxed">{c.text}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <blockquote className="not-prose mt-10 border-l-2 border-amber-400/60 pl-6 italic text-lg sm:text-xl text-white/80 leading-relaxed">
            "We proved that strategic human intervention can outperform multi-million dollar automated budgets, turning a $44 'hack' into a national milestone."
          </blockquote>
        </SectionWrap>

        {/* 05 Shift */}
        <SectionWrap id="shift" num="05" title="From Doomscroll to National Pride">
          <p>
            The algorithm's feed shifted in real time. Negative crisis news gave way to an unstoppable wave of love, pride, and rediscovery.
          </p>
          <div className="not-prose grid md:grid-cols-2 gap-4 mt-10">
            <Reveal>
              <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="text-[10px] tracking-[0.4em] uppercase text-white/40 mb-4">Before</div>
                <div className="flex flex-wrap gap-2">
                  {["crisis", "emigration", "inflation", "blackouts", "despair", "shortage"].map((w) => (
                    <span key={w} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/50 line-through decoration-white/30">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="p-6 rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-400/10 to-rose-400/5">
                <div className="text-[10px] tracking-[0.4em] uppercase text-amber-300/80 mb-4">After</div>
                <div className="flex flex-wrap gap-2">
                  {["🇻🇪 pride", "❤️ beautiful", "⛰️ Roraima", "💪 brave", "🌿 indigenous", "🏆 history"].map((w) => (
                    <span key={w} className="px-3 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-xs text-amber-200 font-medium">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <h3 className="!mt-14">The Conversation Shifted</h3>
          <p>
            What started as a media hack turned into an outpouring of national pride. Real viewers flooded the comments with messages of love for Venezuela, its people, and its landscapes.
          </p>
          <div className="not-prose grid md:grid-cols-2 gap-4 mt-8">
            {COMMENTS.map((c, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="h-full p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center text-xs font-bold text-black">
                      {c.user[1].toUpperCase()}
                    </div>
                    <div className="text-xs text-white/50">{c.user}</div>
                  </div>
                  <p className="text-sm text-white/75 leading-relaxed">"{c.text}"</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="!mt-10 text-amber-300/90">
            <strong>100% of comments</strong> were expressions of national pride — zero negativity.
          </p>
        </SectionWrap>

        {/* 06 Community */}
        <SectionWrap id="community" num="06" title="Powered by the Pemón Community">
          <p>
            The expedition's logistical and safety backbone consisted exclusively of members from the Pemón indigenous community — making this not just a media campaign, but an act of <strong>economic empowerment and cultural partnership</strong>.
          </p>
          <div className="not-prose grid sm:grid-cols-3 gap-4 mt-10">
            {[
              { big: "14", icon: Users, title: "Pemón Team Members", text: "Multi-generational team of adult men, women, and youth from Paraitepuy." },
              { big: "Zero", icon: Leaf, title: "Ecological Footprint", text: "Strict 'Zero-Impact' protocol — the crew even removed waste from previous travelers." },
              { big: "♀", icon: ShieldCheck, title: "Female-Led Expedition", text: "Led by expert guide Odimar López, director of Eco Aventura." },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <div className="h-full p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:border-emerald-400/40 hover:bg-white/[0.04] hover:-translate-y-1 transition-all duration-300">
                  <div className="text-3xl font-black bg-gradient-to-br from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                    {c.big}
                  </div>
                  <div className="font-semibold text-white mt-3">{c.title}</div>
                  <div className="text-sm text-white/60 mt-1 leading-relaxed">{c.text}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <blockquote className="not-prose mt-10 border-l-2 border-emerald-400/60 pl-6 italic text-base sm:text-lg text-white/75 leading-relaxed">
            "We certify that the expedition's logistical and safety backbone consisted of a 14-member multi-generational team exclusively from the Pemón indigenous community. This collaboration provided direct economic empowerment to the local community of Paraitepuy."
            <footer className="not-italic text-xs tracking-[0.2em] uppercase text-white/45 mt-3">
              — Odimar López Grillet · Director, Eco Aventura
            </footer>
          </blockquote>
        </SectionWrap>

        {/* 07 Placements */}
        <SectionWrap id="placements" num="07" title="Media Placements" last>
          <div className="not-prose grid md:grid-cols-2 gap-4">
            <Reveal>
              <div className="h-full p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-rose-400/10 border border-rose-400/20 flex items-center justify-center">
                    <Tv className="w-5 h-5 text-rose-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Television</div>
                    <div className="text-xs text-white/50">National Broadcast Premiere</div>
                  </div>
                </div>
                <dl className="text-sm space-y-2">
                  <div className="flex justify-between gap-4 border-t border-white/5 pt-2"><dt className="text-white/50">Platform</dt><dd className="text-white/80 text-right">Televen (Free-to-air)</dd></div>
                  <div className="flex justify-between gap-4 border-t border-white/5 pt-2"><dt className="text-white/50">Execution</dt><dd className="text-white/80 text-right">Open Signal TV</dd></div>
                  <div className="flex justify-between gap-4 border-t border-white/5 pt-2"><dt className="text-white/50">Airings</dt><dd className="text-white/80 text-right">14 synced every 59 min</dd></div>
                </dl>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="h-full p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                    <Radio className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Social Media</div>
                    <div className="text-xs text-white/50">14-Hour Real-Time Sync Protocol</div>
                  </div>
                </div>
                <dl className="text-sm space-y-2">
                  <div className="flex justify-between gap-4 border-t border-white/5 pt-2"><dt className="text-white/50">Platform</dt><dd className="text-white/80 text-right">Meta (Instagram & Facebook)</dd></div>
                  <div className="flex justify-between gap-4 border-t border-white/5 pt-2"><dt className="text-white/50">Execution</dt><dd className="text-white/80 text-right">Reels & Stories</dd></div>
                  <div className="flex justify-between gap-4 border-t border-white/5 pt-2"><dt className="text-white/50">Cadence</dt><dd className="text-white/80 text-right">59-min manual injections</dd></div>
                </dl>
              </div>
            </Reveal>
          </div>

          <h3 className="!mt-16">The Premiere Episode</h3>
          <p>
            Originally broadcast on Televen on Sunday, November 30th, 2025 at 10:00 PM. The culmination of the 14-hour synchronized expedition to the summit of Mount Roraima.
          </p>
          <div className="not-prose mt-8 relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video shadow-[0_20px_80px_-20px_rgba(245,158,11,0.4)]">
            <iframe
              src={`https://www.youtube.com/embed/${EPISODE_VIDEO_ID}?rel=0&modestbranding=1`}
              title="Roraima — Podcast en la Cumbre"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </SectionWrap>

        {/* CTA */}
        <section className="px-5 sm:px-10 lg:px-20 py-20">
          <Reveal>
            <div className="max-w-5xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-br from-amber-400/10 via-white/[0.02] to-rose-400/10 p-8 sm:p-12 text-center relative overflow-hidden">
              <div
                aria-hidden
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, rgba(245,158,11,0.4), transparent 60%)",
                }}
              />
              <div className="relative">
                <div className="text-[10px] tracking-[0.4em] uppercase text-white/50 mb-4">
                  Discover more
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
                  $44 became a national milestone.
                </h2>
                <p className="text-white/65 max-w-xl mx-auto mb-8">
                  Explore the rest of the Vacílate Esto ecosystem — podcast, expeditions, and stories told from the ground up.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/podcast-en-la-cumbre"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
                  >
                    Podcast en la Cumbre <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/streaming-from-the-lost-world"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 hover:bg-white/5 text-sm font-semibold transition-colors"
                  >
                    <Mountain className="w-4 h-4" /> Streaming from the Lost World
                  </Link>
                  <a
                    href={`https://www.youtube.com/watch?v=${CASE_VIDEO_ID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white/70 hover:text-white hover:border-white/30 text-sm font-semibold transition-colors"
                  >
                    Case film <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Footer */}
        <footer className="px-5 sm:px-10 lg:px-20 py-10 border-t border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/40">
            <div className="tracking-[0.2em] uppercase">
              Vacílate Esto · La Web Figital Agency · Cannes Lions 2026
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-white/60 hover:text-white transition-colors tracking-[0.2em] uppercase"
            >
              ↑ Back to top
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

/* ---------- Section wrapper ---------- */
const SectionWrap = ({
  id,
  num,
  title,
  children,
  last,
}: {
  id: string;
  num: string;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) => (
  <section
    id={id}
    className={`relative px-5 sm:px-10 lg:px-20 py-20 sm:py-28 scroll-mt-24 ${
      !last ? "border-t border-white/[0.06]" : ""
    }`}
  >
    <div className="max-w-4xl mx-auto">
      <Reveal>
        <div className="flex items-baseline gap-4 mb-6">
          <span className="text-7xl sm:text-8xl font-black text-white/[0.06] leading-none select-none">
            {num}
          </span>
          <span className="text-[10px] tracking-[0.4em] uppercase text-white/40">
            Chapter {num}
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-10">{title}</h2>
      </Reveal>
      <Reveal delay={100}>
        <div className="prose prose-invert prose-lg max-w-none prose-p:text-white/70 prose-p:leading-relaxed prose-strong:text-white prose-em:text-amber-300 prose-em:not-italic prose-em:font-medium prose-headings:text-white">
          {children}
        </div>
      </Reveal>
    </div>
  </section>
);

export default WalkingAds;

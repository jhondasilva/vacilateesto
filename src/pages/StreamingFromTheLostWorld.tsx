import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  Mountain,
  SignalHigh,
  Satellite,
  Battery,
  Video,
  Radio,
  Users,
  Globe2,
  Sparkles,
  Share2,
  Play,
  ExternalLink,
  ArrowUpRight,
  Film,
  X,
  Loader2,
} from "lucide-react";
import boardImage from "@/assets/streaming-lost-world-board.jpeg";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const SITE = "https://www.vacilateesto.com";
const URL = `${SITE}/streaming-from-the-lost-world`;
const DRIVE_FOLDER = "https://drive.google.com/drive/folders/1mT6FpJuZl4p7FlKGhKm_3JXWaBCYSNzX";
const TIKTOK_FOLDER_ID = "1HrGS50B---CIBSorvgRKM8NQtXMJ8-_F";
const TIKTOK_FOLDER_URL = `https://drive.google.com/drive/folders/${TIKTOK_FOLDER_ID}`;
const CASE_VIDEO_ID = "PSm0Qmahdrg";

const SECTIONS = [
  { id: "context", num: "01", title: "Context" },
  { id: "idea", num: "02", title: "Idea" },
  { id: "enabler", num: "03", title: "Enabler" },
  { id: "execution", num: "04", title: "Execution" },
  { id: "streams", num: "05", title: "Streams" },
  { id: "tiktoks", num: "06", title: "TikToks" },
  { id: "community", num: "07", title: "Community" },
  { id: "results", num: "08", title: "Results" },
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
const StreamingFromTheLostWorld = () => {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>("hero");

  type DriveVideo = {
    id: string;
    name: string;
    thumbnail: string;
    preview: string;
    width: number | null;
    height: number | null;
    durationMs: number | null;
  };
  const [tiktoks, setTiktoks] = useState<DriveVideo[]>([]);
  const [tiktoksLoading, setTiktoksLoading] = useState(true);
  const [tiktoksError, setTiktoksError] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<DriveVideo | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
        const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/drive-folder-videos?folderId=${TIKTOK_FOLDER_ID}`,
          {
            headers: {
              Authorization: `Bearer ${key}`,
              apikey: key,
            },
          }
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
        if (alive) setTiktoks((json.videos ?? []) as DriveVideo[]);
      } catch (err) {
        console.error(err);
        if (alive) setTiktoksError(err instanceof Error ? err.message : "Failed to load videos");
      } finally {
        if (alive) setTiktoksLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

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

  // Track active section for side nav
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
        <title>Streaming From The Lost World — Vacílate Esto · Cannes Lions 2026</title>
        <meta
          name="description"
          content="The first live broadcast from the summit of Mount Roraima. A community-powered expedition by Vacílate Esto — zero paid media, pure human connection."
        />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content="Streaming From The Lost World" />
        <meta property="og:description" content="The first live broadcast from the summit of Mount Roraima." />
        <meta property="og:url" content={URL} />
        <meta property="og:image" content={`${SITE}/og-image.png`} />
      </Helmet>

      {/* Scroll progress */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[60] bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-sky-400 via-sky-300 to-amber-400 transition-[width] duration-150"
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
            "radial-gradient(ellipse at 75% 30%, rgba(56,140,210,0.22), transparent 55%), radial-gradient(ellipse at 15% 85%, rgba(245,158,11,0.10), transparent 55%)",
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
                  A historical first
                </div>
              </Reveal>

              <h1 className="font-black leading-[1.02] tracking-tight">
                <Reveal delay={50}>
                  <span className="block text-[2.6rem] sm:text-5xl md:text-6xl lg:text-7xl text-white">
                    The First
                  </span>
                </Reveal>
                <Reveal delay={150}>
                  <span className="block text-[2.6rem] sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500 bg-clip-text text-transparent mt-1">
                    Live Broadcast
                  </span>
                </Reveal>
                <Reveal delay={250}>
                  <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white/85 mt-3">
                    from the Summit of
                  </span>
                </Reveal>
                <Reveal delay={350}>
                  <span className="block text-[2.6rem] sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent mt-1">
                    Mount Roraima
                  </span>
                </Reveal>
              </h1>

              <Reveal delay={450}>
                <p className="mt-8 max-w-md text-base sm:text-lg text-white/65 leading-relaxed">
                  A community-powered expedition that turned a nation's gaze upward — zero paid media, pure human connection.
                </p>
              </Reveal>

              <Reveal delay={550}>
                <div className="flex flex-wrap gap-3 mt-8">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 text-xs font-semibold tracking-wider uppercase">
                    <Mountain className="w-3.5 h-3.5" /> 2,810m Altitude
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sky-400/40 bg-sky-400/10 text-sky-300 text-xs font-semibold tracking-wider uppercase">
                    <SignalHigh className="w-3.5 h-3.5" /> Starlink Powered
                  </span>
                </div>
              </Reveal>

              <Reveal delay={600}>
                <div className="flex flex-wrap gap-3 mt-6">
                  <a
                    href={DRIVE_FOLDER}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    Watch the Drive archive
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <button
                    onClick={() => document.getElementById("board")?.scrollIntoView({ behavior: "smooth" })}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 hover:bg-white/5 text-sm font-semibold transition-colors"
                  >
                    See the case board
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

            {/* Logo / mark */}
            <Reveal delay={300} className="flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                <div className="absolute inset-0 m-auto w-[80%] h-[80%] rounded-full bg-sky-500/15 blur-[80px] animate-pulse" />
                <div className="absolute inset-0 m-auto w-[60%] h-[60%] rounded-full bg-amber-400/10 blur-[60px]" />
                <svg
                  viewBox="0 0 400 400"
                  className="absolute inset-0 w-full h-full text-white/70"
                  style={{ animation: "spin 40s linear infinite" }}
                >
                  <ellipse
                    cx="200"
                    cy="200"
                    rx="180"
                    ry="70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    transform="rotate(-18 200 200)"
                  />
                  <ellipse
                    cx="200"
                    cy="200"
                    rx="180"
                    ry="70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    opacity="0.4"
                    transform="rotate(22 200 200)"
                  />
                </svg>
                <div className="relative text-center px-6">
                  <div className="text-[0.7rem] sm:text-xs tracking-[0.6em] text-white/80 font-semibold">
                    STREAMING
                  </div>
                  <div className="text-[0.55rem] sm:text-[0.65rem] tracking-[0.6em] text-white/60 mt-1">
                    FROM THE
                  </div>
                  <div className="text-3xl sm:text-5xl font-black tracking-tight mt-2 text-white">
                    LOST WORLD
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <button
            onClick={() => scrollTo("context")}
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
                Case Video
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video shadow-[0_20px_80px_-20px_rgba(56,140,210,0.4)]">
                <iframe
                  src={`https://www.youtube.com/embed/${CASE_VIDEO_ID}?rel=0&modestbranding=1`}
                  title="Streaming From the Lost World — Case Video"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Case Board */}
        <section id="board" className="px-5 sm:px-10 lg:px-20 pb-12 scroll-mt-24">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="flex items-center gap-3 mb-5 text-[11px] tracking-[0.3em] uppercase text-white/45">
                <span className="w-8 h-px bg-white/30" />
                Case Board
              </div>
              <a
                href={boardImage}
                target="_blank"
                rel="noopener noreferrer"
                className="block group relative rounded-2xl overflow-hidden border border-white/10 bg-black shadow-[0_20px_80px_-20px_rgba(245,158,11,0.35)]"
              >
                <img
                  src={boardImage}
                  alt="Streaming from the Lost World — case board"
                  loading="lazy"
                  className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] tracking-widest uppercase text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open full size <ArrowUpRight className="w-3 h-3" />
                </div>
              </a>
            </Reveal>
          </div>
        </section>

        {/* Stats banner */}
        <section className="px-5 sm:px-10 lg:px-20 py-16">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
            {[
              { big: "76K+", label: "Organic Likes", sub: "No paid promotion" },
              { big: "1.4M+", label: "Organic Reach", sub: "Total impressions" },
              { big: "98%", label: "Positive Sentiment", sub: "Narrative shift" },
              { big: "1st", label: "Historical Milestone", sub: "Live from Roraima" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div className="bg-[#070b14] p-6 sm:p-8 hover:bg-[#0a1020] transition-colors h-full">
                  <div className="text-3xl sm:text-4xl font-black bg-gradient-to-br from-amber-300 to-amber-500 bg-clip-text text-transparent">
                    {s.big}
                  </div>
                  <div className="text-sm font-semibold text-white mt-2">{s.label}</div>
                  <div className="text-xs text-white/50 mt-1">{s.sub}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 01 Context */}
        <SectionWrap id="context" num="01" title="The Context">
          <p>
            Mount Roraima — the tabletop mountain that inspired Arthur Conan Doyle's <em>"The Lost World"</em> — stands at 2,810 meters on the triple border of Venezuela, Brazil, and Guyana. It is one of the oldest geological formations on Earth, a <strong>tepui</strong> shrouded in clouds and mystery, home to endemic species found nowhere else on the planet.
          </p>
          <p>
            Despite being a UNESCO-worthy natural wonder, Roraima had <strong>never been live-streamed from its summit</strong>. No internet infrastructure, no power grid, no cellular signal — the summit exists in complete <em>digital isolation</em>.
          </p>
          <p>
            Venezuela's social media landscape was trapped in a cycle of negative news. The algorithm rewarded despair. We saw an opportunity: to use the most remote place in the country to create <strong>the most connected moment in its digital history</strong>.
          </p>
        </SectionWrap>

        {/* 02 Idea */}
        <SectionWrap id="idea" num="02" title="The Idea">
          <p>
            <strong>Stream live from the summit of Mount Roraima</strong> — a place where no internet signal has ever reached — and turn an entire nation into a real-time community of witnesses.
          </p>
          <p>
            For <em>"Vacílate Esto"</em> — a digital ecosystem built around a podcast and social media channels — we designed an expedition that would carry portable satellite technology to the top of one of Earth's oldest mountains. The goal wasn't just to broadcast — it was to create a <strong>shared moment of collective wonder</strong> that would break through the algorithm's negativity bias.
          </p>
          <p>
            By streaming from a place that had never been connected, we would prove that <strong>human ambition can still outpace technological limitations</strong> — and that community engagement doesn't need paid promotion when the content is genuinely extraordinary.
          </p>
        </SectionWrap>

        {/* 03 Enabler */}
        <SectionWrap id="enabler" num="03" title="The Enabler">
          <p>
            A custom-built backpack system that turned a human climber into a mobile broadcast station — carrying satellite connectivity, autonomous power, and live production capabilities to 2,810 meters.
          </p>
          <div className="not-prose grid sm:grid-cols-2 gap-4 mt-10">
            {[
              { icon: Satellite, title: "Starlink Antenna", text: "Satellite internet from the summit at 2,810m altitude" },
              { icon: Battery, title: "Autonomous Power", text: "Solar-powered battery system for 72+ hours of operation" },
              { icon: Video, title: "Live Production", text: "Real-time video production from the tepui summit" },
              { icon: Radio, title: "Live Streaming", text: "Uninterrupted broadcast to social platforms worldwide" },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <div className="group h-full p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:border-sky-400/40 hover:bg-white/[0.04] hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-sky-400/10 border border-sky-400/20 flex items-center justify-center mb-4 group-hover:bg-sky-400/20 transition-colors">
                    <c.icon className="w-5 h-5 text-sky-300" />
                  </div>
                  <div className="font-semibold text-white">{c.title}</div>
                  <div className="text-sm text-white/60 mt-1 leading-relaxed">{c.text}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <h3 className="!mt-14">The Backpack Antenna System</h3>
          <p>
            Every component — Starlink dish, solar panels, batteries, encoding hardware, and cameras — was engineered to fit inside a single expedition backpack. The system was designed for the 6-day trek through jungle, river crossings, and vertical rock faces. Total weight: portable enough for one person. Capability: broadcast-grade live production from anywhere on Earth.
          </p>
        </SectionWrap>

        {/* 04 Execution */}
        <SectionWrap id="execution" num="04" title="The Execution">
          <p>
            A <strong>6-day expedition</strong> through the Gran Sabana to the summit of Mount Roraima. The team — including indigenous Pemón guides who have ancestral knowledge of the mountain's paths — carried the portable satellite system through dense jungle, river crossings, and the famous vertical wall that guards the summit.
          </p>
          <p>
            Upon reaching the top, the <em>Starlink antenna was deployed</em> for the first time ever on a Venezuelan tepui. Within minutes, a live signal was established — connecting one of the most isolated places on Earth directly to millions of screens.
          </p>
          <p>
            The live stream captured <strong>never-before-seen views</strong> from the summit: endemic plants, crystal-clear pools, and the vast stone landscape that has existed for over 2 billion years. Audiences watched in real-time as the team explored a world most Venezuelans had never seen — despite it being their own.
          </p>
          <p>
            <strong>No paid promotion was used.</strong> Every share, every comment, every like was earned organically through the sheer power of authentic, extraordinary content shared in real-time with a community that chose to participate.
          </p>
        </SectionWrap>

        {/* 05 Streams */}
        <SectionWrap id="streams" num="05" title="The Streams">
          <p>
            Every broadcast captured from the summit of Mount Roraima — raw, unedited footage streamed live to thousands of viewers via Starlink satellite from 2,810 meters above sea level.
          </p>
          <Reveal>
            <a
              href={DRIVE_FOLDER}
              target="_blank"
              rel="noopener noreferrer"
              className="not-prose group mt-10 flex items-center justify-between gap-4 p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/5 via-white/[0.02] to-transparent hover:border-sky-400/40 hover:from-sky-500/10 transition-all"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-400/10 group-hover:border-sky-400/30 transition-colors">
                  <Play className="w-5 h-5 text-sky-300 fill-sky-300/30" />
                </div>
                <div className="min-w-0">
                  <div className="text-base font-semibold text-white truncate">
                    Summit Streaming Archive
                  </div>
                  <div className="text-xs sm:text-sm text-white/50 truncate">
                    15+ live recordings · Hosted on Google Drive
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white whitespace-nowrap">
                <span className="hidden sm:inline">Open archive</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </a>
          </Reveal>
          <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden mt-6">
            {[
              { big: "15+", label: "Live Streams", sub: "Broadcast from the summit" },
              { big: "Satellite", label: "Signal", sub: "Via Starlink at 2,810m" },
              { big: "Thousands", label: "Live Viewers", sub: "Real-time concurrent" },
            ].map((s) => (
              <div key={s.label} className="bg-[#070b14] p-6 hover:bg-[#0a1020] transition-colors">
                <div className="text-2xl sm:text-3xl font-black text-sky-300">{s.big}</div>
                <div className="text-sm font-semibold text-white mt-2">{s.label}</div>
                <div className="text-xs text-white/50 mt-1">{s.sub}</div>
              </div>
            ))}
          </div>
        </SectionWrap>

        {/* 06 Community */}
        <SectionWrap id="community" num="06" title="Community Engagement">
          <p>
            This wasn't a broadcast — it was a shared expedition. The community didn't just watch; they participated, guided, and amplified the experience organically.
          </p>
          <div className="not-prose grid sm:grid-cols-2 gap-4 mt-10">
            {[
              { icon: Users, title: "Organic Community", text: "Zero paid media — every like, share, and comment was earned through authentic human connection" },
              { icon: Sparkles, title: "Real-time Interaction", text: "Audiences engaged live with the expedition, asking questions, suggesting angles, and sharing the moment" },
              { icon: Globe2, title: "Cultural Reclamation", text: "Venezuelans rediscovered national pride through a shared digital experience of their own natural wonder" },
              { icon: Share2, title: "Cross-platform Virality", text: "Content spread organically across Instagram, TikTok, YouTube and X through community-driven sharing" },
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
          <h3 className="!mt-14">Social Insight</h3>
          <p>
            The algorithm is designed to amplify what already has momentum. By creating content so inherently extraordinary — a <strong>first-ever live stream from an unreachable summit</strong> — we didn't need to fight the algorithm. We gave the community something worth sharing, and they became the distribution engine.
          </p>
          <p>
            <strong>76,000+ organic likes</strong> and <strong>1.4 million organic impressions</strong> — achieved with zero paid media spend. The community didn't just engage; they <em>owned</em> the narrative, turning a digital ecosystem's expedition into a national moment of collective wonder.
          </p>
        </SectionWrap>

        {/* 07 Results */}
        <SectionWrap id="results" num="07" title="The Results" last>
          <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden mt-2">
            {[
              { big: "76K+", label: "Organic Likes" },
              { big: "1.4M+", label: "Organic Reach" },
              { big: "98%", label: "Positive Sentiment" },
              { big: "1st Ever", label: "Live from Summit" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div className="bg-[#070b14] p-6 sm:p-8 h-full">
                  <div className="text-3xl sm:text-4xl font-black bg-gradient-to-br from-amber-300 to-amber-500 bg-clip-text text-transparent">
                    {s.big}
                  </div>
                  <div className="text-sm font-semibold text-white/80 mt-2">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <h3 className="!mt-14">A Historical Milestone</h3>
          <p>
            The first live broadcast from the summit of one of Earth's oldest mountains. A community-powered moment that proved authentic content, shared in real time, can outpace any algorithm — and reframe an entire national conversation.
          </p>
        </SectionWrap>

        {/* CTA */}
        <section className="px-5 sm:px-10 lg:px-20 py-20">
          <Reveal>
            <div className="max-w-5xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/10 via-white/[0.02] to-amber-400/10 p-8 sm:p-12 text-center relative overflow-hidden">
              <div
                aria-hidden
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, rgba(56,140,210,0.4), transparent 60%)",
                }}
              />
              <div className="relative">
                <div className="text-[10px] tracking-[0.4em] uppercase text-white/50 mb-4">
                  Discover more
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
                  Made from the heart of Venezuela.
                </h2>
                <p className="text-white/65 max-w-xl mx-auto mb-8">
                  Explore the Vacílate Esto ecosystem — podcast, expeditions, fútbol, and stories told from the ground up.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/podcast-en-la-cumbre"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
                  >
                    Podcast en la Cumbre <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 hover:bg-white/5 text-sm font-semibold transition-colors"
                  >
                    Back to Home
                  </Link>
                  <a
                    href={DRIVE_FOLDER}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white/70 hover:text-white hover:border-white/30 text-sm font-semibold transition-colors"
                  >
                    Streams Archive <ExternalLink className="w-3.5 h-3.5" />
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
        <div className="prose prose-invert prose-lg max-w-none prose-p:text-white/70 prose-p:leading-relaxed prose-strong:text-white prose-em:text-sky-300 prose-em:not-italic prose-em:font-medium prose-headings:text-white">
          {children}
        </div>
      </Reveal>
    </div>
  </section>
);

export default StreamingFromTheLostWorld;
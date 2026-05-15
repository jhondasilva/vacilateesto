import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, Mountain, SignalHigh, Satellite, Battery, Video, Radio, Users, Globe2, Sparkles, Share2 } from "lucide-react";

const SITE = "https://www.vacilateesto.com";
const URL = `${SITE}/streaming-from-the-lost-world`;

const SECTIONS = [
  { num: "01", title: "The Context" },
  { num: "02", title: "The Idea" },
  { num: "03", title: "The Enabler" },
  { num: "04", title: "The Execution" },
  { num: "05", title: "The Streams" },
  { num: "06", title: "Community Engagement" },
  { num: "07", title: "The Results" },
];

const StreamingFromTheLostWorld = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToContext = () => {
    document.getElementById("context")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#05080f] text-white overflow-x-hidden">
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

      {/* Grid background */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 40%, rgba(56,140,210,0.18), transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(245,158,11,0.08), transparent 55%)",
        }}
      />

      {/* Top bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-5 sm:px-10 py-5 flex items-center justify-between transition-colors ${
          scrolled ? "bg-[#05080f]/80 backdrop-blur-md" : ""
        }`}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <div className="text-[10px] sm:text-xs tracking-[0.25em] text-white/50 uppercase">
          Cannes Lions 2026 — Case Study
        </div>
      </header>

      <main className="relative">
        {/* HERO */}
        <section className="min-h-screen flex items-center px-5 sm:px-10 lg:px-20 pt-28 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full max-w-7xl mx-auto">
            <div>
              <h1 className="font-black leading-[1.05] tracking-tight">
                <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white">
                  The First
                </span>
                <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-sky-400 mt-1">
                  Live Broadcast
                </span>
                <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white/85 mt-3">
                  from the Summit of
                </span>
                <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-amber-400 mt-1">
                  Mount Roraima
                </span>
              </h1>

              <p className="mt-8 max-w-md text-base sm:text-lg text-white/60 leading-relaxed">
                A community-powered expedition that turned a nation's gaze upward — zero paid media, pure human connection.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 text-xs font-semibold tracking-wider uppercase">
                  <Mountain className="w-3.5 h-3.5" /> 2,810m Altitude
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sky-400/40 bg-sky-400/10 text-sky-300 text-xs font-semibold tracking-wider uppercase">
                  <SignalHigh className="w-3.5 h-3.5" /> Starlink Powered
                </span>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] tracking-[0.2em] uppercase text-white/40">
                <span><span className="text-white/30">Agency</span> <span className="text-white/70">La Web Figital Agency</span></span>
                <span className="text-white/20">|</span>
                <span><span className="text-white/30">Client</span> <span className="text-white/70">Vacílate Esto</span></span>
                <span className="text-white/20">|</span>
                <span className="text-white/70">Cannes Lions 2026</span>
              </div>
            </div>

            {/* Logo / mark */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 m-auto w-[420px] h-[420px] max-w-full rounded-full bg-sky-500/10 blur-3xl" />
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full text-white/70">
                  <ellipse
                    cx="200"
                    cy="200"
                    rx="180"
                    ry="70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    transform="rotate(-18 200 200)"
                  />
                </svg>
                <div className="relative text-center px-6">
                  <div className="text-[0.65rem] sm:text-xs tracking-[0.6em] text-white/80 font-semibold">STREAMING</div>
                  <div className="text-[0.55rem] sm:text-[0.65rem] tracking-[0.6em] text-white/60 mt-1">FROM THE</div>
                  <div className="text-3xl sm:text-5xl font-black tracking-tight mt-2 text-white">LOST WORLD</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={scrollToContext}
            aria-label="Scroll down"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 hover:text-white/80 transition-colors animate-bounce"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </section>

        {/* Stats banner */}
        <section className="px-5 sm:px-10 lg:px-20 py-16">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
            {[
              { big: "76,000+", label: "Organic Likes", sub: "Without paid promotion" },
              { big: "1.4M+", label: "Organic Reach", sub: "Total impressions" },
              { big: "98%", label: "Positive Sentiment", sub: "Shift in national narrative" },
              { big: "1st", label: "Historical Milestone", sub: "First live stream from Roraima summit" },
            ].map((s) => (
              <div key={s.label} className="bg-[#070b14] p-6 sm:p-8">
                <div className="text-3xl sm:text-4xl font-black text-amber-400">{s.big}</div>
                <div className="text-sm font-semibold text-white mt-2">{s.label}</div>
                <div className="text-xs text-white/50 mt-1">{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Section template helper */}
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
        <SectionWrap num="02" title="The Idea">
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
        <SectionWrap num="03" title="The Enabler">
          <p>
            A custom-built backpack system that turned a human climber into a mobile broadcast station — carrying satellite connectivity, autonomous power, and live production capabilities to 2,810 meters.
          </p>
          <div className="not-prose grid sm:grid-cols-2 gap-4 mt-10">
            {[
              { icon: Satellite, title: "Starlink Antenna", text: "Satellite internet from the summit at 2,810m altitude" },
              { icon: Battery, title: "Autonomous Power", text: "Solar-powered battery system for 72+ hours of operation" },
              { icon: Video, title: "Live Production", text: "Real-time video production from the tepui summit" },
              { icon: Radio, title: "Live Streaming", text: "Uninterrupted broadcast to social platforms worldwide" },
            ].map((c) => (
              <div key={c.title} className="p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <c.icon className="w-6 h-6 text-sky-400 mb-3" />
                <div className="font-semibold text-white">{c.title}</div>
                <div className="text-sm text-white/60 mt-1">{c.text}</div>
              </div>
            ))}
          </div>
          <h3 className="!mt-12">The Backpack Antenna System</h3>
          <p>
            Every component — Starlink dish, solar panels, batteries, encoding hardware, and cameras — was engineered to fit inside a single expedition backpack. The system was designed for the 6-day trek through jungle, river crossings, and vertical rock faces. Total weight: portable enough for one person. Capability: broadcast-grade live production from anywhere on Earth.
          </p>
        </SectionWrap>

        {/* 04 Execution */}
        <SectionWrap num="04" title="The Execution">
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
        <SectionWrap num="05" title="The Streams">
          <p>
            Every broadcast captured from the summit of Mount Roraima — raw, unedited footage streamed live to thousands of viewers via Starlink satellite from 2,810 meters above sea level.
          </p>
          <div className="not-prose mt-8 p-6 rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="text-sm font-semibold">Summit Streaming Archive</div>
                <div className="text-xs text-white/50">Live recordings from the expedition</div>
              </div>
              <a
                href="https://drive.google.com/drive/folders/1mT6FpJuZl4p7FlKGhKm_3JXWaBCYSNzX"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
              >
                Open in Drive
              </a>
            </div>
          </div>
          <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden mt-6">
            {[
              { big: "15+", label: "Live Streams", sub: "Broadcast from the summit" },
              { big: "Satellite", label: "Signal", sub: "Via Starlink at 2,810m" },
              { big: "Thousands", label: "Live", sub: "Real-time concurrent viewers" },
            ].map((s) => (
              <div key={s.label} className="bg-[#070b14] p-6">
                <div className="text-2xl sm:text-3xl font-black text-sky-400">{s.big}</div>
                <div className="text-sm font-semibold text-white mt-2">{s.label}</div>
                <div className="text-xs text-white/50 mt-1">{s.sub}</div>
              </div>
            ))}
          </div>
        </SectionWrap>

        {/* 06 Community */}
        <SectionWrap num="06" title="Innovative Engagement of Community">
          <p>
            This wasn't a broadcast — it was a shared expedition. The community didn't just watch; they participated, guided, and amplified the experience organically.
          </p>
          <div className="not-prose grid sm:grid-cols-2 gap-4 mt-10">
            {[
              { icon: Users, title: "Organic Community", text: "Zero paid media — every like, share, and comment was earned through authentic human connection" },
              { icon: Sparkles, title: "Real-time Interaction", text: "Audiences engaged live with the expedition, asking questions, suggesting angles, and sharing the moment" },
              { icon: Globe2, title: "Cultural Reclamation", text: "Venezuelans rediscovered national pride through a shared digital experience of their own natural wonder" },
              { icon: Share2, title: "Cross-platform Virality", text: "Content spread organically across Instagram, TikTok, YouTube and X through community-driven sharing" },
            ].map((c) => (
              <div key={c.title} className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
                <c.icon className="w-6 h-6 text-amber-400 mb-3" />
                <div className="font-semibold text-white">{c.title}</div>
                <div className="text-sm text-white/60 mt-1">{c.text}</div>
              </div>
            ))}
          </div>
          <h3 className="!mt-12">Social Insight</h3>
          <p>
            The algorithm is designed to amplify what already has momentum. By creating content so inherently extraordinary — a <strong>first-ever live stream from an unreachable summit</strong> — we didn't need to fight the algorithm. We gave the community something worth sharing, and they became the distribution engine.
          </p>
          <p>
            <strong>76,000+ organic likes</strong> and <strong>1.4 million organic impressions</strong> — achieved with zero paid media spend. The community didn't just engage; they <em>owned</em> the narrative, turning a digital ecosystem's expedition into a national moment of collective wonder.
          </p>
        </SectionWrap>

        {/* 07 Results */}
        <SectionWrap num="07" title="The Results" last>
          <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden mt-2">
            {[
              { big: "76,000+", label: "Organic Likes" },
              { big: "1.4M+", label: "Organic Reach" },
              { big: "98%", label: "Positive Sentiment" },
              { big: "1st Ever", label: "Live Stream from Roraima Summit" },
            ].map((s) => (
              <div key={s.label} className="bg-[#070b14] p-6 sm:p-8">
                <div className="text-3xl sm:text-4xl font-black text-amber-400">{s.big}</div>
                <div className="text-sm font-semibold text-white/80 mt-2">{s.label}</div>
              </div>
            ))}
          </div>
          <h3 className="!mt-14">A Historical Milestone</h3>
          <p>
            The first live broadcast from the summit of one of Earth's oldest mountains. A community-powered moment that proved authentic content, shared in real time, can outpace any algorithm — and reframe an entire national conversation.
          </p>
        </SectionWrap>

        {/* Footer */}
        <footer className="px-5 sm:px-10 lg:px-20 py-16 border-t border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="text-xs tracking-[0.3em] uppercase text-white/40">Case Study</div>
              <div className="text-2xl font-black mt-2">Streaming From The Lost World</div>
              <div className="text-sm text-white/50 mt-1">Vacílate Esto · La Web Figital Agency · Cannes Lions 2026</div>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 hover:bg-white/5 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Vacílate Esto
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
};

const SectionWrap = ({
  id,
  num,
  title,
  children,
  last,
}: {
  id?: string;
  num: string;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) => (
  <section
    id={id}
    className={`px-5 sm:px-10 lg:px-20 py-20 sm:py-28 ${!last ? "border-t border-white/5" : ""}`}
  >
    <div className="max-w-4xl mx-auto">
      <div className="text-7xl sm:text-8xl font-black text-white/[0.06] leading-none">{num}</div>
      <h2 className="text-3xl sm:text-5xl font-black tracking-tight mt-2 mb-10">{title}</h2>
      <div className="prose prose-invert prose-lg max-w-none prose-p:text-white/70 prose-p:leading-relaxed prose-strong:text-white prose-em:text-sky-300 prose-headings:text-white">
        {children}
      </div>
    </div>
  </section>
);

export default StreamingFromTheLostWorld;
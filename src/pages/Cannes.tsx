import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Radio,
  Search,
  Sparkles,
  Users,
  LayoutGrid,
  Headphones,
  Workflow,
  Activity,
  Layers,
  Trophy,
  ExternalLink,
  Database,
  Mic,
  Bot,
  ShieldCheck,
  Music,
  Globe2,
  Cpu,
  Code2,
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Circle,
} from "lucide-react";

const SITE = "https://www.vacilateesto.com";
const URL = `${SITE}/cannes`;
const AUDIO_URL = "https://creativehub.vacilateesto.com/cannesaudio";

const SECTIONS = [
  { id: "overview", num: "01", title: "Overview", icon: Radio },
  { id: "trends", num: "02", title: "Trends (Perplexity)", icon: Search },
  { id: "generation", num: "03", title: "Generation (Gemini)", icon: Sparkles },
  { id: "personalities", num: "04", title: "AI Personalities", icon: Users },
  { id: "hub", num: "05", title: "Creative Hub", icon: LayoutGrid },
  { id: "audio", num: "06", title: "Audio Pipeline", icon: Headphones },
  { id: "make", num: "07", title: "Make.com Internals", icon: Workflow },
  { id: "monitoring", num: "08", title: "RT Monitoring", icon: Activity },
  { id: "stack", num: "09", title: "Tech Stack", icon: Layers },
  { id: "innovations", num: "10", title: "Cannes Innovations", icon: Trophy },
];

const TECH_PILLS = [
  "Perplexity Sonar",
  "Gemini 2.5 Flash",
  "OpenAI ChatGPT",
  "0CodeKit (Python)",
  "ElevenLabs TTS",
  "Make.com",
  "Google Drive",
  "React 18",
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

const SectionHeader = ({
  num,
  title,
  subtitle,
}: {
  num: string;
  title: string;
  subtitle?: string;
}) => (
  <Reveal>
    <div className="flex items-baseline gap-4 mb-4">
      <span className="text-7xl sm:text-8xl font-black text-white/[0.06] leading-none select-none">
        {num}
      </span>
      <span className="text-[10px] tracking-[0.4em] uppercase text-white/40">
        Section {num}
      </span>
    </div>
    <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">{title}</h2>
    {subtitle && <p className="text-white/55 text-sm sm:text-base mb-10">{subtitle}</p>}
  </Reveal>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 ${className}`}
  >
    {children}
  </div>
);

const Pill = ({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "rose" | "amber" | "emerald" | "sky";
}) => {
  const tones: Record<string, string> = {
    default: "border-white/15 bg-white/5 text-white/80",
    rose: "border-rose-400/30 bg-rose-400/10 text-rose-200",
    amber: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    emerald: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    sky: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
};

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
  <pre className="text-[12px] leading-relaxed font-mono bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto text-white/85 whitespace-pre-wrap">
    <code>{children}</code>
  </pre>
);

const Cannes = () => {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>("overview");

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
    <div className="min-h-screen bg-[#05080f] text-white overflow-x-hidden selection:bg-rose-400/30 selection:text-white">
      <Helmet>
        <title>Vacílate AI Radio — Cannes 2026 Technical Dossier · Vacílate Esto</title>
        <meta
          name="description"
          content="AI + Data + Automation = a daily FM radio show. Multi-LLM pipeline orchestrating Perplexity, Gemini, ChatGPT, 0CodeKit and ElevenLabs to capture two Venezuelan hosts' soul."
        />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content="Vacílate AI Radio — Cannes 2026 Technical Dossier" />
        <meta property="og:description" content="A 5-AI pipeline that turns curated topics into a fully produced FM radio show, in the voice of Jhon and Juan." />
        <meta property="og:url" content={URL} />
      </Helmet>

      {/* Scroll progress */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[60] bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400 transition-[width] duration-150"
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
            "radial-gradient(ellipse at 75% 25%, rgba(244,63,94,0.20), transparent 55%), radial-gradient(ellipse at 15% 85%, rgba(245,158,11,0.10), transparent 55%)",
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
        <div className="hidden sm:flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-rose-400/15 border border-rose-400/30 text-rose-200 text-[10px] tracking-[0.3em] uppercase font-bold">
            Cannes 2026
          </span>
          <span className="text-[10px] sm:text-xs tracking-[0.3em] text-white/45 uppercase">
            Technical Dossier — Radio Module
          </span>
        </div>
        <span className="hidden sm:inline-flex px-3 py-1 rounded-full border border-white/10 text-[10px] tracking-[0.25em] uppercase text-white/60">
          Category: AI Usage
        </span>
      </header>

      {/* Side dot nav */}
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
                    ? "w-3 h-3 bg-rose-400 ring-4 ring-rose-400/15"
                    : "w-2 h-2 bg-white/30 group-hover:bg-white/70"
                }`}
              />
            </button>
          );
        })}
      </nav>

      <main className="relative">
        {/* HERO */}
        <section className="relative min-h-[100svh] flex items-center px-5 sm:px-10 lg:px-20 pt-32 pb-20">
          <div className="max-w-5xl mx-auto w-full text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rose-400/30 bg-rose-400/10 text-[11px] tracking-[0.25em] uppercase text-rose-200 mb-8">
                <Radio className="w-3.5 h-3.5" />
                Vacílate AI Radio
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="font-black leading-[1.02] tracking-tight text-4xl sm:text-6xl md:text-7xl">
                AI + Data + Automation ={" "}
                <span className="block sm:inline bg-gradient-to-r from-rose-300 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                  A FM Daily Radio Show
                </span>
              </h1>
            </Reveal>
            <Reveal delay={250}>
              <p className="mt-8 max-w-3xl mx-auto text-base sm:text-lg text-white/65 leading-relaxed">
                Multiple AI models, real-time data, and automation platforms — all orchestrated to capture the{" "}
                <strong className="text-white">cadence, slang, humor, and soul</strong> of two Venezuelan hosts. From
                Perplexity trends to ElevenLabs cloned voices, every layer is trained to speak{" "}
                <strong className="text-white">"Chamo"</strong>, think in{" "}
                <strong className="text-white">Venezuelan rhythm</strong>, and deliver content that sounds like Jhon and
                Juan — not like a machine.
              </p>
            </Reveal>
            <Reveal delay={350}>
              <div className="flex flex-wrap justify-center gap-2 mt-10">
                {TECH_PILLS.map((t) => (
                  <Pill key={t}>{t}</Pill>
                ))}
              </div>
            </Reveal>
            <Reveal delay={450}>
              <div className="flex flex-wrap justify-center gap-3 mt-10">
                <a
                  href={AUDIO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white text-sm font-semibold hover:shadow-[0_8px_30px_-8px_rgba(244,63,94,0.6)] transition-shadow"
                >
                  <Headphones className="w-4 h-4" />
                  Listen to AI-Generated Radio Shows
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <button
                  onClick={() => scrollTo("overview")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 hover:bg-white/5 text-sm font-semibold transition-colors"
                >
                  Read the dossier
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 01 OVERVIEW */}
        <section id="overview" className="px-5 sm:px-10 lg:px-20 py-20 sm:py-28 border-t border-white/[0.06] scroll-mt-24">
          <div className="max-w-5xl mx-auto">
            <SectionHeader num="01" title="Overview" />
            <Reveal delay={100}>
              <div className="prose prose-invert prose-lg max-w-none prose-p:text-white/70 prose-strong:text-white">
                <p>
                  <strong>Vacílate AI Radio</strong> is built around the <strong>Creative Hub</strong> — a production interface where the editorial team doesn't just click a button, but actively shapes each show. First, the team selects a date and generates topics informed by{" "}
                  <strong>Metricool analytics data, Perplexity real-time trends, and 8 curated content pillars</strong>. Then comes the critical editorial phase: reviewing each topic, reordering for narrative flow, replacing weak topics, editing titles, and ensuring the right balance of culture, humor, and information. Only when the lineup is editorially approved does the team click <strong>"Send to Production"</strong> — triggering the fully automated Make.com pipeline where{" "}
                  <strong>OpenAI ChatGPT</strong>, <strong>Google Gemini</strong>, <strong>0CodeKit Python</strong>, and{" "}
                  <strong>ElevenLabs</strong> transform curated topics into a complete audio show. The finished audio lands in Google Drive and the Hub is notified via webhook callback — all without leaving the interface.
                </p>
              </div>
            </Reveal>

            {/* Pipeline Architecture */}
            <Reveal delay={150}>
              <div className="mt-12 text-[11px] tracking-[0.3em] uppercase text-white/45 mb-4">Pipeline Architecture</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    n: 1,
                    title: "Trend Discovery",
                    sub: "Perplexity Sonar",
                    color: "from-rose-500/15 to-rose-500/5 border-rose-400/30",
                    icon: Search,
                    bullets: [
                      "Viral trends only (48–72h)",
                      "Dual ethical filtering",
                      "Source: TikTok, YouTube, X, Instagram",
                    ],
                  },
                  {
                    n: 2,
                    title: "Smart Topic Generation",
                    sub: "Gemini 2.5 Flash",
                    color: "from-amber-500/15 to-amber-500/5 border-amber-400/30",
                    icon: Sparkles,
                    bullets: [
                      "8 content pillars (stories, curiosities, culture…)",
                      "Fed by past publication performance data",
                      "Anti-hallucination protocol (C.R.E.A.R.)",
                      "Learns what works: top pillars, reach, engagement",
                      "Not just trends — data-informed original content",
                    ],
                  },
                  {
                    n: 3,
                    title: "Creative Hub Curation",
                    sub: "Human Editorial Control",
                    color: "from-emerald-500/15 to-emerald-500/5 border-emerald-400/30",
                    icon: LayoutGrid,
                    bullets: [
                      "Review & approve each topic",
                      "Drag & drop reordering",
                      "Edit, delete, regenerate, add",
                      "Mix trends + pillar topics",
                      "Send to Production →",
                    ],
                  },
                  {
                    n: 4,
                    title: "Audio Production",
                    sub: "Make · ChatGPT · Gemini · 0CodeKit · ElevenLabs",
                    color: "from-sky-500/15 to-sky-500/5 border-sky-400/30",
                    icon: Headphones,
                    bullets: [
                      "4-path router (Intro/Chapters/Closing/Callback)",
                      "Multi-LLM scripts (ChatGPT + Gemini)",
                      "0CodeKit split/join voices",
                      "Cloned voice TTS",
                      "Drive upload + webhook callback",
                    ],
                  },
                ].map((card) => (
                  <div
                    key={card.n}
                    className={`rounded-2xl border bg-gradient-to-br ${card.color} p-5 backdrop-blur-sm flex flex-col`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/15 flex items-center justify-center">
                        <card.icon className="w-4 h-4 text-white/85" />
                      </div>
                      <span className="text-3xl font-black text-white/15">{card.n}</span>
                    </div>
                    <h3 className="font-bold text-white mb-1">{card.title}</h3>
                    <div className="text-[11px] tracking-wider uppercase text-white/55 mb-4">{card.sub}</div>
                    <ul className="space-y-1.5 text-xs text-white/70 leading-relaxed">
                      {card.bullets.map((b) => (
                        <li key={b} className="flex gap-2">
                          <span className="text-white/40">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={250}>
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {["Viral trends", "AI-generated topics", "Curated lineup", "Audio MP3"].map((t, i) => (
                  <div key={t} className="rounded-xl border border-white/10 bg-white/[0.02] py-4">
                    <div className="text-[10px] tracking-widest uppercase text-white/40 mb-1">Step {i + 1}</div>
                    <div className="text-sm font-semibold text-white/85">{t}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={300}>
              <Card className="mt-8 bg-gradient-to-br from-rose-500/10 via-white/[0.02] to-amber-500/10 border-rose-400/20">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🔄</div>
                  <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                    <strong className="text-white">Intelligence Loop:</strong> Performance data feeds smarter topics →
                    AI-modeled host personalities shape the scripts → cloned voices deliver authentic Venezuelan cadence
                    → results feed the next cycle.
                  </p>
                </div>
              </Card>
            </Reveal>
          </div>
        </section>

        {/* 02 TRENDS */}
        <section id="trends" className="px-5 sm:px-10 lg:px-20 py-20 sm:py-28 border-t border-white/[0.06] scroll-mt-24">
          <div className="max-w-5xl mx-auto">
            <SectionHeader num="02" title="Real-Time Trends" subtitle="Perplexity Sonar API" />
            <Reveal delay={100}>
              <p className="text-white/70 leading-relaxed mb-8">
                Perplexity Sonar's <strong className="text-white">exclusive role</strong> is trend discovery — it searches what's viral <em className="text-rose-300 not-italic font-medium">right now</em> (48–72h) so the show is relevant on air day.{" "}
                <strong className="text-white">It does NOT generate topics or stories</strong> — that's Gemini's job (Section 3). Perplexity only feeds real-time trends that the editorial team can mix with Gemini's original pillar-based content.
              </p>
            </Reveal>

            <div className="grid lg:grid-cols-2 gap-6">
              <Reveal delay={150}>
                <Card>
                  <h3 className="text-sm tracking-[0.25em] uppercase text-white/50 mb-4">Radio-Specific Prompt</h3>
                  <CodeBlock>{`Search for the 8 most viral trends (48-72h)
on TikTok, YouTube, X, Instagram & Google Trends
for "Vacílate AI" — informal Venezuelan radio.

PROGRAM CONTEXT:
- Colloquial tone: "Chamo", "Pana", "Burda", "Fino"
- Fast-paced, spontaneous rhythm
- Prioritize DEBATE and CONVERSATION

Include 1-2 MUSIC trends
Include 1-2 from VENEZUELA/Latin America`}</CodeBlock>
                </Card>
              </Reveal>

              <Reveal delay={200}>
                <Card>
                  <h3 className="text-sm tracking-[0.25em] uppercase text-white/50 mb-4">Dual Ethical Filtering</h3>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-white/10 bg-black/30 p-4">
                      <div className="text-[10px] tracking-widest uppercase text-rose-300 font-bold mb-1">Layer 1</div>
                      <div className="text-sm text-white/75">Prompt instruction: exclude politics, wars, religion, violence</div>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/30 p-4">
                      <div className="text-[10px] tracking-widest uppercase text-amber-300 font-bold mb-1">Layer 2</div>
                      <div className="text-sm text-white/75">Post-processing: 25+ programmatically blocked keywords</div>
                    </div>
                  </div>
                  <h3 className="text-sm tracking-[0.25em] uppercase text-white/50 mt-6 mb-3">Radio Pillars</h3>
                  <div className="flex flex-wrap gap-2">
                    {["pop culture", "celebrities", "curiosities", "technology", "AI", "sports", "venezuela", "gastronomy", "music"].map((p) => (
                      <Pill key={p} tone="rose">{p}</Pill>
                    ))}
                  </div>
                </Card>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 03 GENERATION */}
        <section id="generation" className="px-5 sm:px-10 lg:px-20 py-20 sm:py-28 border-t border-white/[0.06] scroll-mt-24">
          <div className="max-w-5xl mx-auto">
            <SectionHeader num="03" title="Topic Generation & Verification" subtitle="Google Gemini 2.5 Flash · Temp 0.3 · 4096 tokens" />
            <Reveal delay={100}>
              <p className="text-white/70 leading-relaxed mb-10">
                Gemini is the <strong className="text-white">content brain</strong> of the system — and it's not working blind. The Analytics section of the Creative Hub continuously tracks the performance of every published post:{" "}
                <strong className="text-white">which topics got the most views, which content pillars drove the highest engagement, and what angles resonated most with the audience</strong>. This performance data is fed directly into the topic generators, so when Gemini creates new topics, it already knows what worked before — and{" "}
                <strong className="text-white">suggests fresh angles on proven themes</strong>. Combined with 8 content pillars, real-time Perplexity trends, and anti-hallucination safeguards, the result is a{" "}
                <strong className="text-white">self-improving content engine</strong> where past success directly shapes future creativity.
              </p>
            </Reveal>

            {/* Anti-Hallucination */}
            <Reveal delay={150}>
              <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-300" /> Anti-Hallucination Protocol (6 Layers)
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { l: "Layer 1: Identity", t: "Restricted role: 'Specialist in REAL AND 100% VERIFIABLE topics'" },
                  { l: "Layer 2: Prohibitions", t: "Pattern blacklist: ❌ 'Study reveals that…', ❌ 'The [brand] initiative…'" },
                  { l: "Layer 3: Positive examples", t: "✅ Verifiable anniversaries · ✅ Geographic data · ✅ Pop culture milestones" },
                  { l: "Layer 4: Captured real case", t: "'The Guayoyo river in Portuguesa' — that river DOESN'T EXIST. The LLM invented it." },
                  { l: "Layer 5: High-risk zones", t: "Venezuelan etymologies, local geography, exact statistics" },
                  { l: "Layer 6: Certainty labeling", t: "🟢 Confirmed · 🟡 Probable · 🟠 Theory · 🔴 Unknown" },
                ].map((x) => (
                  <Card key={x.l} className="!p-5">
                    <div className="text-[10px] tracking-widest uppercase text-amber-300 font-bold mb-2">{x.l}</div>
                    <div className="text-sm text-white/75 leading-relaxed">{x.t}</div>
                  </Card>
                ))}
              </div>
              <Card className="mt-6 bg-amber-400/5 border-amber-400/20">
                <p className="text-sm text-white/80 italic">
                  "If I don't know the real origin, I say it's uncertain.{" "}
                  <strong className="text-white not-italic">I NEVER fabricate evidence.</strong>"
                </p>
              </Card>
            </Reveal>

            {/* C.R.E.A.R. */}
            <Reveal delay={200}>
              <h3 className="text-xl font-bold mt-12 mb-5">C.R.E.A.R. Methodology — How We Classify Information</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: CheckCircle2, color: "text-emerald-300 border-emerald-400/30 bg-emerald-400/5", tag: "🟢 CONFIRMED", t: "Fact verified with primary sources: dates, public records, official data. Example: 'Angel Falls is 979m tall' — UNESCO verified." },
                  { icon: Circle, color: "text-amber-300 border-amber-400/30 bg-amber-400/5", tag: "🟡 PROBABLE", t: "Widely accepted with multiple secondary sources but no absolute proof. Example: 'The arepa originated in pre-Columbian times' — archaeological evidence supports it." },
                  { icon: AlertTriangle, color: "text-orange-300 border-orange-400/30 bg-orange-400/5", tag: "🟠 THEORY / LEGEND", t: "Popular belief or cultural tradition without scientific backing. The AI explicitly labels it as such. Example: 'They say guayoyo got its name from the Guayoyo river' — ⚠️ that river doesn't exist." },
                  { icon: XCircle, color: "text-rose-300 border-rose-400/30 bg-rose-400/5", tag: "🔴 UNKNOWN", t: "No reliable source found. The AI states it doesn't know rather than inventing. Example: 'The exact origin of chamo is debated — no consensus exists.'" },
                ].map((x) => (
                  <div key={x.tag} className={`rounded-xl border p-5 ${x.color}`}>
                    <div className="text-sm font-bold mb-2">{x.tag}</div>
                    <div className="text-xs text-white/75 leading-relaxed">{x.t}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/65 leading-relaxed mt-6">
                <strong className="text-white">How it works in practice:</strong> When the LLM generates a topic involving Venezuelan etymologies, local geography, or historical claims, the prompt forces it to self-classify each claim. If a claim falls into 🟠 or 🔴, the script must include phrases like <em>"se dice que…"</em> or <em>"aunque no está confirmado…"</em> — never presenting legends as facts. This was implemented after the Guayoyo river incident.
              </p>
            </Reveal>

            {/* Data-driven & Anti-dup */}
            <div className="grid lg:grid-cols-2 gap-6 mt-12">
              <Reveal delay={250}>
                <Card>
                  <h3 className="text-sm tracking-[0.25em] uppercase text-white/50 mb-4">Data-Driven Prompting</h3>
                  <CodeBlock>{`📊 ACCUMULATED PERFORMANCE DATA:

Most effective pillars:
  Pop Culture (weight: 35/100)
  Music (weight: 25/100)

Top historical posts:
  "Did you know Angel Falls..."
  → Sparked debate with little-known facts

Recommendations:
  More music content
  Fewer generic anniversaries

⚠️ USE THIS DATA to prioritize topics
   similar to best performers`}</CodeBlock>
                  <p className="text-xs text-white/45 mt-3">
                    Source: <code className="text-white/70">content_performance_insights</code> table fed by Metricool CSVs
                  </p>
                </Card>
              </Reveal>
              <Reveal delay={300}>
                <Card>
                  <h3 className="text-sm tracking-[0.25em] uppercase text-white/50 mb-4">Anti-Duplication</h3>
                  <CodeBlock>{`// Load up to 500 historical topics
const { data } = await supabase
  .from('generated_topics_history')
  .select('topic_title')
  .eq('generator_type', 'radio')
  .limit(500);

// Injected into prompt:
🚫 BLOCKED TOPICS (127 already used):
1. "Did you know Angel Falls...?"
2. "The history of the first World Cup"
...
⚠️ Generate COMPLETELY NEW topics`}</CodeBlock>
                </Card>
              </Reveal>
            </div>

            {/* Distribution */}
            <Reveal delay={350}>
              <h3 className="text-xl font-bold mt-12 mb-5">Mandatory Content Distribution</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { q: "Max 1", l: "Anniversary", c: "border-white/15" },
                  { q: "1–2 required", l: "Music", c: "border-rose-400/30 bg-rose-400/5" },
                  { q: "1–2 curiosities", l: "Venezuela", c: "border-amber-400/30 bg-amber-400/5" },
                  { q: "3–4", l: "Pop Culture + Tech", c: "border-emerald-400/30 bg-emerald-400/5" },
                ].map((x) => (
                  <div key={x.l} className={`rounded-xl border p-5 text-center ${x.c}`}>
                    <div className="text-xs tracking-widest uppercase text-white/50 mb-2">{x.q}</div>
                    <div className="font-semibold text-white">{x.l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* 04 PERSONALITIES */}
        <section id="personalities" className="px-5 sm:px-10 lg:px-20 py-20 sm:py-28 border-t border-white/[0.06] scroll-mt-24">
          <div className="max-w-5xl mx-auto">
            <SectionHeader num="04" title="AI-Modeled Personalities" subtitle="Jhon Da Silva & Juan Carlos Martínez" />

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  name: "Juan Carlos Martínez",
                  handle: "@juansofá",
                  role: "The Researcher",
                  style: "Structured, deep, spiritual",
                  philosophy: "Christian, curious",
                  expertise: "Tech, AI, videogames, science, Marvel/DC",
                  expressions: ["Me voló la cabeza", "Vacílate esto, pana"],
                  keywords: ["IA", "tecnología", "OpenAI", "videojuegos", "Marvel", "ciencia", "espacio"],
                  accent: "from-sky-500/15 to-sky-500/5 border-sky-400/30",
                },
                {
                  name: "Jhon Da Silva",
                  handle: "@JhonSnacks",
                  role: "The Emotional Connector",
                  style: "Creative, dry humor, reflective",
                  philosophy: "Agnostic, stoicism, Portuguese culture",
                  expertise: "Football (CR7/Portugal), marketing, baseball",
                  expressions: ["Qué bien", "Aguanta chupeta que lo que viene es lengua", "Llévatelo", "Métele"],
                  keywords: ["Cristiano Ronaldo", "fútbol", "Portugal", "marketing", "béisbol", "estoicismo"],
                  accent: "from-rose-500/15 to-rose-500/5 border-rose-400/30",
                },
              ].map((host, i) => (
                <Reveal key={host.name} delay={i * 120}>
                  <div className={`rounded-2xl border bg-gradient-to-br ${host.accent} p-6 sm:p-8 h-full`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-2xl font-black text-white">{host.name}</div>
                        <div className="text-sm text-white/55 mt-1">{host.handle}</div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                        <Mic className="w-4 h-4 text-white/85" />
                      </div>
                    </div>
                    <div className="text-[10px] tracking-[0.3em] uppercase text-white/55 font-bold mb-6">{host.role}</div>
                    <dl className="space-y-3 text-sm">
                      {[
                        ["Style", host.style],
                        ["Philosophy", host.philosophy],
                        ["Expertise", host.expertise],
                      ].map(([k, v]) => (
                        <div key={k as string} className="grid grid-cols-[100px_1fr] gap-3">
                          <dt className="text-[10px] tracking-widest uppercase text-white/40 pt-0.5">{k}</dt>
                          <dd className="text-white/85">{v}</dd>
                        </div>
                      ))}
                      <div className="grid grid-cols-[100px_1fr] gap-3">
                        <dt className="text-[10px] tracking-widest uppercase text-white/40 pt-0.5">Expressions</dt>
                        <dd className="flex flex-wrap gap-1.5">
                          {host.expressions.map((e) => (
                            <span key={e} className="px-2 py-0.5 rounded-md bg-white/10 text-xs text-white/85 italic">
                              "{e}"
                            </span>
                          ))}
                        </dd>
                      </div>
                      <div className="grid grid-cols-[100px_1fr] gap-3">
                        <dt className="text-[10px] tracking-widest uppercase text-white/40 pt-0.5">Keywords</dt>
                        <dd className="flex flex-wrap gap-1.5">
                          {host.keywords.map((k) => (
                            <Pill key={k}>{k}</Pill>
                          ))}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Selection */}
            <Reveal delay={250}>
              <h3 className="text-xl font-bold mt-14 mb-5">Automatic Selection by Keyword Density</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { topic: '"Cristiano Ronaldo breaks Champions record"', jhon: 3, juan: 0, winner: "Jhon", color: "rose" },
                  { topic: '"OpenAI launches new AI model"', jhon: 0, juan: 3, winner: "Juan", color: "sky" },
                  { topic: '"Best memes of the week"', jhon: 0, juan: 0, winner: "Random", color: "amber" },
                ].map((ex) => (
                  <Card key={ex.topic} className="!p-5">
                    <div className="text-sm font-medium text-white/85 mb-4 min-h-[40px]">{ex.topic}</div>
                    <div className="flex items-center justify-between text-xs text-white/60 mb-3">
                      <span>Jhon: <span className="text-rose-300 font-bold">{ex.jhon}</span></span>
                      <span>Juan: <span className="text-sky-300 font-bold">{ex.juan}</span></span>
                    </div>
                    <Pill tone={ex.color as "rose" | "sky" | "amber"}>→ {ex.winner}</Pill>
                  </Card>
                ))}
              </div>
            </Reveal>

            {/* Dialog dynamics */}
            <Reveal delay={300}>
              <h3 className="text-xl font-bold mt-14 mb-5">LLM Dialog Dynamics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["Juan presents", "Jhon reacts", "Juan dives deeper", "Jhon connects with audience"].map((s, i) => (
                  <div key={s} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="text-2xl font-black text-white/15 mb-1">0{i + 1}</div>
                    <div className="text-sm text-white/85">{s}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* 05 CREATIVE HUB */}
        <section id="hub" className="px-5 sm:px-10 lg:px-20 py-20 sm:py-28 border-t border-white/[0.06] scroll-mt-24">
          <div className="max-w-5xl mx-auto">
            <SectionHeader num="05" title="The Creative Hub — Editorial Command Center" subtitle="Where Data, Trends, and Human Instinct Converge" />
            <Reveal delay={100}>
              <p className="text-white/70 leading-relaxed mb-10">
                The Creative Hub is <strong className="text-white">the most critical piece</strong> of the entire pipeline — it's where AI meets editorial judgment. Before any audio is produced, the team works in the Hub to build the perfect show lineup. This isn't a "click and forget" system:{" "}
                <strong className="text-white">every show is shaped by human editorial decisions</strong> informed by data, trends, and content strategy.
              </p>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  n: 1,
                  title: "Select & Generate",
                  bullets: [
                    "Pick the show date",
                    "AI generates 8 topics from data + pillars",
                    "Analytics from Metricool inform topic relevance",
                    "Real-time Perplexity trends available to inject",
                    "Each topic tagged with content pillar & verification level",
                  ],
                },
                {
                  n: 2,
                  title: "Review & Refine",
                  bullets: [
                    "Drag & drop to reorder for narrative flow",
                    "Edit any topic title inline",
                    "Delete weak topics, regenerate individual slots",
                    "Replace with trending topics from Perplexity",
                    "Add manual topics from editorial instinct",
                    "Verify balance across content pillars",
                  ],
                },
                {
                  n: 3,
                  title: "Approve & Send",
                  bullets: [
                    "Final review of curated 8-topic lineup",
                    'One click: "Send to Production"',
                    "Webhook fires to Make.com with full payload",
                    "Program saved to database with request_id",
                    "Real-time status tracking begins",
                    "Hub awaits callback with Drive URL",
                  ],
                },
              ].map((p, i) => (
                <Reveal key={p.n} delay={i * 100}>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-full bg-rose-400/15 border border-rose-400/30 flex items-center justify-center text-rose-200 font-black">
                        {p.n}
                      </div>
                      <span className="text-[10px] tracking-widest uppercase text-white/35">Phase {p.n}</span>
                    </div>
                    <h4 className="font-bold text-white mb-3">{p.title}</h4>
                    <ul className="space-y-2 text-sm text-white/70">
                      {p.bullets.map((b) => (
                        <li key={b} className="flex gap-2 leading-relaxed">
                          <span className="text-rose-300 mt-1">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={350}>
              <h3 className="text-xl font-bold mt-14 mb-5">Editorial Tools Available in the Hub</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { e: "↕️", t: "Reorder", s: "@dnd-kit" },
                  { e: "✏️", t: "Edit inline", s: "React Input" },
                  { e: "🗑️", t: "Delete", s: "3-route Dialog" },
                  { e: "🔄", t: "Regenerate", s: "Gemini + pillar" },
                  { e: "➕", t: "Add manual", s: "Input + pillar" },
                  { e: "📋", t: "Copy", s: "Clipboard API" },
                ].map((tool) => (
                  <div key={tool.t} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
                    <div className="text-2xl mb-2">{tool.e}</div>
                    <div className="text-sm font-semibold text-white">{tool.t}</div>
                    <div className="text-[10px] tracking-wider uppercase text-white/40 mt-1">{tool.s}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={400}>
              <h3 className="text-xl font-bold mt-14 mb-5">The Intelligence Behind the Creativity</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { icon: "📊", t: "Performance Data", s: "Views, engagement, top pillars — the AI learns what content resonates and adapts" },
                  { icon: "🧠", t: "Host Soul Models", s: "Jhon's dry humor + stoicism, Juan's curiosity + optimism — personality DNA in every script" },
                  { icon: "🇻🇪", t: "Venezuelan Slang Engine", s: "'Chamo', 'Naguará', 'Fino', 'Pilla' — AI trained to think and speak in authentic cadence" },
                  { icon: "🎤", t: "Cloned Voice Synthesis", s: "ElevenLabs captures the exact tone, rhythm, and vocal texture of each host" },
                ].map((c) => (
                  <Card key={c.t} className="!p-5">
                    <div className="text-2xl mb-2">{c.icon}</div>
                    <div className="font-semibold text-white">{c.t}</div>
                    <div className="text-xs text-white/60 mt-1 leading-relaxed">{c.s}</div>
                  </Card>
                ))}
              </div>
              <Card className="mt-6 bg-gradient-to-br from-rose-500/10 to-amber-500/10 border-rose-400/20">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎙️</span>
                  <p className="text-sm text-white/80 leading-relaxed">
                    <strong className="text-white">The result:</strong> A radio show that sounds human — because every AI layer was trained to think in Venezuelan slang, respect each host's unique soul, and get smarter with every episode.
                  </p>
                </div>
              </Card>
            </Reveal>
          </div>
        </section>

        {/* 06 AUDIO PIPELINE */}
        <section id="audio" className="px-5 sm:px-10 lg:px-20 py-20 sm:py-28 border-t border-white/[0.06] scroll-mt-24">
          <div className="max-w-5xl mx-auto">
            <SectionHeader num="06" title="Audio Pipeline" subtitle="Make.com + ElevenLabs · ~81 min for 8 topics" />

            <div className="space-y-3">
              {[
                { e: "📥", t: "Webhook", time: "~1 min", d: "Receives JSON payload with topics from Creative Hub", tag: "Make Webhook" },
                { e: "🔀", t: "Router", time: "instant", d: "Splits into 4 parallel paths", tag: "Make Router" },
                { e: "🤖", t: "LLM Chain", time: "~16 min", d: "Dual-LLM scriptwriting & cross-validation", tag: "ChatGPT + Gemini" },
                { e: "🐍", t: "0CodeKit", time: "~4 min", d: "Split voices (pre-TTS) + Join audio (post-TTS)", tag: "Python" },
                { e: "🎤", t: "ElevenLabs", time: "~30 min", d: "Cloned voice synthesis (Jhon + Juan + Narrator)", tag: "TTS v2" },
                { e: "☁️", t: "Upload", time: "~5 min", d: "Final MP3 per section, accessible by URL", tag: "Google Drive" },
                { e: "🔔", t: "Callback", time: "~1 min", d: "Returns status + drive_url to Creative Hub", tag: "HTTP POST" },
              ].map((step, i) => (
                <Reveal key={step.t} delay={i * 60}>
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 flex items-center gap-5 hover:bg-white/[0.04] transition-colors">
                    <div className="text-3xl">{step.e}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="font-bold text-white">{step.t}</h4>
                        <Pill tone="amber">{step.time}</Pill>
                      </div>
                      <div className="text-sm text-white/65 mt-1">{step.d}</div>
                    </div>
                    <div className="hidden sm:block text-[10px] tracking-widest uppercase text-white/40 text-right">
                      {step.tag}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={400}>
              <Card className="mt-8">
                <h3 className="text-sm tracking-[0.25em] uppercase text-white/50 mb-4">Payload sent to Make.com</h3>
                <CodeBlock>{`{
  "program_date": "2025-03-01",
  "topics": [
    { "title": "...", "contentPillar": "Music" },
    { "title": "...", "contentPillar": "Venezuela" }
  ],
  "request_id": "radio-1709312400000-abc123",
  "callback_url": "https://[backend]/functions/v1/
                   make-webhook-callback"
}`}</CodeBlock>
              </Card>
            </Reveal>
          </div>
        </section>

        {/* 07 MAKE INTERNALS */}
        <section id="make" className="px-5 sm:px-10 lg:px-20 py-20 sm:py-28 border-t border-white/[0.06] scroll-mt-24">
          <div className="max-w-5xl mx-auto">
            <SectionHeader num="07" title="Make.com Pipeline — Inside the Scenario" subtitle="End-to-end round-trip: Creative Hub → Make → Creative Hub" />

            <Reveal delay={100}>
              <h3 className="text-xl font-bold mb-5">4-Path Router Architecture</h3>
              <Card className="!p-5">
                <div className="grid md:grid-cols-3 gap-3 text-xs">
                  {["📥 Creative Hub → Webhook", "📋 JSON Parser", "🔀 Router (4 parallel paths)"].map((s) => (
                    <div key={s} className="rounded-lg bg-black/40 border border-white/10 p-3 text-center text-white/85 font-medium">
                      {s}
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid sm:grid-cols-4 gap-2">
                  {["INTRO", "CHAPTERS", "CLOSING", "CALLBACK"].map((p) => (
                    <div key={p} className="rounded-lg bg-rose-400/10 border border-rose-400/30 py-2 text-center text-xs font-bold tracking-widest text-rose-200">
                      {p}
                    </div>
                  ))}
                </div>
                <div className="mt-5 text-[11px] tracking-widest uppercase text-white/45 mb-2">Each path runs:</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-[11px]">
                  {[
                    "✍️ ChatGPT Script",
                    "🔄 Gemini Validation",
                    "🐍 0CodeKit Split",
                    "🎤 ElevenLabs TTS",
                    "🐍 0CodeKit Join",
                    "☁️ Drive Upload",
                    "🔔 Callback",
                  ].map((s) => (
                    <div key={s} className="rounded-md bg-white/5 border border-white/10 p-2 text-center text-white/80 font-medium">
                      {s}
                    </div>
                  ))}
                </div>
              </Card>
            </Reveal>

            <Reveal delay={150}>
              <h3 className="text-xl font-bold mt-12 mb-5">ChatGPT "Guionista" — Production Prompt</h3>
              <CodeBlock>{`Think and act as a podcast scriptwriter, who must create the
opening of a radio show — a conversation between Juan and Jhon.
The show is called Vacílate A.I, a radio program on Circuito Líder,
covering current events, pop culture, music, technology, AI and curiosities.

Reference:
1) Tone: Jhon — ironic and critical · Juan — creative and optimistic.

This opening must be coherent, precise, entertaining and concise,
giving a brief intro to {{99.array[].topics[].title}} and mentioning
each host's Instagram: @jhonsnacks and @juansofá.

Each host introduces themselves, presents the show, mentions their
accounts, and intrigues listeners into continuing.

NO laughter expressions. Use double dashes (--) as pauses.
NO "Hahaha", "jajaja". NO emotion tags like [In a defiant tone].

"Vacílate A.I" must be read in Spanish.
There must be no farewell — this is only the opening.`}</CodeBlock>
              <div className="grid sm:grid-cols-2 gap-3 mt-5 text-sm">
                {[
                  ["Persona", "Acts as a podcast scriptwriter"],
                  ["Program context", "Vacílate A.I on Circuito Líder — pop culture, tech, AI, music"],
                  ["Host personalities", "Jhon: ironic/critical · Juan: creative/optimistic"],
                  ["Dynamic topics", "Injected via {{99.array[].topics[].title}} from Make aggregator"],
                  ["Instagram handles", "@jhonsnacks and @juansofá must be mentioned"],
                  ["Anti-expression rules", "No 'jajaja', no [emotion] tags"],
                  ["Pause notation", "Double dashes (--) replace laughter/pauses"],
                  ["Spanish pronunciation", "'Vacílate A.I' must be read in Spanish"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                    <div className="text-[10px] tracking-widest uppercase text-rose-300 font-bold mb-1">{k}</div>
                    <div className="text-white/75 text-sm">{v}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={200}>
              <h3 className="text-xl font-bold mt-12 mb-5">ChatGPT "Estructura" — Structure Formatter</h3>
              <CodeBlock>{`From the script generated in {{64.choices[].message.content}},
extract exclusively the dialogue parts of Jhon Da Silva and
Juan Carlos Martínez.

Dialogue structure:
**Jhon Da Silva:**
Jhon's text

**Juan Carlos Martínez:**
Juan's text

@ → "arroba" (e.g. @Jhondasilva → "arroba Jhondasilva")

Numbers → words (dates, percentages, years).
Pauses with dashes "-" (more dashes = longer pause).

Content expansion: 135% more extensive and detailed,
keeping the conversation coherent.`}</CodeBlock>
            </Reveal>

            {/* 0CodeKit */}
            <Reveal delay={250}>
              <h3 className="text-xl font-bold mt-12 mb-5">0CodeKit — Python Dual Role</h3>
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <div className="text-[10px] tracking-widest uppercase text-emerald-300 font-bold mb-2">Pre-TTS: Splitter</div>
                  <p className="text-sm text-white/70 mb-4">
                    Python parses the interleaved dialogue and separates Jhon's lines from Juan's lines into two independent streams. Each stream is routed to ElevenLabs with the correct cloned voice.
                  </p>
                  <CodeBlock>{`# Simplified logic
for line in script_lines:
    if "Jhon Da Silva" in line:
        jhon_stream.append(text)
    elif "Juan Carlos" in line:
        juan_stream.append(text)

# → ElevenLabs(jhon_voice, jhon_stream)
# → ElevenLabs(juan_voice, juan_stream)`}</CodeBlock>
                </Card>
                <Card>
                  <div className="text-[10px] tracking-widest uppercase text-sky-300 font-bold mb-2">Post-TTS: Joiner</div>
                  <p className="text-sm text-white/70 mb-4">
                    After ElevenLabs generates separate audio segments for each voice, Python reassembles them in the original conversational order before uploading the coherent file to Google Drive.
                  </p>
                  <CodeBlock>{`# Simplified logic
segments = []
for i, line in enumerate(original_order):
    if line.speaker == "Jhon":
        segments.append(jhon_audio[jhon_idx])
    else:
        segments.append(juan_audio[juan_idx])

final_audio = concatenate(segments)
# → Upload to Google Drive`}</CodeBlock>
                </Card>
              </div>
            </Reveal>

            {/* Cross-validation */}
            <Reveal delay={300}>
              <h3 className="text-xl font-bold mt-12 mb-5">Multi-LLM Cross-Validation Strategy</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {["ChatGPT Guionista", "ChatGPT Estructura", "Gemini Guionista", "Gemini Estructura"].map((s, i) => (
                  <div key={s} className={`rounded-lg p-3 border text-center text-xs font-semibold ${i < 2 ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : "border-sky-400/30 bg-sky-400/10 text-sky-200"}`}>
                    {s}
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/65 leading-relaxed">
                Two different LLMs process each section sequentially. ChatGPT generates the initial creative script and formats the structure. Then Gemini rewrites and restructures it independently. This cross-validation between OpenAI and Google catches hallucinations, formatting errors, and ensures consistent quality — each LLM compensates for the other's blind spots.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                {[
                  { e: "🎙️", t: "Intro", v: "2 (Jhon + Juan)", d: "Aggregator → Context → ChatGPT → Gemini → 0CodeKit Split → ElevenLabs → 0CodeKit Join → Drive" },
                  { e: "📖", t: "Chapters", v: "3 (Jhon + Juan + Narrator)", d: "Iterator per topic → Context → ChatGPT → Gemini → 0CodeKit Split → ElevenLabs → 0CodeKit Join → Drive" },
                  { e: "🎬", t: "Closing", v: "2 (Jhon + Juan)", d: "Aggregator → Context → ChatGPT → Gemini → 0CodeKit Split → ElevenLabs → 0CodeKit Join → Drive" },
                  { e: "🔄", t: "Callback", v: "—", d: "HTTP POST back to Creative Hub with request_id + status + drive_url → Edge Function updates radio_programs → Frontend detects via Realtime" },
                ].map((p) => (
                  <Card key={p.t} className="!p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-lg font-bold text-white flex items-center gap-2">
                        <span>{p.e}</span> {p.t}
                      </div>
                      <Pill tone="rose">Voices: {p.v}</Pill>
                    </div>
                    <p className="text-xs text-white/65 leading-relaxed">{p.d}</p>
                  </Card>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* 08 MONITORING */}
        <section id="monitoring" className="px-5 sm:px-10 lg:px-20 py-20 sm:py-28 border-t border-white/[0.06] scroll-mt-24">
          <div className="max-w-5xl mx-auto">
            <SectionHeader num="08" title="Real-Time Monitoring" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { t: "Polling", s: "Every 30s while programs are in 'processing'", icon: Activity },
                { t: "Realtime DB", s: "Subscription to postgres_changes on radio_programs", icon: Database },
                { t: "Predictive progress", s: "Bar calibrated with historical data (~10 min/topic)", icon: Zap },
                { t: "Notifications", s: "Web Notifications API + AudioContext (A5→C#6→E6)", icon: Bot },
                { t: "Callback", s: "Edge Function updates DB → Frontend detects via Realtime", icon: Workflow },
                { t: "Statistics", s: "Average, min and max from previous programs", icon: Layers },
              ].map((c, i) => (
                <Reveal key={c.t} delay={i * 60}>
                  <Card className="!p-5 h-full">
                    <div className="w-9 h-9 rounded-lg bg-rose-400/10 border border-rose-400/20 flex items-center justify-center mb-3">
                      <c.icon className="w-4 h-4 text-rose-300" />
                    </div>
                    <div className="font-bold text-white">{c.t}</div>
                    <div className="text-sm text-white/65 mt-1 leading-relaxed">{c.s}</div>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 09 TECH STACK */}
        <section id="stack" className="px-5 sm:px-10 lg:px-20 py-20 sm:py-28 border-t border-white/[0.06] scroll-mt-24">
          <div className="max-w-5xl mx-auto">
            <SectionHeader num="09" title="Tech Stack" />
            <Reveal delay={100}>
              <Card className="!p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="text-left p-4 text-[10px] tracking-widest uppercase text-white/50 font-bold">Component</th>
                        <th className="text-left p-4 text-[10px] tracking-widest uppercase text-white/50 font-bold">Technology</th>
                        <th className="text-left p-4 text-[10px] tracking-widest uppercase text-white/50 font-bold">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        ["Frontend", "React 18 + TypeScript + Tailwind + Vite", "Editorial interface + real-time monitoring"],
                        ["Topic Generation", "Google Gemini 2.5 Flash", "Verifiable topics with anti-hallucination protocol"],
                        ["RT Search", "Perplexity Sonar", "Filtered viral trends (48-72h)"],
                        ["Backend", "Deno (Edge Functions)", "AI orchestration + webhook callback receiver"],
                        ["Database", "PostgreSQL + Realtime", "State, history, insights, radio_programs tracking"],
                        ["Automation", "Make.com (4-path Router)", "Full audio pipeline orchestration (Intro/Chapters/Closing/Callback)"],
                        ["Scriptwriting (Make)", "OpenAI ChatGPT", "Guionista prompt (creative script) + Estructura prompt (TTS formatting)"],
                        ["Cross-Validation (Make)", "Google Gemini in Make", "Rewrites + restructures each section for dual-LLM validation"],
                        ["Voice Splitter (Make)", "0CodeKit — Python (pre-TTS)", "Separates interleaved Jhon/Juan dialogue into per-voice streams"],
                        ["Voice Joiner (Make)", "0CodeKit — Python (post-TTS)", "Reassembles audio segments in original conversational order"],
                        ["Voice Synthesis (Make)", "ElevenLabs (eleven_multilingual_v2)", "Cloned TTS for Jhon, Juan, and Narrator voices"],
                        ["Storage", "Google Drive API", "Per-section audio upload with public webViewLink"],
                        ["Callback (Make)", "HTTP POST Module", "Returns request_id + status + drive_url to Creative Hub"],
                        ["Drag & Drop", "@dnd-kit", "Editorial curation (reorder, delete, regenerate)"],
                        ["Validation", "Zod", "Data safety (webhook payloads, API responses)"],
                      ].map((row) => (
                        <tr key={row[0]} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 font-semibold text-white">{row[0]}</td>
                          <td className="p-4 text-white/75 font-mono text-xs">{row[1]}</td>
                          <td className="p-4 text-white/65 text-sm">{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </Reveal>
          </div>
        </section>

        {/* 10 INNOVATIONS */}
        <section id="innovations" className="px-5 sm:px-10 lg:px-20 py-20 sm:py-28 border-t border-white/[0.06] scroll-mt-24">
          <div className="max-w-5xl mx-auto">
            <SectionHeader num="10" title="Key Innovations for Cannes" />
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { t: "5-layer AI pipeline", d: "Perplexity (real-time search) → Gemini (verified generation) → ChatGPT + Gemini (dual-LLM scriptwriting in Make) → 0CodeKit Python (voice splitting/joining) → ElevenLabs (voice synthesis)", icon: Layers },
                { t: "Anti-Hallucination with real case", d: "The prompt includes a hallucination captured in production (Guayoyo river) as a negative example — the LLM learns from its own mistakes", icon: ShieldCheck },
                { t: "Data-Driven Prompting", d: "Real Metricool insights (engagement) feed the LLM to prioritize topics that historically perform better", icon: Database },
                { t: "AI-coded personalities", d: "Juan and Jhon's identities (philosophy, expressions, expertise) encoded in prompts, with automatic selection by keyword density", icon: Users },
                { t: "Human-in-the-Loop editorial", d: "AI generates → human curates (edits, reorders, regenerates) → AI executes — controlled trust cycle", icon: LayoutGrid },
                { t: "Autonomous post-approval pipeline", d: "From text to MP3 published on Drive with zero human intervention (~81 min for 8 topics)", icon: Workflow },
                { t: "Programmatic ethical filtering", d: "Double barrier (prompt + code) ensures no politics, violence, or conflicts reach the airwaves", icon: ShieldCheck },
                { t: "Multi-LLM Cross-Validation", d: "ChatGPT generates and structures, then Gemini rewrites and restructures — two different LLMs catching each other's errors", icon: Bot },
                { t: "0CodeKit Splitter/Joiner", d: "Python splits interleaved dialogue into per-voice streams for TTS, then rejoins audio segments in conversational order", icon: Code2 },
              ].map((i, idx) => (
                <Reveal key={i.t} delay={idx * 50}>
                  <Card className="!p-5 h-full hover:border-rose-400/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-rose-400/10 border border-rose-400/20 flex items-center justify-center flex-shrink-0">
                        <i.icon className="w-4 h-4 text-rose-300" />
                      </div>
                      <div>
                        <div className="font-bold text-white mb-1">{i.t}</div>
                        <div className="text-sm text-white/65 leading-relaxed">{i.d}</div>
                      </div>
                    </div>
                  </Card>
                </Reveal>
              ))}
            </div>

            <Reveal delay={400}>
              <h3 className="text-xl font-bold mt-14 mb-5">Persistence & Traceability</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  ["radio_programs", "Complete state: topics, Drive URLs, timing, errors"],
                  ["generated_topics_history", "History of all topics (anti-duplication, 500)"],
                  ["generated_content", "Saved content for DOCX export"],
                  ["user_activity_log", "Audit: TOPIC_GENERATED, RADIO_PROGRAM_CREATED"],
                  ["content_performance_insights", "Metricool insights that feed back into the LLM"],
                ].map(([k, v]) => (
                  <Card key={k} className="!p-4">
                    <code className="text-xs text-rose-300 font-mono font-bold">{k}</code>
                    <div className="text-sm text-white/70 mt-2 leading-relaxed">{v}</div>
                  </Card>
                ))}
              </div>
            </Reveal>

            {/* CTA */}
            <Reveal delay={500}>
              <div className="mt-16 rounded-3xl border border-rose-400/20 bg-gradient-to-br from-rose-500/10 via-white/[0.02] to-amber-500/10 p-8 sm:p-12 text-center relative overflow-hidden">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: "radial-gradient(circle at 50% 0%, rgba(244,63,94,0.4), transparent 60%)",
                  }}
                />
                <div className="relative">
                  <div className="text-3xl mb-3">🎧</div>
                  <h2 className="text-2xl sm:text-4xl font-black mb-3">Listen to a Sample</h2>
                  <p className="text-white/65 max-w-xl mx-auto mb-8 text-sm sm:text-base">
                    Hear an AI-generated FM radio show fragment — full pipeline, zero post-production.
                  </p>
                  <a
                    href={AUDIO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white text-sm font-semibold hover:shadow-[0_8px_30px_-8px_rgba(244,63,94,0.6)] transition-shadow"
                  >
                    <Headphones className="w-4 h-4" />
                    Open Cannes Audio
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <div className="text-xs text-white/40 mt-4 tracking-wider">
                    creativehub.vacilateesto.com/cannesaudio
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-5 sm:px-10 lg:px-20 py-10 border-t border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/40">
            <div className="tracking-[0.2em] uppercase">
              Vacílate Esto · Vacílate AI Radio · Cannes 2026
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

export default Cannes;

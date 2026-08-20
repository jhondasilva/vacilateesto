import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickerHeader from "@/components/StickerHeader";
import { Download, Image as ImageIcon, FileText, Mail, Package, Users, Check } from "lucide-react";

import logoLight from "@/assets/logo-vacilate-esto.png";
import logoDark from "@/assets/logo-vacilate-esto-dark.png";
import logoFutbol from "@/assets/logo-vacilate-futbol.png";
import logoCumbre from "@/assets/logo-podcast-cumbre.avif";
import logoGuerra from "@/assets/logo-guerra-comerciales.png";
import fotoJhon from "@/assets/jhon-da-silva.jpg";
import fotoJuan from "@/assets/juan-carlos-martinez.jpg";
import fotoStudio from "@/assets/studio-set.jpg";

const ZIP = "/press/VacilateEsto-PressKit-2026.zip";

const LOGOS = [
  { src: logoLight, name: "Logo principal", file: "logo-vacilate-esto.png", dark: true },
  { src: logoDark, name: "Logo fondo oscuro", file: "logo-vacilate-esto-dark.png", dark: true },
  { src: logoFutbol, name: "Vacílate El Fútbol", file: "logo-vacilate-futbol.png", dark: true },
  { src: logoCumbre, name: "Podcast en la Cumbre", file: "logo-podcast-cumbre.avif", dark: true },
  { src: logoGuerra, name: "Guerra de Comerciales", file: "logo-guerra-comerciales.png", dark: true },
];

const FOTOS = [
  { src: fotoJhon, name: "JhonSnacks", credit: "Foto oficial · Vacílate Esto" },
  { src: fotoJuan, name: "JuanSofa", credit: "Foto oficial · Vacílate Esto" },
  { src: fotoStudio, name: "Estudio Vacílate Esto", credit: "Set de grabación · Caracas" },
];

const DOCS = [
  { name: "Media Kit Vacílate Esto 2026", href: "/downloads/VacilateEsto-MediaKit-2026.pdf" },
  { name: "Media Kit Vacílate El Fútbol 2026", href: "/downloads/VacilateElFutbol-MediaKit-2026.pdf" },
  { name: "Media Kit Podcast en la Cumbre · Pico Bolívar 2026", href: "/downloads/PodcastEnLaCumbre-PicoBolivar-MediaKit-2026.pdf" },
  { name: "Nota de prensa · Pico Bolívar 2026", href: "/press/Nota_de_Prensa_Pico_Bolivar_2026.pdf" },
  { name: "Nota de prensa · 5 finalistas FIAP 2026", href: "/press/Nota_de_Prensa_FIAP_2026.pdf" },
];

const CONTACTS = [
  { name: "Andreína Ascensión", role: "Dirección de producción", email: "andreina.ascension@hacemosloquenosgusta.com" },
  { name: "Samira Rivas", role: "Logística", email: "samira.rivas@hacemosloquenosgusta.com" },
  { name: "Estrella Rodríguez", role: "Coordinadora de producción", email: "estrella.rodriguez@hacemosloquenosgusta.com" },
];

const BOILERPLATE =
  "Vacílate Esto es una de las marcas de entretenimiento digital más relevantes de Venezuela, hecha en Venezuela: podcast, social media y eventos en vivo. Conducido por JhonSnacks y JuanSofa, produce contenido semanal en YouTube, TikTok, Instagram y Facebook, además de formatos propios como Guerra de Comerciales, Vacílate El Fútbol y Podcast en la Cumbre, la serie que graba episodios completos en las montañas más altas del país. Su comunidad y sus marcas aliadas convierten cada formato en conversación nacional.";

const BOILERPLATE_EN =
  "Vacílate Esto is one of Venezuela's most relevant digital entertainment brands, made in Venezuela: podcast, social media and live events. Hosted by JhonSnacks and JuanSofa, it publishes weekly content on YouTube, TikTok, Instagram and Facebook, and produces original formats such as Guerra de Comerciales, Vacílate El Fútbol and Podcast en la Cumbre.";

const PressKit = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Press Kit Vacílate Esto | Logos, fotos y boilerplate</title>
      <meta
        name="description"
        content="Descarga el press kit oficial de Vacílate Esto: logos en alta, fotos oficiales de JhonSnacks y JuanSofa, boilerplate para medios y media kits para patrocinadores."
      />
      <link rel="canonical" href="https://vacilateesto.com/press-kit" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Press Kit Vacílate Esto | Logos, fotos y boilerplate" />
      <meta property="og:description" content="Material oficial para medios y patrocinadores: logos, fotos, boilerplate y media kits." />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>

    <Header />

    <main>
      {/* Hero */}
      <section className="py-14 sm:py-20 bg-foreground text-background border-b-4 border-foreground">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground border-2 border-background rounded-full mb-6 rotate-[-2deg]">
            <Package className="w-4 h-4" />
            <span className="font-display font-black text-xs uppercase tracking-widest">Press Kit 2026</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl tracking-[-0.04em] leading-[0.92]">
            Material oficial para <span className="italic text-primary">medios y patrocinadores</span>
          </h1>
          <p className="font-body text-background/80 text-base sm:text-lg leading-relaxed mt-6">
            Logos en alta resolución, fotos oficiales de los conductores, boilerplate en español e inglés,
            guía de uso de marca y los media kits actualizados. Todo en un solo archivo.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href={ZIP}
              download
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-background rounded-full font-display font-black text-sm uppercase tracking-widest hover:-translate-y-0.5 transition-transform"
            >
              <Download className="w-4 h-4" /> Descargar press kit (ZIP)
            </a>
            <Link
              to="/media-kit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-background text-foreground border-2 border-background rounded-full font-display font-black text-sm uppercase tracking-widest hover:-translate-y-0.5 transition-transform"
            >
              <FileText className="w-4 h-4" /> Ver media kit
            </Link>
            <Link
              to="/prensa/cobertura"
              className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-background border-2 border-background rounded-full font-display font-black text-sm uppercase tracking-widest hover:-translate-y-0.5 transition-transform"
            >
              <Users className="w-4 h-4" /> Cobertura para prensa
            </Link>
          </div>
        </div>
      </section>

      {/* Boilerplate */}
      <section className="py-14 sm:py-20 bg-background border-b-4 border-foreground">
        <div className="container mx-auto px-4">
          <StickerHeader badge="Boilerplate" badgeIcon={FileText} badgeVariant="dark" title="Cómo describir a" highlight="Vacílate Esto" align="center" />
          <div className="max-w-3xl mx-auto grid gap-5">
            <article className="bg-card border-4 border-foreground rounded-2xl p-6 shadow-[6px_6px_0_hsl(var(--foreground))]">
              <h2 className="font-display font-black text-sm uppercase tracking-widest text-primary mb-3">Español · versión larga</h2>
              <p className="font-body text-foreground/85 leading-relaxed">{BOILERPLATE}</p>
            </article>
            <article className="bg-card border-4 border-foreground rounded-2xl p-6 shadow-[6px_6px_0_hsl(var(--foreground))]">
              <h2 className="font-display font-black text-sm uppercase tracking-widest text-primary mb-3">English</h2>
              <p className="font-body text-foreground/85 leading-relaxed">{BOILERPLATE_EN}</p>
            </article>
            <article className="bg-muted/40 border-4 border-foreground rounded-2xl p-6">
              <h2 className="font-display font-black text-sm uppercase tracking-widest mb-3">Uso correcto de la marca</h2>
              <ul className="space-y-2 font-body text-foreground/85">
                {[
                  'Escribir siempre "Vacílate Esto", con tilde en la í.',
                  "No alterar colores, proporciones ni tipografía del logo.",
                  'Espacio libre mínimo alrededor del logo: la altura de la letra "V".',
                  "Versión clara sobre fondos oscuros; versión oscura sobre fondos claros.",
                  'Los conductores se escriben "Jhon" (nunca "John") y "Juan".',
                ].map((r) => (
                  <li key={r} className="flex gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-1" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-14 sm:py-20 bg-muted/30 border-b-4 border-foreground">
        <div className="container mx-auto px-4">
          <StickerHeader badge="Logos" badgeIcon={ImageIcon} badgeVariant="dark" title="Marcas y" highlight="formatos" align="center" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {LOGOS.map((l) => (
              <a
                key={l.file}
                href={l.src}
                download={l.file}
                className="group bg-foreground border-4 border-foreground rounded-2xl p-5 flex flex-col items-center gap-3 hover:-translate-y-1 transition-transform"
              >
                <img src={l.src} alt={`${l.name} de Vacílate Esto`} loading="lazy" className="h-16 w-auto object-contain" />
                <span className="font-display font-black text-[10px] uppercase tracking-widest text-background text-center">{l.name}</span>
                <span className="inline-flex items-center gap-1 font-display font-black text-[10px] uppercase tracking-widest text-primary">
                  <Download className="w-3 h-3" /> PNG
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Fotos */}
      <section className="py-14 sm:py-20 bg-background border-b-4 border-foreground">
        <div className="container mx-auto px-4">
          <StickerHeader badge="Fotos oficiales" badgeIcon={Users} badgeVariant="dark" title="Conductores y" highlight="estudio" align="center" />
          <div className="grid sm:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {FOTOS.map((f) => (
              <figure key={f.name} className="bg-card border-4 border-foreground rounded-2xl overflow-hidden shadow-[6px_6px_0_hsl(var(--foreground))]">
                <img src={f.src} alt={`Foto oficial de ${f.name}`} loading="lazy" className="w-full aspect-[4/5] object-cover" />
                <figcaption className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-display font-black text-sm uppercase tracking-wide">{f.name}</p>
                    <p className="font-body text-xs text-foreground/60">{f.credit}</p>
                  </div>
                  <a href={f.src} download className="shrink-0 p-2 bg-primary text-primary-foreground border-2 border-foreground rounded-full" aria-label={`Descargar foto de ${f.name}`}>
                    <Download className="w-4 h-4" />
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Documentos */}
      <section className="py-14 sm:py-20 bg-muted/30 border-b-4 border-foreground">
        <div className="container mx-auto px-4">
          <StickerHeader badge="Documentos" badgeIcon={FileText} badgeVariant="dark" title="Media kits y" highlight="notas de prensa" align="center" />
          <div className="max-w-3xl mx-auto grid gap-3">
            {DOCS.map((d) => (
              <a
                key={d.href}
                href={d.href}
                download
                className="flex items-center justify-between gap-4 bg-card border-4 border-foreground rounded-2xl px-5 py-4 hover:-translate-y-0.5 transition-transform"
              >
                <span className="font-display font-black text-sm uppercase tracking-wide">{d.name}</span>
                <Download className="w-5 h-5 text-primary shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="py-14 sm:py-20 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <StickerHeader badge="Contacto" badgeIcon={Mail} badgeVariant="outline" onDark title="Prensa y" highlight="marcas" align="center" />
          <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {CONTACTS.map((c) => (
              <a
                key={c.email}
                href={`mailto:${c.email}`}
                className="bg-background text-foreground border-4 border-background rounded-2xl p-5 hover:-translate-y-1 transition-transform"
              >
                <p className="font-display font-black text-base uppercase tracking-wide">{c.name}</p>
                <p className="font-body text-xs text-foreground/60 mb-2">{c.role}</p>
                <p className="font-body text-xs text-primary break-all">{c.email}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default PressKit;
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { z } from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickerHeader from "@/components/StickerHeader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BadgeCheck,
  CalendarClock,
  HelpCircle,
  Mic,
  Send,
  Package,
  Mail,
  MapPin,
  Loader2,
} from "lucide-react";

const FAQS = [
  {
    q: "¿Cómo solicito una entrevista con JhonSnacks o JuanSofa?",
    a: "Completa el formulario de esta página indicando el medio, el tema y la fecha tentativa. Respondemos en un máximo de 3 días hábiles con disponibilidad y formato (presencial, videollamada o respuestas grabadas).",
  },
  {
    q: "¿Puedo cubrir la grabación del Podcast en la Cumbre en el Pico Bolívar?",
    a: "Sí. La expedición de noviembre 2026 tiene cupos limitados de prensa por razones logísticas y de seguridad en altura. Marca la opción \"Cobertura Pico Bolívar\" en el formulario: pedimos seguro médico vigente y experiencia previa en montaña para el tramo alto.",
  },
  {
    q: "¿Dónde descargo logos, fotos y el boilerplate?",
    a: "Todo el material oficial está en el Press Kit: logos en alta, fotos de los conductores, boilerplate en español e inglés y los media kits actualizados.",
  },
  {
    q: "¿Puedo usar fragmentos de los episodios en mi nota o reportaje?",
    a: "Sí, siempre con crédito visible a Vacílate Esto y enlace al episodio original. Para fragmentos mayores a 60 segundos o usos comerciales, solicítalo por el formulario.",
  },
  {
    q: "¿Ofrecen vocerías sobre creator economy o industria del podcast en Venezuela?",
    a: "Sí. Tenemos vocerías disponibles sobre producción de podcast, monetización con marcas, social media y eventos en vivo. Indícalo como \"Vocería / declaraciones\".",
  },
  {
    q: "¿Cubren eventos de marcas o alianzas comerciales?",
    a: "Las solicitudes comerciales (patrocinios, activaciones, presencia de marca) se atienden por separado con el equipo de pauta. Puedes usar el mismo formulario eligiendo \"Alianza comercial\".",
  },
];

const CREDENCIALES = [
  {
    title: "Prensa escrita y digital",
    items: ["Carta del medio en membrete", "Carnet vigente o credencial del medio", "Acreditación individual, no transferible"],
  },
  {
    title: "Fotografía y video",
    items: ["Listado de equipos a ingresar", "Un fotógrafo por medio en estudio", "Grabación de set solo en ventanas autorizadas"],
  },
  {
    title: "Expedición Pico Bolívar",
    items: ["Seguro médico de montaña vigente", "Certificado de aptitud física", "Experiencia previa en alta montaña"],
  },
];

const HORARIOS = [
  { label: "Atención a medios", detail: "Lunes a viernes · 9:00 a.m. – 5:00 p.m. (VET, GMT-4)" },
  { label: "Ventana de entrevistas", detail: "Martes y jueves · 2:00 p.m. – 6:00 p.m. (VET)" },
  { label: "Visitas al estudio (Caracas)", detail: "Miércoles · 10:00 a.m. – 1:00 p.m., con cita previa" },
  { label: "Grabaciones Podcast en la Cumbre", detail: "Noviembre 2026 · Mérida y Pico Bolívar, agenda por confirmar" },
  { label: "Tiempo de respuesta", detail: "Hasta 3 días hábiles · urgencias de cierre, indícalo en el mensaje" },
];

const TIPOS = [
  "Entrevista",
  "Cobertura Pico Bolívar",
  "Visita al estudio",
  "Vocería / declaraciones",
  "Solicitud de material",
  "Alianza comercial",
];

const schema = z.object({
  full_name: z.string().trim().min(2, "Indica tu nombre").max(120, "Máximo 120 caracteres"),
  outlet: z.string().trim().min(2, "Indica el medio").max(160, "Máximo 160 caracteres"),
  email: z.string().trim().email("Correo inválido").max(255),
  phone: z.string().trim().max(40, "Máximo 40 caracteres").optional().or(z.literal("")),
  request_type: z.string().min(1, "Selecciona el tipo de solicitud"),
  event: z.string().trim().max(160).optional().or(z.literal("")),
  preferred_date: z.string().optional().or(z.literal("")),
  message: z.string().trim().min(10, "Cuéntanos un poco más (mínimo 10 caracteres)").max(2000, "Máximo 2000 caracteres"),
});

const inputClass =
  "w-full px-4 py-3 bg-background border-2 border-foreground rounded-xl font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary";

const CoberturaPrensa = () => {
  const [form, setForm] = useState({
    full_name: "",
    outlet: "",
    email: "",
    phone: "",
    request_type: "",
    event: "",
    preferred_date: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        const key = String(i.path[0]);
        if (!fieldErrors[key]) fieldErrors[key] = i.message;
      });
      setErrors(fieldErrors);
      toast.error("Revisa los campos marcados");
      return;
    }
    setErrors({});
    setSending(true);
    const d = parsed.data;
    const { error: dbError } = await supabase.from("press_requests").insert({
      full_name: d.full_name,
      outlet: d.outlet,
      email: d.email,
      phone: d.phone || null,
      request_type: d.request_type,
      event: d.event || null,
      preferred_date: d.preferred_date || null,
      message: d.message,
    });

    if (dbError) {
      setSending(false);
      toast.error("No pudimos enviar tu solicitud. Intenta de nuevo.");
      return;
    }

    try {
      await supabase.functions.invoke("send-press-request", {
        body: {
          full_name: d.full_name,
          outlet: d.outlet,
          email: d.email,
          phone: d.phone || "",
          request_type: d.request_type,
          event: d.event || "",
          preferred_date: d.preferred_date || "",
          message: d.message,
        },
      });
    } catch (err) {
      console.error("Error sending press request email:", err);
    }

    setSending(false);
    setSent(true);
    toast.success("Solicitud enviada. Te respondemos en máximo 3 días hábiles.");
    setForm({ full_name: "", outlet: "", email: "", phone: "", request_type: "", event: "", preferred_date: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Cobertura para prensa | Vacílate Esto</title>
        <meta
          name="description"
          content="Todo para medios: preguntas frecuentes, credenciales, horarios de atención y formulario de solicitud de entrevistas y cobertura de Vacílate Esto y Podcast en la Cumbre."
        />
        <link rel="canonical" href="https://vacilateesto.com/prensa/cobertura" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Cobertura para prensa | Vacílate Esto" />
        <meta property="og:description" content="FAQ, credenciales, horarios y formulario de solicitud de entrevistas y cobertura para medios." />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          })}
        </script>
      </Helmet>

      <Header />

      <main>
        {/* Hero */}
        <section className="py-14 sm:py-20 bg-foreground text-background border-b-4 border-foreground">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground border-2 border-background rounded-full mb-6 rotate-[-2deg]">
              <Mic className="w-4 h-4" />
              <span className="font-display font-black text-xs uppercase tracking-widest">Cobertura para prensa</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl tracking-[-0.04em] leading-[0.92]">
              Entrevistas, acreditaciones y <span className="italic text-primary">cobertura</span>
            </h1>
            <p className="font-body text-background/80 text-base sm:text-lg leading-relaxed mt-6">
              Aquí resolvemos lo esencial para trabajar con Vacílate Esto: preguntas frecuentes, requisitos de
              credenciales, horarios de atención y un formulario directo para solicitar entrevistas o cobertura
              del Podcast en la Cumbre en el Pico Bolívar.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href="#solicitud"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-background rounded-full font-display font-black text-sm uppercase tracking-widest hover:-translate-y-0.5 transition-transform"
              >
                <Send className="w-4 h-4" /> Solicitar cobertura
              </a>
              <Link
                to="/press-kit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-background text-foreground border-2 border-background rounded-full font-display font-black text-sm uppercase tracking-widest hover:-translate-y-0.5 transition-transform"
              >
                <Package className="w-4 h-4" /> Press kit
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 sm:py-20 border-b-4 border-foreground">
          <div className="container mx-auto px-4">
            <StickerHeader
              badge="FAQ"
              badgeIcon={HelpCircle}
              badgeVariant="dark"
              title="Preguntas"
              highlight="frecuentes"
              align="center"
            />
            <div className="max-w-3xl mx-auto bg-card border-4 border-foreground rounded-2xl p-4 sm:p-6 shadow-[6px_6px_0_hsl(var(--foreground))]">
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((f, i) => (
                  <AccordionItem key={f.q} value={`faq-${i}`}>
                    <AccordionTrigger className="font-display font-black text-left text-sm sm:text-base">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="font-body text-foreground/85 leading-relaxed">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Credenciales */}
        <section className="py-14 sm:py-20 bg-muted/30 border-b-4 border-foreground">
          <div className="container mx-auto px-4">
            <StickerHeader
              badge="Acreditación"
              badgeIcon={BadgeCheck}
              badgeVariant="primary"
              title="Requisitos de"
              highlight="credenciales"
              description="Solicítalas con al menos 7 días de anticipación. Las credenciales son personales e intransferibles."
              align="center"
            />
            <div className="grid gap-5 md:grid-cols-3 max-w-5xl mx-auto">
              {CREDENCIALES.map((c, i) => (
                <article
                  key={c.title}
                  className={`bg-card border-4 border-foreground rounded-2xl p-6 shadow-[6px_6px_0_hsl(var(--foreground))] ${i % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"}`}
                >
                  <h3 className="font-display font-black text-lg mb-4">{c.title}</h3>
                  <ul className="space-y-2 font-body text-sm text-foreground/85">
                    {c.items.map((it) => (
                      <li key={it} className="flex gap-2">
                        <BadgeCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Horarios */}
        <section className="py-14 sm:py-20 border-b-4 border-foreground">
          <div className="container mx-auto px-4">
            <StickerHeader
              badge="Agenda"
              badgeIcon={CalendarClock}
              badgeVariant="accent"
              title="Horarios de"
              highlight="atención"
              align="center"
            />
            <div className="max-w-3xl mx-auto grid gap-4">
              {HORARIOS.map((h) => (
                <div
                  key={h.label}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 bg-card border-4 border-foreground rounded-2xl px-5 py-4"
                >
                  <span className="font-display font-black text-sm uppercase tracking-widest">{h.label}</span>
                  <span className="font-body text-sm text-foreground/80">{h.detail}</span>
                </div>
              ))}
              <p className="font-body text-xs text-muted-foreground flex items-center gap-2 mt-1">
                <MapPin className="w-3.5 h-3.5" /> Estudio Vacílate Esto · Caracas, Venezuela (hora local VET, GMT-4).
              </p>
            </div>
          </div>
        </section>

        {/* Formulario */}
        <section id="solicitud" className="py-14 sm:py-20 bg-foreground">
          <div className="container mx-auto px-4">
            <StickerHeader
              badge="Solicitud"
              badgeIcon={Send}
              badgeVariant="primary"
              title="Pide tu entrevista o"
              highlight="cobertura"
              description="Respondemos en un máximo de 3 días hábiles al correo que indiques."
              align="center"
              onDark
            />
            <div className="max-w-3xl mx-auto bg-card border-4 border-background rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0_hsl(var(--primary))]">
              {sent ? (
                <div className="text-center py-8">
                  <BadgeCheck className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-display font-black text-2xl mb-2">¡Solicitud recibida!</h3>
                  <p className="font-body text-foreground/80">
                    Te escribimos en máximo 3 días hábiles. Mientras tanto puedes descargar el{" "}
                    <Link to="/press-kit" className="underline font-bold">press kit</Link>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-foreground text-background border-2 border-foreground rounded-full font-display font-black text-xs uppercase tracking-widest"
                  >
                    Enviar otra solicitud
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
                  <div>
                    <label htmlFor="full_name" className="block font-display font-black text-xs uppercase tracking-widest mb-2">Nombre y apellido *</label>
                    <input id="full_name" className={inputClass} value={form.full_name} onChange={(e) => set("full_name", e.target.value)} maxLength={120} />
                    {errors.full_name && <p className="text-xs text-destructive mt-1 font-body">{errors.full_name}</p>}
                  </div>
                  <div>
                    <label htmlFor="outlet" className="block font-display font-black text-xs uppercase tracking-widest mb-2">Medio o programa *</label>
                    <input id="outlet" className={inputClass} value={form.outlet} onChange={(e) => set("outlet", e.target.value)} maxLength={160} />
                    {errors.outlet && <p className="text-xs text-destructive mt-1 font-body">{errors.outlet}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-display font-black text-xs uppercase tracking-widest mb-2">Correo *</label>
                    <input id="email" type="email" className={inputClass} value={form.email} onChange={(e) => set("email", e.target.value)} maxLength={255} />
                    {errors.email && <p className="text-xs text-destructive mt-1 font-body">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block font-display font-black text-xs uppercase tracking-widest mb-2">Teléfono / WhatsApp</label>
                    <input id="phone" className={inputClass} value={form.phone} onChange={(e) => set("phone", e.target.value)} maxLength={40} />
                    {errors.phone && <p className="text-xs text-destructive mt-1 font-body">{errors.phone}</p>}
                  </div>
                  <div>
                    <label htmlFor="request_type" className="block font-display font-black text-xs uppercase tracking-widest mb-2">Tipo de solicitud *</label>
                    <select id="request_type" className={inputClass} value={form.request_type} onChange={(e) => set("request_type", e.target.value)}>
                      <option value="">Selecciona…</option>
                      {TIPOS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    {errors.request_type && <p className="text-xs text-destructive mt-1 font-body">{errors.request_type}</p>}
                  </div>
                  <div>
                    <label htmlFor="preferred_date" className="block font-display font-black text-xs uppercase tracking-widest mb-2">Fecha tentativa</label>
                    <input id="preferred_date" type="date" className={inputClass} value={form.preferred_date} onChange={(e) => set("preferred_date", e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="event" className="block font-display font-black text-xs uppercase tracking-widest mb-2">Formato o evento</label>
                    <input id="event" className={inputClass} placeholder="Ej: Podcast en la Cumbre · Pico Bolívar" value={form.event} onChange={(e) => set("event", e.target.value)} maxLength={160} />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="message" className="block font-display font-black text-xs uppercase tracking-widest mb-2">Cuéntanos tu solicitud *</label>
                    <textarea id="message" rows={5} className={inputClass} value={form.message} onChange={(e) => set("message", e.target.value)} maxLength={2000} />
                    {errors.message && <p className="text-xs text-destructive mt-1 font-body">{errors.message}</p>}
                  </div>
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
                    <button
                      type="submit"
                      disabled={sending}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-foreground rounded-full font-display font-black text-sm uppercase tracking-widest shadow-[4px_4px_0_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_hsl(var(--foreground))] transition-all disabled:opacity-60"
                    >
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {sending ? "Enviando…" : "Enviar solicitud"}
                    </button>
                    <a href="mailto:andreina.ascension@hacemosloquenosgusta.com" className="inline-flex items-center gap-2 font-body text-sm underline">
                      <Mail className="w-4 h-4" /> O escríbenos directo
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CoberturaPrensa;

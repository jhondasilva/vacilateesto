import { Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useGiraAuth } from "@/hooks/useGiraAuth";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ShieldCheck, Receipt, Wallet, AlertTriangle, CheckCircle2, FileText, Plane, UtensilsCrossed, Car } from "lucide-react";

const GiraPoliticas = () => {
  const { session, loading, isAllowed } = useGiraAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!session || isAllowed === false) return <Navigate to="/gira/login" replace />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Políticas de gastos · Gira Vacílate El Mundial</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/85 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
          <Link to="/gira">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Volver a la gira
            </Button>
          </Link>
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
            Acuerdo interno
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* Hero */}
        <section className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Política vigente
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Buenas prácticas de <span className="text-primary">gastos y viajes</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Reglas acordadas entre <strong className="text-foreground">Juan</strong>, <strong className="text-foreground">Jhon</strong> y <strong className="text-foreground">Finanzas</strong> para
            la cobertura del Mundial 2026. Aplica a toda la gira, en todas las ciudades.
          </p>
        </section>

        {/* Principios */}
        <section className="grid sm:grid-cols-3 gap-3">
          <Principle icon={<Receipt className="w-5 h-5" />} title="Todo gasto se reporta" text="Sin soporte (factura, recibo, screenshot) no se reembolsa." />
          <Principle icon={<Wallet className="w-5 h-5" />} title="Lo que excede, lo paga la persona" text="Cualquier monto por encima del estimado acordado es personal." />
          <Principle icon={<ShieldCheck className="w-5 h-5" />} title="Pre-acuerdo con Finanzas" text="Cambios de categoría o upgrades requieren visto bueno antes." />
        </section>

        {/* Reglas detalladas */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold">Reglas por categoría</h2>

          <Rule
            icon={<Plane className="w-5 h-5" />}
            title="Vuelos y trenes"
            items={[
              "Clase y aerolínea según lo aprobado en el plan de gira (categoría económica salvo aprobación previa).",
              "Upgrades (premium / business) son por cuenta personal salvo autorización escrita de Finanzas.",
              "Cambios de itinerario por motivos personales corren por cuenta de quien los solicita.",
              "Equipaje extra de producción debe declararse antes; equipaje extra personal lo paga el viajero.",
            ]}
          />

          <Rule
            icon={<UtensilsCrossed className="w-5 h-5" />}
            title="Comidas"
            items={[
              "Per diem por persona acordado por ciudad — ver columna 'Estimado' en el tab Finanzas.",
              "Lo que exceda el per diem diario lo paga quien consume.",
              "Bebidas alcohólicas no son reembolsables salvo en cenas de negocio aprobadas previamente.",
              "Cenas con sponsors / invitados: notificar a Finanzas el mismo día con lista de asistentes.",
            ]}
          />

          <Rule
            icon={<Car className="w-5 h-5" />}
            title="Transporte local"
            items={[
              "Uber/Lyft: usar categoría estándar (UberX) salvo en game days con equipo (Uber XL/Black permitido).",
              "Taxis y traslados privados solo si están justificados por horario, equipo o seguridad.",
              "Renta de auto requiere aprobación previa y debe reservarse a nombre de la compañía.",
              "Multas, parking irregular y daños no cubiertos por seguro son responsabilidad personal.",
            ]}
          />

          <Rule
            icon={<FileText className="w-5 h-5" />}
            title="Hospedaje"
            items={[
              "Tarifa nocturna acordada en el plan. Resort fees, valet y minibar son extras documentados.",
              "Upgrades de habitación o suites: responsabilidad personal.",
              "Daños o cargos por late check-out no autorizados los asume el huésped.",
              "Lavandería solo si la estadía supera 7 noches consecutivas.",
            ]}
          />
        </section>

        {/* Proceso de reporte */}
        <section className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-soft)] space-y-4">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" /> Cómo se reporta cada gasto
          </h2>
          <ol className="space-y-3 text-sm">
            <Step n={1}>Pagar con tarjeta corporativa cuando sea posible. Si se paga con tarjeta personal, guardar el recibo de inmediato.</Step>
            <Step n={2}>Subir el soporte (foto/PDF) al sistema de gastos el <strong>mismo día</strong>, indicando ciudad, categoría y propósito.</Step>
            <Step n={3}>Si el monto supera el estimado acordado, justificar por escrito en el campo de notas.</Step>
            <Step n={4}>Finanzas revisa semanalmente. Cualquier discrepancia se discute en el reporte de los lunes 9 AM.</Step>
            <Step n={5}>Reembolsos personales se procesan dentro de los 7 días hábiles siguientes a la aprobación.</Step>
          </ol>
        </section>

        {/* Consecuencias */}
        <section className="bg-destructive/5 border-2 border-destructive/30 rounded-2xl p-5 sm:p-6 space-y-3">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" /> Incumplimiento
          </h2>
          <ul className="space-y-2 text-sm text-foreground/90">
            <li>• Gasto sin soporte (recibo/factura) → se considera <strong>responsabilidad personal</strong> y se descuenta del próximo reembolso.</li>
            <li>• Gasto que excede el estimado sin pre-aprobación → la diferencia la asume quien lo realizó.</li>
            <li>• Reportes entregados tarde de forma reiterada → revisión del esquema de tarjeta corporativa.</li>
            <li>• Gastos personales mezclados con los de la compañía → reembolso bloqueado hasta separación documentada.</li>
          </ul>
        </section>

        {/* Compromiso */}
        <section className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-2xl p-6 sm:p-8 space-y-5">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">Compromiso personal</h2>
          <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
            <strong>Juan</strong> y <strong>Jhon</strong> acuerdan, de manera explícita y a título personal:
          </p>
          <ul className="space-y-2 text-sm sm:text-base text-foreground/90">
            <li>✅ Reportar todos los gastos de la compañía con su soporte correspondiente.</li>
            <li>✅ Justificar cualquier desviación respecto al monto, tipo de billete o transporte previamente acordado con Finanzas.</li>
            <li>✅ Pagar con su dinero personal cualquier gasto que exceda los estimados de comida, transporte, hospedaje o categoría de billete.</li>
            <li>✅ Cubrir personalmente cualquier gasto que no pueda ser soportado con factura o recibo válido.</li>
            <li>✅ Mantener separados los gastos personales de los de producción.</li>
          </ul>
          <div className="grid sm:grid-cols-2 gap-3 pt-4 border-t border-primary/20">
            <Signature name="Juan" role="Producción / Host" />
            <Signature name="Jhon" role="Producción / Host" />
          </div>
          <p className="text-[11px] text-muted-foreground pt-2">
            Política vigente desde el inicio de la gira Mundial 2026. Cualquier modificación requiere acuerdo escrito de las tres partes (Juan, Jhon, Finanzas).
          </p>
        </section>
      </main>
    </div>
  );
};

const Principle = ({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) => (
  <div className="bg-card border border-border rounded-xl p-4 shadow-[var(--shadow-soft)]">
    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">{icon}</div>
    <h3 className="font-bold text-sm mb-1">{title}</h3>
    <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
  </div>
);

const Rule = ({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) => (
  <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-[var(--shadow-soft)]">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">{icon}</div>
      <h3 className="font-bold text-base">{title}</h3>
    </div>
    <ul className="space-y-1.5 text-sm text-foreground/85">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2"><span className="text-primary">•</span><span>{it}</span></li>
      ))}
    </ul>
  </div>
);

const Step = ({ n, children }: { n: number; children: React.ReactNode }) => (
  <li className="flex gap-3">
    <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">{n}</span>
    <span className="pt-0.5">{children}</span>
  </li>
);

const Signature = ({ name, role }: { name: string; role: string }) => (
  <div className="bg-background/60 border border-border rounded-lg p-3">
    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{role}</p>
    <p className="text-base font-bold mt-0.5">{name}</p>
    <p className="text-[10px] text-muted-foreground mt-1">Aceptado al iniciar gira</p>
  </div>
);

export default GiraPoliticas;

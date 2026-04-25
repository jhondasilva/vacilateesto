import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import StickerMarquee from "@/components/StickerMarquee";
import StickerHeader from "@/components/StickerHeader";

const TICKER = ["NEWSLETTER SEMANAL", "★", "0% SPAM", "✦", "100% VACILE", "★", "SUSCRIBITE", "✦"];

const emailSchema = z.string()
  .min(1, "Por favor ingresa tu correo electrónico")
  .email("Por favor ingresa un correo electrónico válido")
  .max(255, "El correo es demasiado largo")
  .refine(
    (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email),
    "El formato del correo no es válido"
  );

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateEmail = (value: string): boolean => {
    const result = emailSchema.safeParse(value);
    if (!result.success) {
      setEmailError(result.error.errors[0].message);
      return false;
    }
    setEmailError(null);
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError) validateEmail(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: email.toLowerCase().trim() });

      if (error) {
        if (error.code === "23505") {
          toast({ title: "Ya estás suscrito", description: "Este correo ya está registrado en nuestra newsletter." });
        } else {
          throw error;
        }
      } else {
        toast({ title: "¡Suscrito con éxito!", description: "Te enviaremos las últimas novedades a tu correo." });
        setEmail("");
        setEmailError(null);
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      toast({ title: "Error", description: "Hubo un problema al suscribirte. Intenta de nuevo.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="newsletter" className="relative overflow-hidden bg-background pt-0 pb-20 md:pb-28" aria-labelledby="newsletter-title" itemScope itemType="https://schema.org/WebPageElement">
      <meta itemProp="name" content="Newsletter de Vacílate Esto" />
      <meta itemProp="description" content="Suscríbete al newsletter semanal de Vacílate Esto: episodios destacados, datos insólitos, agenda de eventos y contenido exclusivo del ecosistema." />
      <meta itemProp="url" content="https://www.vacilateesto.com/#newsletter" />
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-10 left-1/4 w-[28rem] h-[28rem] bg-primary/12 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-[28rem] h-[28rem] bg-accent/12 rounded-full blur-[140px]" />
      </div>

      <StickerMarquee items={TICKER} variant="dark" className="mb-16 md:mb-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          <StickerHeader
        titleId="newsletter-title"
            badge="Newsletter"
            badgeIcon={Sparkles}
            title="mantente al"
            highlight="día"
            description="Suscribite a nuestra newsletter y recibí notificaciones de nuevos episodios, contenido exclusivo y las mejores aventuras."
          />

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="relative flex flex-col sm:flex-row items-stretch gap-2 bg-background rounded-3xl sm:rounded-full border-2 border-foreground p-2 sm:pl-5 shadow-[4px_4px_0_hsl(var(--primary))] sm:shadow-[6px_6px_0_hsl(var(--primary))] focus-within:shadow-[8px_8px_0_hsl(var(--accent))] focus-within:-translate-x-0.5 focus-within:-translate-y-0.5 transition-all">
              <div className="flex items-center gap-2 flex-1 px-3 sm:px-0">
                <Mail className="w-5 h-5 text-foreground shrink-0" />
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => email && validateEmail(email)}
                  className="border-0 shadow-none focus-visible:ring-0 text-base bg-transparent flex-1 px-2 placeholder:text-muted-foreground h-12"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="rounded-full gap-2 shrink-0 bg-foreground text-background hover:bg-primary hover:text-primary-foreground border-2 border-foreground font-display font-black uppercase tracking-wider text-xs"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Suscribirme
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
            {emailError && (
              <p className="text-sm text-destructive mt-3 text-center font-bold">{emailError}</p>
            )}
          </form>

          <p className="text-xs text-muted-foreground mt-6 text-center font-bold uppercase tracking-widest">
            ★ Sin spam · Solo contenido de valor · Baja cuando quieras ★
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;

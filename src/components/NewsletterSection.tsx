import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

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
    if (emailError) {
      validateEmail(value);
    }
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
          toast({
            title: "Ya estás suscrito",
            description: "Este correo ya está registrado en nuestra newsletter.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "¡Suscrito con éxito!",
          description: "Te enviaremos las últimas novedades a tu correo.",
        });
        setEmail("");
        setEmailError(null);
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al suscribirte. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden" aria-labelledby="newsletter-title">
      {/* Background */}
      <div className="absolute top-10 left-1/4 w-48 md:w-64 h-48 md:h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-10 right-1/4 w-48 md:w-64 h-48 md:h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6 md:mb-8" aria-hidden="true">
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          </div>

          {/* Content */}
          <h2 id="newsletter-title" className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Mantente <span className="text-primary">al Día</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg mb-6 md:mb-8 px-2">
            Suscríbete a nuestra newsletter y recibe notificaciones de nuevos episodios, 
            contenido exclusivo y las mejores aventuras.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => email && validateEmail(email)}
                  className={`h-14 pl-12 pr-6 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary rounded-full ${
                    emailError ? "border-destructive focus:border-destructive" : ""
                  }`}
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 group" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Suscribirme
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
            {emailError && (
              <p className="text-sm text-destructive mt-2 text-left">{emailError}</p>
            )}
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            Sin spam. Solo contenido de valor. Puedes darte de baja cuando quieras.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;

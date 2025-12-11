import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "¡Gracias por suscribirte!",
        description: "Te enviaremos las últimas novedades a tu correo.",
      });
      setEmail("");
    }
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-10 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-8">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>

          {/* Content */}
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Mantente <span className="text-primary">al Día</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Suscríbete a nuestra newsletter y recibe notificaciones de nuevos episodios, 
            contenido exclusivo y las mejores aventuras.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 pl-12 pr-6 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary rounded-full"
                required
              />
            </div>
            <Button type="submit" size="lg" className="h-14 px-8 group">
              Suscribirme
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
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

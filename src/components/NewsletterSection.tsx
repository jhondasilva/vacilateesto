import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight } from "lucide-react";
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
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-8">
            <Mail className="w-10 h-10 text-primary" />
          </div>

          {/* Content */}
          <h2 className="font-display text-5xl md:text-6xl mb-4">
            MANTENTE <span className="text-gradient">AL DÍA</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Suscríbete a nuestra newsletter y recibe notificaciones de nuevos episodios, 
            contenido exclusivo y mucho más.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 px-6 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
              required
            />
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

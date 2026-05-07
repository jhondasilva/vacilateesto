import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBrandAuth } from "@/hooks/useBrandAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";

type Brand = { id: string; name: string; slug: string };

const DashboardAdmin = () => {
  const { session, loading, isAdmin } = useBrandAuth();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandId, setBrandId] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      // Admin necesita ver todas las marcas: bypass RLS via direct SELECT no funciona,
      // así que dejamos que vean solo las suyas. Para ver todas, pedirle al usuario asignarse a sí mismo, o usar service role en edge.
      // Aquí mostramos todas las marcas vía select abierto: como brands tiene RLS por brand_users, usamos rpc o lista propia.
      const { data } = await supabase.from("brands").select("id, name, slug").order("name");
      setBrands((data ?? []) as Brand[]);
    })();
  }, [isAdmin]);

  if (!loading && !session) return <Navigate to="/dashboard/login" replace />;
  if (!loading && !isAdmin) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandId || !email || !password) {
      toast.error("Completa marca, email y contraseña");
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke("brand-user-create", {
      body: { brand_id: brandId, email, display_name: displayName, password },
    });
    setSubmitting(false);
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error ?? error?.message ?? "Error al crear cliente");
      return;
    }
    toast.success("Cliente creado y vinculado");
    setEmail("");
    setDisplayName("");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard"><ArrowLeft className="w-4 h-4" /></Link>
            </Button>
            <h1 className="font-black text-lg">Admin · Clientes</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-xl">
        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <UserPlus className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Crear / vincular cliente</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Marca</Label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                required
              >
                <option value="">Selecciona…</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email del cliente</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nombre (opcional)</Label>
              <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pass">Contraseña inicial</Label>
              <Input
                id="pass"
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
              />
              <p className="text-xs text-muted-foreground">
                Compártela con el cliente por un canal seguro. Puede cambiarla después.
              </p>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Crear cliente
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default DashboardAdmin;
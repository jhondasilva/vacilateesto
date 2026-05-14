import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type BrandLink = {
  brand_id: string;
  brand: { id: string; slug: string; name: string; logo_url: string | null; brand_color: string | null };
};

export const useBrandAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<BrandLink[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async (s: Session | null) => {
      if (!mounted) return;
      setSession(s);
      if (!s?.user) {
        setBrands([]);
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      setLoading(true);
      const [{ data: links }, { data: adminCheck }] = await Promise.all([
        supabase
          .from("brand_users")
          .select("brand_id, brand:brands(id, slug, name, logo_url, brand_color)")
          .order("created_at", { ascending: true }),
        supabase.rpc("is_allowed_user"),
      ]);
      if (!mounted) return;
      // Deduplicar por brand_id: si el usuario está en allowed_users (admin),
      // RLS devuelve TODOS los brand_users (uno por cada vínculo de cada usuario),
      // lo que multiplica las marcas en la UI. Forzamos una sola entrada por marca.
      const valid = (links ?? []).filter((l: any) => l.brand) as BrandLink[];
      const unique = Array.from(
        new Map(valid.map((l) => [l.brand.id, l])).values(),
      );
      setBrands(unique);
      setIsAdmin(adminCheck === true);
      setLoading(false);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      void load(s);
    });
    supabase.auth.getSession().then(({ data }) => void load(data.session));

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, loading, brands, isAdmin };
};
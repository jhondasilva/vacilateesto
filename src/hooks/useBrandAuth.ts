import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { createDashboardSessionGuard } from "@/lib/dashboardSessionGuard";

export type BrandLink = {
  brand_id: string;
  brand: { id: string; slug: string; name: string; logo_url: string | null; brand_color: string | null };
};
export type DashboardAccessMode = "standard" | "pan_readonly" | "none";

export const useBrandAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<BrandLink[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessMode, setAccessMode] = useState<DashboardAccessMode>("none");
  const [accessError, setAccessError] = useState(false);

  useEffect(() => {
    let mounted = true;
    const guard = createDashboardSessionGuard();
    const load = async (s: Session | null) => {
      const ticket = guard.next();
      if (!mounted) return;
      setSession(s);
      // Drop prior-identity privileges immediately, never retain them on failure.
      setBrands([]);
      setIsAdmin(false);
      setAccessMode("none");
      setAccessError(false);
      setLoading(Boolean(s?.user));
      if (!s?.user) return;
      try {
        const [{ data: links, error: linksError }, { data: adminCheck, error: adminError }, { data: rawContext, error: contextError }] = await Promise.all([
          supabase.from("brand_users")
            .select("brand_id, brand:brands(id, slug, name, logo_url, brand_color)")
            .order("created_at", { ascending: true }),
          supabase.rpc("is_allowed_user"),
          supabase.rpc("get_pan_access_context"),
        ]);
        if (!mounted || !guard.current(ticket)) return;
        const context = rawContext as { access_mode?: unknown; can_read_pan?: unknown } | null;
        if (linksError || adminError || contextError || !context ||
          !["standard", "pan_readonly", "none"].includes(String(context.access_mode))) throw new Error("Access unavailable");
        const mode = context.access_mode as DashboardAccessMode;
        const isAdminUser = mode !== "pan_readonly" && adminCheck === true;
        let unique: BrandLink[] = [];
        if (isAdminUser) {
          const { data: allBrands, error } = await supabase.from("brands")
            .select("id, slug, name, logo_url, brand_color").order("name", { ascending: true });
          if (error) throw error;
          unique = (allBrands ?? []).map(b => ({ brand_id: b.id, brand: b }));
        } else {
          const valid = (links ?? []).filter((l): l is BrandLink => Boolean(l.brand));
          unique = Array.from(new Map(valid.map(l => [l.brand.id, l])).values());
          if (mode === "pan_readonly") {
            unique = context.can_read_pan === true
              ? unique.filter(l => ["harina-pan", "pan-pdg"].includes(l.brand.slug)) : [];
          }
        }
        if (!mounted || !guard.current(ticket)) return;
        setBrands(unique);
        setIsAdmin(isAdminUser);
        setAccessMode(mode);
      } catch {
        if (mounted && guard.current(ticket)) setAccessError(true);
      } finally {
        if (mounted && guard.current(ticket)) setLoading(false);
      }
    };

    // Defer network calls until the Supabase auth callback has released its lock.
    let sawAuthEvent = false;
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      sawAuthEvent = true;
      guard.cancel();
      if (mounted) {
        setSession(s);
        setBrands([]);
        setIsAdmin(false);
        setAccessMode("none");
        setLoading(Boolean(s?.user));
      }
      setTimeout(() => { if (mounted) void load(s); }, 0);
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (!sawAuthEvent && mounted) void load(data.session);
    });
    return () => { mounted = false; guard.cancel(); sub.subscription.unsubscribe(); };
  }, []);
  return { session, loading, brands, isAdmin, accessMode, accessError };
};
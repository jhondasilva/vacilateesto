import { Fragment, useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/** Drop private component state and shared query caches at identity changes/logout, not routine token refresh. */
export default function DashboardSessionBoundary({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [revision, setRevision] = useState<number | null>(null);
  useEffect(() => {
    let mounted = true;
    let sawAuthEvent = false;
    let lastIdentity: string | null | undefined;
    const reset = (identity: string | null, force = false) => {
      if (!mounted || (!force && lastIdentity === identity)) return;
      lastIdentity = identity;
      void queryClient.cancelQueries();
      queryClient.clear();
      setRevision(current => (current ?? 0) + 1);
    };
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      sawAuthEvent = true;
      // No Supabase network call inside the auth callback.
      reset(session?.user.id ?? null, event === "SIGNED_OUT");
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (!sawAuthEvent) reset(data.session?.user.id ?? null);
    });
    return () => { mounted = false; subscription.subscription.unsubscribe(); };
  }, [queryClient]);
  if (revision === null) return <div className="p-8"><Loader2 aria-label="Verificando sesión" className="w-6 h-6 animate-spin" /></div>;
  return <Fragment key={revision}>{children}</Fragment>;
}

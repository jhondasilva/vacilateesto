import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type GiraAuthState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAllowed: boolean | null;
  displayName: string | null;
};

export const useGiraAuth = (): GiraAuthState => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;

    const checkAccess = async () => {
      if (!session?.user) {
        if (!active) return;
        setIsAllowed(false);
        setDisplayName(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setIsAllowed(null);

      const { data, error } = await supabase.rpc("is_allowed_user");
      if (!active) return;

      console.log("[useGiraAuth] access check", {
        email: session.user.email,
        allowed: data,
        error,
      });

      setIsAllowed(error ? false : !!data);
      setDisplayName(
        session.user.user_metadata?.full_name ??
          session.user.user_metadata?.name ??
          session.user.email ??
          null,
      );
      setLoading(false);
    };

    void checkAccess();

    return () => {
      active = false;
    };
  }, [session]);

  return {
    session,
    user: session?.user ?? null,
    loading,
    isAllowed,
    displayName,
  };
};

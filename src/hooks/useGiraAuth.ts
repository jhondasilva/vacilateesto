import { useEffect, useRef, useState } from "react";
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
  const requestIdRef = useRef(0);

  useEffect(() => {
    let mounted = true;

    const resolveSession = async (nextSession: Session | null) => {
      const requestId = ++requestIdRef.current;

      if (!mounted) return;
      setSession(nextSession);

      if (!nextSession?.user) {
        setIsAllowed(false);
        setDisplayName(null);
        setLoading(false);
        return;
      }

      setDisplayName(
        nextSession.user.user_metadata?.full_name ??
          nextSession.user.user_metadata?.name ??
          nextSession.user.email ??
          null,
      );
      setLoading(true);

      const { data, error } = await supabase.rpc("is_allowed_user");
      if (!mounted || requestId !== requestIdRef.current) return;

      console.log("[useGiraAuth] access check", {
        email: nextSession.user.email,
        allowed: data,
        error,
      });

      setIsAllowed(error ? false : data === true);
      setLoading(false);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void resolveSession(nextSession);
    });

    supabase.auth.getSession().then(({ data }) => {
      void resolveSession(data.session);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user: session?.user ?? null,
    loading,
    isAllowed,
    displayName,
  };
};

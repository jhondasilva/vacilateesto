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
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) {
        setIsAllowed(false);
        setDisplayName(null);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      if (!session?.user) {
        setIsAllowed(false);
        setDisplayName(null);
        return;
      }

      setIsAllowed(null);

      const { data, error } = await supabase.rpc("is_allowed_user");
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
    };

    void checkAccess();
  }, [session]);

  return {
    session,
    user: session?.user ?? null,
    loading,
    isAllowed,
    displayName,
  };
};

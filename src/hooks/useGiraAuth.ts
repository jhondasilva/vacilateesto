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
    // Listener PRIMERO (regla Lovable)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user?.email) {
      setIsAllowed(session === null ? false : null);
      setDisplayName(null);
      return;
    }

    const email = session.user.email.toLowerCase().trim();
    supabase
      .from("allowed_users")
      .select("display_name, email")
      .ilike("email", email)
      .maybeSingle()
      .then(({ data, error }) => {
        console.log("[useGiraAuth] whitelist check", { email, data, error });
        setIsAllowed(!!data);
        setDisplayName(data?.display_name ?? null);
      });
  }, [session]);

  return {
    session,
    user: session?.user ?? null,
    loading,
    isAllowed,
    displayName,
  };
};

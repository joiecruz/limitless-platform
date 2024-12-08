import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/signin", { replace: true });
      } else if (!session.user.email_confirmed_at) {
        navigate("/verify-email", { replace: true });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/signin", { replace: true });
      } else if (!session.user.email_confirmed_at) {
        navigate("/verify-email", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return <>{children}</>;
}
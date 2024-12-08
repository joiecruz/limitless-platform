import { useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    // Skip auth check for verify-email page
    if (location.pathname === '/verify-email') {
      setIsChecking(false);
      return;
    }

    const checkSession = async () => {
      try {
        console.log("RequireAuth: Checking session...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("RequireAuth: Session error:", sessionError);
          throw sessionError;
        }

        console.log("RequireAuth: Session state:", session);
        
        if (!session) {
          console.log("RequireAuth: No session found, redirecting to signin");
          await supabase.auth.signOut(); // Force clean session state
          navigate("/signin", { replace: true });
          return;
        }

        if (!session.user.email_confirmed_at) {
          console.log("RequireAuth: Email not confirmed, redirecting to verify-email");
          navigate("/verify-email", { replace: true });
          return;
        }

        setIsChecking(false);
      } catch (error: any) {
        console.error("RequireAuth: Auth error:", error);
        toast({
          title: "Authentication Error",
          description: "Please sign in again",
          variant: "destructive",
        });
        
        // Force clean session state and redirect
        await supabase.auth.signOut();
        navigate("/signin", { replace: true });
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("RequireAuth: Auth state changed:", event, session);
      
      // Skip auth redirects for verify-email page
      if (location.pathname === '/verify-email') {
        return;
      }

      if (!session) {
        console.log("RequireAuth: Session lost, redirecting to signin");
        navigate("/signin", { replace: true });
      } else if (!session.user.email_confirmed_at) {
        console.log("RequireAuth: Email not confirmed, redirecting to verify-email");
        navigate("/verify-email", { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, location.pathname]);

  if (isChecking) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}

import { useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Skip auth check for certain pages
    if (location.pathname === '/verify-email' || 
        location.pathname === '/signup' || 
        location.pathname === '/reset-password') {
      setIsChecking(false);
      return;
    }

    const checkSession = async () => {
      try {
        console.log("RequireAuth: Checking session...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("RequireAuth: Session error:", sessionError);
          localStorage.clear();
          await supabase.auth.signOut();
          setIsAuthenticated(false);
          navigate("/signin", { replace: true });
          return;
        }

        console.log("RequireAuth: Session state:", session);
        
        if (!session) {
          console.log("RequireAuth: No session found, redirecting to signin");
          setIsAuthenticated(false);
          localStorage.clear();
          await supabase.auth.signOut();
          navigate("/signin", { replace: true });
          return;
        }

        if (!session.user.email_confirmed_at) {
          console.log("RequireAuth: Email not confirmed, redirecting to verify-email");
          setIsAuthenticated(false);
          navigate("/verify-email", { replace: true });
          return;
        }

        setIsAuthenticated(true);
        setIsChecking(false);
      } catch (error: any) {
        console.error("RequireAuth: Auth error:", error);
        localStorage.clear();
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        navigate("/signin", { replace: true });
        toast({
          title: "Authentication Error",
          description: "Please sign in again",
          variant: "destructive",
        });
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("RequireAuth: Auth state changed:", event, session);
      
      if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        return;
      }

      // Skip auth redirects for certain pages
      if (location.pathname === '/verify-email' || 
          location.pathname === '/signup' || 
          location.pathname === '/reset-password') {
        return;
      }

      if (!session || event === 'SIGNED_OUT') {
        console.log("RequireAuth: Session lost or signed out, redirecting to signin");
        setIsAuthenticated(false);
        localStorage.clear();
        navigate("/signin", { replace: true });
      } else if (!session.user.email_confirmed_at) {
        console.log("RequireAuth: Email not confirmed, redirecting to verify-email");
        setIsAuthenticated(false);
        navigate("/verify-email", { replace: true });
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, location.pathname]);

  if (isChecking) {
    return null; // Or a loading spinner
  }

  // Skip auth check for reset-password and other non-auth-required pages
  if (location.pathname === '/reset-password' ||
      location.pathname === '/verify-email' || 
      location.pathname === '/signup') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default RequireAuth;

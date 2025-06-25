
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoadingPage } from "@/components/common/LoadingPage";
import { isApexDomain } from "@/utils/domainHelpers";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    
    

    // Handle apex domain issue for authenticated users
    if (isApexDomain()) {
      
      // We'll let the main.tsx handle this redirect to avoid interference with authentication
      return;
    }

    // Skip auth check for certain pages
    if (location.pathname === '/verify-email' ||
        location.pathname === '/signup' ||
        location.pathname === '/reset-password' ||
        location.pathname === '/invite') {
      
      setIsChecking(false);
      return;
    }

    const checkSession = async () => {
      try {
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        

        if (sessionError) {
          
          localStorage.removeItem('selectedWorkspace');
          await supabase.auth.signOut();
          setIsAuthenticated(false);
          navigate("/signin", { replace: true, state: { from: location } });
          return;
        }

        if (!session) {
          
          setIsAuthenticated(false);
          localStorage.removeItem('selectedWorkspace');
          navigate("/signin", { replace: true, state: { from: location } });
          return;
        }

        if (!session.user.email_confirmed_at) {
          
          setIsAuthenticated(false);
          navigate("/verify-email", { replace: true });
          return;
        }

        setIsAuthenticated(true);
        setIsChecking(false);
      } catch (error: any) {
        
        localStorage.removeItem('selectedWorkspace');
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        navigate("/signin", { replace: true, state: { from: location } });
        toast({
          title: "Authentication Error",
          description: "Please sign in again",
          variant: "destructive",
        });
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      
      

      if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
        
        setIsAuthenticated(true);
        setIsChecking(false);
        return;
      }

      // Skip auth redirects for certain pages
      if (location.pathname === '/verify-email' ||
          location.pathname === '/signup' ||
          location.pathname === '/reset-password' ||
          location.pathname === '/invite') {
        return;
      }

      if (!session || event === 'SIGNED_OUT') {
        
        setIsAuthenticated(false);
        localStorage.removeItem('selectedWorkspace');
        navigate("/signin", { replace: true });
      } else if (!session.user.email_confirmed_at) {
        
        setIsAuthenticated(false);
        navigate("/verify-email", { replace: true });
      } else {
        setIsAuthenticated(true);
        setIsChecking(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, location.pathname]);

  if (isChecking) {
    return <LoadingPage />; // Show loading indicator while checking authentication
  }

  // Skip auth check for reset-password and other non-auth-required pages
  if (location.pathname === '/reset-password' ||
      location.pathname === '/verify-email' ||
      location.pathname === '/signup' ||
      location.pathname === '/invite') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default RequireAuth;

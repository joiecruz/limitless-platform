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
    // Refined logic for password reset page detection
    const isPasswordResetPage = location.pathname === '/reset-password';
    
    // Check for reset tokens in various formats
    const hasHashToken = location.hash && (
      location.hash.includes('type=recovery') || 
      location.hash.includes('access_token') ||
      // Also check for JWT that might be the whole hash
      (location.hash.length > 20 && !location.hash.includes('='))
    );
    
    const hasQueryToken = location.search && (
      location.search.includes('type=recovery') || 
      location.search.includes('token=') || 
      location.search.includes('access_token=')
    );
    
    const hasResetToken = hasHashToken || hasQueryToken;
    
    // If we're on the reset password page with a token, skip auth check completely
    if (isPasswordResetPage && hasResetToken) {
      console.log("RequireAuth: On reset password page with token, skipping all auth checks");
      setIsChecking(false);
      return;
    }
    
    // Skip auth check for certain pages
    if (location.pathname === '/verify-email' || 
        location.pathname === '/signup' || 
        location.pathname === '/signin' ||
        (location.pathname === '/reset-password' && !hasResetToken)) {
      console.log("RequireAuth: Skipping auth check for special route:", location.pathname);
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
  }, [navigate, toast, location.pathname, location.hash, location.search]);

  if (isChecking) {
    return null; // Or a loading spinner
  }

  // Check if we're on the reset-password page with a token in various locations
  const isPasswordResetPage = location.pathname === '/reset-password';
  
  // Check for reset tokens in various formats
  const hasHashToken = location.hash && (
    location.hash.includes('type=recovery') || 
    location.hash.includes('access_token') ||
    (location.hash.length > 20 && !location.hash.includes('='))
  );
  
  const hasQueryToken = location.search && (
    location.search.includes('type=recovery') || 
    location.search.includes('token=') || 
    location.search.includes('access_token=')
  );
  
  const hasResetToken = hasHashToken || hasQueryToken;
  
  // Skip auth check for reset-password with token and other non-auth-required pages
  if ((isPasswordResetPage && hasResetToken) ||
      (isPasswordResetPage && !hasResetToken) ||
      location.pathname === '/verify-email' || 
      location.pathname === '/signin' ||
      location.pathname === '/signup') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default RequireAuth;

import { useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OnboardingModal } from "../onboarding/OnboardingModal";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  useEffect(() => {
    let mounted = true;
    
    // Skip auth check for verify-email and signup pages
    if (location.pathname === '/verify-email' || location.pathname === '/signup') {
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
          if (mounted) {
            setIsAuthenticated(false);
            // Force clean session state
            await supabase.auth.signOut();
            navigate("/signin", { replace: true });
          }
          return;
        }

        if (!session.user.email_confirmed_at) {
          console.log("RequireAuth: Email not confirmed, redirecting to verify-email");
          if (mounted) {
            setIsAuthenticated(false);
            navigate("/verify-email", { replace: true });
          }
          return;
        }

        // Check if user has completed onboarding
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, role, company_size, goals, referral_source')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("RequireAuth: Profile error:", profileError);
          throw profileError;
        }

        // Check if any required profile fields are missing
        if (!profile.first_name || !profile.last_name || !profile.role || 
            !profile.company_size || !profile.goals || !profile.referral_source) {
          console.log("RequireAuth: Profile incomplete, showing onboarding modal");
          if (mounted) {
            setIsAuthenticated(true);
            setShowOnboarding(true);
          }
          return;
        }

        if (mounted) {
          setIsAuthenticated(true);
          setIsChecking(false);
        }
      } catch (error: any) {
        console.error("RequireAuth: Auth error:", error);
        if (mounted) {
          toast({
            title: "Authentication Error",
            description: "Please sign in again",
            variant: "destructive",
          });
          
          setIsAuthenticated(false);
          // Force clean session state and redirect
          await supabase.auth.signOut();
          navigate("/signin", { replace: true });
        }
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("RequireAuth: Auth state changed:", event, session);
      
      if (!mounted) return;
      
      // Skip auth redirects for verify-email and signup pages
      if (location.pathname === '/verify-email' || location.pathname === '/signup') {
        return;
      }

      if (!session) {
        console.log("RequireAuth: Session lost, redirecting to signin");
        setIsAuthenticated(false);
        navigate("/signin", { replace: true });
      } else if (!session.user.email_confirmed_at) {
        console.log("RequireAuth: Email not confirmed, redirecting to verify-email");
        setIsAuthenticated(false);
        navigate("/verify-email", { replace: true });
      } else {
        // Check if user has completed onboarding
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, role, company_size, goals, referral_source')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("RequireAuth: Profile error:", profileError);
          return;
        }

        // Check if any required profile fields are missing
        if (!profile.first_name || !profile.last_name || !profile.role || 
            !profile.company_size || !profile.goals || !profile.referral_source) {
          console.log("RequireAuth: Profile incomplete, showing onboarding modal");
          setIsAuthenticated(true);
          setShowOnboarding(true);
          return;
        }

        setIsAuthenticated(true);
        setIsChecking(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast, location.pathname]);

  if (isChecking) {
    return null; // Or a loading spinner
  }

  if (!isAuthenticated) {
    // Redirect to signin while preserving the attempted URL
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (showOnboarding) {
    return <OnboardingModal />;
  }

  return <>{children}</>;
}
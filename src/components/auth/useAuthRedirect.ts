import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useAuthRedirect() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("SignIn - Starting session check");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log("SignIn - Session data:", { session, error });
        
        if (error) {
          console.error("SignIn - Session error:", error);
          localStorage.clear();
          await supabase.auth.signOut();
          return;
        }

        // Check URL parameters for error messages
        const params = new URLSearchParams(window.location.hash.substring(1));
        const errorMessage = params.get('error_description');
        
        if (errorMessage) {
          console.error("Auth Error:", errorMessage);
          toast({
            title: "Authentication Error",
            description: errorMessage.replace(/\+/g, ' '),
            variant: "destructive",
          });
          navigate("/signin");
          return;
        }

        // Check domain and redirect if needed
        const currentDomain = window.location.hostname;
        const isAppDomain = currentDomain === 'app.limitlesslab.org';
        const isMainDomain = currentDomain === 'limitlesslab.org' || currentDomain === 'www.limitlesslab.org';

        if (session) {
          console.log("SignIn - Session found:", {
            user: session.user,
            emailConfirmed: session.user.email_confirmed_at,
            email: session.user.email
          });

          if (!session.user.email_confirmed_at) {
            console.log("SignIn - Email not confirmed, redirecting to verify-email");
            localStorage.setItem('verificationEmail', session.user.email || '');
            navigate("/verify-email", { replace: true });
            toast({
              description: "Please confirm your email to log in. Check your inbox, and if you don't see it, look in your spam or junk folder for the confirmation link.",
            });
            return;
          }

          if (isMainDomain) {
            console.log("SignIn - Redirecting to app domain");
            window.location.href = `https://app.limitlesslab.org/dashboard`;
            return;
          }

          if (isAppDomain) {
            console.log("SignIn - Active session found, redirecting to dashboard");
            navigate("/dashboard", { replace: true });
            return;
          }
        } else {
          console.log("SignIn - No active session found");
          // Store invite token if present
          const params = new URLSearchParams(window.location.search);
          const inviteToken = params.get('token');
          if (inviteToken) {
            localStorage.setItem('inviteToken', inviteToken);
          }
        }
      } catch (error) {
        console.error("SignIn - Error checking session:", error);
        localStorage.clear();
        await supabase.auth.signOut();
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("SignIn - Auth state changed:", { event, session });

      // Check domain and redirect if needed
      const currentDomain = window.location.hostname;
      const isAppDomain = currentDomain === 'app.limitlesslab.org';
      const isMainDomain = currentDomain === 'limitlesslab.org' || currentDomain === 'www.limitlesslab.org';

      if (event === 'SIGNED_IN' && session) {
        console.log("SignIn - Sign in event detected:", {
          user: session.user,
          emailConfirmed: session.user.email_confirmed_at,
          email: session.user.email
        });

        if (!session.user.email_confirmed_at) {
          console.log("SignIn - Email not confirmed, redirecting to verify-email");
          localStorage.setItem('verificationEmail', session.user.email || '');
          navigate("/verify-email", { replace: true });
          toast({
            description: "Please confirm your email to log in. Check your inbox, and if you don't see it, look in your spam or junk folder for the confirmation link.",
          });
          return;
        }

        if (isMainDomain) {
          console.log("SignIn - Redirecting to app domain");
          window.location.href = `https://app.limitlesslab.org/dashboard`;
          return;
        }

        if (isAppDomain) {
          console.log("SignIn - User signed in, redirecting to dashboard");
          navigate("/dashboard", { replace: true });
          return;
        }
      }

      if (!session || event === 'SIGNED_OUT') {
        console.log("SignIn - Session lost or signed out");
        localStorage.clear();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);
}
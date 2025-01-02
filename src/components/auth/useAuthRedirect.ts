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

        if (session) {
          console.log("SignIn - Session found:", {
            user: session.user,
            emailConfirmed: session.user.email_confirmed_at,
            email: session.user.email
          });

          // Check if this is a new confirmation
          const isEmailConfirmation = window.location.hash.includes('type=signup') || 
                                    window.location.hash.includes('type=email_change');

          if (!session.user.email_confirmed_at) {
            console.log("SignIn - Email not confirmed, redirecting to verify-email");
            localStorage.setItem('verificationEmail', session.user.email || '');
            navigate("/verify-email", { replace: true });
            toast({
              description: "Please confirm your email to log in. Check your inbox, and if you don't see it, look in your spam or junk folder for the confirmation link.",
            });
            return;
          }

          // Get user profile to check if onboarding is needed
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name, role, company_size, goals, referral_source')
            .eq('id', session.user.id)
            .single();

          const needsOnboarding = !profile?.first_name || 
                                !profile?.last_name || 
                                !profile?.role || 
                                !profile?.company_size || 
                                !profile?.goals || 
                                !profile?.referral_source;

          // Check if we're on the app domain
          const isAppDomain = window.location.hostname === 'app.limitlesslab.org';
          
          if (!isAppDomain) {
            // Redirect to app domain with the current session
            const appUrl = window.location.href.replace('limitlesslab.org', 'app.limitlesslab.org');
            // If this is a new confirmation or needs onboarding, add the appropriate parameter
            const redirectUrl = `${appUrl}/dashboard${needsOnboarding || isEmailConfirmation ? '?showOnboarding=true' : ''}`;
            console.log("Redirecting to app domain:", redirectUrl);
            window.location.href = redirectUrl;
            return;
          }

          if (needsOnboarding || isEmailConfirmation) {
            console.log("SignIn - User needs onboarding, setting state");
            navigate("/dashboard", { 
              replace: true,
              state: { showOnboarding: true }
            });
          } else {
            console.log("SignIn - Active session found, redirecting to dashboard");
            navigate("/dashboard", { replace: true });
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

        // Get user profile to check if onboarding is needed
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, role, company_size, goals, referral_source')
          .eq('id', session.user.id)
          .single();

        const needsOnboarding = !profile?.first_name || 
                              !profile?.last_name || 
                              !profile?.role || 
                              !profile?.company_size || 
                              !profile?.goals || 
                              !profile?.referral_source;

        // Check if we're on the app domain
        const isAppDomain = window.location.hostname === 'app.limitlesslab.org';
        
        if (!isAppDomain) {
          // Redirect to app domain with the current session
          const appUrl = window.location.href.replace('limitlesslab.org', 'app.limitlesslab.org');
          window.location.href = `${appUrl}/dashboard${needsOnboarding ? '?showOnboarding=true' : ''}`;
          return;
        }

        if (needsOnboarding) {
          console.log("SignIn - User needs onboarding, setting state");
          navigate("/dashboard", { 
            replace: true,
            state: { showOnboarding: true }
          });
        } else {
          console.log("SignIn - User signed in, redirecting to dashboard");
          navigate("/dashboard", { replace: true });
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
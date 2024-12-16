import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useSessionManager() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const inviteToken = new URLSearchParams(window.location.search).get('token');

  useEffect(() => {
    console.log("SignIn - Starting session check");
    
    const checkSession = async () => {
      try {
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

          if (!session.user.email_confirmed_at) {
            console.log("SignIn - Email not confirmed, redirecting to verify-email");
            localStorage.setItem('verificationEmail', session.user.email || '');
            navigate("/verify-email", { replace: true });
            toast({
              description: "Please confirm your email to log in. Check your inbox, and if you don't see it, look in your spam or junk folder for the confirmation link.",
            });
            return;
          }
          console.log("SignIn - Active session found, redirecting to dashboard");
          navigate("/dashboard");
        } else {
          console.log("SignIn - No active session found");
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
        console.log("SignIn - User signed in, redirecting to dashboard");
        navigate("/dashboard");
      }

      if (event === 'USER_UPDATED' && session?.user.email && !session.user.email_confirmed_at) {
        console.log("SignIn - User updated but email not confirmed");
        localStorage.setItem('verificationEmail', session.user.email);
        navigate("/verify-email", { replace: true });
        toast({
          description: "Please confirm your email to log in. Check your inbox, and if you don't see it, look in your spam or junk folder for the confirmation link.",
        });
      }
    });

    return () => {
      console.log("SignIn - Cleaning up auth listener");
      subscription.unsubscribe();
    };
  }, [navigate, toast, inviteToken]);
}
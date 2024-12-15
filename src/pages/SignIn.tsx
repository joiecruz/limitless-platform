import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SignInLogo } from "@/components/auth/SignInLogo";
import { SignInCard } from "@/components/auth/SignInCard";

export default function SignIn() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Enable verbose logging
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      originalLog('[VERBOSE]', new Date().toISOString(), ...args);
    };
    
    console.error = (...args) => {
      originalError('[ERROR]', new Date().toISOString(), ...args);
    };

    // Check initial session
    const checkSession = async () => {
      try {
        console.log("SignIn - Starting session check");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log("SignIn - Session data:", { session, error });
        
        if (error) {
          console.error("SignIn - Session error:", error);
          localStorage.clear(); // Clear all local storage on error
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
        }
      } catch (error) {
        console.error("SignIn - Error checking session:", error);
        localStorage.clear(); // Clear all local storage on error
        await supabase.auth.signOut();
      }
    };

    checkSession();

    // Listen for auth changes
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

      // Handle email not confirmed error
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
      // Restore original console methods
      console.log = originalLog;
      console.error = originalError;
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <SignInLogo />
        <SignInCard />
      </div>
    </div>
  );
}
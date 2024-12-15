import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { AuthLinks } from "@/components/auth/AuthLinks";

export default function SignIn() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get('token');

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
          // If there's an invite token, store it in localStorage
          if (inviteToken) {
            localStorage.setItem('inviteToken', inviteToken);
          }
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
  }, [navigate, toast, inviteToken]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <AuthLogo />

        {/* Sign In Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Sign in</h2>
            <p className="mt-2 text-sm text-gray-600">
              Where innovation meets possibility – your journey to limitless learning begins here
            </p>
          </div>

          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#393ca0',
                    brandAccent: '#2d2f80',
                    brandButtonText: 'white',
                    defaultButtonBackground: 'white',
                    defaultButtonBackgroundHover: '#f9fafb',
                    inputBackground: 'white',
                    inputBorder: '#e5e7eb',
                    inputBorderHover: '#393ca0',
                    inputBorderFocus: '#393ca0',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '0.5rem',
                    buttonBorderRadius: '0.5rem',
                    inputBorderRadius: '0.5rem',
                  },
                },
              },
              style: {
                button: {
                  height: '2.75rem',
                  borderRadius: '0.5rem',
                },
                input: {
                  height: '2.75rem',
                  borderRadius: '0.5rem',
                },
                anchor: {
                  color: '#393ca0',
                  textDecoration: 'none',
                },
                message: {
                  color: '#ef4444',
                },
                divider: {
                  background: '#e5e7eb',
                },
              },
            }}
            theme="default"
            providers={[]}
            redirectTo={`${window.location.origin}/dashboard`}
            showLinks={false}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Password',
                  button_label: 'Sign in',
                  loading_button_label: 'Signing in...',
                  social_provider_text: 'Sign in with {{provider}}',
                  link_text: 'Already have an account? Sign in',
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Password',
                  button_label: 'Sign up',
                  loading_button_label: 'Signing up...',
                  social_provider_text: 'Sign up with {{provider}}',
                  link_text: "Don't have an account? Sign up",
                },
              },
            }}
          />
          
          <AuthLinks />
        </div>
      </div>
    </div>
  );
}

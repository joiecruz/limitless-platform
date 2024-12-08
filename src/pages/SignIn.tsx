import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      try {
        console.log("SignIn - Checking initial session...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("SignIn - Session error:", error);
          localStorage.clear(); // Clear all local storage on error
          await supabase.auth.signOut();
          return;
        }

        if (session) {
          if (!session.user.email_confirmed_at) {
            console.log("SignIn - Email not confirmed, redirecting to verify-email");
            localStorage.setItem('verificationEmail', session.user.email || '');
            navigate("/verify-email", { replace: true });
            toast({
              title: "Email verification required",
              description: "Please confirm your email to log in. Check your inbox, and if you don't see it, look in your spam or junk folder for the confirmation link.",
            });
            return;
          }
          console.log("SignIn - Active session found, redirecting to dashboard");
          navigate("/dashboard");
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
      console.log("SignIn - Auth state changed:", event, session);

      if (event === 'SIGNED_IN' && session) {
        if (!session.user.email_confirmed_at) {
          console.log("SignIn - Email not confirmed, redirecting to verify-email");
          localStorage.setItem('verificationEmail', session.user.email || '');
          navigate("/verify-email", { replace: true });
          toast({
            title: "Email verification required",
            description: "Please confirm your email to log in. Check your inbox, and if you don't see it, look in your spam or junk folder for the confirmation link.",
          });
          return;
        }
        console.log("SignIn - User signed in, redirecting to dashboard");
        navigate("/dashboard");
      }

      // Handle email not confirmed error
      if (event === 'USER_UPDATED' && session?.user.email && !session.user.email_confirmed_at) {
        localStorage.setItem('verificationEmail', session.user.email);
        navigate("/verify-email", { replace: true });
        toast({
          title: "Email verification required",
          description: "Please confirm your email to log in. Check your inbox, and if you don't see it, look in your spam or junk folder for the confirmation link.",
        });
      }
    });

    return () => {
      console.log("SignIn - Cleaning up auth listener");
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <img 
            src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/sign/web-assets/Limitless%20Lab%20Logo%20SVG.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWItYXNzZXRzL0xpbWl0bGVzcyBMYWIgTG9nbyBTVkcuc3ZnIiwiaWF0IjoxNzMzNTkxMTc5LCJleHAiOjIwNDg5NTExNzl9.CBJpt7X0mbXpXxv8uMqmA7nBeoJpslY38xQKmPr7XQw"
            alt="Limitless Lab"
            className="h-12 w-auto mx-auto mb-6"
          />
        </div>

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
          />
          
          {/* Sign Up Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold text-primary hover:text-primary/80"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
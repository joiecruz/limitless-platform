import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function SignIn() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        navigate("/dashboard");
      } else if (event === 'USER_DELETED' || event === 'SIGNED_OUT') {
        navigate("/signin");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your Limitless Lab account
          </p>
          <div className="mt-4 text-sm text-gray-600">
            <p>Password requirements:</p>
            <ul className="list-disc list-inside text-xs text-gray-500 mt-1">
              <li>Minimum 6 characters</li>
              <li>At least one letter and one number</li>
            </ul>
          </div>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(var(--color-primary-600))',
                  brandAccent: 'rgb(var(--color-primary-700))'
                }
              }
            }
          }}
          providers={[]}
          redirectTo={`${window.location.origin}/dashboard`}
          onError={(error) => {
            console.error('Auth error:', error);
            toast({
              title: "Authentication Error",
              description: error.message === "Invalid login credentials" 
                ? "Invalid email or password. Please try again." 
                : error.message,
              variant: "destructive"
            });
          }}
        />
      </div>
    </div>
  );
}
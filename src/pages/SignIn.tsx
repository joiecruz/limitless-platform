import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function SignIn() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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
          />

          {/* Test Credentials Section */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm space-y-3 md:block">
            <p className="font-medium text-gray-700">Test credentials you can use:</p>
            <div className="p-3 bg-white rounded-md shadow-sm">
              <p className="text-gray-600">Email: test@example.com</p>
              <p className="text-gray-600">Password: Test123456</p>
            </div>
            <div className="mt-3">
              <p className="font-medium text-gray-700">Password requirements:</p>
              <ul className="list-disc list-inside text-gray-600 mt-1 text-xs">
                <li>Minimum 6 characters</li>
                <li>At least one letter and one number</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
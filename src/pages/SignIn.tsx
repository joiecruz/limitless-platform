import { useAuthRedirect } from "@/components/auth/useAuthRedirect";
import { SignInForm } from "@/components/auth/SignInForm";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { AuthLinks } from "@/components/auth/AuthLinks";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export default function SignIn() {
  useAuthRedirect();
  const navigate = useNavigate();

  // Check domain and redirect if needed
  useEffect(() => {
    const currentDomain = window.location.hostname;
    const isAppDomain = currentDomain === 'app.limitlesslab.org';
    const isMainDomain = currentDomain === 'limitlesslab.org' || currentDomain === 'www.limitlesslab.org';

    if (!isAppDomain && !isMainDomain) return;

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        if (isMainDomain) {
          window.location.href = `https://app.limitlesslab.org/dashboard`;
          return;
        }
        if (isAppDomain) {
          navigate('/dashboard');
          return;
        }
      }
    };

    checkSession();
  }, [navigate]);

  // Query to check if user is authenticated
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  const handleLogoClick = () => {
    if (session) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div onClick={handleLogoClick} className="cursor-pointer">
          <AuthLogo />
        </div>

        {/* Sign In Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Sign in</h2>
            <p className="mt-2 text-sm text-gray-600">
              Where innovation meets possibility – your journey to limitless learning begins here
            </p>
          </div>

          <SignInForm />
          <AuthLinks />
        </div>
      </div>
    </div>
  );
}
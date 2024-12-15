import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { authUIConfig } from "@/components/auth/AuthUIConfig";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <AuthLogo />

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Reset Password</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email and we'll send you instructions to reset your password
            </p>
          </div>

          <Auth
            supabaseClient={supabase}
            {...authUIConfig}
            view="forgot_password"
            showLinks={false}
          />

          <div className="text-center mt-4">
            <Button
              variant="link"
              className="text-sm text-primary hover:text-primary/80"
              onClick={() => navigate("/signin")}
            >
              Back to Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
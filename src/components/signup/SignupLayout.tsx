import { AuthLogo } from "@/components/auth/AuthLogo";
import { SignupProgress } from "./SignupProgress";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SignupLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps?: number;
  showProgress?: boolean;
}

export function SignupLayout({ 
  children, 
  currentStep, 
  totalSteps = 4,
  showProgress = true 
}: SignupLayoutProps) {
  const navigate = useNavigate();

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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div onClick={handleLogoClick} className="cursor-pointer">
            <AuthLogo />
          </div>
        </div>

        {showProgress && (
          <SignupProgress currentStep={currentStep} totalSteps={totalSteps} />
        )}

        <div className="mt-8">
          {children}
        </div>
      </div>
    </div>
  );
}

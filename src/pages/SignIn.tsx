import { useAuthRedirect } from "@/components/auth/useAuthRedirect";
import { SignInForm } from "@/components/auth/SignInForm";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { AuthLinks } from "@/components/auth/AuthLinks";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { LoadingPage } from "@/components/common/LoadingPage";
import { useToast } from "@/hooks/use-toast";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function SignIn() {
  useAuthRedirect();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  // Query to check if user is authenticated
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  useEffect(() => {
    const handleAuthChange = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (currentSession?.user) {
          setIsLoading(true);
          

          try {
            // Check for workspace membership using edge function to bypass RLS
            const { data: workspaces, error } = await supabase.functions.invoke('get-user-workspaces', {
              body: { user_id: currentSession.user.id }
            });

            if (error) {
              
              toast({
                title: "Error",
                description: "There was a problem signing you in. Please try again.",
                variant: "destructive",
              });
              return;
            }

            // If user has no workspace, show onboarding with workspace creation
            if (!workspaces || !workspaces.workspaces || workspaces.workspaces.length === 0) {
              
              navigate('/dashboard', {
                replace: true
              });
              return;
            }

            // User has a workspace, mark as onboarded and go to dashboard
            const firstWorkspace = workspaces.workspaces[0];
            
            if (firstWorkspace && firstWorkspace.id) {
              localStorage.setItem('selectedWorkspace', firstWorkspace.id);
              localStorage.setItem('dashboard-visited', 'true');
            }
            navigate('/dashboard', { replace: true });
          } catch (error) {
            
          }
        }
      } catch (error) {
        
        toast({
          title: "Error",
          description: "There was a problem signing you in. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    handleAuthChange();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      

      if (event === 'SIGNED_IN' && session) {
        setIsLoading(true);
        try {
          // Check for workspace membership using edge function to bypass RLS
          const { data: workspaces, error } = await supabase.functions.invoke('get-user-workspaces', {
            body: { user_id: session.user.id }
          });

          if (error) {
            
            throw error;
          }

          // If user has no workspace, show onboarding with workspace creation
          if (!workspaces || !workspaces.workspaces || workspaces.workspaces.length === 0) {
            navigate('/dashboard', {
              replace: true
            });
            return;
          }

          // User has a workspace, mark as onboarded and go to dashboard
          const firstWorkspace = workspaces.workspaces[0];
          if (firstWorkspace && firstWorkspace.id) {
            localStorage.setItem('selectedWorkspace', firstWorkspace.id);
            localStorage.setItem('dashboard-visited', 'true');
          }
          navigate('/dashboard', { replace: true });
        } catch (error) {
          
          toast({
            title: "Error",
            description: "There was a problem signing you in. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  // Clear localStorage once when sign-in page loads (only if not authenticated)
  useEffect(() => {
    const clearStorageForUnauthenticated = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          localStorage.clear();
          
        } else {
          
        }
      } catch (error) {
        
        // If there's an error, clear localStorage as a safety measure
        localStorage.clear();
      }
    };

    clearStorageForUnauthenticated();
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  const handleLogoClick = () => {
    if (session) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  // Get email from the input field
  const getEmailFromForm = (): string => {
    const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
    return emailInput?.value || '';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div onClick={handleLogoClick} className="cursor-pointer">
          <AuthLogo />
        </div>

        {/* Sign In Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
          {showPasswordReset ? (
            <ForgotPasswordForm
              onCancel={() => setShowPasswordReset(false)}
              initialEmail={getEmailFromForm()}
            />
          ) : (
            <>
              <SignInForm />
              <AuthLinks onForgotPassword={() => setShowPasswordReset(true)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

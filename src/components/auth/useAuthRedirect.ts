
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { checkUserProfile } from "@/hooks/useProfileCheck";

interface WorkspaceMemberData {
  workspace_id: string;
  workspaces: {
    id: string;
    name: string;
  };
}

export function useAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthChange = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("useAuthRedirect - Current session:", session);

        // Skip auth redirects for specific auth-related pages
        if (location.pathname.includes('/reset-password')) {
          console.log("useAuthRedirect - On reset password page, skipping redirect");
          return;
        }

        if (!session) {
          // If no session and not on auth pages, redirect to signin
          if (!location.pathname.includes('/signin') && 
              !location.pathname.includes('/signup') && 
              !location.pathname.includes('/verify-email') &&
              !location.pathname.includes('/invite')) {
            navigate('/signin');
          }
          return;
        }

        // Check if user needs to complete onboarding
        const needsOnboarding = await checkUserProfile(session);
        console.log("useAuthRedirect - Needs onboarding:", needsOnboarding);
        
        if (needsOnboarding && 
            !location.pathname.includes('/onboarding') && 
            !location.pathname.includes('/invite')) {
          navigate('/onboarding');
          return;
        }

        // If user is authenticated and on auth pages, redirect to dashboard
        if (location.pathname.includes('/signin') || 
            location.pathname.includes('/signup')) {
          
          try {
            // Check workspace membership with service role to bypass RLS
            const { data: memberData, error: memberError } = await supabase.functions.invoke('get-user-workspaces', {
              body: { user_id: session.user.id }
            });

            if (memberError) {
              console.error('Error checking workspace membership:', memberError);
              toast({
                title: "Error",
                description: "Failed to check membership. Please try again.",
                variant: "destructive",
              });
              return;
            }

            if (!memberData || memberData.length === 0) {
              console.log("useAuthRedirect - No workspace found, redirecting to onboarding");
              toast({
                title: "Welcome!",
                description: "Let's create your first workspace",
              });
              navigate('/onboarding', { replace: true });
              return;
            }

            // Use the first workspace as default
            const workspace = memberData[0];
            localStorage.setItem('selectedWorkspace', workspace.id);
            console.log("useAuthRedirect - Setting workspace and redirecting to dashboard:", workspace);
            toast({
              title: "Welcome back!",
              description: `You've been redirected to ${workspace.name || 'your workspace'}`,
            });
            navigate('/dashboard', { replace: true });
            return;
          } catch (error) {
            console.error("Error fetching workspaces:", error);
            // Fall back to onboarding if there's an error
            navigate('/onboarding', { replace: true });
            return;
          }
        }

        // Force redirect to dashboard if authenticated and not in special routes
        if (session && 
            !location.pathname.includes('/dashboard') && 
            !location.pathname.includes('/onboarding') && 
            !location.pathname.includes('/invite')) {
          try {
            const { data: memberData } = await supabase.functions.invoke('get-user-workspaces', {
              body: { user_id: session.user.id }
            });

            if (memberData && memberData.length > 0) {
              const workspace = memberData[0];
              localStorage.setItem('selectedWorkspace', workspace.id);
              navigate('/dashboard', { replace: true });
            } else {
              navigate('/onboarding', { replace: true });
            }
          } catch (error) {
            console.error("Error in redirect:", error);
            navigate('/onboarding', { replace: true });
          }
          return;
        }

        // Handle email verification success
        const isEmailVerificationSuccess = new URLSearchParams(location.search).get('emailVerified') === 'true';
        if (isEmailVerificationSuccess) {
          try {
            const { data: memberData, error: memberError } = await supabase.functions.invoke('get-user-workspaces', {
              body: { user_id: session.user.id }
            });

            if (!memberError && memberData && memberData.length > 0) {
              const workspace = memberData[0];
              localStorage.setItem('selectedWorkspace', workspace.id);
              toast({
                title: "Email verified!",
                description: `Welcome to ${workspace.name || 'your workspace'}`,
              });
              navigate('/dashboard', { replace: true });
            } else {
              navigate('/onboarding', { replace: true });
            }
          } catch (error) {
            console.error("Error handling email verification:", error);
            navigate('/onboarding', { replace: true });
          }
        }

      } catch (error) {
        console.error('Auth redirect error:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    };

    handleAuthChange();
  }, [navigate, location, toast]);
}

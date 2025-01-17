import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { checkUserProfile } from "@/hooks/useProfileCheck";

export function useAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthChange = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          // If no session and not on auth pages, redirect to signin
          if (!location.pathname.includes('/signin') && 
              !location.pathname.includes('/signup') && 
              !location.pathname.includes('/reset-password') &&
              !location.pathname.includes('/verify-email')) {
            navigate('/signin');
          }
          return;
        }

        // Check if user needs to complete onboarding
        const needsOnboarding = await checkUserProfile(session);
        
        if (needsOnboarding && 
            !location.pathname.includes('/onboarding') && 
            !location.pathname.includes('/invite')) {
          navigate('/onboarding');
          return;
        }

        // If user is authenticated and on auth pages, redirect to dashboard
        if (location.pathname.includes('/signin') || 
            location.pathname.includes('/signup') || 
            location.pathname.includes('/reset-password')) {
          
          // Check workspace membership
          const { data: memberData, error: memberError } = await supabase
            .from('workspace_members')
            .select(`
              workspace_id,
              workspaces:workspace_id (
                id,
                name
              )
            `)
            .eq('user_id', session.user.id)
            .single();

          if (memberError) {
            if (memberError.code === 'PGRST116') {
              // No workspace membership found
              toast({
                title: "Welcome!",
                description: "Let's create your first workspace",
              });
              navigate('/onboarding');
              return;
            }
            console.error('Error checking workspace membership:', memberError);
            toast({
              title: "Error",
              description: "Failed to check membership. Please try again.",
              variant: "destructive",
            });
            return;
          }

          if (memberData?.workspaces) {
            toast({
              title: "Welcome back!",
              description: `You've been redirected to ${memberData.workspaces?.name || 'your workspace'}`,
            });
            navigate('/dashboard');
          } else {
            navigate('/onboarding');
          }
          return;
        }

        // Handle email verification success
        const isEmailVerificationSuccess = new URLSearchParams(location.search).get('emailVerified') === 'true';
        if (isEmailVerificationSuccess) {
          const { data: memberData, error: memberError } = await supabase
            .from('workspace_members')
            .select(`
              workspace_id,
              workspaces:workspace_id (
                id,
                name
              )
            `)
            .eq('user_id', session.user.id)
            .single();

          if (!memberError && memberData?.workspaces) {
            toast({
              title: "Email verified!",
              description: `Welcome to ${memberData.workspaces?.name || 'your workspace'}`,
            });
            navigate('/dashboard');
          } else {
            navigate('/onboarding');
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
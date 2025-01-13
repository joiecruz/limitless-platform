import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEmailConfirmation } from "@/hooks/useEmailConfirmation";
import { checkUserProfile } from "@/hooks/useProfileCheck";

export function useAuthRedirect() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isEmailConfirmation } = useEmailConfirmation();

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("SignIn - Starting session check");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log("SignIn - Session data:", { session, error });
        
        if (error) {
          console.error("SignIn - Session error:", error);
          localStorage.clear();
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

          // Check if user was invited (has workspace_members entry)
          const { data: memberData } = await supabase
            .from('workspace_members')
            .select('workspace_id, role')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (memberData?.workspace_id) {
            // User was invited, redirect to dashboard with workspace
            console.log("SignIn - Invited user, redirecting to workspace:", memberData.workspace_id);
            localStorage.setItem('selectedWorkspace', memberData.workspace_id);
            navigate(`/dashboard?workspace=${memberData.workspace_id}`, { 
              replace: true,
              state: { 
                showOnboarding: false // Never show onboarding for invited users
              }
            });
            return;
          }

          // Regular signup flow
          const needsOnboarding = await checkUserProfile(session);
          console.log("SignIn - Needs onboarding:", needsOnboarding);

          console.log("SignIn - Redirecting to dashboard");
          navigate("/dashboard", { 
            replace: true,
            state: { 
              showOnboarding: needsOnboarding,
              isIncompleteProfile: needsOnboarding && !isEmailConfirmation
            }
          });
        } else {
          console.log("SignIn - No active session found");
          // Store invite token if present
          const params = new URLSearchParams(window.location.search);
          const inviteToken = params.get('token');
          if (inviteToken) {
            localStorage.setItem('inviteToken', inviteToken);
          }
        }
      } catch (error) {
        console.error("SignIn - Error checking session:", error);
        localStorage.clear();
        await supabase.auth.signOut();
      }
    };

    checkSession();

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

        // Check if user was invited
        const { data: memberData } = await supabase
          .from('workspace_members')
          .select('workspace_id, role')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (memberData?.workspace_id) {
          // User was invited, redirect to dashboard with workspace
          console.log("SignIn - Invited user, redirecting to workspace:", memberData.workspace_id);
          localStorage.setItem('selectedWorkspace', memberData.workspace_id);
          navigate(`/dashboard?workspace=${memberData.workspace_id}`, { 
            replace: true,
            state: { 
              showOnboarding: false // Never show onboarding for invited users
            }
          });
          return;
        }

        // Regular signup flow
        const needsOnboarding = await checkUserProfile(session);
        console.log("SignIn - Needs onboarding after sign in:", needsOnboarding);

        console.log("SignIn - Redirecting to dashboard");
        navigate("/dashboard", { 
          replace: true,
          state: { 
            showOnboarding: needsOnboarding,
            isIncompleteProfile: needsOnboarding && event === 'SIGNED_IN'
          }
        });
      }

      if (!session || event === 'SIGNED_OUT') {
        console.log("SignIn - Session lost or signed out");
        localStorage.clear();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, isEmailConfirmation]);
}
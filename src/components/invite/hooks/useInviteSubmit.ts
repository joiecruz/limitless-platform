import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface InviteSubmitProps {
  token?: string | null;
}

export function useInviteSubmit(token?: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (data: { password: string; email: string }) => {
    console.log("Starting invite submission process");
    setIsLoading(true);

    try {
      if (!token) {
        throw new Error("No invitation token provided");
      }

      // Get the invitation details first
      const { data: inviteData, error: inviteError } = await supabase
        .from("workspace_invitations")
        .select("*")
        .eq("magic_link_token", token)
        .maybeSingle();

      if (inviteError || !inviteData) {
        console.error("Error fetching invitation:", inviteError);
        throw new Error("Invalid or expired invitation");
      }

      console.log("Found invitation:", inviteData);

      // Sign up the user with their email and password
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            email_confirm: true // Mark as confirmed since this is an invited user
          }
        }
      });

      if (signUpError || !authData.user) {
        console.error("Error signing up:", signUpError);
        throw signUpError;
      }

      console.log("User signed up successfully:", authData.user.id);

      // Profile is automatically created by database trigger, so we skip manual creation

      // Use edge function to add user to workspace and update invitation
      const { error: processError } = await supabase.functions.invoke('process-invitation-acceptance', {
        body: {
          invitation_id: inviteData.id,
          user_id: authData.user.id,
          workspace_id: inviteData.workspace_id,
          role: inviteData.role
        }
      });

      if (processError) {
        console.error("Error processing invitation:", processError);
        throw new Error(processError.message || "Failed to join workspace");
      }

      // Confirm the email for invited users
      try {
        const { error: confirmError } = await supabase.functions.invoke('confirm-invited-user', {
          body: { user_id: authData.user.id }
        });

        if (confirmError) {
          console.error("Error confirming email:", confirmError);
          // Don't throw - user can still continue
        }
      } catch (confirmError) {
        console.error("Error confirming email:", confirmError);
        // Continue anyway
      }

      // Set the workspace in localStorage for immediate access
      localStorage.setItem('selectedWorkspace', inviteData.workspace_id);

      toast({
        title: "Welcome!",
        description: "Your account has been created and you've joined the workspace successfully.",
      });

      // Redirect to dashboard - user is already signed in
      navigate("/dashboard", {
        replace: true,
        state: {
          showOnboarding: false,
          workspace: inviteData.workspace_id,
          isInvited: true
        }
      });

    } catch (error: any) {
      console.error("Error in invite submission:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to set password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    isLoading,
  };
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OnboardingData } from "../../onboarding/types";

interface UseInviteSubmitProps {
  onOpenChange?: (open: boolean) => void;
}

export function useInviteSubmit({ onOpenChange }: UseInviteSubmitProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: OnboardingData) => {
    setLoading(true);
    try {
      // Get the invite details from URL params
      const params = new URLSearchParams(window.location.search);
      const email = params.get('email');
      const workspaceId = params.get('workspace');
      const role = params.get('role');

      if (!email || !workspaceId || !role || !data.password) {
        throw new Error("Missing required information");
      }

      const decodedEmail = decodeURIComponent(email);
      console.log("Checking invitation for:", { decodedEmail, workspaceId, role });

      // First verify the invitation exists and is valid
      const { data: invitation, error: inviteError } = await supabase
        .from('workspace_invitations')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('email', decodedEmail)
        .eq('status', 'pending')
        .single();

      console.log("Invitation check result:", { invitation, inviteError });

      if (inviteError) {
        console.error("Error checking invitation:", inviteError);
        throw new Error("Failed to verify invitation");
      }

      if (!invitation) {
        throw new Error("No valid invitation found. Please request a new invitation.");
      }

      // Step 1: Create the auth account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: decodedEmail,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error("Failed to create user account");

      console.log("Auth account created:", authData.user.id);

      // Step 2: Mark email as confirmed (since they came through invitation)
      const { error: updateAuthError } = await supabase.auth.updateUser({
        email: decodedEmail,
        data: { email_confirmed_at: new Date().toISOString() }
      });

      if (updateAuthError) throw updateAuthError;
      console.log("Email marked as confirmed");

      // Step 3: Create the user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          first_name: data.firstName,
          last_name: data.lastName,
          role: data.role,
          goals: data.goals,
          referral_source: data.referralSource,
        });

      if (profileError) {
        console.error("Error creating profile:", profileError);
        throw profileError;
      }

      console.log("Profile created successfully");

      // Step 4: Add user to workspace
      const { error: memberError } = await supabase
        .from('workspace_members')
        .insert({
          workspace_id: workspaceId,
          user_id: authData.user.id,
          role: role
        });

      if (memberError) {
        console.error("Error adding member:", memberError);
        throw memberError;
      }

      console.log("Added to workspace successfully");

      // Step 5: Update invitation status
      const { error: updateInviteError } = await supabase
        .from('workspace_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitation.id);

      if (updateInviteError) {
        console.error("Error updating invitation status:", updateInviteError);
        throw updateInviteError;
      }

      console.log("Invitation marked as accepted");

      if (onOpenChange) {
        onOpenChange(false);
      }

      toast({
        title: "Welcome!",
        description: "Your account has been set up successfully.",
      });

      // Step 6: Redirect to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error in invite submit:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading };
}
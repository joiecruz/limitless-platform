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

      // Create the auth account
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

      // Create the user profile
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

      if (profileError) throw profileError;

      // Add user to workspace
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

      // Update invitation status
      const { error: updateInviteError } = await supabase
        .from('workspace_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitation.id);

      if (updateInviteError) {
        console.error("Error updating invitation status:", updateInviteError);
        throw updateInviteError;
      }

      if (onOpenChange) {
        onOpenChange(false);
      }

      toast({
        title: "Welcome!",
        description: "Your account has been set up successfully. Please check your email to verify your account.",
      });

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
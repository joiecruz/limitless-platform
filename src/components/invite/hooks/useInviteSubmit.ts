import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface InviteFormData {
  firstName: string;
  lastName: string;
  password: string;
  role?: string;
  companySize?: string;
  referralSource?: string;
  goals?: string;
}

export function useInviteSubmit(workspaceId: string | null, email: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: InviteFormData) => {
    if (!workspaceId || !email) {
      toast({
        title: "Error",
        description: "Invalid invitation parameters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Starting invitation process...");
      const decodedEmail = decodeURIComponent(email);
      console.log("Decoded email:", decodedEmail);

      // Step 1: Verify the invitation is valid
      const { data: invitation, error: inviteError } = await supabase
        .from("workspace_invitations")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("email", decodedEmail)
        .eq("status", "pending")
        .single();

      console.log("Invitation query result:", { invitation, inviteError });

      if (inviteError || !invitation) {
        console.error("Invitation verification failed:", inviteError);
        throw new Error("No valid invitation found. Please request a new invitation.");
      }

      console.log("Valid invitation found:", invitation);

      // Step 2: Create the auth account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: decodedEmail,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            role: data.role,
            company_size: data.companySize,
            referral_source: data.referralSource,
            goals: data.goals
          }
        }
      });

      if (signUpError) {
        console.error("Error creating auth account:", signUpError);
        throw signUpError;
      }

      if (!authData.user) {
        console.error("No user data returned from signup");
        throw new Error("Failed to create user account");
      }

      console.log("Auth account created:", authData.user.id);

      // Wait a moment for the account to be fully created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 3: Sign in with the new credentials
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: decodedEmail,
        password: data.password,
      });

      console.log("Sign in attempt result:", { signInData, signInError });

      if (signInError) {
        console.error("Error signing in:", signInError);
        throw signInError;
      }

      if (!signInData.user) {
        throw new Error("Failed to sign in after account creation");
      }

      console.log("Signed in successfully");

      // Step 4: Add user to workspace
      const { error: memberError } = await supabase
        .from("workspace_members")
        .insert({
          workspace_id: workspaceId,
          user_id: authData.user.id,
          role: invitation.role
        });

      if (memberError) {
        console.error("Error adding to workspace:", memberError);
        throw memberError;
      }

      console.log("Added to workspace successfully");

      // Step 5: Update invitation status
      const { error: updateInviteError } = await supabase
        .from("workspace_invitations")
        .update({ status: "accepted" })
        .eq("id", invitation.id);

      if (updateInviteError) {
        console.error("Error updating invitation:", updateInviteError);
        throw updateInviteError;
      }

      console.log("Invitation status updated");

      toast({
        title: "Success",
        description: "Your account has been created successfully.",
      });

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Invitation process failed:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process invitation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
}
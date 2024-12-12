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
      // Make sure to decode the email if it hasn't been decoded yet
      const decodedEmail = decodeURIComponent(email).toLowerCase();
      console.log("Processing invitation for email:", decodedEmail);

      // Step 1: Verify the invitation is valid and not expired
      const { data: invitation, error: inviteError } = await supabase
        .from("workspace_invitations")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("email", decodedEmail)
        .eq("status", "pending")
        .gt("expires_at", new Date().toISOString())
        .single();

      console.log("Invitation query result:", { invitation, inviteError });

      if (inviteError) {
        console.error("Invitation verification failed:", inviteError);
        throw new Error("No valid invitation found. Please request a new invitation.");
      }

      if (!invitation) {
        console.error("No invitation found or invitation expired");
        throw new Error("No valid invitation found or invitation has expired. Please request a new invitation.");
      }

      console.log("Valid invitation found:", invitation);

      // Check if user already exists with this email
      const { data: existingUser, error: existingUserError } = await supabase.auth.signInWithPassword({
        email: decodedEmail,
        password: data.password,
      });

      if (existingUser?.user) {
        // User exists, add them to workspace directly
        const { error: memberError } = await supabase
          .from("workspace_members")
          .insert({
            workspace_id: workspaceId,
            user_id: existingUser.user.id,
            role: invitation.role
          });

        if (memberError) {
          if (memberError.code === '23505') { // Unique violation
            console.log("User is already a member of this workspace");
            throw new Error("You are already a member of this workspace.");
          }
          throw memberError;
        }

        // Update invitation status
        await supabase
          .from("workspace_invitations")
          .update({ status: "accepted" })
          .eq("id", invitation.id);

        toast({
          title: "Success",
          description: "You have successfully joined the workspace.",
        });

        navigate("/dashboard");
        return;
      }

      // Create new user account
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

      // Add user to workspace
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

      // Update invitation status
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
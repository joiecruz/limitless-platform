import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { verifyInvitation, updateInvitationStatus } from "../services/invitationService";
import { checkExistingUser, createNewUser } from "../services/userService";
import { InviteFormData } from "../types";
import { supabase } from "@/integrations/supabase/client";

export function useInviteSubmit(workspaceId: string | null, email: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: InviteFormData) => {
    if (!workspaceId || !email) {
      console.error("Missing required parameters:", { workspaceId, email });
      toast({
        title: "Error",
        description: "Invalid invitation parameters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Starting invitation process with parameters:", {
        workspaceId,
        email,
        decodedEmail: decodeURIComponent(email).toLowerCase()
      });

      // Step 1: Verify the invitation
      const { invitation, decodedEmail } = await verifyInvitation(workspaceId, email);
      console.log("Valid invitation found:", invitation);

      // Step 2: Check if user exists
      const { data: authData, error: signInError } = await checkExistingUser(decodedEmail, data.password);

      if (authData?.session) {
        console.log("Existing user found:", authData.user.id);
        
        // Update profile data for existing user
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: data.firstName,
            last_name: data.lastName,
            role: data.role,
            company_size: data.companySize,
            referral_source: data.referralSource,
            goals: data.goals
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;

        // Store workspace and role info in localStorage for use after email verification
        localStorage.setItem('pendingWorkspaceJoin', JSON.stringify({
          workspaceId,
          role: invitation.role,
          invitationId: invitation.id
        }));

        toast({
          title: "Success",
          description: "Please check your email to complete the verification process.",
        });

        navigate("/invite-success");
        return;
      }

      // Step 3: Create new user with profile data
      const { data: newAuthData, error: signUpError } = await createNewUser(decodedEmail, data.password, {
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        companySize: data.companySize,
        referralSource: data.referralSource,
        goals: data.goals
      });
      
      if (signUpError || !newAuthData.user) {
        throw new Error(signUpError?.message || "Failed to create user account");
      }
      
      console.log("Auth account created:", newAuthData.user.id);

      // Store workspace and role info in localStorage for use after email verification
      localStorage.setItem('pendingWorkspaceJoin', JSON.stringify({
        workspaceId,
        role: invitation.role,
        invitationId: invitation.id
      }));

      toast({
        title: "Success",
        description: "Please check your email to complete the verification process.",
      });

      navigate("/invite-success");
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
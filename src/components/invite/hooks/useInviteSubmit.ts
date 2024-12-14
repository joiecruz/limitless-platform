import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { verifyInvitation, updateInvitationStatus } from "../services/invitationService";
import { checkExistingUser, addUserToWorkspace, createNewUser } from "../services/userService";
import { InviteFormData } from "../types";

export function useInviteSubmit(workspaceId: string | null, email: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: InviteFormData) => {
    if (!workspaceId) {
      console.error("Missing workspaceId");
      toast({
        title: "Error",
        description: "Invalid invitation parameters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Step 1: Verify the invitation
      const { invitation, decodedEmail } = await verifyInvitation(workspaceId);

      // Step 2: Check if user exists
      const { data: authData, error: signInError } = await checkExistingUser(decodedEmail, data.password);

      if (authData?.session) {
        // Add existing user to workspace
        await addUserToWorkspace(authData.user.id, workspaceId, invitation.role);
        
        // Update invitation status
        await updateInvitationStatus(invitation.id, "accepted");

        toast({
          title: "Success",
          description: "You have successfully joined the workspace.",
        });

        navigate("/dashboard");
        return;
      }

      // Step 3: Create new user
      const { data: newAuthData, error: signUpError } = await createNewUser(decodedEmail, data.password, data);
      
      if (signUpError || !newAuthData?.user) {
        throw new Error(signUpError?.message || "Failed to create user account");
      }

      // Step 4: Add new user to workspace
      await addUserToWorkspace(newAuthData.user.id, workspaceId, invitation.role);

      // Step 5: Update invitation status
      await updateInvitationStatus(invitation.id, "accepted");

      toast({
        title: "Success",
        description: "Your account has been created successfully.",
      });

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
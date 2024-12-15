import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { verifyInvitation, updateInvitationStatus } from "../services/invitationService";
import { checkExistingUser, addUserToWorkspace, createNewUser } from "../services/userService";
import { InviteFormData } from "../types";

export function useInviteSubmit(token: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: InviteFormData) => {
    if (!token) {
      console.error("Missing required parameters:", { token });
      toast({
        title: "Error",
        description: "Invalid invitation link",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Step 1: Verify the invitation
      const { invitation } = await verifyInvitation(token);
      console.log("Valid invitation found:", invitation);

      // Step 2: Check if user exists
      const { data: authData, error: signInError } = await checkExistingUser(invitation.email, data.password);

      if (authData?.session) {
        console.log("Existing user found:", authData.user.id);
        
        // Add existing user to workspace
        await addUserToWorkspace(authData.user.id, invitation.workspace_id, invitation.role);
        
        // Update invitation status
        await updateInvitationStatus(invitation.id, "accepted");

        toast({
          title: "Success",
          description: "You have successfully joined the workspace.",
        });
        return;
      }

      // Step 3: Create new user with email confirmation disabled for invited users
      const { data: newAuthData, error: signUpError } = await createNewUser(
        invitation.email, 
        data.password, 
        { ...data, emailConfirm: false }
      );
      
      if (signUpError || !newAuthData.user) {
        throw new Error(signUpError?.message || "Failed to create user account");
      }
      
      console.log("Auth account created:", newAuthData.user.id);

      // Step 4: Add new user to workspace
      await addUserToWorkspace(newAuthData.user.id, invitation.workspace_id, invitation.role);
      console.log("Added to workspace successfully");

      // Step 5: Update invitation status
      await updateInvitationStatus(invitation.id, "accepted");
      console.log("Invitation status updated");

      toast({
        title: "Success",
        description: "Your account has been created successfully.",
      });
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { verifyInvitation } from "../services/invitationService";
import { checkExistingUser, createNewUser } from "../services/userService";
import { InviteFormData } from "../types";

export function useInviteSubmit(token: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
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
        
        // Don't add to workspace yet, wait for email confirmation
        toast({
          title: "Success",
          description: "Please check your email to confirm your account.",
        });
        return;
      }

      // Step 3: Create new user with email confirmation enabled
      const { data: newAuthData, error: signUpError } = await createNewUser(
        invitation.email, 
        data.password,
        data
      );
      
      if (signUpError || !newAuthData.user) {
        throw new Error(signUpError?.message || "Failed to create user account");
      }
      
      console.log("Auth account created:", newAuthData.user.id);

      // Don't add to workspace or update invitation status yet
      // This will happen after email confirmation in VerifyEmail.tsx

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
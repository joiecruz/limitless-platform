import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { verifyInvitation } from "../services/invitationService";
import { InviteFormData } from "../types";
import { supabase } from "@/integrations/supabase/client";

export function useInviteSubmit(workspaceId: string | null, email: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: Pick<InviteFormData, "password">) => {
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
      // Step 1: Verify the invitation
      const { invitation, decodedEmail } = await verifyInvitation(workspaceId, email);
      console.log("Valid invitation found:", invitation);

      // Step 2: Sign up user
      const { error: signUpError } = await supabase.auth.signUp({
        email: decodedEmail,
        password: data.password,
      });

      if (signUpError) {
        throw signUpError;
      }

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
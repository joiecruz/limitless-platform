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

  const handleSubmit = async () => {
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

      // Step 2: Sign up user with workspace context in redirectTo
      const redirectUrl = new URL("/auth/callback", window.location.origin);
      redirectUrl.searchParams.append("workspace", workspaceId);
      redirectUrl.searchParams.append("invitation", invitation.id);
      redirectUrl.searchParams.append("next", `/dashboard?workspace=${workspaceId}`);
      redirectUrl.searchParams.append("type", "signup");

      console.log("Signup redirect URL:", redirectUrl.toString());

      // Generate a secure random password since we won't ask the user for one
      const tempPassword = crypto.randomUUID();

      const { error: signUpError } = await supabase.auth.signUp({
        email: decodedEmail,
        password: tempPassword,
        options: {
          emailRedirectTo: redirectUrl.toString(),
          data: {
            workspace_id: workspaceId,
            invitation_id: invitation.id
          }
        }
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
        title: "Almost there!",
        description: "Please check your email to confirm your account and join the workspace.",
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
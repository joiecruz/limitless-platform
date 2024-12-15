import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { verifyInvitation, updateInvitationStatus } from "../services/invitationService";
import { InviteFormData } from "../types";
import { supabase } from "@/integrations/supabase/client";

export function useInviteSubmit(workspaceId: string | null, email: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: Pick<InviteFormData, "password">) => {
    if (!workspaceId || !email) {
      console.error("🚫 Missing required parameters:", { workspaceId, email });
      toast({
        title: "Error",
        description: "Invalid invitation parameters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("🔄 Starting invitation process:", { workspaceId, email });
    
    try {
      // Step 1: Verify the invitation
      console.log("👀 Verifying invitation...");
      const { invitation, decodedEmail } = await verifyInvitation(workspaceId, email);
      console.log("✅ Valid invitation found:", invitation);

      // Step 2: Update invitation status to accepted
      console.log("📝 Updating invitation status...");
      await updateInvitationStatus(invitation.id, 'accepted');
      console.log("✅ Invitation status updated to accepted");

      // Step 3: Sign up user with workspace context in redirectTo
      const redirectUrl = new URL("/auth/callback", window.location.origin);
      redirectUrl.searchParams.append("workspace", workspaceId);
      redirectUrl.searchParams.append("invitation", invitation.id);
      redirectUrl.searchParams.append("next", `/dashboard?workspace=${workspaceId}`);

      console.log("🔗 Signup redirect URL:", redirectUrl.toString());

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: decodedEmail,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl.toString(),
          data: {
            workspace_id: workspaceId,
            invitation_id: invitation.id
          }
        }
      });

      if (signUpError) {
        console.error("❌ Signup error:", signUpError);
        throw signUpError;
      }

      console.log("✅ Signup successful:", { 
        user: signUpData.user?.id,
        email: signUpData.user?.email,
        workspace: workspaceId
      });

      // Store workspace and role info in localStorage for use after email verification
      const pendingJoinData = {
        workspaceId,
        role: invitation.role,
        invitationId: invitation.id
      };
      console.log("💾 Storing pending workspace join data:", pendingJoinData);
      localStorage.setItem('pendingWorkspaceJoin', JSON.stringify(pendingJoinData));

      toast({
        title: "Success",
        description: "Please check your email to complete the verification process.",
      });

      navigate("/verify-email");

    } catch (error: any) {
      console.error("❌ Invitation process failed:", error);
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
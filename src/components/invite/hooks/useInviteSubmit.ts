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
      console.error("🚫 Missing required parameters:", { workspaceId, email });
      toast({
        title: "Error",
        description: "Invalid invitation parameters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("🔄 Processing invitation:", { workspaceId, email });
    
    try {
      // Step 1: Verify invitation
      const { invitation, decodedEmail } = await verifyInvitation(workspaceId, email);
      console.log("✅ Invitation verified:", invitation);

      // Step 2: Sign up user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: decodedEmail,
        password: data.password,
        options: {
          data: {
            workspace_id: workspaceId,
            invitation_id: invitation.id,
            is_invited: true
          }
        }
      });

      if (signUpError) {
        console.error("❌ Signup error:", signUpError);
        throw signUpError;
      }

      console.log("✅ User signed up successfully:", { 
        user: signUpData.user?.id,
        email: signUpData.user?.email
      });

      // Store workspace context for post-verification
      const pendingJoinData = {
        workspaceId,
        role: invitation.role,
        invitationId: invitation.id
      };
      console.log("💾 Storing workspace context:", pendingJoinData);
      localStorage.setItem('pendingWorkspaceJoin', JSON.stringify(pendingJoinData));

      // Redirect to verify email page
      navigate("/verify-email");
      toast({
        title: "Success",
        description: "Please check your email to verify your account",
      });

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
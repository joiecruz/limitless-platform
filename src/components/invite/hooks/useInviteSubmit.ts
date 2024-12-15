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

      // Step 2: Sign up or sign in user
      const { data: authData, error: authError } = await supabase.auth.signUp({
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

      if (authError) {
        // If user already exists, try to sign in
        if (authError.message.includes('already registered')) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: decodedEmail,
            password: data.password,
          });

          if (signInError) throw signInError;
          
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
            .eq('id', signInData.user.id);

          if (profileError) throw profileError;
        } else {
          throw authError;
        }
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

      // Redirect to dashboard - user will be redirected to verify email if needed
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
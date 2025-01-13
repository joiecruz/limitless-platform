import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface InviteSubmitProps {
  token?: string | null;
}

export function useInviteSubmit(token?: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: { password: string; email: string }) => {
    console.log("Starting invite submission process");
    setIsLoading(true);
    
    try {
      if (!token) {
        throw new Error("No invitation token provided");
      }

      // Get the invitation details first
      const { data: inviteData, error: inviteError } = await supabase
        .from("workspace_invitations")
        .select("*")
        .eq("magic_link_token", token)
        .maybeSingle();

      if (inviteError || !inviteData) {
        console.error("Error fetching invitation:", inviteError);
        throw new Error("Invalid or expired invitation");
      }

      console.log("Found invitation:", inviteData);

      // Sign up the user with their email and password
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            email_confirm: true // Mark as confirmed since this is an invited user
          }
        }
      });

      if (signUpError || !authData.user) {
        console.error("Error signing up:", signUpError);
        throw signUpError;
      }

      console.log("User signed up successfully:", authData.user.id);

      // Create a basic profile immediately
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          email: data.email,
          role: inviteData.role || null,
        });

      if (profileError) {
        console.error("Error creating profile:", profileError);
        // Don't throw here - the user can still complete onboarding
        toast({
          title: "Notice",
          description: "Profile creation incomplete. Please complete onboarding.",
          variant: "default",
        });
      }

      // Update invitation status
      const { error: updateError } = await supabase
        .from("workspace_invitations")
        .update({
          status: "accepted",
          accepted_at: new Date().toISOString(),
        })
        .eq("id", inviteData.id);

      if (updateError) {
        console.error("Error updating invitation:", updateError);
        // Don't throw - not critical
      }

      // Confirm the email using the Edge Function
      const { error: confirmError } = await supabase.functions.invoke('confirm-invited-user', {
        body: { user_id: authData.user.id }
      });

      if (confirmError) {
        console.error("Error confirming email:", confirmError);
        // Don't throw - not critical
      }

      toast({
        title: "Success",
        description: "Password set successfully. Please complete your profile setup.",
      });

    } catch (error: any) {
      console.error("Error in invite submission:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to set password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    isLoading,
  };
}
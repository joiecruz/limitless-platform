import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface InviteSubmitProps {
  token?: string | null;
}

export function useInviteSubmit(token?: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: { password: string }) => {
    setIsLoading(true);
    try {
      // Get the invitation details first
      if (!token) {
        throw new Error("No invitation token provided");
      }

      const { data: inviteData, error: inviteError } = await supabase
        .from("workspace_invitations")
        .select("*")
        .eq("magic_link_token", token)
        .single();

      if (inviteError || !inviteData) {
        console.error("Error fetching invitation:", inviteError);
        throw new Error("Invalid or expired invitation");
      }

      // Sign up the user with their email and password
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: inviteData.email,
        password: data.password,
      });

      if (signUpError || !authData.user) {
        console.error("Error signing up:", signUpError);
        throw signUpError;
      }

      // Create a basic profile immediately
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          email: inviteData.email,
          // Set minimal profile data that we know from the invitation
          role: inviteData.role || null,
        });

      if (profileError) {
        console.error("Error creating profile:", profileError);
        // Don't throw here - the user can still complete onboarding
        toast({
          title: "Warning",
          description: "Profile creation incomplete. Please complete onboarding.",
          variant: "warning",
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
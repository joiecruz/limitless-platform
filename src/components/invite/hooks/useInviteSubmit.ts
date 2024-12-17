import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createNewUser } from "../services/userService";
import { UserData } from "../types";
import { supabase } from "@/integrations/supabase/client";

export const useInviteSubmit = (invitation: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (data: UserData) => {
    setIsLoading(true);
    try {
      // Step 1: Verify invitation is still valid
      const { data: inviteData, error: inviteError } = await supabase
        .from("workspace_invitations")
        .select("*")
        .eq("id", invitation.id)
        .eq("status", "pending")
        .single();

      if (inviteError || !inviteData) {
        throw new Error("Invalid or expired invitation");
      }

      // Step 2: Check if user already exists
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", invitation.email)
        .single();

      if (existingUser) {
        throw new Error("User already exists");
      }

      // Step 3: Create new user with email confirmation disabled for invited users
      const { data: newAuthData, error: signUpError } = await createNewUser(
        invitation.email, 
        data.password,
        { 
          ...data,
          emailConfirm: false,
          password: data.password // Ensure password is included in userData
        }
      );
      
      if (signUpError || !newAuthData?.user) {
        console.error("Error creating user:", signUpError);
        throw new Error(signUpError?.message || "Failed to create user account");
      }

      // Step 4: Update invitation status
      const { error: updateError } = await supabase
        .from("workspace_invitations")
        .update({ status: "accepted", accepted_at: new Date().toISOString() })
        .eq("id", invitation.id);

      if (updateError) {
        throw new Error("Failed to update invitation status");
      }

      // Step 5: Add user to workspace
      const { error: memberError } = await supabase
        .from("workspace_members")
        .insert({
          workspace_id: invitation.workspace_id,
          user_id: newAuthData.user.id,
          role: invitation.role,
        });

      if (memberError) {
        throw new Error("Failed to add user to workspace");
      }

      toast({
        title: "Success!",
        description: "Your account has been created. You can now sign in.",
      });

      return true;
    } catch (error: any) {
      console.error("Error in invite submission:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { onSubmit, isLoading };
};
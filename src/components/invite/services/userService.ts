import { supabase } from "@/integrations/supabase/client";
import { UserData } from "../types";

export async function checkExistingUser(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function addUserToWorkspace(userId: string, workspaceId: string, role: string) {
  const { error: memberError } = await supabase
    .from("workspace_members")
    .insert({
      workspace_id: workspaceId,
      user_id: userId,
      role
    });

  if (memberError) {
    if (memberError.code === '23505') { // Unique violation
      console.log("User is already a member of this workspace");
      throw new Error("You are already a member of this workspace.");
    }
    console.error("Error adding member:", memberError);
    throw memberError;
  }
}

export async function createNewUser(email: string, password: string, userData: UserData & { email_confirmed?: boolean }) {
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role,
        company_size: userData.companySize,
        referral_source: userData.referralSource,
        goals: userData.goals,
        email_confirmed: userData.email_confirmed // This will be used by the trigger
      },
      emailRedirectTo: `${window.location.origin}/dashboard`,
      // Don't send confirmation email for invited users since they already confirmed by clicking the invite link
      emailConfirmationRedirectTo: userData.email_confirmed ? undefined : `${window.location.origin}/dashboard`
    }
  });

  if (signUpError) {
    console.error("Error creating auth account:", signUpError);
    throw signUpError;
  }

  if (!authData.user) {
    console.error("No user data returned from signup");
    throw new Error("Failed to create user account");
  }

  return { data: authData, error: null };
}
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

export async function createNewUser(email: string, password: string, userData: UserData) {
  // Create the auth account with email confirmation required
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`,
      data: {
        email_confirmed: false
      }
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

  // Update the profile with the user data
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      first_name: userData.firstName,
      last_name: userData.lastName,
      role: userData.role,
      company_size: userData.companySize,
      referral_source: userData.referralSource,
      goals: userData.goals
    })
    .eq('id', authData.user.id);

  if (profileError) {
    console.error("Error updating profile:", profileError);
    throw profileError;
  }

  return { data: authData, error: null };
}
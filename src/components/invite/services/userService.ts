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

export async function createNewUser(email: string, password: string, userData: UserData & { emailConfirm?: boolean }) {
  // For invited users, we'll use a different signup configuration
  const signUpOptions = {
    email,
    password,
    options: {
      data: {
        first_name: userData.firstName || null,
        last_name: userData.lastName || null,
        role: userData.role || null,
        company_size: userData.companySize || null,
        referral_source: userData.referralSource || null,
        goals: userData.goals || null
      },
      emailRedirectTo: `${window.location.origin}/dashboard`
    }
  };

  // If this is an invited user (emailConfirm is explicitly set to false)
  if (userData.emailConfirm === false) {
    // Update user metadata to indicate they were invited
    signUpOptions.options.data = {
      ...signUpOptions.options.data,
      invited_user: true
    };
  }

  const { data: authData, error: signUpError } = await supabase.auth.signUp(signUpOptions);

  if (signUpError) {
    console.error("Error creating auth account:", signUpError);
    throw signUpError;
  }

  if (!authData.user) {
    console.error("No user data returned from signup");
    throw new Error("Failed to create user account");
  }

  // If this is an invited user, we'll immediately confirm their email using admin API
  if (userData.emailConfirm === false && authData.user.id) {
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      authData.user.id,
      { email_confirm: true }
    );

    if (updateError) {
      console.error("Error confirming email:", updateError);
      throw updateError;
    }
  }

  return { data: authData, error: null };
}
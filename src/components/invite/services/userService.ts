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
      
      throw new Error("You are already a member of this workspace.");
    }
    
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
        goals: userData.goals || null,
        is_invited: userData.emailConfirm === false // Mark invited users
      },
      emailRedirectTo: `${window.location.origin}/dashboard`
    }
  };

  const { data: authData, error: signUpError } = await supabase.auth.signUp(signUpOptions);

  if (signUpError) {
    
    throw signUpError;
  }

  if (!authData.user) {
    
    throw new Error("Failed to create user account");
  }

  // If this is an invited user, confirm their email using the Edge Function
  if (userData.emailConfirm === false && authData.user.id) {
    const { error: confirmError } = await supabase.functions.invoke('confirm-invited-user', {
      body: { user_id: authData.user.id }
    });

    if (confirmError) {
      
      throw confirmError;
    }
  }

  return { data: authData, error: null };
}
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "../types";

interface CreateUserResponse {
  success: boolean;
  error?: string;
  user?: any;
  session?: any;
}

export async function createNewUser(email: string, password: string, userData: UserData): Promise<CreateUserResponse> {
  try {
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
      console.error('Error creating user:', signUpError);
      return {
        success: false,
        error: signUpError.message
      };
    }

    if (!authData.user) {
      console.error('No user data returned');
      return {
        success: false,
        error: "Failed to create user account"
      };
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
        goals: userData.goals,
        updated_at: new Date().toISOString()
      })
      .eq('id', authData.user.id);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      return {
        success: false,
        error: profileError.message
      };
    }

    return {
      success: true,
      user: authData.user,
      session: authData.session
    };
  } catch (error: any) {
    console.error('Unexpected error during user creation:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
}

export async function checkExistingUser(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
}

export async function addUserToWorkspace(userId: string, workspaceId: string, role: string) {
  const { error } = await supabase
    .from('workspace_members')
    .insert({
      user_id: userId,
      workspace_id: workspaceId,
      role: role
    });

  if (error) {
    console.error('Error adding user to workspace:', error);
    throw new Error(error.message);
  }
}
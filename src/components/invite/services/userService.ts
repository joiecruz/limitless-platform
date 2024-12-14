import { supabase } from "@/integrations/supabase/client";
import { UserData } from "../types";

interface AuthResponse {
  data: {
    user: any;
    session: any;
  } | null;
  error: any;
}

export async function checkExistingUser(email: string, password: string): Promise<AuthResponse> {
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
    if (memberError.code === '23505') {
      throw new Error("You are already a member of this workspace.");
    }
    throw memberError;
  }
}

export async function createNewUser(email: string, password: string, userData: UserData): Promise<AuthResponse> {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role,
        company_size: userData.companySize,
        referral_source: userData.referralSource,
        goals: userData.goals
      }
    }
  });
}
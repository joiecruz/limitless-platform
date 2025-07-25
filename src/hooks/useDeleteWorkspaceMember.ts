import { supabase } from "@/integrations/supabase/client";

export async function deleteWorkspaceMember(workspace_id: string, user_id: string) {
  const { error: error1 } = await supabase
    .from("workspace_members")
    .delete()
    .eq("workspace_id", workspace_id)
    .eq("user_id", user_id);

  if (error1) throw error1;
}

export async function deleteInvitation(workspace_id: string, email: string) {
    const { error } = await supabase
      .from("workspace_invitations")
      .delete()
      .eq("workspace_id", workspace_id)
      .eq("email", email);
  
    if (error) throw error;
  }
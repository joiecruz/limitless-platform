import { supabase } from "@/integrations/supabase/client";

export async function deleteWorkspaceMember(workspace_id: string, user_id: string) {
  const { error } = await supabase
    .from("workspace_members")
    .delete()
    .eq("workspace_id", workspace_id)
    .eq("user_id", user_id);

  if (error) throw error;
}
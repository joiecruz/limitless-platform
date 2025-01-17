import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SupabaseWorkspaceMember, WorkspaceMember } from "@/types/workspace";

export function useWorkspaceMembers(workspaceId: string) {
  return useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspace_members")
        .select(`
          user_id,
          role,
          created_at,
          profiles!inner (
            first_name,
            last_name,
            email
          )
        `)
        .eq("workspace_id", workspaceId);

      if (error) {
        throw error;
      }

      // Transform the data to match our WorkspaceMember type
      return (data as unknown as SupabaseWorkspaceMember[]).map((member) => ({
        user_id: member.user_id,
        role: member.role,
        created_at: member.created_at,
        profiles: {
          first_name: member.profiles.first_name,
          last_name: member.profiles.last_name,
          email: member.profiles.email
        }
      }));
    }
  });
}
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WorkspaceMember } from "@/types/workspace";

export function useWorkspaceMembers(workspaceId: string) {
  return useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: async () => {
      // First check if user is a member of this workspace
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: membership, error: membershipError } = await supabase
        .from("workspace_members")
        .select("user_id")
        .eq("workspace_id", workspaceId)
        .eq("user_id", user.id)
        .single();

      if (membershipError || !membership) {
        throw new Error("Not a member of this workspace");
      }

      // Then fetch all members
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

      if (error) throw error;

      return data.map((member: any) => ({
        user_id: member.user_id,
        role: member.role,
        created_at: member.created_at,
        profiles: {
          first_name: member.profiles.first_name,
          last_name: member.profiles.last_name,
          email: member.profiles.email
        }
      })) as WorkspaceMember[];
    },
    enabled: !!workspaceId,
  });
}
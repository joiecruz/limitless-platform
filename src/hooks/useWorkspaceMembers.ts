import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WorkspaceMember } from "@/types/workspace";

export function useWorkspaceMembers(workspaceId: string) {
  return useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: async () => {
      console.log('Fetching members for workspace:', workspaceId);
      
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
        console.error('Error fetching workspace members:', error);
        throw error;
      }

      console.log('Raw workspace members data:', data);

      // Transform the data to match our WorkspaceMember type
      const transformedData = data.map((member) => ({
        user_id: member.user_id,
        role: member.role,
        created_at: member.created_at,
        profiles: {
          first_name: member.profiles.first_name,
          last_name: member.profiles.last_name,
          email: member.profiles.email
        }
      }));

      console.log('Transformed workspace members data:', transformedData);
      return transformedData as WorkspaceMember[];
    },
    enabled: !!workspaceId,
  });
}
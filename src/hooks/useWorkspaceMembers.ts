
import { useQuery } from "@tanstack/react-query";
import { workspaceService } from "@/api";
import { WorkspaceMember } from "@/types/workspace";

export function useWorkspaceMembers(workspaceId: string) {
  return useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: async () => {
      console.log('Fetching members for workspace:', workspaceId);
      
      try {
        const data = await workspaceService.getMembers(workspaceId);
        
        // Transform the data to match our WorkspaceMember type
        const transformedData = data.map((member: any) => ({
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
      } catch (error) {
        console.error('Error fetching workspace members:', error);
        throw error;
      }
    },
    enabled: !!workspaceId,
  });
}

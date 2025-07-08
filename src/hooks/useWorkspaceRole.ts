import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useWorkspaceRole(workspaceId?: string) {
  return useQuery({
    queryKey: ['workspace-role', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return null;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', workspaceId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        return null;
      }

      return data?.role;
    },
    enabled: !!workspaceId
  });
}
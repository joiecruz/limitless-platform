import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useWorkspaceRole() {
  return useQuery({
    queryKey: ['workspace-role'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { workspaceId: null, userRole: null, currentUserId: null };

      // Get user's workspace
      const { data: workspaceData } = await supabase
        .from('workspace_members')
        .select('workspace_id, role')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      return {
        workspaceId: workspaceData?.workspace_id || null,
        userRole: workspaceData?.role || null,
        currentUserId: user.id
      };
    }
  });
}
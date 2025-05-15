
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorkspaceMemberWithWorkspace, Workspace } from "./types";

export function useWorkspaces() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error fetching user:', userError);
          throw userError;
        }

        if (!user) {
          return [];
        }

        // Use a single edge function call to determine if user is superadmin and get workspaces
        const { data, error } = await supabase
          .functions.invoke('get-user-workspaces', {
            body: { user_id: user.id }
          });

        if (error) {
          console.error('Error fetching workspaces:', error);
          throw error;
        }
          
        return data || [];
      } catch (error: any) {
        console.error('Error in fetchWorkspaces:', error);
        toast({
          title: "Error",
          description: "Failed to load workspaces. Please try again.",
          variant: "destructive",
        });
        return [];
      }
    },
    refetchOnWindowFocus: false, // Only fetch when component mounts
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}

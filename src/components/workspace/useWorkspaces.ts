import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Workspace, WorkspaceMemberWithWorkspace } from "./types";

export function useWorkspaces() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      console.log('Fetching workspaces...');
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error fetching user:', userError);
          throw userError;
        }

        if (!user) {
          console.log("No user found");
          return [];
        }

        console.log("User found:", user.id);

        const { data: workspaces, error: workspacesError } = await supabase
          .from('workspace_members')
          .select('workspace_id, workspaces ( id, name, slug )')
          .eq('user_id', user.id);

        if (workspacesError) {
          console.error('Error fetching workspaces:', workspacesError);
          throw workspacesError;
        }

        console.log('Raw workspace data:', workspaces);
        
        // Transform the data to match the Workspace type
        const formattedWorkspaces = (workspaces as WorkspaceMemberWithWorkspace[]).map(item => ({
          id: item.workspaces.id,
          name: item.workspaces.name || 'Unnamed Workspace',
          slug: item.workspaces.slug || 'unnamed'
        }));

        console.log('Formatted workspaces:', formattedWorkspaces);
        return formattedWorkspaces;
      } catch (error) {
        console.error('Error in fetchWorkspaces:', error);
        toast({
          title: "Error",
          description: "Failed to load workspaces. Please try again.",
          variant: "destructive",
        });
        return [];
      }
    },
    refetchOnWindowFocus: true,
    staleTime: 1000,
  });
}
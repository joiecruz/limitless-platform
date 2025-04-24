
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorkspaceMemberWithWorkspace, Workspace } from "./types";

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

        // First check if user is superadmin
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_superadmin')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }

        let workspacesData;

        if (profile?.is_superadmin) {
          // If superadmin, fetch all workspaces
          const { data, error } = await supabase
            .from('workspaces')
            .select('id, name, slug');
          
          if (error) {
            console.error('Error fetching all workspaces:', error);
            throw error;
          }
          
          workspacesData = data.map(workspace => ({
            workspace: workspace
          }));
        } else {
          // Otherwise fetch only member workspaces
          const { data, error } = await supabase
            .from('workspace_members')
            .select(`
              workspace:workspaces (
                id,
                name,
                slug
              )
            `)
            .eq('user_id', user.id);

          if (error) {
            console.error('Error fetching member workspaces:', error);
            throw error;
          }
          
          workspacesData = data;
        }

        console.log('Raw workspace data:', workspacesData);
        
        // Safely type and transform the response
        const formattedWorkspaces = (workspacesData as unknown as WorkspaceMemberWithWorkspace[])
          .filter(item => item.workspace) // Filter out any null workspaces
          .map(item => ({
            id: item.workspace.id,
            name: item.workspace.name || 'Unnamed Workspace',
            slug: item.workspace.slug || 'unnamed'
          }));

        console.log('Formatted workspaces:', formattedWorkspaces);
        return formattedWorkspaces;
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
    refetchOnWindowFocus: true,
    staleTime: 1000,
  });
}

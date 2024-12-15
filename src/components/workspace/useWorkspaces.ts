import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Workspace, WorkspaceMember } from "./types";

export function useWorkspaces() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      console.log('Fetching workspaces...');
      try {
        // First check if we have a valid session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        if (!session) {
          console.log("No active session found");
          return [];
        }

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

        const { data: workspaceMembers, error: workspacesError } = await supabase
          .from('workspace_members')
          .select(`
            workspace_id,
            user_id,
            role,
            workspaces (
              id,
              name,
              slug
            )
          `)
          .eq('user_id', user.id);

        if (workspacesError) {
          console.error('Error fetching workspaces:', workspacesError);
          throw workspacesError;
        }

        console.log('Raw workspace data:', workspaceMembers);
        
        if (!workspaceMembers) {
          return [];
        }

        // Transform the data to match the Workspace type
        const formattedWorkspaces: Workspace[] = (workspaceMembers as any[]).map((member) => ({
          id: member.workspaces.id,
          name: member.workspaces.name || 'Unnamed Workspace',
          slug: member.workspaces.slug || 'unnamed'
        }));

        console.log('Formatted workspaces:', formattedWorkspaces);
        return formattedWorkspaces;
      } catch (error: any) {
        console.error('Error in fetchWorkspaces:', error);
        
        // Check if it's an auth error and show appropriate message
        if (error.message?.includes('session_not_found') || error.message?.includes('JWT expired')) {
          toast({
            title: "Session expired",
            description: "Please sign in again to continue.",
            variant: "destructive",
          });
          // Redirect to sign in or handle session expiry
          await supabase.auth.signOut();
          window.location.href = '/signin';
          return [];
        }
        
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
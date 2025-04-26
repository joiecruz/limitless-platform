
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

        // First check if user is superadmin - use edge function to bypass RLS
        const { data: profile, error: profileError } = await supabase
          .functions.invoke('get-user-profile', {
            body: { user_id: user.id }
          });

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }

        let workspacesData;

        if (profile?.is_superadmin) {
          // If superadmin, fetch all workspaces using edge function
          const { data, error } = await supabase
            .functions.invoke('get-admin-workspaces');
          
          if (error) {
            console.error('Error fetching all workspaces:', error);
            throw error;
          }
          
          workspacesData = data;
        } else {
          // Otherwise fetch only member workspaces using edge function
          const { data, error } = await supabase
            .functions.invoke('get-user-workspaces', {
              body: { user_id: user.id }
            });

          if (error) {
            console.error('Error fetching member workspaces:', error);
            throw error;
          }
          
          workspacesData = data;
        }

        console.log('Formatted workspaces:', workspacesData);
        return workspacesData || [];
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


import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Workspace } from "./types";

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

        // Get session to include in the request
        const { data: { session } } = await supabase.auth.getSession();
        const authHeader = session ? `Bearer ${session.access_token}` : '';

        // Call the edge function with authorization header
        const { data, error } = await supabase
          .functions.invoke('get-user-workspaces', {
            headers: {
              Authorization: authHeader
            },
            body: { user_id: user.id }
          });

        if (error) {
          console.error('Error fetching workspaces:', error);
          throw error;
        }
        
        console.log('Fetched workspaces:', data);
        return data || [];
      } catch (error: any) {
        console.error('Error in fetchWorkspaces:', error);
        toast({
          title: "Error",
          description: "Failed to load workspaces. Please try again.",
          variant: "destructive",
        });
        // Return empty array instead of throwing to prevent UI from breaking
        return [];
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 seconds
    retry: 2,
  });
}

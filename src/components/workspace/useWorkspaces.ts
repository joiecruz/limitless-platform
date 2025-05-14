
import { useQuery } from "@tanstack/react-query";
import { workspaceService } from "@/api";
import { useToast } from "@/hooks/use-toast";
import { Workspace } from "./types";

export function useWorkspaces() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      console.log('Fetching workspaces...');
      try {
        const data = await workspaceService.getUserWorkspaces();
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

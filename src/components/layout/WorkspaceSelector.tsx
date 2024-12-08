import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreateWorkspaceDialog } from "@/components/workspace/CreateWorkspaceDialog";
import { Separator } from "@/components/ui/separator";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Workspace {
  id: string;
  name: string | null;
  slug: string | null;
}

// This type represents the exact structure returned by Supabase
// when querying workspace_members with a nested workspaces select
type WorkspaceMemberResponse = {
  workspace: Workspace;
}

interface WorkspaceSelectorProps {
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace) => void;
}

export function WorkspaceSelector({ currentWorkspace, setCurrentWorkspace }: WorkspaceSelectorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: workspaces, isLoading } = useQuery({
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

        const { data: memberWorkspaces, error: workspacesError } = await supabase
          .from('workspace_members')
          .select(`
            workspace:workspaces (
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

        console.log('Raw workspace data:', memberWorkspaces);
        
        // Transform the response to match our Workspace type
        const formattedWorkspaces = (memberWorkspaces as WorkspaceMemberResponse[]).map(item => ({
          id: item.workspace.id,
          name: item.workspace.name || 'Unnamed Workspace',
          slug: item.workspace.slug || 'unnamed'
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

  // Set initial workspace
  useEffect(() => {
    console.log('WorkspaceSelector useEffect - currentWorkspace:', currentWorkspace);
    console.log('WorkspaceSelector useEffect - workspaces:', workspaces);
    if (!currentWorkspace && workspaces && workspaces.length > 0) {
      console.log('Setting initial workspace:', workspaces[0]);
      setCurrentWorkspace(workspaces[0]);
    }
  }, [currentWorkspace, workspaces, setCurrentWorkspace]);

  const handleWorkspaceSelect = (workspace: Workspace) => {
    console.log('Selecting workspace:', workspace);
    setCurrentWorkspace(workspace);
    // Invalidate relevant queries when workspace changes
    queryClient.invalidateQueries({ queryKey: ['channels'] });
    queryClient.invalidateQueries({ queryKey: ['messages'] });
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger 
          className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
          disabled={isLoading}
        >
          <span className="truncate">
            {isLoading ? "Loading workspaces..." : currentWorkspace?.name || "No workspace"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {workspaces?.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => handleWorkspaceSelect(workspace)}
              className="cursor-pointer"
            >
              {workspace.name || 'Unnamed Workspace'}
            </DropdownMenuItem>
          ))}
          <Separator className="my-2" />
          <CreateWorkspaceDialog />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
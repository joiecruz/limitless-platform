import { useState, useEffect, useCallback } from "react";
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

interface Workspace {
  id: string;
  name: string;
  slug: string;
}

interface WorkspaceSelectorProps {
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace) => void;
}

export function WorkspaceSelector({ currentWorkspace, setCurrentWorkspace }: WorkspaceSelectorProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchWorkspaces = useCallback(async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error fetching user:', userError);
        throw userError;
      }

      if (!user) {
        console.log("No user found");
        setIsLoading(false);
        return;
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
        .eq('user_id', user.id)
        .abortSignal(new AbortController().signal);

      if (workspacesError) {
        console.error('Error fetching workspaces:', workspacesError);
        throw workspacesError;
      }

      if (memberWorkspaces && memberWorkspaces.length > 0) {
        const transformedWorkspaces = memberWorkspaces.map(item => ({
          id: item.workspace.id,
          name: item.workspace.name,
          slug: item.workspace.slug
        }));
        
        setWorkspaces(transformedWorkspaces);
        if (!currentWorkspace && transformedWorkspaces.length > 0) {
          setCurrentWorkspace(transformedWorkspaces[0]);
        }
      }
    } catch (error) {
      console.error('Error in fetchWorkspaces:', error);
      toast({
        title: "Error",
        description: "Failed to load workspaces. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkspace, setCurrentWorkspace, toast]);

  useEffect(() => {
    let isSubscribed = true;
    
    if (isSubscribed) {
      fetchWorkspaces();
    }

    const workspaceSubscription = supabase
      .channel('public:workspaces')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'workspace_members' },
        () => {
          if (isSubscribed) {
            console.log('Workspace changes detected, refreshing...');
            fetchWorkspaces();
          }
        }
      )
      .subscribe();

    return () => {
      isSubscribed = false;
      workspaceSubscription.unsubscribe();
    };
  }, [fetchWorkspaces]);

  return (
    <div className="px-4 pb-4">
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
          {workspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => setCurrentWorkspace(workspace)}
              className="cursor-pointer"
            >
              {workspace.name}
            </DropdownMenuItem>
          ))}
          <Separator className="my-2" />
          <CreateWorkspaceDialog />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
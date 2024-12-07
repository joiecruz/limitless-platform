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

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        console.log("Fetching workspaces...");
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) {
          console.log("No user found");
          setIsLoading(false);
          return;
        }

        console.log("User found:", user.user.id);
        const { data: workspaceMembers, error: membersError } = await supabase
          .from('workspace_members')
          .select('workspace_id')
          .eq('user_id', user.user.id);

        if (membersError) {
          console.error('Error fetching workspace members:', membersError);
          throw membersError;
        }

        console.log("Workspace members:", workspaceMembers);
        if (workspaceMembers && workspaceMembers.length > 0) {
          const workspaceIds = workspaceMembers.map(member => member.workspace_id);
          const { data: workspacesData, error: workspacesError } = await supabase
            .from('workspaces')
            .select('*')
            .in('id', workspaceIds);

          if (workspacesError) {
            console.error('Error fetching workspaces:', workspacesError);
            throw workspacesError;
          }

          console.log("Workspaces data:", workspacesData);
          if (workspacesData) {
            setWorkspaces(workspacesData);
            if (workspacesData.length > 0 && !currentWorkspace) {
              setCurrentWorkspace(workspacesData[0]);
            }
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
    };

    fetchWorkspaces();
  }, [currentWorkspace, setCurrentWorkspace]);

  const handleCreateWorkspace = async () => {
    toast({
      title: "Coming Soon",
      description: "Workspace creation will be implemented soon!",
    });
  };

  return (
    <div className="px-4 pb-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="workspace-select w-full" disabled={isLoading}>
          <span className="truncate">
            {isLoading ? "Loading workspaces..." : currentWorkspace?.name || "No workspace"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {workspaces.length === 0 && !isLoading ? (
            <DropdownMenuItem disabled>No workspaces found</DropdownMenuItem>
          ) : (
            workspaces.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={() => setCurrentWorkspace(workspace)}
              >
                {workspace.name}
              </DropdownMenuItem>
            ))
          )}
          <DropdownMenuItem onClick={handleCreateWorkspace}>
            <span className="text-primary-600">+ Create Workspace</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
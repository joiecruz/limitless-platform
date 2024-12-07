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
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) return;

        const { data: workspaceMembers, error: membersError } = await supabase
          .from('workspace_members')
          .select('workspace_id')
          .eq('user_id', user.user.id);

        if (membersError) throw membersError;

        if (workspaceMembers && workspaceMembers.length > 0) {
          const workspaceIds = workspaceMembers.map(member => member.workspace_id);
          const { data: workspacesData, error: workspacesError } = await supabase
            .from('workspaces')
            .select('*')
            .in('id', workspaceIds);

          if (workspacesError) throw workspacesError;

          setWorkspaces(workspacesData || []);
          if (workspacesData && workspacesData.length > 0 && !currentWorkspace) {
            setCurrentWorkspace(workspacesData[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching workspaces:', error);
        toast({
          title: "Error",
          description: "Failed to load workspaces",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

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
            {isLoading ? "Loading..." : currentWorkspace?.name || "No workspace"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {workspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => setCurrentWorkspace(workspace)}
            >
              {workspace.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem onClick={handleCreateWorkspace}>
            <span className="text-primary-600">+ Create Workspace</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
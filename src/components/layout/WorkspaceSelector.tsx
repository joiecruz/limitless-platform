import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { CreateWorkspaceDialog } from "@/components/workspace/CreateWorkspaceDialog";
import { WorkspaceList } from "@/components/workspace/WorkspaceList";
import { useWorkspaces } from "@/components/workspace/useWorkspaces";
import { Workspace } from "@/components/workspace/types";
import { useEffect } from "react";

interface WorkspaceSelectorProps {
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace) => void;
}

export function WorkspaceSelector({ currentWorkspace, setCurrentWorkspace }: WorkspaceSelectorProps) {
  const queryClient = useQueryClient();
  const { data: workspaces, isLoading } = useWorkspaces();

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
            {isLoading ? "Loading workspaces..." : currentWorkspace?.name ? currentWorkspace.name : "No workspace"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <WorkspaceList
            workspaces={workspaces}
            onSelect={handleWorkspaceSelect}
            existingWorkspaceIds={currentWorkspace ? [currentWorkspace.id] : []}
          />
          <Separator className="my-2" />
          <CreateWorkspaceDialog />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
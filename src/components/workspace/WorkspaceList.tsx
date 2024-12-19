import { 
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";
import { Workspace } from "./types";

interface WorkspaceListProps {
  workspaces: Workspace[] | undefined;
  onSelect: (workspace: Workspace) => void;
  existingWorkspaceIds?: string[];
}

export function WorkspaceList({ workspaces, onSelect, existingWorkspaceIds = [] }: WorkspaceListProps) {
  // Filter out workspaces that are already added
  const availableWorkspaces = workspaces?.filter(
    workspace => !existingWorkspaceIds.includes(workspace.id)
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Building className="h-4 w-4 mr-2" />
          Select Workspace
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {!availableWorkspaces?.length ? (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">No workspaces available</div>
        ) : (
          availableWorkspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => onSelect(workspace)}
              className="cursor-pointer"
            >
              {workspace.name || 'Unnamed Workspace'}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
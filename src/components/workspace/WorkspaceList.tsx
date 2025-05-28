import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Building, Plus } from "lucide-react";
import { Workspace } from "./types";

interface WorkspaceListProps {
  workspaces: Workspace[] | undefined;
  onSelect: (workspace: Workspace) => void;
  onCreateNew?: () => void;
  existingWorkspaceIds?: string[];
}

export function WorkspaceList({ workspaces, onSelect, onCreateNew, existingWorkspaceIds = [] }: WorkspaceListProps) {
  // Filter out workspaces that are already added
  const availableWorkspaces = workspaces?.filter(
    workspace => !existingWorkspaceIds.includes(workspace.id)
  );

  return (
    <>
      {onCreateNew && (
        <DropdownMenuItem
          onClick={onCreateNew}
          className="cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Workspace
        </DropdownMenuItem>
      )}
      {availableWorkspaces?.length ? (
        <>
          {onCreateNew && (
            <div className="px-2 py-1.5 text-xs text-muted-foreground border-t mt-1 pt-2">
              Existing Workspaces
            </div>
          )}
          {availableWorkspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => onSelect(workspace)}
              className="cursor-pointer"
            >
              <Building className="h-4 w-4 mr-2" />
              {workspace.name || 'Unnamed Workspace'}
            </DropdownMenuItem>
          ))}
        </>
      ) : (
        !onCreateNew && (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">No more workspaces available</div>
        )
      )}
    </>
  );
}
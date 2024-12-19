import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Workspace } from "./types";

interface WorkspaceListProps {
  workspaces: Workspace[] | undefined;
  onSelect: (workspace: Workspace) => void;
}

export function WorkspaceList({ workspaces, onSelect }: WorkspaceListProps) {
  if (!workspaces?.length) {
    return <div className="px-2 py-1.5 text-sm text-muted-foreground">No workspaces found</div>;
  }

  return (
    <>
      {workspaces.map((workspace) => (
        <DropdownMenuItem
          key={workspace.id}
          onClick={() => onSelect(workspace)}
          className="cursor-pointer"
        >
          {workspace.name || 'Unnamed Workspace'}
        </DropdownMenuItem>
      ))}
    </>
  );
}
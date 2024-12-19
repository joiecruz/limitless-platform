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
}

export function WorkspaceList({ workspaces, onSelect }: WorkspaceListProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Building className="h-4 w-4 mr-2" />
          Select Workspace
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {!workspaces?.length ? (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">No workspaces found</div>
        ) : (
          workspaces.map((workspace) => (
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
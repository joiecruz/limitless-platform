import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";

interface WorkspaceHeaderProps {
  workspaceName: string;
  search: string;
  onSearchChange: (value: string) => void;
  onInviteClick: () => void;
}

export function WorkspaceHeader({ 
  workspaceName, 
  search, 
  onSearchChange, 
  onInviteClick 
}: WorkspaceHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">{workspaceName}</h1>
        <p className="text-sm text-gray-500">Workspace Management</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search members..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64"
          />
        </div>
        <Button onClick={onInviteClick}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>
    </div>
  );
}
import { Button } from "@/components/ui/button";

export function MembersSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Members</h2>
        <p className="text-sm text-muted-foreground">
          Manage your workspace members and their roles.
        </p>
      </div>
      
      <div className="space-y-4">
        <Button>Invite Members</Button>
        
        <div className="rounded-md border">
          <div className="p-4">
            <p className="text-sm text-muted-foreground">No members found</p>
          </div>
        </div>
      </div>
    </div>
  );
}
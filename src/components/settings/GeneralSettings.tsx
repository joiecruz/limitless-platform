import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext } from "react";
import { WorkspaceContext } from "@/components/layout/DashboardLayout";

export function GeneralSettings() {
  const { currentWorkspace } = useContext(WorkspaceContext);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">General Settings</h2>
        <p className="text-sm text-muted-foreground">
          Update your workspace information.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Workspace Name</Label>
          <Input 
            id="name" 
            placeholder={currentWorkspace?.name || "Enter workspace name"} 
            defaultValue={currentWorkspace?.name}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slug">Workspace URL</Label>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">limitlesslab.app/</span>
            <Input 
              id="slug" 
              placeholder={currentWorkspace?.slug || "your-workspace"}
              defaultValue={currentWorkspace?.slug}
            />
          </div>
        </div>
        
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GeneralSettings() {
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
          <Input id="name" placeholder="Enter workspace name" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slug">Workspace URL</Label>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">limitlesslab.app/</span>
            <Input id="slug" placeholder="your-workspace" />
          </div>
        </div>
        
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
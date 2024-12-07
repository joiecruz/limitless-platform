import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateWorkspaceDialog() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Create workspace
      const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .insert([{ name, slug }])
        .select()
        .single();

      if (workspaceError) throw workspaceError;

      // Add user as workspace owner
      const { error: memberError } = await supabase
        .from('workspace_members')
        .insert([{
          workspace_id: workspace.id,
          user_id: user.id,
          role: 'owner'
        }]);

      if (memberError) throw memberError;

      toast({
        title: "Success",
        description: "Workspace created successfully",
      });
      setIsOpen(false);
      setName("");
    } catch (error) {
      console.error('Error creating workspace:', error);
      toast({
        title: "Error",
        description: "Failed to create workspace. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          + Create Workspace
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Workspace Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Team"
              disabled={isLoading}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading || !name.trim()}>
            {isLoading ? "Creating..." : "Create Workspace"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function CreateWorkspaceDialog() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error("You must be logged in to create a workspace");
      }

      console.log('Creating workspace with name:', name);

      // Generate slug from name
      const slug = name.toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '') + 
        '-' + Date.now();

      const { data, error } = await supabase
        .from("workspaces")
        .insert([{ name: name.trim(), slug }])
        .select()
        .single();

      if (error) {
        console.error('Error creating workspace:', error);
        throw error;
      }

      console.log('Workspace created successfully:', data);

      // Add the creator as owner of the workspace
      const { error: memberError } = await supabase
        .from('workspace_members')
        .insert({
          user_id: user.id,
          workspace_id: data.id,
          role: 'owner',
        });

      if (memberError) {
        console.error('Error adding user as workspace owner:', memberError);
        throw memberError;
      }

      console.log('Added user as workspace owner');

      toast({
        title: "Success",
        description: "Workspace created successfully",
      });

      // Invalidate any workspace-related queries
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setOpen(false);
      setName("");
    } catch (error: any) {
      console.error('Error creating workspace:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create workspace",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              placeholder="Enter workspace name"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Workspace"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

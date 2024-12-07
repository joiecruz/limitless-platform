import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext, useState } from "react";
import { WorkspaceContext } from "@/components/layout/DashboardLayout";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FormValues {
  name: string;
  slug: string;
}

export function GeneralSettings() {
  const { currentWorkspace, setCurrentWorkspace } = useContext(WorkspaceContext);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: currentWorkspace?.name || "",
      slug: currentWorkspace?.slug || "",
    }
  });

  const onSubmit = async (data: FormValues) => {
    if (!currentWorkspace?.id) return;
    
    setIsLoading(true);
    try {
      // Check if slug is already taken
      const { data: existingWorkspaces, error: checkError } = await supabase
        .from('workspaces')
        .select('id')
        .eq('slug', data.slug)
        .neq('id', currentWorkspace.id);

      if (checkError) {
        throw checkError;
      }

      if (existingWorkspaces && existingWorkspaces.length > 0) {
        toast({
          title: "Error",
          description: "This workspace URL is already taken. Please choose another one.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Update workspace
      const { data: updatedWorkspace, error } = await supabase
        .from('workspaces')
        .update({
          name: data.name,
          slug: data.slug,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentWorkspace.id)
        .select()
        .single();

      if (error) throw error;

      if (updatedWorkspace) {
        setCurrentWorkspace({
          ...currentWorkspace,
          name: updatedWorkspace.name,
          slug: updatedWorkspace.slug,
        });

        toast({
          title: "Success",
          description: "Workspace settings updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error updating workspace:', error);
      toast({
        title: "Error",
        description: "Failed to update workspace settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">General Settings</h2>
        <p className="text-sm text-muted-foreground">
          Update your workspace information.
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Workspace Name</Label>
          <Input 
            id="name"
            {...register("name", { required: "Workspace name is required" })}
            placeholder="Enter workspace name"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slug">Workspace URL</Label>
          <div className="flex items-center space-x-2">
            <Input 
              id="slug"
              {...register("slug", {
                required: "Workspace URL is required",
                pattern: {
                  value: /^[a-z0-9-]+$/,
                  message: "Only lowercase letters, numbers, and hyphens are allowed"
                }
              })}
              placeholder="your-workspace"
              className="w-[180px]"
            />
            <span className="text-sm text-muted-foreground">.limitlesslab.io</span>
          </div>
          {errors.slug && (
            <p className="text-sm text-destructive">{errors.slug.message}</p>
          )}
          <p className="text-sm text-muted-foreground">
            This is your workspace's unique subdomain.
          </p>
        </div>
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
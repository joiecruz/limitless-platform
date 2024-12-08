import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface WorkspaceUpdateData {
  name: string;
  slug: string;
}

interface Workspace {
  id: string;
  name: string;
  slug: string;
}

export function useWorkspaceUpdate(
  currentWorkspace: Workspace | null,
  setCurrentWorkspace: (workspace: Workspace) => void
) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateWorkspace = async (data: WorkspaceUpdateData) => {
    console.log('Starting workspace update with data:', data);
    console.log('Current workspace:', currentWorkspace);

    if (!currentWorkspace?.id) {
      console.error('No workspace selected');
      toast({
        title: "Error",
        description: "No workspace selected",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Checking for existing workspace with slug:', data.slug);
      const { data: existingWorkspaces, error: checkError } = await supabase
        .from('workspaces')
        .select('id')
        .eq('slug', data.slug)
        .neq('id', currentWorkspace.id);

      if (checkError) {
        console.error('Error checking slug:', checkError);
        throw checkError;
      }

      if (existingWorkspaces && existingWorkspaces.length > 0) {
        console.log('Slug already exists');
        toast({
          title: "Error",
          description: "This workspace URL is already taken. Please choose another one.",
          variant: "destructive",
        });
        return;
      }

      console.log('Updating workspace with data:', data);
      const { data: updatedData, error: updateError } = await supabase
        .from('workspaces')
        .update({
          name: data.name,
          slug: data.slug,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentWorkspace.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating workspace:', updateError);
        throw updateError;
      }

      console.log('Update successful:', updatedData);

      if (updatedData) {
        // Update local state
        const updatedWorkspace = {
          id: updatedData.id,
          name: updatedData.name,
          slug: updatedData.slug
        };
        console.log('Setting current workspace to:', updatedWorkspace);
        setCurrentWorkspace(updatedWorkspace);

        // Invalidate and refetch queries
        console.log('Invalidating queries');
        await queryClient.invalidateQueries({ queryKey: ['workspaces'] });

        toast({
          title: "Success",
          description: "Workspace settings updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error in updateWorkspace:', error);
      toast({
        title: "Error",
        description: "Failed to update workspace settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { updateWorkspace, isLoading };
}
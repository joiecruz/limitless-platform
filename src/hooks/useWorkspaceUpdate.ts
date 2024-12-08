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
      // First check if slug exists for other workspaces
      if (data.slug !== currentWorkspace.slug) {
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
          toast({
            title: "Error",
            description: "This workspace URL is already taken. Please choose another one.",
            variant: "destructive",
          });
          return;
        }
      }

      console.log('Updating workspace with ID:', currentWorkspace.id);
      console.log('Update data:', data);

      // Then update the workspace
      const { data: updatedWorkspace, error: updateError } = await supabase
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

      console.log('Update successful:', updatedWorkspace);

      // Update local state
      setCurrentWorkspace(updatedWorkspace);

      // Invalidate queries
      await queryClient.invalidateQueries({ queryKey: ['workspaces'] });

      toast({
        title: "Success",
        description: "Workspace settings updated successfully.",
      });
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
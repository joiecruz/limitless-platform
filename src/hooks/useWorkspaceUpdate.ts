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
    if (!currentWorkspace?.id) return;
    
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
        toast({
          title: "Error",
          description: "This workspace URL is already taken. Please choose another one.",
          variant: "destructive",
        });
        return;
      }

      console.log('Updating workspace with data:', data);
      const { error: updateError } = await supabase
        .from('workspaces')
        .update({
          name: data.name,
          slug: data.slug,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentWorkspace.id);

      if (updateError) {
        console.error('Error updating workspace:', updateError);
        throw updateError;
      }

      const { data: updatedWorkspace, error: fetchError } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', currentWorkspace.id)
        .single();

      if (fetchError) {
        console.error('Error fetching updated workspace:', fetchError);
        throw fetchError;
      }

      console.log('Successfully fetched updated workspace:', updatedWorkspace);
      if (updatedWorkspace) {
        setCurrentWorkspace({
          id: updatedWorkspace.id,
          name: updatedWorkspace.name,
          slug: updatedWorkspace.slug
        });

        // Invalidate the workspaces query to trigger a refetch
        await queryClient.invalidateQueries({ queryKey: ['workspaces'] });

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

  return { updateWorkspace, isLoading };
}
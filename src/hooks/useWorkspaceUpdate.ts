import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface WorkspaceUpdateData {
  name: string;
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

  const generateSlug = (name: string): string => {
    const baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const randomSuffix = Math.floor(Math.random() * 1000);
    return `${baseSlug}-${randomSuffix}`;
  };

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
      // First verify the workspace exists
      const { data: existingWorkspace, error: checkError } = await supabase
        .from('workspaces')
        .select()
        .eq('id', currentWorkspace.id)
        .single();

      if (checkError) {
        console.error('Error checking workspace:', checkError);
        throw new Error('Workspace not found');
      }

      const newSlug = generateSlug(data.name);
      console.log('Updating workspace with ID:', currentWorkspace.id);
      console.log('Update data:', { name: data.name, slug: newSlug });

      const { data: updatedData, error: updateError } = await supabase
        .from('workspaces')
        .update({
          name: data.name,
          slug: newSlug,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentWorkspace.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating workspace:', updateError);
        throw updateError;
      }

      if (!updatedData) {
        throw new Error('No data returned after update');
      }

      console.log('Update successful:', updatedData);

      // Update local state with the returned data
      setCurrentWorkspace(updatedData);

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
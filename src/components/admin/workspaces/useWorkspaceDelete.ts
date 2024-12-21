import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useWorkspaceDelete() {
  const { toast } = useToast();

  const handleDeleteWorkspace = async (workspaceId: string) => {
    try {
      // Delete workspace members first due to foreign key constraints
      const { error: membersError } = await supabase
        .from('workspace_members')
        .delete()
        .eq('workspace_id', workspaceId);

      if (membersError) throw membersError;

      // Delete workspace domains
      const { error: domainsError } = await supabase
        .from('workspace_domains')
        .delete()
        .eq('workspace_id', workspaceId);

      if (domainsError) throw domainsError;

      // Delete workspace invitations
      const { error: invitationsError } = await supabase
        .from('workspace_invitations')
        .delete()
        .eq('workspace_id', workspaceId);

      if (invitationsError) throw invitationsError;

      // Delete channels
      const { error: channelsError } = await supabase
        .from('channels')
        .delete()
        .eq('workspace_id', workspaceId);

      if (channelsError) throw channelsError;

      // Finally delete the workspace
      const { error: workspaceError } = await supabase
        .from('workspaces')
        .delete()
        .eq('id', workspaceId);

      if (workspaceError) throw workspaceError;

      toast({
        title: "Success",
        description: "Workspace deleted successfully",
      });

      return true;
    } catch (error: any) {
      console.error('Error deleting workspace:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete workspace",
        variant: "destructive",
      });
      return false;
    }
  };

  return { handleDeleteWorkspace };
}
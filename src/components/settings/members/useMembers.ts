import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TableMember } from "./types";

export function useMembers(workspaceId: string | undefined) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: tableData, isLoading } = useQuery({
    queryKey: ['workspace-members', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      
      // Fetch active members with profiles and emails
      const { data: members, error: membersError } = await supabase
        .from('workspace_members')
        .select(`
          role,
          last_active,
          user_id,
          profiles (
            first_name,
            last_name,
            id,
            email:username
          )
        `)
        .eq('workspace_id', workspaceId);

      if (membersError) {
        console.error('Error fetching members:', membersError);
        throw membersError;
      }

      // Fetch pending invitations
      const { data: invitations, error: invitationsError } = await supabase
        .from('workspace_invitations')
        .select('email, role, created_at')
        .eq('workspace_id', workspaceId)
        .eq('status', 'pending');

      if (invitationsError) {
        console.error('Error fetching invitations:', invitationsError);
        throw invitationsError;
      }

      console.log('Active members:', members);
      console.log('Pending invitations:', invitations);

      // Transform members data
      const activeMembers = members?.map((member) => ({
        ...member,
        status: 'Active' as const,
        user_id: member.profiles.id,
        email: member.profiles.email
      })) || [];

      // Transform invitations data
      const pendingInvites = invitations?.map((invite) => ({
        email: invite.email,
        role: invite.role,
        status: 'Invited' as const,
        last_active: invite.created_at
      })) || [];

      return [...activeMembers, ...pendingInvites] as TableMember[];
    },
    enabled: !!workspaceId,
  });

  const handleDeleteMember = async (member: TableMember) => {
    if (!workspaceId) return;

    try {
      if (member.status === 'Active') {
        const { error } = await supabase
          .from('workspace_members')
          .delete()
          .eq('workspace_id', workspaceId)
          .eq('user_id', member.user_id);

        if (error) throw error;
        
        toast({
          title: "Member removed",
          description: "The member has been removed from the workspace.",
        });
      } else {
        const { error } = await supabase
          .from('workspace_invitations')
          .delete()
          .eq('workspace_id', workspaceId)
          .eq('email', member.email);

        if (error) throw error;
        
        toast({
          title: "Invitation cancelled",
          description: "The invitation has been cancelled successfully.",
        });
      }

      // Refresh the members list
      queryClient.invalidateQueries({
        queryKey: ['workspace-members', workspaceId],
      });
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: "Error",
        description: "Failed to remove member. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    tableData,
    isLoading,
    handleDeleteMember,
  };
}
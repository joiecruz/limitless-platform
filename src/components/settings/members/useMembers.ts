import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Member, WorkspaceMember } from "./types";
import { useToast } from "@/hooks/use-toast";

export function useMembers(workspaceId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['workspace-members', workspaceId],
    queryFn: async () => {
      if (!workspaceId) {
        throw new Error('No workspace selected');
      }

      // Fetch active members
      const { data: activeMembers, error: activeMembersError } = await supabase
        .from('workspace_members')
        .select(`
          user_id,
          role,
          last_active,
          workspace_id,
          profiles!inner (
            first_name,
            last_name,
            email,
            id
          )
        `)
        .eq('workspace_id', workspaceId)
        .returns<WorkspaceMember[]>();

      if (activeMembersError) {
        console.error('Error fetching active members:', activeMembersError);
        throw activeMembersError;
      }

      console.log('Active members data:', activeMembers);

      // Fetch pending invitations
      const { data: pendingInvites, error: pendingInvitesError } = await supabase
        .from('workspace_invitations')
        .select(`
          id,
          email,
          role,
          status,
          created_at,
          workspace_id
        `)
        .eq('workspace_id', workspaceId)
        .eq('status', 'pending');

      if (pendingInvitesError) {
        console.error('Error fetching pending invites:', pendingInvitesError);
        throw pendingInvitesError;
      }

      // Transform active members data
      const members: Member[] = activeMembers.map(member => ({
        id: member.user_id,
        user_id: member.user_id,
        workspace_id: member.workspace_id,
        email: member.profiles.email,
        role: member.role,
        last_active: member.last_active,
        status: 'Active' as const,
        profiles: {
          first_name: member.profiles.first_name || null,
          last_name: member.profiles.last_name || null,
          email: member.profiles.email
        }
      }));

      // Transform pending invites data
      const pendingMembers: Member[] = pendingInvites.map(invite => ({
        id: invite.id,
        workspace_id: invite.workspace_id,
        email: invite.email,
        role: invite.role,
        last_active: invite.created_at,
        status: 'Pending' as const,
        profiles: {
          first_name: null,
          last_name: null,
          email: invite.email
        }
      }));

      return [...members, ...pendingMembers];
    },
    enabled: !!workspaceId,
  });

  const handleDeleteMember = async (member: Member) => {
    try {
      if (!workspaceId) {
        throw new Error('No workspace selected');
      }

      if (member.status === 'Active') {
        const { error } = await supabase
          .from('workspace_members')
          .delete()
          .eq('workspace_id', workspaceId)
          .eq('user_id', member.id)
          .single();

        if (error) {
          console.error('Error deleting member:', error);
          throw error;
        }
      } else {
        const { error } = await supabase
          .from('workspace_invitations')
          .delete()
          .eq('id', member.id)
          .single();

        if (error) {
          console.error('Error cancelling invitation:', error);
          throw error;
        }
      }

      // Invalidate and refetch
      await queryClient.invalidateQueries({
        queryKey: ['workspace-members', workspaceId]
      });

      toast({
        title: "Success",
        description: member.status === 'Active' 
          ? "Member has been removed from the workspace"
          : "Invitation has been cancelled",
      });
    } catch (error: any) {
      console.error('Error deleting member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove member",
        variant: "destructive",
      });
    }
  };

  return {
    tableData: query.data || [],
    isLoading: query.isLoading,
    handleDeleteMember
  };
}
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

      // Fetch pending invitations - avoid FK validation by selecting specific fields
      const { data: pendingInvites, error: pendingInvitesError } = await supabase
        .from('workspace_invitations')
        .select('id, email, role, status, created_at, workspace_id')
        .eq('workspace_id', workspaceId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (pendingInvitesError) {
        console.error('Error fetching pending invites:', pendingInvitesError);
        // Don't throw error, just log it and continue with empty pending invites
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
      const pendingMembers: Member[] = (pendingInvites || []).map(invite => ({
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

      // Get current user's role in the workspace
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: currentUserRole, error: roleError } = await supabase
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', workspaceId)
        .eq('user_id', user.id)
        .single();

      if (roleError) {
        console.error('Error fetching user role:', roleError);
        throw new Error('Could not determine your permissions');
      }

      const isOwner = currentUserRole.role === 'owner';
      const isAdmin = currentUserRole.role === 'admin';

      // Only admin or owner can delete members
      if (!isOwner && !isAdmin) {
        throw new Error('You do not have permission to remove members');
      }

      // Check permissions for removing owners
      if (member.role === 'owner' && !isOwner) {
        throw new Error('Only owners can remove other owners');
      }

      // Prevent self-deletion
      if (member.status === 'Active' && member.user_id === user.id) {
        throw new Error('You cannot remove yourself from the workspace');
      }

      if (member.status === 'Active') {
        // Delete from workspace_members table
        const { error: memberError } = await supabase
          .from('workspace_members')
          .delete()
          .eq('workspace_id', workspaceId)
          .eq('user_id', member.id);

        if (memberError) {
          console.error('Error deleting member:', memberError);
          throw memberError;
        }

        // Also delete any pending invitations for this user's email
        const { error: inviteError } = await supabase
          .from('workspace_invitations')
          .delete()
          .eq('workspace_id', workspaceId)
          .eq('email', member.email);

        if (inviteError) {
          console.error('Error deleting related invitations:', inviteError);
          // Don't throw - this is not critical
        }
      } else {
        // Delete pending invitation
        const { error: inviteError } = await supabase
          .from('workspace_invitations')
          .delete()
          .eq('id', member.id);

        if (inviteError) {
          console.error('Error cancelling invitation:', inviteError);
          throw inviteError;
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

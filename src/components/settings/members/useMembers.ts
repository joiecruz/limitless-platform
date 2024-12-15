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

      // Fetch active members with their email from auth.users
      const { data: activeMembers, error: activeMembersError } = await supabase
        .from('workspace_members')
        .select(`
          user_id,
          role,
          last_active,
          profiles!inner (
            first_name,
            last_name,
            id,
            email
          )
        `)
        .eq('workspace_id', workspaceId)
        .returns<WorkspaceMember[]>();

      if (activeMembersError) {
        console.error('Error fetching active members:', activeMembersError);
        throw activeMembersError;
      }

      // Fetch pending invitations
      const { data: pendingInvites, error: pendingInvitesError } = await supabase
        .from('workspace_invitations')
        .select(`
          id,
          email,
          role,
          status,
          created_at
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
        email: member.profiles.email,
        role: member.role,
        last_active: member.last_active,
        status: 'Active' as const,
        profiles: {
          first_name: member.profiles.first_name || null,
          last_name: member.profiles.last_name || null,
        }
      }));

      // Transform pending invites data
      const pendingMembers: Member[] = pendingInvites.map(invite => ({
        id: invite.id,
        email: invite.email,
        role: invite.role,
        last_active: invite.created_at,
        status: 'Pending' as const,
        profiles: {
          first_name: null,
          last_name: null,
        }
      }));

      // Combine and return all members
      return [...members, ...pendingMembers];
    },
    enabled: !!workspaceId,
  });

  const handleDeleteMember = async (member: Member) => {
    try {
      if (member.status === 'Active') {
        const { error } = await supabase
          .from('workspace_members')
          .delete()
          .eq('workspace_id', workspaceId)
          .eq('user_id', member.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('workspace_invitations')
          .delete()
          .eq('id', member.id);

        if (error) throw error;
      }

      // Invalidate and refetch
      queryClient.invalidateQueries({
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
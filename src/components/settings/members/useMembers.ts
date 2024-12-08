import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Member } from "./types";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  id: string;
}

interface WorkspaceMember {
  user_id: string;
  role: string;
  last_active: string;
  profiles: ProfileData;
}

export function useMembers(workspaceId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['workspace-members', workspaceId],
    queryFn: async () => {
      if (!workspaceId) {
        throw new Error('No workspace selected');
      }

      console.log('Fetching members for workspace:', workspaceId);

      // Fetch active members
      const { data: activeMembers, error: activeMembersError } = await supabase
        .from('workspace_members')
        .select(`
          user_id,
          role,
          last_active,
          profiles!inner (
            first_name,
            last_name,
            id
          )
        `)
        .eq('workspace_id', workspaceId);

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
          created_at
        `)
        .eq('workspace_id', workspaceId)
        .eq('status', 'pending');

      if (pendingInvitesError) {
        console.error('Error fetching pending invites:', pendingInvitesError);
        throw pendingInvitesError;
      }

      console.log('Pending invites data:', pendingInvites);

      // Transform active members data
      const members: Member[] = (activeMembers as unknown as WorkspaceMember[]).map(member => ({
        id: member.user_id,
        user_id: member.user_id,
        email: null,
        role: member.role,
        last_active: member.last_active,
        status: 'Active' as const,
        profiles: {
          first_name: member.profiles.first_name,
          last_name: member.profiles.last_name,
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
      console.log('Deleting member:', member);

      if (member.status === 'Active') {
        const { error } = await supabase
          .from('workspace_members')
          .delete()
          .eq('workspace_id', workspaceId)
          .eq('user_id', member.id);

        if (error) {
          console.error('Error deleting workspace member:', error);
          throw error;
        }
      } else {
        const { error } = await supabase
          .from('workspace_invitations')
          .delete()
          .eq('id', member.id);

        if (error) {
          console.error('Error deleting invitation:', error);
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
      console.error('Error in handleDeleteMember:', error);
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableMember } from "./types";
import { useToast } from "@/hooks/use-toast";

export function useMembers(workspaceId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query for active members and pending invitations
  const { data: tableData, isLoading } = useQuery({
    queryKey: ['workspace-members', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];

      // Fetch active members
      const { data: members, error: membersError } = await supabase
        .from('workspace_members')
        .select(`
          role,
          last_active,
          user_id,
          profiles!inner(
            first_name,
            last_name,
            id
          )
        `)
        .eq('workspace_id', workspaceId);

      if (membersError) throw membersError;

      // Fetch pending invitations
      const { data: invitations, error: invitationsError } = await supabase
        .from('workspace_invitations')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('status', 'pending');

      if (invitationsError) throw invitationsError;

      // Transform active members data
      const activeMembers: TableMember[] = members.map(member => ({
        user_id: member.user_id,
        role: member.role,
        last_active: member.last_active,
        status: 'Active' as const,
        profiles: {
          first_name: member.profiles.first_name,
          last_name: member.profiles.last_name,
        }
      }));

      // Transform pending invitations data
      const pendingMembers: TableMember[] = invitations.map(invitation => ({
        role: invitation.role,
        last_active: invitation.created_at,
        status: 'Invited' as const,
        email: invitation.email
      }));

      // Combine and return all members
      return [...activeMembers, ...pendingMembers];
    },
    enabled: !!workspaceId
  });

  // Mutation for deleting members
  const deleteMutation = useMutation({
    mutationFn: async (member: TableMember) => {
      if (!workspaceId) throw new Error('No workspace selected');

      if (member.status === 'Active') {
        const { error } = await supabase
          .from('workspace_members')
          .delete()
          .eq('workspace_id', workspaceId)
          .eq('user_id', member.user_id);

        if (error) throw error;
      } else {
        // Delete invitation
        const { error } = await supabase
          .from('workspace_invitations')
          .delete()
          .eq('workspace_id', workspaceId)
          .eq('email', member.email);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['workspace-members', workspaceId]
      });
      toast({
        title: "Success",
        description: "Member removed successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting member:', error);
      toast({
        title: "Error",
        description: "Failed to remove member. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleDeleteMember = (member: TableMember) => {
    deleteMutation.mutate(member);
  };

  return {
    tableData,
    isLoading,
    handleDeleteMember
  };
}
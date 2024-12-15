import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Member, WorkspaceMember } from "./types";
import { useToast } from "@/hooks/use-toast";

export function useMembers(workspaceId: string | null) {
  const { toast } = useToast();

  return useQuery({
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
        .order('last_active', { ascending: false });

      if (activeMembersError) {
        console.error('Error fetching active members:', activeMembersError);
        throw activeMembersError;
      }

      // Fetch pending invitations
      const { data: pendingInvites, error: pendingInvitesError } = await supabase
        .from('workspace_invitations')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('status', 'pending');

      if (pendingInvitesError) {
        console.error('Error fetching pending invites:', pendingInvitesError);
        throw pendingInvitesError;
      }

      // Map active members to the common format
      const members: Member[] = activeMembers.map(member => ({
        id: member.user_id,
        user_id: member.user_id,
        email: member.profiles.email,
        role: member.role,
        last_active: member.last_active,
        status: 'Active' as const,
        first_name: member.profiles.first_name,
        last_name: member.profiles.last_name
      }));

      // Add pending invites to the list
      const pendingMembers: Member[] = pendingInvites.map(invite => ({
        id: invite.id,
        user_id: null,
        email: invite.email,
        role: invite.role,
        last_active: null,
        status: 'Pending' as const,
        first_name: null,
        last_name: null
      }));

      // Combine active members and pending invites
      return [...members, ...pendingMembers];
    },
    onError: (error: Error) => {
      console.error('Error in useMembers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch workspace members",
        variant: "destructive",
      });
    }
  });
}
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WorkspaceContext } from "@/components/layout/DashboardLayout";
import { useContext } from "react";
import { Member } from "./types";

export function useMembers() {
  const { currentWorkspace } = useContext(WorkspaceContext);

  return useQuery({
    queryKey: ['workspace-members', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) {
        throw new Error('No workspace selected');
      }

      // Fetch active members
      const { data: activeMembers, error: activeMembersError } = await supabase
        .from('workspace_members')
        .select(`
          user_id,
          role,
          last_active,
          profiles:user_id (
            first_name,
            last_name,
            id
          )
        `)
        .eq('workspace_id', currentWorkspace.id);

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
        .eq('workspace_id', currentWorkspace.id)
        .eq('status', 'pending');

      if (pendingInvitesError) {
        console.error('Error fetching pending invites:', pendingInvitesError);
        throw pendingInvitesError;
      }

      // Transform active members data
      const members: Member[] = activeMembers.map(member => ({
        id: member.user_id,
        email: null, // Email is not available from profiles
        role: member.role,
        last_active: member.last_active,
        status: 'Active' as const,
        profiles: {
          first_name: member.profiles[0]?.first_name,
          last_name: member.profiles[0]?.last_name,
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
    enabled: !!currentWorkspace?.id,
  });
}
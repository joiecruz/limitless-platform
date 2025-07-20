import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WorkspaceMember } from "@/types/workspace";

export interface WorkspaceMemberWithInvitation extends WorkspaceMember {
  invitation_id?: string;
  invitation_role?: string;
  invitation_status?: string;
  invitation_created_at?: string;
  accepted_at?: string;
  invited_by?: string;
}

export function useWorkspaceMembersWithInvitations(workspaceId: string) {
  return useQuery({
    queryKey: ["workspace-members-with-invitations", workspaceId],
    queryFn: async () => {
      // First check if user is a member of this workspace
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: membership, error: membershipError } = await supabase
        .from("workspace_members")
        .select("user_id")
        .eq("workspace_id", workspaceId)
        .eq("user_id", user.id)
        .single();

      if (membershipError || !membership) {
        throw new Error("Not a member of this workspace");
      }

      // Fetch workspace members with invitation data
      const { data, error } = await supabase
        .from("workspace_members")
        .select(`
          user_id,
          role,
          created_at,
          last_active,
          profiles!inner (
            first_name,
            last_name,
            email
          ),
          workspace_invitations!inner (
            id,
            role,
            status,
            created_at,
            accepted_at,
            invited_by
          )
        `)
        .eq("workspace_id", workspaceId);

      if (error) throw error;

      return data.map((member: any) => ({
        user_id: member.user_id,
        role: member.role,
        created_at: member.created_at,
        last_active: member.last_active,
        profiles: {
          first_name: member.profiles.first_name,
          last_name: member.profiles.last_name,
          email: member.profiles.email
        },
        // Include invitation data if available
        invitation_id: member.workspace_invitations?.[0]?.id,
        invitation_role: member.workspace_invitations?.[0]?.role,
        invitation_status: member.workspace_invitations?.[0]?.status,
        invitation_created_at: member.workspace_invitations?.[0]?.created_at,
        accepted_at: member.workspace_invitations?.[0]?.accepted_at,
        invited_by: member.workspace_invitations?.[0]?.invited_by
      })) as WorkspaceMemberWithInvitation[];
    },
    enabled: !!workspaceId,
  });
}

// Alternative hook that gets both members and pending invitations
export function useWorkspaceMembersAndInvitations(workspaceId: string) {
  return useQuery({
    queryKey: ["workspace-members-and-invitations", workspaceId],
    queryFn: async () => {
      // First check if user is a member of this workspace
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: membership, error: membershipError } = await supabase
        .from("workspace_members")
        .select("user_id")
        .eq("workspace_id", workspaceId)
        .eq("user_id", user.id)
        .single();

      if (membershipError || !membership) {
        throw new Error("Not a member of this workspace");
      }

      // Fetch workspace members
      const { data: members, error: membersError } = await supabase
        .from("workspace_members")
        .select(`
          user_id,
          role,
          created_at,
          last_active,
          profiles!inner (
            first_name,
            last_name,
            email
          )
        `)
        .eq("workspace_id", workspaceId);

      if (membersError) throw membersError;

      // Fetch pending invitations
      const { data: invitations, error: invitationsError } = await supabase
        .from("workspace_invitations")
        .select(`
          id,
          email,
          role,
          status,
          created_at,
          workspace_id,
          invited_by
        `)
        .eq("workspace_id", workspaceId)
        .eq("status", "pending");

      if (invitationsError) throw invitationsError;

      return {
        members: members.map((member: any) => ({
          user_id: member.user_id,
          role: member.role,
          created_at: member.created_at,
          last_active: member.last_active,
          profiles: {
            first_name: member.profiles.first_name,
            last_name: member.profiles.last_name,
            email: member.profiles.email
          }
        })) as WorkspaceMember[],
        invitations: invitations || []
      };
    },
    enabled: !!workspaceId,
  });
} 
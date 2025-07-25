import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface WorkspaceMemberView {
  user_id: string;
  workspace_id: string;
  member_role: string;
  member_created_at: string;
  last_active: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  profile_id: string;
  invitation_id: string | null;
  invitation_role: string | null;
  invitation_status: string | null;
  invitation_created_at: string | null;
  accepted_at: string | null;
  invited_by: string | null;
  expires_at: string | null;
  display_status: 'Active' | 'Pending' | 'Rejected';
}

export function useWorkspaceMembersView(workspaceId: string) {
  return useQuery({
    queryKey: ["workspace-members-view", workspaceId],
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

      // Fetch data from the unified view
      const { data, error } = await supabase
        .from("workspace_members_with_invitations")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("member_created_at", { ascending: false });

      if (error) throw error;

      return data as WorkspaceMemberView[];
    },
    enabled: !!workspaceId,
  });
}

// Hook to get only active members
export function useWorkspaceActiveMembers(workspaceId: string) {
  return useQuery({
    queryKey: ["workspace-active-members", workspaceId],
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

      // Fetch only active members from the view
      const { data, error } = await supabase
        .from("workspace_members_with_invitations")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("display_status", "Active")
        .order("member_created_at", { ascending: false });

      if (error) throw error;

      return data as WorkspaceMemberView[];
    },
    enabled: !!workspaceId,
  });
}

// Hook to get pending invitations
export function useWorkspacePendingInvitations(workspaceId: string) {
  return useQuery({
    queryKey: ["workspace-pending-invitations", workspaceId],
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

      // Fetch pending invitations from the view
      const { data, error } = await supabase
        .from("workspace_members_with_invitations")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("display_status", "Pending")
        .order("invitation_created_at", { ascending: false });

      if (error) throw error;

      return data as WorkspaceMemberView[];
    },
    enabled: !!workspaceId,
  });
} 
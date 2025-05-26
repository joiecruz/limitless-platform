import { useParams } from "react-router-dom";
import { WorkspaceMembersTable } from "@/components/admin/workspaces/WorkspaceMembersTable";
import { WorkspaceHeader } from "@/components/admin/workspaces/WorkspaceHeader";
import { useState } from "react";
import { InviteMemberDialog } from "@/components/settings/members/InviteMemberDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspaceRole } from "@/hooks/useWorkspaceRole";

export default function AdminWorkspaceDetails() {
  const { id } = useParams<{ id: string }>();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: workspace } = useQuery({
    queryKey: ['workspace', id],
    queryFn: async () => {
      if (!id) throw new Error('No workspace ID provided');
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const { data: userRole } = useWorkspaceRole(id);
  const canInviteMembers = userRole === 'admin' || userRole === 'owner';

  if (!id) {
    return <div>Workspace ID is required</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <WorkspaceHeader
        workspaceName={workspace?.name || 'Loading...'}
        search={search}
        onSearchChange={setSearch}
        onInviteClick={() => setIsInviteDialogOpen(true)}
        canInvite={canInviteMembers}
      />

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Members</h2>
          <WorkspaceMembersTable
            workspaceId={id}
            onDeleteMember={async (userId: string) => {
              const { error } = await supabase
                .from('workspace_members')
                .delete()
                .eq('workspace_id', id)
                .eq('user_id', userId);

              if (error) throw error;
            }}
          />
        </div>
      </div>

      <InviteMemberDialog
        isOpen={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        workspaceId={id}
        workspaceName={workspace?.name || ''}
      />
    </div>
  );
}
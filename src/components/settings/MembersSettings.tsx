import { useContext, useState } from "react";
import { WorkspaceContext } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { InviteMemberDialog } from "./members/InviteMemberDialog";
import { MembersTable } from "./members/MembersTable";
import { useToast } from "@/hooks/use-toast";

interface WorkspaceMember {
  profiles: {
    first_name: string | null;
    last_name: string | null;
  };
  role: string;
  last_active: string;
  status: 'Active';
}

interface WorkspaceInvitation {
  email: string;
  role: string;
  status: 'Invited';
  last_active: string;
}

type TableMember = WorkspaceMember | WorkspaceInvitation;

export function MembersSettings() {
  const { currentWorkspace } = useContext(WorkspaceContext);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: tableData, isLoading } = useQuery({
    queryKey: ['workspace-members', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];
      
      // Fetch active members
      const { data: members, error: membersError } = await supabase
        .from('workspace_members')
        .select(`
          role,
          last_active,
          profiles (
            first_name,
            last_name
          )
        `)
        .eq('workspace_id', currentWorkspace.id);

      if (membersError) {
        console.error('Error fetching members:', membersError);
        throw membersError;
      }

      // Fetch pending invitations
      const { data: invitations, error: invitationsError } = await supabase
        .from('workspace_invitations')
        .select('email, role, created_at')
        .eq('workspace_id', currentWorkspace.id)
        .eq('status', 'pending');

      if (invitationsError) {
        console.error('Error fetching invitations:', invitationsError);
        throw invitationsError;
      }

      // Transform members data
      const activeMembers = members?.map((member) => ({
        ...member,
        status: 'Active' as const
      })) || [];

      // Transform invitations data
      const pendingInvites = invitations?.map((invite) => ({
        email: invite.email,
        role: invite.role,
        status: 'Invited' as const,
        last_active: invite.created_at
      })) || [];

      return [...activeMembers, ...pendingInvites] as TableMember[];
    },
    enabled: !!currentWorkspace?.id,
  });

  const handleDeleteMember = async (member: TableMember) => {
    if (!currentWorkspace?.id) return;

    try {
      if (member.status === 'Active') {
        const { error } = await supabase
          .from('workspace_members')
          .delete()
          .eq('workspace_id', currentWorkspace.id)
          .eq('role', member.role);

        if (error) throw error;
        
        toast({
          title: "Member removed",
          description: "The member has been removed from the workspace.",
        });
      } else {
        const { error } = await supabase
          .from('workspace_invitations')
          .delete()
          .eq('workspace_id', currentWorkspace.id)
          .eq('email', member.email);

        if (error) throw error;
        
        toast({
          title: "Invitation cancelled",
          description: "The invitation has been cancelled successfully.",
        });
      }

      // Refresh the members list
      queryClient.invalidateQueries({
        queryKey: ['workspace-members', currentWorkspace.id],
      });
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: "Error",
        description: "Failed to remove member. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-muted-foreground">Please select a workspace</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Members</h2>
        <p className="text-sm text-muted-foreground">
          Manage your workspace members and their roles.
        </p>
      </div>
      
      <div className="space-y-4">
        <Button onClick={() => setIsInviteDialogOpen(true)}>
          Invite Members
        </Button>
        
        <InviteMemberDialog
          isOpen={isInviteDialogOpen}
          onOpenChange={setIsInviteDialogOpen}
          workspaceId={currentWorkspace.id}
          workspaceName={currentWorkspace.name}
        />
        
        <div className="rounded-md border">
          {isLoading ? (
            <div className="p-4">
              <p className="text-sm text-muted-foreground">Loading members...</p>
            </div>
          ) : !tableData?.length ? (
            <div className="p-4">
              <p className="text-sm text-muted-foreground">No members found</p>
            </div>
          ) : (
            <MembersTable 
              members={tableData} 
              onDeleteMember={handleDeleteMember}
            />
          )}
        </div>
      </div>
    </div>
  );
}
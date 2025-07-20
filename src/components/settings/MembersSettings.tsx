import { useContext, useState, useEffect } from "react";
import { WorkspaceContext } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { InviteMemberDialog } from "./members/InviteMemberDialog";
import { MembersTable } from "./members/MembersTable";
import { useMembers } from "./members/useMembers";
import { useWorkspaceMembersView, useWorkspaceActiveMembers, useWorkspacePendingInvitations } from "@/hooks/useWorkspaceMembersView";
import { deleteInvitation, deleteWorkspaceMember } from "@/hooks/useDeleteWorkspaceMember";
import { useWorkspaceRole } from "@/hooks/useWorkspaceRole";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MembersSettings() {
  const { currentWorkspace } = useContext(WorkspaceContext);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  // Option 2: Use the new view-based hooks
  const { data: activeMembers, isLoading: isLoadingActive } = useWorkspaceActiveMembers(currentWorkspace?.id);
  const { data: pendingInvitations, isLoading: isLoadingPending } = useWorkspacePendingInvitations(currentWorkspace?.id);
  const { tableData, isLoading } = useMembers(currentWorkspace?.id);
  const { data: userRole } = useWorkspaceRole(currentWorkspace?.id);

  // State for members and invitations
  const [members, setMembers] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);

  // Transform view data to match MembersTable format
  const transformViewData = (viewData: any[]) => {
    return viewData?.map(member => ({
      id: member.user_id || member.invitation_id,
      user_id: member.user_id,
      workspace_id: member.workspace_id,
      email: member.email,
      role: member.member_role || member.invitation_role,
      last_active: member.last_active || member.invitation_created_at,
      status: member.display_status,
      profiles: {
        first_name: member.first_name,
        last_name: member.last_name,
        email: member.email
      }
    })) || [];
  };

  // Sync state with query data
  useEffect(() => {
    setMembers(transformViewData(activeMembers));
  }, [activeMembers]);

  useEffect(() => {
    setInvitations(transformViewData(tableData));
  }, [tableData]);

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-muted-foreground">Please select a workspace</p>
      </div>
    );
  }

  const canInviteMembers = userRole === 'admin' || userRole === 'owner';

  const handleDelete = async (workspace_id: string, user_id: string) => {
    try {
      await deleteWorkspaceMember(workspace_id, user_id);
      setMembers(prev => prev.filter(m => m.user_id !== user_id));
      toast({
        title: "Success",
        description: "Member has been deleted from workspace.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to remove member.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInvite = async (workspace_id: string, email: string) => {
    try {
      await deleteInvitation(workspace_id, email);
      setInvitations(prev => prev.filter(i => i.email !== email));
      toast({
        title: "Success",
        description: "Invitation has been deleted.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to remove invite.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Members</h2>
        <p className="text-sm text-muted-foreground">
          Manage your workspace members and their roles.
        </p>
      </div>

      <div className="space-y-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-block">
                <Button
                  onClick={() => setIsInviteDialogOpen(true)}
                  disabled={!canInviteMembers}
                  className={!canInviteMembers ? "cursor-not-allowed" : ""}
                >
                  Invite Members
                </Button>
              </div>
            </TooltipTrigger>
            {!canInviteMembers && (
              <TooltipContent>
                <p>Only admin/owner can invite members</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <InviteMemberDialog
          isOpen={isInviteDialogOpen}
          onOpenChange={setIsInviteDialogOpen}
          workspaceId={currentWorkspace.id}
          workspaceName={currentWorkspace.name}
        />

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="members">
              Active Members ({members.length})
            </TabsTrigger>
            <TabsTrigger value="invitations">
              Pending Invitations ({invitations.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="members" className="space-y-4">
            <div className="rounded-md border">
              {isLoadingActive ? (
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">Loading members...</p>
                </div>
              ) : !members.length ? (
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">No active members found</p>
                </div>
              ) : (
                <MembersTable
                  members={members}
                  onDeleteMember={(member) => handleDelete(member.workspace_id, member.user_id)}
                />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="invitations" className="space-y-4">
            <div className="rounded-md border">
              {isLoading ? (
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">Loading invitations...</p>
                </div>
              ) : !invitations.length ? (
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">No pending invitations found</p>
                </div>
              ) : (
                <MembersTable
                  members={invitations}
                  onDeleteMember={(member) => handleDeleteInvite(member.workspace_id, member.email)}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
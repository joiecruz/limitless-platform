import { useContext, useState } from "react";
import { WorkspaceContext } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { InviteMemberDialog } from "./members/InviteMemberDialog";
import { MembersTable } from "./members/MembersTable";
import { useMembers } from "./members/useMembers";
import { useWorkspaceMembersView, useWorkspaceActiveMembers, useWorkspacePendingInvitations } from "@/hooks/useWorkspaceMembersView";
import { deleteWorkspaceMember } from "@/hooks/useDeleteWorkspaceMember";
import { useWorkspaceRole } from "@/hooks/useWorkspaceRole";
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
  const { data: allMembers, isLoading: isLoadingView } = useWorkspaceMembersView(currentWorkspace?.id);
  const { data: activeMembers, isLoading: isLoadingActive } = useWorkspaceActiveMembers(currentWorkspace?.id);
  const { data: pendingInvitations, isLoading: isLoadingPending } = useWorkspacePendingInvitations(currentWorkspace?.id);
  
  const { data: userRole } = useWorkspaceRole(currentWorkspace?.id);


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
      // Optionally refetch your members list here
      // e.g., refetchMembers();
    } catch (error) {
      // Handle error (show toast, etc.)
      console.error(error);
    }
  };

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

        {/* Option 1: Use existing approach (recommended)
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
        </div> */}

        {/* Option 2: Use new approach with tabs for separate members and invitations */}
        
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="members">
              Active Members ({activeMembers?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="invitations">
              Pending Invitations ({pendingInvitations?.length || 0})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="members" className="space-y-4">
            <div className="rounded-md border">
              {isLoadingActive ? (
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">Loading members...</p>
                </div>
              ) : !activeMembers?.length ? (
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">No active members found</p>
                </div>
              ) : (
                <MembersTable
                  members={transformViewData(activeMembers)}
                  onDeleteMember={(member) => handleDelete(member.workspace_id, member.user_id)}
                />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="invitations" className="space-y-4">
            <div className="rounded-md border">
              {isLoadingPending ? (
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">Loading invitations...</p>
                </div>
              ) : !pendingInvitations?.length ? (
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">No pending invitations found</p>
                </div>
              ) : (
                <MembersTable
                  members={transformViewData(pendingInvitations)}
                  onDeleteMember={(member) => handleDelete(member.workspace_id, member.user_id)}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
        
      </div>
    </div>
  );
}
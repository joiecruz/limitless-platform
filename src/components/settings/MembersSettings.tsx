import { useContext, useState } from "react";
import { WorkspaceContext } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { InviteMemberDialog } from "./members/InviteMemberDialog";
import { MembersTable } from "./members/MembersTable";
import { useMembers } from "./members/useMembers";
import { useWorkspaceRole } from "@/hooks/useWorkspaceRole";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function MembersSettings() {
  const { currentWorkspace } = useContext(WorkspaceContext);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const { tableData, isLoading, handleDeleteMember } = useMembers(currentWorkspace?.id);
  const { data: userRole } = useWorkspaceRole(currentWorkspace?.id);

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-muted-foreground">Please select a workspace</p>
      </div>
    );
  }

  const canInviteMembers = userRole === 'admin' || userRole === 'owner';

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
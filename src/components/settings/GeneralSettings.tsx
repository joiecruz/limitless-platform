import { useContext, useEffect, useState } from "react";
import { WorkspaceContext } from "@/components/layout/DashboardLayout";
import { WorkspaceForm } from "./WorkspaceForm";
import { useWorkspaceUpdate } from "@/hooks/useWorkspaceUpdate";
// DELETE FUNCTIONALITY TEMPORARILY DISABLED - UNCOMMENT BELOW TO RE-ENABLE
// import { useWorkspaceDelete } from "@/components/admin/workspaces/useWorkspaceDelete";
import { useWorkspaceRole } from "@/hooks/useWorkspaceRole";
// import { useWorkspaces } from "@/components/workspace/useWorkspaces";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
// import { useNavigate } from "react-router-dom";

export function GeneralSettings() {
  const { currentWorkspace, setCurrentWorkspace } = useContext(WorkspaceContext);
  const { updateWorkspace, isLoading } = useWorkspaceUpdate(currentWorkspace, setCurrentWorkspace);
  // DELETE FUNCTIONALITY TEMPORARILY DISABLED - UNCOMMENT BELOW TO RE-ENABLE
  // const { handleDeleteWorkspace } = useWorkspaceDelete();
  const { data: userRole } = useWorkspaceRole(currentWorkspace?.id);
  // const { data: userWorkspaces } = useWorkspaces();
  // const [isDeleting, setIsDeleting] = useState(false);
  // const navigate = useNavigate();

  // Get current user
  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');
      return user;
    }
  });

  console.log('GeneralSettings - currentWorkspace:', currentWorkspace);

  // Reset form when workspace changes
  useEffect(() => {
    console.log('Workspace changed in settings:', currentWorkspace);
  }, [currentWorkspace]);

  // DELETE FUNCTIONALITY TEMPORARILY DISABLED - UNCOMMENT BELOW TO RE-ENABLE
  // const handleDelete = async () => {
  //   if (!currentWorkspace?.id) return;
  //
  //   setIsDeleting(true);
  //   try {
  //     const success = await handleDeleteWorkspace(currentWorkspace.id);
  //     if (success) {
  //       // Navigate to dashboard or workspace selection after successful deletion
  //       navigate('/dashboard');
  //     }
  //   } catch (error) {
  //     console.error('Error deleting workspace:', error);
  //   } finally {
  //     setIsDeleting(false);
  //   }
  // };

  // Check if user has multiple workspaces
  // const hasMultipleWorkspaces = userWorkspaces && userWorkspaces.length > 1;
  // const canDelete = hasMultipleWorkspaces;

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
        <h2 className="text-lg font-medium">General Settings</h2>
        <p className="text-sm text-muted-foreground">
          Update your workspace information.
        </p>
      </div>

      <WorkspaceForm
        key={currentWorkspace.id}
        defaultValues={{
          name: currentWorkspace.name,
        }}
        onSubmit={updateWorkspace}
        isLoading={isLoading}
        currentUserId={currentUser?.id}
        userRole={userRole}
        workspaceId={currentWorkspace.id}
        // DELETE FUNCTIONALITY TEMPORARILY DISABLED - UNCOMMENT BELOW TO RE-ENABLE
        // onDelete={canDelete ? handleDelete : undefined}
        // isDeleting={isDeleting}
        // hasMultipleWorkspaces={hasMultipleWorkspaces}
      />
    </div>
  );
}
import { useContext, useEffect } from "react";
import { WorkspaceContext } from "@/components/layout/DashboardLayout";
import { WorkspaceForm } from "./WorkspaceForm";
import { useWorkspaceUpdate } from "@/hooks/useWorkspaceUpdate";

export function GeneralSettings() {
  const { currentWorkspace, setCurrentWorkspace } = useContext(WorkspaceContext);
  const { updateWorkspace, isLoading } = useWorkspaceUpdate(currentWorkspace, setCurrentWorkspace);

  console.log('GeneralSettings - currentWorkspace:', currentWorkspace);

  // Reset form when workspace changes
  useEffect(() => {
    console.log('Workspace changed in settings:', currentWorkspace);
  }, [currentWorkspace]);

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
      />
    </div>
  );
}
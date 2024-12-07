import { useContext } from "react";
import { WorkspaceContext } from "@/components/layout/DashboardLayout";
import { WorkspaceForm } from "./WorkspaceForm";
import { useWorkspaceUpdate } from "@/hooks/useWorkspaceUpdate";

export function GeneralSettings() {
  const { currentWorkspace, setCurrentWorkspace } = useContext(WorkspaceContext);
  const { updateWorkspace, isLoading } = useWorkspaceUpdate(currentWorkspace, setCurrentWorkspace);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">General Settings</h2>
        <p className="text-sm text-muted-foreground">
          Update your workspace information.
        </p>
      </div>
      
      <WorkspaceForm 
        defaultValues={{
          name: currentWorkspace?.name || "",
          slug: currentWorkspace?.slug || "",
        }}
        onSubmit={updateWorkspace}
        isLoading={isLoading}
      />
    </div>
  );
}
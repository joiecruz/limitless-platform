import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface WorkspaceFormProps {
  defaultValues: {
    name: string;
  };
  onSubmit: (data: { name: string }) => Promise<void>;
  isLoading: boolean;
  currentUserId?: string;
  userRole?: string;
  workspaceId?: string;
  onDelete?: () => Promise<void>;
  isDeleting?: boolean;
  hasMultipleWorkspaces?: boolean;
}

export function WorkspaceForm({
  defaultValues,
  onSubmit,
  isLoading,
  currentUserId,
  userRole,
  workspaceId,
  onDelete,
  isDeleting = false,
  hasMultipleWorkspaces = false
}: WorkspaceFormProps) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues
  });

  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Watch the current value of the name field
  const currentName = watch("name");

  const isOwner = userRole === 'owner';
  const isAdmin = userRole === 'admin';
  const canEditWorkspace = isOwner || isAdmin;
  const canDelete = isOwner && onDelete && workspaceId && hasMultipleWorkspaces;
  const isConfirmationValid = confirmationText === defaultValues.name;

  // Check if there are actual changes
  const hasChanges = currentName !== defaultValues.name;

  const handleDeleteConfirm = async () => {
    if (onDelete && isConfirmationValid) {
      await onDelete();
      setIsDeleteDialogOpen(false);
      setConfirmationText("");
    }
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setConfirmationText("");
  };

  const getButtonText = () => {
    if (isLoading) return "Saving...";
    if (!canEditWorkspace) return "Save Changes";
    if (!hasChanges) return "Save Changes";
    return "Save Changes";
  };

  const getButtonDisabledState = () => {
    return isLoading || !canEditWorkspace || !hasChanges;
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Workspace Name</Label>
          <Input
            id="name"
            {...register("name", { required: "Workspace name is required" })}
            placeholder="Enter workspace name"
            disabled={!canEditWorkspace}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <Button type="submit" disabled={getButtonDisabledState()}>
          {getButtonText()}
        </Button>

        {!canEditWorkspace && userRole && (
          <p className="text-sm text-muted-foreground">
            Only workspace owners and admins can change the workspace name.
          </p>
        )}
      </form>

      {userRole === 'owner' && workspaceId && (
        <div className="border-t pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
              <p className="text-sm text-muted-foreground">
                Permanently delete this workspace and all of its data.
              </p>
            </div>

            {!hasMultipleWorkspaces ? (
              <div className="space-y-3">
                <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-amber-800">Cannot delete your only workspace</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        You need at least one workspace to use the platform. Create a new workspace before deleting this one.
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  className="w-full sm:w-auto"
                  disabled={true}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Workspace
                </Button>
              </div>
            ) : (
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full sm:w-auto"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Workspace
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Workspace</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                      <div className="space-y-3">
                        <p>
                          This action cannot be undone. This will permanently delete the workspace
                          <strong> "{defaultValues.name}"</strong> and all of its data, including:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>All workspace members and their access</li>
                          <li>All channels and messages</li>
                          <li>All projects and associated data</li>
                          <li>All workspace settings and configurations</li>
                        </ul>
                        <div className="space-y-2">
                          <Label htmlFor="confirmation">
                            Type <strong>{defaultValues.name}</strong> to confirm:
                          </Label>
                          <Input
                            id="confirmation"
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                            placeholder={defaultValues.name}
                          />
                        </div>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleDeleteDialogClose}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteConfirm}
                      disabled={!isConfirmationValid || isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? "Deleting..." : "Delete Workspace"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
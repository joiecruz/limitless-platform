import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";

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
  isLoadingWorkspaces?: boolean;
  workspaceCount?: number;
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
  hasMultipleWorkspaces = false,
  isLoadingWorkspaces = false,
  workspaceCount = 0
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

      {isOwner && (
        <>
          <Separator className="my-8" />
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
            </div>
            
            <div className="border border-destructive/50 rounded-lg p-4 space-y-4">
              <div>
                <h4 className="font-medium">Delete this workspace</h4>
                <p className="text-sm text-muted-foreground">
                  Once you delete a workspace, there is no going back. This will permanently delete the workspace and all associated data including projects, channels, messages, and members.
                </p>
              </div>

              {!hasMultipleWorkspaces && !isLoadingWorkspaces && (
                <p className="text-sm text-amber-600 dark:text-amber-500">
                  You cannot delete your only workspace. Create another workspace first before deleting this one.
                </p>
              )}

              {isLoadingWorkspaces && (
                <p className="text-sm text-muted-foreground">
                  Checking workspace count...
                </p>
              )}

              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    disabled={!canDelete || isDeleting}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeleting ? "Deleting..." : "Delete Workspace"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3">
                      <p>
                        This action cannot be undone. This will permanently delete the workspace 
                        <strong className="text-foreground"> "{defaultValues.name}"</strong> and all of its data:
                      </p>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>All projects and their content</li>
                        <li>All channels and messages</li>
                        <li>All workspace members will lose access</li>
                        <li>All design challenges and sticky notes</li>
                      </ul>
                      <div className="pt-2">
                        <Label htmlFor="confirm-delete" className="text-foreground">
                          Type <strong>{defaultValues.name}</strong> to confirm:
                        </Label>
                        <Input
                          id="confirm-delete"
                          value={confirmationText}
                          onChange={(e) => setConfirmationText(e.target.value)}
                          placeholder="Enter workspace name"
                          className="mt-2"
                        />
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
            </div>
          </div>
        </>
      )}
    </div>
  );
}
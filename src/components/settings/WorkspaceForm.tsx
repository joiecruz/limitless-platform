import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
// DELETE FUNCTIONALITY TEMPORARILY DISABLED - UNCOMMENT IMPORTS BELOW TO RE-ENABLE
// import { useState } from "react";
// import { Trash2 } from "lucide-react";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";

interface WorkspaceFormProps {
  defaultValues: {
    name: string;
  };
  onSubmit: (data: { name: string }) => Promise<void>;
  isLoading: boolean;
  currentUserId?: string;
  userRole?: string;
  workspaceId?: string;
  // DELETE FUNCTIONALITY TEMPORARILY DISABLED - UNCOMMENT BELOW TO RE-ENABLE
  // onDelete?: () => Promise<void>;
  // isDeleting?: boolean;
  // hasMultipleWorkspaces?: boolean;
}

export function WorkspaceForm({
  defaultValues,
  onSubmit,
  isLoading,
  currentUserId,
  userRole,
  workspaceId,
  // DELETE FUNCTIONALITY TEMPORARILY DISABLED - UNCOMMENT BELOW TO RE-ENABLE
  // onDelete,
  // isDeleting = false,
  // hasMultipleWorkspaces = false
}: WorkspaceFormProps) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues
  });

  // DELETE FUNCTIONALITY TEMPORARILY DISABLED - UNCOMMENT BELOW TO RE-ENABLE
  // const [confirmationText, setConfirmationText] = useState("");
  // const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Watch the current value of the name field
  const currentName = watch("name");

  const isOwner = userRole === 'owner';
  const isAdmin = userRole === 'admin';
  const canEditWorkspace = isOwner || isAdmin;
  // DELETE FUNCTIONALITY TEMPORARILY DISABLED - UNCOMMENT BELOW TO RE-ENABLE
  // const canDelete = isOwner && onDelete && workspaceId && hasMultipleWorkspaces;
  // const isConfirmationValid = confirmationText === defaultValues.name;

  // Check if there are actual changes
  const hasChanges = currentName !== defaultValues.name;

  // DELETE FUNCTIONALITY TEMPORARILY DISABLED - UNCOMMENT BELOW TO RE-ENABLE
  // const handleDeleteConfirm = async () => {
  //   if (onDelete && isConfirmationValid) {
  //     await onDelete();
  //     setIsDeleteDialogOpen(false);
  //     setConfirmationText("");
  //   }
  // };

  // const handleDeleteDialogClose = () => {
  //   setIsDeleteDialogOpen(false);
  //   setConfirmationText("");
  // };

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

        {canEditWorkspace && !hasChanges && (
          <p className="text-sm text-muted-foreground">
            Make changes to the workspace name to enable saving.
          </p>
        )}
      </form>

      {/*
      DELETE FUNCTIONALITY TEMPORARILY DISABLED

      The delete workspace functionality has been temporarily removed.
      To re-enable:
      1. Uncomment the imports at the top (useState, Trash2, AlertDialog components)
      2. Uncomment the interface props (onDelete, isDeleting, hasMultipleWorkspaces)
      3. Uncomment the destructured props in the function signature
      4. Uncomment the delete-related state and logic
      5. Add back the "Danger Zone" section here
      */}
    </div>
  );
}
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useState, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useMessageOperations } from "@/hooks/useMessageOperations";
import { useWorkspaceRole } from "@/hooks/useWorkspaceRole";
import { useGlobalRole } from "@/hooks/useGlobalRole";
import { WorkspaceContext } from "@/components/layout/DashboardLayout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Message } from "@/types/community";

interface MessageActionsProps {
  message: Message;
  onMessageUpdate?: (updatedMessage: Message) => void;
  onEditStart?: () => void;
  isEditing?: boolean;
  isPublicChannel?: boolean;
  onMessageMarkDeleted?: (messageId: string) => void;
  onMessageRestore?: (messageId: string) => void;
}

export function MessageActions({
  message,
  onMessageUpdate,
  onEditStart,
  isEditing,
  isPublicChannel = false,
  onMessageMarkDeleted,
  onMessageRestore
}: MessageActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const { currentWorkspace } = useContext(WorkspaceContext);
  const { handleMessageDelete } = useMessageOperations();
  const { data: userRole } = useWorkspaceRole(currentWorkspace?.id || "");
  const { canDeletePublicMessages, is_superadmin, is_admin } = useGlobalRole();
  const { toast } = useToast();

  // Get current user ID
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  // Users can edit their own messages, and admins/owners can edit their own messages too
  const canEdit = currentUserId === message.user_id;

  // Determine delete permissions based on channel type
  const canDelete = isPublicChannel
    ? canDeletePublicMessages  // Global admins can delete in public channels
    : (userRole === 'admin' || userRole === 'owner'); // Workspace admins/owners for private channels

  const handleDelete = async () => {
    
    
    
    
    
    
    

    if (!canDelete) {
      const errorMessage = isPublicChannel
        ? "Only platform admins and superadmins can delete messages in public channels"
        : "Only workspace admins and owners can delete messages";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDeleting(true);
      

      const result = await handleMessageDelete(
        message.id,
        isPublicChannel ? (is_superadmin ? 'superadmin' : 'admin') : userRole,
        message.user_id,
        onMessageMarkDeleted,
        onMessageRestore
      );

      

      if (result && typeof result === 'object' && result.success && result.undoFunction) {
        // Show toast with undo button
        toast({
          title: "Message will be permanently deleted",
          description: "Undo this action?",
          duration: 3000,
          action: (
            <ToastAction
              altText="Undo deletion"
              onClick={result.undoFunction}
            >
              Undo
            </ToastAction>
          ),
        });
      } else if (result && typeof result === 'object' && !result.success) {
        
      }
    } catch (error) {
      
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Don't show actions if user has no permissions
  if (!canEdit && !canDelete) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canEdit && (
          <DropdownMenuItem onClick={onEditStart} disabled={isEditing}>
            <Edit className="h-4 w-4 mr-2" />
            Edit message
          </DropdownMenuItem>
        )}
        {canDelete && (
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete message"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
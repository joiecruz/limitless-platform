import { useState } from "react";
import { Message } from "@/types/community";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PendingDeletion {
  messageId: string;
  timeoutId: NodeJS.Timeout;
  undoFunction: () => void;
}

export function useMessageOperations() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingDeletions, setPendingDeletions] = useState<Map<string, PendingDeletion>>(new Map());
  const { toast } = useToast();

  const handleMessageDelete = async (
    messageId: string,
    userRole?: string,
    messageUserId?: string,
    onMessageMarkDeleted?: (messageId: string) => void,
    onMessageRestore?: (messageId: string) => void
  ) => {
    try {
      console.log("Starting message deletion process for:", messageId);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("No authenticated user found");
        toast({
          title: "Error",
          description: "You must be logged in to delete messages",
          variant: "destructive",
        });
        return false;
      }

      console.log("userRole:", userRole);
      // Check permissions: user can delete their own messages, or admins/owners can delete any message
      const canDelete = user.id === messageUserId || userRole === 'admin' || userRole === 'owner' || userRole === 'superadmin';

      if (!canDelete) {
        console.error("User doesn't have permission to delete this message");
        toast({
          title: "Error",
          description: "You don't have permission to delete this message",
          variant: "destructive",
        });
        return false;
      }

      // Cancel any existing pending deletion for this message
      const existingPending = pendingDeletions.get(messageId);
      if (existingPending) {
        clearTimeout(existingPending.timeoutId);
        pendingDeletions.delete(messageId);
        setPendingDeletions(new Map(pendingDeletions));
      }

      // Immediately mark message as deleted in UI
      if (onMessageMarkDeleted) {
        onMessageMarkDeleted(messageId);
      }

      // Create undo function
      const undoFunction = () => {
        console.log("Undoing deletion for message:", messageId);

        // Clear the pending deletion
        const pending = pendingDeletions.get(messageId);
        if (pending) {
          clearTimeout(pending.timeoutId);
          pendingDeletions.delete(messageId);
          setPendingDeletions(new Map(pendingDeletions));
        }

        // Restore message in UI
        if (onMessageRestore) {
          onMessageRestore(messageId);
        }

        toast({
          title: "Message restored",
          description: "The message has been restored",
        });
      };

      // Set up delayed deletion
      const timeoutId = setTimeout(async () => {
        console.log("Executing actual deletion for message:", messageId);
        setIsDeleting(true);

        try {
          // First delete all reactions for this message
          const { error: reactionsError } = await supabase
            .from('message_reactions')
            .delete()
            .eq('message_id', messageId);

          if (reactionsError) {
            console.error("Error deleting message reactions:", reactionsError);
            throw reactionsError;
          }

          // Then delete the message
          const { error: messageError } = await supabase
            .from('messages')
            .delete()
            .eq('id', messageId);

          if (messageError) {
            console.error("Error deleting message:", messageError);
            throw messageError;
          }

          console.log("Message deleted successfully from database");
          pendingDeletions.delete(messageId);
          setPendingDeletions(new Map(pendingDeletions));
        } catch (error) {
          console.error('Error in delayed deletion:', error);
          // If deletion fails, restore the message
          if (onMessageRestore) {
            onMessageRestore(messageId);
          }
          toast({
            title: "Error",
            description: "Failed to delete message - restored",
            variant: "destructive",
          });
          pendingDeletions.delete(messageId);
          setPendingDeletions(new Map(pendingDeletions));
        } finally {
          setIsDeleting(false);
        }
      }, 3000); // 3 second delay

      // Store pending deletion
      const pendingDeletion: PendingDeletion = {
        messageId,
        timeoutId,
        undoFunction
      };

      setPendingDeletions(prev => new Map(prev.set(messageId, pendingDeletion)));

      return { success: true, undoFunction };
    } catch (error) {
      console.error('Error in handleMessageDelete:', error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  const cancelPendingDeletion = (messageId: string) => {
    const pending = pendingDeletions.get(messageId);
    if (pending) {
      pending.undoFunction();
    }
  };

  return {
    handleMessageDelete,
    cancelPendingDeletion,
    isDeleting,
    pendingDeletions
  };
}
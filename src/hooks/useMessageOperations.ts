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
      

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        
        toast({
          title: "Error",
          description: "You must be logged in to delete messages",
          variant: "destructive",
        });
        return false;
      }

      
      // Check permissions: user can delete their own messages, or admins/owners can delete any message
      const canDelete = user.id === messageUserId || userRole === 'admin' || userRole === 'owner' || userRole === 'superadmin';

      if (!canDelete) {
        
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
        
        setIsDeleting(true);

        try {
          // First delete all reactions for this message
          const { error: reactionsError } = await supabase
            .from('message_reactions')
            .delete()
            .eq('message_id', messageId);

          if (reactionsError) {
            
            throw reactionsError;
          }

          // Then delete the message
          const { error: messageError } = await supabase
            .from('messages')
            .delete()
            .eq('id', messageId);

          if (messageError) {
            
            throw messageError;
          }

          
          pendingDeletions.delete(messageId);
          setPendingDeletions(new Map(pendingDeletions));
        } catch (error) {
          
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
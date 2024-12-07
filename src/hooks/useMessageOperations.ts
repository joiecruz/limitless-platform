import { useState } from "react";
import { Message } from "@/types/community";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useMessageOperations(messages: Message[], onMessagesUpdate: (messages: Message[]) => void) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleMessageDelete = async (messageId: string) => {
    try {
      setIsDeleting(true);
      
      // Update local state immediately for better UX
      const updatedMessages = messages.filter(msg => msg.id !== messageId);
      onMessagesUpdate(updatedMessages);
      
      // Delete message reactions first (due to foreign key constraint)
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

      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      // Revert local state if deletion fails
      onMessagesUpdate(messages);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    handleMessageDelete,
    isDeleting
  };
}
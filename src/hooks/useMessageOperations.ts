import { useState } from "react";
import { Message } from "@/types/community";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useMessageOperations() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleMessageDelete = async (messageId: string) => {
    try {
      setIsDeleting(true);
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
        .eq('id', messageId)
        .eq('user_id', user.id); // Ensure user can only delete their own messages

      if (messageError) {
        console.error("Error deleting message:", messageError);
        throw messageError;
      }

      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Error in handleMessageDelete:', error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    handleMessageDelete,
    isDeleting
  };
}
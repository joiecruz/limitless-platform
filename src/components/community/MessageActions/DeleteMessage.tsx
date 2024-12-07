import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface DeleteMessageProps {
  messageId: string;
  userId: string;
}

export function DeleteMessage({ messageId, userId }: DeleteMessageProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteMessage = async () => {
    try {
      setIsDeleting(true);
      console.log("Starting delete process for message:", messageId);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No authenticated user found");
        toast({
          title: "Error",
          description: "You must be logged in to delete messages",
          variant: "destructive",
        });
        return;
      }

      console.log("Current user:", user.id);
      console.log("Message owner:", userId);

      // Check if the message belongs to the current user
      if (user.id !== userId) {
        console.log("User does not own this message");
        toast({
          title: "Error",
          description: "You can only delete your own messages",
          variant: "destructive",
        });
        return;
      }

      // Delete message reactions first
      const { error: reactionError } = await supabase
        .from("message_reactions")
        .delete()
        .eq("message_id", messageId);

      if (reactionError) {
        console.error("Error deleting message reactions:", reactionError);
        throw reactionError;
      }

      console.log("Successfully deleted reactions");

      // Then delete the message
      const { error: messageError } = await supabase
        .from("messages")
        .delete()
        .eq("id", messageId);

      if (messageError) {
        console.error("Error deleting message:", messageError);
        throw messageError;
      }

      console.log("Successfully deleted message");

      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
    } catch (error) {
      console.error("Error in delete process:", error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDeleteMessage}
      disabled={isDeleting}
      className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gray-400 hover:text-red-500 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DeleteMessageProps {
  messageId: string;
  userId: string;
}

export function DeleteMessage({ messageId, userId }: DeleteMessageProps) {
  const { toast } = useToast();

  const handleDeleteMessage = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to delete messages",
          variant: "destructive",
        });
        return;
      }

      // Check if the message belongs to the current user
      if (user.id !== userId) {
        toast({
          title: "Error",
          description: "You can only delete your own messages",
          variant: "destructive",
        });
        return;
      }

      console.log("Attempting to delete message:", messageId);

      // Delete message reactions first
      const { error: reactionError } = await supabase
        .from("message_reactions")
        .delete()
        .eq("message_id", messageId);

      if (reactionError) {
        console.error("Error deleting message reactions:", reactionError);
        throw reactionError;
      }

      // Then delete the message
      const { error: messageError } = await supabase
        .from("messages")
        .delete()
        .eq("id", messageId);

      if (messageError) {
        console.error("Error deleting message:", messageError);
        throw messageError;
      }

      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  return (
    <button
      onClick={handleDeleteMessage}
      className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gray-400 hover:text-red-500"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
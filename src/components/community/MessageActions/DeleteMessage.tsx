import { Trash2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMessageOperations } from "@/hooks/useMessageOperations";

interface DeleteMessageProps {
  messageId: string;
  userId: string;
}

export function DeleteMessage({ messageId, userId }: DeleteMessageProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { handleMessageDelete } = useMessageOperations();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      console.log("Starting delete process for message:", messageId);

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

      // Check if the current user is the message author
      if (user.id !== userId) {
        console.log("User is not authorized to delete this message");
        toast({
          title: "Error",
          description: "You can only delete your own messages",
          variant: "destructive",
        });
        return;
      }

      const success = await handleMessageDelete(messageId);
      if (!success) {
        console.log("Message deletion failed");
      }
    } catch (error) {
      console.error("Error in delete handler:", error);
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
      onClick={handleDelete}
      disabled={isDeleting}
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-red-600 disabled:opacity-50"
      title="Delete message"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
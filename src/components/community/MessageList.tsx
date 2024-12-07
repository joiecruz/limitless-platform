import { Message } from "@/types/community";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { MessageReactions } from "./MessageReactions";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMemo } from "react";

interface MessageListProps {
  messages: Message[];
  onReaction: (messageId: string, emoji: string) => void;
}

export function MessageList({ messages, onReaction }: MessageListProps) {
  const { toast } = useToast();

  const handleDeleteMessage = async (messageId: string, userId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.id !== userId) {
        toast({
          title: "Error",
          description: "You can only delete your own messages",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", messageId);

      if (error) throw error;

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

  const formatMessageContent = (content: string) => {
    // Replace @mentions with styled spans
    return content.replace(/@(\w+)/g, '<span class="text-primary font-semibold">@$1</span>');
  };

  if (messages.length === 0) {
    return <p className="text-gray-500 text-center">No messages yet</p>;
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="flex items-start space-x-3 group">
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.profiles?.avatar_url || ''} />
            <AvatarFallback>
              {message.profiles?.username?.charAt(0).toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">
                {message.profiles?.username || 'Unknown User'}
              </span>
              <span className="text-xs text-gray-500">
                {format(new Date(message.created_at), 'MMM d, h:mm a')}
              </span>
              <button
                onClick={() => handleDeleteMessage(message.id, message.user_id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {message.content && (
              <p 
                className="text-gray-700 mt-1"
                dangerouslySetInnerHTML={{ 
                  __html: formatMessageContent(message.content) 
                }}
              />
            )}
            {message.image_url && (
              <img 
                src={message.image_url} 
                alt="Message attachment" 
                className="mt-2 max-w-sm rounded-lg shadow-sm"
              />
            )}
            <MessageReactions 
              messageId={message.id}
              reactions={message.message_reactions || []}
              onReaction={onReaction}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
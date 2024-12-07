import { Hash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Channel, Message } from "@/types/community";
import { useEffect, useRef, useState } from "react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChatAreaProps {
  activeChannel: Channel | null;
  messages: Message[];
  onSendMessage: (content: string, imageUrl?: string) => void;
}

export function ChatArea({ activeChannel, messages, onSendMessage }: ChatAreaProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [localMessages]);

  const handleMessageDelete = async (messageId: string) => {
    try {
      // Remove message from local state immediately for better UX
      setLocalMessages(prev => prev.filter(msg => msg.id !== messageId));
      
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
      setLocalMessages(messages);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      console.log("Handling reaction:", { messageId, emoji });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("No authenticated user found");
        toast({
          title: "Error",
          description: "You must be logged in to react to messages",
          variant: "destructive",
        });
        return;
      }

      // Check if user already reacted with this emoji
      const { data: existingReactions, error: fetchError } = await supabase
        .from('message_reactions')
        .select('*')
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .eq('emoji', emoji);

      if (fetchError) {
        console.error("Error fetching existing reactions:", fetchError);
        throw fetchError;
      }

      console.log("Existing reactions:", existingReactions);

      if (existingReactions && existingReactions.length > 0) {
        // If reaction exists, remove it (toggle behavior)
        console.log("Removing existing reaction");
        const { error: deleteError } = await supabase
          .from('message_reactions')
          .delete()
          .eq('message_id', messageId)
          .eq('user_id', user.id)
          .eq('emoji', emoji);

        if (deleteError) {
          console.error("Error deleting reaction:", deleteError);
          throw deleteError;
        }

        // Update local state to remove the reaction
        setLocalMessages(prev => prev.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              message_reactions: msg.message_reactions?.filter(
                reaction => !(reaction.user_id === user.id && reaction.emoji === emoji)
              ) || []
            };
          }
          return msg;
        }));
      } else {
        // If no reaction exists, add it
        console.log("Adding new reaction");
        const { data: newReaction, error: insertError } = await supabase
          .from('message_reactions')
          .insert([
            {
              message_id: messageId,
              user_id: user.id,
              emoji: emoji,
            },
          ])
          .select()
          .single();

        if (insertError) {
          console.error("Error inserting reaction:", insertError);
          throw insertError;
        }

        // Update local state to add the new reaction
        setLocalMessages(prev => prev.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              message_reactions: [...(msg.message_reactions || []), newReaction]
            };
          }
          return msg;
        }));
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast({
        title: "Error",
        description: "Failed to handle reaction",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {activeChannel && (
        <div className="border-b px-6 py-4">
          <div className="flex items-center">
            <Hash className="h-5 w-5 text-gray-400 mr-2" />
            <h1 className="text-xl font-semibold text-gray-900">{activeChannel.name}</h1>
          </div>
          {activeChannel.description && (
            <p className="text-sm text-gray-500 mt-1">{activeChannel.description}</p>
          )}
        </div>
      )}

      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <MessageList 
          messages={localMessages}
          onReaction={handleReaction}
          onDeleteMessage={handleMessageDelete}
        />
      </ScrollArea>

      <div className="p-4 border-t bg-white">
        <MessageInput
          channelName={activeChannel?.name || ''}
          onSendMessage={onSendMessage}
        />
      </div>
    </div>
  );
}
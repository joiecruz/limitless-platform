import { Hash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Channel, Message } from "@/types/community";
import { useEffect, useRef } from "react";
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

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('message_reactions')
        .insert([
          {
            message_id: messageId,
            user_id: user.id,
            emoji: emoji,
          },
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast({
        title: "Error",
        description: "Failed to add reaction",
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
          messages={messages}
          onReaction={handleReaction}
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
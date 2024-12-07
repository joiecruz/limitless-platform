import { ScrollArea } from "@/components/ui/scroll-area";
import { Channel, Message } from "@/types/community";
import { useEffect, useRef, useState } from "react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ChatHeader } from "./ChatHeader";
import { useMessageOperations } from "@/hooks/useMessageOperations";
import { useReactionOperations } from "@/hooks/useReactionOperations";

interface ChatAreaProps {
  activeChannel: Channel | null;
  messages: Message[];
  onSendMessage: (content: string, imageUrl?: string) => void;
}

export function ChatArea({ activeChannel, messages, onSendMessage }: ChatAreaProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
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

  const { handleMessageDelete } = useMessageOperations(localMessages, setLocalMessages);
  const { handleReaction } = useReactionOperations(localMessages, setLocalMessages);

  return (
    <div className="flex-1 flex flex-col bg-white">
      {activeChannel && <ChatHeader channel={activeChannel} />}

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
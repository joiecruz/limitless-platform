import { ScrollArea } from "@/components/ui/scroll-area";
import { Channel, Message } from "@/types/community";
import { useEffect, useRef, useState } from "react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ChatHeader } from "./ChatHeader";
import { useReactionOperations } from "@/hooks/useReactionOperations";

interface ChatAreaProps {
  activeChannel: Channel | null;
  messages: Message[];
  onSendMessage: (content: string, imageUrl?: string) => void;
}

export function ChatArea({ activeChannel, messages, onSendMessage }: ChatAreaProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);

  useEffect(() => {
    setLocalMessages(messages);

    // Check if we have new messages
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      if (latestMessage.id !== lastMessageId) {
        setLastMessageId(latestMessage.id);
      }
    }
  }, [messages]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current;
      const shouldAutoScroll =
        scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight < 100;

      if (shouldAutoScroll) {
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [localMessages]);

  const { handleReaction } = useReactionOperations(localMessages, setLocalMessages);

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      {activeChannel ? (
        <>
          <ChatHeader channel={activeChannel} />
          <ScrollArea className="flex-1" ref={scrollAreaRef}>
            <div className="p-6">
              <MessageList
                messages={localMessages}
                onReaction={handleReaction}
                highlightMessageId={lastMessageId}
              />
            </div>
          </ScrollArea>
          <div className="p-4 border-t bg-white">
            <MessageInput
              channelName={activeChannel.name}
              onSendMessage={onSendMessage}
              activeChannel={activeChannel}
            />
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="border-b px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-900">Welcome to Community</h1>
            <p className="text-sm text-gray-500 mt-1">Select a channel to start chatting</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a channel to start chatting</p>
          </div>
        </div>
      )}
    </div>
  );
}
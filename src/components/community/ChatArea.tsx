import { ScrollArea } from "@/components/ui/scroll-area";
import { Channel, Message } from "@/types/community";
import { useEffect, useRef, useMemo, useCallback } from "react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ChatHeader } from "./ChatHeader";
import { useReactionOperations } from "@/hooks/useReactionOperations";
import { LoadingQuotes } from "@/components/common/LoadingQuotes";
import { Lock } from "lucide-react";

interface ChatAreaProps {
  activeChannel: Channel | null;
  messages: Message[];
  onSendMessage: (content: string, imageUrl?: string) => void;
  onMessageUpdate?: (updatedMessage: Message) => void;
  onChannelUpdate?: (updatedChannel: Channel) => void;
  onChannelDelete?: () => void;
  onOpenChannels?: () => void;
  isLoading?: boolean;
  isReadOnlyDisabled?: boolean;
}

export function ChatArea({
  activeChannel,
  messages,
  onSendMessage,
  onMessageUpdate,
  onChannelUpdate,
  onChannelDelete,
  onOpenChannels,
  isLoading = false,
  isReadOnlyDisabled = false
}: ChatAreaProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageId = useMemo(() =>
    messages.length > 0 ? messages[messages.length - 1].id : null,
    [messages]
  );

  // Scroll to bottom function that targets the correct viewport element
  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      // Find the viewport element within the ScrollArea
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, []);

  // Scroll to bottom when lastMessageId changes (new message arrives)
  useEffect(() => {
    if (lastMessageId) {
      const timeoutId = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [lastMessageId, scrollToBottom]);

  // Scroll to bottom when switching channels (activeChannel changes)
  useEffect(() => {
    if (activeChannel && messages.length > 0) {
      const timeoutId = setTimeout(scrollToBottom, 200); // Slightly longer delay for channel switch
      return () => clearTimeout(timeoutId);
    }
  }, [activeChannel?.id, scrollToBottom]);

  const { handleReaction } = useReactionOperations({
    onMessageUpdate: onMessageUpdate
  });

  return (
    <div className="h-full flex flex-col bg-white lg:border lg:border-gray-200 lg:rounded-lg lg:shadow-sm overflow-hidden">
      {activeChannel ? (
        <>
          {/* Fixed Header */}
          <div className="flex-shrink-0 border-b border-gray-200">
            <ChatHeader
              channel={activeChannel}
              onChannelUpdate={onChannelUpdate}
              onChannelDelete={onChannelDelete}
              onOpenChannels={onOpenChannels}
            />
          </div>

          {isLoading ? (
            /* Loading State */
            <div className="flex-1 flex items-center justify-center">
              <LoadingQuotes />
            </div>
          ) : (
            <>
              {/* Scrollable Messages Area */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                  <div className="p-6">
                    <MessageList
                      messages={messages}
                      onReaction={handleReaction}
                      highlightMessageId={lastMessageId}
                      onMessageUpdate={onMessageUpdate}
                      isPublicChannel={activeChannel?.is_public || false}
                      activeChannelId={activeChannel.id}
                    />
                  </div>
                </ScrollArea>
              </div>

              {/* Fixed Input Area or Read-only Message */}
              {isReadOnlyDisabled ? (
                <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
                    <Lock className="h-4 w-4" />
                    <span>
                      This channel is read-only. Only {activeChannel.is_public ? 'platform admins' : 'workspace admins and owners'} can post messages.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
                  <MessageInput
                    channelName={activeChannel.name}
                    onSendMessage={onSendMessage}
                    activeChannel={activeChannel}
                  />
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
          <div className="max-w-md">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Community</h1>
            <p className="text-sm text-gray-500">Select a channel to start chatting</p>
          </div>
        </div>
      )}
    </div>
  );
}
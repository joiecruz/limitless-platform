import { ScrollArea } from "@/components/ui/scroll-area";
import { Channel, Message } from "@/types/community";
import { useEffect, useRef, useMemo, useCallback, useState } from "react";
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
  totalUnreadCount?: number;
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
  isReadOnlyDisabled = false,
  totalUnreadCount = 0
}: ChatAreaProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [editingMessage, setEditingMessage] = useState<{id: string, content: string} | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile keyboard detection
  useEffect(() => {
    if (!isMobile) return;

    const initialHeight = window.visualViewport?.height || window.innerHeight;

    const handleViewportChange = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const heightDiff = initialHeight - currentHeight;

      // If height difference is significant (>150px), keyboard is open
      setIsKeyboardOpen(heightDiff > 150);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      return () => window.visualViewport?.removeEventListener('resize', handleViewportChange);
    } else {
      window.addEventListener('resize', handleViewportChange);
      return () => window.removeEventListener('resize', handleViewportChange);
    }
  }, [isMobile]);

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

  const handleStartEdit = (messageId: string, content: string) => {
    setEditingMessage({ id: messageId, content });
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
  };

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
              totalUnreadCount={totalUnreadCount}
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
              <div
                className="flex-1 overflow-hidden"
                style={isMobile && isKeyboardOpen ? {
                  paddingBottom: '80px' // Space for fixed input area
                } : {}}
              >
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                  <div className="p-6">
                    <MessageList
                      messages={messages}
                      onReaction={handleReaction}
                      highlightMessageId={lastMessageId}
                      onMessageUpdate={onMessageUpdate}
                      isPublicChannel={activeChannel?.is_public || false}
                      activeChannelId={activeChannel.id}
                      editingMessageId={editingMessage?.id || null}
                      onStartEdit={handleStartEdit}
                    />
                  </div>
                </ScrollArea>
              </div>

              {/* Input Area - Fixed on mobile when keyboard is open */}
              {isReadOnlyDisabled ? (
                <div
                  className={`flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50 ${
                    isMobile && isKeyboardOpen
                      ? 'fixed bottom-0 left-0 right-0 z-50 shadow-lg'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
                    <Lock className="h-4 w-4" />
                    <span>
                      This channel is read-only. Only {activeChannel.is_public ? 'platform admins' : 'workspace admins and owners'} can post messages.
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className={`flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50 ${
                    isMobile && isKeyboardOpen
                      ? 'fixed bottom-0 left-0 right-0 z-50 shadow-lg'
                      : ''
                  }`}
                >
                  <MessageInput
                    channelName={activeChannel.name}
                    onSendMessage={onSendMessage}
                    activeChannel={activeChannel}
                    editingMessage={editingMessage}
                    onCancelEdit={handleCancelEdit}
                    onUpdateMessage={onMessageUpdate}
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
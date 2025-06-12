import { Message } from "@/types/community";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageReactions } from "./MessageReactions";
import { MessageActions } from "./MessageActions";
import { format } from "date-fns";
import { useEffect, useRef, useState, memo, forwardRef, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MessageListProps {
  messages: Message[];
  onReaction: (messageId: string, emoji: string) => void;
  highlightMessageId: string | null;
  onMessageUpdate?: (updatedMessage: Message) => void;
  isPublicChannel?: boolean;
  activeChannelId?: string;
  editingMessageId?: string | null;
  onStartEdit?: (messageId: string, content: string) => void;
}

interface MessageItemProps {
  message: Message;
  onReaction: (messageId: string, emoji: string) => void;
  isHighlighted: boolean;
  onMessageUpdate?: (updatedMessage: Message) => void;
  isPublicChannel?: boolean;
  isEditing?: boolean;
  onStartEdit?: (messageId: string, content: string) => void;
  isPendingDeletion?: boolean;
  onMessageMarkDeleted?: (messageId: string) => void;
  onMessageRestore?: (messageId: string) => void;
}

const MessageItem = memo(forwardRef<HTMLDivElement, MessageItemProps>(({
  message,
  onReaction,
  isHighlighted,
  onMessageUpdate,
  isPublicChannel,
  isEditing,
  onStartEdit,
  isPendingDeletion,
  onMessageMarkDeleted,
  onMessageRestore
}, ref) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  // Get current user ID
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  const handleEditStart = () => {
    if (onStartEdit) {
      onStartEdit(message.id, message.content);
    }
  };

  const getDisplayName = (profile: Message['profiles']) => {
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
    return "Anonymous";
  };

  const getInitials = (profile: Message['profiles']) => {
    if (!profile) return '??';
    if (profile.first_name || profile.last_name) {
      return `${(profile.first_name?.[0] || '').toUpperCase()}${(profile.last_name?.[0] || '').toUpperCase()}`;
    }
    return '?';
  };

  return (
    <div
      ref={(el) => {
        // Handle both the forwarded ref and our internal messageRef
        if (typeof ref === 'function') {
          ref(el);
        } else if (ref) {
          ref.current = el;
        }
      }}
      className={`group flex items-start gap-3 p-2 rounded-lg transition-all duration-500 hover:bg-gray-50 ${
        isHighlighted ? 'bg-primary-50' : ''
      } ${isPendingDeletion ? 'opacity-50 bg-red-50' : ''}`}
    >
      <Avatar className={`h-8 w-8 ${isPendingDeletion ? 'opacity-50' : ''}`}>
        <AvatarImage
          src={message.profiles?.avatar_url}
          alt={getDisplayName(message.profiles)}
        />
        <AvatarFallback>
          {getInitials(message.profiles)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className={`font-semibold text-sm ${isPendingDeletion ? 'line-through opacity-70' : ''}`}>
            {getDisplayName(message.profiles)}
          </span>
          <span className={`text-xs text-gray-500 ${isPendingDeletion ? 'opacity-70' : ''}`}>
            {format(new Date(message.updated_at || message.created_at), "MMM d, h:mm a")}
          </span>
          {message.updated_at && message.updated_at !== message.created_at && (
            <span className={`text-xs text-gray-400 italic ${isPendingDeletion ? 'opacity-70' : ''}`}>
              (edited)
            </span>
          )}
          {isPendingDeletion && (
            <span className="text-xs text-red-500 italic">
              (deleting...)
            </span>
          )}
        </div>

        {/* Message content or editing interface */}
        {isEditing ? (
          <div className="bg-gray-100 px-3 py-2 rounded-lg">
            <p className="text-sm text-gray-500 italic">(editing)</p>
          </div>
        ) : (
          <p className={`text-sm text-gray-700 ${isPendingDeletion ? 'line-through opacity-70' : ''}`}>
            {message.content}
          </p>
        )}

        {message.image_url && (
          <img
            src={message.image_url}
            alt="Message attachment"
            className={`max-w-sm rounded-lg border ${isPendingDeletion ? 'opacity-50' : ''}`}
          />
        )}
        <MessageReactions
          messageId={message.id}
          reactions={message.message_reactions || []}
          onReaction={isPendingDeletion ? () => {} : onReaction}
        />
      </div>
      {/* Actions menu - only visible on hover */}
      <div className="flex-shrink-0">
        <MessageActions
          message={message}
          onMessageUpdate={onMessageUpdate}
          onEditStart={handleEditStart}
          isEditing={isEditing}
          isPublicChannel={isPublicChannel}
          onMessageMarkDeleted={onMessageMarkDeleted}
          onMessageRestore={onMessageRestore}
        />
      </div>
    </div>
  );
}));

MessageItem.displayName = 'MessageItem';

export function MessageList({
  messages,
  onReaction,
  highlightMessageId,
  onMessageUpdate,
  isPublicChannel,
  activeChannelId,
  editingMessageId,
  onStartEdit
}: MessageListProps) {
  const highlightedMessageRef = useRef<HTMLDivElement>(null);
  const [currentHighlightId, setCurrentHighlightId] = useState<string | null>(null);
  const [pendingDeletions, setPendingDeletions] = useState<Set<string>>(new Set());
  const timeoutRef = useRef<NodeJS.Timeout>();

  // STRICT CHANNEL FILTERING: Only show messages that belong to the active channel
  const filteredMessages = useMemo(() => {
    if (!activeChannelId) {
      console.warn('MessageList: No active channel ID provided, showing empty list');
      return [];
    }

    const channelMessages = messages.filter(message => {
      const belongsToChannel = message.channel_id === activeChannelId;

      if (!belongsToChannel) {
        console.warn(`MessageList: Filtering out message ${message.id} from channel ${message.channel_id} (active: ${activeChannelId})`);
      }

      return belongsToChannel;
    });

    console.log(`MessageList: Displaying ${channelMessages.length} messages for channel ${activeChannelId}`);
    return channelMessages;
  }, [messages, activeChannelId]);

  const handleMessageMarkDeleted = (messageId: string) => {
    setPendingDeletions(prev => new Set(prev.add(messageId)));
  };

  const handleMessageRestore = (messageId: string) => {
    setPendingDeletions(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  };

  useEffect(() => {
    if (highlightMessageId) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set the new highlight
      setCurrentHighlightId(highlightMessageId);

      // Set timeout to remove highlight after 3 seconds
      timeoutRef.current = setTimeout(() => {
        setCurrentHighlightId(null);
      }, 3000);
    }

    // Cleanup timeout on unmount or when highlightMessageId changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [highlightMessageId]);

  useEffect(() => {
    if (currentHighlightId && highlightedMessageRef.current) {
      highlightedMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentHighlightId]);

  // If no active channel, show empty state
  if (!activeChannelId) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        <p>No channel selected</p>
      </div>
    );
  }

  // If no messages for this channel, show appropriate message
  if (filteredMessages.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        <p>No messages in this channel yet. Be the first to say something!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredMessages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          onReaction={onReaction}
          isHighlighted={message.id === currentHighlightId}
          onMessageUpdate={onMessageUpdate}
          isPublicChannel={isPublicChannel}
          isEditing={message.id === editingMessageId}
          onStartEdit={onStartEdit}
          isPendingDeletion={pendingDeletions.has(message.id)}
          onMessageMarkDeleted={handleMessageMarkDeleted}
          onMessageRestore={handleMessageRestore}
          ref={message.id === currentHighlightId ? highlightedMessageRef : undefined}
        />
      ))}
    </div>
  );
}
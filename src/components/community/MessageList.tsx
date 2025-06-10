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
}

interface MessageItemProps {
  message: Message;
  onReaction: (messageId: string, emoji: string) => void;
  isHighlighted: boolean;
  onMessageUpdate?: (updatedMessage: Message) => void;
  isPublicChannel?: boolean;
}

const MessageItem = memo(forwardRef<HTMLDivElement, MessageItemProps>(({ message, onReaction, isHighlighted, onMessageUpdate, isPublicChannel }, ref) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
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

  // Reset edit content when message changes
  useEffect(() => {
    setEditContent(message.content);
  }, [message.content]);

  const handleEditStart = () => {
    setIsEditing(true);
    setEditContent(message.content);
  };

  const handleEditSave = async () => {
    if (!editContent.trim() || editContent === message.content) {
      setIsEditing(false);
      setEditContent(message.content);
      return;
    }

    try {
      const { error } = await supabase
        .from('messages')
        .update({
          content: editContent.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', message.id)
        .eq('user_id', currentUserId); // Ensure user can only edit their own messages

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message edited successfully",
      });

      setIsEditing(false);
      // Real-time subscription will handle the update automatically
    } catch (error) {
      console.error('Error editing message:', error);
      toast({
        title: "Error",
        description: "Failed to edit message",
        variant: "destructive",
      });
      setEditContent(message.content);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditContent(message.content);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
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
      ref={ref}
      className={`group flex items-start gap-3 p-2 rounded-lg transition-colors duration-500 hover:bg-gray-50 ${
        isHighlighted ? 'bg-primary-50' : ''
      }`}
    >
      <Avatar className="h-8 w-8">
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
          <span className="font-semibold text-sm">
            {getDisplayName(message.profiles)}
          </span>
          <span className="text-xs text-gray-500">
            {format(new Date(message.updated_at || message.created_at), "MMM d, h:mm a")}
          </span>
          {message.updated_at && message.updated_at !== message.created_at && (
            <span className="text-xs text-gray-400 italic">
              (edited)
            </span>
          )}
        </div>

        {/* Message content or editing interface */}
        {isEditing ? (
          <div className="flex gap-2 items-center">
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
              autoFocus
            />
            <Button size="sm" onClick={handleEditSave}>Save</Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleEditCancel}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <p className="text-sm text-gray-700">{message.content}</p>
        )}

        {message.image_url && (
          <img
            src={message.image_url}
            alt="Message attachment"
            className="max-w-sm rounded-lg border"
          />
        )}
        <MessageReactions
          messageId={message.id}
          reactions={message.message_reactions || []}
          onReaction={onReaction}
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
  activeChannelId
}: MessageListProps) {
  const highlightedMessageRef = useRef<HTMLDivElement>(null);
  const [currentHighlightId, setCurrentHighlightId] = useState<string | null>(null);
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
          ref={message.id === currentHighlightId ? highlightedMessageRef : undefined}
        />
      ))}
    </div>
  );
}
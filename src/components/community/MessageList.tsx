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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

interface UserProfile {
  id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string;
  avatar_url: string | null;
}

// Function to parse message content and validate mentions against real users
const parseMessageContent = (content: string, users: UserProfile[]) => {
  // Regex to match @mentions (@ followed by non-space characters until a space or end of string)
  const mentionRegex = /@([^\s]+)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = mentionRegex.exec(content)) !== null) {
    // Add text before the mention
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex, match.index)
      });
    }

    const mentionText = match[1]; // Username or name part

    // Find matching user by username or full name
    const matchedUser = users.find(user => {
      const username = user.username?.toLowerCase();
      const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim().toLowerCase();
      const mentionLower = mentionText.toLowerCase();

      return username === mentionLower || fullName === mentionLower;
    });

    if (matchedUser) {
      // Valid mention - add as mention type
      parts.push({
        type: 'mention',
        content: match[0], // Full match including @
        username: match[1], // Just the username part
        user: matchedUser
      });
    } else {
      // Invalid mention - treat as regular text
      parts.push({
        type: 'text',
        content: match[0]
      });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last mention
  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.slice(lastIndex)
    });
  }

  return parts;
};

// UserProfilePopup component
const UserProfilePopup = ({ user }: { user: UserProfile }) => {
  const getDisplayName = () => {
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user.username || 'Anonymous';
  };

  const getInitials = () => {
    if (user.first_name || user.last_name) {
      return `${(user.first_name?.[0] || '').toUpperCase()}${(user.last_name?.[0] || '').toUpperCase()}`;
    }
    return user.username?.[0]?.toUpperCase() || '?';
  };

  return (
    <div className="p-0 min-w-[280px] bg-white rounded-lg overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#393CA0] to-[#4A4DB8] p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-4 border-white/20 shadow-lg">
            <AvatarImage src={user.avatar_url || undefined} alt={getDisplayName()} />
            <AvatarFallback className="bg-white/10 text-white text-lg font-semibold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="text-white">
            <h3 className="font-bold text-xl leading-tight">{getDisplayName()}</h3>
            {user.username && (
              <p className="text-white/70 text-sm mt-1">@{user.username}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Component to render parsed message content
const MessageContent = ({ content, users, isPendingDeletion }: { content: string; users: UserProfile[]; isPendingDeletion?: boolean }) => {
  const parsedContent = parseMessageContent(content, users);

  return (
    <p className={`text-sm text-gray-700 ${isPendingDeletion ? 'line-through opacity-70' : ''}`}>
      {parsedContent.map((part, index) => {
        if (part.type === 'mention' && part.user) {
          return (
            <Popover key={index}>
              <PopoverTrigger asChild>
                <span className="text-blue-600 font-medium bg-blue-50 px-1 rounded cursor-pointer hover:bg-blue-100 transition-colors">
                  {part.content}
                </span>
              </PopoverTrigger>
              <PopoverContent className="p-0" side="top" align="start">
                <UserProfilePopup user={part.user} />
              </PopoverContent>
            </Popover>
          );
        }
        return part.content;
      })}
    </p>
  );
};

const MessageItem = memo(forwardRef<HTMLDivElement, MessageItemProps & { users: UserProfile[] }>(({
  message,
  onReaction,
  isHighlighted,
  onMessageUpdate,
  isPublicChannel,
  isEditing,
  onStartEdit,
  isPendingDeletion,
  onMessageMarkDeleted,
  onMessageRestore,
  users
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
          <MessageContent content={message.content} users={users} isPendingDeletion={isPendingDeletion} />
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
  const [users, setUsers] = useState<UserProfile[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Fetch users for mention validation
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, first_name, last_name, email, avatar_url');

      if (!error && data) {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);

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
          users={users}
          ref={message.id === currentHighlightId ? highlightedMessageRef : undefined}
        />
      ))}
    </div>
  );
}
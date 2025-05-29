import { Message } from "@/types/community";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageReactions } from "./MessageReactions";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

interface MessageListProps {
  messages: Message[];
  onReaction: (messageId: string, emoji: string) => void;
  highlightMessageId: string | null;
}

export function MessageList({ messages, onReaction, highlightMessageId }: MessageListProps) {
  const highlightedMessageRef = useRef<HTMLDivElement>(null);
  const [currentHighlightId, setCurrentHighlightId] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

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
    <div className="space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          ref={message.id === currentHighlightId ? highlightedMessageRef : null}
          className={`group flex items-start gap-3 transition-colors duration-500 ${
            message.id === currentHighlightId ? 'bg-primary-50' : ''
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
                {format(new Date(message.created_at), "MMM d, h:mm a")}
              </span>
            </div>
            <p className="text-sm text-gray-700">{message.content}</p>
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
        </div>
      ))}
    </div>
  );
}
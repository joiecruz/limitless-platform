import { Message } from "@/types/community";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageReactions } from "./MessageReactions";
import { format } from "date-fns";

interface MessageListProps {
  messages: Message[];
  onReaction: (messageId: string, emoji: string) => void;
}

export function MessageList({ messages, onReaction }: MessageListProps) {
  const getDisplayName = (profile: Message['profiles']) => {
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
    return profile?.username || "Anonymous";
  };

  const getInitials = (profile: Message['profiles']) => {
    if (!profile) return '??';
    if (profile.first_name || profile.last_name) {
      return `${(profile.first_name?.[0] || '').toUpperCase()}${(profile.last_name?.[0] || '').toUpperCase()}`;
    }
    return profile.username?.[0]?.toUpperCase() || '?';
  };

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div key={message.id} className="group flex items-start gap-3">
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
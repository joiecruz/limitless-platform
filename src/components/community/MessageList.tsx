import { Message } from "@/types/community";
import { Avatar } from "@/components/ui/avatar";
import { MessageReactions } from "./MessageReactions";
import { format } from "date-fns";

interface MessageListProps {
  messages: Message[];
  onReaction: (messageId: string, emoji: string) => void;
}

export function MessageList({ messages, onReaction }: MessageListProps) {
  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div key={message.id} className="group flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <img
              src={message.profiles?.avatar_url || "/placeholder.svg"}
              alt={message.profiles?.username || "User"}
              className="object-cover"
            />
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">
                {message.profiles?.username || "Anonymous"}
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
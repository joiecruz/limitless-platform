import { MessageReaction } from "@/types/community";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const EMOJI_LIST = ["👍", "❤️", "😂", "🎉", "🤔", "😢", "🔥", "👀"];

interface MessageReactionsProps {
  messageId: string;
  reactions: MessageReaction[];
  onReaction: (messageId: string, emoji: string) => void;
}

export function MessageReactions({ messageId, reactions, onReaction }: MessageReactionsProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  // Group reactions by emoji and track user IDs who reacted
  const reactionGroups = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = {
        count: 0,
        userIds: new Set(),
      };
    }
    acc[reaction.emoji].count++;
    acc[reaction.emoji].userIds.add(reaction.user_id);
    return acc;
  }, {} as Record<string, { count: number; userIds: Set<string> }>);

  const hasUserReacted = (emoji: string) => {
    return currentUserId && reactionGroups[emoji]?.userIds.has(currentUserId);
  };

  return (
    <div className="flex items-center space-x-2 mt-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Smile className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-2" align="start">
          <div className="flex flex-wrap gap-2">
            {EMOJI_LIST.map((emoji) => (
              <button
                key={emoji}
                onClick={() => onReaction(messageId, emoji)}
                className="hover:bg-gray-100 p-2 rounded"
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex gap-1">
        {Object.entries(reactionGroups).map(([emoji, { count }]) => (
          <button
            key={emoji}
            onClick={() => onReaction(messageId, emoji)}
            className={`rounded px-2 py-1 text-sm transition-colors ${
              hasUserReacted(emoji)
                ? 'bg-primary/10 hover:bg-primary/20'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {emoji} {count}
          </button>
        ))}
      </div>
    </div>
  );
}
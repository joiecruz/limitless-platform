import { MessageReaction } from "@/types/community";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const EMOJI_LIST = ["👍", "❤️", "😂", "🎉", "🤔", "😢", "🔥", "👀"];

interface MessageReactionsProps {
  messageId: string;
  reactions: MessageReaction[];
  onReaction: (messageId: string, emoji: string) => void;
}

export function MessageReactions({ messageId, reactions, onReaction }: MessageReactionsProps) {
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
        {Object.entries(
          reactions.reduce((acc, reaction) => {
            acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        ).map(([emoji, count]) => (
          <button
            key={emoji}
            onClick={() => onReaction(messageId, emoji)}
            className="bg-gray-100 hover:bg-gray-200 rounded px-2 py-1 text-sm"
          >
            {emoji} {count}
          </button>
        ))}
      </div>
    </div>
  );
}
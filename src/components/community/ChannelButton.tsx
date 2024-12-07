import { Hash, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Channel } from "@/types/community";

interface ChannelButtonProps {
  channel: Channel;
  isPrivate?: boolean;
  isActive: boolean;
  unreadCount: number;
  onClick: () => void;
}

export function ChannelButton({
  channel,
  isPrivate = false,
  isActive,
  unreadCount,
  onClick,
}: ChannelButtonProps) {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start text-gray-600 hover:text-primary-600 hover:bg-primary-50 relative ${
        isActive ? "bg-primary-50 text-primary-600" : ""
      }`}
      onClick={onClick}
    >
      {isPrivate ? (
        <Lock className="h-4 w-4 mr-2" />
      ) : (
        <Hash className="h-4 w-4 mr-2" />
      )}
      {channel.name}
      {unreadCount > 0 && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </Button>
  );
}
import { Hash } from "lucide-react";
import { Channel } from "@/types/community";

interface ChatHeaderProps {
  channel: Channel;
}

export function ChatHeader({ channel }: ChatHeaderProps) {
  return (
    <div className="border-b px-6 py-4">
      <div className="flex items-center">
        <Hash className="h-5 w-5 text-gray-400 mr-2" />
        <h1 className="text-xl font-semibold text-gray-900">{channel.name}</h1>
      </div>
      {channel.description && (
        <p className="text-sm text-gray-500 mt-1">{channel.description}</p>
      )}
    </div>
  );
}
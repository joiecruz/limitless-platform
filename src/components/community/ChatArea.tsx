import { Hash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Channel } from "@/types/community";

interface ChatAreaProps {
  activeChannel: Channel | null;
}

export function ChatArea({ activeChannel }: ChatAreaProps) {
  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Channel Header */}
      {activeChannel && (
        <div className="border-b px-6 py-4">
          <div className="flex items-center">
            <Hash className="h-5 w-5 text-gray-500 mr-2" />
            <h1 className="text-xl font-semibold">{activeChannel.name}</h1>
          </div>
          {activeChannel.description && (
            <p className="text-sm text-gray-500 mt-1">{activeChannel.description}</p>
          )}
        </div>
      )}

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {/* Message components will go here */}
          <p className="text-gray-500 text-center">No messages yet</p>
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Message #general"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button>Send</Button>
        </div>
      </div>
    </div>
  );
}
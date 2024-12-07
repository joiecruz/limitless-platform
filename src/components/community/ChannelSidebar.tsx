import { Hash, Lock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Channel } from "@/types/community";

interface ChannelSidebarProps {
  publicChannels: Channel[];
  privateChannels: Channel[];
  activeChannel: Channel | null;
  onChannelSelect: (channel: Channel) => void;
}

export function ChannelSidebar({
  publicChannels,
  privateChannels,
  activeChannel,
  onChannelSelect,
}: ChannelSidebarProps) {
  return (
    <div className="w-64 bg-gray-50 border-r flex-shrink-0">
      <ScrollArea className="h-full">
        <div className="p-4">
          <h2 className="text-gray-500 uppercase text-xs font-semibold mb-2">Public Channels</h2>
          <div className="space-y-1">
            {publicChannels.map((channel) => (
              <Button
                key={channel.id}
                variant="ghost"
                className={`w-full justify-start text-gray-600 hover:text-primary-600 hover:bg-primary-50 ${
                  activeChannel?.id === channel.id ? "bg-primary-50 text-primary-600" : ""
                }`}
                onClick={() => onChannelSelect(channel)}
              >
                <Hash className="h-4 w-4 mr-2" />
                {channel.name}
              </Button>
            ))}
          </div>

          <Separator className="my-4" />

          <h2 className="text-gray-500 uppercase text-xs font-semibold mb-2">Private Channels</h2>
          <div className="space-y-1">
            {privateChannels.map((channel) => (
              <Button
                key={channel.id}
                variant="ghost"
                className={`w-full justify-start text-gray-600 hover:text-primary-600 hover:bg-primary-50 ${
                  activeChannel?.id === channel.id ? "bg-primary-50 text-primary-600" : ""
                }`}
                onClick={() => onChannelSelect(channel)}
              >
                <Lock className="h-4 w-4 mr-2" />
                {channel.name}
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
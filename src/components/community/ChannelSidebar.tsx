import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Channel } from "@/types/community";
import { ChannelButton } from "./ChannelButton";
import { CreateChannelDialog } from "./CreateChannelDialog";
import { useChannelNotifications } from "@/hooks/useChannelNotifications";

interface ChannelSidebarProps {
  publicChannels: Channel[];
  privateChannels: Channel[];
  activeChannel: Channel | null;
  onChannelSelect: (channel: Channel) => void;
  onCreatePrivateChannel: (name: string, workspaceId: string) => void;
  workspaceId: string;
}

export function ChannelSidebar({
  publicChannels,
  privateChannels,
  activeChannel,
  onChannelSelect,
  onCreatePrivateChannel,
  workspaceId,
}: ChannelSidebarProps) {
  const { unreadCounts } = useChannelNotifications(activeChannel);

  return (
    <div className="w-64 bg-gray-50 border-r flex-shrink-0 h-full">
      <ScrollArea className="h-full">
        <div className="p-4">
          <h2 className="text-gray-500 uppercase text-xs font-semibold mb-2">
            Public Channels
          </h2>
          <div className="space-y-1">
            {publicChannels.map((channel) => (
              <ChannelButton
                key={channel.id}
                channel={channel}
                isActive={activeChannel?.id === channel.id}
                unreadCount={unreadCounts[channel.id] || 0}
                onClick={() => onChannelSelect(channel)}
              />
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between mb-2">
            <h2 className="text-gray-500 uppercase text-xs font-semibold">
              Private Channels
            </h2>
            <CreateChannelDialog 
              onCreateChannel={onCreatePrivateChannel} 
              workspaceId={workspaceId}
            />
          </div>
          <div className="space-y-1">
            {privateChannels.map((channel) => (
              <ChannelButton
                key={channel.id}
                channel={channel}
                isPrivate
                isActive={activeChannel?.id === channel.id}
                unreadCount={unreadCounts[channel.id] || 0}
                onClick={() => onChannelSelect(channel)}
                className="flex-grow"
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
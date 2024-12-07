import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Channel } from "@/types/community";
import { ChannelButton } from "./ChannelButton";
import { CreateChannelDialog } from "./CreateChannelDialog";
import { useChannelNotifications } from "@/hooks/useChannelNotifications";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChannelSidebarProps {
  publicChannels: Channel[];
  privateChannels: Channel[];
  activeChannel: Channel | null;
  onChannelSelect: (channel: Channel) => void;
  onCreatePrivateChannel: (name: string, workspaceId: string) => void;
}

export function ChannelSidebar({
  publicChannels,
  privateChannels,
  activeChannel,
  onChannelSelect,
  onCreatePrivateChannel,
}: ChannelSidebarProps) {
  const { unreadCounts } = useChannelNotifications(activeChannel);
  const { toast } = useToast();

  const handleDeleteChannel = async (channelId: string) => {
    const { error } = await supabase
      .from("channels")
      .delete()
      .eq("id", channelId);

    if (error) {
      console.error("Error deleting channel:", error);
      toast({
        title: "Error",
        description: "Failed to delete channel",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Channel deleted successfully",
    });
  };

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
            <CreateChannelDialog onCreateChannel={onCreatePrivateChannel} />
          </div>
          <div className="space-y-1">
            {privateChannels.map((channel) => (
              <div key={channel.id} className="flex items-center group">
                <ChannelButton
                  channel={channel}
                  isPrivate
                  isActive={activeChannel?.id === channel.id}
                  unreadCount={unreadCounts[channel.id] || 0}
                  onClick={() => onChannelSelect(channel)}
                  className="flex-grow"
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Channel</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete the channel "{channel.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleDeleteChannel(channel.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
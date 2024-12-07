import { Hash, Lock, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Channel } from "@/types/community";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface ChannelSidebarProps {
  publicChannels: Channel[];
  privateChannels: Channel[];
  activeChannel: Channel | null;
  onChannelSelect: (channel: Channel) => void;
  onCreatePrivateChannel: (name: string, workspaceId: string) => void;
}

interface UnreadCount {
  [key: string]: number;
}

export function ChannelSidebar({
  publicChannels,
  privateChannels,
  activeChannel,
  onChannelSelect,
  onCreatePrivateChannel,
}: ChannelSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [unreadCounts, setUnreadCounts] = useState<UnreadCount>({});
  const [lastVisited, setLastVisited] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Load last visited timestamps from localStorage
    const storedLastVisited = localStorage.getItem('channelLastVisited');
    if (storedLastVisited) {
      setLastVisited(JSON.parse(storedLastVisited));
    }

    // Subscribe to new messages
    const subscription = supabase
      .channel('public:messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const channelId = payload.new.channel_id;
          setUnreadCounts(prev => ({
            ...prev,
            [channelId]: (prev[channelId] || 0) + 1
          }));
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Update last visited time when changing channels
    if (activeChannel) {
      const now = new Date().toISOString();
      setLastVisited(prev => ({
        ...prev,
        [activeChannel.id]: now
      }));
      localStorage.setItem('channelLastVisited', JSON.stringify({
        ...lastVisited,
        [activeChannel.id]: now
      }));
      // Reset unread count for this channel
      setUnreadCounts(prev => ({
        ...prev,
        [activeChannel.id]: 0
      }));
    }
  }, [activeChannel]);

  const handleCreateChannel = () => {
    if (newChannelName.trim()) {
      // For demo purposes, using a fixed workspace ID
      onCreatePrivateChannel(newChannelName, "your-workspace-id");
      setNewChannelName("");
      setIsOpen(false);
    }
  };

  const renderChannelButton = (channel: Channel, isPrivate: boolean = false) => (
    <Button
      key={channel.id}
      variant="ghost"
      className={`w-full justify-start text-gray-600 hover:text-primary-600 hover:bg-primary-50 relative ${
        activeChannel?.id === channel.id ? "bg-primary-50 text-primary-600" : ""
      }`}
      onClick={() => onChannelSelect(channel)}
    >
      {isPrivate ? (
        <Lock className="h-4 w-4 mr-2" />
      ) : (
        <Hash className="h-4 w-4 mr-2" />
      )}
      {channel.name}
      {unreadCounts[channel.id] > 0 && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCounts[channel.id]}
        </span>
      )}
    </Button>
  );

  return (
    <div className="w-64 bg-gray-50 border-r flex-shrink-0">
      <ScrollArea className="h-full">
        <div className="p-4">
          <h2 className="text-gray-500 uppercase text-xs font-semibold mb-2">Public Channels</h2>
          <div className="space-y-1">
            {publicChannels.map((channel) => renderChannelButton(channel))}
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between mb-2">
            <h2 className="text-gray-500 uppercase text-xs font-semibold">Private Channels</h2>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 hover:bg-primary-50 hover:text-primary-600"
                  title="Create Private Channel"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Private Channel</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="Channel name"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                  />
                  <Button onClick={handleCreateChannel} disabled={!newChannelName.trim()}>
                    Create Channel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-1">
            {privateChannels.map((channel) => renderChannelButton(channel, true))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
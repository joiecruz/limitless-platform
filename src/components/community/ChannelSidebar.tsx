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
import { useState } from "react";
import { Input } from "@/components/ui/input";

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
  const [isOpen, setIsOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");

  const handleCreateChannel = () => {
    if (newChannelName.trim()) {
      // For demo purposes, using a fixed workspace ID
      onCreatePrivateChannel(newChannelName, "your-workspace-id");
      setNewChannelName("");
      setIsOpen(false);
    }
  };

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
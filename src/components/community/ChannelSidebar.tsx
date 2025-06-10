import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Channel } from "@/types/community";
import { ChannelButton } from "./ChannelButton";
import { CreateChannelDialog } from "./CreateChannelDialog";
import { useChannelNotifications } from "@/hooks/useChannelNotifications";
import { Hash, Plus, Lock, Unlock } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useGlobalRole } from "@/hooks/useGlobalRole";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [isCreatePrivateDialogOpen, setIsCreatePrivateDialogOpen] = useState(false);
  const [isCreatePublicDialogOpen, setIsCreatePublicDialogOpen] = useState(false);
  const [newPrivateChannelName, setNewPrivateChannelName] = useState("");
  const [newPublicChannelName, setNewPublicChannelName] = useState("");
  const [publicChannelDescription, setPublicChannelDescription] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { canManagePublicChannels } = useGlobalRole();
  const { toast } = useToast();

  const handleCreatePrivateChannel = async () => {
    if (!newPrivateChannelName.trim()) {
      toast({
        title: "Error",
        description: "Channel name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await onCreatePrivateChannel(newPrivateChannelName.trim(), workspaceId);
      setIsCreatePrivateDialogOpen(false);
      setNewPrivateChannelName("");
    } catch (error) {
      console.error('Error creating private channel:', error);
    }
  };

  const handleCreatePublicChannel = async () => {
    if (!newPublicChannelName.trim()) {
      toast({
        title: "Error",
        description: "Channel name is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('channels')
        .insert({
          name: newPublicChannelName.trim(),
          description: publicChannelDescription.trim() || null,
          is_public: true,
          workspace_id: null,
          read_only: isReadOnly
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: `Public channel "${newPublicChannelName}" created successfully`,
      });

      setIsCreatePublicDialogOpen(false);
      setNewPublicChannelName("");
      setPublicChannelDescription("");
      setIsReadOnly(false);
    } catch (error) {
      console.error('Error creating public channel:', error);
      toast({
        title: "Error",
        description: "Failed to create public channel",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Channels</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Public Channels */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                Public Channels
              </h3>
              {canManagePublicChannels && (
                <Dialog open={isCreatePublicDialogOpen} onOpenChange={setIsCreatePublicDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Create Public Channel</DialogTitle>
                      <DialogDescription>
                        Create a new public channel visible across the platform.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="public-channel-name">Channel Name *</Label>
                        <Input
                          id="public-channel-name"
                          value={newPublicChannelName}
                          onChange={(e) => setNewPublicChannelName(e.target.value)}
                          placeholder="e.g. announcements, general, help"
                          maxLength={50}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="public-channel-description">Description</Label>
                        <Textarea
                          id="public-channel-description"
                          value={publicChannelDescription}
                          onChange={(e) => setPublicChannelDescription(e.target.value)}
                          placeholder="Brief description of the channel purpose..."
                          maxLength={200}
                          rows={3}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="read-only-toggle">Read-only Channel</Label>
                          <div className="text-xs text-gray-500">
                            Only admins and superadmins can post messages
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isReadOnly ? (
                            <Lock className="h-4 w-4 text-orange-600" />
                          ) : (
                            <Unlock className="h-4 w-4 text-green-600" />
                          )}
                          <Switch
                            id="read-only-toggle"
                            checked={isReadOnly}
                            onCheckedChange={setIsReadOnly}
                          />
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsCreatePublicDialogOpen(false)}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreatePublicChannel} disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Channel"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <div className="space-y-1">
              {publicChannels.length === 0 ? (
                <p className="text-sm text-gray-500 py-2">No public channels available</p>
              ) : (
                publicChannels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => onChannelSelect(channel)}
                    className={`w-full text-left px-2 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                      activeChannel?.id === channel.id
                        ? "bg-primary-50 text-primary-700 border border-primary-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Hash className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{channel.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Private Channels */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                Private Channels
              </h3>
              {workspaceId && (
                <Dialog open={isCreatePrivateDialogOpen} onOpenChange={setIsCreatePrivateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create Private Channel</DialogTitle>
                      <DialogDescription>
                        Enter the name of the new private channel for this workspace
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="private-name">Channel Name *</Label>
                        <Input
                          id="private-name"
                          value={newPrivateChannelName}
                          onChange={(e) => setNewPrivateChannelName(e.target.value)}
                          placeholder="e.g. team-chat, project-updates"
                          maxLength={50}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsCreatePrivateDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreatePrivateChannel}>
                        Create Channel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <div className="space-y-1 px-2">
              {privateChannels.length > 0 ? (
                privateChannels.map((channel) => (
                  <ChannelButton
                    key={channel.id}
                    channel={channel}
                    isPrivate={true}
                    isActive={activeChannel?.id === channel.id}
                    unreadCount={unreadCounts[channel.id] || 0}
                    onClick={() => onChannelSelect(channel)}
                  />
                ))
              ) : (
                <div className="px-2 py-3 text-xs text-gray-400 italic">
                  No private channels yet. Create one using the + button above.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
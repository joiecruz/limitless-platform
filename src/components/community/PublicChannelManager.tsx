import { Plus, Settings, Users, Lock, Unlock } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useGlobalRole } from "@/hooks/useGlobalRole";
import { Channel } from "@/types/community";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface PublicChannelManagerProps {
  onChannelCreated?: (channel: Channel) => void;
}

export function PublicChannelManager({ onChannelCreated }: PublicChannelManagerProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const [accessLevel, setAccessLevel] = useState<"all" | "workspace_members" | "admins_only">("all");

  const { canManagePublicChannels, is_superadmin } = useGlobalRole();
  const { toast } = useToast();

  const handleCreateChannel = async () => {
    if (!channelName.trim()) {
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
          name: channelName.trim(),
          description: channelDescription.trim() || null,
          is_public: true,
          workspace_id: null, // Public channels don't belong to specific workspaces
          access_level: accessLevel,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: `Public channel "${channelName}" created successfully`,
      });

      setIsCreateDialogOpen(false);
      setChannelName("");
      setChannelDescription("");
      setAccessLevel("all");

      if (onChannelCreated && data) {
        onChannelCreated(data);
      }
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

  if (!canManagePublicChannels) {
    return null;
  }

  const getAccessLevelBadge = (level: string) => {
    switch (level) {
      case "all":
        return <Badge variant="outline" className="text-green-600"><Unlock className="h-3 w-3 mr-1" />Open to All</Badge>;
      case "workspace_members":
        return <Badge variant="secondary" className="text-blue-600"><Users className="h-3 w-3 mr-1" />Workspace Members</Badge>;
      case "admins_only":
        return <Badge variant="destructive" className="text-red-600"><Lock className="h-3 w-3 mr-1" />Admins Only</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Public Channel Management</h3>
          <p className="text-sm text-gray-600">
            {is_superadmin ? "Superadmin" : "Admin"} controls for public channels
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Public Channel
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Public Channel</DialogTitle>
              <DialogDescription>
                Create a new public channel visible across the platform. Set access restrictions as needed.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="channel-name">Channel Name *</Label>
                <Input
                  id="channel-name"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="e.g. announcements, general, help"
                  maxLength={50}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="channel-description">Description</Label>
                <Textarea
                  id="channel-description"
                  value={channelDescription}
                  onChange={(e) => setChannelDescription(e.target.value)}
                  placeholder="Brief description of the channel purpose..."
                  maxLength={200}
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="access-level">Access Level *</Label>
                <Select value={accessLevel} onValueChange={(value: "all" | "workspace_members" | "admins_only") => setAccessLevel(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Unlock className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="font-medium">Open to All</div>
                          <div className="text-xs text-gray-500">Anyone can read and post</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="workspace_members">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="font-medium">Workspace Members Only</div>
                          <div className="text-xs text-gray-500">Only workspace members can participate</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="admins_only">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-red-600" />
                        <div>
                          <div className="font-medium">Admins Only</div>
                          <div className="text-xs text-gray-500">Only admins and superadmins can participate</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-1">
                  {getAccessLevelBadge(accessLevel)}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateChannel} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Channel"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
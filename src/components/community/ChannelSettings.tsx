import { Settings, Edit, Trash2, Save, X, Lock, Unlock } from "lucide-react";
import { useState, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useWorkspaceRole } from "@/hooks/useWorkspaceRole";
import { useGlobalRole } from "@/hooks/useGlobalRole";
import { WorkspaceContext } from "@/components/layout/DashboardLayout";
import { Channel } from "@/types/community";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface ChannelSettingsProps {
  channel: Channel;
  onChannelUpdate?: (updatedChannel: Channel) => void;
  onChannelDelete?: () => void;
}

export function ChannelSettings({ channel, onChannelUpdate, onChannelDelete }: ChannelSettingsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editName, setEditName] = useState(channel.name);
  const [editDescription, setEditDescription] = useState(channel.description || "");
  const [editReadOnly, setEditReadOnly] = useState(channel.read_only || false);

  const { currentWorkspace } = useContext(WorkspaceContext);
  const { data: userRole } = useWorkspaceRole(currentWorkspace?.id || "");
  const { canManagePublicChannels } = useGlobalRole();
  const { toast } = useToast();

  // Determine if user can manage this channel
  const canManageChannels = channel.is_public
    ? canManagePublicChannels  // Global admins for public channels
    : (userRole === 'admin' || userRole === 'owner'); // Workspace admins/owners for private channels

  const handleEditChannel = async () => {
    if (!editName.trim()) {
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
        .update({
          name: editName.trim(),
          description: editDescription.trim() || null,
          read_only: editReadOnly,
          updated_at: new Date().toISOString()
        })
        .eq('id', channel.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Channel updated successfully",
      });

      setIsEditDialogOpen(false);
      if (onChannelUpdate && data) {
        onChannelUpdate(data);
      }
    } catch (error) {
      console.error('Error updating channel:', error);
      toast({
        title: "Error",
        description: "Failed to update channel",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChannel = async () => {
    setIsLoading(true);
    try {
      // First delete all messages in the channel
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .eq('channel_id', channel.id);

      if (messagesError) throw messagesError;

      // Then delete the channel
      const { error: channelError } = await supabase
        .from('channels')
        .delete()
        .eq('id', channel.id);

      if (channelError) throw channelError;

      toast({
        title: "Success",
        description: "Channel deleted successfully",
      });

      setIsDeleteDialogOpen(false);
      if (onChannelDelete) {
        onChannelDelete();
      }
    } catch (error) {
      console.error('Error deleting channel:', error);
      toast({
        title: "Error",
        description: "Failed to delete channel",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = () => {
    setEditName(channel.name);
    setEditDescription(channel.description || "");
    setEditReadOnly(channel.read_only || false);
    setIsEditDialogOpen(true);
  };

  if (!canManageChannels) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={openEditDialog}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Channel
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Channel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Channel</DialogTitle>
            <DialogDescription>
              Update the channel name, description, and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Channel Name *</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={50}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Brief description of the channel purpose..."
                maxLength={200}
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="edit-read-only-toggle">Read-only Channel</Label>
                <div className="text-xs text-gray-500">
                  Only {channel.is_public ? "admins and superadmins" : "workspace admins and owners"} can post messages
                </div>
              </div>
              <div className="flex items-center gap-2">
                {editReadOnly ? (
                  <Lock className="h-4 w-4 text-orange-600" />
                ) : (
                  <Unlock className="h-4 w-4 text-green-600" />
                )}
                <Switch
                  id="edit-read-only-toggle"
                  checked={editReadOnly}
                  onCheckedChange={setEditReadOnly}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleEditChannel} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the channel
              and all its messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteChannel}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Deleting..." : "Delete Channel"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
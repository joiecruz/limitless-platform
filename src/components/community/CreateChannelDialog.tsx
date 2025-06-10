import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorkspaceRole } from "@/hooks/useWorkspaceRole";

interface CreateChannelDialogProps {
  onCreateChannel: (name: string, workspaceId: string) => void;
  workspaceId: string;
}

export function CreateChannelDialog({ onCreateChannel, workspaceId }: CreateChannelDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [channelName, setChannelName] = useState("");
  const { toast } = useToast();
  const { data: userRole } = useWorkspaceRole(workspaceId);

  const canCreatePrivateChannel = userRole === 'admin' || userRole === 'owner';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a channel name",
        variant: "destructive",
      });
      return;
    }

    onCreateChannel(channelName, workspaceId);
    setChannelName("");
    setIsOpen(false);
  };

  const handleClick = () => {
    if (!canCreatePrivateChannel) {
      toast({
        title: "Access Denied",
        description: "Only admins and owners can create private channels",
        variant: "destructive",
      });
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 hover:bg-primary-50 hover:text-primary-600"
        title="Create Private Channel"
        onClick={handleClick}
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Private Channel</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="channelName">Channel Name</Label>
              <Input
                id="channelName"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="Enter channel name"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Create Channel</Button>
          </div>
          </form>
        </DialogContent>
    </Dialog>
    </>
  );
}